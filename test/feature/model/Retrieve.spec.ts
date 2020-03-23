import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Model - Retrieve', () => {
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

  beforeEach(() => {
    createStore([User])
  })

  it('should resolve queries without deleted records', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }] })

    await User.softDelete(1)

    const users = User.all()

    expect(users.length).toBe(1)
    expect(users[0].id).toBe(2)
    expect(users[0].$isDeleted).toBe(false)
  })

  it('should include deleted records using `withTrashed` clause', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    await User.softDelete(1)

    const users = User.query()
      .withTrashed()
      .get()

    expect(users.length).toBe(3)
    expect(users[0].$isDeleted).toBe(true)
    expect(users[1].$isDeleted).toBe(false)
    expect(users[2].$isDeleted).toBe(false)
  })

  it('should resolve only deleted records using `onlyTrashed` clause', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    await User.softDelete(1)

    const users = User.query()
      .onlyTrashed()
      .get()

    expect(users.length).toBe(1)
    expect(users[0].id).toBe(1)
    expect(users[0].$isDeleted).toBe(true)
  })

  it('should resolve deleted records using `find` and `findIn` methods', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }] })

    await User.softDelete(1)

    const user = User.find(1) as User
    expect(user.$isDeleted).toBe(true)

    const users = User.findIn([1, 2]) as User[]
    expect(users.length).toBe(2)
    expect(users[0].$isDeleted).toBe(true)
    expect(users[1].$isDeleted).toBe(false)
  })

  it('should omit deleted records using `where` clause', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }] })

    await User.softDelete(1)

    const users = User.query()
      .where((user: User) => user.$trashed())
      .get()

    expect(users.length).toBe(0)
  })

  it('should omit deleted records using `whereId` and `whereIdIn` clause', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }] })

    await User.softDelete(1)

    const user = User.query()
      .whereId(1)
      .first()

    expect(user).toBe(null)

    const users = User.query()
      .whereIdIn([1, 2])
      .get()

    expect(users.length).toBe(1)
    expect(users[0].$isDeleted).toBe(false)
  })

  it('can determine whether instance is deleted using `trashed` method', async () => {
    await User.create({ data: [{ id: 1 }, { id: 2 }] })

    await User.softDelete(1)

    const users = User.query()
      .withTrashed()
      .get()

    expect(users.length).toBe(2)
    expect(users[0].$trashed()).toBe(true)
    expect(users[1].$trashed()).toBe(false)
  })
})
