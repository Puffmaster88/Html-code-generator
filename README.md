# Court Room Game - Assignment 2 

Live Deployment
- **URL:** [https://your-vercel-url.vercel.app/court-room](https://assignment2-pb1z055c0-puffmaster80085-8970s-projects.vercel.app/court-room)
- **Platform:** Vercel (Cloud Deployment) (also deployed through aws)

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


## 📋 Requirements Completed 

### 1. Court Room Game Mechanics 
- ✅ Timer with start/pause/reset functionality
- ✅ Evidence selection (multiple checkboxes)
- ✅ Witness calling and cross-examination
- ✅ Objection system (sustain/overrule)
- ✅ Jury deliberation and verdict delivery
- ✅ Multiple case generation (random case details)

### 2. APIs & Database Integration
- ✅ Prisma ORM with PostgreSQL database
- ✅ Full CRUD operations:
  - **POST** `/api/decisions` - Save court decisions
  - **GET** `/api/decisions` - Retrieve all decisions
  - **GET** `/api/decisions/[id]` - Get specific decision
  - **DELETE** `/api/decisions/[id]` - Delete decision
- ✅ Database schema with proper relationships
- ✅ Data persistence (test by saving decisions on live site)

**Database:** PostgreSQL hosted on Prisma.io  
**Test:** Save a decision on live site, refresh page - data persists

### 3. Dockerization 
- ✅ Dockerfile in project root
- ✅ Multi-stage build for optimization
- ✅ Container runs application with database access
- ✅ Docker Compose configuration

**To test locally:**
```bash
docker build -t courtroom-app .
docker run -p 3000:3000 courtroom-app
```

### 4. Testing & Instrumentation
- ✅ **Playwright Tests:** 5 automated UI tests (all passing)
  - Test results: `test-results/` directory
- ✅ **Lighthouse Audit:** Performance score 94/100
  - Report: `lighthouse-report.html`
- ✅ **JMeter Load Testing:** 58ms avg response, 0% errors
  - Report: `jmeter-results.jtl`

**Run tests locally:**
```bash
npm run test              # Playwright
npm run test:lighthouse   # Lighthouse
npm run test:jmeter       # JMeter
```

### 5. Cloud Deployment
- ✅ Deployed on Vercel cloud platform
- ✅ PostgreSQL database in cloud (Prisma.io)
- ✅ Public URL accessible 24/7
- ✅ Environment variables properly configured
- ✅ Production-ready with HTTPS


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
