import Vue from 'vue'
import * as Vuex from 'vuex'
import VuexORM, { Database, Model } from '@vuex-orm/core'
import Options from '@/contracts/Options'
import VuexORMSoftDelete from '@/index'

Vue.use(Vuex)

/**
 * Create a new store instance.
 */
export function createStore(
  models: typeof Model[],
  options?: Options
): Vuex.Store<any> {
  VuexORM.use(VuexORMSoftDelete, options)

  const database = new Database()

  models.forEach((model) => database.register(model))

  return new Vuex.Store({
    plugins: [VuexORM.install(database)],
    strict: true
  })
}

/**
 * Create a new entity state.
 */
export function createState(state: Record<string, any>): Record<string, any> {
  return {
    $name: 'entities',

    ...Object.keys(state).reduce((carry, name) => {
      const data = state[name]

      carry[name] = {
        $connection: 'entities',
        $name: name,
        data
      }

      return carry
    }, {})
  }
}
