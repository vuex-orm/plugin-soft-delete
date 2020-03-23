---
sidebarDepth: 2
---

# Query

## Filters

### `withTrashed`

- **Type**: `() => Query`

  Filters the result set to include soft deleted models.

- **See also**: [Including Soft Deleted Models](/guide/usage.md#including-soft-deleted-models)

### `onlyTrashed`

- **Type**: `() => Query`

  Filters the result set so the query chain applies to **only** soft deleted models.

- **See also**: [Retrieving Only Soft Deleted Models](/guide/usage.md#retrieving-only-soft-deleted-models)


## Results

### `allTrashed`

- **Type**: `() => Array`

  Execute the query chain and return only soft deleted models.

- **See also**: [Retrieving All Soft Deleted Models](/guide/usage.md#retrieving-all-soft-deleted-models)
