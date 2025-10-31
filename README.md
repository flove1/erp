# API for ERD

Run the API and database, then open the documentation.

## Requirements

* Docker
* Docker Compose

## Start with Docker

1. Start everything:

   ```bash
   docker compose up -d --build
   ```

2. Open the API docs:

   * [http://localhost:3000/](http://localhost:3000/) (auto-redirects to `/docs`)
   * Or directly: [http://localhost:3000/docs](http://localhost:3000/docs)

## Start Locally (Without Docker)

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run start:dev
   ```

4. Open the API docs:

   * [http://localhost:3000/](http://localhost:3000/) (auto-redirects to `/docs`)
   * Or directly: [http://localhost:3000/docs](http://localhost:3000/docs)