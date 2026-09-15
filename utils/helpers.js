function estaVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === '';
}

module.exports = {
  estaVacio
};
