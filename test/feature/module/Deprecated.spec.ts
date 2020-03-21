import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Module - Deprecated', () => {
  const mockDate = Date.now()
  const spyOnDate = jest.spyOn(Date, 'now').mockImplementation(() => mockDate)

  afterAll(() => {
    spyOnDate.mockReset()
  })

  it('can delete by passing a `where` condition', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await store.dispatch('entities/users/create', { data: { id: 1 } })

    await store.dispatch('entities/users/softDelete', { where: 1 })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
