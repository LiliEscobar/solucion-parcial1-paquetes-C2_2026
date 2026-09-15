function estaVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === '';
}

function validarIncidencia(datos) {
  const { empleado, area, descripcion, prioridad } = datos;
  const prioridadesPermitidas = ['Alta', 'Media', 'Baja'];

  if (estaVacio(empleado) || estaVacio(area) || estaVacio(descripcion) || estaVacio(prioridad)) {
    return 'Todos los campos son obligatorios';
  }

  if (!prioridadesPermitidas.includes(prioridad)) {
    return 'La prioridad debe ser Alta, Media o Baja';
  }

  return null;
}

module.exports = {
  estaVacio,
  validarIncidencia
};
