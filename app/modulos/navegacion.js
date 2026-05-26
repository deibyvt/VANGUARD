'use strict';

export function marcarEnlaceNavActivo() {
  const rutaActual = window.location.pathname.split('/').pop() || 'inicio.html';

  const mapaEnlaces = {
    'inicio.html':     'inicio',
    'categorias.html': 'categorias',
    'login.html':      'iniciar-sesion',
    'registro.html':   'registrarme',
    'carrito.html':    'carrito',
    'pago.html':   'checkout',
    'producto.html':   'categorias',
  };

  const enlaceActivo = mapaEnlaces[rutaActual];
  if (!enlaceActivo) return;

  document.querySelectorAll(`[data-enlace-nav="${enlaceActivo}"]`).forEach(enlace => {
    enlace.classList.add('barra-navegacion__enlace--activo');
    enlace.setAttribute('aria-current', 'page');
  });
}
