import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Integration - Expose Flags Externally', () => {
  it('can configure global `exposeFlagsExternally` option', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    createStore([User], { exposeFlagsExternally: false })

    await User.create({ data: { id: 1 } })

    const user = User.find(1) as User

    const expected = { $id: '1', id: 1, deleted_at: null, $isDeleted: false }

    expect(user).toEqual(expected)
    expect(user.$getAttributes()).toEqual(expected)

    const serialize = { id: 1 }

    expect(user.$toJson()).toEqual(serialize)
  })

  it('can toggle local `exposeFlagsExternally` option on model', async () => {
    class User extends Model {
      static entity = 'users'

      static softDeleteConfig = {
        exposeFlagsExternally: true
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
        exposeFlagsExternally: false
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    createStore([User, Post])

    await User.create({ data: { id: 1 } })
    await Post.create({ data: { id: 1 } })

    const user = User.find(1) as User

    const expectedUser = {
      $id: '1',
      id: 1,
      deleted_at: null,
      $isDeleted: false
    }
    expect(user).toEqual(expectedUser)
    expect(user.$getAttributes()).toEqual(expectedUser)

    const serializeUser = { id: 1, deleted_at: null, $isDeleted: false }
    expect(user.$toJson()).toEqual(serializeUser)

    const post = Post.find(1) as Post

    const expectedPost = {
      $id: '1',
      id: 1,
      deleted_at: null,
      $isDeleted: false
    }
    expect(post).toEqual(expectedPost)
    expect(post.$getAttributes()).toEqual(expectedPost)

    const serializePost = { id: 1 }
    expect(post.$toJson()).toEqual(serializePost)
  })
})
