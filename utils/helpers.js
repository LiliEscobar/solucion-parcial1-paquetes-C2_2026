
function estaVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === '';
}


function validarIncidencia(datos) {
  if (!datos || typeof datos !== 'object') {
    return 'Todos los campos son obligatorios';
  }

  const { empleado, area, descripcion, prioridad } = datos;
  const prioridadesPermitidas = ['alta', 'media', 'baja'];

  // Validar que ningún campo esté vacío
  if (
    estaVacio(empleado) ||
    estaVacio(area) ||
    estaVacio(descripcion) ||
    estaVacio(prioridad)
  ) {
    return 'Todos los campos son obligatorios';
  } 
  // Validar que la prioridad sea Alta, Media o Baja (sin importar mayúsculas/minúsculas)
  else if (!prioridadesPermitidas.includes(prioridad.trim().toLowerCase())) {
    return 'La prioridad debe ser Alta, Media o Baja';
  }

  return null;
}

module.exports = {
  estaVacio,
  validarIncidencia
};