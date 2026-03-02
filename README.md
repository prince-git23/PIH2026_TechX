# Annsetu (PIH2026_TechX)

Annsetu is a web platform that connects food donors (hostels, hotels, lawns) with NGOs to coordinate safe pickup and distribution of surplus food.

## Features

- Auth (login/register) with role support (sender/receiver)
- Live donation feed (create + accept/reject flows)
- Verified connections view
- Secure messaging between donors and NGOs
- Profile management + basic trust/verification UI
- Mobile responsive UI (Android/iPhone) with a consistent navbar logo on app pages

## Tech Stack

- Frontend: HTML, CSS, JavaScript (no framework)
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth

## Repo Layout

- `Frontend`: static frontend pages + JS modules
- `Backend`: Express API server

## Run Locally

### 1) Frontend (static)

```powershell
cd Frontend
npm install
npm run start
```

This starts `live-server` (default: `http://127.0.0.1:3000`) and serves `index.html`.

### 2) Backend (API)

Create `Backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the server:

```powershell
cd Backend
npm install
npm start
```

## API Configuration (Frontend)

Frontend JS files currently call a hosted API URL (Render). If you run the backend locally, update these constants to your local API base (example `http://localhost:5000/api`):

- `Frontend/js/auth.js`
- `Frontend/js/feed.js`
- `Frontend/js/connections.js`
- `Frontend/js/messages.js`
- `Frontend/js/profile.js`

## Scripts

Frontend:

- `npm run start` (live-server on port 3000)
- `npm run lint:js`
- `npm run lint:css`

Backend:

- `npm start`
