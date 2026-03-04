# ResumeGen

A full-stack web application for creating, managing, and exporting professional resumes and portfolio websites.

## Features

### Resume Builder

- **Interactive Editor** — Create and edit resumes with sections for personal info, education, experience, projects, and skills

### Export Options

- **LaTeX Download** — Export your resume as a `.tex` file using a clean, professional template
- **PDF Download** — Compile and download your resume as a PDF via LaTeX
- **Portfolio Website** — Generate a ready-to-deploy React portfolio site as a ZIP file

### Portfolio Themes

- **🌕 Minimal** — Clean, editorial design with typographic focus and subtle animations
- **🌑 Dark Glass** — Modern glassmorphism aesthetic with gradient accents and floating nav

### AI Enhancement

- **Full Resume Enhancement** — AI-powered rewriting of resume bullet points
- **Field-level Enhancement** — Enhance individual text fields inline

### Dashboard

- View all saved resumes with creation and last-edited timestamps
- Download resumes as LaTeX, PDF, or portfolio ZIP directly from the dashboard
- Choose portfolio theme before downloading

## Tech Stack

| Layer                | Technology                             |
| -------------------- | -------------------------------------- |
| **Frontend**         | React, Vite, React Router              |
| **Backend**          | Node.js, Express                       |
| **Database**         | PostgreSQL (Supabase)                  |
| **ORM**              | Prisma                                 |
| **Auth**             | Supabase Auth                          |
| **PDF Generation**   | LaTeX via texlive.net API              |
| **Portfolio Bundle** | Archiver (ZIP), Vite + React templates |

## Project Structure

```
ResumeGen/
├── resumeGen-frontend/          # React + Vite frontend
│   └── src/
│       ├── pages/               # Landing, Login, Dashboard, Editor
│       ├── components/          # Reusable UI components
│       └── utils/               # API client, Supabase config
│
└── resumeGen-backend/           # Express API server
    ├── controllers/             # Route handlers (resume CRUD, export, AI)
    ├── routes/                  # Express route definitions
    ├── middleware/               # Auth middleware
    ├── prisma/                  # Database schema
    ├── utils/                   # LaTeX generator, AI enhancer, portfolio generator
    ├── templates/               # LaTeX resume template
    └── portfolio-templates/     # React portfolio themes (minimal, dark-glass)
```

## API Endpoints

| Method   | Endpoint                    | Description                                |
| -------- | --------------------------- | ------------------------------------------ |
| `POST`   | `/api/resume`               | Create a new resume                        |
| `GET`    | `/api/resume`               | Get all resumes for the authenticated user |
| `GET`    | `/api/resume/:id`           | Get a specific resume                      |
| `PUT`    | `/api/resume/:id`           | Update a resume                            |
| `DELETE` | `/api/resume/:id`           | Delete a resume                            |
| `GET`    | `/api/resume/:id/latex`     | Download resume as LaTeX                   |
| `GET`    | `/api/resume/:id/pdf`       | Download resume as PDF                     |
| `POST`   | `/api/resume/:id/enhance`   | AI-enhance the full resume                 |
| `POST`   | `/api/resume/:id/portfolio` | Generate portfolio ZIP                     |
| `POST`   | `/api/resume/enhance-field` | AI-enhance a single text field             |
