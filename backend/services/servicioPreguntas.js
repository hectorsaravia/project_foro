//se importan las librerías de azure service bus y bcrypt
//además de importar la configuración de la base de datos
const { ServiceBusClient } = require('@azure/service-bus');

const mostrar_preguntas_usuario = require('../database/mostrar_preguntas_usuario');
const nueva_pregunta_usuario = require('../database/nueva_pregunta_usuario');
const mostrar_pregunta = require('../database/mostrar_pregunta');
const votar_pregunta = require('../database/votar_pregunta');
const cerrar_pregunta = require('../database/cerrar_pregunta');

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
  const queueReceiver = sbClient.createReceiver(topicName, "servicioPreguntas");

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
        if (data.reason === "mostrar_preguntas_usuario") result = await mostrar_preguntas_usuario(data);
        else if (data.reason === "nueva_pregunta_usuario") result = await nueva_pregunta_usuario(data);
        else if (data.reason === "mostrar_pregunta") result = await mostrar_pregunta(data);
        else if (data.reason === "votar_pregunta") result = await votar_pregunta(data);
        else if (data.reason === "cerrar_pregunta") result = await cerrar_pregunta(data);

        //se define el json response, que es la respuesta hacia el cliente mediante
        //la respuesta a la cola response_login
        let response = { body: result, to: "servicioPreguntas_res" };

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