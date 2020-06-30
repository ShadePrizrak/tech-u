const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let CustomerModel = require('./models/customers');
let CardModel = require('./models/cards');
let AccountModel = require('./models/accounts');

let customersArray = require('../mocks/costumers_mock_data.json');
let cardsArray = require('../mocks/cards_mock_data.json');
let accountsArray = require('../mocks/accounts_mock_data.json');
const accounts = require('./models/accounts');

//Inicio de la aplicación
mongoose.connect(
    `mongodb://tech-u-local:Elimperio_72@ds211259.mlab.com:11259/tech-u`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    },
    (error, resp) => {
        if (error) {
            console.error(`Error al conectarse con la base de datos - ${error}`);
        };

        console.info('INICIANDO CARGA DE BD');

        customersArray.forEach((customer, index) => {

            let  idCustomer = mongoose.Types.ObjectId();
            let  idAccount = mongoose.Types.ObjectId();
            let  idCard = mongoose.Types.ObjectId();

            let customerWriteBd = new CustomerModel({
                _id: idCustomer,
                personal_id_type: customer.personal_id_type,
                personal_id: customer.personal_id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                gender: customer.gender,
                birth_date: customer.birth_date,
                email: customer.email,
                phone_number: customer.phone_number,
                accounts:[idAccount],
                cards:[idCard]
            });

            let cardsWriteBd = new CardModel({
                _id: idCard,
                card_number: cardsArray[index].card_number,
                card_type: cardsArray[index].card_type,
                expiration_date: bcrypt.hashSync(cardsArray[index].expiration_date, 10),
                ccv: bcrypt.hashSync(cardsArray[index].ccv.toString(), 10),
                pin: bcrypt.hashSync(cardsArray[index].pin.toString(), 10),
                customer: idCustomer
            });

            let accountWriteBd = new AccountModel({
                _id: idAccount,
                account_number: accountsArray[index].account_number,
                currency: accountsArray[index].currency,
                open_date: accountsArray[index].open_date,
                balance: accountsArray[index].balance,
                customer: idCustomer
            });

            customerWriteBd.save((err, response) => {
                if (err) {
                    console.error("Error al cargar el customer " + JSON.stringify(customerWriteBd) + " " + err);
                } else {
                    console.info("Se inserto el customer " + JSON.stringify(response));

                    cardsWriteBd.save((err,response)=>{
                        if(err){
                            console.error("Error al cargar el customer " + JSON.stringify(cardsWriteBd) + " " + err);
                        }else{
                            console.info("Se inserto el card " + JSON.stringify(response));
                        }
                    });

                    accountWriteBd.save((err,response)=>{
                        if(err){
                            console.error("Error al cargar el customer " + JSON.stringify(accountWriteBd) + " " + err);
                        }else{
                            console.info("Se inserto el card " + JSON.stringify(response));
                        }
                    });

                }
            });

        });

    });


