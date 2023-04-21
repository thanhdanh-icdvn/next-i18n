---
title: "Next.js & Typescript + ESLint"
excerpt: "Mettre en place Typescript & ESLint sur un projet Next.js"
date: '2021-06-10'
---

_En tant que développeur web, difficile de ne pas entendre parler de Typescript... En tant que surcouche à Javascript, il permet de renforcer la robustesse de notre code tout en participant à sa documentation._

Next.js _permet de démarrer un projet rapidement avec Typescript, mais qu'en est-il pour un projet existant ?_

> Sur la base d'un projet Next.js, nous allons voir comment configurer Typescript & ESLint en vue d'une migration Typescript !

## Pré-requis
1. [Node.js](https://nodejs.org/fr/) (>= 10.13)
2. Un projet Next.js (existant ou généré via [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup))

__Ce site web a servi de base à cet article, n'hésitez donc pas à vous référer au [code source](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) pour plus de détails !__

## Typescript
Avec Next.js l'ajout de [Typescript](https://www.typescriptlang.org/) est grandement facilité, et pour commencer il nous suffira donc de créer un fichier `tsconfig.json` à la racine du projet. Sans oublier bien sûr l'ajout des packages de base :
```
npm install -D typescript @types/react @types/node
```

Il suffira alors de (re)lancer le serveur de développement (`next dev`) : Next.js se chargera alors de compléter le fichier `tsconfig.json` et de créer le fichier de déclarations `next-env.d.ts`, nécessaire à la bonne prise en charge des types utiles au framework.

Pour finir, et pour bénéficier d'une expérience Typescript plus complète, il pourra être intéressant d'ajuster le fichier `tsconfig.json`, en passant la clé `strict` à `true`.

## ESLint
Un _linter_ a plusieurs objectifs : normaliser le code (guillemets, ...), et surtout détecter les erreurs liées à la syntaxe. Une mauvaise déclaration de variable, une erreur d'import, ... Toutes ces erreurs que nous sommes tous amenés à faire, un jour ou l'autre... :man-facepalming:.

Et c'est donc là qu'intervient [ESLint](https://eslint.org/) : véritable _béquille_ du développeur, cet outil est aujourd'hui devenu un incontournable dans tous les projets Javascript, et si ce n'est pas déjà le cas je ne peux que vous recommander de l'installer !

Voici un exemple de commande d'installation d'ESLint, avec les plugins principaux utilisés en environnement _React_ :
```
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

Pour une utilisation avec Typescript, il faudra compléter avec les paquets dédiés :
```
npm install -D @typescript-eslint/parser  @typescript-eslint/eslint-plugin
```

Reste maintenant à configurer notre _linter_, sans oublier de prendre en compte la nécessaire **cohabitation de fichiers Javascript et Typescript**, ne serait-ce que le temps de la migration : on ajustera donc notre configuration pour qu'elle puisse s'adapter à chaque type de fichier de notre codebase, via un fichier `.eslintrc.json` placé à la racine du projet :
```json
{
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "jsx-a11y"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": "off"
  },
  "overrides": [
    {
      "files": ["**/*.ts", "**/*.tsx"],
      "parser": "@typescript-eslint/parser",
      "plugins": [
        "@typescript-eslint"
      ],
      "extends": [
        "plugin:@typescript-eslint/recommended"
      ],
      "rules": {
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            "allowExpressions": true,
            "allowConciseArrowFunctionExpressionsStartingWithVoid": true
          }
        ],
        "@typescript-eslint/ban-ts-comment": "warn"
      }
    }
  ]
}
```

Outre les déclarations liées à nos plugins, on notera la présence de la clé `overrides` : comme son nom l'indique, elle permet de définir une configuration complémentaire, spécifique à un type de fichier.

Notre configuration liée à Typescript prendra donc place à cet endroit, avec quelques règles spécifiques selon le besoin.

Pour finir, ne pas oublier d'indiquer à ESLint les fichiers à ignorer, comme ceux des `node_modules` par exemple, avec un fichier `.eslintignore` (placé lui aussi à la racine) :
```
.next
node_modules
```

## Bonus: Prettier
Nous apprécions tous de lire un fichier clair et formaté de façon uniforme, que l'on soit seul ou en équipe... Il suffit de revenir sur un fichier après quelques mois d'absence pour s'en rendre compte ! :eyes:

C'est là qu'intervient [Prettier](https://prettier.io/), en parfait complément à l'incontournable ESLint. Avec cet outil en plus, plus besoin de réfléchir aux tabulations, retours à la ligne, ... Prettier se charge de tout ! :robot_face:

Pour l'installer, rien de plus simple :
```
npm install -D prettier eslint-plugin-prettier eslint-config-prettier
```

On pourra ensuite préciser nos préférences de formatage via un fichier `.prettierrc.json`, placé à la racine de notre projet :
```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 85,
  "tabWidth": 2,
  "useTabs": false
}
```

Et enfin, on pourra optimiser le _parsing_ de Prettier en ajoutant un fichier `.prettierignore`, toujours à la racine de notre projet :
```
.next
node_modules
package-lock.json
public
```

Pour finir, et pour faire en sorte que Prettier et ESLint fonctionnent parfaitement ensemble, on ajustera légèrement notre fichier `.eslintrc.json` :
```json
{
  // ...
  "extends": [
    // ...
    "plugin:prettier/recommended"
  ],
  // ...
}
```

Désormais ESLint s'exécutera automatiquement avec Prettier, nous remontant dans la console l'ensemble des erreurs de syntaxe et/ou de formatage.

Pour parfaire cette configuration, vous pourrez aussi installer l'extension Prettier dans votre IDE, afin, par exemple, de formatter automatiquement à l'enregistrement ! :nerd_face:

## :tada:
**Et voilà !** Notre projet est maintenant prêt pour sa migration Typescript ! Avec ESLint (et Prettier), c'est la garantie d'une expérience de développement optimale et d'un code de qualité ! Il ne reste désormais plus qu'à organiser notre migration en fonction des spécificités de notre projet, pour profiter ensuite de tous les avantages de Typescript : robustesse, maintenabilité,... :computer:
