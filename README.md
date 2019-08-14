# RezQ Frontend

React + Apollo GraphQL

### Prerequisites

1. `python3.6`
2. `virtualenv`
3. `make`
4. `docker`
5. `node`
6. `yarn`

## Setup

1. `make install`

## Development

1. `make runserver`
2. Visit http://localhost:8080/ for the frontend
3. Visit http://localhost:8088/v1/public/ or http://localhost:8088/v1/private/ for Graph*i*QL
   - To access *private*, you need to create your own token (using *public*), and then use a Chrome/Firefox addon to add a header
   - `Key: 'Authorization'`
   - `Value: 'Bearer <token>'`
4. Visit http://localhost:8088/admin/ for the backend admin interface
   - Log in with `dzheng:password`

## Original Authors

* [Andrew Gapic](https://github.com/agapic)
* [Evan Cao](https://github.com/evancoa)
* [Fanny Deng](https://github.com/fannydengdeng)
* [Gary Zheng](https://github.com/dongyuzheng)
* [Ian Yuan](https://github.com/iyyuan)
* [Judy Chen](https://github.com/ju-de)
