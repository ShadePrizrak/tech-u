let errors = {
    E_TRANSAC_DB: { id: 900, message: 'Ha ocurrido un error al ejecutar la transacción en la BD ' },
    E_PARAM_REQ: { id: 901, message: 'No se han cargados los parametros necesarios ' },
    E_AUTH_CRED: { id: 902, message: 'Usuario y/o contraseña incorrectos ' },
    E_AUTH_NO_REG: { id: 903, message: 'Usuario no registrado ' },
    E_AUTH_NO_TOKEN: { id: 904, message: 'No se ha ingresado un token ' },
    E_AUTH_NO_VALID_TOKEN: { id: 905, message: 'No se ha ingresado un token valido ' },
    E_AUTH_NO_CORRECT_TOKEN: { id: 906, message: 'El token no corresponde al cliente ' }
};

module.exports = {
    errors
};