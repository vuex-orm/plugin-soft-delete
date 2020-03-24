import { Model, Query } from '@vuex-orm/core'
import Components from './contracts/Components'
import Config from './contracts/Config'
import Options from './contracts/Options'
import * as Store from './contracts/Store'
import ModelMixin from './mixins/Model'
import QueryMixin from './mixins/Query'
import ActionsMixin from './mixins/Actions'
import GettersMixin from './mixins/Getters'
import RootActionsMixin from './mixins/RootActions'
import RootGettersMixin from './mixins/RootGetters'
import GlobalConfig from './config/GlobalConfig'

export default class VuexORMSoftDelete {
  /**
   * The Model component.
   */
  model: typeof Model

  /**
   * The Query component.
   */
  query: typeof Query

  /**
   * The store action tree.
   */
  actions: Store.Actions

  /**
   * The store getters tree.
   */
  getters: Store.Getters

  /**
   * The store root getters tree.
   */
  rootGetters: Store.RootGetters

  /**
   * The store root action tree.
   */
  rootActions: Store.RootActions

  /**
   * The global configuration object.
   */
  config: Config

  /**
   * Create a new plugin instance.
   */
  constructor(components: Components, config: Options) {
    this.model = components.Model
    this.query = components.Query

    this.actions = components.Actions
    this.getters = components.Getters
    this.rootActions = components.RootActions
    this.rootGetters = components.RootGetters

    this.config = this.createConfig(config)
  }

  /**
   * Create a new config by merging with global user-defined config.
   * Allows for generating local configs such as on a per-model basis.
   */
  createConfig(config?: Options): Config {
    return {
      ...GlobalConfig,
      ...this.config,
      ...config
    }
  }

  /**
   * Plugin features.
   */
  plugin(): void {
    ModelMixin(this, this.model)
    QueryMixin(this, this.query)
    ActionsMixin(this, this.actions)
    GettersMixin(this, this.getters)
    RootActionsMixin(this, this.rootActions)
    RootGettersMixin(this, this.rootGetters)
  }
}
