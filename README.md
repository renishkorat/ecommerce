# 🛒 ShopEase – Modern E-commerce Website

A modern, responsive E-commerce website built using **React.js, Tailwind CSS, and JSON Server**. ShopEase provides a smooth online shopping experience with product browsing, cart management, wishlist, user authentication, checkout, and a separate admin dashboard.

## 🌐 Live Demo

**Live Website:** YOUR_VERCEL_DEPLOYMENT_URL

## ✨ Features

### 👤 User Features

- User Registration and Login
- Browse and search products
- View product details
- Filter products by category and price
- Add products to cart
- Update cart item quantities
- Add and remove wishlist products
- Checkout and place orders
- View order history
- Manage user profile
- Responsive design for mobile, tablet, and desktop

### 🔐 Admin Features

- Separate Admin Login
- Admin Dashboard
- View dashboard statistics
- Add, edit, and delete products
- Manage orders
- Manage users
- Separate Admin Panel

## 🛠️ Technologies Used

- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- React Router DOM
- Axios
- JSON Server
- Context API
- React Icons
- HTML5
- CSS3

## 📂 Complete Project Folder Structure

```text
ShopEase/
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Loader.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Categories.jsx
│   │   ├── Cart.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Checkout.jsx
│   │   ├── MyOrders.jsx
│   │   ├── Profile.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ManageProducts.jsx
│   │       ├── ManageOrders.jsx
│   │       └── ManageUsers.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── styles/
│   │   └── (Custom CSS files, if any)
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── db.json
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open Project Folder

```bash
cd ShopEase
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start JSON Server

```bash
npx json-server --watch db.json --port 5000
```

### 5. Start React Development Server

Open another terminal and run:

```bash
npm run dev
```

Open your browser:

```text
http://localhost:5173
```

## 🔗 Application Routes

| Page            | Route             |
| --------------- | ----------------- |
| Home            | `/`               |
| Products        | `/products`       |
| Product Details | `/product/:id`    |
| Categories      | `/categories`     |
| Cart            | `/cart`           |
| Wishlist        | `/wishlist`       |
| Login           | `/login`          |
| Register        | `/register`       |
| Checkout        | `/checkout`       |
| My Orders       | `/orders`         |
| Profile         | `/profile`        |
| Admin Login     | `/admin-login`    |
| Admin Dashboard | `/admin`          |
| Manage Products | `/admin/products` |
| Manage Orders   | `/admin/orders`   |
| Manage Users    | `/admin/users`    |

## 🔌 JSON Server API Endpoints

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/products`     | Get all products   |
| POST   | `/products`     | Add product        |
| PUT    | `/products/:id` | Update product     |
| DELETE | `/products/:id` | Delete product     |
| GET    | `/categories`   | Get categories     |
| GET    | `/users`        | Get users          |
| GET    | `/orders`       | Get orders         |
| GET    | `/cart`         | Get cart items     |
| GET    | `/wishlist`     | Get wishlist items |

## 🔑 Demo Credentials

### Demo User

```text
Email: user@gmail.com
Password: user123
```

### Demo Admin

```text
Email: admin@gmail.com
Password: admin123
```

*Note: Demo accounts must be configured in your JSON Server database. These credentials are examples and should be changed if your database uses different values.*

## 🚀 Deployment

The frontend and API functions are deployed using **Vercel**. Product and category data are served from `db.json`; check `/api/products` and `/api/categories` to verify the deployed API.

**Live Project:** YOUR_VERCEL_DEPLOYMENT_URL

> **Important:** Vercel serverless functions do not persist changes to `db.json`. Use a persistent database and hosted backend before relying on live admin edits, orders, carts, or user changes.

## 🎯 Project Purpose

This project was developed to practice and improve practical frontend development skills, including:

- React Components and Props
- State Management using Context API
- React Router DOM
- API Integration using Axios
- CRUD Operations
- User Authentication
- Admin Dashboard
- Responsive UI Design
- Frontend Deployment using Vercel

##
