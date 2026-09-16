// Funcion auxiliar para saber si un valor viene vacio o solo con espacios.
function estaVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === '';
}

// Valida que una incidencia tenga los datos necesarios antes de guardarla.
function validarIncidencia(datos) {
  const { empleado, area, descripcion, prioridad } = datos;
  const prioridadesPermitidas = ['Alta', 'Media', 'Baja'];

  // Todos los campos son obligatorios para registrar la incidencia.
  if (estaVacio(empleado) || estaVacio(area) || estaVacio(descripcion) || estaVacio(prioridad)) {
    return 'Todos los campos son obligatorios';
  }

  // La prioridad solo puede ser una de las opciones indicadas.
  if (!prioridadesPermitidas.includes(prioridad)) {
    return 'La prioridad debe ser Alta, Media o Baja';
  }

  return null;
}

// Exportamos los helpers para reutilizarlos en otros archivos.
module.exports = {
  estaVacio,
  validarIncidencia
};
