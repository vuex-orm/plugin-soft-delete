<p align="center">
  <img width="192" src="https://github.com/vuex-orm/vuex-orm/blob/master/logo-vuex-orm.png" alt="Vuex ORM">
</p>

<h1 align="center">Vuex ORM Soft Delete plugin</h1>

<h3 align="center">This project is supported by <a href="https://www.generativeobjects.com/" target="_blank">Generative Objects</a></h3>

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

This is a plugin for the [Vuex-ORM](https://github.com/vuex-orm/vuex-orm) library.

## Installation

Simply reference the github project in your `package.json`

```javascript
dependencies: {
    ...
    "vuexorm-softdelete-plugin": "git+https://github.com/tvillaren/vuexorm-softdelete-plugin.git"
    ...
}
```

and run `npm install`.

Then, you need to install the plugin as any VuexORM plugin. In your store initialization code, simply add:

```javascript
import VuexORMSoftDeletePlugin from 'vuexorm-softdelete-plugin';
```

and then

```javascript
VuexORM.use(VuexORMSoftDeletePlugin);
```

## Usage

The plugin adds a `softDelete` action / mutation that has the same interface as [Vuex ORM Delete method](https://vuex-orm.github.io/vuex-orm/guide/store/deleting-data.html).

### Soft-deleting

#### By Primary Key Value

You can soft-delete by passing a PK directly or through a `where` condition:

```js
// Initial state.
let state = {
    entities: {
        users: {
            '1': { id: 1, name: 'John' },
            '2': { id: 1, name: 'Jane' }
        }
    }
};

// Delete single data by primary key value with model class.
User.softDelete(1);

// Or you can pass object as argument as well.
User.softDelete({ where: 1 });

// Or you can delete data from an existing model instance.
const user = await User.find(1)
user.softDelete()

// Or you can delete single data by primary key value with vuex action.
store.dispatch('entities/users/softDelete', 1)

// Or you can pass obejct as argument as well.
store.dispatch('entities/users/softDelete', { where: 1 })

// State after `delete`
state = {
  entities: {
    users: {
      '1': { id: 1, name: 'John', $isDeleted: true, deleted_at: ... /* JS Date of deletion */ },
      '2': { id: 1, name: 'Jane' }
    }
  }
}
```

#### By Data Closure

You can soft-delete by passing a condition on the record:

```js
// Initial state.
let state = {
    entities: {
        users: {
            '1': { id: 1, name: 'John' },
            '2': { id: 1, name: 'Jane' },
            '3': { id: 1, name: 'George' }
        }
    }
};

// Delete data by closure.
User.softDelete(record => {
    return record.id === 1 || record.name === 'Jane';
});

// Or with object style.
User.softDelete({
    where(record) {
        return record.id === 1 || record.name === 'Jane';
    }
});

// State after `delete`.
state = {
    entities: {
        users: {
            '1': { id: 1, name: 'John', $isDeleted: true, deleted_at: ... /* JS Date of deletion */ },
            '2': { id: 1, name: 'Jane', $isDeleted: true, deleted_at: ... /* JS Date of deletion */ },
            '3': { id: 1, name: 'George' }
        }
    }
};
```

### `$isDeleted` flag and `deleted_at` key

As you can see on the examples above, soft-deleted entities are marked with a `$isDeleted` flag. Additionnally, the date of soft-deletion is stored in the `deleted_at` attribute.  
Both can be custom-named through the plugin options.

### Displaying soft-deleted data

Soft-deleted entities are still in the store but will not appear on queries unless you specifically ask to see _trashed_ data:

#### `allTrashed` getter

This new getter returns all soft-deleted entities in the store.

It can be used globally:

```javascript
// Returns an array of mixed types with all entities
// currently marked as deleted in the store
let results = store.getters['entities/allTrashed']();
```

or specifically to a type:

```javascript
// Returns an array User entities currently marked as deleted in the store
let results = store.getters['entities/users/allTrashed']();
```

#### Query modifiers: `withTrashed()` and `trashed()`

When building a [Vuex ORM query](https://vuex-orm.github.io/vuex-orm/guide/store/retrieving-data.html#query-builder), soft-deleted entities will be _hidden_ from the result by default.

-   **`withTrashed()` modifier**  
    Shows all entities, wether they are soft-deleted or not

```js
const users = User.query()
    .withTrashed()
    .get(); // Returns all User data in the store
```

-   **`trashed()` modifier**
    Shows only soft-deleted entities

```js
const users = User.query()
    .trashed()
    .get(); // Returns all soft-deleted User data in the store
```

## Plugin Options

You can override the default flag & key names by setting the corresponding options at plugin initialization.

| Option name           | Description                                   | Default value |
| --------------------- | --------------------------------------------- | :-----------: |
| flagName              | Sets the name of the _isDeleted_ flag         | `$isDeleted`  |
| key                   | Sets the name of the _deleted_at_ key         | `deleted_at`  |
| exposeFlagsExternally | Adds the flags to the JSON stringified output |    `true`     |

In order to use those options, you can pass them as the second parameter of the `install` call:

```javascript
VuexORM.use(VuexORMSoftDeletePlugin, {
    flagName: 'IsMarkedForDeletion',
    key: 'date_of_deletion',
    exposeFlagsExternally: true
});
```

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
