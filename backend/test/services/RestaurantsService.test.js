const RestaurantService = require('../../api/services/RestaurantsService');
const Restaurant = require('../../api/models/Restaurant');
const {beforeDBAction, afterDBAction} = require('../setup');

beforeAll(async (done) => {
    await beforeDBAction();
    done()
});

afterAll(async (done) => {
    await afterDBAction();
    done();
});

describe('RestaurantService: Restaurant service test', () => {
    let service;
    let restaurantData;

    beforeEach(() => {
        service = new RestaurantService();

        restaurantData = {
            name: `Test restaurant ${Math.random()}`,
        };
    });

    test('Test restaurant creation:', async () => {
        const restaurant = await service.create(restaurantData);
        expect(restaurant.id).toBeTruthy();
        expect(restaurant.name).toEqual(restaurantData.name);

        const retrievedRestaurant = await Restaurant.findByPk(restaurant.id);
        expect(restaurant.name).toEqual(retrievedRestaurant.name);
    });

    test('Test get restaurant:', async () => {
        const restaurant = await Restaurant.create(restaurantData);
        const retrievedItem = await service.getById(restaurant.id);
        expect(restaurant.id).toEqual(retrievedItem.id);
        expect(restaurant.name).toEqual(retrievedItem.name);
    });

    test('Test update restaurant:', async () => {
        let restaurant = await Restaurant.create(restaurantData);
        expect(restaurant.name).toEqual(restaurantData.name);
        const newName = 'new name';
        restaurant = await service.update(restaurant.id, {
            name: newName,
        });
        expect(restaurant.name).toEqual(newName);
    });

    test('Test delete restaurant:', async (done) => {
        let restaurant = await Restaurant.create(restaurantData);
        restaurant = await Restaurant.findByPk(restaurant.id);
        expect(restaurant.id).not.toBeNull();
        await service.delete(restaurant.id);
        restaurant = await Restaurant.findByPk(restaurant.id);
        expect(restaurant).toBeNull();
        done();
    });

});
