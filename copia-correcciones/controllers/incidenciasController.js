const { validarIncidencia } = require('../utils/helpers');

const incidencias = [];

// Comentario: cada incidencia necesita un identificador único para poder buscarla, actualizarla o eliminarla más tarde.
function generarId() {
  if (incidencias.length === 0) {
    return 1;
  }

  return Math.max(...incidencias.map((incidencia) => incidencia.id)) + 1;
}

function registrarIncidencia(req, res) {
  // Comentario: validamos todo antes de guardar para evitar registros incompletos o inválidos.
  const error = validarIncidencia(req.body);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const nuevaIncidencia = {
    id: generarId(),
    empleado: req.body.empleado.trim(),
    area: req.body.area.trim(),
    descripcion: req.body.descripcion.trim(),
    prioridad: req.body.prioridad.trim(),
    estado: 'Pendiente'
  };

  incidencias.push(nuevaIncidencia);

  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente',
    incidencia: nuevaIncidencia
  });
}

function listarIncidencias(req, res) {
  // Comentario: devolvemos el estado actual del array compartido para mantener los datos sincronizados.
  return res.status(200).json(incidencias);
}

function obtenerIncidenciaPorId(req, res) {
  // Comentario: la búsqueda por ID es necesaria para consultar un registro específico y evitar devolver todo el arreglo.
  const id = Number(req.params.id);
  const incidencia = incidencias.find((item) => item.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  return res.status(200).json(incidencia);
}

function actualizarEstadoIncidencia(req, res) {
  // Comentario: se valida el estado antes de modificar el registro para evitar inconsistencias en el flujo de trabajo.
  const id = Number(req.params.id);
  const { estado } = req.body;

  if (!estado || typeof estado !== 'string' || estado.trim() === '') {
    return res.status(400).json({ mensaje: 'El campo "estado" es obligatorio' });
  }

  const incidencia = incidencias.find((item) => item.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  const estadosPermitidos = ['Pendiente', 'En Proceso', 'Resuelta', 'Cancelada'];
  const estadoNormalizado = estado.trim();

  if (!estadosPermitidos.includes(estadoNormalizado)) {
    return res.status(400).json({
      mensaje: `Estado "${estadoNormalizado}" no válido. Use: Pendiente, En Proceso, Resuelta o Cancelada`
    });
  }

  incidencia.estado = estadoNormalizado;

  return res.status(200).json({
    mensaje: 'Estado actualizado correctamente',
    incidencia
  });
}

function eliminarIncidencia(req, res) {
  // Comentario: usar findIndex + splice mantiene la integridad del array y permite borrar un elemento preciso por ID.
  const id = Number(req.params.id);
  const indice = incidencias.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  const [incidenciaEliminada] = incidencias.splice(indice, 1);

  return res.status(200).json({
    mensaje: 'Incidencia eliminada correctamente',
    incidencia: incidenciaEliminada
  });
}

function obtenerEstadisticas(req, res) {
  // Comentario: se reduce el array para contar incidencias por estado y total general.
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
  }, {
    totalIncidencias: 0,
    pendientes: 0,
    enProceso: 0,
    resueltas: 0,
    canceladas: 0
  });

  return res.status(200).json(estadisticas);
}

function obtenerClasificacion(req, res) {
  // Comentario: la clasificación depende de la prioridad, por eso se usa un switch para traducir cada valor a un nivel claro.
  const id = Number(req.params.id);
  const incidencia = incidencias.find((item) => item.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  const { prioridad } = incidencia;
  let clasificacion = 'Desconocida';

  switch (prioridad) {
    case 'Alta':
      clasificacion = 'Crítica';
      break;
    case 'Media':
      clasificacion = 'Importante';
      break;
    case 'Baja':
      clasificacion = 'Normal';
      break;
    default:
      clasificacion = 'Desconocida';
  }

  return res.status(200).json({ clasificacion });
}

module.exports = {
  incidencias,
  listarIncidencias,
  registrarIncidencia,
  obtenerIncidenciaPorId,
  actualizarEstadoIncidencia,
  eliminarIncidencia,
  obtenerEstadisticas,
  obtenerClasificacion
};
