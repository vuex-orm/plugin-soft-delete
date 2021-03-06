import { Model as BaseModel } from '@vuex-orm/core'
import VuexORMSoftDelete from '../VuexORMSoftDelete'

export default function Model(
  context: VuexORMSoftDelete,
  model: typeof BaseModel
): void {
  /**
   * Soft delete model(s) matching a condition.
   */
  model.softDelete = function (payload: any) {
    return this.dispatch('softDelete', payload)
  }

  /**
   * Soft delete a model instance.
   */
  model.prototype.$softDelete = async function (hydrate?) {
    const model = await this.$dispatch(
      'softDelete',
      this.$self().getIdFromRecord(this)
    )

    if (hydrate) {
      this.$fill(model.$getAttributes())

      return this
    }

    const { key, flagName } = context.createConfig(
      this.$self().softDeleteConfig
    )

    this[key] = model[key]
    this[flagName] = model[flagName]

    return model
  }

  /**
   * Restore a model instance.
   */
  model.prototype.$restore = async function (hydrate?) {
    const { key, flagName } = context.createConfig(
      this.$self().softDeleteConfig
    )

    const model = await this.$dispatch('update', {
      where: this.$self().getIdFromRecord(this),
      data: {
        [key]: null,
        [flagName]: false
      }
    })

    if (hydrate) {
      this.$fill(model.$getAttributes())

      return this
    }

    this[key] = model[key]
    this[flagName] = model[flagName]

    return this
  }

  /**
   * Determine if the model instance has been soft deleted.
   */
  model.prototype.$trashed = function () {
    const { flagName } = context.createConfig(this.$self().softDeleteConfig)

    return this[flagName] === true
  }

  /**
   * Soft-delete a model instance.
   * This method is deprecated and will warn users until retired.
   * @deprecated since v1.2.0
   */
  model.prototype.softDelete = function (hydrate?) {
    /* istanbul ignore next */
    if (__DEV__) {
      console.warn(
        'The `softDelete` instance method has been deprecated. Please use `$softDelete`.'
      )
    }

    return this.$softDelete(hydrate)
  }

  /**
   * Add supporting attributes to model.
   */
  const $fields = model.prototype.$fields

  model.prototype.$fields = function () {
    const fields = $fields.call(this)

    const { key, flagName } = context.createConfig(
      this.$self().softDeleteConfig
    )

    return Object.assign({}, fields, {
      [key]: this.$self().attr(null),
      [flagName]: this.$self().attr(false)
    })
  }

  /**
   * Flags are visible by default during model serialization. They can be hidden
   * by setting `exposeFlagsExternally` to false.
   */
  const $toJson = model.prototype.$toJson

  model.prototype.$toJson = function () {
    const toJson = $toJson.call(this)

    const config = context.createConfig(this.$self().softDeleteConfig)

    if (config.exposeFlagsExternally !== true) {
      /* istanbul ignore next */
      const { [config.key]: k, [config.flagName]: fn, ...json } = toJson

      return json
    }

    return toJson
  }
}
