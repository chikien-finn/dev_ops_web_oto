# AutoPremium - Hệ Thống Bán Ô Tô & Đặt Lịch Lái Thử Trực Tuyến

> **Đồ án môn học**: DevOps & Triển khai ứng dụng phần mềm  
> **Trạng thái triển khai**: 🟢 Đang hoạt động trực tiếp 24/7 trên AWS EC2  
> **Link Production**: [http://3.27.62.149:8080](http://3.27.62.149:8080)

---

## 🌟 Kiến Trúc Hệ Thống (Architecture)

- **Frontend**: React 19 SPA, Lucide Icons, Vite
- **Web Server (Reverse Proxy)**: Nginx Alpine (xử lý SPA routing, nén Gzip, proxy `/api` tới backend)
- **Backend API**: Node.js Express RESTful API
- **Database**: MongoDB 7 Community Edition (Mongoose ODM)
- **Containerization**: Docker & Docker Compose
- **CI/CD Pipeline**: GitHub Actions tự động kiểm thử và triển khai (CD) lên máy chủ AWS EC2 qua SSH

---

## 🚀 Quy Trình CI/CD Tự Động Hóa (GitHub Actions)

Mỗi khi lập trình viên đẩy mã nguồn lên nhánh `main`:
1. **Quality Check (CI)**:
   - Chạy Oxlint kiểm tra cú pháp frontend
   - Chạy bộ kiểm thử tự động API backend (`npm test` với 7 bài test: Health, Cars, Auth, Users, Bookings)
   - Kiểm tra đóng gói build bản phân phối frontend (`npm run build`)
2. **Deploy to AWS EC2 (CD)**:
   - Tự động SSH vào máy chủ AWS EC2
   - Thực thi `git pull origin main`
   - Khởi động lại các container bằng `docker compose up -d --build --remove-orphans`

---

## 🔑 Tài Khoản Đăng Nhập Mẫu

| Loại tài khoản | Username | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin` | `admin123` | Quản lý kho xe, xóa/sửa xe, quản lý tài khoản, duyệt lịch hẹn lái thử |
| **Khách Hàng (User)** | `user123` | `123456` | Xem chi tiết xe, lưu xe yêu thích, đặt lịch lái thử |

---

## 💻 Chạy Thử Nghiệm Tại Môi Trường Cục Bộ (Local)

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```
2. Khởi động đồng thời Frontend và Backend:
   ```bash
   npm run dev:all
   ```
   - Web: `http://localhost:5173`
   - API: `http://localhost:5000`

3. Chạy kiểm thử tự động:
   ```bash
   npm test
   ```
