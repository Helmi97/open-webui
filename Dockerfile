FROM --platform=$BUILDPLATFORM node:22-alpine3.20 AS build
ARG BUILD_HASH=dev-build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --force

COPY . .
ENV APP_BUILD_HASH=${BUILD_HASH}
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
