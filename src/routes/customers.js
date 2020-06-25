/**
 * ROUTER ESPECIFICO PARA LA GESTION DE LOS USUARIOS
 */

const express = require('express');
const router = express.Router();
const { interceptarRequest } = require('../middlewares/interceptor');
const bcrypt = require('bcrypt');

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
 * Metodo que sirve para registrar a un neuvo cliente
 */
router.post('/', (req, res) => {

    let CardsSchema = require('../models/cards');
    let CostumersSchema = require('../models/customers');

    let card_number = req.body.card_number;
    let pin = req.body.pin;
    let password = req.body.password;

    CardsSchema.findOne({ 'card_number': card_number })
        .populate('Customer', '_id password')
        .exec((err, CardDB) => {
            if (err) {
                Logger.error("Ha  ocurrido un error al conectase a la BD");
                return res.status(500).json({
                    state: 'error',
                    err
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
            CostumersSchema.findByIdAndUpdate(customerId, {'password': bcrypt.hashSync(password, 10)}, (err, CustomerDB) => {
                if (err) {
                    Logger.error("Ha  ocurrido un error al conectase a la BD");
                    return res.status(500).json({
                        state: 'error',
                        err
                    });
                }

                Logger.error("Se ha creado exitosamente la contraseña del usuario");

                return res.status(200).json({
                    state: 'success',
                    CustomerDB
                });
               
            });


        })
});


module.exports = router;


