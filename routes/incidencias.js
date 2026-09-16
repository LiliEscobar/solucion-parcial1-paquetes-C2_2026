const express = require('express');
const {
  listarIncidencias,
  registrarIncidencia,
  obtenerEstadisticas,
  obtenerClasificacion
} = require('../controllers/incidenciasController');

// Router nos permite agrupar las rutas relacionadas con incidencias.
const router = express.Router();

// Rutas principales para listar y registrar incidencias.
router.get('/', listarIncidencias);
router.post('/', registrarIncidencia);

// Rutas adicionales para consultar resumenes y clasificaciones.
router.get('/estadisticas', obtenerEstadisticas);
router.get("/incidencias/:id/clasificacion", obtenerClasificacion);

// Exportamos el router para conectarlo con la aplicacion principal.
module.exports = router;
