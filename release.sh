#!/bin/sh

REGISTRY_HOST=registry.pi.lan
APP_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
APP_NAME=alergetic

APP_IMAGE=${APP_NAME}:${APP_VERSION}
APP_REMOTE=${REGISTRY_HOST}/${APP_NAME}:${APP_VERSION}

echo "Pulling current image"
docker pull ${REGISTRY_HOST}/${APP_NAME}:latest

echo "Building image ${APP_IMAGE}"
docker build -t ${APP_IMAGE} .
docker tag ${APP_IMAGE} ${APP_REMOTE}

echo "Pushing image ${APP_REMOTE}"
docker push ${REGISTRY_HOST}/${APP_NAME}:${APP_VERSION}

echo "Removing local image"
docker image rm ${APP_IMAGE}
