const express = require('express');
const incidenciasRouter = require('./routes/incidencias');

const app = express();
const PORT = process.env.PORT || 3124;

// Middleware para procesar cuerpos en formato JSON (req.body)
app.use(express.json());

// Ruta base opcional
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});

// Centralización de rutas bajo el prefijo /incidencias
app.use('/incidencias', incidenciasRouter);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
