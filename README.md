# 🚀 SCIC/EJP-13 — Backend API

A production-grade REST API for a full e-commerce platform, built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. Handles authentication, product catalog, orders, reviews, and wishlist — fully deployable to the cloud in minutes.

> 🔗 **Live API:** [https://postgresql-test-server.onrender.com](https://postgresql-test-server.onrender.com)
> 🖥️ **Frontend:** [https://postgre-sql-test-client.vercel.app](https://postgre-sql-test-client.vercel.app)
> 📦 **Repo:** [github.com/fahim3101/PostgreSQL-Test-server](https://github.com/fahim3101/PostgreSQL-Test-server)

---

## ✨ Features

- 🔐 **JWT authentication** with role-based access control (Admin / User)
- 🛍️ **Full product catalog** — categories, products with search, filter, pagination
- ⭐ **Review system** — one review per user per product
- 📦 **Order management** — stock validation, automatic deduction, transactional total calculation
- ❤️ **Wishlist** — per-user saved products
- 🗑️ **Soft delete** across all resources (data safety)
- 🛡️ **Input validation** with Zod on every endpoint
- 🚨 **Centralized error handling** with clean JSON responses
- 🌐 **CORS configured** for the live frontend

---

## 🧰 Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Runtime          | Node.js                                   |
| Framework        | Express.js                                |
| Language         | TypeScript                                |
| ORM              | Prisma 5                                  |
| Database         | PostgreSQL (Neon / Supabase / Railway)    |
| Auth             | JWT + bcryptjs                            |
| Validation       | Zod                                       |
| Deployment       | Render.com                                |

---

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma         # Database models, enums, relations
│   └── seed.ts                # Seeds default admin + categories + products
├── src/
│   ├── app.ts                 # Express app (middlewares + routes)
│   ├── server.ts              # Entry point — DB connect + listen
│   ├── config/                # Env config
│   ├── lib/prisma.ts          # Prisma client singleton
│   ├── middlewares/
│   │   ├── auth.ts             # JWT verify + role guard
│   │   ├── validateRequest.ts  # Zod validation
│   │   ├── notFound.ts
│   │   └── globalErrorHandler.ts
│   ├── routes/index.ts        # Aggregates all module routes
│   ├── services/
│   │   ├── auth/              # register, login
│   │   ├── user/              # profile + admin user management
│   │   ├── category/          # CRUD
│   │   ├── product/           # CRUD, filter/search
│   │   ├── review/            # CRUD (one per user per product)
│   │   ├── order/             # place order, stock deduction, status
│   │   └── wishlist/          # add/remove/list
│   └── types/                 # Express type augmentation
├── .env.example
├── package.json
└── tsconfig.json
```

Each module folder follows the same clean pattern: `*.route.ts → *.controller.ts → *.service.ts → *.validation.ts`.

---

## 🗄️ Database Design

**Enums:** `Role` (ADMIN/USER) · `ProductStatus` (ACTIVE/INACTIVE/OUT_OF_STOCK) · `OrderStatus` (PENDING/PROCESSING/COMPLETED/CANCELLED)

**Models:** `User`, `Category`, `Product`, `Review`, `Order`, `OrderItem`, `Wishlist`

All models include `isDeleted` soft-delete flag plus `createdAt` / `updatedAt` timestamps. `Product` has indexes on `categoryId` and `status`; `Order` has indexes on `userId` and `status`.

**Relations**

- `User` 1—N `Review` / `Order` / `Wishlist`
- `Category` 1—N `Product`
- `Product` 1—N `Review` / `OrderItem` / `Wishlist`
- `Order` 1—N `OrderItem`

---

## 🚀 Quick Start — Local Development

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Get a free PostgreSQL database
Pick one — Neon is the fastest to set up:

| Provider  | Link         | How                                                                                   |
| --------- | ------------ | ------------------------------------------------------------------------------------- |
| **Neon**  | neon.tech    | New Project → copy connection string (already includes `?sslmode=require`)            |
| **Supabase** | supabase.com | New Project → Settings → Database → Connection string (URI, "Transaction" pooler)     |
| **Railway** | railway.app | New Project → Add PostgreSQL → copy `DATABASE_URL` from Variables tab                 |

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and set your real `DATABASE_URL` plus a strong random `JWT_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Generate Prisma Client & run migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed default admin + sample data
```bash
npx prisma db seed
```
Creates:
- 👤 Admin → `admin@scic.com` / `Admin123!` (ADMIN role)
- 🏷️ 5 categories (Electronics, Fashion, Books, Home & Kitchen, Sports & Outdoors)
- 📦 20 sample products

> ⚠️ **Change the admin password immediately after first login in production.**

### 6. Start the dev server
```bash
npm run dev
```
Server runs at **http://localhost:5000**. Test:
```bash
curl http://localhost:5000/
```

### 7. (Optional) Browse data visually
```bash
npx prisma studio
```

---

## ☁️ Deployment (Render.com)

This backend is deployed on **Render** using the free tier.

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

**Start Command:**
```bash
npm start
```

**Required Environment Variables:**

| Variable             | Description                                       |
| -------------------- | ------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string (with `?sslmode=require`) |
| `JWT_SECRET`         | Strong random secret (`openssl rand -base64 32`)  |
| `JWT_EXPIRES_IN`     | Token lifetime, e.g. `7d`                         |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost, e.g. `12`                            |
| `NODE_ENV`           | `production`                                      |
| `PORT`               | `10000` (auto-set by Render)                      |

---

## 📚 API Documentation

**Base URL:** `/api`
**Live Base URL:** `https://postgresql-test-server.onrender.com/api`

All responses follow:
```json
{ "success": true, "message": "...", "data": { } }
```

Protected routes require header: `Authorization: Bearer <token>`

### 🔑 Auth — `/api/auth`
| Method | Endpoint     | Auth   | Description                              | Body                                          |
| ------ | ------------ | ------ | ---------------------------------------- | --------------------------------------------- |
| POST   | `/register`  | Public | Register a new user                      | `{ name, email, password, phone?, address? }` |
| POST   | `/login`     | Public | Login → returns JWT                      | `{ email, password }`                         |

### 👥 Users — `/api/users`
| Method | Endpoint        | Auth       | Description                                   |
| ------ | --------------- | ---------- | --------------------------------------------- |
| GET    | `/me`           | User/Admin | Get own profile                               |
| GET    | `/`             | Admin      | List all users (`?search=&page=&limit=`)      |
| GET    | `/:id`          | User/Admin | Get user by ID                                |
| PATCH  | `/:id`          | User/Admin | Update name/phone/address                     |
| PATCH  | `/:id/role`     | Admin      | Change role — `{ role: "ADMIN" \| "USER" }`   |
| DELETE | `/:id`          | Admin      | Soft delete user                              |

### 🏷️ Categories — `/api/categories`
| Method | Endpoint | Auth   | Description                              |
| ------ | -------- | ------ | ---------------------------------------- |
| POST   | `/`      | Admin  | Create — `{ name, description? }`        |
| GET    | `/`      | Public | List (`?search=&page=&limit=`)           |
| GET    | `/:id`   | Public | Get by ID                                |
| PATCH  | `/:id`   | Admin  | Update                                   |
| DELETE | `/:id`   | Admin  | Soft delete                              |

### 📦 Products — `/api/products`
| Method | Endpoint | Auth   | Description                                                                       |
| ------ | -------- | ------ | --------------------------------------------------------------------------------- |
| POST   | `/`      | Admin  | Create — `{ title, description, price, stock?, images?, categoryId, status? }`    |
| GET    | `/`      | Public | List (`?search=&categoryId=&status=&minPrice=&maxPrice=&page=&limit=`)            |
| GET    | `/:id`   | Public | Get by ID (includes category + reviews)                                           |
| PATCH  | `/:id`   | Admin  | Update                                                                            |
| DELETE | `/:id`   | Admin  | Soft delete                                                                       |

### ⭐ Reviews — `/api/reviews`
| Method | Endpoint | Auth        | Description                                                       |
| ------ | -------- | ----------- | ----------------------------------------------------------------- |
| POST   | `/`      | User/Admin  | Create — `{ productId, rating (1-5), comment? }` — one per user   |
| GET    | `/`      | Public      | List (`?productId=&page=&limit=`)                                |
| GET    | `/:id`   | Public      | Get by ID                                                        |
| PATCH  | `/:id`   | Owner       | Update own review                                                |
| DELETE | `/:id`   | Owner/Admin | Soft delete                                                      |

### 🛒 Orders — `/api/orders`
| Method | Endpoint        | Auth        | Description                                                                                          |
| ------ | --------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| POST   | `/`             | User/Admin  | Place order — `{ shippingAddress?, items: [{ productId, quantity }] }` — validates stock, transactional |
| GET    | `/`             | User/Admin  | List — users see own, admins see all (`?status=&page=&limit=`)                                      |
| GET    | `/:id`          | Owner/Admin | Get by ID                                                                                            |
| PATCH  | `/:id/status`   | Admin       | Update status — `{ status: "PENDING"\|"PROCESSING"\|"COMPLETED"\|"CANCELLED" }`                      |
| DELETE | `/:id`          | Owner/Admin | Soft delete / cancel                                                                                 |

### ❤️ Wishlist — `/api/wishlist`
| Method | Endpoint | Auth       | Description                       |
| ------ | -------- | ---------- | --------------------------------- |
| POST   | `/`      | User/Admin | Add product — `{ productId }`     |
| GET    | `/`      | User/Admin | Get own wishlist                  |
| DELETE | `/:id`   | User/Admin | Remove item (soft delete)         |

### 🔢 HTTP Status Codes

| Code | Meaning                                                              |
| ---- | -------------------------------------------------------------------- |
| 200  | OK                                                                   |
| 201  | Created                                                              |
| 400  | Validation / bad request                                             |
| 401  | Unauthorized (missing / invalid token)                               |
| 403  | Forbidden (wrong role / not owner)                                   |
| 404  | Not found                                                            |
| 409  | Conflict (duplicate)                                                 |
| 500  | Server error                                                         |

---

## 🔗 Frontend Integration

1. Store the JWT from `/api/auth/login` (or `/register`) — localStorage or an httpOnly cookie via your own proxy.
2. Attach `Authorization: Bearer <token>` on every protected request.
3. CORS is already open — for production lock it down:
   ```ts
   cors({ origin: "https://postgre-sql-test-client.vercel.app", credentials: true })
   ```
4. Set the API base URL via env var (e.g. `VITE_API_URL=https://postgresql-test-server.onrender.com/api`).
5. Handle the `{ success, message, data }` response shape consistently.
6. On `401`, redirect to login and clear the stored token.

The companion frontend lives here → [github.com/fahim3101/PostgreSQL-Test-client](https://github.com/fahim3101/PostgreSQL-Test-client) and is live at [postgre-sql-test-client.vercel.app](https://postgre-sql-test-client.vercel.app).

---

## 🧪 Scripts

| Command              | Purpose                            |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start dev server with hot reload   |
| `npm run build`      | Compile TypeScript → `dist/`       |
| `npm start`          | Run compiled production server     |
| `npm run prisma:generate` | Generate Prisma client        |
| `npm run prisma:migrate`  | Run dev migrations           |
| `npm run prisma:deploy`   | Apply migrations in prod    |
| `npm run prisma:studio`   | Open Prisma Studio (GUI)    |
| `npm run seed`       | Seed admin + sample data           |

---

## 📝 License

MIT — free for personal and commercial use.

---

## 👤 Author

**fahim3101** · [GitHub](https://github.com/fahim3101)

> ⭐ If this project helped you, consider giving the repo a star!