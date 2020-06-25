//Declaración de las los argumentos necesarios para lanzar la aplicación

const args = require('yargs')
    .options({
        environment: {
            alias: 'e',
            desc: 'Ambiente sobre el cual se desplegará la aplicación',
            demand: true,
            choices: ['dev', 'prod']
        }
    })
    .help()
    .argv;

module.exports = {
    args
}