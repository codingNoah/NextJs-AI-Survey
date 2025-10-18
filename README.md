# 🧠 MindProbe – AI-Powered Survey & Data Insight Platform

Link: https://mind-probe.vercel.app/

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?style=for-the-badge&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)
![OpenAI](https://img.shields.io/badge/OpenAI-Integration-green?style=for-the-badge&logo=openai)

> **MindProbe** is an AI-driven survey and dataset analytics tool that lets users generate smart surveys, collect responses, upload datasets, and visualize insights through charts — all powered by OpenAI.

---

## 🎯 Objective

MindProbe aims to **simplify data collection and analysis** by combining:

- 🧠 **AI-generated survey questions**
- 📊 **Dynamic insights from uploaded CSV datasets**
- 🎨 **Interactive data visualization dashboard**
- 🔐 **Secure authentication using NextAuth & Google OAuth**

Built with the modern **Next.js App Router**, **TypeScript**, **Prisma ORM**, and **Recharts**.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/codingNoah/NextJs-AI-Survey.git
cd MindProbe

# Prisma
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/mindprobe"

# Auth
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

npx prisma db push

npm run dev

Visit ➡️ http://localhost:3000

🗂️ Project Structure
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── generate-questions/route.ts
│   │   ├── submit-responses/route.ts
│   │   ├── insights/route.ts
│   │   └── submit-responses/route.ts
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── QuestionGenerator.tsx
│   ├── DataUpload.tsx
│   ├── DraggableCharts.tsx
│   ├── LoadingWrapper.tsx
│   └── ui/
│
├── lib/
│   ├── prisma.ts
│   ├── openai.ts
│   ├── utils.ts
│   ├── validation/
│   │   ├── fileValidatorSchema.ts
│   │   └── questionValidatorSchema.ts
│   └── auth/
│       └── authOptions.ts
│
├── providers/
│   ├── ThemeProvider.tsx
│   └── ScrollProvider.tsx
│
├── __tests__/
│   ├── insightGenerator.test.ts
│   └── uploadRoute.test.ts
│
└── prisma/
    └── schema.prisma
```

🧩 Database Models (Prisma)

User
model User {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String?
email String? @unique
password String?
image String?
surveys Survey[]
responses Response[]
datasets Dataset[]
}

Survey
model Survey {
id String @id @default(auto()) @map("\_id") @db.ObjectId
title String
questions String[]
createdAt DateTime @default(now())
userId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
responses Response[]
}

Response
model Response {
id String @id @default(auto()) @map("\_id") @db.ObjectId
answers String[]
createdAt DateTime @default(now())
surveyId String @db.ObjectId
survey Survey @relation(fields: [surveyId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

Dataset
model Dataset {
id String @id @default(auto()) @map("\_id") @db.ObjectId
filename String
summary Json
createdAt DateTime @default(now())
userId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

🧠 API Endpoints

| Method     | Endpoint                  | Description                            |
| ---------- | ------------------------- | -------------------------------------- |
| `POST`     | `/api/generate-questions` | Generate survey questions using OpenAI |
| `POST`     | `/api/survey`             | Create a new survey                    |
| `POST`     | `/api/submit-responses`   | Submit user responses                  |
| `POST`     | `/api/upload`             | Upload and parse CSV datasets          |
| `GET`      | `/api/insights?id=123`    | Get dataset insight (AI + stats)       |
| `GET/POST` | `/api/auth/[...nextauth]` | Authentication (Google & Credentials)  |

🖥️ Frontend Pages

| Page         | Path                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| `/`          | Landing page with CTA                     |             |
| `/dashboard` | Displays uploaded data and insights       |             |
| `/survey`    | AI-powered survey generation page         |             |
| `/responses` | Shows collected user responses            |             |
| `/auth`      | Google OAuth and credentials login/signup |             |

📊 Data Visualization

Built with Recharts

Includes:

Bar Chart: Satisfaction / usage frequency

Line Chart: Trend analysis

Pie Chart: Recommendation ratios

Draggable layout: via react-grid-layout

Dynamic stats cards: total records, columns, and datapoints

🧩 Testing
Unit Tests (Jest)

Test OpenAI insight generation mock:
🧩 Testing
Unit Tests (Jest)

Test OpenAI insight generation mock:

Example: /src/**tests**/insightGenerator.test.ts

🧠 AI Insight Generation
File upload flow:

Upload CSV → validated via Zod schema

Stored in /tmp → parsed server-side

Summary generated via:

computeDatasetStats() → averages, counts, correlations

generateDataSetInsight() → AI textual summary (OpenAI GPT-4o-mini)

🔐 Authentication

Google OAuth2.0 via NextAuth

Credentials Provider with bcrypt password hashing

JWT-based sessions (strategy: "jwt")

Middleware-protected routes with loading wrapper

🚀 Deployment (Vercel)

Push to GitHub

git push origin main

Go to Vercel Dashboard

Import your GitHub repository

Add environment variables (from .env)

Deploy automatically 🎉

🧪 Example .env.local

DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="..."

🧰 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build production app     |
| `npm run start` | Run production server    |
| `npm run lint`  | Lint code with ESLint    |
| `npm run test`  | Run Jest unit tests      |

📚 Technologies Used

Next.js 15 (App Router)

React 19

TypeScript

Prisma ORM + MongoDB

NextAuth (Google + Credentials)

OpenAI API

Zod + React Hook Form

Recharts + Framer Motion

Socket.io (planned for AI insight streaming)

Jest (testing)

Vercel (deployment)

💬 Contributing

Fork the repo

Create a feature branch

git checkout -b feature/your-feature

Commit your changes

git commit -m "Add new feature"

Push and open a PR 🚀

🌟 Star the Repo if You Like It!
