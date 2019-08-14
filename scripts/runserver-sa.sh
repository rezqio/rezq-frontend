#!/usr/bin/env bash

set -e

# Go to the root directory
cd "$( dirname "${BASH_SOURCE[0]}" )"
cd ..

export NODE_ENV='dev'
export FRONTEND_URI='http://localhost:8080'
export BACKEND_URI='http://localhost:8000'

echo 'Running frontend without a backend!'
echo 'You must start the backend server yourself with `make runserver` in the backend repo.'
echo
echo "Backend URI: $BACKEND_URI"
echo "Frontend URI: $FRONTEND_URI"

npm start || true
