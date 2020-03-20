import { Query as BaseQuery } from '@vuex-orm/core'
import VuexORMSoftDelete from '../VuexORMSoftDelete'
import * as Data from '../contracts/Data'

export default function Query(
  context: VuexORMSoftDelete,
  query: typeof BaseQuery
): void {
  /**
   * Determine if trashed records should be filtered exclusively.
   *   true  = only trashed records
   *   false = include trashed records
   *   null  = exclude trashed records
   */
  query.prototype.softDeletesFilter = null

  /**
   * Constraint includes trashed records.
   */
  query.prototype.withTrashed = function() {
    this.softDeletesFilter = false

    return this
  }

  /**
   * Constraint restricts to only trashed records.
   */
  query.prototype.onlyTrashed = function() {
    this.softDeletesFilter = true

    return this
  }

  /**
   * Deprecated alias method for `onlyTrashed`.
   * @deprecated since v1.2.0
   */
  query.prototype.trashed = function() {
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'The `trashed` method has been deprecated. Please use `onlyTrashed`.'
      )
    }

    return this.onlyTrashed()
  }

  /**
   * Process the record(s) to be trashed.
   * The method expects the condition to be a single or collection of a primary
   * key, a single or collection of a composite key, or a expression closure.
   */
  query.prototype.softDelete = function(condition: any) {
    const config = context.createConfig(this.model.softDeleteConfig)

    let value = Date.now()

    value = typeof config.mutator === 'function' ? config.mutator(value) : value

    const data = {
      [config.key]: value,
      [config.flagName]: true
    }

    if (Array.isArray(condition)) {
      // Array of primary keys
      if (!this.model.isCompositePrimaryKey()) {
        return this.model.update({
          data,
          where: (r) => condition.includes(r[r.$primaryKey()])
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

    return this.model.update({
      data,
      where: condition as any
    })
  }

  /**
   * Fetch all trashed records from the store
   */
  query.prototype.allTrashed = function() {
    return this.onlyTrashed().get()
  }

  /**
   * Fetch all trashed records from the store and group by entity.
   */
  query.allTrashed = function(store) {
    const database = store.$db()
    const models = database.models()

    return Object.keys(models).reduce((collection, entity: string) => {
      collection[entity] = new this(store, entity).onlyTrashed().get()
      return collection
    }, {})
  }

  /**
   * Global select hook prevents trashed records from being selected unless
   * queries are explicity chained with `withTrashed` or `onlyTrashed`.
   */
  query.on('beforeSelect', function<T extends BaseQuery>(
    this: T,
    models: Data.Collection
  ) {
    return models.filter((model) => {
      // Only trashed records.
      if (this.softDeletesFilter === true) {
        return model.trashed()
      }

      // Include trashed records.
      if (this.softDeletesFilter === false) {
        return models
      }

      // Exclude trashed records.
      return !model.trashed()
    })
  })
}
