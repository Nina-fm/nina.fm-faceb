FROM node:slim

RUN apt-get update -y \
&& apt-get install -y openssl

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install --immutable --immutable-cache --check-cache

EXPOSE 3000

CMD ["sh", "-c", "yarn db:deploy && yarn dev"]