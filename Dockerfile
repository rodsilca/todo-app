#
FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3333

CMD [ "node", "./src/server.js" ]