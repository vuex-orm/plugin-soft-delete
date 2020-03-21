import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Model - Restore', () => {
  const mockDate = Date.now()

  it('can restore instance', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await User.insert({
      data: { id: 1, deleted_at: mockDate, $isDeleted: true }
    })

    const user = User.find(1) as User

    user.$restore()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: null, $isDeleted: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can restore instance with composite primary key', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['key_1', 'key_2']

      static fields() {
        return {
          key_1: this.attr(null),
          key_2: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await User.insert({
      data: [{ key_1: 1, key_2: 2, deleted_at: mockDate, $isDeleted: true }]
    })

    const user = User.find([1, 2]) as User

    user.$restore()

    const expected = createState({
      users: {
        '[1,2]': {
          $id: '[1,2]',
          key_1: 1,
          key_2: 2,
          deleted_at: null,
          $isDeleted: false
        }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('should update instance attributes after restoring', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          post: this.hasOne(Post, 'user_id')
        }
      }

      post!: Post
      deleted_at!: number
      $isDeleted!: boolean
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

    createStore([User, Post])

    await User.insert({
      data: {
        id: 1,
        deleted_at: mockDate,
        $isDeleted: true,
        post: { id: 2 }
      }
    })

    const user = User.query()
      .with('post')
      .find(1) as User

    expect(user.$isDeleted).toBe(true)
    expect(user.deleted_at).toBe(mockDate)
    expect(user.post).toBeInstanceOf(Post)

    await user.$restore()

    expect(user.$isDeleted).toBe(false)
    expect(user.deleted_at).toBe(null)
    expect(user.post).toBeInstanceOf(Post)
  })

  it('can hydrate instance after restoring', async () => {
    class User extends Model {
      static entity = 'users'

      name!: string
      post!: Post
      deleted_at!: number
      $isDeleted!: boolean

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          post: this.hasOne(Post, 'user_id')
        }
      }

      static beforeUpdate(model: User) {
        model.name = 'Jane Doe'
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

    createStore([User, Post])

    await User.insert({
      data: {
        id: 1,
        name: 'John Doe',
        deleted_at: mockDate,
        $isDeleted: true,
        post: { id: 2 }
      }
    })

    const user = User.query()
      .with('post')
      .find(1) as User

    expect(user.$isDeleted).toBe(true)
    expect(user.deleted_at).toBe(mockDate)
    expect(user.name).toBe('John Doe')
    expect(user.post).toBeInstanceOf(Post)

    await user.$restore(true)

    expect(user.$isDeleted).toBe(false)
    expect(user.deleted_at).toBe(null)
    expect(user.name).toBe('Jane Doe')
    expect(user.post).toBeNull()
  })
})
