---
title: "Jamstack & Gitlab Pages"
excerpt: "Déployer un projet Next.js (SSG) sur Gitlab Pages"
date: '2020-07-27'
---

_Le développement des générateurs de sites statiques (SSG) s'est largement renforcé ces dernières années, avec la promesse de sites web plus performants, plus sûrs et plus faciles à héberger. Un *simple* [CDN](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_diffusion_de_contenu) peut suffire, ce qui simplifie alors d'autant plus la publication de son projet sur le web._

_Gitlab met à disposition gratuitement un hébergement statique pour chaque dépôt de code. Alors pourquoi ne pas en profiter pour y héberger notre projet Jamstack ?_

> Sur la base d'un projet Next.js, nous allons voir comment configuer la CI/CD de Gitlab, grâce au fichier `.gitlab-ci.yml` et à quelques ajustements, pour déployer directement sur Gitlab Pages !

## Pré-requis
1. [Node.js](https://nodejs.org/fr/) (>= 10.13)
2. Un compte Gitlab :astonished:

__Un [projet de démonstration](https://gitlab.com/soykje/next-gitlab-pages/) a été créé dans le cadre de cet article, n'hésitez donc pas à vous y référer pour plus de détails (scripts, ...) !__

## Création du projet
[Next.js](https://nextjs.org/) nous permet de créer rapidement un nouveau projet, grâce aux commandes suivantes :

```bash
npx create-next-app
# ou
yarn create next-app
```

La documentation du site est plutôt complète, et leur [dépôt Github](https://github.com/vercel/next.js) regorge d'informations et d'exemples.

## Configuration du projet
Gitlab Pages propose par défaut des [urls spécifiques](https://docs.gitlab.com/ee/user/project/pages/getting_started_part_one.html#gitlab-pages-default-domain-names) à chaque type de page :

1. S'il s'agit d'une page d'utilisateur ou de groupe (le nom du dépôt est `<username|groupname>.gitlab.io`), l'url du site est alors `https://<username|groupname>.gitlab.io/`
2. S'il s'agit d'une page de projet (issu d'un utilisateur ou d'un groupe), alors l'url devient `https://<username|groupname>.gitlab.io/<projectname>/`

Next.js (comme tous les SSG) n'ayant pas connaissance de cette spécificité, il peut donc s'avérer nécessaire, le cas échéant, d'indiquer le domaine sur lequel il se situe, afin que les liens des assets exportés (dans le dossier `_next`) ne soient pas brisés. :broken_heart:

Ainsi **dans le cas d'une page de projet**, il faudra simplement préciser le nom de celui-ci en valeur du paramètre `assetPrefix` :

```javascript
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/<projectname>/' : ''
}
````

A noter que pour préserver nos liens en environnement local (développement), on utilisera la variable d'environnement Node pour définir plus spécifiquement ce paramètre.

## Le fichier Gitlab
Gitlab Pages s'active automatiquement en présence d'un fichier `.gitlab-ci.yml` comportant une entrée `pages`.

Outre ce fichier de configuration, il faudra aussi s'assurer de la visibilité du site dans les paramètres du dépôt (dans _**Paramètres > Général > Visibilité**_).

Et voici donc le fichier tant attendu :

```yaml
image: node

cache:
  paths:
    - node_modules/

pages:
  before_script:
    # Clean public folder
    - find public -mindepth 1 -maxdepth 1 -type d | xargs rm -rf
    - find public -type f -name "*.html" | xargs rm -rf
    # Install packages
    - npm install
  script:
    # Build application and move content to public folder
    - npm run publish
    - mv out/* public
  after_script:
    # Cleanup
    - rm -rf out
  artifacts:
    paths:
      - public
  only:
    - master
```

La particularité de ce déploiement réside dans les contraintes de Gitlab Pages et de Next.js : le premier accepte pour seul point d'entrée un dossier `public`... qui est aussi un dossier _réservé_ pour le second, et dans lequel on ne peut donc pas faire nos exports ! :exploding_head:

La solution proposée ici, est donc de découper notre script en trois phases :

1. On s'assure que le dossier `public` soit nettoyé de tous les fichiers et/ou dossiers résiduels (sans quoi Next.js refusera d'exporter le projet), puis on installe les packages

2. On compile et on exporte notre projet sous formes de pages statiques, avant de déplacer le contenu généré dans le dossier `public` (à disposition de Gitlab)

3. Une fois ces deux étapes terminées, on supprime le dossier d'export de Next.js (par défaut `out`)

## :tada:
**Et voilà !** Malgré une petite _gymnastique_ imposée par les contraintes respectives de Gitlab Pages et Next.js, le fichier reste simple et lisible ! :muscle: Nous voici désormais libres de publier nos contenus rapidement, sans s'embarraser d'un service supplémentaire et superflu ! :slightly_smiling_face:
