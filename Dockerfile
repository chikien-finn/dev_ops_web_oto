# Stage 1: Dùng Node.js để build mã nguồn React
FROM node:20-alpine AS builder
WORKDIR /app

# Cài đặt thư viện
COPY package.json package-lock.json ./
RUN npm ci

# Copy code và build ra thư mục dist
COPY . .
RUN npm run build

# Stage 2: Dùng Nginx siêu nhẹ để chạy web
FROM nginx:alpine

# Copy file đã build ở Stage 1 sang Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở cổng 80 và khởi chạy Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


