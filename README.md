# SubScout

A fullstack subscription tracking app built with React, Node.js, and Supabase.

# Description

Sub Scout is a modern, full-stack web application designed to help users track and analyze their paid subscriptions. By calculating a "Value Score" based on monthly costs and personal ratings, it provides actionable insights to help users identify overpriced services and save money.

## ✨ Features

- **Authentication:** Secure user login and registration powered by Supabase Auth.
- **Dynamic Dashboard:** Real-time metrics including Total Monthly Spend and True Average Rating.
- **Value Score Analysis:** Visual indicators (Green/Amber/Red badges and Waste Meters) to highlight the cost-effectiveness of each subscription.
- **Responsive UI:** A clean, glassmorphism-inspired design built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Lucide-React.
- **Backend:** Node.js, Express.js.
- **Database & Auth:** PostgreSQL via Supabase.
- **Architecture:** Strict MVC (Model-View-Controller) structure on the server.

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/subScout.git
\`\`\`

### 2. Setup the Server

\`\`\`bash
cd server
npm install

# Create a .env file with your Supabase credentials (SUPABASE_URL, SUPABASE_KEY)

npm run dev
\`\`\`

### 3. Setup the Client

\`\`\`bash
cd ../client
npm install

# Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

npm run dev
\`\`\`
