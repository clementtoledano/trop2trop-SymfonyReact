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



## Install the whole project
install: vendor yarn create_database migrate
#############################################################
run :    ## Start Symfony server
	symfony local:server:start --allow-http

encore-run:     ## Start webpack encore
	yarn encore dev-server --port 8080 --disable-host-check

#############################################################
create_database:
	php $(CONSOLE)  doctrine:database:create

vendor:           ## Vendors
	$(RUN) php composer install

yarn:           ## Webpack
	yarn install

clear:    ## Symfony cache clear
	composer dump-autoload
	bin/console cache:clear --env=$(env)

#doctrine_schema:
#	bin/console doctrine:cache:clear-metadata --env=$(env)
#	bin/console doctrine:cache:clear-query --env=$(env)
#	bin/console doctrine:cache:clear-result --env=$(env)
#	bin/console doctrine:database:drop --force --env=$(env)
#	bin/console doctrine:database:create --env=$(env)
#	bin/console doctrine:m:m --no-interaction --env=$(env)
#
#db: doctrine_schema

db-empty: ## clear database
	bin/console doctrine:database:drop --force --env=$(env)
	bin/console doctrine:database:create --env=$(env)
	bin/console doctrine:schema:update --force --env=$(env)

fixture:  ##
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


##
## met a jour la branche master local et push sur github puis revient sur la branche dev
##---------------------------------------------------------------------------
github:
	git checkout master
	git merge dev
	git push origin master
	git checkout dev
