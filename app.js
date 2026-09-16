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

  // Validaciones principales: campos obligatorios, texto no vacio y prioridad permitida.
  if (!empleado || !area || !descripcion || !prioridad) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  if (
    empleado.trim() === '' ||
    area.trim() === '' ||
    descripcion.trim() === '' ||
    prioridad.trim() === ''
  ) {
    return res.status(400).json({ mensaje: 'No se permiten cadenas vacías' });
  }

  switch (prioridad) {
    case 'Alta':
    case 'Media':
    case 'Baja':
      break;
    default:
      return res.status(400).json({ mensaje: 'Prioridad no válida. Use: Alta, Media o Baja' });
  }

  // Creamos y guardamos la nueva incidencia con estado inicial pendiente.
  const nueva = {
    id: incidencias.length + 1,
    empleado,
    area,
    descripcion,
    prioridad,
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

// Endpoint GET para buscar una incidencia especifica por id.
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

  if (!estado) {
    return res.status(400).json({ mensaje: 'El campo "estado" es obligatorio' });
  }

  const incidencia = buscarPorId(id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  // Solo se aceptan los estados definidos para el flujo de una incidencia.
  switch (estado) {
    case 'Pendiente':
    case 'En Proceso':
    case 'Resuelta':
    case 'Cancelada':
      incidencia.estado = estado;
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

// Iniciamos el servidor para que escuche peticiones en el puerto indicado.
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
