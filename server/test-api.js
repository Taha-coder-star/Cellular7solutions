/**
 * Manual API smoke-test. No test framework — just axios + Node.
 *
 * Run:
 *   node test-api.js
 *
 * To also run admin-protected category tests, supply a token for an admin
 * account via the ADMIN_TOKEN env var:
 *   $env:ADMIN_TOKEN="eyJ..."  ; node test-api.js   (PowerShell)
 *   ADMIN_TOKEN="eyJ..." node test-api.js            (bash)
 *
 * How to get an admin token:
 *   1. Register a second user with this script (it prints the userId).
 *   2. Open MongoDB Compass, find that user in the Users collection,
 *      and change its `role` field from "customer" to "admin".
 *   3. Login again manually (POST /api/auth/login) to get a fresh token,
 *      then paste it into ADMIN_TOKEN above.
 */

'use strict';

const axios = require('axios');

const BASE = 'http://localhost:5000';

let passed = 0;
let failed = 0;

// ── helpers ──────────────────────────────────────────────────────────────────

function pass(label, detail = '') {
  passed++;
  console.log(`✅  ${label}${detail ? '  →  ' + detail : ''}`);
}

function fail(label, detail = '') {
  failed++;
  console.log(`❌  ${label}${detail ? '  →  ' + detail : ''}`);
}

function section(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 50 - title.length))}`);
}

async function request(method, path, { body, token } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const url = `${BASE}${path}`;
  const response = await axios({ method, url, data: body, headers, validateStatus: () => true });
  return response;
}

// ── test cases ────────────────────────────────────────────────────────────────

async function run() {
  console.log('='.repeat(55));
  console.log('  Cellular Solutions — API smoke-test');
  console.log(`  ${new Date().toLocaleString()}`);
  console.log('='.repeat(55));

  // fresh credentials per run so re-runs never collide
  const stamp = Date.now();
  const testEmail = `test_${stamp}@example.com`;
  const testPassword = 'Test1234!';
  const testName = 'Test User';

  let userToken = null;
  let userId = null;

  // ── 1. Register ─────────────────────────────────────────────────────────────
  section('1. Register new user');
  {
    const res = await request('post', '/api/auth/register', {
      body: { name: testName, email: testEmail, password: testPassword },
    });

    if (res.status === 201 && res.data.token) {
      userToken = res.data.token;
      userId = res.data._id;
      pass('POST /api/auth/register', `status ${res.status}, user ${res.data.email}`);
    } else {
      fail('POST /api/auth/register', `status ${res.status} — ${JSON.stringify(res.data)}`);
    }
  }

  // ── 2. Login ─────────────────────────────────────────────────────────────────
  section('2. Login');
  {
    const res = await request('post', '/api/auth/login', {
      body: { email: testEmail, password: testPassword },
    });

    if (res.status === 200 && res.data.token) {
      userToken = res.data.token; // use the login token from here on
      pass('POST /api/auth/login', `status ${res.status}, role: ${res.data.role}`);
    } else {
      fail('POST /api/auth/login', `status ${res.status} — ${JSON.stringify(res.data)}`);
    }
  }

  // ── 3. GET /me ───────────────────────────────────────────────────────────────
  section('3. GET /api/auth/me (protected)');
  {
    if (!userToken) {
      fail('GET /api/auth/me', 'skipped — no token from login');
    } else {
      const res = await request('get', '/api/auth/me', { token: userToken });

      if (res.status === 200 && res.data.email === testEmail) {
        pass('GET /api/auth/me', `email matches (${res.data.email}), role: ${res.data.role}`);
      } else if (res.status === 200 && res.data.email !== testEmail) {
        fail('GET /api/auth/me', `wrong email — got ${res.data.email}, expected ${testEmail}`);
      } else {
        fail('GET /api/auth/me', `status ${res.status} — ${JSON.stringify(res.data)}`);
      }
    }
  }

  // ── 4. GET /api/categories (public) ──────────────────────────────────────────
  section('4. GET /api/categories (public)');
  {
    const res = await request('get', '/api/categories');

    if (res.status === 200 && Array.isArray(res.data)) {
      pass('GET /api/categories', `status ${res.status}, ${res.data.length} categories`);
    } else {
      fail('GET /api/categories', `status ${res.status} — ${JSON.stringify(res.data)}`);
    }
  }

  // ── 5. Register second user (future admin candidate) ─────────────────────────
  section('5. Register second user (admin candidate)');
  {
    const adminEmail = `admin_${stamp}@example.com`;
    const res = await request('post', '/api/auth/register', {
      body: { name: 'Admin Candidate', email: adminEmail, password: testPassword },
    });

    if (res.status === 201 && res.data._id) {
      pass('POST /api/auth/register (2nd user)', `userId: ${res.data._id}, email: ${adminEmail}`);
      console.log('');
      console.log('  ⚠️  MANUAL STEP REQUIRED to run admin tests:');
      console.log(`     1. Open MongoDB Compass → Users collection`);
      console.log(`     2. Find _id: ${res.data._id}`);
      console.log(`        (email: ${adminEmail})`);
      console.log(`     3. Change role from "customer"  →  "admin"  and save`);
      console.log(`     4. Login as that user (POST /api/auth/login) and copy the token`);
      console.log(`     5. Re-run:  $env:ADMIN_TOKEN="<token>" ; node test-api.js`);
    } else {
      fail('POST /api/auth/register (2nd user)', `status ${res.status} — ${JSON.stringify(res.data)}`);
    }
  }

  // ── 6. Admin-only category CRUD ───────────────────────────────────────────────
  const adminToken = process.env.ADMIN_TOKEN;

  section('6. Admin category CRUD');

  if (!adminToken) {
    console.log('  ⏭️  Skipped — ADMIN_TOKEN not set (see instructions above).');
  } else {
    let createdId = null;
    const catName = `Test Category ${stamp}`;

    // POST /api/categories
    {
      const res = await request('post', '/api/categories', {
        body: { name: catName },
        token: adminToken,
      });

      if (res.status === 201 && res.data._id) {
        createdId = res.data._id;
        pass('POST /api/categories', `status ${res.status}, id: ${createdId}, name: "${res.data.name}"`);
      } else {
        fail('POST /api/categories', `status ${res.status} — ${JSON.stringify(res.data)}`);
      }
    }

    if (!createdId) {
      console.log('  ⏭️  Skipping GET/PUT/DELETE — category creation failed.');
    } else {
      // GET /api/categories/:id
      {
        const res = await request('get', `/api/categories/${createdId}`);

        if (res.status === 200 && res.data._id === createdId) {
          pass(`GET /api/categories/${createdId}`, `status ${res.status}, name: "${res.data.name}"`);
        } else {
          fail(`GET /api/categories/${createdId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }

      // PUT /api/categories/:id
      {
        const updatedName = `${catName} (edited)`;
        const res = await request('put', `/api/categories/${createdId}`, {
          body: { name: updatedName },
          token: adminToken,
        });

        if (res.status === 200 && res.data.name === updatedName) {
          pass(`PUT /api/categories/${createdId}`, `status ${res.status}, name updated to "${res.data.name}"`);
        } else {
          fail(`PUT /api/categories/${createdId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }

      // DELETE /api/categories/:id
      {
        const res = await request('delete', `/api/categories/${createdId}`, { token: adminToken });

        if (res.status === 200 || res.status === 204) {
          pass(`DELETE /api/categories/${createdId}`, `status ${res.status}`);
        } else {
          fail(`DELETE /api/categories/${createdId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }
    }
  }

  // ── 7. GET /api/brands (public) ──────────────────────────────────────────────
  section('7. GET /api/brands (public)');
  {
    const res = await request('get', '/api/brands');

    if (res.status === 200 && Array.isArray(res.data)) {
      pass('GET /api/brands', `status ${res.status}, ${res.data.length} brands`);
    } else {
      fail('GET /api/brands', `status ${res.status} — ${JSON.stringify(res.data)}`);
    }
  }

  // ── 8. Admin brand CRUD ───────────────────────────────────────────────────────
  section('8. Admin brand CRUD');

  if (!adminToken) {
    console.log('  ⏭️  Skipped — ADMIN_TOKEN not set (see instructions above).');
  } else {
    let brandId = null;
    const brandName = `Test Brand ${stamp}`;

    // POST /api/brands
    {
      const res = await request('post', '/api/brands', {
        body: { name: brandName },
        token: adminToken,
      });

      if (res.status === 201 && res.data._id) {
        brandId = res.data._id;
        pass('POST /api/brands', `status ${res.status}, id: ${brandId}, name: "${res.data.name}"`);
      } else {
        fail('POST /api/brands', `status ${res.status} — ${JSON.stringify(res.data)}`);
      }
    }

    if (!brandId) {
      console.log('  ⏭️  Skipping GET/PUT/DELETE — brand creation failed.');
    } else {
      // GET /api/brands/:id
      {
        const res = await request('get', `/api/brands/${brandId}`);

        if (res.status === 200 && res.data._id === brandId) {
          pass(`GET /api/brands/${brandId}`, `status ${res.status}, name: "${res.data.name}"`);
        } else {
          fail(`GET /api/brands/${brandId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }

      // PUT /api/brands/:id
      {
        const updatedName = `${brandName} (edited)`;
        const res = await request('put', `/api/brands/${brandId}`, {
          body: { name: updatedName },
          token: adminToken,
        });

        if (res.status === 200 && res.data.name === updatedName) {
          pass(`PUT /api/brands/${brandId}`, `status ${res.status}, name updated to "${res.data.name}"`);
        } else {
          fail(`PUT /api/brands/${brandId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }

      // DELETE /api/brands/:id
      {
        const res = await request('delete', `/api/brands/${brandId}`, { token: adminToken });

        if (res.status === 200 || res.status === 204) {
          pass(`DELETE /api/brands/${brandId}`, `status ${res.status}`);
        } else {
          fail(`DELETE /api/brands/${brandId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }
    }
  }

  // ── 9. Admin product tests ────────────────────────────────────────────────────
  section('9. Admin product tests');

  if (!adminToken) {
    console.log('  ⏭️  Skipped — ADMIN_TOKEN not set (see instructions above).');
  } else {
    let prodCategoryId = null;
    let prodBrandId = null;
    let productId = null;

    // Step 1: create a dedicated category and brand for product testing
    {
      const catRes = await request('post', '/api/categories', {
        body: { name: `Phone Accessories ${stamp}` },
        token: adminToken,
      });
      if (catRes.status === 201 && catRes.data._id) {
        prodCategoryId = catRes.data._id;
        pass('POST /api/categories (product fixture)', `id: ${prodCategoryId}`);
      } else {
        fail('POST /api/categories (product fixture)', `status ${catRes.status} — ${JSON.stringify(catRes.data)}`);
      }

      const brandRes = await request('post', '/api/brands', {
        body: { name: `Anker ${stamp}` },
        token: adminToken,
      });
      if (brandRes.status === 201 && brandRes.data._id) {
        prodBrandId = brandRes.data._id;
        pass('POST /api/brands (product fixture)', `id: ${prodBrandId}`);
      } else {
        fail('POST /api/brands (product fixture)', `status ${brandRes.status} — ${JSON.stringify(brandRes.data)}`);
      }
    }

    if (!prodCategoryId || !prodBrandId) {
      console.log('  ⏭️  Skipping product tests — fixture category or brand creation failed.');
    } else {
      // Step 2: create product — verify 201, _id, and auto-generated slug
      {
        const res = await request('post', '/api/products', {
          body: {
            name: 'Test Charger',
            description: 'A test charger',
            price: 1500,
            category: prodCategoryId,
            brand: prodBrandId,
            condition: 'new',
            stock: 20,
          },
          token: adminToken,
        });

        if (res.status === 201 && res.data._id && res.data.slug) {
          productId = res.data._id;
          pass('POST /api/products', `status ${res.status}, id: ${productId}, slug: "${res.data.slug}"`);
        } else {
          fail('POST /api/products', `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }

      if (!productId) {
        console.log('  ⏭️  Skipping product detail tests — product creation failed.');
      } else {
        // Step 3: GET by id — confirm category and brand are populated objects, not raw ObjectIds
        {
          const res = await request('get', `/api/products/${productId}`);
          const catPopulated = res.data.category && typeof res.data.category === 'object' && res.data.category.name;
          const brandPopulated = res.data.brand && typeof res.data.brand === 'object' && res.data.brand.name;

          if (res.status === 200 && catPopulated && brandPopulated) {
            pass(`GET /api/products/${productId}`, `status ${res.status}, category: "${res.data.category.name}", brand: "${res.data.brand.name}"`);
          } else {
            fail(`GET /api/products/${productId}`, `status ${res.status} — category or brand not populated: ${JSON.stringify(res.data).slice(0, 200)}`);
          }
        }

        // Step 4: GET /api/products — verify response shape and that product appears in results
        {
          const res = await request('get', '/api/products');
          const shapeOk =
            res.data &&
            Array.isArray(res.data.products) &&
            typeof res.data.page === 'number' &&
            typeof res.data.pages === 'number' &&
            typeof res.data.total === 'number';
          const found = shapeOk && res.data.products.some((p) => p._id === productId);

          if (res.status === 200 && shapeOk && found) {
            pass('GET /api/products', `status ${res.status}, total: ${res.data.total}, page: ${res.data.page}/${res.data.pages}, product found`);
          } else {
            fail('GET /api/products', `status ${res.status}, shapeOk: ${shapeOk}, found: ${found}`);
          }
        }

        // Step 5: filter by category
        {
          const res = await request('get', `/api/products?category=${prodCategoryId}`);
          const found = res.status === 200 && Array.isArray(res.data.products) && res.data.products.some((p) => p._id === productId);

          if (found) {
            pass(`GET /api/products?category=${prodCategoryId}`, `status ${res.status}, ${res.data.products.length} result(s), product found`);
          } else {
            fail(`GET /api/products?category=${prodCategoryId}`, `status ${res.status} — product not in results`);
          }
        }

        // Step 6: filter by price range
        {
          const res = await request('get', '/api/products?minPrice=1000&maxPrice=2000');
          const found = res.status === 200 && Array.isArray(res.data.products) && res.data.products.some((p) => p._id === productId);

          if (found) {
            pass('GET /api/products?minPrice=1000&maxPrice=2000', `status ${res.status}, product found in price range`);
          } else {
            fail('GET /api/products?minPrice=1000&maxPrice=2000', `status ${res.status} — product not in results`);
          }
        }

        // Step 7: search by name
        {
          const res = await request('get', '/api/products?search=charger');
          const found = res.status === 200 && Array.isArray(res.data.products) && res.data.products.some((p) => p._id === productId);

          if (found) {
            pass('GET /api/products?search=charger', `status ${res.status}, product found by name search`);
          } else {
            fail('GET /api/products?search=charger', `status ${res.status} — product not in results`);
          }
        }

        // Step 8: partial update — price only
        {
          const res = await request('put', `/api/products/${productId}`, {
            body: { price: 1600 },
            token: adminToken,
          });

          if (res.status === 200 && res.data.price === 1600) {
            pass(`PUT /api/products/${productId}`, `status ${res.status}, price updated to ${res.data.price}`);
          } else {
            fail(`PUT /api/products/${productId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
          }
        }

        // Step 9: delete product
        {
          const res = await request('delete', `/api/products/${productId}`, { token: adminToken });

          if (res.status === 200 || res.status === 204) {
            pass(`DELETE /api/products/${productId}`, `status ${res.status}`);
          } else {
            fail(`DELETE /api/products/${productId}`, `status ${res.status} — ${JSON.stringify(res.data)}`);
          }
        }
      }
    }

    // Step 10: cleanup — always runs if the fixture IDs were created, regardless of earlier failures
    {
      if (prodCategoryId) {
        const res = await request('delete', `/api/categories/${prodCategoryId}`, { token: adminToken });
        if (res.status === 200 || res.status === 204) {
          pass(`DELETE /api/categories/${prodCategoryId} (cleanup)`, `status ${res.status}`);
        } else {
          fail(`DELETE /api/categories/${prodCategoryId} (cleanup)`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }

      if (prodBrandId) {
        const res = await request('delete', `/api/brands/${prodBrandId}`, { token: adminToken });
        if (res.status === 200 || res.status === 204) {
          pass(`DELETE /api/brands/${prodBrandId} (cleanup)`, `status ${res.status}`);
        } else {
          fail(`DELETE /api/brands/${prodBrandId} (cleanup)`, `status ${res.status} — ${JSON.stringify(res.data)}`);
        }
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n' + '='.repeat(55));
  console.log(`  Results: ${passed}/${total} passed`);
  if (failed === 0) {
    console.log('  All tests passed ✅');
  } else {
    console.log(`  ${failed} test(s) failed ❌`);
  }
  console.log('='.repeat(55) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('\n❌  Unexpected error (is the server running on port 5000?)');
  console.error(err.message);
  process.exit(1);
});
