# Task Specification: TASK-024

> **Task ID**: `TASK-024`  
> **Title**: Club Merchandise & Product Showcase Catalog  
> **Assignee**: `edith` (Backend), `friday` (Web Dashboard) & `thor` (Mobile)  
> **Status**: `READY`  
> **Priority**: `P2`  
> **Complexity Tier**: `STANDARD`  
> **Dependencies**: `TASK-021` (Mobile System Integration - DONE)  

---

## 1. Context & Objective
Client Daniel requested a merchandise showcase screen ("shop but not an actual shop it would just be a showcase") to present official club gear (tees, hoodies, medals, running accessories) without complex checkout flows, allowing members to view gear and inquire directly.

---

## 2. Scope & Technical Architecture

### 2.1 Database Schema Extensions (`edith` - Prisma)
* New `Product` model:
  - `id`: String @id @default(uuid())
  - `title`: String
  - `description`: String @db.Text
  - `price`: Decimal @db.Decimal(10, 2)
  - `currency`: String @default("GBP")
  - `category`: String // "Apparel" | "Accessories" | "Medals"
  - `imageUrl`: String
  - `galleryImages`: String[]
  - `externalUrl`: String? (e.g., link to Instagram / external shop if configured)
  - `isActive`: Boolean @default(true)
  - `createdAt`: DateTime @default(now())
  - `updatedAt`: DateTime @updatedAt

### 2.2 Backend Products API (`src/products/`)
* Public Endpoints:
  - `GET /api/products`: Lists active products with category filtering.
  - `GET /api/products/:id`: Retrieves single product details.
* Admin Endpoints (Protected with RolesGuard):
  - `POST /api/products`: Creates a new product with image upload.
  - `PUT /api/products/:id`: Updates product information and pricing.
  - `DELETE /api/products/:id`: Soft-deletes or deactivates product.

### 2.3 Web Admin Dashboard (`friday` - Next.js)
* New page `/dashboard/shop` (or `/dashboard/merchandise`):
  - Product catalog table with image preview, price, category, and status toggles.
  - "Add Product" modal with image upload, title, category, description, and currency (GBP default).

### 2.4 Mobile Client UI & Flow (`thor` - Flutter)
* New **"Club Showcase"** screen:
  - Clean athletic card grid displaying products with high-resolution imagery and badge category tags.
  - Product details bottom-sheet / screen with carousel, descriptions, and size guide.
  - **"Inquire to Buy"** CTA button linking to club email or support contact.

---

## 3. Acceptance Criteria
- [ ] `Product` table migrated and seeded with initial demo apparel items.
- [ ] Backend CRUD APIs created and secured with admin role guards.
- [ ] Admin dashboard allows uploading and managing showcase merchandise items.
- [ ] Mobile app displays product catalog cleanly with inquiry action.
- [ ] Thanos verification confirms 0 regression and valid endpoints.

