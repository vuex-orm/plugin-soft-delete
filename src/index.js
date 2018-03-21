export const defaultOptions = {
  key: 'deleted_at',
  debug: false,
  mode: null // [hide, show, all]
}

const plugin = {
  // `components` contains Vuex ORM objects such as Model, Repo, or Query.
  // The plugin author can then extend those objects to add whatever
  // features it needs.
  install (components, installOptions) {

    const pluginOptions = {...defaultOptions, ...installOptions}
    const {Query} = components

    Query.prototype.softDeleteOptions = {...pluginOptions}

    const softDeleteCallback = function (records, entity) {

      const {debug, key, mode} = this.softDeleteOptions

      if (debug || process.env.ENVIRONMENT === 'testing') {
        console.log(' ---------- PROCESS SOFT DELETE HOOK CALLED -------------- ')
        console.log(' > Mode: ', mode)
        console.log(' > Key: ', key)
        console.log(' > Records Count: ', records.length)
        console.log(' > Entity: ', entity)
        console.log(' > Options', this.softDeleteOptions)
      }
      switch (mode) {
        case 'show':
          this.softDeleteOptions.mode = null
          return records.filter(r => !!r[key])
        case 'all':
          this.softDeleteOptions.mode = null
          return records
        default:
          return records.filter(r => !r[key])
      }
    }
    const _delete = Query.prototype.delete
    Query.prototype.delete = function (condition, force = false) {
      if (force) {
        return _delete.call(this, condition)
      }
      const { key } = this.softDeleteOptions
      if (typeof condition === 'function') {
        const _date = new Date()
        this.update.call(this, condition, { [key]: _date })
        return
        /*
        const data = Object.keys(this.state.data)
          .filter(record => !condition(record))
          .reduce((obj, dataId) => {
            obj[dataId] = {
              [key]: new Date()
            }
          }, {})
        // -- update
        this.state.data = {
          ...this.state.data,
          ...data
        }
        */
      }

      const id = typeof condition === 'number' ? condition.toString() : condition
      if (this.state.data[id]) {
        this.state.data[id][key] = new Date()
      }
    }

    Query.on('beforeProcess', softDeleteCallback)

    // -- prototype methods
    Query.prototype.withTrashed = function () {
      // -- remove global process
      this.softDeleteOptions.mode = 'all'
      return this
    }
    Query.prototype.trashed = function () {
      // -- remove global process
      this.softDeleteOptions.mode = 'show'
      return this
    }

  }
}
export default plugin
