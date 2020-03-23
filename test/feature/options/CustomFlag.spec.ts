import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Integration - Custom Key', () => {
  it('can configure global `key` option', async () => {
    class User extends Model {
      static entity = 'users'
    }

    const store = createStore([User], { flagName: 'is_deleted' })

    await User.create({ data: { id: 1 } })

    const expected = createState({
      users: {
        1: { $id: '1', deleted_at: null, is_deleted: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can define local `key` option on model', async () => {
    class User extends Model {
      static entity = 'users'

      static softDeleteConfig = {
        flagName: 'user_flagName'
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static softDeleteConfig = {
        flagName: 'post_flagName'
      }
    }

    const store = createStore([User, Post])

    await User.create({ data: { id: 1 } })

    await Post.create({ data: { id: 1 } })

    const expected = createState({
      users: {
        1: { $id: '1', deleted_at: null, user_flagName: false }
      },
      posts: {
        1: { $id: '1', deleted_at: null, post_flagName: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
