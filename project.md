# Cellular Solutions E-Commerce Project Context

## Developer

- Solo developer
- First paid freelance project
- Computer Science student
- Knows JavaScript and databases
- Learning MERN while building
- Will use Claude Code extensively for development

---

## Project Information

**Business Name:** Cellular Solutions

**Domain:** Client mentioned Cellularsolution7.com (confirm final domain before deployment)

**Project Type:** Full MERN Stack E-Commerce Website

### Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas

**Authentication**
- JWT

**Image Storage**
- Cloudinary

**Deployment**
- Vercel (Frontend)
- Render (Backend)

**Architecture**
- MVC

---

## Business Description

The business sells:

- Mobile Phones
- Mobile Accessories
- Cases
- Wallet Cases
- Outer Boxes
- Camo Cases
- Tempered Glass
- Camera Lens Protectors
- Wall Chargers
- Charging Cables
- iPad Cases
- Tablet Cases
- PlayStation (New & Used)
- Xbox (New & Used)
- Power Max Speakers
- Headphones
- HP Laptops
- Dell Laptops
- Microsoft Laptops
- MacBook Air
- MacBook Pro
- iMac
- Tablets
- iPads

**Services**
- Mobile Unlock
- Buy Used Phones
- Sell Used Phones

---

## Client Requirements

Website should look premium.

**Design inspiration:** Modern Apple-like ecommerce.

**Characteristics**
- Clean
- Premium
- Smooth Animations
- Large Hero Section
- Rounded Cards
- Blue/White Theme
- Responsive
- Professional

The client approved this design direction.

---

## Website Pages

### Public
- Home
- Shop
- Product Details
- Categories
- About
- Contact
- Buy/Sell
- Unlock Service
- Login
- Register
- Cart
- Checkout

### Customer Dashboard
- My Orders
- Profile

### Admin Dashboard
- Dashboard
- Products
- Categories
- Brands
- Orders
- Customers
- Inventory
- Buy/Sell Requests
- Unlock Requests
- Settings

---

## Features

### Authentication
- Register
- Login
- JWT
- Protected Routes

### Products
- CRUD
- Multiple Images
- Featured Products
- New / Used Condition
- Stock
- Category
- Brand

### Categories
- Admin CRUD

### Brands
- Admin CRUD

### Orders
- Place Order
- Order History
- Admin Management
- Status Updates

### Inventory
- Stock Management
- Low Stock

### Search
- Product Search

### Filters
- Brand
- Category
- Condition
- Price

### Payment Methods

**In-store:**
- Cash
- Credit card
- Debit card
- Cash apps: Venmo, Cash App, Zelle

**Online (website checkout):**
- Credit card via Stripe
- Debit card via Stripe

**Important:** Cash and cash apps are in-store only. They are not available for online orders. Online checkout uses Stripe exclusively.

---

### Services

**Buy/Sell Requests**

Fields:
- Name
- Phone
- Device
- Condition
- Description
- Images
- Status

**Unlock Requests**

Fields:
- Name
- Phone
- Device
- IMEI (optional)
- Carrier
- Status

**Repair Requests (Home Visit)**

Customer fills in:
- Name and phone
- Address (technician visits this location)
- Device type (e.g. iPhone, Android, Samsung, laptop)
- Specific problem description
- Specific available date and time

Process:
- Store reviews request and confirms availability before dispatching technician
- If device cannot be repaired on-site, it is taken to the store and returned to the customer after repair
- Customer must agree to this condition via a required checkbox before submitting the form — no submission without agreement

Fields:
- Name
- Phone
- Address
- Device Type
- Issue
- Available Date
- Available Time
- Images (optional — damage photos)
- Agreed To Terms (required boolean)
- Status (pending → confirmed → in-progress → completed / cancelled)
- Admin Notes (internal)
- Assigned Technician (internal)
- Estimated Cost (internal)

### Customers
- Profile
- Orders

### Admin

Dashboard showing:
- Total Sales
- Orders
- Products
- Customers
- Low Stock

---

## MongoDB Collections

- Users
- Products
- Categories
- Brands
- Orders
- OrderItems
- Reviews
- BuySellRequests
- UnlockRequests

---

## Folder Structure

**client/**
- components
- pages
- layouts
- hooks
- services
- context
- assets
- utils

**server/**
- controllers
- models
- routes
- middleware
- config
- utils

---

## Coding Standards

- Use MVC
- Use reusable components
- Avoid duplicate code
- Use async/await
- Proper error handling
- Clean architecture
- Explain generated code
- Keep files modular
- Do not generate huge files
- Build feature by feature

---

## Development Workflow

Never generate the whole project at once.

Instead, follow this order:

1. Folder Structure
2. Database Models
3. Controllers
4. Routes
5. Authentication
6. Admin Panel
7. Product CRUD
8. Categories
9. Brands
10. Frontend Pages
11. API Integration
12. Testing

---

## Claude Code Workflow

Always begin prompts with:

> Read project.md before generating code.
> Follow the specification exactly.
> Do not invent features.
> Do not change the architecture.

Then request one task at a time.

Never ask the LLM to build the entire ecommerce website in one prompt.

---

## Project Timeline

**Estimated:** 4 weeks

**Week 1:** Backend, Authentication, Database, Product CRUD
**Week 2:** Frontend, Home, Shop, Admin
**Week 3:** Orders, Services, Dashboard
**Week 4:** Testing, Bug Fixes, Deployment

---

## Client Agreement

**Project Price:** PKR 80,000

**Payment Terms:** 40% advance, remaining in milestones/final delivery

**Current Status:** Client has sent PKR 10,000, which is less than the agreed 40% advance. This should be clarified before significant development begins.

---

## Assets

**Client has provided:** Logo

**Client requested:** Use Google images temporarily during development. Replace with licensed/client-provided images before production.

---

## Current Goal

Create a professional production-ready MERN ecommerce application with clean architecture, modern UI, scalable backend, professional admin panel, reusable React components, secure authentication, MongoDB, Express APIs, and responsive design.

The LLM should act as a senior software engineer and mentor, producing production-quality code while explaining design decisions and following best practices.