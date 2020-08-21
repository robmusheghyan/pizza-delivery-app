const database = require('../config/database');

const beforeDBAction = async () => {
    try {
        await database.authenticate();
        await database.drop();
        await database.sync({});
    } catch (err) {
        console.log(err);
    }
};

const afterDBAction = async () => {
    await database.close();
};


module.exports = {beforeDBAction, afterDBAction};
