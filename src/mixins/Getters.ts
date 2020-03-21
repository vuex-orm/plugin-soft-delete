import VuexORMSoftDelete from '../VuexORMSoftDelete'
import { Collection } from '../contracts/Data'
import {
  Getters as GettersContract,
  State,
  RootState
} from '../contracts/Store'

export default function Getters(
  _context: VuexORMSoftDelete,
  getters: GettersContract
): void {
  /**
   * Get all trashed records from the store and group by entity.
   */
  getters.allTrashed = (
    state: State,
    _getters: any,
    _rootState: RootState,
    rootGetters: any
  ) => (): Collection => {
    return rootGetters[`${state.$connection}/allTrashed`](state.$name)
  }
}
