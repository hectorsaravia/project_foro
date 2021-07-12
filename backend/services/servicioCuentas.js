//se importan las librerías de azure service bus y bcrypt
//además de importar la configuración de la base de datos
const { ServiceBusClient } = require('@azure/service-bus');
const db = require('../database/config');
const bcrypt = require('bcrypt');


//se define la conexión con el bus de servicio de azure
//y la cola a la cual derivan los mensajes
const connectionString = "Endpoint=sb://proyectoforo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=L9FZGCrMgPsHMStHzWW37uRyDpBj7nWtaA3If9tA1/o=";
const topicName = "mytopic";


//función asíncrona que realiza el login de las cuentas a la base de datos
async function login (data) {
  
  //se define la variable check que será true o false si las
  //contraseñas coinciden o no
  let check;

  //query en la base de datos que busca el rut en la base de datos
  await db.promise().query(`SELECT password FROM users WHERE rut=?;`, [data.rut])
  .then( ([rows,fields]) => {

    //si no hay resultados, entonces el rut no existe en la base de datos
    if (rows.length === 0) check = false;

    //se comparan la contraseña dada y la contraseña en la base desencriptada
    else check = bcrypt.compareSync(data.password,rows[0].password);
  })

  //si hay un error, se retorna el error
  .catch((error) => {
    check = error;
  })

  //se retorna el valor de check
  console.log(`contraseñas coinciden: ${check}`);
  return check;
}


//función asíncrona que realiza el registro de las cuentas
async function registrar_usuario (data) {

  //variable que retornará el resultado al final de la ejecución
  let result;

  //la variable hash es el resultado de usar bcrypt para encriptar la contraseña
  //provista para ser usada en la base de datos
  const hash = bcrypt.hashSync(data.password, 10);

  //si es que el usuario ya existe, se prohibe una nueva inserción
  let [rows,fields] = await db.promise().query(`SELECT rut,email FROM users WHERE rut=? OR email=?`, 
  [data.rut, data.email]);

  //si es que ya existe en la base de datos entonces el resultado será false
  if (rows.length > 0) result = false;

  //en otro caso se procede a realizar la inserción
  else {

    //query que inserta un nuevo correo a la base de datos
    await db.promise().query(`INSERT INTO users(email,password,rut,name,rol) VALUES(?,?,?,?,?)`,
    [data.email, hash, data.rut, data.name, data.rol])
    .then( ([rows,fields]) => {

      //se retorna el resultado de la inserción realizada, si es que ocurrió como se esperaba
      //se retorna el mensaje de vuelta
      result = rows.affectedRows;
      if (result === 1) result = true;
      else result = false;

    })
    .catch((error) => {
      result = error;
    })
  } 

  //retorno del resultado
  console.log(`resultado de registro: ${result}`);
  return result;
 }


 //función asíncrona para mostrar datos del usuario
 async function mostrar_usuario (data) {

  //variable result que será el resultado del ejercicio
  let result;

  //query que busca en la base de datos los datos del usuario
  await db.promise().query(`SELECT email,rol,name,rut FROM users WHERE rut=?`,[data.rut])
  .then( ([rows, fields]) => {

    //si no existe el usuario, el resultado entonces es falso
    if (rows.length === 0) result = false;

    //si el resultado existe, se copia a la variable result
    else result = rows[0];
  })

  //despliegue en consola del usuario a mostrar y retorno
  console.log(`usuario mostrado: ${JSON.stringify(result)}`);
  return result;
}


//función asíncrona main
async function main() {

  //se define una nueva conexión al service bus de azure bajo los
  //parámetros dados al principio del script, el cual estará escuchando a los mensajes
  //bajo la dirección de "login"
  const sbClient = new ServiceBusClient(connectionString);
  const queueReceiver = sbClient.createReceiver(topicName, "login");

  //el primer try de la función asíncrona que se ejecuta si es que no hay errores
  try {

    //el while true provoca que el servicio esté siempre corriendo
    while (true) {

      //la variable mensaje es el objeto que se recibe desde el service bus
      //esta linea no se ejecuta hasta que un mensaje no se reciba
      const messages = await queueReceiver.receiveMessages(1);

      //se recorre el json obtenido en el mensaje
      for (let message of messages) {

        //se imprime en consola el acuso de la recepción del mensaje
        //y también el body del paquete http.
        console.log("nuevo mensaje:");
        console.log(message.body);
        
        //la variable data se define como el body del paquete
        let data = message.body;

        //una vez se ha confirmado que se recibió el paquete, este se elimina de la cola
        //del service bus
        await queueReceiver.completeMessage(message);   
        
        //la variable result es el retorno de la función login
        let result = await mostrar_usuario(data);

        //se define el json response, que es la respuesta hacia el cliente mediante
        //la respuesta a la cola response_login
        let response = { body: result, to: "response_login" };

        //se crea el objeto sender cliente para enviar el json descrito anteriormente
        const sender = sbClient.createSender(topicName);

        //se envía el mensaje
        await sender.sendMessages(response);

        //se acusa el fin del proceso y el cierre del objeto declarado
        console.log(`fin de mensaje`);
        await sender.close();
      }
    }
  
    //finaliza la ejecución del main
  } finally {
    console.log("estoy después del main");
    await sbClient.close();
  }
}


//llamada al proceso main y se imprime por pantalla si ocurre un error
main().catch((err) => {
  console.log("Error:  ", err);
  process.exit(1);
});
