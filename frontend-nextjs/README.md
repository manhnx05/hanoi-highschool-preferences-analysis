# 🎓 EduData Analytics - Next.js Frontend

Modern analytics dashboard for Hanoi High School Admissions 2024-2025 data.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Theme**: next-themes
- **Icons**: Lucide React

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## 📁 Project Structure

```
frontend-nextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # React Query & Theme providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── home/             # Home page components
│   ├── navbar.tsx        # Navigation bar
│   └── footer.tsx        # Footer
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🎨 Features

- ✅ Server-side rendering (SSR)
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Real-time data fetching
- ✅ Interactive charts
- ✅ Search and filter
- ✅ Type-safe with TypeScript
- ✅ Optimized performance

## 🔗 API Integration

The frontend connects to the FastAPI backend running on `http://127.0.0.1:8000`.

Make sure the backend is running before starting the frontend.

## 📊 Pages

- **Home** (`/`) - Overview with KPIs, charts, and data table
- **Rankings** (`/rankings`) - Top 20 schools by various metrics
- **Compare** (`/compare`) - Side-by-side school comparison
- **School Detail** (`/school/[id]`) - Detailed school information
- **Analytics** (`/analytics`) - Advanced statistical analysis

## 🚢 Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📝 License

MIT

---

Built with ❤️ using Next.js 14
