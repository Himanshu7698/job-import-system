# Job Import System

Live demo: https://job-import-system-sage.vercel.app/

> **Short description**
>
> Job Import System is a full-stack application that imports job data into a Redis-backed queue, processes jobs with Bull workers, refetches data on a cron schedule, and stores final results in MongoDB (Atlas). The frontend is a Next.js app that shows live updates using Socket.IO and supports pagination + searching.

---

## Tech stack

* **Frontend**: Next.js 
* **Backend / Worker**: Node.js + Express
* **Queue**: Bull (Redis)
* **Realtime**: Socket.IO
* **Database**: MongoDB Atlas
* **Cache / Queue Storage**: Redis (local or Redis Cloud)
* **Deployment**: Vercel (frontend demo provided)

---

## Key features

* Add jobs to a Redis queue for processing
* Concurrent background workers (Bull) to process queue items
* Hourly cron job to re-fetch job data and push new tasks into Redis
* Job results persisted to MongoDB Atlas
* Live frontend updates via Socket.IO whenever data changes
* Frontend supports pagination and search

---

## Repository layout (expected)

```
/ (repo root)
├─ backend/          # Express app, API routes, queue + worker logic
├─ frontend/         # Next.js app (pages / components / socket client)
├─ worker/           # Bull worker(s) (may be inside backend or separate)
├─ package.json      # Root or per-package package.json
└─ README.md         # This file
```

---

## Prerequisites

* Node.js (>= 16)
* Redis (local) or a Redis Cloud instance
* MongoDB Atlas cluster (connection string)

---

## Environment variables

### Backend `.env` (example)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_import_system
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASS=
BULL_CONCURRENCY=5
```

### Frontend `.env` (example)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_PATH=/api/socket.io
NEXT_PUBLIC_BASE_PATH=

```

## Install & run (development)

> These commands assume separate folders for `backend` and `frontend`. If your repo is monorepo change paths accordingly.

1. Unzip / clone repo

2. Install backend dependencies

```bash
cd server
npm install
```

3. Install frontend dependencies

```bash
cd client
npm install
```

4. Start Redis (local)

* Using Docker (recommended):

```bash
docker run --name job-import-redis -p 6379:6379 -d redis:7
```

* Or run Redis locally if you have it installed.

5. Start backend (dev)

```bash
cd server
npm run dev
# -> this should run the Express server on PORT (default 5000)
```

6. Start frontend (dev)

```bash
cd client
npm run dev
# Next.js dev server (default http://localhost:3000)
```

> The project uses `npm run dev` for both frontend and backend as requested.

---

## Running workers & scheduler

* Workers should be started (they may be part of the backend or separate `worker` service):

```bash
cd server
# if you have a worker script
npm run worker
```

* Cron scheduler: there should be a scheduler file (e.g. `cron.js`) that enqueues the hourly re-fetch job. Ensure the scheduler is running (PM2 / systemd / separate process) in production. Example command:

```bash
node cron.js
# or
npm run cron
```

If the scheduler is included inside the backend, ensure the backend process runs continuously in production.

---

## How queues & processing work (overview)

1. The frontend (or an import endpoint) pushes job descriptors into a Redis-backed Bull queue.
2. One or more worker processes read from the queue and perform the required fetch/processing.
3. After processing, results are written to MongoDB.
4. Workers emit Socket.IO events to the server which are proxied to connected frontends so the UI updates live.
5. A cron job runs every hour to re-enqueue jobs (or fetch fresh sources) and store new/updated data in MongoDB.

---

## Deployment notes

### Frontend (Vercel)

* You already have a Vercel deployment: [https://job-import-system-sage.vercel.app/](https://job-import-system-sage.vercel.app/)
* Add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` in the Vercel project environment variables.

### Backend & Worker

* The backend and worker must be deployed to a server that supports persistent WebSocket connections and long-running processes. Options: Render, Railway, Fly.io, DigitalOcean, Heroku (with WebSocket support), or a VPS.
* Set the environment variables listed above in your host's dashboard.
* If you use Redis Cloud, add the `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASS` values accordingly.

> Note: Vercel is ideal for frontend hosting. If you want to host backend functions on Vercel (serverless), be aware that serverless functions are ephemeral and not suitable for long-running workers or WebSocket servers. For socket.io & worker processes, prefer a dedicated server or platform that allows persistent processes.

---

## Common troubleshooting

* **Socket.IO connection fails**: Check `NEXT_PUBLIC_SOCKET_URL` and CORS/socket origin settings on the backend. When using HTTPS, ensure the socket URL uses `wss://`/`https://`.
* **Redis connection refused**: Make sure Redis is running, or verify Redis Cloud credentials. Try `redis-cli -h <host> -p <port> -a <password>` to test.
* **Workers do not process jobs**: Ensure the worker process is running and connected to the same Redis instance and queue name. Check `BULL_CONCURRENCY`.
* **Cron jobs not running in production**: Ensure the cron scheduler process is started and managed (PM2/systemd) or use a hosted scheduler (like Cron Jobs on Render) that triggers an endpoint to enqueue jobs.

---

## Useful scripts (suggested additions to package.json)

```json
"scripts": {
  "dev": "node server.js",         
  "start": "NODE_ENV=production node server.js",
  "worker": "node worker.js",
  "cron": "node cron.js"
}
```

Adjust scripts to match your actual filenames.

---

## Security & production tips

* Never commit `.env` to git. Use environment variables on hosting platforms.
* Use TLS (HTTPS / WSS) in production.
* Protect your MongoDB Atlas user with least privilege and network restrictions.
* Set up Redis ACLs or use a managed Redis provider with authentication.

---

## Contributing

If you want me to deep-analyze the zip and produce a more tailored README (endpoints list, exact scripts, how to run the worker/cron based on current code, sample Postman collection, or sample `.env` filled with placeholders), say **"Analyze the repo and generate a detailed README"** and I will extract the exact file names and scripts from your uploaded zip and produce a README that matches your project structure.

---

