# 🧪 HƯỚNG DẪN TEST HỆ THỐNG

## ✅ Hệ thống đã sẵn sàng!

### 🎯 Trạng thái hiện tại

#### Backend (FastAPI)
- ✅ **Đang chạy** trên http://127.0.0.1:8000
- ✅ Dữ liệu: 120 trường THPT Hà Nội
- ✅ 15+ API endpoints
- ✅ Statistical analysis

#### Frontend (Next.js 14)
- ✅ **Đang chạy** trên http://localhost:3000
- ✅ Modern UI với Tailwind CSS
- ✅ Dark/Light theme
- ✅ Interactive charts
- ✅ Real-time data

---

## 🚀 CÁCH TEST

### 1. Mở Browser

Mở trình duyệt và truy cập:

```
http://localhost:3000
```

### 2. Các tính năng để test

#### ✅ Home Page (Trang chủ)

**Hero Section**
- [ ] Xem tiêu đề "Tuyển sinh THPT Hà Nội 2024–2025"
- [ ] Click vào các nút: "Xem biểu đồ", "Xếp hạng Top 20", "So sánh trường"

**KPI Cards (6 thẻ thống kê)**
- [ ] Tổng số trường: 120
- [ ] Tổng chỉ tiêu: ~80,000
- [ ] Tổng hồ sơ NV1: ~130,000
- [ ] Tỷ lệ chọi cao nhất: 3.36 (Yên Hòa)
- [ ] Tỷ lệ chọi TB: ~1.6
- [ ] Trường cạnh tranh cao: ~40

**Charts Section (Biểu đồ)**
- [ ] Biểu đồ cột: Top 10 trường cạnh tranh nhất
- [ ] Biểu đồ tròn: Phân bổ NV1, NV2, NV3
- [ ] Hover vào biểu đồ để xem chi tiết

**Insights Section (Phân tích)**
- [ ] 6 thẻ insights với dữ liệu nổi bật
- [ ] Trường cạnh tranh nhất
- [ ] Trường nhận nhiều NV1 nhất
- [ ] Tỷ lệ chọi trung bình
- [ ] Trường ít cạnh tranh nhất
- [ ] Trường có chỉ tiêu cao nhất
- [ ] Tổng hồ sơ dịch chuyển

**Data Table (Bảng dữ liệu)**
- [ ] Xem danh sách 120 trường
- [ ] Tìm kiếm trường (VD: "Phan Đình Phùng")
- [ ] Click vào tên cột để sắp xếp
- [ ] Xem tỷ lệ chọi với màu sắc:
  - 🔴 Đỏ: ≥2.5 (Rất cao)
  - 🟡 Vàng: 1.75-2.5 (Cao)
  - 🟢 Xanh: 1.25-1.75 (Trung bình)
  - ⚪ Xám: <1.25 (Thấp)

#### ✅ Theme Toggle (Chuyển đổi giao diện)

- [ ] Click vào icon 🌙/☀️ ở góc phải navbar
- [ ] Xem giao diện chuyển từ Dark → Light
- [ ] Click lại để chuyển Light → Dark

#### ✅ Responsive Design

- [ ] Thu nhỏ cửa sổ browser
- [ ] Xem layout tự động điều chỉnh
- [ ] Test trên mobile (F12 → Toggle device toolbar)

---

## 🔍 TEST API BACKEND

### Mở API Documentation

```
http://127.0.0.1:8000/docs
```

### Test các endpoints:

1. **GET /api/schools** - Lấy danh sách trường
2. **GET /api/stats** - Thống kê tổng quan
3. **GET /api/top?by=ratio&n=10** - Top 10 trường
4. **GET /api/rankings** - Xếp hạng
5. **GET /api/school-detail/1** - Chi tiết trường Phan Đình Phùng

---

## 🎨 TEST FEATURES

### 1. Search (Tìm kiếm)
```
1. Scroll xuống phần "Cơ sở Dữ liệu Đầy đủ"
2. Nhập "Phan" vào ô tìm kiếm
3. Xem kết quả lọc real-time
4. Xóa text → Xem tất cả trường trở lại
```

### 2. Sort (Sắp xếp)
```
1. Click vào cột "Tỷ lệ chọi"
2. Xem danh sách sắp xếp giảm dần
3. Click lại → Sắp xếp tăng dần
4. Thử với các cột khác: Chỉ tiêu, NV1, NV2, NV3
```

### 3. Charts Interaction
```
1. Hover vào biểu đồ cột
2. Xem tooltip hiển thị chi tiết
3. Hover vào biểu đồ tròn
4. Xem phần trăm từng nguyện vọng
```

### 4. Theme Toggle
```
1. Click icon 🌙 (Dark mode)
2. Xem màu nền đổi sang sáng
3. Xem biểu đồ tự động cập nhật màu
4. Click icon ☀️ (Light mode)
5. Xem màu nền đổi sang tối
```

---

## 📊 DỮ LIỆU MẪU

### Top 5 trường cạnh tranh nhất:
1. **Yên Hòa** - Tỷ lệ chọi: 3.36
2. **Phan Đình Phùng** - Tỷ lệ chọi: 3.00
3. **Kim Liên** - Tỷ lệ chọi: 2.59
4. **Nhân Chính** - Tỷ lệ chọi: 2.62
5. **Cầu Giấy** - Tỷ lệ chọi: 2.14

### Thống kê tổng quan:
- Tổng số trường: **120**
- Tổng chỉ tiêu: **~80,000**
- Tổng NV1: **~130,000**
- Tỷ lệ chọi TB: **~1.6**
- Trường cạnh tranh cao (≥2): **~40**

---

## 🐛 TROUBLESHOOTING

### Nếu Frontend không hiển thị dữ liệu:

1. **Kiểm tra Backend đang chạy:**
```bash
# Mở terminal mới
cd backend
python -m uvicorn main:app --reload
```

2. **Kiểm tra Frontend đang chạy:**
```bash
# Mở terminal mới
cd frontend-nextjs
npm run dev
```

3. **Kiểm tra API connection:**
- Mở http://127.0.0.1:8000/api/schools
- Nếu thấy JSON data → Backend OK
- Nếu không → Restart backend

4. **Clear browser cache:**
- Ctrl + Shift + R (Windows)
- Cmd + Shift + R (Mac)

### Nếu có lỗi npm:

```bash
cd frontend-nextjs
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## ✅ CHECKLIST TEST

### Basic Functionality
- [ ] Home page loads successfully
- [ ] All 6 KPI cards display correct data
- [ ] Charts render properly
- [ ] Data table shows 120 schools
- [ ] Search works in real-time
- [ ] Sort works on all columns
- [ ] Theme toggle works smoothly

### Visual Design
- [ ] Dark mode looks good
- [ ] Light mode looks good
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Animations are smooth
- [ ] Colors are consistent

### Performance
- [ ] Page loads fast (<2s)
- [ ] No console errors
- [ ] Charts render smoothly
- [ ] Search is instant
- [ ] Theme toggle is instant

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi test, bạn sẽ thấy:

✅ **Giao diện đẹp** - Modern, professional, responsive
✅ **Dữ liệu chính xác** - 120 trường THPT Hà Nội
✅ **Tương tác mượt** - Search, sort, theme toggle
✅ **Charts đẹp** - Interactive, colorful, informative
✅ **Performance tốt** - Fast loading, smooth animations

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Check terminal logs
2. Check browser console (F12)
3. Restart backend & frontend
4. Clear browser cache

---

**Happy Testing! 🚀**

Hệ thống đã sẵn sàng để bạn test và sử dụng!
