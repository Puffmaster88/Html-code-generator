# Court Room Game - Assignment 2 

Live Deployment
- **URL:** [https://your-vercel-url.vercel.app/court-room](https://assignment2-pb1z055c0-puffmaster80085-8970s-projects.vercel.app/court-room)
- **Platform:** Vercel (Cloud Deployment)

Local Setup
```bash
npm install
npx prisma generate
npm run dev
```

Features Completed
- ✅ Court Room Game with timer, evidence, witnesses, objections
- ✅ CRUD APIs with Prisma + PostgreSQL
- ✅ Docker containerization
- ✅ Playwright automated tests (5 tests passing)
- ✅ Lighthouse performance report (94 score)
- ✅ JMeter load testing (58ms avg response)
- ✅ Cloud deployment on Vercel

Testing
```bash
npm run test              # Playwright tests
npm run test:lighthouse   # Lighthouse audit
npm run test:jmeter       # Load testing
```

Database
- PostgreSQL on Prisma.io
- Prisma ORM for database operations

Tech
- Next.js 14
- Prisma + PostgreSQL  
- Docker
- Playwright, Lighthouse, JMeter
- Vercel Cloud Platform

# Tabs Generator  assignment-1

## Run
npm install
npm run dev
# open http://localhost:3000

## Features
- Header (student number), nav + hamburger
- Light/Dark (+ extra palette), persisted
- Cookie remembers last route
- /tabs: add/rename/delete up to 15, persisted via localStorage
- Copy Output → standalone HTML (inline CSS + JS). Provided: Hello-1.html, Hello-3.html, Hello-5.html
