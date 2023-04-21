---
title: "Rails + Docker + Gitlab = ❤"
excerpt: "CI/CD for a dockerized Ruby On Rails project"
date: '2019-06-25'
---

_A web projects lifecycle doesn't end with its development! It still needs to be published: it's the deployment phase. However, this necessary step very often involves a number of complications... Fortunately, we now have a solid tool: the [CI](https://en.wikipedia.org/wiki/Continuous_integration)/[CD](https://en.wikipedia.org/wiki/Continuous_delivery) is the strongest example, such as the one from [Gitlab](https://about.gitlab.com/)._

> Based on a Ruby On Rails _dockerized_ project, we are going to set up the different elements necessary for our CI/CD: _Compose_ files specific to each environment, and of course a `.gitlab-ci.yml` file, to orchestrate everything! 

## Prerequisites
1. [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/)
2. A dockerized Ruby On Rails project (cf. [this article](./rails-docker))
3. A Gitlab account :astonished:
4. A web server (DigitalOcean, ...) including Docker

__A [demonstration project](https://gitlab.com/soykje/rails-on-docker) has been created for this article, so do not hesitate to refer to it for more details (scripts, ...)!__

## Docker Compose(s)
Starting with a simple `docker-compose.yml` file, we will decline for all environments (development, test and production). Here's an example, taken from the [demonstration project](https://gitlab.com/soykje/rails-on-docker):

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

Here it will globally be a question of adjusting the variables (`RAILS_ENV`, ...), so nothing very complicated.

## Gitlab configuration
The starting point of the Gitlab CI/CD is a `.gitlab-ci.yml` file (placed in the project root), which will orchestrate the different scripts via a _Runner_ (a task executor made available for free by Gitlab, or customized as needed).

Here we'll define three stages: _test_, _release_ and _deploy_. Each step may be specific to an environment or a branch, and above all may condition the execution of the next one. Thanks to this there will be no more (or almost!) "broken" production! :+1:

### Repository settings
First of all, in order to deploy our project on an external server, we must allow the Gitlab CI/CD to work on it. Here is the procedure, laborious but ultimately quite simple:

1. From the server, generate an SSH key (via the `ssh-keygen -t rsa` command). Make sure that the public key is authorized for this server, and saved in the `athorized_keys` folder (or equivalent).
2. In the Gitlab repository, declare a`PRODUCTION_SERVER_PRIVATE_KEY` environment variable corresponding to the private key (in _**Settings > Integration and Continuous Delivery**_)
3. Still in the environment variables section of the Gitlab repository, declare a `PRODUCTION_SERVER_IP` variable, with the IP address of the concerned server.

That's it, the server and your Gitlab repository are now connected! :clinking_glasses: Note that the operation will have to be repeated for each additional environment (*staging*, ...).

### The Gitlab file
The bases of a `.gitlab-ci.yml` file are the stages defining the sequences of scripts, the variables (which can be environment variables from the repository) and of course, the scripts themselves. Again, the file structure is pretty clear:

```yaml
image: docker
services:
  - docker:dind

cache:
  paths:
    - node_modules

variables:
  DOCKER_HOST: tcp://docker:2375/
  DOCKER_DRIVER: overlay2
  CONTAINER_STABLE_IMAGE: $CI_REGISTRY_IMAGE:stable

stages:
  - test
  - release
  - deploy

before_script:
  - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  - apk add --no-cache py-pip python-dev libffi-dev openssl-dev gcc libc-dev make
  - pip install docker-compose
  - docker-compose --version

# ...
```

Our file starts here with the reference image declaration (Docker here). A few settings (cache, variables, addition of dependencies, ...) are added directly from the [official documentation](https://docs.gitlab.com/ee/ci/README.html). We are now ready to start configuring our CI/CD!

#### Test
For the test step we declare a simple script, relying on a specific Compose file. Concretely, it's all about running the tests (Rspec, ...) then purging the Docker images, containers and volumes resulting from this step:

```yaml
test:
  stage: test
  script:
    - docker-compose -f docker-compose.test.yml build --pull
    - docker-compose -f docker-compose.test.yml run --rm app sh -c "./docker/wait_for_services.sh && bundle exec rake db:create spec"
  after_script:
    - docker-compose -f docker-compose.test.yml run --rm app rm -rf tmp/
    - docker-compose -f docker-compose.test.yml down
    - docker volume rm `docker volume ls -qf dangling=true`
```

#### Relase
This is where the most important thing happens: we build the Docker container for our application, before pushing it to the server (if all goes well).

```yaml
release_stable:
  stage: release
  only:
    - production
  script:
    - docker-compose -f docker-compose.production.yml build --pull
    - docker tag railsondocker_production $CONTAINER_STABLE_IMAGE
    - docker push $CONTAINER_STABLE_IMAGE
```

One line here is particularly important: `docker push $CONTAINER_STABLE_IMAGE`. After building the container, we save it in a [container registry](https://docs.gitlab.com/ee/user/packages/container_registry/#gitlab-container-registry) linked to our Gitlab repository. We will then only have to use the container of this registry to deploy our project on the server.

At this stage, only the application container interests us. For this reason there is no database container in the `docker-compose.production.yml` file. This is to avoid overwriting the database with each deployment! :wink:

#### Deploy
The Docker container of our application is now available from the the Gitlab repository's registry. To deploy it, we will _simply_ copy a Compose file specific to the deployment on the server (by authenticating us using the SSH key created previously). This will orchestrate the assembly of the different containers (application from the registry, database), and will be executed via the following script:

```yaml
deploy_stable:
  stage: deploy
  only:
    - production
  environment: production
  before_script:
    - mkdir -p ~/.ssh
    - echo "$PRODUCTION_SERVER_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - which ssh-agent || (apk add openssh-client)
    - eval $(ssh-agent -s)
    - ssh-add ~/.ssh/id_rsa
    - ssh-keyscan -H $PRODUCTION_SERVER_IP >> ~/.ssh/known_hosts
  script:
    - scp -rp ./docker-deploy.production.yml root@${PRODUCTION_SERVER_IP}:~/
    - ssh root@$PRODUCTION_SERVER_IP "docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY};
      docker pull $CONTAINER_STABLE_IMAGE;
      docker-compose -f docker-deploy.production.yml stop;
      docker-compose -f docker-deploy.production.yml rm app --force;
      docker-compose -f docker-deploy.production.yml up -d"
```

## :tada:
**Et voilà !** As often the configuration is the most delicate part for this type of project, but the game is worth the candle: once this is done we get a project with a perfectly functional CI/CD, which we can develop in according to our needs (addition of a _staging_ environment, ...). :slightly_smiling_face:
