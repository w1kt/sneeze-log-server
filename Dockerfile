FROM node:9-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && npm rebuild bcrypt --build-from-source \
    && apk del build-dependencies
