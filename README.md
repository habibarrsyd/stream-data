# Steam Scouting Radar

Static dashboard and upload page for reading/writing Supabase data, ready for GitHub and Vercel deployment.

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Run the local server with `node server.js`.
4. Open `http://localhost:3000/` for the dashboard.
5. Open `http://localhost:3000/upload` for the upload page.

## GitHub

1. Initialize git in this folder if needed.
2. Commit the files, but do not commit `.env`.
3. Push the repository to GitHub.

## Vercel

1. Import the GitHub repository into Vercel.
2. Set these environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Deploy.

## Routes

- `/` serves `index.html`
- `/upload` serves `upload.html`
- `/api/config.js` exposes runtime config for the browser