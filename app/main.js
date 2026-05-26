'use strict';

import { Carrito } from './modulos/carrito.js';
import { Autenticacion } from './modulos/autenticacion.js';
import { Notificaciones } from './utils/notificaciones.js';
import { Utilidades } from './utils/helpers.js';
import { inicializarMenuMovil } from './modulos/menu-movil.js';
import { inicializarAnimacionesEntrada } from './modulos/animaciones.js';
import { marcarEnlaceNavActivo } from './modulos/navegacion.js';

const CLAVE_ALMACENAMIENTO_CARRITO = 'vng_carrito_v3';

window.Vanguard = {
  carrito:        Carrito,
  autenticacion:  Autenticacion,
  notificaciones: Notificaciones,
  utilidades:     Utilidades,
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
  Carrito.cargarDesdeAlmacenamiento();
  Autenticacion.cargarSesion();
  inicializarMenuMovil();
  inicializarAnimacionesEntrada();
  marcarEnlaceNavActivo();

  window.addEventListener('storage', (evento) => {
    if (evento.key === CLAVE_ALMACENAMIENTO_CARRITO) {
      Carrito.cargarDesdeAlmacenamiento();
    }
  });

  if (window.Vanguard.config.depurar) {
    console.log('[VANGUARD] App inicializada v' + window.Vanguard.config.versionApp);
    console.log('[VANGUARD] Carrito:', Carrito.contarUnidades(), 'unidades');
  }
});
