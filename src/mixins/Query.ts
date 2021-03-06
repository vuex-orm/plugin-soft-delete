import { Query as BaseQuery } from '@vuex-orm/core'
import VuexORMSoftDelete from '../VuexORMSoftDelete'
import * as Data from '../contracts/Data'

export default function Query(
  context: VuexORMSoftDelete,
  query: typeof BaseQuery
): void {
  /**
   * Determine if soft deleted models should be filtered exclusively.
   *   true  = only soft deletes
   *   false = include soft deletes
   *   null  = exclude soft deletes
   */
  query.prototype.softDeleteSelectFilter = null

  /**
   * Constraint includes soft deleted models.
   */
  query.prototype.withTrashed = function () {
    this.softDeleteSelectFilter = false

    return this
  }

  /**
   * Constraint restricts to only soft deleted models.
   */
  query.prototype.onlyTrashed = function () {
    this.softDeleteSelectFilter = true

    return this
  }

  /**
   * Deprecated alias method for `onlyTrashed`.
   * @deprecated since v1.2.0
   */
  query.prototype.trashed = function () {
    /* istanbul ignore next */
    if (__DEV__) {
      console.warn(
        'The `trashed` method has been deprecated. Please use `onlyTrashed`.'
      )
    }

    return this.onlyTrashed()
  }

  /**
   * Process the model(s) to be soft deleted.
   */
  query.prototype.softDelete = function (condition: any) {
    const { key, flagName, mutator } = context.createConfig(
      this.model.softDeleteConfig
    )

    let value = Date.now()

    value = typeof mutator === 'function' ? mutator(value) : value

    const data = {
      [key]: value,
      [flagName]: true
    }

    if (Array.isArray(condition)) {
      // Array of primary keys
      if (!this.model.isCompositePrimaryKey()) {
        return this.model.update({
          data,
          where: (record) => condition.includes(record[record.$primaryKey()])
        })
      }

      // Array of composite primary keys
      if (condition.some((value) => Array.isArray(value))) {
        const keys = condition
          .map((key) => Array.isArray(key) && JSON.stringify(key))
          .filter(Boolean)

        return this.model.update({
          data,
          where: (record) => keys.includes(record.$id)
        })
      }
    }

    return this.model.update({ data, where: condition })
  }

  /**
   * Fetch all soft deletes from the store.
   */
  query.prototype.allTrashed = function () {
    return this.newQuery().onlyTrashed().get()
  }

  /**
   * Patch any new queries so that sub queries, such as relation queries,
   * can respect top level modifiers. For many-to-many relations, due to core
   * API limitations, we're forced to pass-through intermediate models.
   */
  const newQuery = query.prototype.newQuery

  query.prototype.newQuery = function (entity?) {
    const patchedQuery = newQuery.call(this, entity)

    // Only patch queries that are loading relations.
    const loadables = Object.keys(this.load)

    if (loadables.length > 0) {
      patchedQuery.softDeleteSelectFilter = this.softDeleteSelectFilter

      if (entity && entity !== this.entity && this.model.hasPivotFields()) {
        const fields = this.model.pivotFields().reduce((fields, field) => {
          Object.keys(field)
            .filter((entity) => loadables.includes(entity))
            .forEach((entity) => {
              fields.push(field[entity].pivot.entity)
            })
          return fields
        }, [] as string[])

        // Release an entity that is an intermediate to a loadable relation.
        if (fields.includes(entity)) {
          patchedQuery.softDeleteSelectFilter = false
        }
      }
    }

    return patchedQuery
  }

  /**
   * Fetch all soft deletes from the store and group by entity.
   */
  query.allTrashed = function (store) {
    const database = store.$db()
    const models = database.models()

    return Object.keys(models).reduce((collection, entity: string) => {
      collection[entity] = new this(store, entity).onlyTrashed().get()
      return collection
    }, {})
  }

  /**
   * Global select hook prevents soft deleted models from being selected unless
   * queries are explicity chained with `withTrashed` or `onlyTrashed`.
   */
  query.on('beforeSelect', function <T extends BaseQuery>(
    this: T,
    models: Data.Collection
  ) {
    return models.filter((model) => {
      // Only soft deletes
      if (this.softDeleteSelectFilter === true) {
        return model.$trashed()
      }

      // Include soft deletes
      if (this.softDeleteSelectFilter === false) {
        return models
      }

      // Exclude soft deletes
      return !model.$trashed()
    })
  })
}
