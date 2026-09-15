const express = require('express');
const { registrarIncidencia } = require('../controllers/incidenciasController');

const router = express.Router();

router.post('/', registrarIncidencia);

module.exports = router;
