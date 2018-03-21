import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMPlugin from 'src/index'
import User from './common/models/User'

Vue.use(Vuex)
VuexORM.use(VuexORMPlugin, {
  key: 'deleted_at'
})

const database = new VuexORM.Database()
database.register(User, {})

export const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})
