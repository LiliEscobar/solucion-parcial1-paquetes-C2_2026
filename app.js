const express = require('express');
const incidenciasRouter = require('./routes/incidencias');

const app = express();
const PORT = process.env.PORT || 3124;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});


app.use('/incidencias', incidenciasRouter);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
