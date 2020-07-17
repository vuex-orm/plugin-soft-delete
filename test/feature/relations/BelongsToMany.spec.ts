import { createStore } from 'test/support/Helpers'
import { Model } from '@vuex-orm/core'

describe('Feature - Relations - Belongs To Many', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
      }
    }

    roles!: Role[]
  }

  class Role extends Model {
    static entity = 'roles'

    static fields() {
      return {
        id: this.attr(null)
      }
    }
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    static fields() {
      return {
        role_id: this.attr(null),
        user_id: this.attr(null)
      }
    }
  }

  beforeEach(async () => {
    createStore([User, Role, RoleUser])

    await User.create({
      data: [
        { id: 1, roles: [{ id: 3 }, { id: 4 }] },
        { id: 2, roles: [{ id: 3 }] }
      ]
    })
  })

  it('can resolve queries without deleted relation (default)', async () => {
    await Role.softDelete(3)

    const users = User.query().with('roles').findIn([1, 2]) as User[]

    expect(users[0].roles.length).toBe(1)
    expect(users[0].roles[0].$trashed()).toBe(false)

    expect(users[1].roles.length).toBe(0)
  })

  it('can include deleted relations using `withTrashed` clause', async () => {
    await Role.softDelete(3)

    const users = User.query()
      .withTrashed()
      .with('roles')
      .findIn([1, 2]) as User[]

    expect(users[0].roles.length).toBe(2)
    expect(users[0].roles[0].$trashed()).toBe(true)
    expect(users[0].roles[1].$trashed()).toBe(false)

    expect(users[1].roles.length).toBe(1)
    expect(users[1].roles[0].$trashed()).toBe(true)
  })

  it('can resolve only deleted relations using `onlyTrashed` clause', async () => {
    await Role.softDelete(3)

    const users = User.query()
      .onlyTrashed()
      .with('roles')
      .findIn([1, 2]) as User[]

    expect(users[0].roles.length).toBe(1)
    expect(users[0].roles[0].$trashed()).toBe(true)

    expect(users[1].roles.length).toBe(1)
    expect(users[1].roles[0].$trashed()).toBe(true)
  })
})
