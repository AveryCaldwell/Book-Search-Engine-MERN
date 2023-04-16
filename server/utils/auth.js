const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    authMiddleware: function ({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token =
            req.body.token || req.query.token || req.headers.authorization;

        // ["Bearer", "<tokenvalue>"]
        if (req.headers.authorization) {
            // split the token string into an array and return actual token
            token = token.split(' ').pop().trim();
            // .pop() method is used to remove & return the last element of the array, which is the token.
            // .trim() method is used to remove any whitespace characters from the beginning or end of the token.
        }

        if (!token) {
            return req;
        }

        // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // return the request object so it can be passed to the resolver as `context`
        return req;
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };
        
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
