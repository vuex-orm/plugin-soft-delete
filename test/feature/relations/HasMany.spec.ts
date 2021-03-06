import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Has Many', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        posts: this.hasMany(Post, 'user_id')
      }
    }

    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null),
        user_id: this.attr(null)
      }
    }
  }

  beforeEach(async () => {
    createStore([User, Post])

    await User.create({
      data: {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }]
      }
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Post.softDelete(1)

    const user = User.query().with('posts').find(1) as User

    expect(user.posts.length).toBe(1)
    expect(user.posts[0].$trashed()).toBe(false)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Post.softDelete(1)

    const user = User.query().withTrashed().with('posts').find(1) as User

    expect(user.posts.length).toBe(2)
    expect(user.posts[0].$trashed()).toBe(true)
    expect(user.posts[1].$trashed()).toBe(false)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await Post.softDelete(1)

    const user = User.query().onlyTrashed().with('posts').find(1) as User

    expect(user.posts.length).toBe(1)
    expect(user.posts[0].$trashed()).toBe(true)
  })
})
