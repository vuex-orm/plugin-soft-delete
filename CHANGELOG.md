## [1.2.1](https://github.com/vuex-orm/plugin-soft-delete/compare/v1.2.0...v1.2.1) (2020-03-30)


### Improvements

- Add relationship support. Please [refer to the docs](https://vuex-orm.github.io/plugin-soft-delete/guide/usage.html#relationships) for more details. ([#8](https://github.com/vuex-orm/plugin-soft-delete/pull/8))


# [1.2.0](https://github.com/vuex-orm/plugin-soft-delete/compare/v1.1.0...v1.2.0) (2020-03-23)


### Features

#### A brand new episode of the Vuex ORM Soft Delete plugin.

While the architecture and codebase has undergone a major transplant, the existing scope is left intact to serve existing users.

- Global and model level option configurations.
  - `softDeleteConfig` can be defined on models to override global options/defaults.
- Composite Primary Key support.
- Single and batch delete models.
- Restore deleted models.
- Model state indicator through `instance.$trashed()`.
  - A unified method edition of `instance.$isDeleted` since it's an interchangeable property. 
- User-defined mutator for the `key` attribute.
  - Intersect the date value passed as argument or simply return any value to be stored.
  - Global and per-model configuration.
- Typescript support.
- Comprehensive coverage tests.

### Improvements

- `key` attribute uses `Date.now()` instead of `new Date`.
  - Enables better conditional treatment over string representation and prevents an empty object persisting to the store.
- Deleting instance updates reference.
  - Removes the habit of fetching the same record after it's trashed.
- Allows forceful hydration after deleting and restoring.
- Eloquent-esque naming conventions for query builder.
  - `withTrashed` and `onlyTrashed` are consistent with other ORM's.
- Fixes model serializing that'd ceased functioning since it changed in **@vuex-orm/core**.
- Compatible with recent releases of **@vuex-orm/core**.
- Better alignment with **@vuex-orm/core** codebase and API. 
- Utilises some existing typings from **@vuex-orm/core** for consistency and support. 

### Deprecations

- Query chain method `onlyTrashed` supersedes `trashed`.
- Model instance method `$softDelete` supersedes `softDelete`.

_All deprecations come with warnings outside production mode._


# 1.1.0 (2019-04-15)


The whole new version of soft delete plugin.


