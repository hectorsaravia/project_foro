//Requerimientos para backend. No pasar a ES6
const express = require('express');
const cors = require('cors');
const { ServiceBusClient } = require('@azure/service-bus');

//conexión al bus de azure
const connectionString = 'Endpoint=sb://proyectoforo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=L9FZGCrMgPsHMStHzWW37uRyDpBj7nWtaA3If9tA1/o=';
const serviceBusClient = new ServiceBusClient(connectionString);

//se crean los objetos que envían y reciben mensajes a la cola del bus
const sender = serviceBusClient.createSender('myqueue');
const receiver = serviceBusClient.createReceiver('myqueue');

//mensaje enviado de prueba al bus
sender.sendMessages({'body': 'hoal'});

//Importar rutas
const routes = require('./routes');

//Se define app como la variable de ExpressJS
const app = express();

//Uso de cors
app.use(cors());

//Uso del puerto 3000
const port = 3000;

//Se indica que se aceptan JSON y x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', routes);

app.get('/', (req,res) => {
 res.json({'message': 'ok'})
});

app.listen(port, () => {
 console.log(`Server en http://localhost:${port}`)
});
