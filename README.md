# User and Authentication API Template

This repository is a trimmed copy of the Spent API, focused on its user account and authentication code. It uses Express, TypeScript, Prisma with PostgreSQL, Redis-backed refresh sessions, Zod validation, and optional Cloudinary profile images.

## Included

- Layered domain, application, infrastructure, and HTTP presentation structure.
- User persistence and profile picture persistence.
- Registration with password hashing and optional profile image upload.
- Login and rotating refresh-token use cases, backed by Redis session records.
- Password change, password-reset token request and verification use cases.
- User lookup, profile update, activate/deactivate, and soft-delete application use cases.
- Request validation, centralized error handling, security headers, CORS, rate limiting, compression, and rotating logs.
- A minimal Prisma schema containing only `User` and `UserProfilePic`.

## Setup

1. Copy `.env.example` to `.env` and set credentials for PostgreSQL, Redis, JWT signing, and Cloudinary (Cloudinary is needed only when profile image uploads are used).
2. Install dependencies with `npm install`.
3. Generate the Prisma client with `npx prisma generate`.
4. Create/apply a database migration with `npx prisma migrate dev --name init`.
5. Start the development server with `npm start`.

The API listens on port `8080` by default. `GET /health` is the health check, and the existing registration route is `POST /api/v1/users/register`.

## Current HTTP surface and inherited gaps

The source project currently wires registration as an HTTP route. Login, refresh, profile, activation, and password reset are present as application use cases (and login validation exists), but are not all wired into HTTP routes. Password reset also has no email delivery implementation. Add the desired routes and authentication middleware before treating those use cases as externally available features.

The source implementation includes a few unfinished areas that were preserved as part of this focused extraction, such as profile image mapping on user reads and placeholder date construction in some password flows. Review and complete those before production use.

## Scope

Budget, expense, historical finance-change, and currency catalog code and schema have been removed. Monthly income fields were also removed from the user entity because they belong to the finance domain. Profile image support remains because it is part of the user account feature.
