function estaVacio(valor) {
  // Comentario: evitamos cadenas vacías o con espacios en blanco para validar datos de entrada del usuario.
  return typeof valor !== 'string' || valor.trim() === '';
}

function validarIncidencia(datos) {
  if (!datos || typeof datos !== 'object') {
    return 'Todos los campos son obligatorios';
  }

  const { empleado, area, descripcion, prioridad } = datos;
  const prioridadesPermitidas = ['alta', 'media', 'baja'];

  if (
    estaVacio(empleado) ||
    estaVacio(area) ||
    estaVacio(descripcion) ||
    estaVacio(prioridad)
  ) {
    return 'Todos los campos son obligatorios';
  } else if (!prioridadesPermitidas.includes(prioridad.trim().toLowerCase())) {
    return 'La prioridad debe ser Alta, Media o Baja';
  }

  return null;
}

module.exports = {
  estaVacio,
  validarIncidencia
};