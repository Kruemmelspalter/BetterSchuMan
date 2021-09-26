FROM node:lts

WORKDIR /opt/betterschuman

COPY backend/package.json .
RUN npm install --production

COPY backend/dist .
COPY frontend/dist ./static

CMD node main.js
