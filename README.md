# Snip – Authenticated URL Shortener

Snip is a full-stack URL shortener that allows authenticated users to create, manage, and share short links. It supports custom aliases, click tracking, and downloadable QR codes.

## Live Application

| Resource | Link |
|---|---|
| Frontend | [Snip – Live Application](https://snip-flax.vercel.app) |
| Backend API | [Backend API](https://snip-backend-2jm8.onrender.com) |
| API Documentation | [Swagger UI](https://snip-backend-2jm8.onrender.com/api/docs) |
| API Health | [Health Check](https://snip-backend-2jm8.onrender.com/api/health) |
| Demo Video | [Demo Video](https://www.youtube.com/) 

## Features

### Authentication & Account Management
- User registration with email OTP verification.
- Login using email and password.
- Google authentication.
- Secure password hashing.
- JWT-based authentication with access and refresh tokens.
- HTTP-only cookies for refresh-token management.
- Forgot password and password reset functionality.
- Change password and email with verification.
- Logout from the current session or all devices.

### URL Management
- Create short URLs with automatically generated codes.
- Create custom aliases for short links.
- Check custom alias availability.
- View and manage personal short links.
- Delete existing short links.
- Paginated URL listing.

### Analytics & QR Codes
- Track total clicks for each short link.
- View the most recent click information.
- Generate customizable QR codes.
- Download QR codes in PNG and SVG formats.

### Security & Validation
- Protected routes for authenticated users.
- Input validation using DTOs.
- Request rate limiting.
- Redis-based OTP and session management.
- Security headers using Helmet.
- Ownership checks to ensure users can manage only their own URLs.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Routing | React Router |
| State Management | Zustand |
| Server State | TanStack Query |
| Styling | Tailwind CSS |
| Backend | Node.js, NestJS, TypeScript |
| Authentication | Passport, JWT |
| Database | PostgreSQL |
| ORM | Prisma |
| Caching & Session Storage | Redis, ioredis |
| API Documentation | Swagger |
| Email Service | Nodemailer |
| OAuth | Google Identity Services |

## Project Structure

```text
snip/
├── backend/
│   └── NestJS API, Prisma schema, and migrations
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── constants/
│   │   │
│   │   ├── features/
│   │   │   ├── account/
│   │   │   ├── auth/
│   │   │   │   ├── api/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── stores/
│   │   │   │   ├── types/
│   │   │   │   ├── validation/
│   │   │   │   └── index.ts
│   │   │   └── urls/
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   └── eslint.config.js
│
└── README.md
```

### Frontend Architecture

The frontend follows a feature-based structure to keep related functionality organized and maintainable.

- **features/** – Organizes application functionality into feature areas such as authentication, account management, and URL management.
- **components/** – Shared UI components used across different features.
- **pages/** – Application-level pages.
- **hooks/** – Shared custom React hooks.
- **lib/** – Shared libraries and integrations.
- **config/** – Application configuration.
- **constants/** – Shared application constants.
- **types/** – Shared TypeScript types and interfaces.
- **utils/** – Reusable utility functions.
- **assets/** – Static assets such as images and icons.

Each feature can maintain its own API functions, components, hooks, stores, types, and validation logic where needed.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 22 or later
- npm
- PostgreSQL
- Redis or an Upstash Redis database
- Google OAuth Client ID (for Google authentication)
- Email provider credentials (for OTP emails)

### 1. Clone the Repository

```bash
git clone https://github.com/mhdshamshad/snip.git

cd snip
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the required environment variables in `backend/.env`.

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run start:dev
```

The backend API will be available at:

`http://localhost:3000`

Swagger documentation:

`http://localhost:3000/api/docs`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the frontend environment variables.

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

## Environment Variables

Create the required `.env` files using the provided `.env.example` files.

### Backend Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | Application environment |
| `PORT` | Backend server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access-token expiration time |
| `REFRESH_TOKEN_EXPIRES_IN_DAYS` | Refresh-token expiration in days |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NODEMAILER_EMAIL` | Email sender address |
| `NODEMAILER_PASSWORD` | Email provider/app password |
| `FRONTEND_URL` | Frontend application origin |
| `BASE_URL` | Public backend URL |

### Frontend Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL, including `/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

**Important:** Never commit environment files containing credentials or secrets. Frontend environment variables prefixed with `VITE_` are exposed to the browser and must never contain private secrets.

## API Documentation

The backend API uses the `/api` prefix.

Interactive API documentation is available through Swagger:

[https://snip-backend-2jm8.onrender.com/api/docs](https://snip-backend-2jm8.onrender.com/api/docs)

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new account |
| POST | `/api/auth/verify-otp` | Public | Verify registration OTP |
| POST | `/api/auth/resend-otp` | Public | Resend registration OTP |
| POST | `/api/auth/login` | Public | Login with email and password |
| POST | `/api/auth/google` | Public | Authenticate with Google |
| POST | `/api/auth/forgot-password` | Public | Request password reset |
| POST | `/api/auth/reset-password` | Public | Reset password using OTP |
| POST | `/api/auth/refresh` | Refresh cookie | Refresh authentication session |
| POST | `/api/auth/logout` | Current session | Logout current session |
| POST | `/api/auth/logout-all` | Authenticated | Logout all sessions |
| GET | `/api/auth/me` | Authenticated | Retrieve current user |
| POST | `/api/auth/email-change` | Authenticated | Request email change verification |
| PATCH | `/api/auth/email-change/verify` | Authenticated | Verify and apply email change |
| PATCH | `/api/auth/password` | Authenticated | Change account password |

### URL Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/urls` | Authenticated | Create a short URL |
| GET | `/api/urls` | Authenticated | Retrieve user's URLs |
| GET | `/api/urls/check-alias` | Authenticated | Check custom alias availability |
| GET | `/api/urls/:id` | Authenticated | Retrieve a specific URL |
| DELETE | `/api/urls/:id` | Authenticated | Delete a URL |
| GET | `/api/urls/resolve/:code` | Public | Resolve a short code and record a click |

### Other Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/:code` | Public frontend route | Open a short-link page |
| GET | `/api/health` | Public | Check API and Redis health |

### Short Link Redirection

Short links use the frontend domain.

For example:

```text
https://snip-flax.vercel.app/abc123
```

When a visitor opens a short link:

1. The frontend receives the short code.
2. It requests the destination from the backend's public resolve endpoint.
3. The backend retrieves the original URL and records the click.
4. The frontend redirects the visitor to the original destination.

The shared short URL uses the frontend domain, while URL resolution is handled by the backend API.

## Testing & Quality Checks

Run the following commands from their respective project directories.

### Backend

```bash
cd backend

# Build
npm run build

# Lint
npm run lint

# Unit tests
npm run test

# End-to-end tests
npm run test:e2e
```

### Frontend

```bash
cd frontend

# Production build
npm run build

# Lint
npm run lint
```

## Deployment

The application is deployed using the following services:

| Component | Hosting |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |
| Redis | Upstash |

### Backend Deployment – Render

- **Service URL:** https://snip-backend-2jm8.onrender.com
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

Configure the backend environment variables in the Render dashboard.

Set the following production values:

```env
FRONTEND_URL=https://snip-flax.vercel.app
BASE_URL=https://snip-backend-2jm8.onrender.com
```

Use your production PostgreSQL and Redis connection strings.

Apply pending database migrations:

```bash
npx prisma migrate deploy
```

### Frontend Deployment – Vercel

- **Application URL:** https://snip-flax.vercel.app
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Configure the following environment variables:

```env
VITE_API_BASE_URL=https://snip-backend-2jm8.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

The included `vercel.json` rewrite supports direct navigation to frontend routes, including short-link paths.

Add your production frontend domain to the authorized JavaScript origins in your Google OAuth configuration.

## AI Assistance & Development Resources

AI-assisted tools and official documentation were used throughout development to improve development efficiency, explore implementation approaches, and resolve technical challenges.

- **Lovable:** Used to explore frontend layout ideas, refine UI designs, and improve the overall user experience.
- **ChatGPT and Claude:** Used for technical discussions, understanding architectural decisions, exploring implementation approaches, debugging, and resolving development-related doubts.
- **Official NestJS Documentation:** Referred to for understanding framework concepts, implementation patterns, and recommended practices.

All suggestions and generated outputs were reviewed, evaluated, and adapted before being incorporated into the project. Final implementation decisions and code were reviewed to ensure they aligned with the project's requirements and architecture.