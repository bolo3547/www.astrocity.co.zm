# AstroCity - Solar & Water Solutions

A professional website for a company providing solar water pumps, borehole drilling, water tanks, and solar power systems.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT-based admin auth

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database URL and secrets:
```
DATABASE_URL="postgresql://user:password@localhost:5432/astrocity"
JWT_SECRET="your-secure-secret-key-min-32-chars"
```

4. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database with initial data:
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Admin Access

After seeding, access the admin panel at `/admin` with:
- **Email**: admin@astrocity.com
- **Password**: Admin123!

⚠️ Change these credentials immediately in production.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (home, services, etc.)
│   ├── admin/             # Admin backoffice
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── lib/                   # Utilities and helpers
└── types/                # TypeScript types
```

## Database Models

- **users** - Admin user accounts
- **settings** - Company information (name, contact, working hours)
- **services** - Service offerings
- **projects** - Project gallery
- **quotes** - Quote requests from visitors

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed initial data
- `npm run db:studio` - Open Prisma Studio

## License

Private - All rights reserved.
