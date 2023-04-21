---
title: "Rails + Docker + Gitlab = ❤"
excerpt: "La CI/CD pour un projet Ruby On Rails dockerisé"
date: '2019-06-25'
---

_Le cycle de vie d'un projet web ne s'arrête pas à son développement ! Reste alors à le publier : c'est la phase de déploiement. Cette étape nécessaire implique pourtant très souvent nombre de complications... Heureusement, nous disposons désormais d'un outillage solide : la [CI](https://en.wikipedia.org/wiki/Continuous_integration)/[CD](https://en.wikipedia.org/wiki/Continuous_delivery) en est le plus fort exemple, comme ici celle de [Gitlab](https://about.gitlab.com/)._

> Sur la base d'un projet Ruby On Rails _dockerisé_, nous allons mettre en place les différents éléments nécessaires à notre CI/CD : des fichiers _Compose_ spécifiques à chaque environnement, et bien sûr un fichier `.gitlab-ci.yml`, pour orchestrer le tout ! 

## Pré-requis
1. [Docker](https://docs.docker.com/install/) et [Docker Compose](https://docs.docker.com/compose/)
2. Un projet Ruby On Rails dockerisé (cf. [cet article](./rails-docker))
3. Un compte Gitlab :astonished:
4. Un serveur (DigitalOcean, ...) avec Docker installé

__Un [projet de démonstration](https://gitlab.com/soykje/rails-on-docker) a été créé dans le cadre de cet article, n'hésitez donc pas à vous y référer pour plus de détails (scripts, ...) !__

## Docker Compose(s)
Sur la base d'un simple fichier `docker-compose.yml`, nous allons décliner pour l'ensemble des environnements (développement, test et production). Voici un exemple, extrait du [projet de démonstration](https://gitlab.com/soykje/rails-on-docker) :

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

Il s'agira ici globalement d'ajuster les variables (`RAILS_ENV`, ...), rien de bien compliqué donc.

## Configuration de Gitlab
Le point de départ de la CI/CD de Gitlab est un fichier `.gitlab-ci.yml` (placé en racine de projet), qui orchestrera les différents scripts via un _Runner_ (un exécuteur de tâche mis à disposition gratuitement par Gitlab, ou personnalisé suivant le besoin).

Ici, nous allons définir trois étapes : _test_, _release_ et _deploy_. Chaque étape pourra être spécifique à un environnement, une branche, et surtout pourra conditionner l'exécution de la suivante. Plus (ou presque !) de production "cassée" grâce à cela ! :+1:

### Paramétrage du dépôt
Avant toute chose, en vue de déployer notre projet sur un serveur externe, nous devons permettre à la CI/CD de Gitlab de travailler dessus. Voici la marche à suivre, laborieuse mais finalement assez simple :

1. Depuis le serveur, générer une clé SSH (via la commande `ssh-keygen -t rsa`). S'assurer que la clé publique est bien autorisée pour ce serveur, et enregistrée dans le dossier `athorized_keys` (ou équivalent).
2. Dans le dépôt Gitlab, déclarer une variable d'environnement `PRODUCTION_SERVER_PRIVATE_KEY` correspondant à la clé privée (dans _**Paramètres > Intégration et livraison continue**_)
3. Toujours dans la section des variables d'environnement du dépôt Gitlab, déclarer une variable `PRODUCTION_SERVER_IP`, avec l'adresse IP du serveur concerné.

Et voilà, le serveur et votre dépôt Gitlab sont reliés ! :clinking_glasses: A noter que la manoeuvre sera à répéter pour chaque environnement supplémentaire (*staging*, ...).

### Le fichier Gitlab
Les bases d'un fichier `.gitlab-ci.yml` sont les étapes (`stages`) définissant les séquences de scripts, les variables (qui peuvent être des variables d'environnement du dépôt) et bien entendu, les scripts à proprement parler. Là encore, la structure du fichier est assez claire :

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

Notre fichier commence ici par la déclaration de l’image de référence (ici Docker). S'ajoutent quelques paramétrages (cache, variables, ajout de dépendences, ...) directement issus de la [documentation officielle](https://docs.gitlab.com/ee/ci/README.html). Nous sommes maintenant prêts à démarrer la configuration de notre CI/CD !

#### Test
Pour l'étape de test nous déclarons un simple script, s'appuyant sur un fichier Compose spécifique. Concrètement, il s'agit ici simplement d'exécuter les tests (Rspec, ...) puis de purger les images, conteneurs et volumes Docker issus de cette étape :

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
C'est ici que se déroule le plus important : nous construisons le conteneur Docker de notre application, avant de le pousser sur le serveur (si tout se passe bien).

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

Une ligne ici est particulièrement importante : `docker push $CONTAINER_STABLE_IMAGE`. Après construction du conteneur, nous sauvegardons en effet celui-ci dans un [registre de conteneurs](https://docs.gitlab.com/ee/user/packages/container_registry/#gitlab-container-registry) lié à notre dépôt Gitlab. Nous n'aurons ainsi plus qu'à utiliser le conteneur de ce registre pour déployer notre projet sur le serveur.

A cette étape seul le conteneur de l'application nous intéresse. Pour cette raison pas de conteneur de base de données dans le fichier `docker-compose.production.yml`. Ceci afin d'éviter d'écraser la base de données à chaque déploiement ! :wink:

#### Deploy
Le conteneur Docker de notre application est donc disponible dans le registre du dépôt Gitlab. Pour le déployer, nous allons donc _simplement_ copier un fichier Compose spécifique au déploiement sur le serveur (en nous authentifiant grâce à la clé SSH créée précédemment). Celui-ci orchestrera l'assemblage des différents conteneurs (application issue du registre, base de données), et sera exécuté via le script suivant :

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
**Et voilà !** Comme souvent la configuration est la partie la plus délicate pour ce type de projet, mais le jeu en vaut la chandelle : une fois cela fait nous obtenons un projet équipé d'une CI/CD parfaitement fonctionnelle, que l'on pourra faire évoluer en fonction du besoin (ajout d'un environnement de _staging_, ...). :slightly_smiling_face:
