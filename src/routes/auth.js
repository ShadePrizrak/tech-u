/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LA AUTENTICACIÓN
 */

const express = require('express');
const router = express.Router();
const cors = require('cors');
const { interceptarRequest } = require('../middlewares/interceptor');
const bcrypt = require('bcrypt');
const logger_enum = require('../models/enums/logger');
const jwt = require('jsonwebtoken')

//Schemas
const CostumersSchema = require('../models/customers');
const UserSchema = require('../models/user');

//Logger
let is = 'routes/auth';
router.all('*',cors());
const Logger = LOGGER.getLogger(is);

router.use(interceptarRequest);

router.post('/', (req, res) => {
    let numDocumento = req.body.numero_documento;
    let tipoDocumento = req.body.tipo_documento;
    let password = req.body.password;

    Logger.addContext('Cliente', numDocumento);

    Logger.info("Verificando parametros del REQUEST");

    if (!(numDocumento && tipoDocumento && password)) {
        Logger.error(logger_enum.errors.E_PARAM_REQ);
        return res.status(400).json({
            state: 'error',
            error: {
                id: logger_enum.errors.E_PARAM_REQ.id,
                message: logger_enum.errors.E_PARAM_REQ.message,
            }
        });
    }

    Logger.info("Consultando colección Customers");
    CostumersSchema
        .findOne({ "personal_id_type": tipoDocumento, "personal_id": numDocumento })
        .exec((error, customerDb) => {
            if (error) {
                Logger.error(logger_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_enum.errors.E_TRANSAC_DB
                });
            };

            Logger.info("Resultado obtenido de la consulta ", customerDb);
            if (!customerDb) {
                Logger.error(logger_enum.errors.E_AUTH_CRED.message, " - Usuario -");
                return res.status(400).json({
                    ok: false,
                    error: logger_enum.errors.E_AUTH_CRED
                });
            };

            Logger.info("Consultando colección Users");
            UserSchema
                .findOne({ "customer": customerDb._id })
                .exec((error, UserDb) => {
                    if (error) {
                        Logger.error(logger_enum.errors.E_TRANSAC_DB.message, error);
                        return res.status(500).json({
                            state: 'error',
                            error: logger_enum.errors.E_TRANSAC_DB
                        });
                    };

                    Logger.info("Resultado obtenido de la consulta ", UserDb);
                    if (!UserDb) {
                        Logger.error(logger_enum.errors.E_AUTH_NO_REG.message,);
                        return res.status(409).json({
                            ok: false,
                            error: logger_enum.errors.E_AUTH_NO_REG
                        });
                    };

                    if (!bcrypt.compareSync(password, UserDb.password)) {
                        Logger.error(logger_enum.errors.E_AUTH_CRED.message, " - PASSWORD -");
                        return res.status(409).json({
                            ok: false,
                            error: logger_enum.errors.E_AUTH_CRED
                        });
                    };

                    Logger.info("El usuario se ha autenticado correctamente");
                    let customer = JSON.parse(JSON.stringify(customerDb));
                    customer["user"] = {_id: UserDb._id};
                    let token = jwt.sign({ customer }, process.env.SEED_JWT, { expiresIn: process.env.CADUCIDAD_JWT });
                    res.status(200);
                    res.setHeader('token', token);
                    return res.json({
                        state: 'success',
                        data: {
                            customerId: customer._id
                        }
                    });
                });
        });
});

router.get('/:customerId', (req, res) => {
    let customerId = req.params.customerId;
    let token = req.get('tsec');
    Logger.info("Verificando parametros del REQUEST");
    if (!customerId) {
        Logger.error(logger_enum.errors.E_PARAM_REQ);
        return res.status(400).json({
            state: 'error',
            error: {
                id: logger_enum.errors.E_PARAM_REQ.id,
                message: logger_enum.errors.E_PARAM_REQ.message,
            }
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
                state: 'error'
            });
        };

        Logger.error("El token le corresponde al cliente");
        return res.status(200).json({
            state: 'success'
        });
    });
});

module.exports = router;


