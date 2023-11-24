FROM node:20-bookworm-slim
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app/

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    gcc \
    && npm install -g node-gyp \
    && npm ci \
    && npm run clean \
    && npm run build

FROM node:20-bookworm-slim
ENV NODE_ENV production
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY --from=0 /usr/app/package.json /usr/app/package-lock.json ./
COPY --from=0 /usr/app/dist/ ./dist
COPY --from=0 /usr/app/public/ ./public
RUN npm ci
