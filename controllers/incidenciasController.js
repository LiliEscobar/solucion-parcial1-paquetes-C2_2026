const { validarIncidencia } = require('../utils/helpers');

const incidencias = [];

function registrarIncidencia(req, res) {
  const error = validarIncidencia(req.body);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  incidencias.push({
    empleado: req.body.empleado.trim(),
    area: req.body.area.trim(),
    descripcion: req.body.descripcion.trim(),
    prioridad: req.body.prioridad
  });

  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente'
  });
}

function listarIncidencias(req, res) {
  return res.json(incidencias);
}

module.exports = {
  incidencias,
  listarIncidencias,
  registrarIncidencia
};
