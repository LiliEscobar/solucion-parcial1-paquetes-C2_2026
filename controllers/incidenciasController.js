// Importa la funcion que valida los datos antes de registrar una incidencia
const { validarIncidencia } = require('../utils/helpers');

// Arreglo en memoria para almacenar las incidencias
const incidencias = [
  {
    id: 1,
    empleado: 'Juan Perez',
    area: 'Contabilidad',
    descripcion: 'No puedo imprimir',
    prioridad: 'Alta',
    estado: 'Pendiente'
  },
  {
    id: 2,
    empleado: 'Maria Lopez',
    area: 'Ventas',
    descripcion: 'Correo no sincroniza',
    prioridad: 'Media',
    estado: 'En Proceso'
  },
  {
    id: 3,
    empleado: 'Carlos Ruiz',
    area: 'Soporte',
    descripcion: 'Pantalla parpadea',
    prioridad: 'Baja',
    estado: 'Resuelta'
  },
  {
    id: 4,
    empleado: 'Ana Torres',
    area: 'Recursos Humanos',
    descripcion: 'No accede al sistema de planillas',
    prioridad: 'Alta',
    estado: 'Pendiente'
  },
  {
    id: 5,
    empleado: 'Luis Mendoza',
    area: 'Finanzas',
    descripcion: 'Error al exportar reporte mensual',
    prioridad: 'Media',
    estado: 'Pendiente'
  },
  {
    id: 6,
    empleado: 'Sofia Ramirez',
    area: 'Marketing',
    descripcion: 'Falla la conexión a la VPN',
    prioridad: 'Alta',
    estado: 'En Proceso'
  },
  {
    id: 7,
    empleado: 'Pedro Castillo',
    area: 'Operaciones',
    descripcion: 'Impresora no responde',
    prioridad: 'Baja',
    estado: 'Cancelada'
  },
  {
    id: 8,
    empleado: 'Laura Gomez',
    area: 'Atención al Cliente',
    descripcion: 'Sistema de tickets caído',
    prioridad: 'Alta',
    estado: 'Resuelta'
  }
];

// Función auxiliar para generar un ID incremental
function generarId() {
  if (incidencias.length === 0) {
    return 1;
  }
  return Math.max(...incidencias.map((incidencia) => incidencia.id)) + 1;
}

// Registrar Incidencia (POST /incidencias)
function registrarIncidencia(req, res) {
  const error = validarIncidencia(req.body);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  // Normalizar la prioridad con la primera letra en mayuscula (ej: "alta" -> "Alta")
  const prioridadFormateada = 
    req.body.prioridad.trim().charAt(0).toUpperCase() + 
    req.body.prioridad.trim().slice(1).toLowerCase();

  // Crea la nueva incidencia con estado inicial Pendiente
  const nuevaIncidencia = {
    id: generarId(),
    empleado: req.body.empleado.trim(),
    area: req.body.area.trim(),
    descripcion: req.body.descripcion.trim(),
    prioridad: prioridadFormateada,
    estado: 'Pendiente'
  };

  // Agregar la nueva incidencia al arreglo de incidencias
  incidencias.push(nuevaIncidencia);

  // Responde con codigo 201 porque el registro fue creado
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
  
  // Buscar la primera incidencia que coincida con el ID recibido
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

  // Uso de SWITCH para validar estados
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

  // Obtener la posicion de la incidencia dentro del arreglo
  const indice = incidencias.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  // Eliminar una sola incidencia usando la posicion encontrada
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

  // Clasificar la incidencia por su prioridad
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
