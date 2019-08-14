.PHONY: help install yarn backend install-pre-commit runserver runserver-sa lint test tailf-backend clean-backend clean build

help:  ## display this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: yarn backend install-pre-commit  ## set up everything

yarn:  ## install node dependencies
	yarn install

backend: clean-backend  ## set up backend container
	git submodule init
	git submodule update
	cd rezq-backend && \
	git reset --hard && \
	git checkout master && \
	git pull && \
	make docker-dev

install-pre-commit:  ## install pre-commit hooks
	virtualenv .venv
	.venv/bin/pip install pre_commit==1.14.4
	.venv/bin/pre-commit install --install-hooks -f

runserver:  ## run frontend and backend in docker
	@scripts/runserver.sh

runserver-sa:  ## run frontend standalone
	@scripts/runserver-sa.sh

lint: install-pre-commit  ## runs linter
	.venv/bin/pre-commit run --all-files

test: lint  ## run tests

tailf-backend:  ## tailf backend output
	@scripts/tailf-backend.sh

clean-backend:  ## remove the backend container
	@scripts/clean-backend.sh

clean: clean-backend  ## clean artifacts
	rm -f yarn-error.log
	rm -rf node_modules
	rm -rf .venv
	find . -type f -name '.DS_Store' -delete

build: yarn  ## build
	cd dist && rm -f *.png *.woff *.woff2 *.jpg *.ttf *.svg *.eot bundle.js
	npm run build
