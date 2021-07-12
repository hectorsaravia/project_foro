//se importan las librerías de azure service bus y bcrypt
//además de importar la configuración de la base de datos
const { ServiceBusClient } = require('@azure/service-bus');

const login = require('../database/login');
const registrar_usuario = require('../database/registrar_usuario');
const modificar_usuario = require('../database/modificar_usuario');
const mostrar_usuario = require('../database/mostrar_usuario');
const registrar_curso = require('../database/registrar_curso');
const comprobar_usuario = require('../database/comprobar_usuario');

//se define la conexión con el bus de servicio de azure
//y la cola a la cual derivan los mensajes
const connectionString = "Endpoint=sb://proyectoforo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=L9FZGCrMgPsHMStHzWW37uRyDpBj7nWtaA3If9tA1/o=";
const topicName = "mytopic";


//función asíncrona main
async function main() {

  //se define una nueva conexión al service bus de azure bajo los
  //parámetros dados al principio del script, el cual estará escuchando a los mensajes
  //bajo la dirección de "login"
  const sbClient = new ServiceBusClient(connectionString);
  const queueReceiver = sbClient.createReceiver(topicName, "servicioCuentas");

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
        
        //se declara la variable resultado que será la obtención de la ejecución en la base de datos
        let result;

        //se derivará a la función que corresponda según la razón del mensaje
        if (data.reason === 'login') result = await login(data);
        else if (data.reason === 'mostrar_usuario' ) result = await mostrar_usuario(data);
        else if (data.reason === 'registrar_usuario' ) result = await registrar_usuario(data);
        else if (data.reason === 'comprobar_usuario') result = await comprobar_usuario(data);
        else if (data.reason === 'modificar_usuario') result = await modificar_usuario(data);
        else if (data.reason === 'registrar_curso') result = await registrar_curso(data);

        //se define el json response, que es la respuesta hacia el cliente mediante
        //la respuesta a la cola response_login
        let response = { body: result, to: "servicioCuentas_res" };

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
