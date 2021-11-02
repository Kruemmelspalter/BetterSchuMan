FROM node:lts

WORKDIR /opt/betterschuman

COPY entrypoint.sh .
RUN chmod ug+x entrypoint.sh

COPY backend/package.json .

RUN yarn install --production

WORKDIR /tmp/betterschuman

COPY backend ./backend
COPY frontend ./frontend
RUN cd frontend && yarn install && yarn run build
RUN cd backend && yarn install && yarn run build

WORKDIR /opt/betterschuman

RUN cp -r /tmp/betterschuman/backend/dist/* .
RUN cp -r /tmp/betterschuman/frontend/dist static

RUN rm -r /tmp/betterschuman
ENTRYPOINT ["/opt/betterschuman/entrypoint.sh"]
