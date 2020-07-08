# Proyecto Tech University - Nivel Practitioner
Proyecto desarollado para el primer curso Practitioner del 2020 en el Tech University del campus BBVA.
## Introducción 
El objetivo del presente proyecto es el desarrollo de un aplicativo web para una banca por internet.
## Funcionalidades
1. Alta de contraseña de usuario.
1. Actualización de contraseña de usuario.
1. Validación de credenciales de acceso de un usuario.
1. Generación de token de autenticación para uso de servicios.
1. Refresco de token de autenticación para uso de servicios.
1. Listado de cuentas por cliente.
1. Mostrar el detalle de una cuenta, y operaciones ligadas a esta, de un cliente.
1. Listado de tarjetas por cliente.
1. Realizar transferencias de dinero entre *cuentas* de *clientes*.
1. Conversión de moneda cuando la transferencia es entre cuentas de distinta moneda.
## Variables entorno
Para el correcto funcionamiento de la aplicación se necesita que el servidor que corre la aplicación tenga configurada las siguientes variables.
* DB_HOST : URL de la BD MLab.
* DB_NAME : Nombre de la base de datos.
* DB_USER : Usuario de la base de datos.
* DB_PASS : Contraseña de la base de datos.
* SEED_JWT : Semilla de encriptación JWT
* CADUCIDAD_JWT : Duración del token JWT
## Requisitos
Para poder levantar la aplicación se debe contar los siguientes requisitos
* Node js versión ^8.16.1
* NPM ^6.4.1
## Dependencias
El proyecto requiere las siguientes dependencias para su ejecución 
### Productivas
1. bcrypt ^3.0.0
1. body-parser ^1.19.0
1. cors ^2.8.5
1. dotenv ^8.2.0
1. express ^4.17.1
1. jsonwebtoken ^8.5.1
1. log4js ^6.2.1
1. mongoose ^5.9.14
1. mongoose-unique-validator ^2.0.3
1. mongoose-validator ^2.1.0
1. request-json ^0.6.5
1. underscore ^1.10.2
1. yargs ^15.3.1"
### Desarrollo
1. Nodemon ^2.0.4

## Recursos
### *Usuarios*
#### POST
* /users : Petición que permite el registro de un *cliente* , mediante su registro en la colección **usuarios** y la creación de una contraseña, utilizando el PIN y PAN del *tarjeta* del *cliente*.
#### PUT
* /users : Petición que permite la modificación de la contraseña de un usuario utilizando el PIN y el PAN de la *tarjeta* del *cliente*.
### *Autenticación*
#### POST
* /auth : Petición que permite la autenticación de las credenciales del *usuario* y la creación de un token para consumo de servicios.
### *Cuentas*
#### POST
* /accounts : Petición que permite la obtención de la información basica de una *cuenta* y su *cliente* propietario.
### *Clientes*
#### GET
* /customer/{customerId}/posicion_global : Petición que permite la obtención de un listado resumen de *cuentas* y *tarjetas* de un *cliente*.
* /customer/{customerId}/accounts : Petición que permite el listado de las *cuentas* de un *cliente*.
* /customer/{customerId}/accounts/{accountId} : Petición que permite mostrar la información de una *cuenta* y *operaciones* ligadas de un *cliente*.
* /customer/{customerId}/cards : Petición que permite el listado de las *tarjetas* de un *cliente*.
### *Operaciones*
#### POST
* /operations/{{customerId}}/{{accountId}}/{{destinationAccountId}} : Petición que permite realizar una transferencia de dinero entre una *cuenta origen* de un *cliente* y una *cuenta destino* .

## Desarrolladores

* César Augusto Mariluz Esmeralda
* 

## Referencias y enlaces
El presente proyecto genero la siguiente documentación por parte del equipo de trabajo.

* [Colección POSTMAN](https://documenter.getpostman.com/view/5198035/T17GeSvs)



