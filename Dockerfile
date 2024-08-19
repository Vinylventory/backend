FROM node:22.6.0

LABEL org.opencontainers.image.authors="CanardConfit"
LABEL org.opencontainers.image.source="https://github.com/Vinylventory/backend"
LABEL org.opencontainers.image.description="Vinylventoryc backend server"

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

RUN chmod +x startServer.sh

CMD ["bash", "startServer.sh"]