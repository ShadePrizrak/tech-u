/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LAS OPERACIONES
 */

const express = require('express');
const router = express.Router();
const { interceptarRequest } = require('../middlewares/interceptor');
const { validate_jwt } = require('../middlewares/authentication');
const { currency } = require('../models/enums/currency');
const logger_error_enum = require('../models/enums/logger');
const request = require('request-json');
const mongoose = require('mongoose');

//Schemas
const AccountsSchema = require('../models/accounts');
const OperationsSchema = require('../models/operations');


//Logger
let is = 'routes/operations';
const Logger = LOGGER.getLogger(is);

//Variables 
var client = request.createClient('https://api.cambio.today/v1/quotes/');
const apiKey = '&key=4620|HiTENtqwJraRjynsHQq0oWf9pJ8DW_tU';


router.use(interceptarRequest);

router.post('/:customerId/:chargeAccountId/:destinationAccountId', validate_jwt, (req, res) => {
    let customerId = req.params.customerId;
    let chargeAccountId = req.params.chargeAccountId;
    let destinationAccountId = req.params.destinationAccountId;

    let monto = req.body.amount;
    let concepto = req.body.concept;

    Logger.addContext('Cliente', customerId);
    Logger.info("Inicializando una transferencia bancaria ", chargeAccountId, "->", destinationAccountId);

    if (chargeAccountId == destinationAccountId) {
        Logger.error(logger_error_enum.errors.E_OPERATION_SAME_CHARGE_DESTINATION.message, "monto");
        return res.status(400).json({
            state: 'error',
            error: logger_error_enum.errors.E_OPERATION_SAME_CHARGE_DESTINATION
        });
    }

    if (!monto) {
        Logger.error(logger_error_enum.errors.E_PARAM_REQ.message, "monto");
        return res.status(400).json({
            state: 'error',
            error: logger_error_enum.errors.E_PARAM_REQ
        });
    }

    if (Number.isNaN(monto) && monto > 0) {
        Logger.error(logger_error_enum.errors.E_OPERATION_BAD_AMMOUNT.message, "monto");
        return res.status(400).json({
            state: 'error',
            error: logger_error_enum.errors.E_OPERATION_BAD_AMMOUNT
        });
    }

    AccountsSchema.findById(chargeAccountId, 'currency customer balance', (error, chargeAccountDb) => {
        if (error) {
            Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
            return res.status(500).json({
                state: 'error',
                error: logger_error_enum.errors.E_TRANSAC_DB
            });
        };

        if (!chargeAccountDb) {
            Logger.error(logger_error_enum.errors.E_OPERATION_NOT_CRG_ACC.message, chargeAccountId);
            return res.status(409).json({
                state: 'error',
                error: logger_error_enum.errors.E_OPERATION_NOT_CRG_ACC
            });
        }

        Logger.info("Resultado obtenido de la consulta ", chargeAccountDb);
        if (!(chargeAccountDb.customer == customerId)) {
            Logger.error(logger_error_enum.errors.E_OPERATION_NOT_OWNER_CUSTOMER.message);
            return res.status(490).json({
                state: 'error',
                error: logger_error_enum.errors.E_OPERATION_NOT_OWNER_CUSTOMER
            });
        }

        let currencyChargeAccount = chargeAccountDb.currency;
        Logger.info("Moneda obtenido de la cuenta cargo ", chargeAccountId, ": ", currencyChargeAccount);

        Logger.info("Validando que el monto a transferir es menor al balance de la cuenta");
        if (monto > chargeAccountDb.balance) {
            Logger.error(logger_error_enum.errors.E_OPERATION_INSUFFICIENT_BALANCE.message);
            return res.status(409).json({
                state: 'error',
                error: logger_error_enum.errors.E_OPERATION_INSUFFICIENT_BALANCE
            });
        }

        AccountsSchema.findById(destinationAccountId, 'currency', async (error, destinationAccountDb) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            if (!destinationAccountDb) {
                Logger.error(logger_error_enum.errors.E_OPERATION_NOT_DTN_ACC.message, destinationAccountId);
                return res.status(400).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_OPERATION_NOT_DTN_ACC
                });
            }

            let currencyDestinationAccount = destinationAccountDb.currency;
            Logger.info("Moneda obtenido de la cuenta cargo ", destinationAccountId, ": ", currencyDestinationAccount);

            let montoCuentaDestino = monto;
            let rateExchange = 1;
            Logger.info("Verificando si es necesario conversión de moneda");
            if (!(currencyChargeAccount == currencyDestinationAccount)) {
                Logger.info("Es necesario realizar una conversión de moneda");
                responseExchange = await ejecutarExchangeService(monto, currencyChargeAccount, currencyDestinationAccount);
                rateExchange = responseExchange.rate;
                montoCuentaDestino = responseExchange.amount;
                if (montoCuentaDestino == -1) {
                    Logger.error(logger_error_enum.errors.E_OPERATION_REQUEST_CONVERSION.message, destinationAccountId);
                    return res.status(400).json({
                        state: 'error',
                        error: logger_error_enum.errors.E_OPERATION_REQUEST_CONVERSION
                    });
                }
            }
            Logger.info("Monto final a transferir en cuenta destino: ", montoCuentaDestino);

            let idOperacion = mongoose.Types.ObjectId();
            Logger.info("Se ha generado el ID de Operación ", idOperacion);

            let operationsWriteDb = new OperationsSchema({
                _id: idOperacion,
                charge_account: chargeAccountId,
                destination_account: destinationAccountId,
                amount: monto,
                concept: concepto,
                rate_exchange: rateExchange,
                itf: 0,
                moneda_origen: currencyChargeAccount,
                moneda_destino: currencyDestinationAccount
            });

            Logger.info("Guardando operación en la base de datos");
            operationsWriteDb.save((error, operationDb) => {
                if (error) {
                    Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                    return res.status(500).json({
                        state: 'error',
                        error: logger_error_enum.errors.E_TRANSAC_DB
                    });
                };

                Logger.info("Actualizando el balance en la cuenta de cargo");
                AccountsSchema.findByIdAndUpdate(chargeAccountId, { $inc: { 'balance': -1 * monto } }).exec((error) => {
                    if (error) {
                        Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                        return res.status(500).json({
                            state: 'error',
                            error: logger_error_enum.errors.E_TRANSAC_DB
                        });
                    };

                    Logger.info("Actualizando el balance en la cuenta de destino");
                    AccountsSchema.findByIdAndUpdate(destinationAccountId, { $inc: { 'balance': montoCuentaDestino } }).exec((error) => {
                        if (error) {
                            Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                            return res.status(500).json({
                                state: 'error',
                                error: logger_error_enum.errors.E_TRANSAC_DB
                            });
                        };

                        res.status(200).json({
                            status: 'success',
                            data: operationDb
                        });
                    });
                });
            });
        });
    });

});

let ejecutarExchangeService = (monto, currencyChargeAccount, currencyDestinationAccount) => {
    return new Promise((resolve, reject) => {
        Logger.info("Realizando consulta de conversión");
        client.get(`${currency[currencyChargeAccount]}/${currency[currencyDestinationAccount]}/json?quantity=${monto}${apiKey}`, function (error, res, body) {
            if (error) {
                Logger.info("Se obtuvo un error mientras se obtenia la conversión: ", error);
                reject({amount: -1});
            }
            Logger.info("Se obtuvo como valor de conversión: ", body.result.value);
            resolve({ amount: body.result.amount, rate: body.result.value});
        });
    });
};

module.exports = router;