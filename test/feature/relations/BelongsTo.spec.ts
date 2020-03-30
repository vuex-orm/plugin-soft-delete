import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Belongs To', () => {
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
        id: this.attr(null),
        user_id: this.attr(null),
        user: this.belongsTo(User, 'user_id')
      }
    }

    user!: User
  }

  beforeEach(async () => {
    createStore([User, Post])

    await Post.create({
      data: {
        id: 1,
        user: { id: 1 }
      }
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await User.softDelete(1)

    const post = Post.query()
      .with('user')
      .find(1) as Post

    expect(post.user).toBeNull()
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await User.softDelete(1)

    const post = Post.query()
      .withTrashed()
      .with('user')
      .find(1) as Post

    expect(post.user).toBeInstanceOf(User)
    expect(post.user.$trashed()).toBe(true)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await User.softDelete(1)

    const post = Post.query()
      .onlyTrashed()
      .with('user')
      .find(1) as Post

    expect(post.user).toBeInstanceOf(User)
    expect(post.user.$trashed()).toBe(true)
  })
})
