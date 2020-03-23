# Setup

To install the Soft Delete plugin with Vuex ORM, simply pass the plugin module to `VuexORM.use()`.

```js
import VuexORM from '@vuex-orm/core'
import VuexORMSoftDelete from '@vuex-orm/plugin-soft-delete'

VuexORM.use(VuexORMSoftDelete)
```

Additional options can be passed to configure the plugin.

```js
VuexORM.use(VuexORMSoftDelete, {
  key: 'deleteDate',
  flagName: 'markedForDeletion'
})
```

See all available [Options](./options.md).

### Example

Here is a typical example that demonstrates common setups of Vuex ORM together with the plugin.

```js
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMSoftDelete from '@vuex-orm/plugin-soft-delete'
import User from '@/models/User'

VuexORM.use(VuexORMSoftDelete)

const database = new VuexORM.Database()

database.register(User)

const store = new Vuex.Store({
  plugins: [VuexORM.install(database)],
})

export default store
```
