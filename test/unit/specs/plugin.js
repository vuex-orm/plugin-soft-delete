import { store } from 'src/dev'

console.log('ENV:', process.env.ENVIRONMENT)

describe('Setup unit tests', function () {
  it('Can initialize Vuex store', function () {
    expect(store)
  })
  it('Can add data to Users and filter deleted', function () {

    store.dispatch('entities/users/create', {
      data: [
        {
          id: 1,
          name: 'John Walker',
          email: 'john@gmail.com',
          phone: '(555) 281-4567',
          deleted_at: null
        },
        {
          id: 2,
          name: 'Bobby Banana',
          email: 'walker.banana@gmail.com',
          phone: '(555) 555-4567',
          deleted_at: null
        },
        {
          id: 3,
          name: 'Mr. Deleted Guy',
          email: 'delete.me@gmail.com',
          phone: '(555) 555-8887',
          deleted_at: new Date()
        }
      ]
    })

    const records = store.getters['entities/users/query']().all()

    expect(records).to.have.lengthOf(2)

  })

  it('Can show only deleted records', function () {

    const records = store.getters['entities/users/query']()
    .trashed()
    .get()

    expect(records).to.have.lengthOf(1)

    const recordsDefault = store.getters['entities/users/query']()
    .get()

    expect(recordsDefault).to.have.lengthOf(2)

  })

  it('Can show all records and deleted records', function () {

    const records = store.getters['entities/users/query']()
    .withTrashed()
    .get()

    expect(records).to.have.lengthOf(3)

  })

  it('Can correctly changes back to global soft delete mode after switching modes', function () {

    const records = store.getters['entities/users/query']()
    .withTrashed()
    .get()
    expect(records).to.have.lengthOf(3)

    const records2 = store.getters['entities/users/query']()
    .get()
    expect(records2).to.have.lengthOf(2)

    const records3 = store.getters['entities/users/query']()
    .trashed()
    .get()
    expect(records3).to.have.lengthOf(1)

    const records4 = store.getters['entities/users/query']()
    .get()
    expect(records4).to.have.lengthOf(2)

  })

  it('Can soft delete by id', function () {

    const records = store.getters['entities/users/query']().all()
    expect(records).to.have.lengthOf(2)

    store.dispatch('entities/users/delete', 1)

    const records2 = store.getters['entities/users/query']().all()
    expect(records2).to.have.lengthOf(1)

    const records3 = store.getters['entities/users/query']()
      .trashed()
      .get()
    expect(records3).to.have.lengthOf(2)

  })

  it('Can soft soft delete with where clause', function () {

    store.dispatch('entities/users/create', {
      data: [
        {
          id: 1,
          name: 'John Walker',
          email: 'john@gmail.com',
          phone: '(555) 281-4567',
          deleted_at: null
        },
        {
          id: 2,
          name: 'Bobby Banana',
          email: 'walker.banana@gmail.com',
          phone: '(555) 555-4567',
          deleted_at: null
        },
        {
          id: 3,
          name: 'Mr. Deleted Guy',
          email: 'delete.me@gmail.com',
          phone: '(555) 555-8887',
          deleted_at: null
        }
      ]
    })

    const records = store.getters['entities/users/query']().all()
    expect(records).to.have.lengthOf(3)

    store.dispatch('entities/users/delete', { where: 2})

    const records2 = store.getters['entities/users/query']().all()
    expect(records2).to.have.lengthOf(2)

    const records3 = store.getters['entities/users/query']()
    .trashed()
    .get()
    expect(records3).to.have.lengthOf(1)

  })

  it('Can soft soft delete bulk items on condition', function () {

    const data = Array(100).fill({
      name: 'John Walker',
      email: 'john@gmail.com',
      phone: '(555) 281-4567',
      deleted_at: null
    })

    store.dispatch('entities/users/create', { data: data })

    const records = store.getters['entities/users/query']().all()
    expect(records).to.have.lengthOf(100)

    store.dispatch('entities/users/delete', (record) => {
      return record.id >= 50
    })

    const records2 = store.getters['entities/users/query']().all()
    expect(records2).to.have.lengthOf(50)


  })

})
