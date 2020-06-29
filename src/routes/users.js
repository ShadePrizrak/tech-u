/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LOS USUARIOS
 */

const express = require('express');
const router = express.Router();
const { interceptarRequest } = require('../middlewares/interceptor');
const bcrypt = require('bcrypt');
const logger_error_enum = require('../models/enums/logger');

//Schemas
const CardsSchema = require('../models/cards');
const CostumersSchema = require('../models/customers');
const UserSchema = require('../models/user');

//Logger
let is = 'routes/users';
const Logger = LOGGER.getLogger(is);

router.use(interceptarRequest);

router.get('/', (req, res) => {

    console.log(req.body.hola);
    Logger.info(`Mensaje`);

    return res
        .status(200)
        .json({
            message: 'correcto'
        })
});

router.get('/:idCliente', (req, res) => {

    Logger.info(`Mensaje`);

    return res
        .status(200)
        .json({
            message: 'correcto'
        })
});

/**
 * Method : POST
 * Metodo que sirve para registrar a un nuevo usuario
 */
router.post('/', (req, res) => {

    let card_number = req.body.card_number;
    let pin = req.body.pin;
    let password = req.body.password;

    if (!(card_number && pin && password)) {
        Logger.error("Falta ingresar parametros necesarios");
        return res.status(400).json({
            state: 'error',
            err: 'La petición no ha recibido los parametros necesarios'
        });
    }

    CardsSchema.findOne({ 'card_number': card_number })
        .populate('Customer', '_id')
        .exec((error, CardDB) => {
            if (error) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };

            if (!CardDB) {
                Logger.error("No existe el número de tarjeta ingresado " + card_number.substring(card_number.length));
                return res.status(409).json({
                    state: 'error',
                    data: {
                        error: 'Número de tarjeta o clave PIN errada'
                    }
                });
            };

            if (!bcrypt.compareSync(pin, CardDB.pin)) {
                Logger.error("Clave PIN no coincide con la tarjeta");
                return res.status(409).json({
                    state: 'error',
                    data: {
                        error: 'Número de tarjeta o clave PIN errada'
                    }
                });
            };

            Logger.info(`Respuesta obtenida ${JSON.stringify(CardDB)}`);
            let customerId = CardDB.customer;

            Logger.addContext('Cliente', customerId);

            UserSchema.findById(customerId, (error, userDb) => {
                if (error) {
                    Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                    return res.status(500).json({
                        state: 'error',
                        error: logger_error_enum.errors.E_TRANSAC_DB
                    });
                };

                if (userDb) {
                    Logger.error("El usuario ya se encuentra registrado");
                    return res.status(409).json({
                        state: 'error',
                        data: {
                            error: 'El usuario ya se encuentra registrado'
                        }
                    });
                };

                user = new UserSchema({
                    customer: customerId,
                    password: bcrypt.hashSync(password, 10)
                });

                user.save((error, userDB) => {
                    if (error) {
                        Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                        return res.status(500).json({
                            state: 'error',
                            error: logger_error_enum.errors.E_TRANSAC_DB
                        });
                    }
                    Logger.info("Se ha creado exitosamente la contraseña del usuario");
                    return res.status(200).json({
                        state: 'success',
                        data: {
                            user: userDB
                        }
                    });
                });
            });
        });
});

/**
 * Method : PUT
 * Metodo que sirve para cambiar la contraseña a un usuario
 */
router.put('/', (req, res) => {

    let card_number = req.body.card_number;
    let pin = req.body.pin;
    let password = req.body.password;

    if (!(card_number && pin && password)) {
        return res.status(400).json({
            state: 'error',
            err: 'La petición no ha recibido los parametros necesarios'
        });
    }

    CardsSchema.findOne({ 'card_number': card_number })
        .populate('Customer', '_id')
        .exec((err, CardDB) => {
            if (err) {
                Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                return res.status(500).json({
                    state: 'error',
                    error: logger_error_enum.errors.E_TRANSAC_DB
                });
            };
            if (!bcrypt.compareSync(pin, CardDB.pin)) {
                Logger.error("Clave PIN no coincide con la tarjeta");
                return res.status(200).json({
                    state: 'error',
                    err
                });
            }

            Logger.info(`Respuesta obtenida ${JSON.stringify(CardDB)}`);
            let customerId = CardDB.customer;
            Logger.addContext('Cliente', customerId);

            UserSchema.findOne({ 'customer': customerId }, (error, userDb) => {
                if (error) {
                    Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                    return res.status(500).json({
                        state: 'error',
                        error: logger_error_enum.errors.E_TRANSAC_DB
                    });
                }

                if (!userDb) {
                    Logger.error("El usuario no se encuentra registrado");
                    return res.status(409).json({
                        state: 'error',
                        data: {
                            error: 'El usuario no se encuentra registrado'
                        }
                    });
                }

                UserSchema.findByIdAndUpdate(userDb._id, { password: bcrypt.hashSync(password, 10) }, (error, userDbAux) => {
                    if (error) {
                        Logger.error(logger_error_enum.errors.E_TRANSAC_DB.message, error);
                        return res.status(500).json({
                            state: 'error',
                            error: logger_error_enum.errors.E_TRANSAC_DB
                        });
                    }
                    Logger.info("Se ha actualizado exitosamente la contraseña del usuario");
                    return res.status(200).json({
                        state: 'success',
                        data: {
                            user: userDbAux
                        }
                    });
                });
            });
        });
});

module.exports = router;


