import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Has One', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        post: this.hasOne(Post, 'user_id')
      }
    }

    post!: Post
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
      data: [
        { id: 1, post: { id: 3 } },
        { id: 2, post: { id: 4 } }
      ]
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Post.softDelete(3)

    const users = User.query().with('post').findIn([1, 2]) as User[]

    expect(users[0].post).toBeNull()
    expect(users[1].post).toBeInstanceOf(Post)
    expect(users[1].post.$trashed()).toBe(false)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Post.softDelete(3)

    const users = User.query()
      .withTrashed()
      .with('post')
      .findIn([1, 2]) as User[]

    expect(users[0].post).toBeInstanceOf(Post)
    expect(users[0].post.$trashed()).toBe(true)
    expect(users[1].post).toBeInstanceOf(Post)
    expect(users[1].post.$trashed()).toBe(false)
  })

  it('can resolve only deleted relation using `onlyTrashed` clause', async () => {
    await Post.softDelete(3)

    const users = User.query()
      .onlyTrashed()
      .with('post')
      .findIn([1, 2]) as User[]

    expect(users[0].post).toBeInstanceOf(Post)
    expect(users[0].post.$trashed()).toBe(true)
    expect(users[1].post).toBeNull()
  })
})
