# Stage 1: Build & Run Node.js API
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy toàn bộ mã nguồn
COPY . .

# Khai báo cổng 5000
EXPOSE 5000

# Biến môi trường mặc định
ENV NODE_ENV=production
ENV PORT=5000

# Khởi chạy server
CMD ["node", "server.js"]
