FROM node:16.20

RUN mkdir -p /home/app

COPY . /home/app

CMD ["node", "/home/app/index.js"]
