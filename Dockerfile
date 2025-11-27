# syntax=docker/dockerfile:1

######## WebUI frontend build ########
FROM --platform=$BUILDPLATFORM node:22-alpine3.20 AS build
ARG BUILD_HASH=dev-build

WORKDIR /app

# to store git revision in build
RUN apk add --no-cache git

COPY package.json package-lock.json ./
RUN npm ci --force

COPY . .
ENV APP_BUILD_HASH=${BUILD_HASH}
RUN npm run build

######## Frontend runtime ########
FROM nginx:1.27-alpine AS runtime

# Serve on the port expected by existing deployments
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Copy built frontend files
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/CHANGELOG.md /usr/share/nginx/html/CHANGELOG.md
COPY --from=build /app/package.json /usr/share/nginx/html/package.json

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
