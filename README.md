# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # QuickLink

    QuickLink is a lightweight URL shortener built with a React + TypeScript frontend (Vite) and an Express + TypeScript backend that stores mappings in MongoDB. It provides a minimal, fast UI to create short links and server endpoints to redirect and manage stored URLs.

    ## Key features

    - Create a short URL from any long URL (frontend posts to the backend API).
    - Redirect short URLs to their original long URL (server-side redirect).
    - Simple MongoDB-backed storage for URL mappings with createdAt and expiryDate fields.
    - Copy-to-clipboard for generated short links in the UI.
    - CORS configured so frontend (default http://localhost:5173) can call backend (default http://localhost:3000).

    Note: The project contains a small discrepancy between the frontend UI text (mentions "10 days") and the backend expiry value (currently set to 1 minute). See "Known issues & recommendations" below.

    ## Architecture & tech stack
# QuickLink

QuickLink is a lightweight URL shortener that pairs a React + TypeScript frontend (Vite) with an Express + TypeScript backend using MongoDB for persistence. The application offers a simple UI to shorten URLs, copy results, and follow short links that redirect to the original long URLs.

## Features

- Shorten long URLs into compact, human-friendly links (6-character IDs generated with nanoid).
- Server-side redirect: visiting a short URL redirects to the original long URL.
- MongoDB-backed storage with createdAt and expiryDate fields for each mapping.
- Copy-to-clipboard support in the frontend for quick sharing.
- CORS enabled for local development between the frontend and backend.

## Architecture and Technologies

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Express, TypeScript, nanoid
- Database: MongoDB (native driver)
- Tooling: TypeScript, ESLint, Vite

## Repository layout

- frontend/ — React app (UI & client logic)
- backend/  — Express server and MongoDB connection

## API

Base URL (development): http://localhost:3000

- POST /shorten
  - Body: { "longUrl": string }
  - Response: { "shortUrl": string }
  - Errors: 400 if longUrl is missing

- GET /:shortID
  - Redirects (HTTP 302) to the corresponding long URL
  - 404 if the shortID is not found

- GET /
  - Health/info endpoint that returns a small running message

Database document shape (collection `urls`):

{
  _id: ObjectId,
  shortID: string,
  longUrl: string,
  createdAt: Date,
  expiryDate: Date
}

## Getting started (development)

Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB running locally or accessible remotely

Start the backend

```batch
cd backend
npm install
# For quick development you can run the TypeScript file with ts-node-esm
# Install dev tooling if needed: npm install -D ts-node typescript
npx ts-node-esm server.ts

# Or compile then run
# npx tsc && node dist/server.js
```

Start the frontend

```batch
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite (typically http://localhost:5173). Paste a long URL into the input and click "Shorten". The frontend will POST to the backend and display a short link which you can copy.

## Configuration recommendations

Currently the repository contains a few hard-coded values for convenience: the MongoDB URI (`mongodb://localhost:27017`), the backend port (3000), and the frontend origin (`http://localhost:5173`) referenced in the CORS settings. For production use:

- Use environment variables for MONGODB_URI, PORT, and FRONTEND_ORIGIN.
- Add npm scripts to `backend/package.json` (e.g., `dev`, `start`, `build`) and a build step for TypeScript.

## Notes, known issues & recommendations

- Expiry mismatch: The frontend UI mentions links will be deleted in "10 days" but `backend/server.ts` currently inserts `expiryDate` using `Date.now() + 1000 * 60` (1 minute). If you want 10 days, change the insertion to use 10 days in milliseconds:

```ts
const TEN_DAYS_MS = 1000 * 60 * 60 * 24 * 10;
await urls.insertOne({ shortID, longUrl, createdAt: new Date(), expiryDate: new Date(Date.now() + TEN_DAYS_MS) });
```

- Automatic cleanup: Add a TTL index in MongoDB to automatically remove expired documents:

```js
// run in mongo shell or using a DB client
db.urls.createIndex({ expiryDate: 1 }, { expireAfterSeconds: 0 })
```

- Collision handling: The server checks for ID collisions and regenerates when necessary. Consider adding logging and metrics around collisions for high-traffic scenarios.

## Suggestions for improvements

- Add environment variable handling (dotenv) and configuration validation.
- Add unit and integration tests for backend endpoints and frontend flows.
- Add rate limiting and abuse protection (e.g., per-IP limits on shortening).
- Track analytics (click counts, unique visitors) and provide an admin UI for managing links.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: git checkout -b feat/your-feature
3. Implement and test your change
4. Open a pull request describing the change

## License

This project is suitable for open source release under the MIT License. Add a LICENSE file if you need a license in the repository.

## Need help?

I can also:

- Add a `backend/README.md` with example env variables and npm scripts
- Open a PR that changes the expiry to 10 days and adds a TTL index

---

Frontend README updated.

    The backend default server address is http://localhost:3000. If you change the port or MongoDB URI, update `backend/server.ts` and `backend/db.ts` or replace with environment variable logic.

    3) Frontend

    ```batch
    cd frontend
    npm install
    npm run dev
    ```

    Open the frontend at the Vite dev URL (by default http://localhost:5173). Enter a long URL and click "Shorten" to get a short link.

    ## Development notes

    - Frontend behavior: `src/App.tsx` issues a POST to `/shorten` with { longUrl }, displays the returned `shortUrl`, and provides a Copy button that uses the Clipboard API.
    - Backend behavior: `backend/server.ts` uses `nanoid(6)` to generate a 6-character shortID and ensures no collision by checking the DB. It inserts a document into the `urls` collection and returns a full short URL.

    ## Known issues & recommendations

    - Expiry mismatch: The frontend copy of the UI states links "Will Automatically Be Deleted In 10 days", but the backend currently sets `expiryDate` to `new Date(Date.now() + 1000 * 60)` (1 minute). If you intend 10 days, change the insertion line in `backend/server.ts` to:

    ```ts
    // set expiry to 10 days
    const TEN_DAYS_MS = 1000 * 60 * 60 * 24 * 10;
    await urls.insertOne({ shortID, longUrl, createdAt: new Date(), expiryDate: new Date(Date.now() + TEN_DAYS_MS) });
    ```

    - Background cleanup: Currently there's no background job implemented to remove expired documents. Add a TTL index on `expiryDate` in MongoDB or run a scheduled cleanup task. Example TTL index (run once):

    ```
    db.urls.createIndex({ expiryDate: 1 }, { expireAfterSeconds: 0 })
    ```

    ## Suggestions & improvements

    - Add environment variable support (dotenv) for MONGODB_URI, PORT, and FRONTEND_ORIGIN.
    - Add backend `npm` scripts (dev, start, build) for convenience.
    - Add tests for critical flows (shorten, redirect, collision handling).
    - Add analytics: count clicks per short link, unique visits, and rate limits to prevent abuse.

    ## Contributing

    Contributions are welcome. Please follow these steps:

    1. Fork the repository.
    2. Create a feature branch: git checkout -b feat/your-feature
    3. Implement and test your changes.
    4. Open a pull request with a clear description of the change.

    ## License

    This project is provided under the MIT License. See LICENSE file for details (or add one if missing).

    ## Contact

    For questions, feature requests or help, open an issue in the repository or contact the maintainer.

    ---

    If you'd like, I can also:

    - Add a small `README` to the `backend/` folder with exact scripts and example env variables.
    - Open a PR that adjusts the expiry to 10 days and adds a TTL index for automatic cleanup.
