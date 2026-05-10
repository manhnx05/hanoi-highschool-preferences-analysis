# 🚀 Hướng dẫn Deploy lên Vercel

## 📋 Yêu cầu
- Tài khoản GitHub
- Tài khoản Vercel (miễn phí)
- Repository đã push lên GitHub

## 🎯 Phương án Deploy

### Phương án 1: Deploy Frontend + Backend riêng biệt (Khuyến nghị)

#### A. Deploy Backend (FastAPI)

1. **Tạo project mới trên Vercel**
   - Truy cập: https://vercel.com/new
   - Import repository GitHub của bạn
   - Chọn **Root Directory**: `server`
   - Framework Preset: **Other**

2. **Cấu hình Build Settings**
   ```
   Build Command: (để trống)
   Output Directory: (để trống)
   Install Command: pip install -r requirements.txt
   ```

3. **Environment Variables**
   - Không cần thiết lập gì thêm

4. **Deploy**
   - Click "Deploy"
   - Lưu lại URL backend (VD: `https://your-backend.vercel.app`)

#### B. Deploy Frontend (Next.js)

1. **Tạo project mới trên Vercel**
   - Import repository GitHub
   - Chọn **Root Directory**: `client`
   - Framework Preset: **Next.js**

2. **Cấu hình Build Settings**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: URL backend từ bước A (VD: `https://your-backend.vercel.app`)

4. **Deploy**
   - Click "Deploy"
   - Frontend sẽ tự động kết nối với backend

### Phương án 2: Deploy Monorepo (Nâng cao)

1. **Cấu hình vercel.json** (đã có sẵn)
2. **Deploy từ root directory**
3. **Thiết lập environment variables**

## 🔧 Sau khi Deploy

### 1. Kiểm tra Backend
- Truy cập: `https://your-backend.vercel.app/docs`
- Kiểm tra API endpoints hoạt động

### 2. Kiểm tra Frontend
- Truy cập: `https://your-frontend.vercel.app`
- Test các trang: Tổng quan, Xếp hạng, So sánh, Phân tích, Data Science

### 3. Cập nhật CORS (nếu cần)
Nếu gặp lỗi CORS, cập nhật `server/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Lưu ý quan trọng

### 1. **Vercel Serverless Limits**
- Timeout: 10 giây (Hobby plan)
- Memory: 1024 MB
- File size: 50 MB

### 2. **Database**
- CSV file sẽ được đọc mỗi lần request
- Cân nhắc dùng database thực (PostgreSQL, MongoDB) cho production

### 3. **Environment Variables**
- Không commit file `.env.local` vào Git
- Thiết lập trên Vercel Dashboard

### 4. **Custom Domain** (Optional)
- Vercel Settings → Domains
- Thêm domain của bạn

## 🐛 Troubleshooting

### Lỗi: "Module not found"
- Kiểm tra `requirements.txt` (backend)
- Kiểm tra `package.json` (frontend)

### Lỗi: "API not responding"
- Kiểm tra `NEXT_PUBLIC_API_URL` đã đúng chưa
- Kiểm tra CORS settings

### Lỗi: "Build failed"
- Xem logs trên Vercel Dashboard
- Kiểm tra syntax errors

## 📚 Tài liệu tham khảo
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI on Vercel](https://vercel.com/guides/using-fastapi-with-vercel)

## 🎉 Hoàn thành!
Sau khi deploy thành công, chia sẻ link với mọi người:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.vercel.app/docs`
