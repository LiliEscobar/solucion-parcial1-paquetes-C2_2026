// routes/incidencias.js
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

// 1. Rutas exactas/estáticas primero
router.get('/', listarIncidencias);
router.post('/', registrarIncidencia);
router.get('/estadisticas', obtenerEstadisticas);

// 2. Rutas con parámetros específicos o dinámicos después
router.get('/:id/clasificacion', obtenerClasificacion);
router.get('/:id', obtenerIncidenciaPorId);
router.put('/:id/estado', actualizarEstadoIncidencia);
router.delete('/:id', eliminarIncidencia);

module.exports = router;
