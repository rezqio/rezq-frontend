#!/usr/bin/env bash

set -e

# Go to the root directory
cd "$( dirname "${BASH_SOURCE[0]}" )"
cd ..

if [ -e .backend-container ]; then
  CONTAINER_ID=`head -1 .backend-container`
  echo "docker exec -it $CONTAINER_ID tailf /var/log/backend.log"
  docker exec -it $CONTAINER_ID tailf /var/log/backend.log
else
  echo 'Could not find backend container to tailf.'
fi
