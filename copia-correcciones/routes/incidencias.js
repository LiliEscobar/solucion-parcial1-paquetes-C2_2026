const express = require('express');
const {
  listarIncidencias,
  registrarIncidencia,
  obtenerIncidenciaPorId,
  actualizarEstadoIncidencia,
  eliminarIncidencia,
  obtenerEstadisticas,
  obtenerClasificacion
} = require('../controllers/incidenciasController');

const router = express.Router();

// Comentario: primero se registran rutas concretas como /estadisticas y luego las rutas con parámetro.
// Esto evita que /:id capture antes a /:id/clasificacion.
router.get('/', listarIncidencias);
router.post('/', registrarIncidencia);
router.get('/estadisticas', obtenerEstadisticas);
router.get('/:id/clasificacion', obtenerClasificacion);
router.get('/:id', obtenerIncidenciaPorId);
router.put('/:id/estado', actualizarEstadoIncidencia);
router.delete('/:id', eliminarIncidencia);

module.exports = router;
