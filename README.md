📌 Event Check-In App
🚀 Overview

This is a full-stack event check-in system built for an internship assessment.
Users can:

Login with email (auto-registers if not existing)

View all events (with attendees count)

Check into an event

See attendee list update in real-time (via Socket.IO)

Logout to clear session

🏗️ Tech Stack

Backend

Node.js, Express

Apollo Server (GraphQL)

Prisma ORM + PostgreSQL

JWT Authentication

Socket.IO (real-time updates)

Frontend

React Native (Expo)

React Query (data fetching & caching)

GraphQL Request client

Zustand (auth state management)

React Navigation

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/event-checkin-app.git
cd event-checkin-app

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/eventdb?schema=public"
JWT_SECRET="supersecret"


Run Prisma migrations & seed database:

npx prisma migrate dev --name init
npx prisma db seed


Start backend:

npm run dev


Backend runs on 👉 http://localhost:4000/graphql

3️⃣ Frontend Setup
cd ../frontend
npm install


Start Expo app:

npm run web       # for browser
npm run android   # for emulator/device

📱 Features

Login Screen → Enter email → receive JWT token

Events List → View upcoming events with real-time attendee count

Event Detail → See event info + attendees, check in with one click

Logout → Clear token and return to login

Real-time Updates → Attendee counts update instantly across all clients

🧪 Example GraphQL Queries
Login
mutation {
  login(email: "test@example.com") {
    token
    user {
      id
      email
      name
    }
  }
}

Get Events
query {
  events {
    id
    name
    location
    date
    attendees {
      id
    }
  }
}

Check-In
mutation {
  checkIn(eventId: "event_id_here") {
    id
    attendees {
      id
      email
    }
  }
}

🎥 How to Demo

Start the backend

cd backend
npm run dev


Server runs on http://localhost:4000/graphql

Start the frontend

cd frontend
npm run web


Open http://localhost:8081 (or whichever port Expo shows).

Login

Enter any email (e.g., test@example.com) → User auto-registers.

Token is stored automatically.

View Events

You’ll see a list of seeded events (name, location, date, attendee count).

Check In

Click on an event → Go to detail screen → Press Check In.

Attendee list updates instantly for all connected clients.

Real-Time Update Test

Open the app in two browser windows.

Check in from one window → See attendee count update in the other.

Logout

Press the Logout button → returns to Login screen.

✅ Assessment Checklist

 Backend with GraphQL + Prisma

 User Login (JWT-based)

 Events Query & Detail

 Check-In Mutation

 Frontend (Expo React Native) with Auth Flow

 Real-time updates (Socket.IO)

 Logout support

 Demo-ready 🚀

✨ Commit & push:

git add README.md
git commit -m "Added README with setup + demo instructions"
git push origin main
