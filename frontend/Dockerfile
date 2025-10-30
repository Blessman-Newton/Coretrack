# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve with Vite preview or static server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
