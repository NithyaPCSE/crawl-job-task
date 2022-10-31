FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
# RUN npm i sequelize-cli --global
# RUN sequelize-cli db:migrate
EXPOSE 3001
CMD ["node","./index.js"]