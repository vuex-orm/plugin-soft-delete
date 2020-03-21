import { Store } from 'vuex'
import VuexORMSoftDelete from '../VuexORMSoftDelete'
import {
  RootActions as RootActionsContract,
  RootActionContext
} from '../contracts/Store'

export default function RootActions(
  context: VuexORMSoftDelete,
  actions: RootActionsContract
): void {
  /**
   * Trash records and persist the store.
   */
  actions.softDelete = async function(
    this: Store<any>,
    _context: RootActionContext,
    payload: any
  ): Promise<any> {
    const { entity, where } = payload

    return new context.query(this, entity).softDelete(where)
  }
}
