const UsersService = require('../../api/services/UsersService');
const User = require('../../api/models/User');
const {beforeDBAction, afterDBAction} = require('../setup');

describe('UsersService: User service test', () => {
    let service;
    let userData;
    let emailSuffix = 0;


    beforeAll(async (done) => {
        await beforeDBAction();
        done();
    });

    afterAll(() => {
        afterDBAction();
    });


    beforeEach(() => {
        service = new UsersService();

        emailSuffix++;
        userData = {
            email: `test${emailSuffix}@test.com`,
            password: 'test_pass',
            first_name: 'test',
            last_name: 'test',
        };
    });

    test('Test user creation:', async () => {
        const user = await service.create(userData);
        expect(user.id).toBeTruthy();
        expect(user.email).toEqual(userData.email);
        expect(user.role).toEqual('regular');

        const retrievedOrder = await User.findByPk(user.id);
        expect(user.id).toEqual(retrievedOrder.id);
        expect(user.email).toEqual(retrievedOrder.email);

        let sameLoginUser = null;
        let error;
        try {
            sameLoginUser = await service.create(userData);
        } catch (err) {
            error = err;
        }
        expect(error).not.toBeNull();
        expect(sameLoginUser).toBeNull();
    });
});
