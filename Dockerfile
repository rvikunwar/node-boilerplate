FROM node:16.20
RUN mkdir -p /home/app
COPY . /home/app
EXPOSE 9001
CMD ["node", "/home/app/index.js"]
