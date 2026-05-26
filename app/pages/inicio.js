'use strict';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-animacion-entrada').forEach((elemento, indice) => {
    elemento.style.transitionDelay = `${indice * 80}ms`;
  });
});
