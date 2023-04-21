---
title: "Rails & Docker"
excerpt: "Améliorer son workflow Ruby On Rails avec Docker"
date: "2019-06-19"
---

_Etre développeu(se)r, c'est bien souvent travailler en équipe :juggling::juggling::juggling:. Mais qui n'a jamais connu **LA** fameuse installation qui prend une journée (ou plus...) à cause d'un souci d'environnement ou de dépendances ? Heureusement, [Docker](https://www.docker.com/) est là ! Graĉe à sa logique de conteneurs, il permet en effet d'encapsuler des applicatifs avec leurs dépendances, nous délivrant ainsi des soucis de portabilité d'un projet._

> Sur la base d'un projet Ruby On Rails classique, nous allons mettre en place les différents éléments nécessaires à la _dockerisation_ de celui-ci.

## Pré-requis
1. [Docker](https://docs.docker.com/install/) et [Docker Compose](https://docs.docker.com/compose/)
2. Un projet Ruby On Rails (≥ 5.1) utilisant Webpacker et PostgreSQL (≥ 10)

__Un [projet de démonstration](https://gitlab.com/soykje/rails-on-docker) a été créé dans le cadre de cet article, n'hésitez donc pas à vous y référer pour plus de détails (scripts, ...) !__

## Dockerfile
Tout projet Docker est défini par une image d'origine, qui servira ensuite de base pour la construction des différents conteneurs (application, base de données, ...). Pour ce faire, il suffit de créer un fichier sobrement nommé `Dockerfile` à la racine de notre projet :

```docker
FROM ruby:2.5.5-alpine

ARG PRECOMPILEASSETS
ARG RAILS_ENV

ENV SECRET_KEY_BASE foo
ENV RAILS_ENV ${RAILS_ENV}
ENV RAILS_SERVE_STATIC_FILES true

RUN apk add --update --no-cache \
    build-base \
    git \
    postgresql-dev \
    postgresql-client \
    imagemagick \
    nodejs-current \
    yarn \
    python2 \
    tzdata \
    file

RUN gem install bundler
# Install gems
RUN mkdir /gems
WORKDIR /gems
COPY Gemfile .
COPY Gemfile.lock .
RUN bundle install -j4 --retry 3 \
    # Remove unneeded files (cached *.gem, *.o, *.c)
    && rm -rf /usr/local/bundle/cache/*.gem \
    && find /usr/local/bundle/gems/ -name "*.c" -delete \
    && find /usr/local/bundle/gems/ -name "*.o" -delete

ARG INSTALL_PATH=/railsondocker
ENV INSTALL_PATH $INSTALL_PATH

WORKDIR $INSTALL_PATH
COPY . .

# Precompile assets (or not)
RUN docker/potential_asset_precompile.sh $PRECOMPILEASSETS

CMD ["docker/startup.sh"]
```

Le point de départ de notre fichier est une image Docker pour Ruby. On utilise ici une version dite "alpine", c'est-à-dire embarquant le minimum requis pour optimiser le poids de l'image finale générée.

Nous installons ensuite les différentes librairies nécessaires _(postgresql, nodejs, ...)_ et les _gems_ déclarées dans le `Gemfile` (avec un peu de nettoyage en fin de tâche, là encore pour optimiser le poids final).

Pour finir nous précompilons les _assets_ (si besoin) avant de lancer la commande globale déclarée via l'instruction `CMD`, qui se chargera de lancer le serveur (Puma) après avoir préparé la base de données (cf. script `startup.sh`).

A noter l'utilisation de variables qui nous permettrons de construire une image spécifique selon l'environnement (développement, production, ...). Ces variables seront définies dans chaque fichier `docker-compose.yml`.

## Docker Compose
Notre constructeur général étant maintenant prêt, ne reste plus qu'à définir les différents conteneurs de notre application, avec les variations éventuelles en fonction de l'environnement.

En mode développement, Rails et Webpacker sont séparés, afin d'améliorer la réactivité de l'ensemble. Le fichier `docker-compose.yml` est assez simple à comprendre, sa syntaxe restant assez claire :

```docker
version: '3.0'
services:
  db:
    image: postgres:11-alpine
    ports:
      - 5433:5432
    environment:
      POSTGRES_PASSWORD: postgres

  webpacker:
    image: railsondocker_development
    command: ["./docker/start_webpack_dev.sh"]
    environment:
      - NODE_ENV=development
      - RAILS_ENV=development
      - WEBPACKER_DEV_SERVER_HOST=0.0.0.0
    volumes:
      - .:/railsondocker:cached
    ports:
      - 3035:3035

  app:
    image: railsondocker_development
    build:
      context: .
      args:
        - PRECOMPILEASSETS=NO
    environment:
      - RAILS_ENV=development
    links:
      - db
      - webpacker
    ports:
      - 3000:3000
    volumes:
      - .:/railsondocker:cached
```

Nos trois conteneurs sont donc liés à des images (issues du `Dockerfile`, à l’exception de PostgreSQL, pour lequel nous faisons appel à une image "alpine"). On leur assigne des ports, et éventuellement des commandes à exécuter au lancement.

Dans certains cas on définira des arguments ou variables d’environnements, utiles pour le `Dockerfile`.

Enfin les liens entre services sont déclarés dans le conteneur `app`, dans la partie `links`.

## Configuration de Rails
Maintenant que la partie Docker est mise en place, il faut effectuer quelques ajustements dans la configuration de notre projet Ruby On Rails, en particulier pour tenir compte des variables définies dans les fichiers _Compose_ :

- `config/database.yml`, pour le `host` et les `username`/`password`
- `config/webpacker.yml`, pour le `host` du serveur de Webpacker
- `config/environments/*.rb`, pour reporter les variables définies dans le `docker-compose.yml` (optionnel)

## :tada:
**Et voilà !** Il ne reste maintenant plus qu’à lancer la commande `docker-compose build` pour construire notre image Docker, puis la commande `docker-compose up` pour lancer notre projet sur `localhost:3000` ! Par la suite, on pourra ajouter de nouveaux conteneurs (ou services) : serveur mail, ... :slightly_smiling_face:
