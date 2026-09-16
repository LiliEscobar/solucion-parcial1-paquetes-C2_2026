function estaVacio(valor) {
  // Comentario: evitamos cadenas vacías o con espacios en blanco para validar datos de entrada del usuario.
  return typeof valor !== 'string' || valor.trim() === '';
}

function validarIncidencia(datos) {
  // Comentario: si el cuerpo llega vacío o nulo, no se puede destructurar y la petición debe rechazarse.
  if (!datos || typeof datos !== 'object') {
    return 'Todos los campos son obligatorios';
  }

  const { empleado, area, descripcion, prioridad } = datos;
  const prioridadesPermitidas = ['Alta', 'Media', 'Baja'];

  if (estaVacio(empleado) || estaVacio(area) || estaVacio(descripcion) || estaVacio(prioridad)) {
    return 'Todos los campos son obligatorios';
  }

  // Comentario: se normaliza la prioridad con trim() para aceptar valores con espacios y validar correctamente.
  if (!prioridadesPermitidas.includes(prioridad.trim())) {
    return 'La prioridad debe ser Alta, Media o Baja';
  }

  return null;
}

module.exports = {
  estaVacio,
  validarIncidencia
};
