FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs
RUN npm install

COPY . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]