# Proyecto Tech University - Nivel Practitioner
Proyecto desarollado para el primer curso Practitioner del 2020 en el Tech University del campus BBVA.

## Introducción 
El objetivo del presente proyecto es el desarrollo de un aplicativo web para una banca por internet.

## Funcionalidades

1. Alta de contraseña de usuario
2. Actualización de contraseña de usuario
3. 

## Variables entorno
Para el correcto funcionamiento de la aplicación se necesita que el servidor que corre la aplicación tenga configurada las siguientes variables.

* DB_HOST
* DB_NAME
* DB_USER
* DB_PASS
* SEED_JWT

## Recursos

### *Users*

##### POST

* /users : Petición que permite el registro de un *cliente* , mediante su registro en la colección **usuarios** y la creación de una contraseña, utilizando el PIN y PAN del *tarjeta* del *cliente*.

### PUT

* /users : Petición que permite la modificación de la contraseña de un usuario utilizando el PIN y el PAN de la *tarjeta* del *cliente*.