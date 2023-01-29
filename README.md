![Pail Logo](https://ebucket.dev/pail.png)
## Pail is Emergency Bucket CTF's NextJS backend + frontend.
### Features:
 - Challenge creation
 - Github integration
 - Rankings
 - Team creation/leaving/joining

### Coming Soon:
 - Discord integration
 - Point configuration
 - Challenge health check

### Technologies used:
 - [NextJS](https://nextjs.org/) (API Routes)
 - [NextAuth.js](https://next-auth.js.org/)
 - [Prisma](https://www.prisma.io/)
 - [Ajv](https://ajv.js.org/)
 - [Tidy.js](https://pbeshai.github.io/tidy/)

## Installation
### Railway one-click (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/DrJIzA?referralCode=GswMXR)

### Manual
Running and installing Pail requires a Postgres instance and VM or Vercel for the frontend. If you are unable to use Postgres instance, it may be possible to use SQLite by changing the provider in the Prisma schema but this has not been tested. To install normally:

1. Clone the repo: ``git clone https://github.com/EmergencyBucket/pail``
2. Install dependencies: ``yarn install``
3. Copy the env file and fill it out: ``cp .env.example .env``
4. Build the project (This will also setup the database): ``yarn build``
5. Start: ``yarn start``
