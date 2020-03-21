# Options

Vuex ORM Soft Delete can be configured at high and low levels. A high level configuration is during plugin installation where options are passed in as plugin options. Low-level configurations are applied at model level, where options can be set on individual models and will take precedence over high-level configuration.

See all [Available Options](#available-options).

## Global Configuration

[Options](#available-options) can be passed to the plugin during installation:

```js
import VuexORMSoftDelete from '@vuex-orm/plugin-soft-delete'

VuexORM.use(VuexORMSoftDelete, {
  flagName: 'toBeDeleted'
})
```

From the example above, the global configuration will be as follows:

```js
{
  key: 'deleted_at',
  flagName: 'toBeDeleted',
  exposeFlagsExternally: true,
  mutator: null
}
```

## Model Configuration

[Options](#available-options) can be applied to models which may override plugin configuration/defaults by defining the `softDeleteConfig` static property:

```js {3-8}
class User extends Model {
  static entity = 'users'

  static softDeleteConfig = {
    key: 'user_deleted',
    mutator: (value) => (new Date(value).toJSON())
  }

  static fields() {
    return {
      //
    }
  }
}
```

From the example above, the model configuration will be as follows:

```js
{
  key: 'user_deleted',
  flagName: '$isDeleted',
  exposeFlagsExternally: true,
  mutator: (value) => (new Date(value).toJSON())
}
```

Furthermore, if we take the example of our model configuration above together with the [Global Configuration](#global-configuration) example, the model's configuration will be as follows:

```js
{
  key: 'user_deleted',
  flagName: 'toBeDeleted',
  exposeFlagsExternally: true,
  mutator: (value) => (new Date(value).toJSON())
}
```

## Available Options

### `key`

- **Type**: `string`

- **Default**: `'deleted_at'`

  The name of the attribute which stores the time (in milliseconds) a model is soft deleted. If the [mutator](#mutator) option is set, it will store the value returned by the mutator.

### `flagName`

- **Type**: `string`

- **Default**: `'$isDeleted'`

  The name of the attribute which stores a `boolean` to determine whether a model is soft deleted.

  By default, the value is `false`.

### `exposeFlagsExternally`

- **Type**: `boolean`

- **Default**: `true`

  Determines whether the `key` and `flagName` attributes should be visible during model serialization, that is, when `instance.$toJson()` is called.

### `mutator`

- **Type**: `(value: number) => any`

- **Default**: `null`

  The mutator which mutates the `key` attribute value. By default the value is `Date.now()`. If a closure is provided, the closure will receive the default value as a single argument.

  For example, you may wish to format the date/time using [Moment.js](https://momentjs.com/):

  ```js
  mutator: (value) => moment(value).format('LLL')
  ```

  Or simply return a fixed value:

  ```js
  mutator: () => 'anotherOneBitesTheDust'
  ```

  And so on...
