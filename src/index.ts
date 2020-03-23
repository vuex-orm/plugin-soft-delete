import './types/vuex-orm'

import Components from './contracts/Components'
import Options from './contracts/Options'
import Config from './contracts/Config'
import VuexORMSoftDelete from './VuexORMSoftDelete'

export { Options, Config }

export default {
  install(components: Components, config: Options): void {
    new VuexORMSoftDelete(components, config).plugin()
  }
}
