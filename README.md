# TaskNova — Full Setup Guide (Step by Step)

This is a complete, working full-stack app:
- **Frontend:** React.js (Vite) + React Router
- **Backend:** Node.js + Express (REST API)
- **Database:** SQLite (works instantly, no install/setup needed) — same structure works with PostgreSQL/Supabase later
- **Auth:** Email/password with JWT, plus Google & Facebook social login (Passport.js)

The **Calendar page always shows the real current month/year from your computer's clock** — it is never hardcoded to 2024 or any fixed date.

---

## 0. Requirements

Install these on your computer first (one-time):
1. **Node.js** (version 18 or higher) — download from https://nodejs.org
   - Check it installed: open a terminal and run `node -v` — you should see something like `v20.x.x`
2. A code editor like VS Code (optional but helpful)

---

## 1. Unzip the project

Unzip `tasknova.zip` anywhere on your computer, e.g. your Desktop. You'll get a folder:

```
tasknova/
  backend/
  frontend/
  README.md
```

---

## 2. Set up the backend

Open a terminal and run these commands **one at a time**:

```bash
cd tasknova/backend
npm install
```

Wait for it to finish (downloads all backend packages). This can take 1–3 minutes.

Then create your environment file:

```bash
# Mac/Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```

Open the new `.env` file in a text editor and at minimum set:
```
JWT_SECRET=any_long_random_string_here
SESSION_SECRET=another_long_random_string
```
(Google/Facebook keys are optional — see Step 5 below. The app runs fine without them; those two login buttons just won't work until you add keys.)

Now start the backend:

```bash
npm start
```

You should see:
```
TaskNova backend running on http://localhost:5000
```

**Leave this terminal window open and running.**

---

## 3. Set up the frontend

Open a **second, new terminal window** (don't close the backend one):

```bash
cd tasknova/frontend
npm install
```

Wait for it to finish. Then create the env file:

```bash
# Mac/Linux
cp .env.example .env

# Windows
copy .env.example .env
```

The default value inside is already correct (`VITE_API_URL=http://localhost:5000/api`), so you don't need to edit it unless you change the backend port.

Now start the frontend:

```bash
npm run dev
```

You should see something like:
```
  VITE ready
  ➜  Local:   http://localhost:5173/
```

---

## 4. Open the app

Go to **http://localhost:5173** in your browser. You'll land on the Login page.

Click **"Create account"**, register with a name/email/password, and you'll be dropped straight into the Dashboard. From there you can:
- Add/edit/delete tasks, set status/priority/due date/category (Tasks page)
- See live stats and progress (Dashboard)
- View tasks on a real, current-date calendar (Calendar page)
- Browse tasks grouped by category (Categories page)
- Edit your name/bio/photo and change password (Profile page)
- Turn notifications ON/OFF (Settings page)

---

## 5. (Optional) Enable "Continue with Google" / "Continue with Facebook"

These buttons are already wired into the UI and backend — they just need real credentials, which only you can generate (free) for your own app:

### Google:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a project → "Create Credentials" → "OAuth client ID" → Web application
3. Under **Authorized redirect URIs**, add: `http://localhost:5000/api/auth/google/callback`
4. Copy the **Client ID** and **Client Secret** into `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=your_id_here
   GOOGLE_CLIENT_SECRET=your_secret_here
   ```
5. Restart the backend (Ctrl+C in that terminal, then `npm start` again)

### Facebook:
1. Go to https://developers.facebook.com/apps → Create App → "Consumer" type
2. Add the "Facebook Login" product
3. Under Settings → Valid OAuth Redirect URIs, add: `http://localhost:5000/api/auth/facebook/callback`
4. Copy the **App ID** and **App Secret** into `backend/.env`:
   ```
   FACEBOOK_APP_ID=your_id_here
   FACEBOOK_APP_SECRET=your_secret_here
   ```
5. Restart the backend

Until you do this, clicking those buttons will show a friendly message telling you they're not configured yet — the app won't crash.

---

## 6. Common errors & what they mean

| Error you see | What it means | Fix |
|---|---|---|
| `npm: command not found` | Node.js isn't installed | Install Node.js from nodejs.org, restart terminal |
| `EADDRINUSE: address already in use :::5000` | Something else is already using port 5000 | Close the other program, or change `PORT` in `backend/.env` |
| `Failed to fetch` / blank dashboard | Backend isn't running | Make sure the backend terminal still shows "TaskNova backend running..." |
| `Invalid email or password` | Wrong login details | Double check, or register a new account |
| `CORS` error in browser console | Frontend/backend URLs don't match `.env` values | Confirm `CLIENT_URL` in backend `.env` is `http://localhost:5173` and `VITE_API_URL` in frontend `.env` is `http://localhost:5000/api` |
| Google/Facebook button shows "not configured" | You haven't added OAuth keys yet | Follow Step 5 above, or just ignore and use email/password login |

---

## 7. Moving from SQLite to PostgreSQL / Supabase later

The backend currently uses a local SQLite file (`backend/tasknova.db`) so it runs with zero setup. When you're ready for production:
1. Create a Supabase project (or any PostgreSQL database) and get its connection string
2. Replace `better-sqlite3` calls in `db.js` and the route files with a Postgres client (e.g. `pg` or Supabase's JS client) — the table structure (`users`, `tasks`) stays the same
3. Set the connection string as an environment variable and deploy the backend (e.g. Render, Railway) and frontend (e.g. Vercel, Netlify)

---

## Daily use after first setup

Once everything is installed, you only need two commands each time you want to run the app:

```bash
# Terminal 1
cd tasknova/backend && npm start

# Terminal 2
cd tasknova/frontend && npm run dev
```

Then visit http://localhost:5173
