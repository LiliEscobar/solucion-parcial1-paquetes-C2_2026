const express = require('express');
const incidenciasRouter = require('./routes/incidencias');

//Se crea una instancia de la aplicación Express y se define el puerto en el que se ejecutará la API
const app = express();
const PORT = process.env.PORT || 3124;

//Se configura la aplicación para que pueda recibir y procesar solicitudes con datos en formato JSON
app.use(express.json());

//Mensaje de bienvenida para la ruta raíz de la API, indicando que es la API de incidencias de TechSupport S.A.
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});
//Exponer el router de incidencias en la ruta /incidencias, 
app.use('/incidencias', incidenciasRouter);

//Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
