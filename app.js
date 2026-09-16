const express = require('express');
const incidenciasRouter = require('./routes/incidencias');

const app = express();
const PORT = process.env.PORT || 3124;

// Comentario: express.json() permite leer el cuerpo JSON en req.body.
app.use(express.json());

// Comentario: se monta el router para centralizar las rutas y evitar duplicar la lógica dentro de app.js.
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});

app.use('/incidencias', incidenciasRouter);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
