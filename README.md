# 🎯 Student Opportunity Radar

> **Scrape-Verse Hackathon Project**

Student Opportunity Radar is a personalized opportunity discovery platform for students.

It collects opportunities such as **hackathons, internships, competitions, scholarships, and fellowships**, cleans and organizes the scraped data, extracts deadlines, and recommends relevant opportunities based on a student's **skills, interests, profile, and preferred mode**.

---

## 🔗 Live Demo

**Live Website:**  
https://student-opportunity-radar.vercel.app

**GitHub Repository:**  
https://github.com/Abhigna7077/student-opportunity-radar

---

## ✨ Key Features

- 🔎 **Search Opportunities** — Find opportunities using keywords.
- 🏷️ **Smart Filters** — Filter by type, skills, and online/offline mode.
- 🎯 **Personalized Matching** — Match opportunities with a student's profile and skills.
- 📊 **Match Percentage** — See how well each opportunity matches the student's profile.
- 💡 **Match Reasons** — Understand why an opportunity is recommended.
- 📅 **Deadline Extraction** — Convert scraped deadline information into a standard date format.
- ⏰ **Dynamic Deadline Status** — Shows statuses such as `Due today`, `X days left`, and `Deadline passed`.
- 🔗 **Direct Application Links** — Apply directly through the original opportunity source.
- 💾 **Saved Opportunities** — Save opportunities for later.
- 🌐 **Production Deployment** — Frontend and backend are deployed and accessible online.

---

## 🏗️ How It Works

```text
        Opportunity Sources
               │
               ▼
      Scraping / Data Collection
               │
               ▼
       Data Normalization
               │
               ▼
     Deadline Parsing & Cleaning
               │
               ▼
       opportunities.json
               │
               ▼
       Express REST API
            (Render)
               │
               ▼
      React + Vite Frontend
            (Vercel)
               │
               ▼
       Student Opportunity Radar
