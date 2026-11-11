# Snip

Authenticated URL shortener built with **NestJS** and **React**. Users register, log in, and manage their own short links. Short links redirect publicly.

- **Live app:** _add URL_
- **API:** _add URL_
- **API docs (Swagger):** _add URL_/api/docs
- **Demo recording:** _add link_

## Features

- Register, login, and logout with JWT authentication
- Passwords stored as bcrypt hashes
- Protected routes: only authenticated users can create and list short URLs
- Create short URLs, with an optional custom alias
- List and delete your own URLs, with a click count for each
- Public redirect endpoint: `GET /:code`
- Input validation, rate limiting, and consistent error responses

## Tech stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript, Passport (JWT), class-validator, bcrypt |
| Database | _MongoDB + Mongoose / PostgreSQL + Prisma_ |
| Frontend | React, Vite, TypeScript, React Router, Axios, Tailwind CSS |

## Project structure

```
snip/
├── backend/     NestJS API (see backend/README.md)
├── frontend/    React app (see frontend/README.md)
└── README.md
```

## Quick start

### Prerequisites

- Node.js 20+
- A database connection string (_MongoDB / PostgreSQL_)

### 1. Clone

```bash
git clone https://github.com/mhdshamshad/snip.git
cd snip
```

### 2. Backend

```bash
cd backend
cp .env.example .env     # fill in the values
npm install
npm run start:dev
```

The API runs on `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env     # set VITE_API_URL
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## API overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, returns a JWT |
| POST | `/api/auth/logout` | Yes | Invalidate the current token |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/urls` | Yes | Create a short URL |
| GET | `/api/urls` | Yes | List your URLs |
| DELETE | `/api/urls/:id` | Yes | Delete one of your URLs |
| GET | `/:code` | No | Redirect to the original URL |

## Design decisions

- **Public redirect:** short links must work for anyone who opens them, so `GET /:code` is not authenticated. Creating and listing URLs is.
- **302 redirects:** used instead of 301 so browsers do not cache them and click counts stay accurate.
- **Token handling:** the JWT is sent in the `Authorization: Bearer` header. Cookies were avoided because the frontend and backend may be on different domains.
- **Logout:** _describe your approach, e.g. a `tokenVersion` on the user that is incremented on logout so old tokens are rejected._
- **Validation:** only `http` and `https` URLs are accepted; unsafe protocols and links pointing back to this service are rejected.

## Testing

```bash
cd backend
npm run test
npm run test:e2e
```

## Deployment

The app is two independent services. Any host that can run Node.js (backend) and serve static files (frontend) will work.

### Backend

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm install && npm run build` |
| Start command | `npm run start:prod` |
| Environment variables | see `backend/.env.example` |

Set `FRONTEND_URL` to the deployed frontend URL and `BASE_URL` to the deployed backend URL, so generated short links are correct. The backend must be served over HTTPS when the frontend is.

### Frontend

| Setting | Value |
|---|---|
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_URL` = deployed backend URL |

Because this is a single-page app, configure the host to serve `index.html` for unknown paths so refreshing a route such as `/dashboard` works.

## AI usage disclosure

_Edit this section so it is accurate. The assignment asks for it explicitly._

I used **Claude (Anthropic)** during this project for:

- _planning the scope, architecture, and folder structure_
- _[add: boilerplate, debugging, test ideas, README drafting, etc.]_

How it helped: _[describe speed and quality improvements]._
All generated suggestions were reviewed, tested, and adapted by me.

## License

MIT