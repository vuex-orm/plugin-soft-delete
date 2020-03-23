import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Integration - Custom Key', () => {
  it('can configure global `key` option', async () => {
    class User extends Model {
      static entity = 'users'
    }

    const store = createStore([User], { key: 'custom_key' })

    await User.create({ data: { id: 1 } })

    const expected = createState({
      users: {
        1: { $id: '1', custom_key: null, $isDeleted: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can define local `key` option on model', async () => {
    class User extends Model {
      static entity = 'users'

      static softDeleteConfig = {
        key: 'user_key'
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static softDeleteConfig = {
        key: 'post_key'
      }
    }

    const store = createStore([User, Post])

    await User.create({ data: { id: 1 } })

    await Post.create({ data: { id: 1 } })

    const expected = createState({
      users: {
        1: { $id: '1', user_key: null, $isDeleted: false }
      },
      posts: {
        1: { $id: '1', post_key: null, $isDeleted: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
