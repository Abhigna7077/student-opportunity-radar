# Scraper & Data Normalization Module

This directory contains data transformation and normalization scripts for the **Student Opportunity Radar** platform.

---

## 📋 Overview

The normalization pipeline takes raw, heterogeneous scraped JSON data collected via Bright Data (from platforms like Unstop) and cleans, standardizes, and normalizes it into a consistent schema for downstream processing.

---

## 🗂️ File Pipeline

```
data/raw/unstop_raw.json ──► scraper/normalizeOpportunities.js ──► data/opportunities.json
```

* **Input File**: `data/raw/unstop_raw.json` (18 raw records scraped from Unstop Hackathons)
* **Script**: `scraper/normalizeOpportunities.js`
* **Output File**: `data/opportunities.json` (Cleaned & validated schema)

---

## 🔄 Normalized Schema Specification

Each opportunity conforms to the following schema:

```json
{
  "id": "unstop-001",
  "title": "Hackathon Title",
  "organizer": "Organizer Name",
  "type": "Hackathon",
  "eligibility": ["Undergraduate", "Engineering Students"],
  "skills": ["Software Development", "Artificial Intelligence"],
  "deadline": "04 Sep 26, 12:00 AM IST",
  "mode": "Online",
  "location": null,
  "prize": "₹ 60,000",
  "description": null,
  "applicationUrl": "https://unstop.com/hackathons/...",
  "sourceWebsite": "Unstop",
  "teamSize": "1 - 4 Members"
}
```

### Field Transformation Rules

| Raw Field | Normalized Target | Normalization Logic |
| :--- | :--- | :--- |
| `title` | `title` | Trimmed string or `null` |
| `organizer` | `organizer` | Trimmed string or `null` |
| (Category) | `type` | Set to `"Hackathon"` |
| `eligibility` | `eligibility` | Clean array of strings (`[]` if missing) |
| `skills_categories` | `skills` | Clean array of strings (`[]` if missing) |
| `deadline` | `deadline` | Preserved raw string or `null` (unparsed) |
| `mode` / `location` | `mode` | Standardized `"Online"` / `"Offline"` / string |
| `location` | `location` | Set to `null` (raw field contains mode strings) |
| `prize_amount` | `prize` | Trimmed currency string or `null` |
| (None) | `description` | Set to `null` (no fabricated text) |
| `application_url` | `applicationUrl` | Primary destination URL |
| (Source) | `sourceWebsite` | Set to `"Unstop"` |
| `team_size` | `teamSize` | Preserved team size string or `null` |
| (Index) | `id` | Zero-padded sequential ID (`unstop-001`, `unstop-002`, ...) |
| `input` | *(Removed)* | Stripped Bright Data scraping metadata |

---

## 🚀 How to Run Normalization

Execute the normalization script from the project root:

```bash
node scraper/normalizeOpportunities.js
```
