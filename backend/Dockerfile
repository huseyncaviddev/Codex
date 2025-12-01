FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false || true
COPY . .
RUN npm run build || true
CMD ["npm", "run", "start"]
