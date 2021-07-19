FROM node:lts

WORKDIR /opt/betterschuman

COPY backend/package.json .
RUN npm install

COPY backend .

CMD npm run run
