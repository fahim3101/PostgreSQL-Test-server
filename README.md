thunder# SCIC/EJP-13 Backend

Production-ready REST API built with **Express.js + TypeScript + Prisma ORM + PostgreSQL**.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Neon / Supabase / Railway) |
| Auth | JWT + bcryptjs |
| Validation | Zod |

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma       # Database models, enums, relations
│   └── seed.ts              # Creates a default admin user
├── src/
│   ├── app.ts                # Express app (middlewares + routes)
│   ├── server.ts             # Entry point, DB connect + listen
│   ├── config/                # Env config
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middlewares/
│   │   ├── auth.ts             # JWT verify + role guard
│   │   ├── validateRequest.ts  # Zod validation middleware
│   │   ├── notFound.ts
│   │   └── globalErrorHandler.ts
│   ├── routes/
│   │   └── index.ts            # Combines all module routes
│   ├── services/
│   │   ├── auth/       (register, login)
│   │   ├── user/       (profile, admin user management)
│   │   ├── category/   (CRUD)
│   │   ├── product/    (CRUD, filter/search)
│   │   ├── review/     (CRUD, one review per user per product)
│   │   ├── order/      (place order, stock deduction, status)
│   │   └── wishlist/   (add/remove/list)
│   └── types/           # Express type augmentation
├── .env.example
├── package.json
└── tsconfig.json
```

Each module folder follows the same pattern: `*.route.ts → *.controller.ts → *.service.ts → *.validation.ts`.

## Database Design

**Enums:** `Role` (ADMIN/USER), `ProductStatus` (ACTIVE/INACTIVE/OUT_OF_STOCK), `OrderStatus` (PENDING/PROCESSING/COMPLETED/CANCELLED)

**Models:** User, Category, Product, Review, Order, OrderItem, Wishlist — all with `isDeleted` soft-delete, `createdAt`/`updatedAt` timestamps, and `@@map()` table names. Product has indexes on `categoryId` and `status`; Order has indexes on `userId` and `status`.

Relations: User 1—N Review/Order/Wishlist · Category 1—N Product · Product 1—N Review/OrderItem/Wishlist · Order 1—N OrderItem.

---

## 1. Local Setup — Step by Step

### Step 1 — Install dependencies
```bash
cd server
npm install
```

### Step 2 — Get a free PostgreSQL database
Pick one (Neon is fastest to set up):
- **Neon** → neon.tech → New Project → copy the connection string (already includes `?sslmode=require`)
- **Supabase** → supabase.com → New Project → Settings → Database → Connection string (URI, use the "Transaction" pooler string for `DATABASE_URL`)
- **Railway** → railway.app → New Project → Add PostgreSQL → copy `DATABASE_URL` from Variables tab

### Step 3 — Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and paste your real `DATABASE_URL`, plus set a strong random `JWT_SECRET` (e.g. run `openssl rand -base64 32`).

### Step 4 — Generate Prisma Client & run migration
```bash
npx prisma generate
npx prisma migrate dev --name init
```
This creates all tables in your database.

### Step 5 — Seed an admin account
```bash
npx prisma db seed
```
Creates `admin@scic.com` / `Admin123!` (ADMIN role) — **change this password immediately after first login in production**, since the promote-to-admin endpoint requires an existing admin.

### Step 6 — Run the dev server
```bash
npm run dev
```
Server runs at `http://localhost:5000`. Test it: `GET http://localhost:5000/` should return a success message.

### Step 7 — (Optional) Browse your data visually
```bash
npx prisma studio
```

---

## 2. Deploying the Backend (so you have a Live Backend API URL)

**Recommended: Render.com (free tier, simplest for this stack)**

1. Push this `server/` folder to a GitHub repo.
2. On render.com → New → Web Service → connect your repo.
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
4. Start command: `npm start`
5. Add environment variables in the Render dashboard: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`, `NODE_ENV=production`.
6. Deploy. Render gives you a live URL like `https://your-app.onrender.com`.

**Alternative:** Railway.app (also runs Postgres + backend in one project) or Vercel (serverless — needs minor adapter changes for Express, so Render/Railway is simpler for this project).

---

## 3. API Documentation

Base URL: `/api` · All responses follow:
```json
{ "success": true, "message": "...", "data": {} }
```
Protected routes require header: `Authorization: Bearer <token>`

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description | Body |
|---|---|---|---|---|
| POST | `/register` | Public | Register a new user | `{ name, email, password, phone?, address? }` |
| POST | `/login` | Public | Login, returns JWT | `{ email, password }` |

### Users — `/api/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me` | User/Admin | Get own profile |
| GET | `/` | Admin | List all users (`?search=&page=&limit=`) |
| GET | `/:id` | User/Admin | Get user by ID |
| PATCH | `/:id` | User/Admin | Update name/phone/address |
| PATCH | `/:id/role` | Admin | Change a user's role — `{ role: "ADMIN" \| "USER" }` |
| DELETE | `/:id` | Admin | Soft delete user |

### Categories — `/api/categories`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin | Create — `{ name, description? }` |
| GET | `/` | Public | List (`?search=&page=&limit=`) |
| GET | `/:id` | Public | Get by ID |
| PATCH | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Soft delete |

### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin | Create — `{ title, description, price, stock?, images?, categoryId, status? }` |
| GET | `/` | Public | List (`?search=&categoryId=&status=&minPrice=&maxPrice=&page=&limit=`) |
| GET | `/:id` | Public | Get by ID (includes category + reviews) |
| PATCH | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Soft delete |

### Reviews — `/api/reviews`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | User/Admin | Create — `{ productId, rating (1-5), comment? }` — one review per user per product |
| GET | `/` | Public | List (`?productId=&page=&limit=`) |
| GET | `/:id` | Public | Get by ID |
| PATCH | `/:id` | Owner | Update own review |
| DELETE | `/:id` | Owner/Admin | Soft delete |

### Orders — `/api/orders`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | User/Admin | Place order — `{ shippingAddress?, items: [{ productId, quantity }] }`. Validates stock, decrements it, computes total in a DB transaction. |
| GET | `/` | User/Admin | List — users see own orders, admins see all (`?status=&page=&limit=`) |
| GET | `/:id` | Owner/Admin | Get by ID |
| PATCH | `/:id/status` | Admin | Update status — `{ status: "PENDING"\|"PROCESSING"\|"COMPLETED"\|"CANCELLED" }` |
| DELETE | `/:id` | Owner/Admin | Soft delete/cancel |

### Wishlist — `/api/wishlist`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | User/Admin | Add product — `{ productId }` |
| GET | `/` | User/Admin | Get own wishlist |
| DELETE | `/:id` | User/Admin | Remove item (soft delete) |

### Common status codes
`200` OK · `201` Created · `400` Validation/bad request · `401` Unauthorized (missing/invalid token) · `403` Forbidden (wrong role/not owner) · `404` Not found · `409` Conflict (duplicate) · `500` Server error

---

## 4. Frontend Integration Checklist

1. Store the JWT returned from `/api/auth/login` or `/api/auth/register` (localStorage or an httpOnly cookie via your own proxy).
2. Attach it as `Authorization: Bearer <token>` on every protected request.
3. Set `CORS` origin on the backend (`app.use(cors())` currently allows all origins — for production, restrict it: `cors({ origin: "https://your-frontend.com", credentials: true })`).
4. Point your frontend's API base URL at your deployed backend URL (e.g. via a `.env` variable like `VITE_API_URL` or `NEXT_PUBLIC_API_URL`).
5. Handle the `{ success, message, data }` response shape consistently in your API client/axios instance.
6. On `401` responses, redirect to login and clear the stored token.

---

## 5. What's Left For You To Do

- [ ] Create your PostgreSQL DB (Neon/Supabase/Railway) and set `DATABASE_URL`
- [ ] Run `npx prisma generate` and `npx prisma migrate dev --name init`
- [ ] Run `npx prisma db seed` to get an admin login
- [ ] Test all endpoints (Postman/Thunder Client) — register → login → create category → create product → place order
- [ ] Push to GitHub
- [ ] Deploy to Render/Railway → get your **Live Backend API URL**
- [ ] Connect your frontend to the deployed URL and test end-to-end
- [ ] Change the CORS origin from `*` to your actual frontend domain before final submission
- [ ] For submission: Live Backend API URL + GitHub repo link + this README as your API documentation
