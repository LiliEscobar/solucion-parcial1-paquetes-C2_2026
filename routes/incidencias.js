const express = require('express');
const {
  listarIncidencias,
  registrarIncidencia,
  obtenerEstadisticas
} = require('../controllers/incidenciasController');

const router = express.Router();

router.get('/', listarIncidencias);
router.post('/', registrarIncidencia);
router.get('/estadisticas', obtenerEstadisticas);
module.exports = router;
