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

- **Type**: `() => Promise`

  Soft delete the model instance. Updates the `key` and `flagName` attribute values accordingly.

  Returns a Promise that resolves with the soft deleted model.

### `$trashed`

- **Type**: `() => boolean`

  Determine whether the model has been soft deleted. This method essentially checks whether the [`flagName`](/guide/options.md#flagname) option value is true or false.

- **See also**: [Usage](/guide/usage.md)
