# HƯỚNG DẪN SỬ DỤNG VÀ QUY TRÌNH TRIỂN KHAI TỪNG BƯỚC (DEVOPS)

> **Dự án**: Website Bán Ô Tô Trực Tuyến & Đặt Lịch Lái Thử (AutoPremium)  
> **Kiến trúc**: React 19 SPA + Node.js Express REST API + MongoDB 7 (Mongoose)  
> **Nền tảng**: Docker Compose & GitHub Actions CI/CD & AWS EC2  

---

## 📌 BẢNG TỔNG HỢP CÁC BƯỚC THỰC HIỆN

| Bước | Tên Công Việc | Nơi Thực Hiện | Mục Đích |
| :---: | :--- | :---: | :--- |
| **1** | [Chạy thử nghiệm trên máy](#bước-1-chạy-thử-nghiệm-trên-máy-local) | Laptop của bạn | Kiểm tra Web, API và MongoDB chạy thông suốt |
| **2** | [Kiểm tra bài test tự động](#bước-2-chạy-bài-test-tự-động) | Terminal | Đảm bảo code đạt chuẩn không có lỗi trước khi đẩy lên Git |
| **3** | [Đẩy mã nguồn lên GitHub](#bước-3-đẩy-mã-nguồn-lên-github) | Git Terminal | Lưu trữ phiên bản hoàn thiện trên GitHub Repository |
| **4** | [Cấu hình Secrets trên GitHub](#bước-4-cấu-hình-github-secrets-cho-cicd) | GitHub Web | Cung cấp quyền cho GitHub Actions tự build Docker lên Docker Hub |
| **5** | [Triển khai lên AWS EC2](#bước-5-triển-khai-chạy-247-lên-máy-chủ-aws-ec2) | AWS EC2 Cloud | Đưa ứng dụng ra Internet chạy 24/7 bằng Docker Compose |

---

## BƯỚC 1: CHẠY THỬ NGHIỆM TRÊN MÁY (LOCAL)

### 1. Khởi động toàn bộ Web và API
Mở terminal tại thư mục gốc dự án (`d:\02_HocTap\nam4_ky1_code\devops\web_ban_oto`) và gõ:
```bash
npm run dev:all
```
Lệnh này sẽ khởi động đồng thời 2 dịch vụ:
* **Giao diện Web React**: `http://localhost:5173`
* **Backend API Express**: `http://localhost:5000` (kết nối MongoDB qua Mongoose)

*(Lưu ý: Nếu chạy bằng Docker Compose local: gõ `docker compose up -d`, hệ thống sẽ tự khởi động MongoDB, Backend và Web Nginx).*

### 2. Trải nghiệm các tính năng thực tế
* **Tài khoản Quản Trị Viên (Admin)**:
  * Username: `admin`
  * Mật khẩu: `admin123`
  * Truy cập vào trang: `http://localhost:5173/admin` để quản lý kho xe, xóa/sửa xe, quản lý tài khoản và xem tab **"Lịch Hẹn Lái Thử"**.
* **Tài khoản Người Dùng Mẫu**:
  * Username: `user123`
  * Mật khẩu: `123456`
* **Đặt lịch lái thử**:
  * Vào xem chi tiết bất kỳ chiếc xe nào (ví dụ: Porsche 911).
  * Điền thông tin vào form đặt lịch lái thử bên tay phải và bấm **Gửi yêu cầu**.
  * Đăng nhập Admin vào tab **"Lịch Hẹn Lái Thử"** sẽ thấy ngay đơn vừa gửi và đổi được trạng thái sang *Đã liên hệ* hoặc *Hoàn tất*.

### 3. Kiểm tra dữ liệu trong MongoDB (Compass / mongosh)
Kết nối MongoDB Compass vào URI: `mongodb://localhost:27017` hoặc `mongodb://admin:Password123!@localhost:27017` (nếu chạy qua Docker):
* Database: `db_web_oto`
* Các Collections: `cars`, `users`, `bookings`, `favorites`.

---

## BƯỚC 2: CHẠY BÀI TEST TỰ ĐỘNG

Trước khi đẩy code lên Git, kiểm tra lại toàn bộ quy chuẩn chất lượng:
```bash
# 1. Chạy các bài kiểm thử API tích hợp
npm test

# 2. Quét lỗi cú pháp
npm run lint

# 3. Thử nghiệm đóng gói bản phân phối Frontend
npm run build
```
*(Cả 3 lệnh đều phải báo exit code 0 / thành công)*

---

## BƯỚC 3: ĐẨY MÃ NGUỒN LÊN GITHUB

Mở PowerShell tại thư mục dự án và thực hiện commit:
```bash
# 1. Kiểm tra các file thay đổi
git status

# 2. Thêm tất cả các file mới và chỉnh sửa
git add .

# 3. Tạo commit ghi nhận tính năng
git commit -m "feat: migrate database from sql server to mongodb 7 with mongoose"

# 4. Đẩy code lên nhánh main của GitHub
git push origin main
```

---

## BƯỚC 4: CẤU HÌNH GITHUB SECRETS CHO CI/CD

Để GitHub Actions tự động đóng gói ứng dụng thành **Docker Image** và đẩy lên **Docker Hub** mỗi lần push code:

### 1. Đăng ký tài khoản Docker Hub (Miễn phí)
* Truy cập [https://hub.docker.com/](https://hub.docker.com/) và đăng ký tài khoản.
* Vào avatar góc phải -> **Account settings** -> **Security** -> **New Access Token**.
* Đặt tên token (ví dụ `github-actions`), chọn quyền `Read & Write` -> Bấm **Generate** và copy mã token đó.

### 2. Thêm Secrets vào GitHub
* Truy cập vào repo của bạn: [chikien-finn/dev_ops_web_oto](https://github.com/chikien-finn/dev_ops_web_oto)
* Vào mục: **Settings** -> **Secrets and variables** -> **Actions** -> Bấm **New repository secret**.
* Tạo 2 secret sau:
  1. Name: `DOCKER_USERNAME` | Secret: *(Tên tài khoản Docker Hub của bạn)*
  2. Name: `DOCKER_PASSWORD` | Secret: *(Mã Access Token bạn vừa copy ở trên)*

👉 *Sau khi lưu, mỗi lần bạn push code lên `main`, GitHub Actions sẽ tự chạy tab **Actions**, tự kiểm thử và đẩy 2 image `oto-web` (`web_ban_oto_frontend`) và `oto-api` (`web_ban_oto_backend`) lên Docker Hub hoàn toàn tự động!*

---

## BƯỚC 5: TRIỂN KHAI CHẠY 24/7 LÊN MÁY CHỦ AWS EC2

### 1. Khởi tạo máy chủ AWS EC2
* Đăng nhập [AWS Console](https://aws.amazon.com/).
* Chọn dịch vụ **EC2** -> Bấm **Launch Instance**:
  * **Name**: `web-ban-oto-server`
  * **OS**: `Ubuntu Server 22.04 LTS` (hoặc 24.04 LTS).
  * **Instance type**: `t2.micro` *(MongoDB tiêu tốn cực ít RAM (~100MB), chạy cực kỳ mượt mà trên gói Free Tier t2.micro 1GB RAM mà không lo crash!)*.
  * **Key pair**: Tạo key mới (ví dụ `my-key.pem`) và tải về máy.
  * **Security Group (Tường lửa)**: Mở các cổng Inbound sau:
    * Port `22` (SSH để đăng nhập)
    * Port `80` và `8081` (hoặc `8080` cho người dùng truy cập web)

### 2. Kết nối vào máy chủ EC2 (Qua SSH)
Mở terminal máy bạn (tại nơi chứa file `my-key.pem`):
```bash
ssh -i my-key.pem ubuntu@<IP_MÁY_CHỦ_AWS>
```

### 3. Cài đặt Docker & Docker Compose trên EC2
Chạy lệnh cài đặt nhanh trên terminal của EC2:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
```
*(Thoát ra và SSH vào lại để quyền Docker có hiệu lực)*

### 4. Tải file cấu hình và Khởi động hệ thống Production
Trên máy chủ EC2:
```bash
# Tạo thư mục dự án
mkdir -p ~/web_ban_oto && cd ~/web_ban_oto

# Tải file docker-compose.prod.yml từ GitHub của bạn
curl -O https://raw.githubusercontent.com/chikien-finn/dev_ops_web_oto/main/docker-compose.prod.yml

# Tạo file .env chứa thông số cấu hình
cat << 'EOF' > .env
DOCKERHUB_USER=kienfinn
IMAGE_TAG=latest
DB_USER=admin
DB_PASSWORD=Password123!
WEB_PORT=8081
EOF

# Kéo các Docker images mới nhất và khởi động hệ thống
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### 5. Kiểm tra kết quả
* Kiểm tra 3 container đang chạy:
  ```bash
  docker ps
  ```
  *(Bạn sẽ thấy 3 container: Nginx frontend, Backend API và MongoDB đều ở trạng thái `Up` và `healthy`)*
* Mở trình duyệt trên máy tính/điện thoại, truy cập vào:
  ```
  http://<IP_MÁY_CHỦ_AWS>:8081
  ```
👉 **Website bán ô tô của bạn đã chính thức chạy trực tiếp trên Internet 24/7!**

---

## 💡 CÂU HỎI THƯỜNG GẶP (FAQ)

1. **Tôi có cần cài MongoDB riêng trên máy chủ AWS EC2 không?**
   * **Không cần!** Container `mongodb` (`mongo:7-jammy`) trong `docker-compose.prod.yml` đã chứa sẵn MongoDB chính hãng, tự động tạo tài khoản quản trị và database.
2. **Dữ liệu có bị mất khi khởi động lại máy chủ AWS không?**
   * **Không!** Volume `mongodb_data` được gắn bền vững trên ổ đĩa của AWS, dữ liệu thêm xe, tài khoản hay lịch lái thử vẫn giữ nguyên 100%.
3. **Mỗi khi tôi sửa code trên máy tính thì trên AWS cập nhật thế nào?**
   * Bạn chỉ cần `git push` lên GitHub. GitHub Actions sẽ tự build image mới.
   * Trên AWS, bạn chỉ cần gõ:
     ```bash
     docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d
     ```
