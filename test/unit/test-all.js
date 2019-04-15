import {
    createStore
} from '../dev/';
import User from '../dev/common/models/User';
import Role from '../dev/common/models/Role';
import {
    expect
} from 'chai';


const userDefaultList = [{
        id: 1,
        name: 'John Walker',
        email: 'john@gmail.com',
        phone: '(555) 281-4567'
    },
    {
        id: 2,
        name: 'Bobby Banana',
        email: 'walker.banana@gmail.com',
        phone: '(555) 555-4567'
    },
    {
        id: 3,
        name: 'Mr. Deleted Guy',
        email: 'delete.me@gmail.com',
        phone: '(555) 555-8887'
    }
];

describe('Vuex SoftDelete plugin default installation', function () {
    it('should have $isDeleted flag & deleted_at key set exist when creating new', function () {
        const store = createStore([{
            model: User
        }]);
        let u = new User();
        expect(u.$isDeleted).to.equal(false);
        expect(u.deleted_at).to.equal(null);
    });

    it('should set $isDeleted & deleted_at properly when softDeleting', function () {
        const store = createStore([{
            model: User
        }]);
        let user = new User({
            id: 1
        });
        User.insert({
            data: user
        })
        User.softDelete(user.id);

        // We need to fetch using the "trashed" mode, because by default
        // soft-deleted data is ignored
        let q = store.getters["entities/users/query"]();
        let u2 = q.trashed().get()[0];
        expect(u2.$isDeleted).to.equal(true);
        expect(u2.deleted_at).to.not.equal(null);
        expect(user.id).to.equal(u2.id);
    });

    it('Can add data to Users and filter deleted', function () {
        const store = createStore([{
            model: User
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });

        User.softDelete(3);

        const records = store.getters['entities/users/query']().all();
        expect(records).to.have.lengthOf(2);
    });

    it('Can show only deleted records', function () {
        const store = createStore([{
            model: User
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });
        User.softDelete(3);

        const records = store.getters['entities/users/query']()
            .trashed()
            .get();

        expect(records).to.have.lengthOf(1)
        expect(records[0].id).to.equal(3);
    });

    it('Can show all records and deleted records', function () {
        const store = createStore([{
            model: User
        }]);
        store.dispatch('entities/users/create', {
            data: userDefaultList
        });
        User.softDelete(3);

        const records = store.getters['entities/users/query']()
            .withTrashed()
            .get();

        expect(records).to.have.lengthOf(3);
    });

    it('Can correctly changes back to global soft delete mode after switching modes', function () {
        const store = createStore([{
            model: User
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });
        User.softDelete(3);

        const records = store.getters['entities/users/query']()
            .withTrashed()
            .get();
        expect(records).to.have.lengthOf(3);

        const records2 = store.getters['entities/users/query']()
            .get();
        expect(records2).to.have.lengthOf(2);

        const records3 = store.getters['entities/users/query']()
            .trashed()
            .get();
        expect(records3).to.have.lengthOf(1);

        const records4 = store.getters['entities/users/query']()
            .get();
        expect(records4).to.have.lengthOf(2);
    });

    it('Can soft delete with where clause', function () {
        const store = createStore([{
            model: User
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });

        const records = store.getters['entities/users/query']().all();
        expect(records).to.have.lengthOf(3);

        store.dispatch('entities/users/softDelete', {
            where: 2
        });

        const records2 = store.getters['entities/users/query']().all();
        expect(records2).to.have.lengthOf(2);

        const records3 = store.getters['entities/users/query']()
            .trashed()
            .get();
        expect(records3).to.have.lengthOf(1);

    });

    it('Can soft delete bulk items on condition', function () {
        const store = createStore([{
            model: User
        }]);

        const data = Array(100).fill({
            name: 'John Walker',
            email: 'john@gmail.com',
            phone: '(555) 281-4567'
        });

        store.dispatch('entities/users/create', {
            data: data
        });

        const records = store.getters['entities/users/query']().all();
        expect(records).to.have.lengthOf(100);

        store.dispatch('entities/users/softDelete', (record) => {
            return record.id > 50
        });

        const records2 = store.getters['entities/users/query']().all()
        expect(records2).to.have.lengthOf(50);
    });

    it('should provide a way to fetch all trashed entities in one call', function () {
        const store = createStore([{
            model: User
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });

        User.softDelete(3);

        let result = store.getters['entities/allTrashed']();
        expect(result.length).to.equal(1);
    });

    it('should provide a way to fetch all trashed entities of one type', function () {
        const store = createStore([{
            model: User
        }, {
            model: Role
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });
        store.dispatch('entities/roles/create', {
            data: [{
                id: 1,
                name: 'role'
            }]
        });

        User.softDelete(3);
        Role.softDelete(1);

        let result = store.getters['entities/allTrashed']();
        expect(result.length).to.equal(2);

        let result2 = store.getters['entities/users/allTrashed']();
        expect(result2.length).to.equal(1);
    });

    it('Can soft delete from instance', function () {
        const store = createStore([{
            model: User
        }]);

        store.dispatch('entities/users/create', {
            data: userDefaultList
        });

        const user = User.find(1);
        user.softDelete();

        let result = store.getters['entities/allTrashed']();
        expect(result.length).to.equal(1);
        expect(result[0].id).to.equal(1);
    });

    it('should expose flags by default', async function () {
        const store = createStore([{
            model: User
        }]);

        let user = new User({
            id: 1,
            roleId: 1,
            name: "Test",
            email: "Test"
        });

        User.insert({
            data: [user]
        });

        let u = store.getters['entities/users/find'](1);
        expect(JSON.stringify(u)).to.equal('{"id":1,"name":"Test","email":"Test","phone":"","roleId":1,"role":null,"deleted_at":null,"$isDeleted":false}');
    });

});