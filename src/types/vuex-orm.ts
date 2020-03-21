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
     * Soft delete models matching a condition.
     */
    export function softDelete(condition: PrimaryKey): Promise<Data.Item>
    export function softDelete(condition: Predicate): Promise<Data.Collection>
    export function softDelete(condition: any): Promise<any>
  }

  interface Model {
    /**
     * Soft delete a model instance.
     */
    $softDelete(hydrate?: boolean): Promise<Data.Item<this>>

    /**
     * Restore a model instance.
     */
    $restore(hydrate?: boolean): Promise<Data.Item<this>>

    /**
     * Determine if the model instance has been soft deleted.
     */
    $trashed(): boolean

    /**
     * Soft delete a model instance.
     * @deprecated since v1.2.0
     */
    softDelete(hydrate?: boolean): Promise<Data.Item<this>>
  }

  namespace Query {
    /**
     * Fetch all soft deletes from the store and group by entity.
     */
    export function allTrashed(store: Store<any>): Data.Collections
  }

  interface Query {
    /**
     * Filtering mode for the query builder.
     */
    softDeletesFilter: boolean | null

    /**
     * Process the model(s) to be soft deleted.
     */
    softDelete(condition: PrimaryKey): Promise<Data.Collections>
    softDelete(condition: Predicate): Promise<Data.Collections>
    softDelete(condition: any): any

    /**
     * Constraint includes soft deleted models.
     */
    withTrashed(): this

    /**
     * Constraint restricts to only soft deleted models.
     */
    onlyTrashed(): this

    /**
     * Fetch all soft deletes from the store.
     */
    allTrashed(): Data.Collection

    /**
     * Deprecated alias method for `onlyTrashed`.
     * @deprecated since v1.2.0
     */
    trashed(): this
  }
}
