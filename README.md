# Student Opportunity Radar

> **Scrape-Verse Hackathon Project**

Student Opportunity Radar is a platform that automatically collects student opportunities (such as hackathons, internships, competitions, scholarships, and fellowships), cleans scraped data, extracts deadlines, and recommends personalized opportunities to students based on their profile, skills, interests, and deadlines.

---

## 🏗️ Project Architecture & Planned Workflow

```
[ Unstop & Opportunity Sources ]
               │
               ▼ (Scraping with Bright Data)
        [ scraper/ ]
               │
               ▼ (Clean & Parse Deadlines)
        [ data/opportunities.json ]
               │
               ▼ (API & Match Engine)
        [ backend/ (Express API) ]
               │
               ▼ (REST Endpoints)
        [ frontend/ (React + Vite + Tailwind CSS) ]
```

### Planned Roadmap
1. **Frontend**: React + Vite + Tailwind CSS setup & UI components
2. **Backend**: Node.js + Express API setup
3. **Sample Opportunity Data**: Initial dataset schema & seed data
4. **Scraper Integration**: Bright Data collector for Unstop
5. **Data Cleaning**: Normalize fields, remove duplicates, filter invalid records
6. **Deadline Parsing**: Standardize date/time formats and active/expired status
7. **Matching Algorithm**: Match opportunities against student profiles & skills
8. **Frontend/Backend Integration**: Connect UI with API endpoints
9. **Final UI & Polish**: Opportunity cards, filters, search, and testing

---

## 📁 Project Structure

```
student-opportunity-radar/
├── frontend/             # React + Vite + Tailwind CSS client
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/              # Node.js + Express REST API
│   ├── src/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── scraper/              # Scraping scripts & Bright Data integration
│   └── .gitkeep
├── data/                 # Opportunities data storage
│   ├── raw/              # Unprocessed scraped payloads
│   └── opportunities.json# Cleaned opportunity records
├── .gitignore
├── package.json          # Root package scripts
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Backend**: Node.js, Express, CORS, Dotenv
- **Scraping**: Bright Data (Target: Unstop)
- **Data Storage**: Local JSON storage
- **Matching Engine**: JavaScript profile matching algorithm
- **Version Control**: Git & GitHub

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Frontend Setup & Run
```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 2. Backend Setup & Run
```bash
# Navigate to backend
cd backend

# Install dependencies (if not already installed)
npm install

# Start backend server
npm run dev
```
The backend API will start at `http://localhost:5000`.

### 3. Root Level Convenience Commands
From the project root directory:
```bash
# Run frontend dev server
npm run dev:frontend

# Run backend dev server
npm run dev:backend

# Build frontend for production
npm run build:frontend
```
