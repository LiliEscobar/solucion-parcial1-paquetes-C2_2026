const express = require('express');

const app = express();
const PORT = process.env.PORT || 3124;

app.use(express.json());

const incidencias = [];

// cambio: helper buscar por id
const buscarPorId = (id) => {
  return incidencias.find((i) => i.id === id);
};

// cambio: helper buscar indice por id
const buscarIndicePorId = (id) => {
  return incidencias.findIndex((i) => i.id === id);
};

app.post('/incidencias', (req, res) => {
  const { empleado, area, descripcion, prioridad } = req.body;

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

app.get('/incidencias', (req, res) => {
  return res.status(200).json(incidencias);
});

// cambio: ruta buscar incidencia por id
app.get('/incidencias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const incidencia = buscarPorId(id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  return res.status(200).json(incidencia);
});

// cambio: ruta cambiar estado con switch
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

// cambio: ruta eliminar con findIndex y splice
app.delete('/incidencias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = buscarIndicePorId(id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  const eliminada = incidencias.splice(indice, 1);

  return res.status(200).json({
    mensaje: 'Incidencia eliminada correctamente',
    incidencia: eliminada[0],
  });
});

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de incidencias TechSupport S.A.' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});