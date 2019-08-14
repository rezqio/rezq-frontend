#!/usr/bin/env bash

set -e

# Go to the root directory
cd "$( dirname "${BASH_SOURCE[0]}" )"
cd ..

if [ -e .backend-container ]; then
  CONTAINER_ID=`head -1 .backend-container`
  echo 'Removing backend container'
  docker rm -f $CONTAINER_ID || true
  rm -f .backend-container
fi
