// Importamos express para crear el servidor y manejar las rutas.
const express = require('express');

// Creamos la aplicacion principal de express.
const app = express();

// Definimos el puerto donde se va a ejecutar el servidor.
const PORT = process.env.PORT || 3124;

// Permitimos que express pueda leer datos enviados en formato JSON.
app.use(express.json());

// Este arreglo guarda las incidencias mientras el servidor esta encendido.
const incidencias = [];

// Funcion reutilizable para buscar una incidencia usando su id.
const buscarPorId = (id) => {
  // find recorre el arreglo y devuelve la primera incidencia que coincida.
  return incidencias.find((i) => i.id === id);
};

// Funcion reutilizable para buscar la posicion de una incidencia por id.
const buscarIndicePorId = (id) => {
  // findIndex devuelve la posicion del elemento o -1 si no lo encuentra.
  return incidencias.findIndex((i) => i.id === id);
};

// Endpoint POST para registrar una nueva incidencia.
app.post('/incidencias', (req, res) => {
  // Sacamos del body los datos que envio el usuario.
  const { empleado, area, descripcion, prioridad } = req.body;

  // Validamos que todos los campos obligatorios existan.
  if (!empleado || !area || !descripcion || !prioridad) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  // Validamos que los campos no sean solo espacios en blanco.
  if (
    // trim quita espacios al inicio y al final del texto.
    empleado.trim() === '' ||
    area.trim() === '' ||
    descripcion.trim() === '' ||
    prioridad.trim() === ''
  ) {
    return res.status(400).json({ mensaje: 'No se permiten cadenas vacías' });
  }

  // Revisamos que la prioridad sea una de las opciones permitidas.
  switch (prioridad) {
    case 'Alta':
    case 'Media':
    case 'Baja':
      // Si la prioridad es valida, salimos del switch y continuamos.
      break;
    default:
      // Si la prioridad no coincide, respondemos con error.
      return res.status(400).json({ mensaje: 'Prioridad no válida. Use: Alta, Media o Baja' });
  }

  // Creamos el objeto que representa la nueva incidencia.
  const nueva = {
    // El id se genera con la cantidad actual de incidencias mas uno.
    id: incidencias.length + 1,
    empleado,
    area,
    descripcion,
    prioridad,
    // Toda incidencia nueva inicia como pendiente.
    estado: 'Pendiente',
  };

  // push agrega la nueva incidencia al final del arreglo.
  incidencias.push(nueva);

  // Respondemos con codigo 201 porque el registro fue creado.
  return res.status(201).json({
    mensaje: 'Incidencia registrada correctamente',
    incidencia: nueva,
  });
});

// Endpoint GET para listar todas las incidencias registradas.
app.get('/incidencias', (req, res) => {
  // Devolvemos el arreglo completo en formato JSON.
  return res.status(200).json(incidencias);
});

// Endpoint GET para buscar una incidencia especifica por id.
app.get('/incidencias/:id', (req, res) => {
  // Convertimos el id de texto a numero porque viene desde la URL.
  const id = parseInt(req.params.id);

  // Buscamos la incidencia usando la funcion reutilizable.
  const incidencia = buscarPorId(id);

  // Si no existe la incidencia, respondemos con error 404.
  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  // Si existe, devolvemos la incidencia encontrada.
  return res.status(200).json(incidencia);
});

// Endpoint PUT para cambiar el estado de una incidencia.
app.put('/incidencias/:id/estado', (req, res) => {
  // Obtenemos el id desde la URL y lo convertimos a numero.
  const id = parseInt(req.params.id);

  // Obtenemos el nuevo estado desde el body.
  const { estado } = req.body;

  // Validamos que el estado haya sido enviado.
  if (!estado) {
    return res.status(400).json({ mensaje: 'El campo "estado" es obligatorio' });
  }

  // Buscamos la incidencia que se quiere modificar.
  const incidencia = buscarPorId(id);

  // Si no se encuentra, avisamos con un codigo 404.
  if (!incidencia) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  // Validamos que el estado sea uno de los valores permitidos.
  switch (estado) {
    case 'Pendiente':
    case 'En Proceso':
    case 'Resuelta':
    case 'Cancelada':
      // Si el estado es valido, actualizamos la incidencia.
      incidencia.estado = estado;
      return res.status(200).json({ mensaje: 'Estado actualizado correctamente', incidencia });
    default:
      // Si el estado no es valido, respondemos con error.
      return res.status(400).json({
        mensaje: `Estado "${estado}" no válido. Use: Pendiente, En Proceso, Resuelta o Cancelada`,
      });
  }
});

// Endpoint DELETE para eliminar una incidencia por id.
app.delete('/incidencias/:id', (req, res) => {
  // Obtenemos el id desde la URL y lo convertimos a numero.
  const id = parseInt(req.params.id);

  // Buscamos la posicion de la incidencia dentro del arreglo.
  const indice = buscarIndicePorId(id);

  // Si findIndex devuelve -1, significa que no existe.
  if (indice === -1) {
    return res.status(404).json({ mensaje: `No se encontró una incidencia con el ID ${id}` });
  }

  // splice elimina un elemento del arreglo usando su posicion.
  const eliminada = incidencias.splice(indice, 1);

  // Respondemos con la incidencia que fue eliminada.
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
