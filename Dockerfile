FROM node:20-alpine

RUN mkdir app

WORKDIR /app

COPY . .

RUN npm install

ADD .env.example .env

EXPOSE 3000

CMD ["npm", "run", "dev"]
