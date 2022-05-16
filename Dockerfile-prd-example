FROM node:13 AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run test && npm run build


FROM node:alpine
WORKDIR /project-volume/app
RUN npm i -g typescript ts-node
COPY --from=builder /app ./
EXPOSE ${PORT}
CMD ["npm","run", "start:prod"]
