import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Vuex ORM Soft Delete', () => {
  it('should have `key` and `flagName` attributes on new', async () => {
    class User extends Model {
      static entity = 'users'
    }

    createStore([User])

    const expected = { $id: null, deleted_at: null, $isDeleted: false }

    expect(new User()).toEqual(expected)
  })
})
