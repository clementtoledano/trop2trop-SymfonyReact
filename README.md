### Actualités
    - Les fixtures ne sont plus a jour, depuis l'utilisation de vich/uploader-bundle.
    - Probleme avec docker : Deux adresses differentes pour la base de données
    - Beaucoup trop d'appel à l'api par react.

## Pour installer :

1 - make start

2 - composer install

3 - yarn install

4 - bin/console doctrine:database:create

-> dans le .env
* url pour create / migrate
DATABASE_URL=mysql://root:root@127.0.0.1:3306/trop2trop?serverVersion=5.7

5 - make migrate

## Pour lancer :

make start && make encore-run

-> dans le .env
*  url pour production
DATABASE_URL=mysql://root:root@db:3306/trop2trop?serverVersion=5.7



le site : http://localhost:8000/

api platform : http://localhost:8000/api

phpmyadmin : http://localhost:9000/
