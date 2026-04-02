# Bank Churn Tracker

Track bank account bonuses, requirements, and fee-free conditions in one place.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB (Mongoose)
- **Auth:** NextAuth.js with Google OAuth
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (Framer Motion)

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Google OAuth 2.0 Client ID & Secret ([create one here](https://console.cloud.google.com/apis/credentials))

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local`** (copy from `.env.example`)
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/bank-churn-tracker
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=<your-client-secret>
   ```

3. **Configure Google OAuth** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + font + metadata
│   ├── page.tsx                # Landing page
│   ├── dashboard/page.tsx      # Dashboard (protected)
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth handler
│       └── accounts/           # REST API (GET, POST, PATCH, DELETE)
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AccountCard.tsx
│   ├── AccountForm.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── mongodb.ts              # Mongoose + MongoClient connections
│   ├── models/Account.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run Next.js linter |
