# Build stage
ARG BASE_PATH=/app/
FROM node:20-alpine AS builder

ARG BASE_PATH=/app/
ENV BASE_PATH=${BASE_PATH}

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Pick nginx config: root (/) or path (/app/) based on BASE_PATH
FROM alpine AS nginx-config
ARG BASE_PATH=/app/
COPY nginx.conf /root.conf
COPY nginx.app.conf /app.conf
RUN if [ "$BASE_PATH" = "/" ]; then cp /root.conf /out.conf; else cp /app.conf /out.conf; fi

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=nginx-config /out.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
