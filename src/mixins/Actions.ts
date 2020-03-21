import VuexORMSoftDelete from '../VuexORMSoftDelete'
import { Actions as ActionsContract, ActionContext } from '../contracts/Store'

export default function Actions(
  _context: VuexORMSoftDelete,
  actions: ActionsContract
): void {
  /**
   * Trash records and persist to the store.
   */
  actions.softDelete = async (
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
}
