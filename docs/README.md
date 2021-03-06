# Vuex ORM Soft Delete

Vuex ORM Soft Delete plugin adds soft delete capabilities on model entities.

The plugin allows models to be soft deleted or "trashed" without actually removing them from the entity data set. Subsequently, when executing queries, the soft deleted models will be excluded from results. Using special query modifiers, queries can be instructed to inclusively or exclusively retrieve soft deletes.


## Sponsors

Vuex ORM is sponsored by awesome folks. Big love to all of them from the whole Vuex ORM community :two_hearts:

#### Super Love Sponsors

<br>

<a href="https://github.com/petertoth">
  <img src="https://avatars2.githubusercontent.com/u/3661783?s=460&v=4" alt="Peter Tóth" width="88" style="border-radius: 8px;">
</a>
<a href="https://github.com/phaust">
  <img src="https://avatars1.githubusercontent.com/u/2367770?s=460&v=4" alt="Mario Kolli" width="88" style="border-radius: 8px;">
</a>
<a href="https://github.com/cannikan">
  <img src="https://avatars2.githubusercontent.com/u/21893904?s=460&v=4" alt="Cannikan" width="88" style="border-radius: 8px;">
</a>
<a href="https://github.com/somazx">
  <img src="https://avatars0.githubusercontent.com/u/7306?s=460&v=4" alt="Andy Koch" width="88" style="border-radius: 8px;">
</a>
<a href="https://github.com/dylancopeland">
  <img src="https://avatars1.githubusercontent.com/u/99355?s=460&v=4" alt="Dylan Copeland" width="88" style="border-radius: 8px;">
</a>

#### Big Love Sponsors

<br>

<a href="https://github.com/geraldbiggs">
  <img src="https://avatars1.githubusercontent.com/u/3213608?s=460&v=4" alt="geraldbiggs" width="64" style="border-radius: 8px;">
</a>
<a href="https://github.com/cuebit">
  <img src="https://avatars0.githubusercontent.com/u/1493221?s=460&v=4" alt="Cue" width="64" style="border-radius: 8px;">
</a>
<a href="https://github.com/kazupon">
  <img src="https://avatars0.githubusercontent.com/u/72989?s=400&v=4" alt="Kazuya Kawaguchi" width="64" style="border-radius: 8px;">
</a>
<a href="https://github.com/jShaf">
  <img src="https://avatars3.githubusercontent.com/u/30289?s=400&v=4" alt="jShaf" width="64" style="border-radius: 8px;">
</a>

#### A Love Sponsors

<br>

<a href="https://github.com/georgechaduneli">
  <img src="https://avatars1.githubusercontent.com/u/9340753?s=460&v=4" alt="George Chaduneli" width="48" style="border-radius: 8px;">
</a>
<a href="https://github.com/bpuig">
  <img src="https://avatars3.githubusercontent.com/u/22938625?s=460&v=4" alt="bpuig" width="48" style="border-radius: 8px;">
</a>
<a href="https://github.com/robokozo">
  <img src="https://avatars2.githubusercontent.com/u/1719221?s=400&v=4" alt="John" width="48" style="border-radius: 8px;">
</a>
<a href="https://github.com/mean-cj">
  <img src="https://avatars3.githubusercontent.com/u/1191385?s=400&v=4" alt="mean-cj" width="48" style="border-radius: 8px;">
</a>


## Table of Contents

- Guide
  - [Installation](/guide/installation.md)
  - [Setup](/guide/setup.md)
  - [Usage](/guide/usage.md)
  - [Options](/guide/options.md)
  - [Sponsors](/guide/sponsors)
- API
  - [Model](/api/model.md)
  - [Query](/api/query.md)


## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtNDQ0NjE3NTgyOTY2LTc1YTI2N2FjMGRlNGNmMzBkMGZlMmYxOTgzYzkzZDM2OTQ3OGExZDRkN2FmMGQ1MGJlOWM1NjU0MmRiN2VhYzQ) for any questions and discussions.

Although there is the Slack Channel, do not hesitate to open an [issue](https://github.com/vuex-orm/plugin-soft-delete/issues) for any question you might have. We're always more than happy to hear any feedback, and we don't care what kind of form they are.


## Plugins

Vuex ORM can be extended via plugins to add additional features. Here is a list of available plugins.

- [Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) – The plugin to sync the store against a RESTful API with [axios](https://github.com/axios/axios).
- [Vuex ORM GraphQL](https://github.com/vuex-orm/plugin-graphql) – The plugin to sync the store against a [GraphQL](https://graphql.org) API.
- [Vuex ORM Search](https://github.com/vuex-orm/plugin-search) – The plugin adds a search method to filter records using fuzzy search logic with [Fuse.js](http://fusejs.io).
- [Vuex ORM Change Flags](https://github.com/vuex-orm/plugin-change-flags) - The plugin adds IsDirty / IsNew flags to model entities.

You can find a list of awesome things related to Vuex ORM at [Awesome Vuex ORM](https://github.com/vuex-orm/awesome-vuex-orm).
