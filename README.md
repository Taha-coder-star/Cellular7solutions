# Cellular Solutions — E-Commerce Platform

A full-stack MERN application for a mobile phone accessories and electronics retailer: product catalog, guest checkout, repair booking, buy/sell trade-in requests, product reviews, and an admin dashboard. There are no customer accounts — the storefront is fully guest, and there is exactly one admin account.

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js + Express
- MongoDB Atlas (Mongoose)
- JWT (admin-only auth)
- Cloudinary (image storage)

**Deployment**
- Vercel (frontend)
- Render (backend)

---

## Features

### Storefront (guest, no account required)
- Browse products by category, brand, condition, and price range
- Search with in-nav suggestions
- Product detail pages with multiple images, reviews
- Checkout with name/email/phone/address per order — no signup
- Submit buy/sell (trade-in) requests
- Book a repair
- Leave a product review

### Admin (single account)
- Dashboard with sales/order stats
- Product management (CRUD + image upload)
- Category and brand management
- Order management with status updates
- Repair and buy/sell request management
- Review moderation (delete)

---

## Project Structure

```
cellular-solutions/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── assets/
│       ├── components/         # Reusable UI components
│       ├── context/            # AuthContext (admin session only)
│       ├── hooks/              # Custom React hooks
│       ├── layouts/            # MainLayout, AdminLayout
│       ├── pages/              # One component per route
│       ├── services/           # Axios API service layer
│       └── utils/              # Helpers, formatters
│
├── server/                     # Express backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary config
│   ├── controllers/            # Route handler logic
│   ├── middleware/
│   │   ├── requireAdmin.js     # JWT verify + admin role check
│   │   ├── uploadMiddleware.js # Multer + Cloudinary
│   │   ├── rateLimit.js        # Rate limits on public forms + admin login
│   │   └── honeypot.js         # Bot-trap field on public forms
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── utils/
│   │   └── generateToken.js    # JWT signing
│   ├── seed-admin.js            # One-time admin account creation (run manually)
│   ├── seed.js                  # Product catalog seed
│   └── server.js                 # Entry point
│
├── project.md                  # Original client project specification
├── PRODUCT.md                  # Product/positioning/brand register
├── DESIGN.md                   # Design tokens (color, type, elevation)
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd cellular-solutions
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

You should see:
```
MongoDB connected: <host>
Indexes synced
Server running on port 5000
```

### 3. Create the admin account (one time, manual)
```bash
node seed-admin.js "Your Name" you@example.com yourStrongPassword
```
There is no public sign-up route by design — this script is the only way to create an admin.

### 4. Frontend setup
```bash
cd ../client
npm install
cp .env.example .env   # then set VITE_API_URL if not using localhost:5000
npm run dev
```

Frontend runs at `http://localhost:5173`. Admin panel is at `/admin/login`.

---

## Environment Variables

### Backend (`server/.env`) — see `server/.env.example`

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing admin JWTs |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend origin, restricts CORS in production (optional — allows all origins if unset) |

### Frontend (`client/.env`) — see `client/.env.example`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## API Reference

### Admin auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/admin/login` | Public (rate-limited) | Admin login |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List/search products (filterable, paginated) |
| GET | `/api/products/:id` | Public | Get product by ID |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id/images` | Admin | Remove a product image |
| DELETE | `/api/products/:id` | Admin | Delete product |

**Query params:** `?search=`, `?category=<id>`, `?brand=<id>`, `?condition=new\|used`, `?minPrice=&maxPrice=`, `?page=&limit=`

### Categories / Brands
Standard public GET, admin-only POST/PUT/DELETE under `/api/categories` and `/api/brands`.

### Orders (guest checkout)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Public (rate-limited) | Place order — requires `shippingAddress: {fullName, email, phone, address, city}` |
| GET | `/api/orders` | Admin | List all orders |
| GET | `/api/orders/:id` | Public | Get order by ID (order ID itself is the access token, like a guest checkout confirmation link) |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| PUT | `/api/orders/:id/pay` | Admin | Mark order as paid |

### Repairs / Buy & Sell (guest submissions)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/repairs`, `/api/buysell` | Public (rate-limited + honeypot) | Submit a request |
| GET | `/api/repairs`, `/api/buysell` | Admin | List requests |
| PUT | `/api/repairs/:id`, `/api/buysell/:id/status` | Admin | Update status |
| DELETE | `/api/repairs/:id`, `/api/buysell/:id` | Admin | Delete request |

### Reviews (open, no purchase verification)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reviews` | Public (rate-limited + honeypot) | Submit a review — `name, email, product, rating, comment` |
| GET | `/api/reviews/product/:productId` | Public | List reviews for a product |
| DELETE | `/api/reviews/:id` | Admin | Delete a review |

---

## Deployment

### Backend (Render)
1. Push code to GitHub
2. New Web Service → root directory `server`
3. Build command: `npm install` · Start command: `npm start`
4. Add all environment variables from `server/.env.example`
5. Once you have the frontend's URL, set `CLIENT_URL` to it and redeploy

### Frontend (Vercel)
1. Import project on Vercel → root directory `client`
2. Add `VITE_API_URL` pointing at your Render backend, e.g. `https://your-app.onrender.com/api`
3. Deploy

### Before going live
- [ ] Run `node seed-admin.js` with real, strong credentials — do not ship default/test creds
- [ ] Set `NODE_ENV=production` on Render (enables HTTPS redirect + HSTS)
- [ ] Set `CLIENT_URL` on Render once the frontend domain is known
- [ ] Confirm the production domain with the client
- [ ] Restrict MongoDB Atlas Network Access as appropriate for your hosting setup

---

## Notes

- **DNS resolution**: `server.js` pins DNS to `1.1.1.1`/`8.8.8.8` and forces IPv4-first resolution before connecting to MongoDB Atlas. This is required on the original dev network to resolve `mongodb+srv://` SRV records reliably — do not remove it without testing on your own network first.
- **No test runner configured.** `npm test` in `server/` is a stub.

---

## Client Information

**Business**: Cellular Solutions
**Domain**: Cellularsolution7.com (confirm before deployment)

---

## Developer

Built by Taha Ahmed (23K-0534)
FAST-NUCES Karachi
