FROM node:18
WORKDIR /use/src/app
COPY . /use/src/app/
RUN npm install -g @angular/cli
RUN npm install
CMD ["ng", "serve", "--host", "0.0.0.0"]