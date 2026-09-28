<div align="center">

  <h1>✈️ SkyHigh</h1>
  <h3>Plan Smarter. Travel Better.</h3>

  <p>
    Your AI-powered travel planning platform — personalized itineraries, curated destinations, and seamless booking.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  </p>

</div>

---

## 🚀 Overview

**SkyHigh** is a modern AI-powered travel planning platform. Tell SkyHigh where you want to go, choose your preferences and budget, and our Gemini AI generates a complete day-by-day itinerary — including activities, restaurants, and transport options.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Trip Planner** | Gemini AI generates personalized itineraries based on your interests, budget, and style |
| 📊 **Trip Dashboard** | Complete command center for active trips, reward points, stats, and quick actions |
| 🗂️ **My Trips Workspace** | Dedicated library to view, filter, favorite, duplicate, edit, and manage all your trips |
| 🧭 **Curated Exploration** | Explore world destinations by category, with seasonality guides, culinary highlights & top spots |
| 🏨 **Hotel & Flight Search** | Search and filter real travel inventory with flexible sorting and budget guidance |
| 🔐 **Firebase Auth** | Secure email/password and Google sign-in with persistent sessions and graceful offline fallback |
| 👤 **User Profiles** | Save trips, view booking history, manage preferences, and track reward points |
| 📱 **Responsive Design** | Modern, premium light-themed UI with fluid responsiveness, glassmorphism, and Framer Motion |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (Light Theme Palette) |
| Animations | Framer Motion, GSAP |
| Auth & DB | Firebase Auth + Firestore |
| AI | Google Gemini API |
| State | Zustand (with persistent storage) |

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- A Firebase project (with Auth and Firestore enabled - optional for guest mode)
- A Google Gemini API key (optional, fallback sample data supported)

### Installation

```bash
# 1. Clone and install
git clone <your-repo-url>
cd SkyHigh-Trip-Guide
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
app/
├── api/           # API routes (AI trip planner, chat, day regeneration)
├── ai-trip/       # AI Trip Planner form & loading state
├── dashboard/     # Professional travel dashboard & quick stats
├── trips/         # Dedicated My Trips management workspace
├── explore/       # Curated destination guides & experiences
├── plan/          # Plan shortcut (redirects to /ai-trip)
├── login/         # Login page
├── signup/        # Signup page
├── onboarding/    # Multi-step user onboarding flow
├── profile/       # User profile, points & booking history
├── trip/          # Trip result, interactive editing & sharing
├── search/        # Hotel/Flight/Train/Bus/Cab search
├── checkout/      # Booking checkout flow
├── subscription/  # Pro tier upgrades & rewards perks
└── layout.tsx     # Root layout with light styling & SEO metadata
```

components/        # Reusable UI components
lib/               # Firebase, server data, user service
store/             # Zustand global state
types/             # TypeScript interfaces
context/           # React contexts (Auth)
```

---

## 🔐 Environment Variables

See [`.env.example`](.env.example) for all required and optional variables.

**Never commit your `.env` file to version control.**

---

## 📋 Firestore Collections

| Collection | Purpose |
|---|---|
| `users/{uid}` | User profile, preferences, points |
| `users/{uid}/bookings` | User booking history |
| `trips/{tripId}` | Shared/saved trips |
| `flights` | Flight inventory |
| `hotels` | Hotel inventory |
| `trains` | Train inventory |
| `buses` | Bus inventory |
| `cabs` | Cab inventory |
