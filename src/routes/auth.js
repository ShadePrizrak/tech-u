/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LA AUTENTICACIÓN
 */

const express = require('express');
const router = express.Router();
const { interceptarRequest } = require('../middlewares/interceptor');
const bcrypt = require('bcrypt');
const logger_error_enum = require('../models/enums/logger');
const jwt = require('jsonwebtoken')

//Schemas
const CostumersSchema = require('../models/customers');
const UserSchema = require('../models/user');

//Logger
let is = 'routes/auth';
const Logger = LOGGER.getLogger(is);

router.use(interceptarRequest);

router.post('/', (req, res) => {

    let numDocumento = req.body.numero_documento;
    let tipoDocumento = req.body.tipo_documento;
    let password = req.body.password;

    Logger.addContext('Cliente', numDocumento);

    Logger.info("Verificando parametros del REQUEST");

    if (!(numDocumento && tipoDocumento && password)) {
        Logger.error(logger_error_enum.errors.E_PARAM_REQ);
        return res.status(400).json({
            state: 'error',
            error: {
                id: logger_error_enum.errors.E_PARAM_REQ.id,
                message: logger_error_enum.errors.E_PARAM_REQ.message,
            }
        });
    }

    Logger.info("Consultando colección Customers");
    CostumersSchema
        .findOne({ "personal_id_type": tipoDocumento, "personal_id": numDocumento })
        .populate('User')
        .exec((error, customerDb) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            Logger.info("Resultado obtenido de la consulta ", customerDb);
            if (!customerDb) {
                Logger.error(logger_error_enum.errors.E_AUTH_CRED.message, " - Usuario -");
                return res.status(400).json({
                    ok: false,
                    error: logger_error_enum.errors.E_AUTH_CRED
                });
            };

            Logger.info("Consultando colección Users");
            UserSchema
                .findOne({ "customer": customerDb._id })
                .populate(
                    {
                        path: 'customer',
                        select: '_id personal_id_type personal_id first_name last_name gender birth_date email phone_number',
                        model: 'Customer'
                    }
                )
                .exec((error, UserDb) => {
                    if (error) {
                        Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                        return res.status(500).json({
                            state: 'error',
                            error: logger_error_enum.errors.E_TRANSAC_DB
                        });
                    };

                    Logger.info("Resultado obtenido de la consulta ", UserDb);
                    if (!UserDb) {
                        Logger.error(logger_error_enum.errors.E_AUTH_NO_REG.message,);
                        return res.status(400).json({
                            ok: false,
                            error: logger_error_enum.errors.E_AUTH_NO_REG
                        });
                    };

                    if (!bcrypt.compareSync(password, UserDb.password)) {
                        Logger.error(logger_error_enum.errors.E_AUTH_CRED.message, " - PASSWORD -");
                        return res.status(400).json({
                            ok: false,
                            error: logger_error_enum.errors.E_AUTH_CRED
                        });
                    };

                    Logger.info("El usuario se ha autenticado correctamente");
                    let token = jwt.sign({ UserDb }, process.env.SEED_JWT, { expiresIn: process.env.CADUCIDAD_JWT });
                    res.status(204);
                    res.setHeader('token',token);
                    return res.json({});

                });
        });
});

module.exports = router;


