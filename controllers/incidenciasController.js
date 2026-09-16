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
    prioridad: req.body.prioridad,
    estado: 'Pendiente'
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

function obtenerEstadisticas(req, res) {
  const estadisticas = incidencias.reduce((resultado, incidencia) => {
    resultado.totalIncidencias += 1;

    const estadisticaPorEstado = {
      Pendiente: 'pendientes',
      'En Proceso': 'enProceso',
      Resuelta: 'resueltas',
      Cancelada: 'canceladas'
    };

    const clave = estadisticaPorEstado[incidencia.estado];
    if (clave) {
      resultado[clave] += 1;
    }

    return resultado;
  }
    , {
      totalIncidencias: 0,
      pendientes: 0,
      enProceso: 0,
      resueltas: 0,
      canceladas: 0
    });

  return res.json(estadisticas);
}

module.exports.obtenerEstadisticas = obtenerEstadisticas;
