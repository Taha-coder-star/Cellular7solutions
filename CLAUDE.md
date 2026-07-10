# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cellular Solutions — a full-stack e-commerce/management system for a phone/accessories business. Currently backend-only; frontend not yet scaffolded.

## Commands

All commands run from inside `server/`:

```bash
npm run dev      # start with nodemon (auto-restart on save)
npm start        # start without auto-restart
```

No test runner is configured yet.

## Environment

`server/.env` is required. Expected keys:

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=development
```

`dotenv` is loaded with `{ override: true }` so `.env` values always win over shell-injected vars.

## Architecture

```
server/
  server.js               # entry point — loads env, sets DNS, mounts routes, starts after DB connects
  config/db.js            # mongoose.connect(); process.exit(1) on failure
  models/                 # Mongoose schemas
  controllers/            # business logic (async/await, try/catch → JSON errors)
  routes/                 # express.Router() — thin, only wires controllers + middleware
  middleware/             # Express middleware functions
  utils/                  # pure helpers (no Express, no DB)
```

**Pattern:** routes → middleware → controllers → models. Controllers own all DB calls and response shaping. Middleware only gates or decorates `req`.

## Auth

- JWT payload: `{ id, role }`, signed with `JWT_SECRET`, expires in 7 days.
- `protect` middleware (`middleware/authMiddleware.js`) reads `Authorization: Bearer <token>`, verifies with `jwt.verify`, and attaches the decoded payload to `req.user`.
- Password hashing is handled entirely by the `User` pre-save hook — controllers never call bcrypt directly; they use `user.comparePassword(candidate)`.
- Both "user not found" and "wrong password" return the same `401 Invalid credentials` to prevent email enumeration.

## DNS

`server.js` sets DNS servers to `1.1.1.1` / `8.8.8.8` and forces IPv4-first resolution before connecting to MongoDB Atlas. This is required on this network to resolve `mongodb+srv://` SRV records reliably. Do not remove it.

## Conventions

- CommonJS throughout (`require`/`module.exports`). Do not use `import`/`export`.
- Roles are an enum: `'customer'` | `'admin'`. Default is `'customer'`.
- New route groups follow the same pattern: add a `routes/xRoutes.js`, a `controllers/xController.js`, and mount under `/api/x` in `server.js`.

## Design Context

Frontend design decisions are governed by `PRODUCT.md` (register, users, positioning, brand personality) and `DESIGN.md` (color, typography, elevation, component tokens) at the project root. Brand register: storefront-led ecommerce, Apple-inspired minimalism, graphite-dominant palette with cobalt blue reserved strictly for repair/service actions. Read both before making UI/UX changes.
