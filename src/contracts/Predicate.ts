import { Model } from '@vuex-orm/core'

export type Predicate<M extends Model = Model> = (model: M) => boolean

export default Predicate
