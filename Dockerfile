FROM node:20-bookworm-slim
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    gcc \
    && npm install -g node-gyp \
    && npm install \
