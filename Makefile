FIG=docker-compose
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


##
## Docker
##---------------------------------------------------------------------------

start:          ## Install and start the project
start: build up
build:
	$(FIG) build

up:
	$(FIG) up -d --remove-orphans

reset:          ## Reset the whole project
reset: stop start

stop:           ## Remove docker containers
	$(FIG) kill
	$(FIG) rm -v --force



config:        ## Init files required
	cp docker-compose.override.yml.dist docker-compose.override.yml

install:          ## Install the whole project
install: config start vendor doctrine_schema_create

rbdb:
	$(FIG) stop db
	sudo rm -r var/db
	sudo tar -zxf var/db.tar.gz var/db
	$(FIG) start db

rbdbbr:
	$(FIG) stop db
	sudo tar -zxf var/db-bk-$(BRANCH_DIR).tar.gz var/db
	$(FIG) start db

bkdb:
	sudo tar -zcf var/db.tar.gz var/db

bkdbbr:
	sudo tar -zcf "var/db-bk-$(BRANCH_DIR).tar.gz" var/db

indb:
	$(FIG) exec db mysql -umeetpro -pmeetpro meetpro

inphp:
	$(FIG) exec php bash

encore-dev:
	$(FIG) run node yarn encore dev

encore-run:
	$(FIG) run -p8080:8080 node yarn encore dev-server --host 0.0.0.0 --hot --disable-host-check --port 8080

encore-watch:
	$(FIG) run node yarn encore dev --watch --disable-host-check --port 8080

##
## END Docker
##---------------------------------------------------------------------------

run:
	php $(CONSOLE) server:run

vendor:           ## Vendors
	$(RUN) php composer install

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

fixtures_load:
	bin/console doctrine:fixtures:load --no-interaction --env=$(env)
fixture: fixtures_load
fixtures: fixtures_load

search_settings:
	bin/console app:algolia:settings --env=$(env)

search_index:
	bin/console app:algolia:indexer --env=$(env)

search_clear_index:
	bin/console app:algolia:clear --env=$(env)

search_reload: search_clear_index search_settings search_index
index_reload:	search_settings search_clear_index search_index

data_reload: fixtures_load search_clear_index search_index

dev_reload: doctrine_schema search_settings fixtures_load search_clear_index search_index

#generate_migration:
#	sed -i "s/database_name: meetpro/database_name: meetpro_mig/g" app/config/parameters.yml
#	bin/console doctrine:mig:mig -n
#	bin/console doctrine:mig:diff
#	sed -i "s/database_name: meetpro_mig/database_name: meetpro/g" app/config/parameters.yml

migdiff:
	bin/console doctrine:mig:diff

migrate:
	bin/console doctrine:migrations:migrate --no-interaction

php_git_hooks:
	cp vendor/bruli/php-git-hooks/src/PhpGitHooks/Infrastructure/Hook/pre-commit .git/hooks
	cp vendor/bruli/php-git-hooks/src/PhpGitHooks/Infrastructure/Hook/commit-msg .git/hooks
	cp vendor/bruli/php-git-hooks/src/PhpGitHooks/Infrastructure/Hook/pre-push .git/hooks

generate:
	bin/console app:advert:generate -u $(user) -t $(type) -a1

super: #make super user=admin@meetpro.fr
	bin/console fos:user:promote --super ${user}

##
## Dump current DataBase
##---------------------------------------------------------------------------

dump_bd:
	bin/console database:dump

users:
	bin/console doctrine:fixtures:load --group=users --append

db-fixtures:
	bin/console database:load:fixtures
	bin/console doctrine:fixtures:load --group=users --append
