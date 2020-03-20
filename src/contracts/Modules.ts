import Actions from '@vuex-orm/core/lib/modules/contracts/Actions'
import ActionContext from '@vuex-orm/core/lib/modules/contracts/ActionContext'
import RootActions from '@vuex-orm/core/lib/modules/contracts/RootActions'
import RootActionContext from '@vuex-orm/core/lib/modules/contracts/RootActionContext'
import Getters from '@vuex-orm/core/lib/modules/contracts/Getters'
import RootGetters from '@vuex-orm/core/lib/modules/contracts/RootGetters'
import State from '@vuex-orm/core/lib/modules/contracts/State'
import RootState from '@vuex-orm/core/lib/modules/contracts/RootState'

export {
  Actions,
  ActionContext,
  RootActions,
  RootActionContext,
  Getters,
  RootGetters,
  State,
  RootState
}

export interface Modules {
  actions: Actions
  getters: Getters
  rootGetters: RootGetters
  rootActions: RootActions
}

export default Modules
