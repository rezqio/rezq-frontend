#!/usr/bin/env bash

set -e

# Go to the root directory
cd "$( dirname "${BASH_SOURCE[0]}" )"
cd ..

export NODE_ENV='dev'
export FRONTEND_URI='http://localhost:8080'
export BACKEND_URI='http://localhost:8088'

if [ ! -e .backend-container ]; then
  echo 'Starting new backend container'
  CONTAINER_ID=`docker run -d -p 8088:80 -e DJANGO_BASE_URL="$BACKEND_URI" rezq.io/backend-dev:latest`
else
  echo 'Restarting existing backend container'
  CONTAINER_ID=`head -1 .backend-container`
  {
    docker start $CONTAINER_ID
  } || {
    echo 'Failed to restart existing backend container'
    echo 'Removing existing backend container'
    docker rm -f $CONTAINER_ID || true
    echo 'Starting new backend container'
    CONTAINER_ID=`docker run -d -p 8088:80 -e DJANGO_BASE_URL="$BACKEND_URI" rezq.io/backend-dev:latest`
  }
fi

echo $CONTAINER_ID > .backend-container

trap "echo 'Stopping backend container'; docker stop -t 0 $CONTAINER_ID" EXIT HUP INT QUIT PIPE TERM

echo
echo "Backend URI: $BACKEND_URI"
echo "Frontend URI: $FRONTEND_URI"

npm start || true
