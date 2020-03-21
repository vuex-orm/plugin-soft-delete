import { Model, Query } from '@vuex-orm/core'
import { Actions, Getters, RootGetters, RootActions } from './Store'

export interface Components {
  Model: typeof Model
  Query: typeof Query
  Actions: Actions
  Getters: Getters
  RootActions: RootActions
  RootGetters: RootGetters
}

export default Components
