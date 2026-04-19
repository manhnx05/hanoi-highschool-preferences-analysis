# 🚀 UPGRADE PLAN: Vanilla JS → Next.js 14 + TypeScript

## 📋 Phân tích hiện trạng

### Backend ✅ (Giữ nguyên - Chất lượng tốt)
- FastAPI + Pandas
- 15+ RESTful endpoints
- Statistical analysis, regression, correlation
- **Vấn đề**: Dữ liệu chỉ 49/120 trường (cần bổ sung)

### Frontend ⚠️ (Cần nâng cấp)
- Vanilla JS + Bootstrap 5 + Chart.js
- 5 trang: index, rankings, compare, school-detail, advanced-analytics
- **Vấn đề**: Code lặp, khó maintain, không có state management

## 🎯 Kế hoạch nâng cấp

### Phase 1: Setup Next.js Project ✅
- [x] Tạo Next.js 14 với App Router
- [x] Setup TypeScript
- [x] Setup Tailwind CSS (thay Bootstrap)
- [x] Setup Chart.js/Recharts
- [x] Setup Zustand (state management)

### Phase 2: Migrate Pages
- [ ] Home page (index.html → app/page.tsx)
- [ ] Rankings page (rankings.html → app/rankings/page.tsx)
- [ ] Compare page (compare.html → app/compare/page.tsx)
- [ ] School Detail (school-detail.html → app/school/[id]/page.tsx)
- [ ] Advanced Analytics (advanced-analytics.html → app/analytics/page.tsx)

### Phase 3: Components & Features
- [ ] Shared components (Navbar, Footer, KPI Cards, Charts)
- [ ] API client với React Query
- [ ] Dark mode với next-themes
- [ ] Loading states & Error boundaries
- [ ] SEO optimization

### Phase 4: Testing & Deployment
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Deploy to Vercel

## 📦 Tech Stack

### Frontend (New)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts (React-native)
- **State**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes

### Backend (Keep)
- **Framework**: FastAPI
- **Data**: Pandas
- **Server**: Uvicorn

## 🔄 Migration Strategy

1. **Parallel Development**: Giữ frontend cũ, build Next.js song song
2. **Incremental Migration**: Migrate từng page một
3. **API Compatibility**: Giữ nguyên API endpoints
4. **Data Validation**: Kiểm tra data integrity
5. **Git Commits**: Commit từng thay đổi nhỏ

## 📊 Data Quality Issues

### Cần fix:
1. **Thiếu dữ liệu**: Chỉ 49/120 trường (thiếu 71 trường)
2. **CSV structure**: OK - 8 columns
3. **Data types**: OK - đã được validate trong backend

## ✅ Checklist

- [x] Phân tích hiện trạng
- [x] Lập kế hoạch nâng cấp
- [ ] Setup Next.js project
- [ ] Migrate components
- [ ] Test & validate
- [ ] Deploy

## 🎯 Timeline

- **Day 1**: Setup + Home page migration
- **Day 2**: Rankings + Compare pages
- **Day 3**: School Detail + Analytics
- **Day 4**: Testing + Optimization
- **Day 5**: Deployment

---

**Status**: 🟡 In Progress
**Last Updated**: 2026-04-19
