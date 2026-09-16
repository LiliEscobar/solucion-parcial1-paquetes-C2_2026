const { validarIncidencia } = require('../utils/helpers');

// Arreglo temporal donde se guardan las incidencias registradas.
const incidencias = [];

// Controlador para registrar una incidencia nueva.
function registrarIncidencia(req, res) {
  const error = validarIncidencia(req.body);

  // Si la validacion falla, se responde con error y no se guarda nada.
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

// Controlador para devolver todas las incidencias guardadas.
function listarIncidencias(req, res) {
  return res.json(incidencias);
}

// Exportamos las funciones para poder usarlas desde las rutas.
module.exports = {
  incidencias,
  listarIncidencias,
  registrarIncidencia,
  obtenerEstadisticas,
  obtenerClasificacion
};

// Controlador para contar las incidencias segun su estado.
function obtenerEstadisticas(req, res) {
  const estadisticas = incidencias.reduce((resultado, incidencia) => {
    resultado.totalIncidencias += 1;

    // Relacionamos el estado de la incidencia con el contador que se debe aumentar.
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

// Controlador para clasificar la incidencia segun su prioridad.
function obtenerClasificacion(req, res) {
  const { id } = req.params;
  const incidencia = incidencias.find(i => i.id === Number(id));
  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }
  const {prioridad} = incidencia;

  let clasificacion;
  // Segun la prioridad, se asigna una clasificacion mas entendible.
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
  return res.json({ clasificacion });
}
