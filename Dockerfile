#stage 1
FROM node:16-alpine as node
WORKDIR /app
COPY . .
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli
RUN ng build --configuration production
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/skense /usr/share/nginx/html
COPY --from=node /app/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
