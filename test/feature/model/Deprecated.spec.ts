import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Model - Deprecated', () => {
  const mockDate = Date.now()
  const spyOnDate = jest.spyOn(Date, 'now').mockImplementation(() => mockDate)

  afterAll(() => {
    spyOnDate.mockReset()
  })

  it('can delete by passing a `where` condition', async () => {
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

    await User.softDelete({ where: 1 })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete using alternative `softDelete` instance method', async () => {
    const spyOnWarn = jest.spyOn(global.console, 'warn').mockImplementation()

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

    await user.softDelete()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, deleted_at: mockDate, $isDeleted: true }
      }
    })

    expect(spyOnWarn).toHaveBeenCalled()
    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve only deleted records using `trashed` clause', async () => {
    const spyOnWarn = jest.spyOn(global.console, 'warn').mockImplementation()

    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null)
        }
      }

      id!: number
      deleted_at!: number
      $isDeleted!: boolean
    }

    createStore([User])

    await User.create({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    await User.softDelete(1)

    const users = User.query()
      .trashed()
      .get()

    expect(spyOnWarn).toHaveBeenCalled()
    expect(users.length).toBe(1)
    expect(users[0].id).toBe(1)
    expect(users[0].deleted_at).toBe(mockDate)
    expect(users[0].$isDeleted).toBe(true)
  })
})
