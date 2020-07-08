const jwt = require('jsonwebtoken');
const logger_enum = require('../models/enums/logger');

//Logger
let is = 'middlewares/authentication.js';
const Logger = LOGGER.getLogger(is);

//Esta funcion nos verifica que el customerId corresponde al TOKEN - Si es correcto entrega un nuevo Token
let validate_jwt = (req, res, next) => {
    let token = req.get('token');
    let customerId = req.body.customer_id || req.params.customerId;

    if (!customerId) {
        Logger.error(logger_enum.errors.E_PARAM_REQ.message);
        return res.status(400).json({
            state: 'error',
            error: logger_enum.errors.E_PARAM_REQ
        });
    }

    Logger.addContext('Cliente', customerId);

    if (!token) {
        Logger.error(logger_enum.errors.E_AUTH_NO_TOKEN.message);
        return res.status(401).json({
            state: 'error',
            error: logger_enum.errors.E_AUTH_NO_TOKEN
        });
    }

    jwt.verify(token, process.env.SEED_JWT, (error, decode) => {
        if (error) {
            Logger.error(logger_enum.errors.E_AUTH_NO_VALID_TOKEN.message);
            return res.status(401).json({
                state: 'error',
                error: logger_enum.errors.E_AUTH_NO_VALID_TOKEN
            });
        };

        let customer= decode.customer;
        if (customerId != customer._id) {
            Logger.error(logger_enum.errors.E_AUTH_NO_CORRECT_TOKEN.message);
            return res.status(401).json({
                state: 'error',
                error: logger_enum.errors.E_AUTH_NO_CORRECT_TOKEN
            });
        };

        Logger.info("Se valido correctamente el token");
        req.customer = customer;
        let newToken = jwt.sign({ customer }, process.env.SEED_JWT, { expiresIn: process.env.CADUCIDAD_JWT });
        req.token= newToken;
        req
        next();
    });
};


//Esta funcion nos verifica que el customerId corresponde al TOKEN - Si es correcto entrega un nuevo Token
let refresh_jwt = (req, res, next) => {
    let token = req.get('tsec');
    if (!token) {
        Logger.error(logger_enum.errors.E_AUTH_NO_TOKEN.message);
        return res.status(401).json({
            state: 'error',
            error: logger_enum.errors.E_AUTH_NO_TOKEN
        });
    }

    jwt.verify(token, process.env.SEED_JWT, (error, decode) => {
        if (error) {
            Logger.error(logger_enum.errors.E_AUTH_NO_VALID_TOKEN.message);
            return res.status(401).json({
                state: 'error',
                error: logger_enum.errors.E_AUTH_NO_VALID_TOKEN
            });
        };

        let customer= decode.customer;

        Logger.info("Se valido correctamente el token");
        req.customer = customer;
        let newToken = jwt.sign({ customer }, process.env.SEED_JWT, { expiresIn: process.env.CADUCIDAD_JWT });
        req.token= newToken;
        next();
    });
};

module.exports = {
    validate_jwt,
    refresh_jwt
}