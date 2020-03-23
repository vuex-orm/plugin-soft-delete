# Installation

You can install Vuex ORM Soft Delete via NPM, Yarn, or download it directly. This is a plugin for Vuex ORM, therefore you must ensure [Vuex ORM](https://github.com/vuex-orm/vuex-orm) and [Vuex](https://vuex.vuejs.org/) are installed.

## NPM

```bash
npm install @vuex-orm/plugin-soft-delete --save
```

## Yarn

```bash
yarn add @vuex-orm/plugin-soft-delete
```

## Direct Download / CDN

[Unpkg.com](https://unpkg.com) provides NPM-based CDN links. Simply download and include with a script tag.

For development environments, testing and learning purposes, you can use the latest uncompressed version with:

```html
<script src="https://unpkg.com/@vuex-orm/plugin-soft-delete"></script>
```

For production, it's recommended to link to a specific version number and build to avoid unexpected breakage from newer versions:

```html
<script src="https://unpkg.com/@vuex-orm/plugin-soft-delete@1.2.0/vuex-orm-soft-delete.min.js"></script>
```

See the [releases](https://github.com/vuex-orm/plugin-soft-delete/releases) for available versions.

If you are using native ES Modules, there is also an ESM compatible build:

```html
<script type="module">
  import VuexORMSoftDelete from 'https://unpkg.com/@vuex-orm/plugin-soft-delete/dist/vuex-orm-soft-delete.esm.js'
</script>
```

### Build Variants

In the `dist/` directory of the NPM package you will find many different builds. Each of them have their use depending on your build environment and may help to reduce bundle sizes.

|                            | URL                                                                                                                  |
|----------------------------|:---------------------------------------------------------------------------------------------------------------------|
| Development (uncompressed) | [vuex-orm-soft-delete.js](https://unpkg.com/@vuex-orm/plugin-soft-delete)                                            |
| Production (compressed)    | [vuex-orm-soft-delete.min.js](https://unpkg.com/@vuex-orm/plugin-soft-delete/dist/vuex-orm-soft-delete.min.js)       |
| CommonJS                   | [vuex-orm-soft-delete.common.js](https://unpkg.com/@vuex-orm/plugin-soft-delete/dist/vuex-orm-soft-delete.common.js) |
| ES Module                  | [vuex-orm-soft-delete.esm.js](https://unpkg.com/@vuex-orm/plugin-soft-delete/dist/vuex-orm-soft-delete.esm.js)       |


## Dev Build

The built files in `/dist` folder are only checked-in during releases. To use the latest source code on GitHub, you will have to run a build yourself.

```bash
git clone https://github.com/vuex-orm/plugin-soft-delete.git node_modules/@vuex-orm/plugin-soft-delete
cd node_modules/@vuex-orm/plugin-soft-delete
yarn && yarn build
```
