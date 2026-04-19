# 🎓 EduData Analytics

Comprehensive analysis of Hanoi High School Admissions 2024-2025 data for **120 public schools**.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-green)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Quick Start

### Option 1: Use Batch Files (Windows)
```bash
start.bat    # Start both servers
open.bat     # Open browsers
stop.bat     # Stop all servers
```

### Option 2: Manual Start

**Backend (FastAPI)**
```bash
cd server
python -m uvicorn main:app --reload
```
→ http://127.0.0.1:8000

**Frontend (Next.js)**
```bash
cd client
npm install
npm run dev
```
→ http://localhost:3000

## 📁 Project Structure

```
.
├── server/              # FastAPI backend
│   ├── main.py         # API endpoints
│   ├── schools.csv     # 120 schools data
│   └── requirements.txt
│
├── client/             # Next.js 14 frontend
│   ├── app/           # Pages (App Router)
│   ├── components/    # React components
│   ├── lib/          # Utils & API client
│   └── package.json
│
├── start.bat          # Start servers
├── stop.bat           # Stop servers
├── open.bat           # Open browsers
└── README.md          # This file
```

## 📊 Features

### ✅ Home Page
- **Hero Section** - Gradient effects, CTAs
- **6 KPI Cards** - Real-time statistics
- **Interactive Charts** - Bar (Top 10), Pie (NV distribution)
- **6 Insights** - Data highlights
- **Data Table** - Search, sort, 120 schools
- **Dark/Light Theme** - Smooth toggle
- **Responsive** - Mobile, tablet, desktop

### 📈 Data Analysis
- Competition ratio (Tỷ lệ chọi)
- Aspirations NV1, NV2, NV3
- Admission quota (Chỉ tiêu)
- Statistical analysis
- Correlation matrix
- Regression analysis

## 🎯 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Theme**: next-themes
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Data**: Pandas
- **Server**: Uvicorn
- **API**: RESTful (15+ endpoints)

## 🔧 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd server
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📊 API Endpoints

### Schools
- `GET /api/schools` - Get all schools (with filters)
- `GET /api/schools/{id}` - Get school by ID
- `GET /api/school-detail/{id}` - Get detailed info

### Statistics
- `GET /api/stats` - Overall statistics
- `GET /api/distribution` - Ratio distribution
- `GET /api/analysis` - Advanced analysis
- `GET /api/regression` - Regression analysis

### Rankings
- `GET /api/rankings` - Rankings by category
- `GET /api/top` - Top N schools
- `GET /api/compare` - Compare schools

**API Documentation**: http://127.0.0.1:8000/docs

## 🧪 Testing

### Quick Test (5 minutes)
1. Run `start.bat` or start servers manually
2. Run `open.bat` or open http://localhost:3000
3. Test search: Type "Phan" in search box
4. Test sort: Click "Tỷ lệ chọi" column
5. Test theme: Click 🌙/☀️ icon
6. Test responsive: Resize browser

### Expected Results
- ✅ 120 schools displayed
- ✅ Search filters real-time
- ✅ Sort works on all columns
- ✅ Theme toggles smoothly
- ✅ Charts render correctly

## 📊 Sample Data

### Top 5 Most Competitive Schools
1. **Yên Hòa** - Ratio: 3.36
2. **Phan Đình Phùng** - Ratio: 3.00
3. **Kim Liên** - Ratio: 2.59
4. **Nhân Chính** - Ratio: 2.62
5. **Cầu Giấy** - Ratio: 2.14

### Statistics
- Total Schools: **120**
- Total Quota: **~80,000**
- Total NV1: **~130,000**
- Average Ratio: **~1.6**
- Highly Competitive (≥2): **~40**

## 📈 Performance

| Metric | Value |
|--------|-------|
| First Load | ~800ms |
| Code Splitting | ✅ Automatic |
| Type Safety | ✅ 100% |
| SEO | ✅ Excellent (SSR) |
| Lighthouse | 95+ |

## 🚢 Deployment

### Vercel (Frontend)
```bash
cd client
vercel
```

### Docker (Optional)
```bash
# Backend
docker build -t edudata-server ./server
docker run -p 8000:8000 edudata-server

# Frontend
docker build -t edudata-client ./client
docker run -p 3000:3000 edudata-client
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## 🐛 Troubleshooting

### Frontend not loading data
```bash
# Check backend
curl http://127.0.0.1:8000/api/schools

# Restart
cd server
python -m uvicorn main:app --reload
```

### npm install errors
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Port in use
```bash
# Backend (change port)
uvicorn main:app --reload --port 8001

# Frontend (change port)
npm run dev -- -p 3001
```

## 📝 Development

### Add new page
```bash
cd client/app
mkdir new-page
touch new-page/page.tsx
```

### Add new API endpoint
```python
# server/main.py
@app.get("/api/new-endpoint")
def new_endpoint():
    return {"message": "Hello"}
```

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ using Next.js 14 + FastAPI

## 🔗 Links

- **Frontend**: http://localhost:3000
- **Backend**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs
- **Repository**: https://github.com/manhnx05/hanoi-highschool-preferences-analysis

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2026-04-19
