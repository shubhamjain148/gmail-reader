FROM node:10.23

RUN mkdir /gmail-reader

WORKDIR /gmail-reader

COPY . .

RUN npm install && \
    npm run build && \
    npm prune --production && \
    npm install -g serve

EXPOSE 5000

CMD ["serve", "-s", "build"]
