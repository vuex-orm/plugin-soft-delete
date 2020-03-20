import { Model, Query } from '@vuex-orm/core'
import Components from './contracts/Components'
import Config from './contracts/Config'
import Options from './contracts/Options'
import Modules from './contracts/Modules'
import ModelMixin from './mixins/Model'
import QueryMixin from './mixins/Query'
import ModulesMixin from './mixins/Modules'
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
   * The module components.
   */
  modules: Modules

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

    this.modules = {
      actions: components.Actions,
      getters: components.Getters,
      rootGetters: components.RootGetters,
      rootActions: components.RootActions
    }

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
    ModulesMixin(this, this.modules)
  }
}
