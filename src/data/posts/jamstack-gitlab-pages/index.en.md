---
title: "Jamstack & Gitlab Pages"
excerpt: "Deploy a Next.js project (SSG) on Gitlab Pages"
date: '2020-07-27'
---

_The development of static site generators (SSG) has greatly strengthened in recent years, with the promise of more efficient, safer and easier to host websites. A *simple* [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) may suffice, which then simplifies even more the publication of your project on the web._

_Gitlab provides free static hosting for each code repository. So why not take the opportunity to host our Jamstack project?_

> Based on a Next.js project, we will see how to configure the Gitlab CI/CD, thanks to the `.gitlab-ci.yml` file and some tweaks, to deploy directly to Gitlab Pages!

## Prerequisites
1. [Node.js](https://nodejs.org/en/) (>= 10.13)
2. A Gitlab account :astonished:

__A [demonstration project](https://gitlab.com/soykje/next-gitlab-pages/) has been created for this article, so do not hesitate to refer to it for more details (scripts, ...)!__

## Project creation
[Next.js](https://nextjs.org/) allows us to quickly create a new project, thanks to the following commands:

```bash
npx create-next-app
# ou
yarn create next-app
```

The site's documentation is pretty comprehensive, and their [Github repository](https://github.com/vercel/next.js) is full of information and examples.

## Project configuration
Gitlab Pages offers by default [specific urls](https://docs.gitlab.com/ee/user/project/pages/getting_started_part_one.html#gitlab-pages-default-domain-names) for each type of page:

1. If it's a user or group page (repository name is `<username|groupname>.gitlab.io`), then the site url will be `https://<username|groupname>.gitlab.io/`
2. If it's a project page (from a user or a group), then the site url will be `https://<username|groupname>.gitlab.io/<projectname>/`

Next.js (like all SSG) is not aware of this specificity, so it may be necessary to indicate the domain in which it is located, so that the links of exported assets (in the `_next` folder) are not broken. :broken_heart:

So **in the case of a project page**, you'll simply have to specify the domain name as value of the parameter `assetPrefix`:

```javascript
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/<projectname>/' : ''
}
````

Note that to preserve our links in the local environment (development), we will use the Node environment variable to define this parameter more specifically.

## The Gitlab file
Gitlab Pages automatically activates in presence of a `.gitlab-ci.yml` file with a `pages` entry.

In addition to this configuration file, you will also have to ensure the visibility of the site in the repository parameters (in _**Parameters > General > Visibility**_).

And finally here is the file:

```yaml
image: node

before_script:
  - npm install

cache:
  paths:
    - node_modules

pages:
  before_script:
    # Clean public folder
    - find public -mindepth 1 -maxdepth 1 -type d | xargs rm -rf
    - find public -type f -name "*.html" | xargs rm -rf
  script:
    # Build application and move content to public folder
    - npm run publish # Eq. to 'next build && next export'
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

The particularity of this deployment lies in the constraints of Gitlab Pages and Next.js: the first one accepts for only entry point a `public` folder ... which is also a _reserved_ folder for the second one, and therefore in which we cannot do our exports! :exploding_head:

The solution proposed here is to split our script into three phases:

1. We make sure that the `public` folder is cleaned of all residual files and/or folders (otherwise Next.js will refuse to export the project)

2. We compile and export our project as static pages, before moving the generated content to the `public` folder (available to Gitlab)

3. Once these two steps completed, we delete the Next.js export folder (by default `out`)

## :tada:
**Et voilà !** Despite a little _gymnastics_ imposed by the respective constraints of Gitlab Pages and Next.js, the file remains simple and readable! :muscle: We are now free to publish our content quickly, without having to worry about an additional and unnecessary service! :slightly_smiling_face:
