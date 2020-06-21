const expressJwt = require('express-jwt');
const { secret } = require('../../config.json');

module.exports = authorize;

function authorize() {
    return [
        expressJwt({ secret }),

        (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ message: 'Permission denied!' });
            }

            next();
        }
    ];
}