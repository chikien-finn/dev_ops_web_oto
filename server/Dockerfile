FROM node:20-alpine

WORKDIR /app

# Copy manifest trước để layer npm ci được cache khi code đổi mà dependencies không đổi
COPY package*.json ./
RUN npm ci --omit=dev

# --chown để user node đọc được code; node_modules vẫn của root (chỉ đọc, an toàn hơn)
COPY --chown=node:node . .

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

USER node

CMD ["node", "server.js"]
