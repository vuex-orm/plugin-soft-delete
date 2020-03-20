import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Module - Delete', () => {
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

    await store.dispatch('entities/users/create', { data: { id: 1 } })

    await store.dispatch('entities/users/softDelete', 1)

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

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/users/softDelete', [1, 2])

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

    await store.dispatch('entities/users/create', {
      data: [{ key_1: 1, key_2: 2 }]
    })

    await store.dispatch('entities/users/softDelete', [1, 2])

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

    await store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 }
      ]
    })

    await store.dispatch('entities/users/softDelete', [
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

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, age: 19 },
        { id: 2, age: 20 }
      ]
    })

    await store.dispatch(
      'entities/users/softDelete',
      (record: any) => record.age >= 20
    )

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, age: 19, deleted_at: null, $isDeleted: false },
        2: { $id: '2', id: 2, age: 20, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
