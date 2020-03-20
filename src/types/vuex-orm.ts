import { Store } from 'vuex'
import * as Data from '../contracts/Data'
import PrimaryKey from '../contracts/PrimaryKey'
import Predicate from '../contracts/Predicate'
import Options from '../contracts/Options'

declare module '@vuex-orm/core' {
  namespace Model {
    /**
     * Holds the local options applied on the model.
     */
    export let softDeleteConfig: Options

    /**
     * Process the record being trashed.
     */
    export function softDelete<T extends typeof Model>(
      this: T,
      condition: PrimaryKey
    ): Promise<Data.Item>
    export function softDelete<T extends typeof Model>(
      this: T,
      condition: Predicate<Model>
    ): Promise<Data.Collection>
    export function softDelete<T extends typeof Model>(
      this: T,
      condition: any
    ): Promise<any>
  }

  interface Model {
    /**
     * Trash the record on a model instance.
     */
    $softDelete(): Promise<Data.Item<this>>

    /**
     * Trash the record on a model instance.
     * @deprecated since v1.2.0
     */
    softDelete(): Promise<Data.Item<this>>

    /**
     * Determine if the instance has been trashed.
     */
    trashed(): boolean
  }

  namespace Query {
    /**
     * Fetch all trashed records from the store and group by entity.
     */
    export function allTrashed(store: Store<any>): Data.Collections
  }

  interface Query {
    /**
     * Holds the filtering mode for the query builder.
     */
    softDeletesFilter: boolean | null

    /**
     * Process the record(s) to be trashed.
     */
    softDelete(condition: PrimaryKey): Promise<Data.Collections>
    softDelete(condition: Predicate<Model>): Promise<Data.Collections>
    softDelete(condition: any): any

    /**
     * Constraint includes trashed records.
     */
    withTrashed(): this

    /**
     * Constraint restricts to only trashed records.
     */
    onlyTrashed(): this

    /**
     * Fetch all trashed records from the store
     */
    allTrashed(): Data.Collection

    /**
     * Deprecated alias method for `onlyTrashed`.
     * @deprecated since v1.2.0
     */
    trashed(): this
  }
}
