/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LOS CLIENTES
 */

const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { interceptarRequest } = require('../middlewares/interceptor');
const { validate_jwt } = require('../middlewares/authentication');
const logger_error_enum = require('../models/enums/logger');


//Schemas
const CardsSchema = require('../models/cards');
const CostumersSchema = require('../models/customers');
const AccountsSchema = require('../models/accounts');
const OperationsSchema = require('../models/operations');

//Logger
let is = 'routes/customers';
const Logger = LOGGER.getLogger(is);

router.use(interceptarRequest);

/**
 * Funcion que muestra la posición global del cliente
 */
router.get('/:customerId/posicion_global', validate_jwt, (req, res) => {
    let customerId = req.params.customerId;
    Logger.addContext('Cliente', customerId);

    CostumersSchema
        .findById(customerId, '_id accounts cards')
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
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            return res.status(200).json({
                status: "success",
                data: customerDb
            });
        })
});

/**
 * Funcion que muestra las cuentas de un cliente
 */
router.get('/:customerId/accounts', validate_jwt, (req, res) => {
    let customerId = req.params.customerId;
    Logger.addContext('Cliente', customerId);

    AccountsSchema
        .find(
            { "customer": customerId },
            '_id account_number currency open_date balance')
        .exec((error, accountsDB) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            if (!accountsDB) {
                Logger.error(logger_error_enum.errors.E_CUSTOMER_NOT_ACCOUNT.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_CUSTOMER_NOT_ACCOUNT
                });
            }

            Logger.info("La consulta fue exitosa");
            return res.status(200).json({
                status: "success",
                data: _.map(accountsDB, (account)=>account.toFormat())
            });
        });
});

/**
 * Funcion que muestra una cuenta de un cliente y sus operaciones
 */
router.get('/:customerId/accounts/:accountId', validate_jwt, (req, res) => {
    let customerId = req.params.customerId;
    let accountId = req.params.accountId;
    Logger.addContext('Cliente', customerId);

    AccountsSchema
        .findById(
            accountId,
            '_id account_number currency open_date balance customer')
        .exec((error, accountDb) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            if (!accountDb) {
                Logger.error(logger_error_enum.errors.E_CUSTOMER_NOT_ACCOUNT.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_CUSTOMER_NOT_ACCOUNT
                });
            };

            if (!(accountDb.customer == customerId)) {
                Logger.error(logger_error_enum.errors.E_CUSTOMER_NOT_OWNER.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_CUSTOMER_NOT_OWNER
                });
            }

            OperationsSchema
                .find(
                    { $or: [{ "charge_account": accountId }, { "destination_account": accountId }] }
                )
                .exec((error, operationsDb) => {
                    if (error) {
                        Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                        return res.status(500).json({
                            state: 'error',
                            error: logger_error_enum.errors.E_TRANSAC_DB
                        });
                    };

                    let customerAccount = accountDb.toFormat();
                    if (operationsDb) {
                        let ArrayOperaciones = _.map(operationsDb,(operation)=>operation.toShowAccountFormat(accountId));
                        customerAccount["operations"] = ArrayOperaciones;
                    }
                    return res.status(200).json({
                        status: "success",
                        data: customerAccount
                    });
                });
        });
});

/**
 * Funcion que muestra las tarjetas de un cliente
 */
router.get('/:customerId/cards', validate_jwt, (req, res) => {
    let customerId = req.params.customerId;
    Logger.addContext('Cliente', customerId);

    CardsSchema
        .find(
            { "customer": customerId },
            '_id card_number card_type')
        .exec((error, cardsDB) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            if (!cardsDB) {
                Logger.error(logger_error_enum.errors.E_CUSTOMER_NOT_CARDS.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_CUSTOMER_NOT_CARDS
                });
            }

            return res.status(200).json({
                status: "success",
                data: cardsDB
            });
        });
});




module.exports = router;