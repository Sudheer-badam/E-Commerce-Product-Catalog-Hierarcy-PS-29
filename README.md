# E-Commerce-Product-Catalog-Hierarcy-PS-29
# Smart E-Commerce Platform

A production-ready full-stack E-Commerce application utilizing a modern monorepo architecture. 
Designed for a 4-member team to build parallel features seamlessly.

## Tech Stack
- **Monorepo**: Turborepo
- **Frontend (Customer)**: Next.js 14, Tailwind CSS, Shadcn UI
- **Frontend (Admin)**: Next.js 14, Chart.js
- **Backend API**: NestJS, TypeScript
- **Database**: MongoDB (Core Data) & Firebase (Auth/Real-time)
- **Shared Packages**: Object-Oriented Product Catalog Models

## Architecture Highlight: The OOP Catalog
This project fulfills the strict OOP requirement (Polymorphism, Abstraction, Inheritance) for the Product Catalog. 
Located in `packages/shared/src/models/Product.ts`, the catalog logic calculates taxes and delivery methods completely independently without utilizing `instanceof` antipatterns.

## Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://npmjs.com)

### Installation
1. Clone the repository and navigate into the root directory.
2. Install all dependencies across the monorepo:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in `apps/api` with your Firebase Admin credentials.

### Running the Platform
To boot the entire stack (NestJS API, Next.js Web, Next.js Admin) simultaneously:
```bash
npm run dev
```

- **Customer Store**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`
- **Backend API**: `http://localhost:8080`

## Deployment Guide (Vercel & Render)

### Next.js Frontends (Vercel)
1. Push the repository to GitHub.
2. Go to Vercel and Import Project.
3. Vercel automatically detects Turborepo. 
4. Deploy the `apps/web` project. Set the framework preset to Next.js.
5. Repeat for `apps/admin`.

### NestJS Backend (Render or Railway)
1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Build Command: `npm install && npm run build --filter=api`
4. Start Command: `node apps/api/dist/main.js`
5. Add your `.env` variables in the Render dashboard.

## Team Division Roles
- **Member 1 (Frontend Core)**: Focus on `apps/web` UI, Tailwind configurations, Cart state.
- **Member 2 (Backend API)**: Focus on `apps/api` integrating MongoDB Repositories and expanding the OOP Products.
- **Member 3 (Admin Dashboard)**: Focus on `apps/admin` integrating Chart.js and order management hooks.
- **Member 4 (Real-time & Firebase)**: Focus on `FirebaseService` in NestJS and Socket.io setup for Live Chat.
