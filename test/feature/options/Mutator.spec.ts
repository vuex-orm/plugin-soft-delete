import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Integration - Mutator', () => {
  const mockDate = Date.now()
  const spyOnDate = jest.spyOn(Date, 'now').mockImplementation(() => mockDate)

  afterAll(() => {
    spyOnDate.mockReset()
  })

  it('can configure global `mutate` option', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const mutator = (value: number) => new Date(value).toString()

    const store = createStore([User], { mutator })

    await User.create({ data: { id: 1 } })

    await User.softDelete(1)

    const expectedDate = new Date(mockDate).toString()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: expectedDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can configure local `mutate` option on model', async () => {
    class User extends Model {
      static entity = 'users'

      static softDeleteConfig = {
        mutator(value: number) {
          return new Date(value).toJSON()
        }
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static softDeleteConfig = {
        mutator() {
          return 'today'
        }
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User, Post])

    await User.create({ data: { id: 1 } })
    await Post.create({ data: { id: 1 } })

    await User.softDelete(1)
    await Post.softDelete(1)

    const expectedMockDate = new Date(mockDate).toJSON()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: expectedMockDate, $isDeleted: true }
      },
      posts: {
        1: { $id: '1', id: 1, deleted_at: 'today', $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
