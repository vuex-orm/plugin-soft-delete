import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Module - Retrieve All', () => {
  const mockDate = Date.now()
  const spyOnDate = jest.spyOn(Date, 'now').mockImplementation(() => mockDate)

  afterAll(() => {
    spyOnDate.mockReset()
  })

  it('can retrieve all deleted records by entity', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await User.create({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    await User.softDelete([1, 2])

    const users = store.getters['entities/users/allTrashed']()

    const expected = [
      { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true },
      { $id: '2', id: 2, deleted_at: mockDate, $isDeleted: true }
    ]

    expect(users).toEqual(expected)
  })

  it('can retrieve all deleted records in the store', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User, Post])

    await User.create({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })
    await Post.create({ data: [{ id: 4 }, { id: 5 }, { id: 6 }] })

    await User.softDelete([1, 3])
    await Post.softDelete([4, 6])

    const allTrashed = store.getters['entities/allTrashed']()

    const expected = {
      users: [
        { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true },
        { $id: '3', id: 3, deleted_at: mockDate, $isDeleted: true }
      ],
      posts: [
        { $id: '4', id: 4, deleted_at: mockDate, $isDeleted: true },
        { $id: '6', id: 6, deleted_at: mockDate, $isDeleted: true }
      ]
    }

    expect(allTrashed).toEqual(expected)
  })
})
