# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve with static server
RUN npm install -g serve
CMD ["serve", "-s", "dist"]
