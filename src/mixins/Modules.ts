import { Store } from 'vuex'
import VuexORMSoftDelete from '../VuexORMSoftDelete'
import Modules, {
  RootState,
  State,
  ActionContext,
  RootActionContext
} from '../contracts/Modules'
import * as Data from '../contracts/Data'

export default function Modules(
  context: VuexORMSoftDelete,
  modules: Modules
): void {
  /**
   * Trash records and persist to the store.
   */
  modules.actions.softDelete = async (
    context: ActionContext,
    payload: any
  ): Promise<any> => {
    const state = context.state
    const entity = state.$name
    const where = payload.where ?? payload

    return context.dispatch(
      `${state.$connection}/softDelete`,
      { entity, where },
      { root: true }
    )
  }

  /**
   * Trash records and persist the store.
   */
  modules.rootActions.softDelete = async function(
    this: Store<any>,
    _context: RootActionContext,
    payload: any
  ): Promise<any> {
    const { entity, where } = payload

    return new context.query(this, entity).softDelete(where)
  }

  /**
   * Get all trashed records from the store and group by entity.
   */
  modules.getters.allTrashed = (
    state: State,
    _getters: any,
    _rootState: RootState,
    rootGetters: any
  ) => (): Data.Collection => {
    return rootGetters[`${state.$connection}/allTrashed`](state.$name)
  }

  /**
   * Get all trashed records belonging to an entity.
   */
  modules.rootGetters.allTrashed = function(
    this: Store<any>,
    _state: RootState
  ) {
    return (entity?: string): Data.Collection | Data.Collections => {
      if (entity) {
        return new context.query(this, entity).allTrashed()
      }

      return context.query.allTrashed(this)
    }
  }
}
