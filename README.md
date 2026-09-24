# BizFlow

The operating system for small Nigerian businesses — track products, stock and sales, and see today's numbers at a glance.

## Status

🚧 MVP in progress: **Products, Inventory, Sales, Dashboard**. Expenses, customers, suppliers and multi-branch support are planned next.

## Tech stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Auth**: JWT + bcrypt password hashing
- **Hosting**: Vercel (frontend), GitHub for version control

## Project structure

```
BizFlow/
├── backend/          # Express + TypeScript API
│   └── src/
│       ├── config/       # DB connection, schema.sql
│       ├── controllers/  # Route handlers
│       ├── middleware/   # JWT auth guard
│       └── routes/
└── frontend/         # React + TypeScript + Tailwind
    └── src/
        ├── components/   # Sidebar, shared UI
        ├── pages/        # Login, Dashboard, Products, Sales
        └── lib/          # API client
```

## Getting started

### 1. Database

Create the database and run the schema:

```bash
mysql -u root -p -e "CREATE DATABASE bizflow_db"
mysql -u root -p bizflow_db < backend/src/config/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your MySQL password and a JWT secret
npm run dev
```

API runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## API overview

| Method | Endpoint              | Description                  |
|--------|------------------------|-------------------------------|
| POST   | `/api/auth/register`   | Create a business account     |
| POST   | `/api/auth/login`      | Log in, returns a JWT         |
| GET    | `/api/products`        | List your products            |
| POST   | `/api/products`        | Add a product                 |
| PUT    | `/api/products/:id`    | Update a product               |
| DELETE | `/api/products/:id`    | Delete a product               |
| GET    | `/api/sales`           | List recent sales             |
| POST   | `/api/sales`           | Record a sale (decrements stock) |
| GET    | `/api/dashboard/summary` | Today's sales, stock stats  |

All routes except `/auth/*` require `Authorization: Bearer <token>`.

## Roadmap

- [ ] Expenses tracking
- [ ] Customers & suppliers
- [ ] Multi-employee / multi-branch support (Business tier)
- [ ] Automated low-stock and expiry notifications
- [ ] Advanced reports & analytics
- [ ] Payments integration
