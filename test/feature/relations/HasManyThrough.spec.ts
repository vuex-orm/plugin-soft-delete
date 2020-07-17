import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Has Many Through', () => {
  class Country extends Model {
    static entity = 'countries'

    static fields() {
      return {
        id: this.attr(null),
        posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
      }
    }

    posts!: Post[]
  }

  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        country_id: this.attr(null)
      }
    }
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
    createStore([Country, User, Post])

    await User.insert({
      data: [
        { id: 1, country_id: 1 },
        { id: 2, country_id: 1 }
      ]
    })

    await Post.insert({
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 }
      ]
    })

    await Country.insert({
      data: { id: 1 }
    })
  })

  it('can resolve queries without deleted relations (default)', async () => {
    await Post.softDelete(1)

    const country = Country.query().with('posts').find(1) as Country

    expect(country.posts.length).toBe(1)
    expect(country.posts[0].$trashed()).toBe(false)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Post.softDelete(1)

    const country = Country.query()
      .withTrashed()
      .with('posts')
      .find(1) as Country

    expect(country.posts.length).toBe(2)
    expect(country.posts[0].$trashed()).toBe(true)
    expect(country.posts[1].$trashed()).toBe(false)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await User.softDelete(1)
    await Post.softDelete(1)

    const country = Country.query()
      .onlyTrashed()
      .with('posts')
      .find(1) as Country

    expect(country.posts.length).toBe(1)
    expect(country.posts[0].$trashed()).toBe(true)
  })
})
