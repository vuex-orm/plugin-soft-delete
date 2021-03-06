<p align="center">
  <img width="192" src="https://github.com/vuex-orm/vuex-orm/raw/master/logo-vuex-orm.png" alt="Vuex ORM">
</p>

<h1 align="center">Vuex ORM Plugin: Soft Delete</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@vuex-orm/plugin-soft-delete">
    <img alt="npm" src="https://img.shields.io/npm/v/@vuex-orm/plugin-soft-delete?color=blue" alt="npm">
  </a>
  <a href="https://travis-ci.org/vuex-orm/plugin-soft-delete">
    <img src="https://travis-ci.org/vuex-orm/plugin-soft-delete.svg?branch=master" alt="Travis CI">
  </a>
  <a href="https://codecov.io/gh/vuex-orm/plugin-soft-delete">
    <img src="https://codecov.io/gh/vuex-orm/plugin-soft-delete/branch/master/graph/badge.svg" alt="codecov">
  </a>
  <a href="https://github.com/vuex-orm/plugin-soft-delete/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@vuex-orm/plugin-soft-delete.svg" alt="License">
  </a>
</p>

Vuex ORM Soft Delete plugin adds soft delete capabilities to [Vuex ORM](https://github.com/vuex-orm/vuex-orm) models.

The plugin allows models to be soft deleted or "trashed" without actually removing them from the entity data set. Subsequently, when executing queries, the soft deleted models will be excluded from results. Using query modifiers, queries can be instructed to inclusively or exclusively retrieve soft deletes.

```js
// Model action example...
User.softDelete(1)

// Instance action example...
const user = User.find(1)
await user.$softDelete()

// Query integration example...
User.query().withTrashed().get()
User.query().onlyTrashed().get()
```

<h2 align="center">Sponsors</h2>

<p align="center">Vuex ORM is sponsored by awesome folks. Big love to all of them from whole Vuex ORM community :two_hearts:</p>

<h4 align="center">Super Love Sponsors</h4>

<p align="center">
  <a href="https://github.com/petertoth">
    <img src="https://avatars2.githubusercontent.com/u/3661783?s=460&v=4" alt="Peter Tóth" width="88">
  </a>
  <a href="https://github.com/phaust">
    <img src="https://avatars1.githubusercontent.com/u/2367770?s=460&v=4" alt="Mario Kolli" width="88">
  </a>
  <a href="https://github.com/cannikan">
    <img src="https://avatars2.githubusercontent.com/u/21893904?s=460&v=4" alt="Cannikan" width="88">
  </a>
  <a href="https://github.com/somazx">
    <img src="https://avatars0.githubusercontent.com/u/7306?s=460&v=4" alt="Andy Koch" width="88">
  </a>
  <a href="https://github.com/dylancopeland">
    <img src="https://avatars1.githubusercontent.com/u/99355?s=460&v=4" alt="Dylan Copeland" width="88">
  </a>
</p>

<h4 align="center">Big Love Sponsors</h4>

<p align="center">
  <a href="https://github.com/geraldbiggs">
    <img src="https://avatars1.githubusercontent.com/u/3213608?s=460&v=4" alt="geraldbiggs" width="64">
  </a>
  <a href="https://github.com/cuebit">
    <img src="https://avatars0.githubusercontent.com/u/1493221?s=460&v=4" alt="Cue" width="64">
  </a>
  <a href="https://github.com/kazupon">
    <img src="https://avatars0.githubusercontent.com/u/72989?s=400&v=4" alt="Kazuya Kawaguchi" width="64">
  </a>
  <a href="https://github.com/jShaf">
    <img src="https://avatars3.githubusercontent.com/u/30289?s=400&v=4" alt="jShaf" width="64">
  </a>
</p>

<h4 align="center">A Love Sponsors</h4>

<p align="center">
  <a href="https://github.com/georgechaduneli">
    <img src="https://avatars1.githubusercontent.com/u/9340753?s=460&v=4" alt="George Chaduneli" width="48">
  </a>
  <a href="https://github.com/bpuig">
    <img src="https://avatars3.githubusercontent.com/u/22938625?s=460&v=4" alt="bpuig" width="48">
  </a>
  <a href="https://github.com/robokozo">
    <img src="https://avatars2.githubusercontent.com/u/1719221?s=400&v=4" alt="John" width="48">
  </a>
  <a href="https://github.com/mean-cj">
    <img src="https://avatars3.githubusercontent.com/u/1191385?s=400&v=4" alt="mean-cj" width="48">
  </a>
</p>

## Documentation

You can check out the full documentation for Vuex ORM Plugin: Soft Delete at https://vuex-orm.github.io/plugin-soft-delete.

## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtNDQ0NjE3NTgyOTY2LTc1YTI2N2FjMGRlNGNmMzBkMGZlMmYxOTgzYzkzZDM2OTQ3OGExZDRkN2FmMGQ1MGJlOWM1NjU0MmRiN2VhYzQ) for any questions and discussions.

Although there is the Slack Channel, do not hesitate to open an [issue](https://github.com/vuex-orm/plugin-soft-delete/issues) for any question you might have. We're always more than happy to hear any feedback, and we don't care what kind of form they are.

## Plugins

Vuex ORM can be extended via plugins to add additional features. Here is a list of available plugins.

- [Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) – The plugin to sync the store against a RESTful API.
- [Vuex ORM GraphQL](https://github.com/vuex-orm/plugin-graphql) – The plugin to sync the store against a [GraphQL](https://graphql.org) API.
- [Vuex ORM Search](https://github.com/vuex-orm/plugin-search) – The plugin adds a search() method to filter records using fuzzy search logic from the [Fuse.js](http://fusejs.io).
- [Vuex ORM Change Flags](https://github.com/vuex-orm/plugin-change-flags) - Vuex ORM plugin for adding IsDirty / IsNew flags to model entities.

Also, you can find a list of awesome things related to Vuex ORM at [Awesome Vuex ORM](https://github.com/vuex-orm/awesome-vuex-orm).

## Contribution

We are excited that you are interested in contributing to Vuex ORM Plugin: Soft Delete! Anything from raising an issue, submitting an idea of a new feature, or making a pull request is welcome! Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

### Pull Request Guidelines

When submitting a new pull request, please make sure to follow these guidelines:

- **For feature requests:** Checkout a topic branch from `dev` branch, and merge back against `dev` branch.
- **For bug fixes:** Checkout a topic branch from `master` branch, and merge back against `master` branch.

These rules also apply to the documentation. If you're submitting documentation about a new feature that isn't released yet, you must checkout the `dev` branch, but for non-functional updates, such as fixing a typo, you may checkout and commit to the `master` branch.

### Scripts

There are several scripts to help with development.

```bash
yarn build
```

Compile files and generate bundles in `dist` directory.

```bash
yarn lint
```

Lint files using [Prettier](https://prettier.io/).

```bash
yarn test
```

Run the test using [Jest](https://jestjs.io/).

```bash
yarn test:watch
```

Run the test in watch mode.

```bash
yarn coverage
```

Generate test coverage in `coverage` directory.

```bash
yarn docs
```

Build and boot documentation server with [VuePress](https://vuepress.vuejs.org/).

## License

Vuex ORM Plugin: Soft Delete is open-sourced software licensed under the [MIT license](./LICENSE).
