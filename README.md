<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?style=for-the-badge&logo=razorpay" />
</p>

<h1 align="center">👔 CampusCloset</h1>

<p align="center">
  <strong>India's first peer-to-peer marketplace for college formal wear.</strong><br/>
  Buy and sell suits, blazers, formal shoes, and more — exclusively between students.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🎯 Problem Statement

Every college student in India needs formal wear for placements, presentations, and events — but wears them only a handful of times. CampusCloset connects students who want to **sell gently-used formals** with those who need them at **affordable prices**, reducing waste and saving money.

---

## ✨ Features

### 🛒 Marketplace
- Browse formal wear listings filtered by **category, size, color, condition, price range, and university**
- Full-text search across titles, descriptions, and brands
- Sort by price (low/high) or newest listings
- Paginated product grid with responsive card layout

### 🏷️ Seller Dashboard
- Create new product listings with image upload (drag & drop via `react-dropzone`)
- AI-powered **smart pricing suggestions** based on category, condition, and original price
- Track listing performance — views, wishlist count, status
- Manage active, sold, and draft listings

### 🛍️ Buyer Dashboard
- Wishlist management
- Active chat threads with sellers
- Offer tracking and purchase history

### 💬 Real-Time Chat
- In-app messaging between buyers and sellers
- Send **price offers** directly in chat
- System messages for offer updates

### 💳 Checkout & Payments
- Integrated **Razorpay** payment gateway
- Order summary with delivery details
- Support for UPI, cards, and net banking

### 🔐 Authentication
- Email/password registration with **role selection** (Buyer / Seller)
- University-based verification
- JWT-based session management via `next-auth`

### 🛡️ Admin Panel
- Platform overview with key metrics (users, listings, GMV, reports)
- User management table with verification status
- Listing moderation (view/remove)
- Report review system (approve/reject)

### 🎨 Premium UI/UX
- **Dark-mode-first** glassmorphism design
- Smooth animations via `framer-motion`
- Fully responsive — mobile, tablet, desktop
- Custom design system with gradient accents and micro-interactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Custom CSS Design System |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose 9](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js 4](https://next-auth.js.org/) + bcryptjs |
| **Payments** | [Razorpay](https://razorpay.com/) |
| **Real-Time** | [Socket.IO Client](https://socket.io/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **File Upload** | [react-dropzone](https://react-dropzone.js.org/) |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A **MongoDB Atlas** cluster ([free tier works](https://www.mongodb.com/cloud/atlas/register))
- A **Razorpay** account ([test mode](https://dashboard.razorpay.com/signup))

### 1. Clone the Repository

```bash
git clone https://github.com/aryanrajok/campuscloset.git
cd campuscloset
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campuscloset?retryWrites=true&w=majority

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
campuscloset/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Landing page with hero & features
│   │   ├── layout.tsx              # Root layout with fonts & metadata
│   │   ├── globals.css             # Design system (tokens, components, utilities)
│   │   ├── admin/
│   │   │   └── page.tsx            # Admin panel (users, listings, reports)
│   │   ├── api/
│   │   │   ├── payment/
│   │   │   │   └── route.ts        # POST /api/payment — Razorpay order creation
│   │   │   └── products/
│   │   │       ├── route.ts        # GET (list) & POST (create) /api/products
│   │   │       └── [id]/
│   │   │           └── route.ts    # GET, PUT, DELETE /api/products/:id
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Login page
│   │   │   ├── register/page.tsx   # Registration page
│   │   │   └── role-select/page.tsx # Role selection (buyer/seller)
│   │   ├── chat/
│   │   │   └── page.tsx            # Real-time chat interface
│   │   ├── checkout/
│   │   │   └── page.tsx            # Checkout with Razorpay integration
│   │   ├── dashboard/
│   │   │   ├── buyer/page.tsx      # Buyer dashboard (wishlist, chats, offers)
│   │   │   └── seller/page.tsx     # Seller dashboard (listings, analytics)
│   │   ├── marketplace/
│   │   │   └── page.tsx            # Product browsing with filters & search
│   │   └── product/
│   │       └── [id]/page.tsx       # Product detail page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navigation bar with auth-aware menu
│   │   │   └── Footer.tsx          # Site footer
│   │   ├── marketplace/
│   │   │   └── ProductCard.tsx     # Reusable product card component
│   │   └── ui/
│   │       ├── SolarSystem.tsx     # Animated solar system visual
│   │       └── StudentVisual.tsx   # Student illustration component
│   ├── lib/
│   │   ├── data.ts                 # Mock data & utility functions (formatPrice, timeAgo)
│   │   ├── models.ts               # Mongoose schemas (User, Product)
│   │   ├── mongodb.ts              # MongoDB Atlas connection with caching
│   │   └── razorpay.ts             # Razorpay client-side integration
│   ├── store/
│   │   └── index.ts                # Zustand stores (auth, notifications, UI)
│   └── types/
│       └── index.ts                # TypeScript interfaces & constants
├── .env.local                      # Environment variables (not committed)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📡 API Reference

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all active products with filters, search, sort, and pagination |
| `POST` | `/api/products` | Create a new product listing |
| `GET` | `/api/products/:id` | Get a single product by ID |
| `PUT` | `/api/products/:id` | Update a product listing |
| `DELETE` | `/api/products/:id` | Delete a product listing |

#### Query Parameters for `GET /api/products`

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (`suit`, `pant`, `formal-shoes`, `tie`, `white-shirt`, `blazer`, `combo`) |
| `condition` | string | Filter by condition (`new`, `like-new`, `good`, `used`) |
| `university` | string | Filter by university name |
| `size` | string | Filter by size |
| `color` | string | Filter by color |
| `search` | string | Full-text search across title, description, brand |
| `sortBy` | string | Sort order (`price-asc`, `price-desc`, `newest`) |
| `priceMin` | number | Minimum price filter |
| `priceMax` | number | Maximum price filter |
| `sellerId` | string | Filter by seller ID |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 50) |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment` | Create a Razorpay payment order |

---

## 🏛️ Architecture

```
┌────────────────────────────────────────────────┐
│                   Client (Browser)              │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  Zustand  │ │  Framer  │ │  Razorpay SDK  │  │
│  │  Store    │ │  Motion  │ │  (Client-side) │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
└───────────────────────┬────────────────────────┘
                        │  HTTP / WebSocket
┌───────────────────────▼────────────────────────┐
│              Next.js App Router                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Server Components   │   API Routes      │  │
│  │  (pages, layouts)    │   (/api/*)        │  │
│  └──────────────────────┴───────────────────┘  │
└───────────────────────┬────────────────────────┘
                        │  Mongoose ODM
┌───────────────────────▼────────────────────────┐
│              MongoDB Atlas                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  Users   │ │ Products │ │   Orders     │   │
│  └──────────┘ └──────────┘ └──────────────┘   │
└────────────────────────────────────────────────┘
```

---

## 📦 Product Categories

| Category | Icon | Available Sizes |
|----------|------|-----------------|
| Court/Suit | 🤵 | 36, 38, 40, 42, 44, 46, 48 |
| Formal Pant | 👖 | 28, 30, 32, 34, 36, 38, 40 |
| Formal Shoes | 👞 | 6, 7, 8, 9, 10, 11, 12 |
| Tie | 👔 | Standard, Slim, Extra Long |
| White Shirt | 👕 | S, M, L, XL, XXL, 38–44 |
| Blazer | 🧥 | 36, 38, 40, 42, 44, 46, 48 |
| Formal Combo | 📦 | S, M, L, XL, XXL |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing TypeScript strict typing patterns (no `any`)
- Use the design system tokens defined in `globals.css`
- Ensure `npm run lint` passes with 0 errors before submitting
- Write descriptive commit messages

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Aryan Raj**
- GitHub: [@aryanrajok](https://github.com/aryanrajok)

---

<p align="center">
  Made with ❤️ for college students across India
</p>
