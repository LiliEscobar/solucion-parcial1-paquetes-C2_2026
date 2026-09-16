const { validarIncidencia } = require('../utils/helpers');

const incidencias = [];

function generarId() { // Se genera un ID incremental para cada incidencia porque el array no lo tenía y las rutas por ID lo requieren.
  if (incidencias.length === 0) {
    return 1;
  }

  return Math.max(...incidencias.map((incidencia) => incidencia.id)) + 1;
}

function registrarIncidencia(req, res) {
  const error = validarIncidencia(req.body); // Se valida el cuerpo para evitar guardar datos vacíos o inválidos.

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const nuevaIncidencia = {
    id: generarId(), // Se agrega el id para que luego se pueda buscar, actualizar y borrar una incidencia concreta.
    empleado: req.body.empleado.trim(),
    area: req.body.area.trim(),
    descripcion: req.body.descripcion.trim(),
    prioridad: req.body.prioridad.trim(), // Se normaliza la prioridad para quitar espacios extras y mantener datos consistentes.
    estado: 'Pendiente'
  };

  incidencias.push(nuevaIncidencia);

  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente',
    incidencia: nuevaIncidencia
  });
}

function listarIncidencias(req, res) {
  return res.status(200).json(incidencias); // Se devuelve el arreglo completo porque esa es la operación de listado.
}

function obtenerIncidenciaPorId(req, res) {
  const id = Number(req.params.id); // Se convierte a número porque Express entrega el parámetro como string.
  const incidencia = incidencias.find((item) => item.id === id); // Se usa find para localizar la incidencia por su clave única.

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  return res.status(200).json(incidencia);
}

function actualizarEstadoIncidencia(req, res) {
  const id = Number(req.params.id);
  const { estado } = req.body;

  if (!estado || typeof estado !== 'string' || estado.trim() === '') { // Se comprueba que venga un estado real y no un valor vacío.
    return res.status(400).json({ mensaje: 'El campo "estado" es obligatorio' });
  }

  const incidencia = incidencias.find((item) => item.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  const estadosPermitidos = ['Pendiente', 'En Proceso', 'Resuelta', 'Cancelada'];
  const estadoNormalizado = estado.trim();

  if (!estadosPermitidos.includes(estadoNormalizado)) { // Se valida que el nuevo estado pertenezca al conjunto permitido del negocio.
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
  const id = Number(req.params.id);
  const indice = incidencias.findIndex((item) => item.id === id); // Se usa findIndex para ubicar la posición exacta y luego borrar con splice.

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
  const estadisticas = incidencias.reduce((resultado, incidencia) => { // Se reduce el array para contar la cantidad por estado y el total global.
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
  const id = Number(req.params.id);
  const incidencia = incidencias.find((item) => item.id === id); // Se confirma que la incidencia existe antes de clasificarla.

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  const { prioridad } = incidencia;
  let clasificacion = 'Desconocida';

  switch (prioridad) { // Se traduce cada prioridad a una clasificación de negocio: crítica, importante o normal.
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