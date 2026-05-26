'use strict';

const RETARDO_ANIMACION_CASCADA_MS = 80;
const UMBRAL_OBSERVADOR_ANIMACION = 0.1;

export function inicializarAnimacionesEntrada() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.js-animacion-entrada').forEach(el => {
      el.classList.add('js-animacion-entrada--visible');
    });
    return;
  }

  const observadorEntrada = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, indice) => {
        if (!entrada.isIntersecting) return;
        setTimeout(
          () => entrada.target.classList.add('js-animacion-entrada--visible'),
          indice * RETARDO_ANIMACION_CASCADA_MS
        );
        observadorEntrada.unobserve(entrada.target);
      });
    },
    {
      threshold:  UMBRAL_OBSERVADOR_ANIMACION,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  document.querySelectorAll('.js-animacion-entrada').forEach(elemento => {
    observadorEntrada.observe(elemento);
  });
}
