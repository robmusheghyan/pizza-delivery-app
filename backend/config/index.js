const config = {
    migrate: true,
    port: process.env.PORT || '2017',
    BadRequestError: 400,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    NotFoundStatus: 404,
    ServerError: 500,
    auth: {
        secret: 'H:TK^)U`r#am6w<<lbZ2({o"R8k?~/',
        tokenExpiration: '86400',
        userRoles: {
            REGULAR: 'regular',
            OWNER: 'owner',
        },
    },
};

module.exports = config;
