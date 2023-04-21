---
title: "Rails & Docker"
excerpt: "Improve your Ruby On Rails workflow with Docker"
date: "2019-06-19"
---

_Being a developer often means working as a team :juggling::juggling::juggling:. But who has never known **THE** famous installation that takes a day (or more...) because of environmental concerns or dependencies? Fortunately, [Docker](https://www.docker.com/) is here! Thanks to its containers logic, it allows you to encapsulate applications with their dependencies, thus freeing us from project portability concerns._

> Based on a standard Ruby On Rails project, we are going to set up the various elements necessary for its _dockerization_.

## Prerequisites
1. [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/)
2. A Ruby On Rails project (≥ 5.1) using Webpacker and PostgreSQL (≥ 10)

__A [demonstration project](https://gitlab.com/soykje/rails-on-docker) has been created for this article, so do not hesitate to refer to it for more details (scripts, ...)!__

## Dockerfile
Any Docker project is defined by an original image, which will then be used as a basis for building the various containers (application, database, ...). To do this, all you have to do is create a file simply named `Dockerfile` at the root of our project:

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

The starting point for our file is a Docker image for Ruby. A so-called "alpine" version is used here, that's to say embedding the minimum required to optimize the weight of the final generated image.

We then install the various necessary libraries _(postgresql, nodejs, ...)_ and the _gems_ declared in the `Gemfile` (with a little cleaning at the end of the task, again to optimize the final weight).

Finally, we precompile the _assets_ (if necessary) before launching the global command declared via the `CMD` instruction, which will take care of launching the server (Puma) after having prepared the database (cf. `startup.sh` script).

Note the use of variables that will allow us to build a specific image depending on the environment (development, production, ...). These variables will be defined in each `docker-compose.yml` file.

## Docker Compose
Our general constructor being now ready, all that remains is to define the different containers of our application, with any variations depending on the environment.

In development mode, Rails and Webpacker are separated, in order to improve the responsiveness of the whole. The `docker-compose.yml` file is quite simple to understand, its syntax remaining quite clear:

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

Our three containers are therefore linked to images (from the `Dockerfile`, with the exception of PostgreSQL, for which we use an "alpine" image). They are assigned ports, and possibly commands to be executed at launch.

In some cases, we will define arguments or environment variables, useful for the `Dockerfile`.

Finally the links between services are declared in the `app` container, in the `links` part.

## Rails configuration
Now that the Docker part is set up, we need to make some adjustments in the configuration of our Ruby On Rails project, in particular to take into account the variables defined in the _Compose_ files:

- `config/database.yml`, for `host` and `username`/`password`
- `config/webpacker.yml`, for Webpacker server `host`
- `config/environments/*.rb`, to report the variables defined in the `docker-compose.yml` (optional)

## :tada:
**Et voilà !** Now all that remains is to run the `docker-compose build` command to build our Docker image, then the` docker-compose up` command to launch our project on `localhost: 3000`! Subsequently, we can add new containers (or services): mail server, ... :slightly_smiling_face:
