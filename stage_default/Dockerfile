# FROM node:16.8.0
FROM ojtkgprepodharb01.mtn.com.ng/base-images/node16nginx22:base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# RUN apt-get update && apt-get install nginx -y
RUN apt update && apt install vim -y && apt install net-tools && apt install telnet
COPY default /etc/nginx/conf.d/default.conf
# COPY default /etc/nginx/sites-enabled
#RUN service nginx restart

#CMD ["npm", "run", "start"]
CMD ["sh", "start.sh"]
