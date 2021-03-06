# Usage

Vuex ORM Soft Delete allows models to be soft deleted or "trashed" without actually removing them from the entity data set. When models are soft deleted, the `deleted_at` and `$isDeleted` model attributes are mutated and persisted to the store. Both attributes can be customized, see [Options](./options.md) for more information.

Subsequently, when executing queries, the soft deleted models will be excluded from results.

Since the `$isDeleted` can be customized, you can use the `$trashed` method to determine if a given model instance has been soft deleted:

```js
const user = User.find(1)

if (user.$trashed()) {
  // true
}
```

## Deleting

Models can be soft deleted by calling `softDelete` directly and passing a primary key:

```js
await User.softDelete(1)
```

Model instances can be soft deleted by calling `$softDelete` on the instance itself:

```js
const user = User.find(1)

await user.$softDelete()
```

The `$softDelete` instance method also accepts a `boolean` argument which can force instance hydration:

```js
await user.$softDelete(true)
```

**See also**: [API Reference](/api/model.md#softdelete-2)

### Primary Key

Models can be soft deleted by passing a primary key. Multiple models may be deleted by passing an `Array` of primary keys.

```js
// Delete a model
User.softDelete(1)

// Delete multiple models
User.softDelete([1, 2, 3])
```

### Composite Primary Key

Models with composite primary keys are also supported. Multiple models may be deleted by passing an `Array` of composite primary keys.

```js
// Delete a model
User.softDelete([1, 2])

// Delete multiple models
User.softDelete([[1, 2], [2, 2]])
```

### Expression

Models may be deleted by passing an expression:

```js
User.softDelete((model) => model.name === 'John Doe')
```

### `where` Clause

> Deprecated in 1.2.0

The `where` clause accepts values in the same format as outlined above:

```js
// Delete by PK
User.softDelete({ where: 1 })

// Delete by composite PK
User.softDelete({ where: [2, 2] })

// Delete by expression
User.softDelete({ where: (model) => model.name === 'John Doe' })
```

## Retrieving

Soft deleted models will automatically be excluded from query results. However, you may include soft deleted models in a result set using special query modifiers.

### Including Soft Deleted Models

The `withTrashed` modifier includes soft deleted models in the result set.

```js
User.query().withTrashed().get()
```

### Retrieving Only Soft Deleted Models

The `onlyTrashed` modifier will retrieve **only** soft deleted models.

```js
User.query().onlyTrashed().get()
```

### Retrieving All Soft Deleted Models

You can retrieve all soft deleted models from the store using the `allTrashed` getter:

```js
store.getters['entities/allTrashed']()

/*
{
  users: [
    { $id: '1', id: 1, [...], deleted_at: 1519129853500, $isDeleted: true },
    { $id: '2', id: 2, [...], deleted_at: 1519211810362, $isDeleted: true }
  ],
  posts: [
    { $id: '3', id: 3, user_id: 1, deleted_at: 1519211811670, $isDeleted: true },
    { $id: '4', id: 4, user_id: 1, deleted_at: 1519129864400, $isDeleted: true }
  ]
}
*/
```

Additionally, you can retrieve all soft deleted models for an entity:

```js
store.getters['entities/users/allTrashed']()

/*
[
  { $id: '1', id: 1, [...], deleted_at: 1519129853500, $isDeleted: true },
  { $id: '2', id: 2, [...], deleted_at: 1519211810362, $isDeleted: true }
]
*/
```

This is equivalent to the model query syntax: `User.query().onlyTrashed().get()`

### Relationships

Soft deleted relations respect top level modifiers and retrieving them can be accomplished in the same fashion.

For example, if a soft deleted `User` model has soft deleted `Post` models, you would usually execute the following query chain:

```js
User.query().with('posts').withTrashed().get()
```

However, in cases where you may have soft deleted relations belonging to a non-deleted parent, you can use the usual relation closure:

```js
User.query().with('posts', (query) => {
  query.onlyTrashed()
}).get()
```

Using modifiers in a query chain will impact both parent and nested relations. Using relation closures is the most efficient way of retrieving soft deleted relations in most cases, particularly when using the `onlyTrashed` modifier.

::: tip
When working with many-to-many relations, intermediate models intentionally ignore any soft delete filtering as these models are not often mutated and serve as a junction between models. This is also due to limitations in the Vuex ORM Query API.
:::

## Restoring

Sometimes you may wish to "un-delete" a soft deleted model. To restore a soft deleted model into an active state, use the `$restore` method on a model instance:

```js
const user = User.find(1)

await user.$restore()
```

The `$restore` instance method also accepts a boolean argument which can force instance hydration:

```js
await user.$restore(true)
```
