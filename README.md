# RezQ Frontend

React + Apollo GraphQL

## Prerequisites

1. node
2. yarn
3. virtualenv (python3.6)

## Setup

1. `make install`

## Development

1. `make runserver`
2. Visit http://localhost:8080/ for the frontend
3. Visit http://localhost:8088/v1/public/ or http://localhost:8088/v1/private/ for Graph*i*QL
   - To access private, you need to create your own token, and then use a Chrome/Firefox addon to add a header
   - Key: 'Authorization'
   - Value: 'Bearer <token>'
4. Visit http://localhost:8088/admin/ for backend admin interface
   - Log in with `dzheng`:`password`
