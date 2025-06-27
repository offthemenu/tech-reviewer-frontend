# wA Frontend Technical Reviewer

A lightweight internal web app that enables frontend operators to review wireframe PDFs and leave technical feasibility comments per UI component.

## 🛠 Stack

- **Frontend:** React + Vite + Material UI (deployed on Vercel)
- **Backend:** FastAPI (Python) + SQLite (deployed on Render)
- **Database:** SQLite3 (embedded in backend instance)
- **PDF Rendering:** `@react-pdf-viewer`
- **Export Tools:** Markdown + PDF (via `html2pdf.js`)

---

## 🚀 Features

- 📄 Upload and render wireframe PDFs
- 🎛 Dynamically filter by project, device, and page
- 📝 Submit and review UI-level technical comments
- 📋 Export comments as:
  - Markdown (Jira/Confluence-friendly)
  - Downloadable PDF
- ✅ Mobile-friendly and zero-auth (for internal use only)

---

## 🧱 Folder Structure

```bash
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/ (axios instance)
│   └── main.tsx
└── .env             # VITE_API_BASE_URL=https://your-api.onrender.com

backend/
├── main.py
├── models.py
├── database.py
├── requirements.txt
└── app.db           # SQLite3
```

---

## ⚙️ Local Development

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

Environment variable:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

SQLite DB will auto-create if not found.

---

## ☁️ Deployment

### 🔹 Frontend (Vercel)

- Connect to GitHub
- Set env var: `VITE_API_BASE_URL=https://tech-reviewer-backend.onrender.com`
- Vercel auto-deploys on every push

### 🔹 Backend (Render)

- Create new **Web Service**
- Python build command:
  ```
  pip install -r requirements.txt
  ```
- Start command:
  ```
  uvicorn main:app --host 0.0.0.0 --port 10000
  ```

---

## 📦 API Routes

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/upload_pdf`         | Uploads a PDF file                 |
| GET    | `/wireframe`          | Fetches dropdown data              |
| POST   | `/add_comment`        | Adds a new UI comment              |
| GET    | `/comments`           | Lists comments by project/device   |
| DELETE | `/comment/{id}`       | Deletes comment by ID              |

---

## ✍️ Author

**Chang Ian**  
💼 [offthemenu](https://github.com/offthemenu)  
📫 Open to feedback & contributions

---

## 🧹 TODOs (Phase 3+)

- [ ] Add user login (Auth0 or SSO)
- [ ] Make comments editable
- [ ] Add file versioning for PDFs
- [ ] Display visual comment pins on wireframe pages

---

## 📄 License

MIT – for internal use only unless otherwise specified.
