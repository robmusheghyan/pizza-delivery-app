## Install and Use

```sh
# cd into project root and run
$ yarn install

# to use mysql
$ yarn add mysql2
# to use postgresql
$ yarn add pg pg-hstore

# start the api
$ yarn start
```

sqlite is also supported.

## Folder Structure

This boilerplate has 4 main directories:

- api - for controllers, models, services, etc.
- config - for database configuration, auth config and etc.
- test - using [Jest](https://github.com/facebook/jest)

## Test

Don't forget to create separate database for testing and put config in connection.js

All test for this uses [Jest](https://github.com/facebook/jest).

### npm start

This is the entry for a developer. This command:

### npm test

This command:

- runs `npm run lint` ([eslint](http://eslint.org/)) with the [airbnb styleguide](https://github.com/airbnb/javascript) without arrow-parens rule for **better readability**
- sets the **environment variable** `NODE_ENV` to `testing`
- creates the `database.sqlite` for the test
- runs `jest --coverage` for testing with [Jest](https://github.com/facebook/jest) and the coverage
- drops the `database.sqlite` after the test

## npm run production

This command:

- sets the **environment variable** to `production`
- opens the db connection for `production`
- starts the server on 127.0.0.1:2017 or on 127.0.0.1:PORT_ENV

Before running on production you have to set the **environment vaiables**:

- DB_NAME - database name for production
- DB_USER - database username for production
- DB_PASS - database password for production
- DB_HOST - database host for production

Optional:

- PORT - the port your api on 127.0.0.1, default to 2017

