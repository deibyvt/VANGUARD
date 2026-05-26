'use strict';

const CLAVE_ALMACENAMIENTO_CARRITO = 'vng_carrito_v3';
const CLAVE_ALMACENAMIENTO_USUARIO = 'vng_usuario_v2';

export const Utilidades = {
  formatearPrecio(valor) {
    return `$ ${Number(valor).toFixed(2)}`;
  },

  esCorreoValido(valorCorreo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valorCorreo).trim());
  },

  mostrarErrorCampo(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.classList.add('mensaje-error-campo--visible');
  },

  ocultarErrorCampo(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.textContent = '';
    elemento.classList.remove('mensaje-error-campo--visible');
  },

  crearDebounce(funcionObjetivo, retardoMs = 300) {
    let temporizador;
    return function ejecutarConDebounce(...argumentos) {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => funcionObjetivo.apply(this, argumentos), retardoMs);
    };
  },

  capitalizarPalabras(texto) {
    return texto.replace(/\b\w/g, letra => letra.toUpperCase());
  }
};
