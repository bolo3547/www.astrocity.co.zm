# AstroCity - Copilot Instructions

## Project Overview
A professional website for a solar/water solutions company built with Next.js 15 App Router, Tailwind CSS, and Prisma ORM.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom color palette (navy, solar, accent)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based using jose library
- **Validation**: Zod schemas
- **Icons**: Lucide React

## Project Structure
- `src/app/(public)/` - Public pages (home, services, projects, about, contact)
- `src/app/admin/` - Admin panel with authentication
- `src/app/api/` - API routes for CRUD operations
- `src/components/` - Reusable UI components, layout, and sections
- `src/lib/` - Utilities (auth, prisma client, validations)
- `prisma/` - Database schema and seed files

## Development Guidelines
- All contact information must come from the database (Settings model)
- Use the custom color palette: navy (primary), solar (accent blue), accent (green)
- Follow the existing component patterns in src/components/ui/
- API routes should use Zod validation from src/lib/validations.ts
- Admin routes are protected via JWT authentication in src/lib/auth.ts

## Database Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed initial data
- `npm run db:studio` - Open Prisma Studio

## Admin Credentials
- Email: admin@example.com
- Password: password123
