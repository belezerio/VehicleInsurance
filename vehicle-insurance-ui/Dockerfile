FROM node:20

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

RUN npm install -g serve

# 👇 IMPORTANT: add -s for SPA routing
CMD ["serve", "-s", "dist", "-l", "3000"]