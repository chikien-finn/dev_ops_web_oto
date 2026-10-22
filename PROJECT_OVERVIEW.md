# TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

> **Ghi chú**: Tài liệu này mô tả CHÍNH XÁC những gì đang có thật trong mã nguồn của dự án tại thời điểm hiện tại. Không suy đoán, không bịa đặt. Chỗ nào không chắc chắn được ghi rõ "KHÔNG CHẮC".

---

## 1. Stack & Dependencies

### Frontend
- **Framework / Core**: React 19 (`react` `^19.2.8`, `react-dom` `^19.2.8`)
- **Build tool / Bundler**: Vite 5 (`vite` `^5.4.11`, `@vitejs/plugin-react` `^4.3.4`)
- **Routing**: React Router DOM v7 (`react-router-dom` `^7.18.3`)
- **Icon library**: Lucide React (`lucide-react` `^1.42.0`)
- **Dev tools / Linter**: Oxlint (`oxlint` `^1.79.0`), Concurrently (`concurrently` `^10.0.5`)
- **Kiểu dữ liệu**: `@types/react` `^19.2.18`, `@types/react-dom` `^19.2.4`

### Backend
- **Nền tảng**: Node.js (ES Modules, `"type": "module"`)
- **Web framework**: Express (`express` `^4.21.2`)
- **Cơ sở dữ liệu (ODM)**: Mongoose (`mongoose` `^9.11.2`) kết nối MongoDB
- **Middleware**: CORS (`cors` `^2.8.5`), Dotenv (`dotenv` `^18.0.4`)
- **Testing**: Node Native Test Runner (`node:test`, `node:assert/strict`)

### DevOps & Infrastructure
- **Containerization**: Docker (Multi-stage build Dockerfile: `node:20-alpine` build -> `nginx:alpine` serve), Docker Compose (`docker-compose.yml`, `docker-compose.prod.yml`)
- **Web Server / Reverse Proxy**: Nginx (xử lý proxy `/api/` về `backend:5000`, rewrite SPA `try_files $uri $uri/ /index.html` chống lỗi 404)
- **Database**: MongoDB 7 (`mongo:7-jammy` local qua Docker Compose hoặc MongoDB Atlas Cloud qua chuỗi `MONGO_URI`)
- **CI/CD & Automation**: GitHub Actions (`.github/workflows/deploy.yml`), Jenkins (`Jenkinsfile`), Ansible (`ansible/deploy.yml`, `ansible/inventory.ini`)

### Scripts chạy
- **Frontend (Root `package.json`)**:
  - `npm start`: Chạy đồng thời cả Frontend và Backend API (`npm run dev:all`).
  - `npm run dev`: Khởi chạy Vite dev server ở cổng `http://localhost:5173`.
  - `npm run dev:server`: Chạy backend bằng lệnh `node --watch server/server.js`.
  - `npm run dev:all`: Dùng `concurrently` chạy song song cả Vite (`5173`) và backend API server (`5000`).
  - `npm run build`: Build gói ứng dụng production bằng Vite ra thư mục `/dist`.
  - `npm run lint`: Kiểm tra lỗi cú pháp bằng `oxlint`.
  - `npm test`: Chạy bộ kiểm thử tự động `node --test server/test/api.test.js`.
  - `npm run preview`: Xem trước bản build production tại cổng nội bộ.
- **Backend (`server/package.json`)**:
  - `npm start`: Khởi động máy chủ API `node server.js`.
  - `npm run dev`: Chạy API chế độ theo dõi file `node --watch server.js`.
  - `npm test`: Chạy kiểm thử API `node --test test/api.test.js`.

---

## 2. Cây Thư Mục (Rút Gọn)

```text
web_ban_oto/
├── .github/workflows/deploy.yml # Pipeline GitHub Actions (Test -> Build Docker -> Deploy EC2)
├── ansible/
│   ├── deploy.yml               # Playbook triển khai container lên máy chủ EC2 từ xa
│   └── inventory.ini            # Cấu hình IP máy chủ và thông tin SSH của Ansible
├── docs/                        # Thư mục tài liệu hướng dẫn kỹ thuật DevOps và kiến trúc
├── server/                      # Mã nguồn dịch vụ Backend API
│   ├── config/
│   │   ├── db.js                # Kết nối MongoDB (Mongoose), định nghĩa Models, seed dữ liệu ban đầu
│   │   └── schema.sql           # File SQL cũ (di chứng còn sót lại, KHÔNG CÒN SỬ DỤNG)
│   ├── data/                    # File dữ liệu JSON dự phòng cục bộ (cars.json, users.json, bookings.json)
│   ├── routes/
│   │   ├── auth.js              # API đăng nhập, đăng ký, cập nhật hồ sơ, đổi mật khẩu
│   │   ├── bookings.js          # API đặt lịch hẹn lái thử và quản lý trạng thái lịch hẹn
│   │   ├── cars.js              # API xem, thêm, sửa, xóa và khôi phục dữ liệu xe
│   │   ├── favorites.js         # API thêm/xóa xe trong danh sách yêu thích
│   │   └── users.js             # API lấy danh sách và xóa tài khoản người dùng
│   ├── storage/
│   │   └── db.js                # Dữ liệu ban đầu (INITIAL_*) và hàm đọc/ghi file JSON fallback
│   ├── test/
│   │   └── api.test.js          # Bài kiểm thử tự động API bằng Node Native Test Runner
│   ├── .env                     # Biến môi trường backend (PORT, MONGO_URI kết nối MongoDB Atlas)
│   ├── Dockerfile               # File đóng gói container Docker cho Backend API
│   ├── package.json             # Khai báo dependencies và script của backend
│   └── server.js                # Entry point Express backend, logger, health check, gán router
├── src/                         # Mã nguồn giao diện người dùng Frontend (React)
│   ├── assets/                  # Tài nguyên tĩnh (ảnh, icon nội bộ)
│   ├── components/
│   │   ├── admin/
│   │   │   ├── BookingTable.jsx # Bảng hiển thị, lọc và cập nhật trạng thái lịch hẹn lái thử
│   │   │   ├── CarGrid.jsx      # Hiển thị kho xe admin dạng lưới thẻ card trực quan
│   │   │   ├── CarModal.jsx     # Hộp thoại popup thêm xe mới hoặc chỉnh sửa thông tin xe
│   │   │   ├── CarTable.jsx     # Bảng danh sách chi tiết các mẫu xe cho admin
│   │   │   ├── StatCard.jsx     # Thẻ hiển thị số liệu thống kê nhanh trên dashboard admin
│   │   │   └── UserTable.jsx    # Bảng quản lý danh sách tài khoản thành viên
│   │   ├── common/
│   │   │   ├── Footer.jsx       # Chân trang hiển thị thông tin showroom, liên hệ, chính sách
│   │   │   └── Navbar.jsx       # Thanh điều hướng đầu trang (Logo, link, badge tim, nút auth)
│   │   └── user/
│   │       └── CarCard.jsx      # Thẻ card tóm tắt mẫu xe (dùng trong Cars, Favorites, Profile)
│   ├── context/
│   │   ├── AuthContext.jsx      # Context quản lý đăng nhập, phiên user, favorites và localStorage
│   │   ├── CarContext.jsx       # Context quản lý dữ liệu xe, đồng bộ với API và CRUD
│   │   └── ToastContext.jsx     # Context hiển thị thông báo toast nổi góc màn hình
│   ├── data/
│   │   └── cars.js              # Dữ liệu mẫu tĩnh của xe và URL ảnh mặc định FALLBACK_CAR_IMAGE
│   ├── pages/
│   │   ├── admin/
│   │   │   └── Admin.jsx        # Trang bảng điều khiển quản trị (quản lý xe, lịch, user, devops)
│   │   └── user/
│   │       ├── CarDetail.jsx    # Trang chi tiết thông số xe và form đăng ký lái thử
│   │       ├── Cars.jsx         # Trang danh mục toàn bộ xe với bộ lọc nâng cao
│   │       ├── Favorites.jsx    # Trang hiển thị danh sách các xe người dùng đã bấm thích
│   │       ├── Home.jsx         # Trang chủ showroom xe cho khách, tìm kiếm nhanh và modal lái thử
│   │       ├── Login.jsx        # Trang đăng nhập dùng chung (chuyển hướng theo role user/admin)
│   │       ├── Profile.jsx      # Trang cá nhân gồm 4 tab (hồ sơ, lịch hẹn, yêu thích, đổi mật khẩu)
│   │       └── Register.jsx     # Trang đăng ký thành viên với kiểm tra form ràng buộc
│   ├── services/
│   │   └── api.js               # Module đóng gói các hàm gọi fetch API tới backend
│   ├── styles/                  # Toàn bộ CSS thuần (chia theo admin/, common/, user/, index.css)
│   ├── utils/
│   │   └── format.js            # Hàm quy đổi tiền USD sang tỷ VNĐ và ước tính tiền trả góp
│   ├── App.jsx                  # Cấu hình định tuyến Route và phân chia layout User / Admin
│   └── main.jsx                 # Khởi tạo React root bọc bởi StrictMode và các Context Provider
├── dist/                        # Thư mục đầu ra chứa mã nguồn frontend sau khi build
├── Dockerfile                   # Dockerfile multi-stage đóng gói Frontend với Nginx Alpine
├── docker-compose.yml           # Chạy toàn bộ stack local (MongoDB local, Backend, Frontend)
├── docker-compose.prod.yml      # Cấu hình container production trên máy chủ EC2
├── Jenkinsfile                  # Kịch bản CI/CD triển khai tự động hóa qua Jenkins
├── nginx.conf                   # Cấu hình máy chủ web Nginx làm reverse proxy và điều hướng SPA
├── package.json                 # Khai báo dependencies và script của frontend
└── vite.config.js               # File cấu hình của Vite bundler
```

---

## 3. Trang & Route

| Route | File tương ứng | Hiển thị gì | Dùng Component nào | Lấy Data từ đâu |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/pages/user/Home.jsx` | Showroom kho xe, banner Hero, thanh tìm kiếm & lọc nhanh (kiểu dáng, nhiên liệu, sắp xếp), lưới hiển thị xe trực tiếp, modal yêu cầu đăng nhập nếu khách vãng lai bấm lái thử, modal form đặt lịch lái thử | `Navbar`, `Footer` *(Card xe và modal lái thử được code inline trực tiếp trong file, không dùng `CarCard`)* | `CarContext` (`cars`), `AuthContext` (`user`, `toggleFavorite`), gọi `api.createBooking` |
| `/cars` | `src/pages/user/Cars.jsx` | Danh mục toàn bộ xe, bộ lọc nâng cao theo thương hiệu, kiểu dáng, khoảng giá, sắp xếp, nút lọc chỉ xem xe yêu thích | `CarCard`, `Navbar`, `Footer` | `CarContext` (`cars`), `AuthContext` (`user.favorites`) |
| `/car/:id` | `src/pages/user/CarDetail.jsx` | Chi tiết mẫu xe, ảnh lớn, giá USD & tỷ VNĐ, bảng thông số kỹ thuật (gia tốc, mã lực, tốc độ tối đa, hộp số, dẫn động, động cơ), 4 tính năng nổi bật, form đặt lái thử (bắt buộc đăng nhập), danh sách xe liên quan gợi ý | `CarCard` (cho mục xe gợi ý), `Navbar`, `Footer` | `CarContext` (`cars`), `AuthContext` (`user`), hardcode cấu hình chi tiết `CAR_SPEC_DETAILS` cho ID 1-6 (các xe khác dùng thông số generic mặc định), `api.createBooking` |
| `/favorites` | `src/pages/user/Favorites.jsx` | Nếu chưa đăng nhập: hiển thị khối thông báo yêu cầu đăng nhập. Nếu đã đăng nhập: danh sách các mẫu xe người dùng đã bấm lưu (tim) | `CarCard`, `Navbar`, `Footer` | `AuthContext` (`user.favorites`), `CarContext` (`cars`) |
| `/login` | `src/pages/user/Login.jsx` | Form đăng nhập dùng chung (tên đăng nhập/email + mật khẩu), nút điền nhanh tài khoản thử nghiệm (`admin`, `user123`), link sang trang đăng ký | `Navbar`, `Footer` | `AuthContext` (`login` -> gọi `api.login` hoặc fallback đối chiếu `registered_users` local) |
| `/register` | `src/pages/user/Register.jsx` | Form đăng ký tài khoản (họ tên, tên đăng nhập, email, số điện thoại, mật khẩu, xác nhận mật khẩu), thông báo lỗi trực quan | `Navbar`, `Footer` | `AuthContext` (`register` -> gọi `api.register` hoặc lưu local) |
| `/profile` | `src/pages/user/Profile.jsx` | Trang cá nhân gồm 4 tab: 1. Sửa thông tin tài khoản (tên, SĐT, địa chỉ), 2. Danh sách lịch hẹn lái thử cá nhân, 3. Danh sách xe yêu thích, 4. Đổi mật khẩu | `CarCard` (tab xe yêu thích), `Navbar`, `Footer` | `AuthContext` (`user`, `updateProfile`), `CarContext` (`cars`), gọi `api.getBookings({ userId, phone })`, `api.changePassword` |
| `/admin` | `src/pages/admin/Admin.jsx` | Dashboard quản trị độc lập (ẩn Navbar/Footer của user). Gồm 4 thẻ thống kê và 4 tab: 1. Kho xe (xem lưới `CarGrid` hoặc bảng `CarTable`, tìm kiếm, lọc, mở modal thêm/sửa, nút reset), 2. Quản lý lịch hẹn `BookingTable`, 3. Quản lý người dùng `UserTable`, 4. Giám sát hệ thống DevOps Health Check | `StatCard`, `CarGrid`, `CarTable`, `CarModal`, `BookingTable`, `UserTable` | `CarContext` (CRUD xe), `AuthContext` (danh sách user, xóa user), `api.getBookings`, `api.updateBookingStatus`, `api.deleteBooking`, `api.checkHealth` |

---

## 4. Dữ Liệu (Data)

### Nguồn dữ liệu xe
- Dữ liệu gốc khởi tạo từ file tĩnh: `src/data/cars.js` (frontend) và `server/storage/db.js` (`INITIAL_CARS`), `server/data/cars.json` (backend).
- Khi backend khởi động, hàm `initializeDatabase()` trong `server/config/db.js` nạp danh sách ban đầu vào MongoDB Atlas Cloud (`db_web_oto`).
- Client lấy dữ liệu động qua REST API: `GET /api/cars`.
- Có cơ chế sao lưu ngoại tuyến: nếu mất mạng hoặc API lỗi, client đọc từ `localStorage.getItem('autopremium_cars')` hoặc dữ liệu tĩnh từ `src/data/cars.js`.

### Schema các trường dữ liệu (MongoDB Mongoose & Client)

#### Xe (`Car`)
- `id`: Number (Bắt buộc, khóa định danh dạng số nguyên duy nhất, ví dụ: 1, 2, 3...)
- `name`: String (Bắt buộc, tên thương mại của xe)
- `price`: Number (Bắt buộc, giá niêm yết bằng USD)
- `year`: Number (Bắt buộc, năm sản xuất)
- `type`: String (Bắt buộc, phân khúc kiểu dáng: 'Sedan', 'Coupe', 'SUV', 'Hypercar', 'Convertible')
- `fuel`: String (Bắt buộc, công nghệ nhiên liệu: 'Gasoline', 'Hybrid', 'Electric')
- `image`: String (URL hình ảnh bìa xe)
- `specs`: Object (Mixed: `acceleration`, `topSpeed`, `horsepower`, `transmission`, `drivetrain`, `engine`, `features`: mảng các object `{ title, desc }`)
- `createdAt`, `updatedAt`: Date (Tự động sinh bởi Mongoose)

#### Người dùng (`User`)
- `id`: String (Khóa định danh, ví dụ: `'user_admin_1'`, `'user_1740000000'`)
- `username`: String (Bắt buộc, duy nhất, chữ thường, không chứa khoảng trắng)
- `password`: String (Bắt buộc, lưu dạng plain text thô, chưa băm hash)
- `name`: String (Họ và tên hiển thị)
- `email`: String (Bắt buộc, duy nhất)
- `phone`: String (Số điện thoại liên hệ)
- `address`: String (Địa chỉ nhận xe)
- `role`: String (Enum: `'user'` hoặc `'admin'`)

#### Lịch hẹn lái thử (`Booking`)
- `id`: String (Ví dụ: `'booking_1'`, `'booking_1740000000'`)
- `userId`: String hoặc `null` (ID tài khoản nếu đã đăng nhập)
- `carId`: Number hoặc `null` (ID mẫu xe muốn lái thử)
- `carName`: String (Tên xe đăng ký lái thử)
- `name`: String (Họ tên người đăng ký)
- `phone`: String (Số điện thoại người đăng ký)
- `date`: String (Ngày hẹn theo định dạng YYYY-MM-DD)
- `location`: String (Địa điểm: `'showroom'` hoặc `'home'`)
- `note`: String (Nhu cầu / ghi chú bổ sung)
- `status`: String (Enum: `'pending'`, `'contacted'`, `'completed'`, `'cancelled'`)

#### Xe yêu thích (`Favorite`)
- `userId`: String (Bắt buộc)
- `carId`: Number (Bắt buộc)
- Cặp `{ userId, carId }` có index duy nhất (unique) trên MongoDB.

---

## 5. Danh Sách Component

1. **`Navbar`**
   - File: `src/components/common/Navbar.jsx`
   - Props: Không có (`none`).
   - Được dùng ở: Tất cả các trang dành cho người dùng thông qua `App.jsx`. Tự động ẩn khi vào route `/admin`.
2. **`Footer`**
   - File: `src/components/common/Footer.jsx`
   - Props: Không có (`none`).
   - Được dùng ở: Tất cả các trang dành cho người dùng thông qua `App.jsx`. Tự động ẩn khi vào route `/admin`.
3. **`CarCard`**
   - File: `src/components/user/CarCard.jsx`
   - Props: `{ id, name, price, image, year, type, fuel }`
   - Được dùng ở: `Cars.jsx`, `CarDetail.jsx` (mục xe liên quan), `Favorites.jsx`, `Profile.jsx` (tab yêu thích).
4. **`StatCard`**
   - File: `src/components/admin/StatCard.jsx`
   - Props: `{ icon: Icon, value, label, sub }`
   - Được dùng ở: `Admin.jsx` (4 thẻ thống kê đầu trang dashboard).
5. **`CarGrid`**
   - File: `src/components/admin/CarGrid.jsx`
   - Props: `{ cars, onEdit, onDelete }`
   - Được dùng ở: `Admin.jsx` (khi chọn chế độ xem dạng lưới thẻ card).
6. **`CarTable`**
   - File: `src/components/admin/CarTable.jsx`
   - Props: `{ cars, onEdit, onDelete }`
   - Được dùng ở: `Admin.jsx` (khi chọn chế độ xem dạng bảng chi tiết).
7. **`CarModal`**
   - File: `src/components/admin/CarModal.jsx`
   - Props: `{ isOpen, isEditing, carForm, setCarForm, onClose, onSave, sampleImages }`
   - Được dùng ở: `Admin.jsx` (modal thêm mới hoặc chỉnh sửa xe).
8. **`BookingTable`**
   - File: `src/components/admin/BookingTable.jsx`
   - Props: `{ bookings, onStatusChange, onDeleteBooking }`
   - Được dùng ở: `Admin.jsx` (tab quản lý lịch hẹn lái thử).
9. **`UserTable`**
   - File: `src/components/admin/UserTable.jsx`
   - Props: `{ users, currentUser, onDeleteUser }`
   - Được dùng ở: `Admin.jsx` (tab quản lý danh sách người dùng).

---

## 6. Logic & Quản Lý State

- **Phân tách luồng truy cập & bảo vệ trang Admin**:
  - Dùng chung 1 trang đăng nhập duy nhất `/login`.
  - Khi submit đăng nhập thành công: nếu tài khoản có `role === 'admin'` sẽ điều hướng vào `/admin`, ngược lại điều hướng về trang chủ `/`.
  - Kiểm tra quyền bảo vệ (`Route Guard`): File `Admin.jsx` kiểm tra nếu `!user || user.role !== 'admin'`, lập tức dùng `<Navigate to="/login" />` chặn lại và yêu cầu đăng nhập.
  - Phân tách giao diện: Trong `App.jsx`, dựa vào `location.pathname.startsWith('/admin')` để ẩn `Navbar` và `Footer` chung, chuyển toàn bộ màn hình sang chế độ Admin chuyên biệt.
- **Tìm kiếm và lọc xe**:
  - Trang `Home.jsx`: Lọc tức thời bằng `useMemo` kết hợp từ khóa tìm kiếm (`searchTerm`), kiểu dáng (`selectedType`), nhiên liệu (`selectedFuel`), và sắp xếp (`sortBy`).
  - Trang `Cars.jsx`: Lọc theo từ khóa, tách tên thương hiệu xe (`filterBrand`), kiểu dáng (`filterType`), 3 nấc khoảng giá (`filterPrice`), sắp xếp giá/năm (`sortBy`), và nút toggle chỉ xem xe yêu thích (`onlyFavorites`).
  - Trang `Admin.jsx`: Lọc theo tên, kiểu dáng, nhiên liệu, sắp xếp theo giá, năm, hoặc mã lực.
- **Tính năng so sánh xe**:
  - **CHƯA LÀM**: Trong toàn bộ mã nguồn hiện tại hoàn toàn chưa có chức năng so sánh thông số các xe.
- **Lưu xe yêu thích (Favorites)**:
  - Khi người dùng bấm biểu tượng trái tim: Nếu chưa đăng nhập -> hiện thông báo toast yêu cầu đăng nhập.
  - Nếu đã đăng nhập: Gọi `toggleFavorite(carId)` trong `AuthContext`, cập nhật mảng `user.favorites` trong `localStorage`, đồng thời gọi API `POST /api/favorites/toggle` lưu vào database MongoDB.
- **Đăng ký lái thử xe (Test Drive Booking)**:
  - Bắt buộc người dùng phải đăng nhập trước khi được đặt lịch. Nếu chưa đăng nhập, hệ thống mở modal thông báo kèm nút chuyển hướng đến trang đăng nhập.
  - Sau khi đăng nhập, hệ thống tự động điền sẵn Họ tên và SĐT của user vào form.
  - Kiểm tra tính hợp lệ dữ liệu (Validation) trước khi gửi:
    - Họ và tên: Bắt buộc, độ dài tối thiểu 2 ký tự.
    - Số điện thoại: Bắt buộc, kiểm tra đúng regex 10 số di động Việt Nam (`/^(0|\+84)[3|5|7|8|9][0-9]{8}$/`).
    - Ngày hẹn: Bắt buộc, không được chọn ngày trong quá khứ (`date >= today`).
  - Gửi dữ liệu qua API `POST /api/bookings` lưu vào MongoDB với trạng thái ban đầu là `pending`.
- **Quản trị CRUD xe (Admin)**:
  - Thêm xe: Mở popup `CarModal`, điền thông số hoặc chọn nhanh ảnh mẫu có sẵn, gọi `POST /api/cars`.
  - Sửa xe: Điền dữ liệu cũ vào form, cập nhật thông số, gọi `PUT /api/cars/:id`.
  - Xóa xe: Xác nhận và gọi `DELETE /api/cars/:id`.
  - Khôi phục mẫu: Gọi `POST /api/cars/reset` để nạp lại danh sách xe mặc định ban đầu.
- **Quản lý lịch hẹn & người dùng (Admin)**:
  - Đổi trạng thái xử lý lịch hẹn trực tiếp qua dropdown (`pending` -> `contacted` -> `completed` -> `cancelled`), gọi `PATCH /api/bookings/:id/status`.
  - Xóa tài khoản thành viên qua `DELETE /api/users/:id` (hệ thống chặn không cho phép xóa tài khoản admin mặc định).
- **Hệ thống thông báo nổi (Toast Notification)**:
  - Cung cấp qua `ToastContext.jsx`, hàm `showToast(type, message, duration = 3200)`.
  - Tự động đóng sau khoảng thời gian quy định hoặc khi bấm nút 'X'. Hỗ trợ 3 trạng thái: `success`, `error`, `info`.

---

## 7. Style & Thiết Kế (Design System)

- **Màu sắc chủ đạo (Bảng màu CSS Variables trong `src/styles/index.css`)**:
  - Nền tối phong cách siêu xe hạng sang (Dark Luxury):
    - Nền chính: `--bg-color: #0b0c10`
    - Nền thứ cấp: `--bg-secondary: #1f2833`
  - Chữ hiển thị:
    - Chữ chính: `--text-primary: #ffffff`
    - Chữ phụ/mờ: `--text-secondary: #c5c6c7`
  - Màu nhấn (Accent Cyber Teal / Cyan):
    - Điểm nhấn cơ bản: `--accent-color: #45a29e`
    - Điểm nhấn phát sáng / hover: `--accent-hover: #66fcf1`
  - Viền & Hiệu ứng kính:
    - Viền khung: `--border-color: #2a2e39`
    - Nền kính mờ: `--glass-bg: rgba(31, 40, 51, 0.6)`
    - Viền kính mờ: `--glass-border: rgba(102, 252, 241, 0.1)`
    - Màu cảnh báo / xóa: `--danger-color: #e63946` / `#ef4444`
- **Typography / Phông chữ**:
  - Nhập trực tiếp từ Google Fonts: `'Inter', sans-serif` (`weights: 300, 400, 500, 600, 700`).
  - Tiêu đề chính sử dụng hiệu ứng gradient chuyển màu từ trắng sang cyan: `linear-gradient(to right, var(--text-primary), var(--accent-hover))` kèm `-webkit-background-clip: text`.
- **Tổ chức mã nguồn CSS**:
  - Sử dụng Vanilla CSS thuần (100% không dùng Tailwind, không dùng Bootstrap).
  - Tách nhỏ theo từng trang và component trong thư mục `src/styles/`:
    - `index.css`: Cấu hình `:root`, thẻ chuẩn hóa, layout cơ bản, class tiện ích (`.container`, `.btn`, `.glass-card`).
    - `common/Toast.css`: Định dạng khung thông báo nổi.
    - `admin/Admin.css`: Toàn bộ giao diện trang quản trị admin (bảng, lưới, modal, tabs).
    - `user/`: Chứa các file CSS riêng biệt cho từng trang người dùng (`Home.css`, `Cars.css`, `CarCard.css`, `CarDetail.css`, `Favorites.css`, `Login.css`, `Register.css`, `Profile.css`, `Navbar.css`, `Footer.css`).
- **Hiệu ứng & Responsive**:
  - Hiệu ứng kính mờ (Glassmorphism): Áp dụng `backdrop-filter: blur(12px)` kết hợp bo góc `border-radius: 16px` và viền trong suốt.
  - Responsive: Được xử lý bằng Media Queries (`@media (max-width: 1024px)`, `@media (max-width: 768px)`, `@media (max-width: 480px)`). Các lưới hiển thị tự động chuyển từ 3-4 cột về 2 cột trên tablet và 1 cột đơn trên thiết bị di động.

---

## 8. Những Chỗ Chưa Xong / Còn Lỗi / Cần Cải Thiện

- **Bảo mật mật khẩu**: Mật khẩu người dùng trong cơ sở dữ liệu MongoDB và trong `localStorage` đang được lưu ở dạng văn bản gốc (plain text), CHƯA được băm mã hóa bảo mật (chưa tích hợp `bcrypt` hoặc `argon2`).
- **Cơ chế xác thực phiên (Authentication Token)**: Chưa có JSON Web Token (JWT) hoặc Session Cookie bảo mật từ server. Client và server đang trao đổi trực tiếp bằng `userId` thô trong body/query của request.
- **Hardcode thông số chi tiết của xe trong `CarDetail.jsx`**: Đối tượng `CAR_SPEC_DETAILS` đang được hardcode cứng cho các xe có ID từ 1 đến 6. Khi admin tạo xe mới (ID > 6), trang chi tiết sẽ phải dùng dữ liệu generic tạm thời thay vì đọc trực tiếp trường `specs` lưu trong cơ sở dữ liệu.
- **Hardcode thông tin máy chủ EC2 trong Admin**: Dòng 191 trong `src/pages/admin/Admin.jsx` đang gắn cứng chuỗi ký tự `"AWS EC2: 3.27.62.149 • Sydney Production"` vào giao diện thay vì lấy động từ cấu hình hệ thống.
- **Xung đột / Lệch đồng bộ dữ liệu song song (MongoDB vs LocalStorage)**: Client vừa lưu dữ liệu xe/user vào `localStorage` vừa gọi MongoDB. Nếu dữ liệu trên database thay đổi từ máy khác hoặc backend được cập nhật, `localStorage` của trình duyệt cũ có thể giữ dữ liệu cũ nếu chưa được xóa.
- **Thiếu trang 404 Not Found phía Client**: Trong `src/App.jsx` chưa định nghĩa route dự phòng `<Route path="*" element={<NotFound />} />`, nên khi người dùng gõ đường dẫn lạ sẽ hiển thị trang trắng.
- **File mồ côi `server/config/schema.sql`**: Dự án đã chuyển hoàn toàn sang MongoDB (Mongoose), nhưng file tạo bảng SQL cũ (`schema.sql`) vẫn còn nằm lại trong thư mục `server/config/`.

---

## 9. Các Chỗ Tự Quyết (Không Nằm Trong Yêu Cầu Gốc Của User)

- **Nút điền nhanh tài khoản thử nghiệm trong Login**: Tự ý bổ sung 2 nút tag nhỏ `Admin (admin / admin123)` và `User (user123 / 123456)` ở dưới form đăng nhập để click điền nhanh thông tin test.
- **Công cụ quy đổi tỷ giá tiền tệ USD sang VNĐ (`format.js`)**: Tự ý thêm tiện ích tính nhẩm tỷ giá `1 USD ~ 25,400 VNĐ` để hiển thị thêm dòng giá ước tính bằng tỷ đồng VNĐ trên các thẻ xe.
- **Tab giám sát hệ thống "DevOps Health" trong trang Admin**: Tự ý tích hợp thêm tab thứ 4 trong trang Admin để kiểm tra endpoint `/api/health`, đo uptime và theo dõi trạng thái container.
- **Hệ thống thông báo Toast tùy biến (`ToastContext.jsx` & `Toast.css`)**: Tự xây dựng component toast thông báo góc màn hình thay vì dùng hàm `alert()` mặc định của trình duyệt.
- **Bộ 14 ảnh xe mẫu gợi ý trong Modal thêm xe của Admin (`sampleImages`)**: Tự ý chèn danh sách 14 liên kết ảnh chụp Unsplash sẵn có để người quản trị bấm chọn nhanh ảnh bìa xe.
- **Chế độ xem kép dạng Lưới / Bảng (Grid / Table view) trong Admin**: Tự ý bổ sung nút chuyển đổi giao diện hiển thị giữa chế độ thẻ trực quan (`CarGrid`) và bảng truyền thống (`CarTable`).
