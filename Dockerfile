FROM node:lts-alpine

WORKDIR /src

COPY ./src/package*.json /src/
RUN npm install --omit=dev

COPY ./src /src

CMD npm start
