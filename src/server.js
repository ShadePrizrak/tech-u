//Importación de express
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

//Importamos la configuracion del servidor´
require(path.resolve(__dirname, './configs/config'));
require('dotenv').config(path.resolve(__dirname, '../.env'));

//Creación del objeto app
const app = express();

//Modificadores
app.use(bodyParser.json());

//Instanciación del logger
const Logger = LOGGER.getLogger('main')

// Funciones varias
let generarUriMongodb = function () {
    return `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
}

//Importamos las rutas
app.use(`${CONTEXT}/users`, require('./routes/users'));
app.use(`${CONTEXT}/auth`, require('./routes/auth'));

//Inicio de la aplicación
mongoose.connect(
    generarUriMongodb(),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    },
    (error, resp) => {
        if (error) {
            Logger.error(`Error al conectarse con la base de datos - ${error}`);
        };

        Logger.info('Base de datos ONLINE');

        app.listen(process.env.PORT, () => {
            Logger.info(`Escuchando desde el puerto ${process.env.PORT}`);
        });
    });


