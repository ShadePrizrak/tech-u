const path = require('path');

//Logger
let is = 'middlewares/interceptor';
const Logger = LOGGER.getLogger(is);

let interceptarRequest = (req, res, next) => {
    Logger.info(`Peticion ${req.method} ${req.baseUrl} ${JSON.stringify(req.body)}`);

    next();
}

module.exports = {
    interceptarRequest
}