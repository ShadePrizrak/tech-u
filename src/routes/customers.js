/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LOS USUARIOS
 */

const express = require('express');
const router = express.Router();
const { interceptarRequest } = require('../middlewares/interceptor');
const { validate_jwt } = require('../middlewares/authentication');
const logger_error_enum = require('../models/enums/logger');

//Schemas
const CardsSchema = require('../models/cards');
const CostumersSchema = require('../models/customers');
const UserSchema = require('../models/user');
const AccountsSchema = require('../models/accounts');

//Logger
let is = 'routes/customers';
const Logger = LOGGER.getLogger(is);

router.use(interceptarRequest);

const cargarPosicionGoblal = (customerId) => {

}

router.post('/:costumerId/posicion_global', validate_jwt, (req, res) => {
    let costumerId = req.params.costumerId;

    CostumersSchema
        .findById(costumerId, '_id accounts cards')
        .populate({
            path: 'accounts',
            select: '_id account_number balance',
            model: 'Accounts'
        })
        .populate({
            path: 'cards',
            select: '_id card_number card_type',
            model: 'Cards'
        })
        .exec((error, customerDb) => {
            if(error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            res.status(200);
            res.setHeader('token', req.newToken);
            return res.json({
                status: "success",
                data: customerDb
            });
        })
});

module.exports = router;