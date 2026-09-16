const express = require('express');
const {
  listarIncidencias,
  registrarIncidencia,
  obtenerEstadisticas,
  obtenerClasificacion
} = require('../controllers/incidenciasController');

const router = express.Router();

router.get('/', listarIncidencias);
router.post('/', registrarIncidencia);
router.get('/estadisticas', obtenerEstadisticas);
router.get("/incidencias/:id/clasificacion", obtenerClasificacion);

module.exports = router;
