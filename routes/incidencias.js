const express = require('express');
const {
  listarIncidencias,
  registrarIncidencia
} = require('../controllers/incidenciasController');

const router = express.Router();

router.get('/', listarIncidencias);
router.post('/', registrarIncidencia);

module.exports = router;
