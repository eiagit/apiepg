FROM node:21-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

ARG src="./database.js"
ARG target="/home/node/app/"
copy ${src} ${target}
ARG src="./index.js"
copy ${src} ${target} 
ARG src="./package.json"
copy ${src} ${target} 
ARG src="./package-lock.json"
copy ${src} ${target} 

RUN npm install

USER node

EXPOSE 3000

CMD [ "node", "index.js" ]