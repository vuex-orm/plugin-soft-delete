---
sidebarDepth: 2
---

# Model

## Static Properties

### `softDeleteConfig`

- **Type**: `Object`

  The property that holds the model configuration.

- **See also**: [Available Options](/guide/options.md#available-options)


## Static Methods

### `softDelete`

- **Type**: `(id: string | number | Array | Function) => Promise`

  Soft delete a model by primary key(s), composite primary key(s), or expression function.

  Returns a Promise that resolves with the soft deleted models.

- **See also**: [Deleting](/guide/usage.md#deleting)

## Instance Methods

### `$softDelete`

- **Type**: `(hydrate?: boolean) => Promise`

  Soft delete the model instance. By default, this updates only the `key` and `flagName` attribute values on the instance after they are persisted to the store.

  Passing `hydrate` as `true` will also hydrate the given instance. This is useful where there may be `beforeUpdate`/`afterUpdate` hooks on the model that may mutate other values or to simply update instance with the latest data from the store. However, if the instance has any relation attributes loaded through `with`, they will be reset during hydration.
  
  Returns a Promise that resolves with the soft deleted model.

### `$trashed`

- **Type**: `() => boolean`

  Determine whether the model has been soft deleted. This method essentially checks whether the [`flagName`](/guide/options.md#flagname) option value is true or false.

- **See also**: [Usage](/guide/usage.md)
