const request = require('request-json');

const { currency } = require('./models/enums/currency');

const client = request.createClient('https://api.cambio.today/v1/quotes/');
const apiKey = '&key=4620|HiTENtqwJraRjynsHQq0oWf9pJ8DW_tU';

let moneda1 = "NUEVO SOL";
let moneda2 = "DOLAR";
let cantidad = 123;

client.get(`${currency["DOLAR"].id}/${currency["NUEVO SOL"].id}/json?quantity=${12}${apiKey}`, function (error, res, body) {
    return console.log(body.result.amount);
});