const express = require('express');
const incidenciasRoutes = require('./routes/incidencias');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/incidencias', incidenciasRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
