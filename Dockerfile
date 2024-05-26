FROM node:14-alpine3.10

LABEL version="1.0"
LABEL description="Development image for the Library MERN API"

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . /app

EXPOSE 8080

USER node

CMD ["node", "index.js"]