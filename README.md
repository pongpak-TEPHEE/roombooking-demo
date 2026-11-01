# Campus Room & Facility Booking — Demo

A full-stack room reservation system built for a university faculty: teachers search for free rooms and request bookings, staff approve them, and anyone can scan a room's QR code to see its live status.

This repository is a **public demo build** of the system:

- **Login is bypassed.** The real system signs users in with a one-time password sent to their university e-mail. The demo replaces that step with "sign in as Teacher / Staff" buttons backed by shared demo accounts.
- **All data is fictional** and is reset every night (and whenever the demo server restarts).
- **No e-mail is sent.** Notifications are logged instead.

**Live demo:** https://pongpak-tephee.github.io/roombooking-demo/
(the API runs on a free tier that sleeps when idle, so the first request can take about a minute)

![Demo login](docs/screenshots/demo-login.png)

| Dashboard | Calendar | Booking approval |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Calendar](docs/screenshots/calendar.png) | ![Manage bookings](docs/screenshots/manage-booking.png) |

| Demo login (mobile) | Room status via QR (mobile) |
|---|---|
| <img src="docs/screenshots/demo-login-mobile.png" width="260"> | <img src="docs/screenshots/room-status-mobile.png" width="260"> |

## Features

- **Booking with conflict checks:** a booking is rejected when it overlaps an existing booking or a scheduled class, and it must fall inside the configured opening hours, maximum duration and booking window.
- **Approval workflow:** pending → approved / rejected / cancelled → completed, with automatic cancellation of requests that are not approved in time.
- **Calendar view:** classes and bookings per room, by month or week.
- **QR-code room status:** each room has a QR code that opens a public page with its current status and today's schedule; the scanner runs in the browser camera.
- **Class schedule import:** staff upload the term timetable from an Excel/CSV file; bookings that clash with the new timetable are cancelled and the teacher is notified.
- **Role-based access:** `teacher` and `staff` roles, enforced on every API route.
- **Session security (production):** e-mail OTP restricted to the university domain, short-lived access tokens with refresh tokens in HttpOnly cookies, token blacklist on logout, one active session per account, rate limiting and audit logs.
- **Reports:** weekly room-usage summaries and log export.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, FullCalendar, html5-qrcode, Axios |
| Backend | Node.js, Express 5, PostgreSQL (`pg`), JWT, node-cron, ExcelJS, Nodemailer, Helmet, express-rate-limit, Swagger UI |
| Demo hosting | GitHub Pages (frontend), Render (API + PostgreSQL) |

## Run locally

Requirements: Docker and Node.js 20+.

```bash
# 1. API + PostgreSQL in demo mode (seeds fictional data on start)
docker compose up -d --build

# 2. Frontend
cd frontend
cp .env.example .env.local   # VITE_API_BASE_URL=http://localhost:3000, VITE_DEMO_MODE=true
npm ci
npm run dev                  # http://localhost:5173
```

API docs (Swagger UI): http://localhost:3000/api-docs

To re-seed the database by hand: `cd backend && npm run seed` (uses `DATABASE_URL` from `backend/.env`).

## How the demo mode works

Everything is switched on by `DEMO_MODE=true` (backend) and `VITE_DEMO_MODE=true` (frontend); the production code path is unchanged when they are off.

| Concern | Production | Demo |
|---|---|---|
| Sign-in | `POST /auth/request-otp` → e-mail → `POST /auth/verify-otp` | `POST /auth/demo-login { role }` issues the same JWT + refresh cookie for a demo account |
| Shared accounts | New login replaces the old session | Session is reused, so visitors don't log each other out |
| E-mail | Sent via SMTP | Logged only |
| Demo accounts | — | Can't be edited, suspended or deleted |
| Data | Real database | Fictional seed, reset nightly at 04:00 and on start-up |

Relevant code: [`backend/src/demo/`](backend/src/demo), [`frontend/src/components/auth/DemoLogin.jsx`](frontend/src/components/auth/DemoLogin.jsx).

## Deploy

- **API + database:** Render Blueprint ([`render.yaml`](render.yaml)) → a free web service and a free PostgreSQL database.
- **Frontend:** the [GitHub Pages workflow](.github/workflows/deploy-pages.yml) builds on every push to `main`. Set the repository variable `API_BASE_URL` to the Render service URL.

## Team

Built as a university project by a two-person team:

- Pongpak Tephee ([@pongpak-TEPHEE](https://github.com/pongpak-TEPHEE))
- [@Boom5556-max](https://github.com/Boom5556-max)

This is a portfolio demo and is not the faculty's official booking system; the faculty's logo, mascot and photos have been removed from this build.
