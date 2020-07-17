import { Store } from 'vuex'
import VuexORMSoftDelete from '../VuexORMSoftDelete'
import { Collection, Collections } from '../contracts/Data'
import {
  RootGetters as RootGettersContract,
  RootState
} from '../contracts/Store'

export default function RootGetters(
  context: VuexORMSoftDelete,
  rootGetters: RootGettersContract
): void {
  /**
   * Get all trashed records belonging to an entity.
   */
  rootGetters.allTrashed = function (this: Store<any>, _state: RootState) {
    return (entity?: string): Collection | Collections => {
      if (entity) {
        return new context.query(this, entity).allTrashed()
      }

      return context.query.allTrashed(this)
    }
  }
}
