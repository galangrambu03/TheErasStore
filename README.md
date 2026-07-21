# 🎶 The Eras Store

Welcome to **The Eras Store**! A premium e-commerce platform designed and curated specifically for Taylor Swift fans (Swifties) who find pieces of themselves in every chapter, lyric, and melody. 

This repository houses a full-stack web application featuring an interactive store for fan-made vinyls, CDs, and exclusive merchandise categorized by Taylor Swift's iconic "Eras." Additionally, it features a built-in interactive audio player to listen to soundtrack snippets from each era.

---

## ✨ Features

### 👤 Customer Features
*   **User Authentication**: Sign up and secure login with encrypted passwords hashed using `bcryptjs`.
*   **Themed Shop & Catalog**: Browse premium products (vinyls, CDs, merch) dynamically organized by era/album.
*   **Product Detail View**: Interactive product details overlay with descriptions and high-quality image previews.
*   **Interactive Shopping Cart**: Add products to cart with real-time stock-validation checks, adjust item quantities, and remove items.
*   **Secure Checkout Flow**: Automate stock reductions, clear cart contents, and create pending orders during checkout.
*   **Payment & Order Confirmation**: Upload payment transfer receipts (`multer` file uploading) and input shipping addresses.
*   **Order History Tracker**: Detailed status tracker for previous orders.
*   **Interactive Audio Player**: Built-in player to listen to soundtrack clips representing each era.

### 👑 Admin Features (Dashboard)
*   **Product Catalog Management**: 
    *   Add new products with automated database entry and custom image uploads.
    *   Edit existing product details (prices, stock count, categories, and descriptions).
    *   Delete products from the database catalog.
*   **Era & Album Management**: Add new custom music albums and upload audio soundtracks (`mp3`/`wav`/`m4a`/`ogg`) via the Admin Panel.
*   **Customer Orders Panel**: Review and manage order details, customer addresses, payment receipts (proof of transfer), and update order status.

---

## 🛠️ Technology Stack

### Frontend
*   **Library**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vite.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS & [Animate.css](https://animate.style/)
*   **Animations**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) for smooth interactive transitions
*   **API Client**: [Axios](https://axios-http.com/) for making requests to the Node backend
*   **Modals & Alerts**: [SweetAlert2](https://sweetalert2.github.io/) for beautiful alerts
*   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
*   **Environment**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express 5](https://expressjs.com/)
*   **Database Client**: [mysql2](https://sidorares.github.io/node-mysql2/docs)
*   **Security**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
*   **File Uploads**: [Multer](https://github.com/expressjs/multer) for processing image uploads and audio file uploads
*   **Development Utilities**: [nodemon](https://nodemon.io/) for automatic server restarts on change

---

## 📂 Project Structure

```text
TheErasStore-main/
├── backend/
│   ├── audio-albums/          # Uploaded audio tracks for eras/albums
│   ├── uploads/               # Uploaded images for products
│   ├── index.js               # Backend Express application entry point
│   ├── package.json           # Node server configuration & dependencies
│   └── package-lock.json
├── frontend/
│   ├── public/                # Static assets (favicons, etc.)
│   ├── src/
│   │   ├── assets/            # CSS styles and local visual assets
│   │   ├── components/        # Reusable React UI Components
│   │   │   ├── AboutUs.jsx    # About Section with text typing animation
│   │   │   ├── AddAlbumForm.jsx # Form to upload new albums & soundtracks
│   │   │   ├── Adminorders.jsx # Orders management dashboard for admins
│   │   │   ├── Album.jsx      # Audio list player layout
│   │   │   ├── Archive.jsx    # Product list grid container
│   │   │   ├── Cart.jsx       # Cart details and item modifier
│   │   │   ├── Decrypt.jsx    # Typing/text decryption effect wrapper
│   │   │   ├── Detail.jsx     # Detail overlay modal for products
│   │   │   ├── Edit.jsx       # Edit product form modal
│   │   │   ├── Footer.jsx     # Footer credits and styling
│   │   │   ├── Login.jsx      # Sign in portal component
│   │   │   ├── Navbar.jsx     # Navigation bar component with roles checking
│   │   │   ├── Orderhistory.jsx # Previous order list for users
│   │   │   ├── Payment.jsx    # Proof uploading & address entry form
│   │   │   ├── Signup.jsx     # Registration modal component
│   │   │   └── TextType.jsx   # Text typing effect wrapper
│   │   ├── data/
│   │   │   └── staticEras.js  # Static fallback configuration for Taylor's Eras
│   │   ├── App.css
│   │   ├── App.jsx            # Main app router, state definitions, and view shell
│   │   ├── index.css          # Main Tailwind styles
│   │   └── main.jsx           # App entry point
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json           # React frontend configurations & dependencies
│   ├── postcss.config.js
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── vite.config.js         # Vite configuration
├── package.json               # Root scripts configuration
└── package-lock.json
```

---

## 🗄️ Database Schema

Initialize your MySQL database using the schemas below:

```sql
-- 1. Table: login
CREATE TABLE `login` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'customer',
  PRIMARY KEY (`ID`)
);

-- 2. Table: albums (soundtracks and music configs)
CREATE TABLE `albums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `bg_color` varchar(50) NOT NULL,
  `text_color` varchar(50) NOT NULL,
  `border_color` varchar(50) NOT NULL,
  `audio_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- 3. Table: produk
CREATE TABLE `produk` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Kodeproduk` varchar(100) NOT NULL,
  `Namaproduk` varchar(255) NOT NULL,
  `Kategori` varchar(100) NOT NULL,
  `Harga` decimal(15,2) NOT NULL,
  `Stok` int NOT NULL DEFAULT '0',
  `Gambar` text,
  `Deskripsi` text,
  PRIMARY KEY (`ID`)
);

-- 4. Table: keranjang (shopping cart)
CREATE TABLE `keranjang` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `Produk_ID` int NOT NULL,
  `Jumlah` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`User_ID`) REFERENCES `login` (`ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Produk_ID`) REFERENCES `produk` (`ID`) ON DELETE CASCADE
);

-- 5. Table: orders
CREATE TABLE `orders` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `User_ID` int NOT NULL,
  `Total_Harga` decimal(15,2) NOT NULL,
  `Tanggal_Order` timestamp DEFAULT CURRENT_TIMESTAMP,
  `Status` varchar(50) DEFAULT 'Pending',
  `Alamat` text,
  `Bukti_Bayar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`User_ID`) REFERENCES `login` (`ID`) ON DELETE CASCADE
);

-- 6. Table: order_items
CREATE TABLE `order_items` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Order_ID` int NOT NULL,
  `Produk_ID` int NOT NULL,
  `Jumlah` int NOT NULL,
  `Harga_Beli` decimal(15,2) NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Produk_ID`) REFERENCES `produk` (`ID`) ON DELETE CASCADE
);
```

---

## 🚀 Installation & Local Setup

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **MySQL Database Server**

### 1. Database Configuration
1. Open your MySQL client and create a database named `theerasstore` (or your preferred name).
2. Execute the schema SQL script provided above to create the required tables.

### 2. Backend Setup
1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the following database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=theerasstore
   DB_PORT=3306
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server should now be running on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal window/tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided in the console (usually `http://localhost:5173`).
