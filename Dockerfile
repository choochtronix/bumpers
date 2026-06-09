FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5173

CMD ["npm", "start"]
