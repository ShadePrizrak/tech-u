let errors = {
    E_TRANSAC_DB: { id: 900, message: 'Ha ocurrido un error al ejecutar la transacción en la BD ' },
    E_PARAM_REQ: { id: 901, message: 'No se han cargados los parametros necesarios ' },
    E_CARD_INVALID_PIN_PAN: { id: 800, message: 'Número de tarjeta o PIN errados' },
    E_AUTH_CRED: { id: 700, message: 'Usuario y/o contraseña incorrectos ' },
    E_AUTH_NO_REG: { id: 701, message: 'Usuario no registrado ' },
    E_AUTH_NO_TOKEN: { id: 702, message: 'No se ha ingresado un token ' },
    E_AUTH_NO_VALID_TOKEN: { id: 703, message: 'No se ha ingresado un token valido ' },
    E_AUTH_NO_CORRECT_TOKEN: { id: 704, message: 'El token no corresponde al cliente ' },
    E_ACCOUNT_BAD_NUMBER: { id: 600, message: 'El número de cuenta es incorrecto ' },
    E_ACCOUNT_NOT_EXIST: { id: 601, message: 'No existe el número de cuenta ' },
    E_ACCOUNT_NOT_OPERATION: { id: 602, message: 'la cuenta no tiene operaciones ' },
    E_CUSTOMER_NOT_ACCOUNT: { id: 500, message: 'El cliente no posee cuentas asociadas ' },
    E_CUSTOMER_NOT_CARDS: { id: 501, message: 'El cliente no posee tarjetas asociadas ' },
    E_CUSTOMER_NOT_OWNER: { id: 502, message: 'El cliente no es propietario del recurso que consulta ' },
    E_OPERATION_NOT_CRG_ACC: { id: 400, message: 'No existe la cuenta cargo de operación ' },
    E_OPERATION_NOT_DTN_ACC: { id: 401, message: 'No existe la cuenta destino de operación ' },
    E_OPERATION_NOT_OWNER_CUSTOMER: { id: 402, message: 'El cliente ingresado no es dueño de la cuenta cargo ' },
    E_OPERATION_BAD_AMMOUNT: { id: 403, message: 'El monto debe ser un número ' },
    E_OPERATION_REQUEST_CONVERSION: { id: 404, message: 'Ocurrio un error obteniendo el monto por conversión de moneda ' },
    E_OPERATION_INSUFFICIENT_BALANCE: { id: 405, message: 'La cuenta de cargo no cuentra con el saldo suficiente para realizar la operación ' },
    E_OPERATION_SAME_CHARGE_DESTINATION: { id: 406, message: 'La cuenta de cargo debe ser diferente a la cuenta de destino ' },
};

module.exports = {
    errors
};