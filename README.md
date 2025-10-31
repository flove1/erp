# API for ERD

Run the API and database with a single command, then open the docs.

- Requirements: Docker + Docker Compose

## Start with Docker

1. Start everything
  - `docker compose up -d --build`

2. Open the API docs
  - [http://localhost:3000/](http://localhost:3000/) (auto-redirects to `/docs`)
  - Or directly: [http://localhost:3000/docs](http://localhost:3000/docs)

## Start Locally (without Docker)

1. Copy the example environment file:
  - `cp .env.example .env`

2. Install dependencies:
  - `npm install`

3. Start the development server:
  - `npm run start:dev`

4. Open the API docs:
  - [http://localhost:3000/](http://localhost:3000/) (auto-redirects to `/docs`)
  - Or directly: [http://localhost:3000/docs](http://localhost:3000/docs)