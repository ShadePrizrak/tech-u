/**
 * 
 * Definición de variables globales
 * 
 * Modulos :
 * argv: Obtencion de argumentos 
 * path: Resolucion de rutas
 * log4j: Logger
 * 
 */

//Importaciones
const argv = require('./yargs');
const path = require('path');
const log4j = require('log4js')
    .configure({
        appenders: {
            file_logger: {
                type: 'file',
                filename: 'logs/bnet_techu.log',
                pattern: '.yyyy-MM-dd-hh',
                backups: 3,
                compress: true,
                layout: {
                    type: 'pattern',
                    pattern: '[%d][%p][%c][%X{Cliente}][%m]'
                }
            },            
            request_logger: {
                type: 'file',
                filename: 'logs/bnet_techu.log',
                pattern: '.yyyy-MM-dd-hh',
                backups: 3,
                compress: true,
                layout: {
                    type: 'pattern',
                    pattern: '[%d][REQUEST LOGGER][%p][%c][%m]'
                }
            },
            console_logger: {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: '[%d][INICIO APLICATIVO][%m]'
                }
            }
        },
        categories: {
            "main": {
                appenders: [
                    'console_logger'
                ],
                level: 'debug'
            },
            default: {
                appenders: [
                    'file_logger'
                ],
                level: 'debug'
            }
        }
    });

//Defición de variables globales
global.PROPERTIES = argv.args.environment === 'dev' ? require(path.resolve(__dirname, './dev.json')) : require(path.resolve(__dirname, './prod.json'));
global.LOGGER = log4j;
global.CONTEXT = '/api-techu-back';
/**
 *
 *  Cargamos variables que seran utilizadas en el entorno
 * 
 */

//Puerto
process.env.PORT = process.env.PORT ? process.env.PORT : PROPERTIES.app_properties.port