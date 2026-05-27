'use strict';

import { Carrito } from './modulos/carrito.js';
import { Autenticacion } from './modulos/autenticacion.js';
import { AdminProductos } from './modulos/admin-productos.js';
import { Notificaciones } from './utilidades/notificaciones.js';
import { Utilidades } from './utilidades/helpers.js';
import { inicializarMenuMovil } from './modulos/menu-movil.js';
import { inicializarAnimacionesEntrada } from './modulos/animaciones.js';
import { marcarEnlaceNavActivo } from './modulos/navegacion.js';

window.Vanguard = {
  carrito:         Carrito,
  autenticacion:   Autenticacion,
  adminProductos:  AdminProductos,
  notificaciones:  Notificaciones,
  utilidades:      Utilidades,
  config: {
    urlApi:        '/api/v1',
    versionApp:    '3.0.0',
    moneda:        'USD',
    simboloMoneda: '$',
    entorno:       'desarrollo',
    depurar:       true
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Autenticacion.cargarSesion();
  Carrito.cargarDesdeAlmacenamiento();
  inicializarMenuMovil();
  inicializarAnimacionesEntrada();
  marcarEnlaceNavActivo();

  window.addEventListener('storage', (evento) => {
    if (evento.key && evento.key.startsWith('vng_carrito_v3')) {
      Carrito.cargarDesdeAlmacenamiento();
    }
  });

  if (window.Vanguard.config.depurar) {
    console.log('[VANGUARD] App inicializada v' + window.Vanguard.config.versionApp);
    console.log('[VANGUARD] Carrito:', Carrito.contarUnidades(), 'unidades');
  }
});
