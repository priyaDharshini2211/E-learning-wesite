# Srinav Educational Institution — Learning Portal

A public home page plus a role-based e-learning management system with a Django REST API backend and a React (Vite) frontend.

## Tech stack

- **Backend**: Django 5, Django REST Framework, SimpleJWT, SQLite
- **Frontend**: React 19, Vite, React Router, Axios, Bootstrap 5

## Roles

| Role | Access |
|---|---|
| **Admin** | Create/manage all user accounts (the only role that can register users), manage courses, view all admissions, assign admissions to a BDE |
| **BDE** | View admissions assigned to them and update the follow-up status (New → Contacted → Interested → Converted/Lost) |
| **Lead** | Submit the admission form for a new student (name, course, fees, degree, mobile, email) |
| **Course Trainer** | View their assigned courses and students, mark attendance, upload/manage videos and study material, view and respond to student feedback |
| **Student** | View course completion status, study material/videos, attendance history, and leave feedback |

There is a single login page; after authenticating, the app redirects each user to their own role's dashboard.

## Project structure

Everything on the backend lives in a single Django app, `backend_app`, using plain function-based views (`@api_view`) and manual role checks rather than DRF viewsets/permission classes:

```
backend/
  backend/          project settings, root urls.py
  backend_app/
    models.py       every model: AppUser, Course, Video, StudyMaterial, Enrollment, Attendance, Feedback, Admission
    serializers.py  one serializer per model
    views.py        function-based views (login, users, courses, videos, materials, enrollments, attendance, feedback, admissions)
    authentication.py  custom JWT authentication that resolves tokens against AppUser
    urls.py         flat list of API routes
    management/commands/seed_admin.py
frontend/
  src/api/       axios client + per-domain API modules
  src/context/   auth context (JWT storage, login/logout)
  src/routes/    route guards (auth + role)
  src/layouts/   dashboard shell (sidebar/topbar)
  src/components/ shared UI components
  src/pages/     pages grouped by role (admin, bde, lead, trainer, student, auth)
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # adjust values as needed
python manage.py migrate
python manage.py seed_admin   # creates the first admin account
python manage.py runserver
```

The seeded admin credentials are set via `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` in `.env` (defaults: `admin` / `Admin@12345`). Every other account is created by that admin from the Users page.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend expects the API at `http://127.0.0.1:8000/api` (see `VITE_API_URL` in `frontend/.env` if you need to override it).

## Notes

- Uploaded videos and study material are stored under `backend/media/` and served at `/media/` in development.
- Only the Admin role can create accounts for any other role — there is no public sign-up.
- If you inherited a `.env` with real email credentials, rotate them; secrets should never be committed in plaintext.
