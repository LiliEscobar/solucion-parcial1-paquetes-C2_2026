// Configuracion inicial del servidor con express.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3124;

app.use(express.json());

// Este arreglo guarda las incidencias mientras el servidor esta encendido.
const incidencias = [];

// Funciones reutilizables para buscar incidencias dentro del arreglo.
const buscarPorId = (id) => {
  return incidencias.find((i) => i.id === id);
};

const buscarIndicePorId = (id) => {
  return incidencias.findIndex((i) => i.id === id);
};

// Endpoint POST para registrar una nueva incidencia.
app.post('/incidencias', (req, res) => {
  const { empleado, area, descripcion, prioridad } = req.body;

  // Validacion booleana para saber si el cuerpo es un objeto valido.
  const esObjetoValido = req.body !== null && typeof req.body === 'object';

  if (!esObjetoValido) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  } else if (!empleado || !area || !descripcion || !prioridad) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  } else if (
    empleado.trim() === '' ||
    area.trim() === '' ||
    descripcion.trim() === '' ||
    prioridad.trim() === ''
  ) {
    return res.status(400).json({ mensaje: 'No se permiten cadenas vacías' });
  }

  // Se normaliza la prioridad con trim() y toLowerCase() antes del switch.
  const prioridadNormalizada = prioridad.trim().toLowerCase();

  switch (prioridadNormalizada) {
    case 'alta':
    case 'media':
    case 'baja':
      break;
    default:
      return res.status(400).json({ mensaje: 'Prioridad no válida. Use: Alta, Media o Baja' });
  }

  // Se guarda la prioridad en formato bonito: "Alta", "Media" o "Baja".
  const prioridadBonita =
    prioridadNormalizada.charAt(0).toUpperCase() + prioridadNormalizada.slice(1);

  // Creamos y guardamos la nueva incidencia con estado inicial pendiente.
  const nueva = {
    id: incidencias.length > 0
      ? Math.max(...incidencias.map((i) => i.id)) + 1
      : 1,
    empleado: empleado.trim(),
    area: area.trim(),
    descripcion: descripcion.trim(),
    prioridad: prioridadBonita,
    estado: 'Pendiente',
  };

  incidencias.push(nueva);

  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente',
    incidencia: nueva,
  });
});

// Endpoint GET para listar todas las incidencias registradas.
app.get('/incidencias', (req, res) => {
  return res.status(200).json(incidencias);
});

// Endpoint GET para estadisticas. Se coloca antes de las rutas con :id para evitar conflictos.
app.get('/estadisticas', (req, res) => {
  // Se usa reduce para contar por estado sin variables manuales.
  const estadisticas = incidencias.reduce(
    (resultado, incidencia) => {
      resultado.totalIncidencias += 1;

      const estadisticaPorEstado = {
        Pendiente: 'pendientes',
        'En Proceso': 'enProceso',
        Resuelta: 'resueltas',
        Cancelada: 'canceladas',
      };

      const clave = estadisticaPorEstado[incidencia.estado];
      if (clave) {
        resultado[clave] += 1;
      }

      return resultado;
    },
    {
      totalIncidencias: 0,
      pendientes: 0,
      enProceso: 0,
      resueltas: 0,
      canceladas: 0,
    }
  );

  return res.status(200).json(estadisticas);
});

// Endpoint GET para clasificacion automatica. Se coloca antes de /:id.
app.get('/incidencias/:id/clasificacion', (req, res) => {
  const id = parseInt(req.params.id);
  const incidencia = buscarPorId(id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  const { prioridad } = incidencia;
  let clasificacion = 'Desconocida';

  // Se usa switch obligatorio para traducir la prioridad a una clasificacion.
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

  return res.status(200).json({ id, 'clasificación': clasificacion });
});

// Endpoint GET para buscar una incidencia especifica por id. Va al final para no chocar con las anteriores.
app.get('/incidencias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const incidencia = buscarPorId(id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  return res.status(200).json(incidencia);
});

// Endpoint PUT para cambiar el estado de una incidencia.
app.put('/incidencias/:id/estado', (req, res) => {
  const id = parseInt(req.params.id);
  const { estado } = req.body;

  if (!estado || typeof estado !== 'string' || estado.trim() === '') {
    return res.status(400).json({ mensaje: 'El campo "estado" es obligatorio' });
  }

  const incidencia = buscarPorId(id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  // Se normaliza el estado con trim() y toLowerCase() antes del switch.
  const estadoNormalizado = estado.trim().toLowerCase();

  // Se normaliza el estado a su formato bonito con primera letra mayuscula.
  const estadosValidos = {
    pendiente: 'Pendiente',
    'en proceso': 'En Proceso',
    resuelta: 'Resuelta',
    cancelada: 'Cancelada',
  };

  const estadoBonito = estadosValidos[estadoNormalizado];

  switch (estadoNormalizado) {
    case 'pendiente':
    case 'en proceso':
    case 'resuelta':
    case 'cancelada':
      incidencia.estado = estadoBonito;
      return res.status(200).json({ mensaje: 'Estado actualizado correctamente', incidencia });
    default:
      return res.status(400).json({
        mensaje: `Estado "${estado}" no válido. Use: Pendiente, En Proceso, Resuelta o Cancelada`,
      });
  }
});

// Endpoint DELETE para eliminar una incidencia por id.
app.delete('/incidencias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = buscarIndicePorId(id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  // Eliminamos la incidencia usando su posicion dentro del arreglo.
  const eliminada = incidencias.splice(indice, 1);

  return res.status(200).json({
    mensaje: 'Incidencia eliminada correctamente',
    incidencia: eliminada[0],
  });
});

// Ruta principal para verificar que la API esta funcionando.
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});

// Inicio el servidor para que escuche peticiones en el puerto indicado.
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});