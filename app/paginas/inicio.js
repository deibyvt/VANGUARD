'use strict';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-animacion-entrada').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });

  if (window.Vanguard?.autenticacion?.estaAutenticado()) return;

  const botonComprar = document.getElementById('boton-comprar-heroe');
  if (botonComprar) {
    botonComprar.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'registro.html';
    });
  }

  document.querySelectorAll('.tarjeta-categoria a').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'registro.html';
    });
  });

  document.querySelectorAll('#vista-previa-productos .mini-tarjeta-vista-previa').forEach(tarjeta => {
    tarjeta.style.cursor = 'pointer';
    tarjeta.addEventListener('click', () => {
      window.location.href = 'registro.html';
    });
  });
});
