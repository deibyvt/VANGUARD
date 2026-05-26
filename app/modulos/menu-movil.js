'use strict';

export function inicializarMenuMovil() {
  const paresMenus = [
    { idBoton: 'boton-menu-movil',     idMenu: 'menu-movil'              },
    { idBoton: 'boton-menu-movil',     idMenu: 'panel-menu-categorias'   },
    { idBoton: 'boton-menu-movil',     idMenu: 'panel-menu-producto'     },
    { idBoton: 'boton-menu-movil',     idMenu: 'panel-menu-checkout'     },
  ];

  paresMenus.forEach(({ idBoton, idMenu }) => {
    const boton = document.getElementById(idBoton);
    const menu  = document.getElementById(idMenu);
    if (!boton || !menu) return;

    boton.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const estaAbierto = menu.classList.toggle('menu-movil--abierto');
      boton.setAttribute('aria-expanded', String(estaAbierto));
    });

    document.addEventListener('click', (evento) => {
      if (menu.classList.contains('menu-movil--abierto') &&
          !menu.contains(evento.target) &&
          !boton.contains(evento.target)) {
        menu.classList.remove('menu-movil--abierto');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;
    document.querySelectorAll('.menu-movil--abierto').forEach(menuAbierto => {
      menuAbierto.classList.remove('menu-movil--abierto');
      const idMenuAbierto = menuAbierto.id;
      document.querySelectorAll(`[aria-controls="${idMenuAbierto}"]`).forEach(boton => {
        boton.setAttribute('aria-expanded', 'false');
        boton.focus();
      });
    });
  });
}
