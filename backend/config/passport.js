const User = require('../api/models/User');
const config = require('./').auth;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const UserService = require('../api/services/UsersService');

const localOptions = {
    usernameField: 'email',
};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });

        const wrongCredentials = !user || !user.password;
        const passwordMatch = user ? await user.comparePassword(password) : false;
        if (wrongCredentials || !passwordMatch) {
            return done({
                message: 'Wrong email or password',
                statusCode: 401,
            }, false);
        }

        return done(null, user);
    } catch (err) {
        return done({
            message: 'Internal error.',
            statusCode: 500,
        }, false);
    }
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    const userService = new UserService();
    let user;
    try {
        user = await userService.getById(jwtPayload.id);
    } catch (err) {
        return done(err, false);
    }

    const result = user || false;
    done(null, result);
});

passport.use(jwtLogin);
passport.use(localLogin);
