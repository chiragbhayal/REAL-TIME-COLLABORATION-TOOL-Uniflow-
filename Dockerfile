# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

EXPOSE 10000

CMD ["npm", "start"]
