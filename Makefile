RUN=
EXEC=
CONSOLE=bin/console
BRANCH_DIR := $(shell git rev-parse --abbrev-ref HEAD | sed -e 's/[^A-Za-z0-9.-]/-/g')



user ?= jean-a_a@epitech.eu
type ?= transferee
env ?= dev

.PHONY: help reload test

ifeq ($(env),dev)
	composer_args = --dev
else
	composer_args = --no-dev --optimize-autoloader
endif

export SYMFONY_ENV=$(env)

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  dev_reload   clear cache, reload database schema and load fixtures (only for dev environment)"


run :
	symfony local:server:start --allow-http

open:
	symfony open:local

install:          ## Install the whole project
install: vendor yarn doctrine_schema_create migrate

doctrine_schema_create:
	php $(CONSOLE)  doctrine:database:create


encore-dev:
	$(FIG) run node yarn encore dev

encore-run:
	$(FIG) run -p8080:8080 node yarn encore dev-server --host 0.0.0.0 --hot --disable-host-check --port 8080

encore-watch:
	$(FIG) run node yarn encore dev --watch --disable-host-check --port 8080

##
## END Docker
##---------------------------------------------------------------------------

vendor:           ## Vendors
	$(RUN) php composer install


yarn:           ## Webpack
	yarn install

clear:
	composer dump-autoload
	bin/console cache:clear --env=$(env)

doctrine_schema:
	bin/console doctrine:cache:clear-metadata --env=$(env)
	bin/console doctrine:cache:clear-query --env=$(env)
	bin/console doctrine:cache:clear-result --env=$(env)
	bin/console doctrine:database:drop --force --env=$(env)
	bin/console doctrine:database:create --env=$(env)
	bin/console doctrine:m:m --no-interaction --env=$(env)

db: doctrine_schema

db-empty:
	bin/console doctrine:database:drop --force --env=$(env)
	bin/console doctrine:database:create --env=$(env)
	bin/console doctrine:schema:update --force --env=$(env)

fixture:
	bin/console doctrine:fixtures:load --no-interaction --env=$(env)

migdiff:
	bin/console doctrine:mig:diff

migrate:
	bin/console doctrine:migrations:migrate --no-interaction

##
## Dump current DataBase
##---------------------------------------------------------------------------

dump_bd:
	bin/console database:dump

