const { validarIncidencia } = require('../utils/helpers');

// Arreglo en memoria para almacenar las incidencias
const incidencias = [];

// Función auxiliar para generar un ID incremental
function generarId() {
  if (incidencias.length === 0) {
    return 1;
  }
  return Math.max(...incidencias.map((incidencia) => incidencia.id)) + 1;
}

//Registrar Incidencia (POST /incidencias)
function registrarIncidencia(req, res) {
  const error = validarIncidencia(req.body);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  // Normalizar la prioridad con la primera letra en mayúscula 
  const prioridadFormateada = 
    req.body.prioridad.trim().charAt(0).toUpperCase() + 
    req.body.prioridad.trim().slice(1).toLowerCase();

  const nuevaIncidencia = {
    id: generarId(),
    empleado: req.body.empleado.trim(),
    area: req.body.area.trim(),
    descripcion: req.body.descripcion.trim(),
    prioridad: prioridadFormateada,
    estado: 'Pendiente'
  };

  // Uso obligatorio de push()
  incidencias.push(nuevaIncidencia);

  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente'
  });
}

// 3. Listar Incidencias (GET /incidencias)
function listarIncidencias(req, res) {
  return res.status(200).json(incidencias);
}

// 4. Buscar Incidencia por ID (GET /incidencias/:id)
function obtenerIncidenciaPorId(req, res) {
  const id = Number(req.params.id);
  
  // Uso obligatorio de find()
  const incidencia = incidencias.find((item) => item.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  return res.status(200).json(incidencia);
}

// 5. Cambiar Estado de Incidencia (PUT /incidencias/:id/estado)
function actualizarEstadoIncidencia(req, res) {
  const id = Number(req.params.id);
  const { estado } = req.body;

  if (!estado || typeof estado !== 'string' || estado.trim() === '') {
    return res.status(400).json({ mensaje: 'El campo "estado" es obligatorio' });
  }

  const incidencia = incidencias.find((item) => item.id === id);
  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  const estadoNormalizado = estado.trim();

  //Uso de SWITCH para validar estados
  switch (estadoNormalizado) {
    case 'Pendiente':
    case 'En Proceso':
    case 'Resuelta':
    case 'Cancelada':
      incidencia.estado = estadoNormalizado;
      return res.status(200).json({
        mensaje: 'Estado actualizado correctamente',
        incidencia
      });
    default:
      return res.status(400).json({
        mensaje: `Estado "${estadoNormalizado}" no válido. Use: Pendiente, En Proceso, Resuelta o Cancelada`
      });
  }
}

// 6. Eliminar Incidencia (DELETE /incidencias/:id)
function eliminarIncidencia(req, res) {
  const id = Number(req.params.id);

  // Uso de findIndex()
  const indice = incidencias.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  //Uso de splice()
  const [incidenciaEliminada] = incidencias.splice(indice, 1);

  return res.status(200).json({
    mensaje: 'Incidencia eliminada correctamente',
    incidencia: incidenciaEliminada
  });
}

// Endpoint de Estadísticas (GET /incidencias/estadisticas)
function obtenerEstadisticas(req, res) {
  const estadisticas = incidencias.reduce(
    (resultado, incidencia) => {
      resultado.totalIncidencias += 1;

      switch (incidencia.estado) {
        case 'Pendiente':
          resultado.pendientes += 1;
          break;
        case 'En Proceso':
          resultado.enProceso += 1;
          break;
        case 'Resuelta':
          resultado.resueltas += 1;
          break;
        case 'Cancelada':
          resultado.canceladas += 1;
          break;
      }

      return resultado;
    },
    {
      totalIncidencias: 0,
      pendientes: 0,
      enProceso: 0,
      resueltas: 0,
      canceladas: 0
    }
  );

  return res.status(200).json(estadisticas);
}

function obtenerClasificacion(req, res) {
  const id = Number(req.params.id);
  const incidencia = incidencias.find((item) => item.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  let clasificacion = 'Normal';

  switch (incidencia.prioridad) {
    case 'Alta':
      clasificacion = 'Critica';
      break;
    case 'Media':
      clasificacion = 'Importante';
      break;
    case 'Baja':
      clasificacion = 'Normal';
      break;
    default:
      clasificacion = 'Normal';
  }

  return res.status(200).json({
    id: incidencia.id,
    clasificacion
  });
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