import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Model - Delete', () => {
  const mockDate = Date.now()
  const spyOnDate = jest.spyOn(Date, 'now').mockImplementation(() => mockDate)

  afterAll(() => {
    spyOnDate.mockReset()
  })

  it('can delete by passing a primary key', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await User.insert({ data: { id: 1 } })

    await User.softDelete(1)

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete by passing an array of primary keys', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await User.insert({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    await User.softDelete([1, 2])

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true },
        2: { $id: '2', id: 2, deleted_at: mockDate, $isDeleted: true },
        3: { $id: '3', id: 3, deleted_at: null, $isDeleted: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete by passing a composite primary key', async () => {
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
      data: [{ key_1: 1, key_2: 2 }]
    })

    await User.softDelete([1, 2])

    const expected = createState({
      users: {
        '[1,2]': {
          $id: '[1,2]',
          key_1: 1,
          key_2: 2,
          deleted_at: mockDate,
          $isDeleted: true
        }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete by passing an array of composite primary keys', async () => {
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
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 }
      ]
    })

    await User.softDelete([
      [1, 2],
      [2, 2]
    ])

    const expected = createState({
      users: {
        '[1,2]': {
          $id: '[1,2]',
          key_1: 1,
          key_2: 2,
          deleted_at: mockDate,
          $isDeleted: true
        },
        '[2,2]': {
          $id: '[2,2]',
          key_1: 2,
          key_2: 2,
          deleted_at: mockDate,
          $isDeleted: true
        }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete by passing an expression closure', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          age: this.attr(null)
        }
      }

      age!: number
    }

    const store = createStore([User])

    await User.insert({
      data: [
        { id: 1, age: 19 },
        { id: 2, age: 20 }
      ]
    })

    await User.softDelete((record: User) => record.age >= 20)

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, age: 19, deleted_at: null, $isDeleted: false },
        2: { $id: '2', id: 2, age: 20, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete instance', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    await User.insert({ data: { id: 1 } })

    const user = User.find(1) as User

    user.$softDelete()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete instance with composite primary key', async () => {
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
      data: [{ key_1: 1, key_2: 2 }]
    })

    const user = User.find([1, 2]) as User

    user.$softDelete()

    const expected = createState({
      users: {
        '[1,2]': {
          $id: '[1,2]',
          key_1: 1,
          key_2: 2,
          deleted_at: mockDate,
          $isDeleted: true
        }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('should update instance attributes after deleting', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }

      posts!: Post[]
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

    await User.insert({ data: { id: 1, posts: [{ id: 2 }, { id: 3 }] } })

    const user = User.query()
      .with('posts')
      .find(1) as User

    expect(user.$isDeleted).toBe(false)
    expect(user.deleted_at).toBe(null)
    expect(user.posts).not.toEqual([])

    await user.$softDelete()

    expect(user.$isDeleted).toBe(true)
    expect(user.deleted_at).toBe(mockDate)
    expect(user.posts).not.toEqual([])
  })

  it('can hydrate instance after deleting', async () => {
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
      data: { id: 1, name: 'John Doe', post: [{ id: 2 }, { id: 3 }] }
    })

    const user = User.query()
      .with('post')
      .find(1) as User

    expect(user.name).toBe('John Doe')
    expect(user.post).toBeInstanceOf(Post)

    await user.$softDelete(true)

    expect(user.$isDeleted).toBe(true)
    expect(user.deleted_at).toBe(mockDate)
    expect(user.name).toBe('Jane Doe')
    expect(user.post).toBeNull()
  })
})
