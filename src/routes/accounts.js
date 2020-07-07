/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LOS CUENTAS BANCARIAS
 */

const express = require('express');
const router = express.Router();
const cors = require('cors');
const { interceptarRequest } = require('../middlewares/interceptor');
const { validate_jwt, refresh_jwt} = require('../middlewares/authentication');
const logger_error_enum = require('../models/enums/logger');

//Schemas
const CardsSchema = require('../models/cards');
const CostumersSchema = require('../models/customers');
const UserSchema = require('../models/user');
const AccountsSchema = require('../models/accounts');

//Logger
let is = 'routes/accounts';
router.all('*',cors());
const Logger = LOGGER.getLogger(is);

router.use(interceptarRequest);

router.get('/:account_number', (req, res) => {
    let account_number = req.params.account_number;
    let jwtoken = refresh_jwt(req,res);
    if (!account_number) {
        Logger.error(logger_error_enum.errors.E_PARAM_REQ.message, "account_number");
        return res.status(500).json({
            state: 'error',
            error: logger_error_enum.errors.E_PARAM_REQ
        });
    }

    if (Number.isNaN(account_number) || account_number.length != 18) {
        Logger.error(logger_error_enum.errors.E_ACCOUNT_BAD_NUMBER.message, account_number);
        return res.status(400).json({
            state: 'error',
            error: logger_error_enum.errors.E_ACCOUNT_BAD_NUMBER
        });
    }

    AccountsSchema
        .findOne(
            { "account_number": account_number },
            'account_number currency'
            )
        .populate({
            path: 'customer',
            select: 'first_name last_name',
            model: 'Customer'
        })
        .exec((error, accountDB) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            if (!accountDB) {
                Logger.error(logger_error_enum.errors.E_ACCOUNT_NOT_EXIST.message);
                return res.status(409).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            return res.status(200).json({
                status: "success",
                data: {
                    customer : accountDB.sinIds(),
                    token: jwtoken
                }
            });
        })
});

module.exports = router;