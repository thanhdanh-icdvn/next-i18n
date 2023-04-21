---
title: "Next.js & Typescript + ESLint"
excerpt: "Set up Typescript & ESLint on a Next.js project"
date: '2021-06-10'
---

_As a web developer, it's hard not to have heard about Typescript... As an overlay to JavaScript, it helps strengthen the robustness of our code while participating in its documentation._

Next.js _allows us to start a project quickly with Typescript, but what about an existing project?_

> Based on a Next.js project, we will see how to configure Typescript & ESLint for a Typescript migration!

## Prerequisites
1. [Node.js](https://nodejs.org/en/) (>= 10.13)
2. A Next.js project (existing one or generated through [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup))

__This website was the starting point for this article, so do not hesitate to refer to its [source code](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) for more details!__

## Typescript
Next.js makes adding [Typescript](https://www.typescriptlang.org/) very easy, and to get started we'll only have to create a `tsconfig.json` file in the root directory. Without forgetting of course the addition of the basic packages:
```
npm install -D typescript @types/react @types/node
```

We'll only need then to (re)launch the development server (`next dev`): Next.js will take care of completing the `tsconfig.json` file and creating the `next-env.d.ts` declaration file, necessary for the good support of types useful to the framework.

To take benefit of a more complete Typescript experience, it might be interesting also to adjust the `tsconfig.json` file, passing the `strict` key to `true`.

## ESLint
A _linter_ have several purposes: to standardize code (single or double quotes, ...), and above all to detect syntax errors. A wrong variable declaration, an import error,... All these errors that we all do, one day or another... :man-facepalming:.

This is where [ESLint](https://eslint.org/) comes in: as a real _crutch_ for developers, this tool has become today a _must-have_ in all JavaScript projects, and if not already the case I strongly suggest you to install it!

Here is a simple installation example for ESLint, with main plugins used in _React_ environment:
```
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

For use with Typescript, it will be necessary to complete with dedicated packages:
```
npm install -D @typescript-eslint/parser  @typescript-eslint/eslint-plugin
```

It still remains to configure our _linter_, without forgetting to take into account the necessary **cohabitation of Javascript and Typescript files**, if only for the time of the migration: we will therefore adjust our configuration so that it can adapt to each type of file in our codebase, via an `.eslintrc.json` file placed at the root of the project:
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

Besides the declarations relative to our plugins, we'll note the presence of the `overrides` key: as its name suggests, it allows you to define an additional configuration, specific to a type of file.

Our Typescript configuration will take place here, with some specific rules as needed.

Finally, don't forget to tell ESLint which files to ignore, such as those from `node_modules` for example, with an `.eslintignore` file (also placed at the root):
```
.next
node_modules
```

## Bonus: Prettier
We all appreciate reading a clear and uniformly formatted file, whether we code alone or in a team... Just come back to a file after a few months of absence to realize it! :eyes:

This is where [Prettier](https://prettier.io/) comes in, perfectly complementing ESLint. With this additional tool, you no longer need to think about tabs, line breaks,... Prettier takes care of everything! :robot_face:

To install it, nothing simpler:
```
npm install -D prettier eslint-plugin-prettier eslint-config-prettier
```

We can then specify our formatting preferences via a `.prettierrc.json` file placed at the root of our project:
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

Finally, we can optimize Prettiers' _parsing_ by adding a `.prettierignore` file, as always at the root of our project:
```
.next
node_modules
package-lock.json
public
```

To make sure that Prettier and ESLint work perfectly together, we will slightly adjust our `.eslintrc.json` file:
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

ESLint will now run automatically with Prettier, reporting all syntax and/or formatting errors to the console.

To complete this setup, you can also install the Prettier extension for your IDE, in order for example to automatically format on save! :nerd_face:

## :tada:
**Et voilà !** Our project is now ready for its Typescript migration! With ESLint (and Prettier), this is the guarantee of an optimal development experience and quality code! Now all that remains is to organize our migration according to the specificities of our project, to then benefit from all the advantages of Typescript: robustness, maintainability,... :computer:
