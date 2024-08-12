FROM node:18-alpine
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3011

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/
COPY .env /home/app/

COPY AccountService/build/ /home/app/AccountService/build/
COPY AccountService/package.json /home/app/AccountService/
COPY AccountService/package-lock.json /home/app/AccountService/

COPY AuthService/build/ /home/app/AuthService/build/
COPY AuthService/package.json /home/app/AuthService/
COPY AuthService/package-lock.json /home/app/AuthService/

COPY CategoryService/build/ /home/app/CategoryService/build/
COPY CategoryService/package.json /home/app/CategoryService/
COPY CategoryService/package-lock.json /home/app/CategoryService/

COPY ImageService/build/ /home/app/ImageService/build/
COPY ImageService/package.json /home/app/ImageService/
COPY ImageService/package-lock.json /home/app/ImageService/
COPY ImageService/images/listing /home/app/ImageService/images/listing/

COPY ListingService/build/ /home/app/ListingService/build/
COPY ListingService/package.json /home/app/ListingService/
COPY ListingService/package-lock.json /home/app/ListingService/

COPY MessageService/build/ /home/app/MessageService/build/
COPY MessageService/package.json /home/app/MessageService/
COPY MessageService/package-lock.json /home/app/MessageService/

COPY webapp/.next/ /home/app/webapp/.next/
COPY webapp/package.json /home/app/webapp/
COPY webapp/package-lock.json /home/app/webapp/
COPY webapp/next-i18next.config.js/ /home/app/webapp/
COPY webapp/next.config.js/ /home/app/webapp/
COPY webapp/public/ /home/app/webapp/public/

COPY adminapp/.next/ /home/app/adminapp/.next/
COPY adminapp/package.json /home/app/adminapp/
COPY adminapp/package-lock.json /home/app/adminapp/

COPY modapp/.next/ /home/app/modapp/.next/
COPY modapp/package.json /home/app/modapp/
COPY modapp/package-lock.json /home/app/modapp/

RUN npm run cis

CMD npm run start