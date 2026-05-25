/**
 * ============================================================
 * VANGUARD — Script Principal Enterprise
 * Versión: 3.0 | Naming: 100% español
 * ============================================================
 *
 * RESPONSABILIDADES DE ESTE ARCHIVO:
 *   1. Namespace global window.Vanguard (estado centralizado)
 *   2. Módulo de carrito con localStorage real y funcional
 *   3. Módulo de autenticación (estructura preparada para API)
 *   4. Toggle de menú móvil (todas las páginas)
 *   5. Animaciones de entrada con IntersectionObserver
 *   6. Sistema de notificaciones visuales (toast)
 *   7. Contador de artículos en navbar
 *   8. Utilidades compartidas (validación, formato de precio)
 *
 * PRINCIPIO DE DISEÑO:
 *   Cada módulo está desacoplado. Sustituir localStorage por
 *   una API REST solo requiere cambiar las funciones de
 *   persistirEnAlmacenamiento() y cargarDesdeAlmacenamiento().
 *   La lógica de UI y estado no cambia.
 *
 * CLAVE DE localStorage: 'vng_carrito_v3'
 * (versión en la clave evita conflictos con datos de versiones anteriores)
 * ============================================================
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   CONSTANTES GLOBALES DEL PROYECTO
────────────────────────────────────────────────────────── */
const CLAVE_ALMACENAMIENTO_CARRITO  = 'vng_carrito_v3';
const CLAVE_ALMACENAMIENTO_USUARIO  = 'vng_usuario_v2';
const DURACION_NOTIFICACION_MS      = 3000;
const RETARDO_ANIMACION_CASCADA_MS  = 80;
const UMBRAL_OBSERVADOR_ANIMACION   = 0.1;


/* ─────────────────────────────────────────────────────────
   NAMESPACE GLOBAL VANGUARD
   Punto de entrada único para todo el estado de la app.
   Accesible desde cualquier script inline: window.Vanguard.*
────────────────────────────────────────────────────────── */
window.Vanguard = (function crearNamespaceVanguard() {

  /* ══════════════════════════════════════════════
     MÓDULO: CARRITO DE COMPRAS
     Estado en memoria + persistencia en localStorage
  ══════════════════════════════════════════════ */
  const moduloCarrito = {

    /* Estado interno del carrito */
    _articulos: [],

    /* ── Cargar desde localStorage ──
       Se llama una vez al inicializar la app.
       Si existe data guardada, la hidrata en memoria.
       Si el JSON está corrupto, resetea silenciosamente. */
    cargarDesdeAlmacenamiento() {
      try {
        const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO_CARRITO);
        if (datosGuardados) {
          const articulosParseados = JSON.parse(datosGuardados);
          /* Validación mínima: debe ser array */
          if (Array.isArray(articulosParseados)) {
            this._articulos = articulosParseados;
          }
        }
      } catch (errorAlmacenamiento) {
        /* JSON corrupto → resetear sin interrumpir la app */
        console.warn('[VANGUARD] Carrito: datos corruptos en localStorage, reseteando.', errorAlmacenamiento);
        this._articulos = [];
        this.persistirEnAlmacenamiento();
      }
      this.sincronizarContadorNavbar();
    },

    /* ── Persistir en localStorage ──
       Llamada después de cada modificación del carrito.
       Serializa el estado en memoria a localStorage.
       También dispara evento personalizado para sincronizar
       entre pestañas del mismo origen (multi-tab sync). */
    persistirEnAlmacenamiento() {
      try {
        localStorage.setItem(
          CLAVE_ALMACENAMIENTO_CARRITO,
          JSON.stringify(this._articulos)
        );
        /*
         * Disparar evento para sincronización multi-pestaña.
         * Otras pestañas escuchan 'storage' y se actualizan.
         * HOOK API: reemplazar con PATCH /api/v1/carrito cuando haya backend.
         */
        window.dispatchEvent(new CustomEvent('vng:carrito-actualizado', {
          detail: { articulos: this._articulos, total: this.calcularTotal() }
        }));
      } catch (errorAlmacenamiento) {
        console.error('[VANGUARD] Carrito: error al guardar en localStorage.', errorAlmacenamiento);
      }
    },

    /* ── Agregar artículo ──
       Si el producto + talla ya existe, incrementa cantidad.
       Si no, agrega nuevo artículo al array.
       Siempre persiste y actualiza el contador. */
    agregar(datosArticulo) {
      /*
       * Estructura esperada de datosArticulo:
       * {
       *   id:       string   (identificador del producto)
       *   nombre:   string
       *   precio:   number
       *   imagen:   string   (URL)
       *   talla:    string   (opcional, p.ej. 'M')
       *   cantidad: number   (cuántas unidades agregar)
       *   marca:    string
       *   sku:      string
       * }
       */
      const claveUnica = `${datosArticulo.id}_${datosArticulo.talla || 'unica'}`;

      const articuloExistente = this._articulos.find(
        articulo => `${articulo.id}_${articulo.talla || 'unica'}` === claveUnica
      );

      if (articuloExistente) {
        /* Incrementar cantidad si ya existe */
        articuloExistente.cantidad += (datosArticulo.cantidad || 1);
      } else {
        /* Agregar nuevo artículo con ID único de línea */
        this._articulos.push({
          ...datosArticulo,
          idLineaCarrito: `linea_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          cantidad:        datosArticulo.cantidad || 1,
          fechaAgregado:   new Date().toISOString()
        });
      }

      this.persistirEnAlmacenamiento();
      this.sincronizarContadorNavbar();

      console.log('[VANGUARD] Carrito — artículo agregado:', datosArticulo.nombre, '| Total:', this.contarArticulos());
    },

    /* ── Eliminar artículo por idLineaCarrito ──
       Usa idLineaCarrito (único por línea) para no eliminar
       el mismo producto en tallas distintas accidentalmente. */
    eliminarPorLineaCarrito(idLineaCarrito) {
      const cantidadAntes = this._articulos.length;
      this._articulos = this._articulos.filter(
        articulo => articulo.idLineaCarrito !== idLineaCarrito
      );
      if (this._articulos.length !== cantidadAntes) {
        this.persistirEnAlmacenamiento();
        this.sincronizarContadorNavbar();
        console.log('[VANGUARD] Carrito — artículo eliminado. Línea:', idLineaCarrito);
      }
    },

    /* ── Vaciar carrito completamente ──
       Usado al completar un pedido exitoso. */
    vaciar() {
      this._articulos = [];
      this.persistirEnAlmacenamiento();
      this.sincronizarContadorNavbar();
    },

    /* ── Calcular total ──
       Suma precio × cantidad de todos los artículos. */
    calcularTotal() {
      return this._articulos.reduce(
        (acumulador, articulo) => acumulador + (articulo.precio * articulo.cantidad),
        0
      );
    },

    /* ── Contar artículos únicos en el carrito ──
       (conteo de líneas, no de unidades totales) */
    contarArticulos() {
      return this._articulos.length;
    },

    /* ── Contar unidades totales ──
       Suma todas las cantidades de todas las líneas. */
    contarUnidades() {
      return this._articulos.reduce(
        (acumulador, articulo) => acumulador + articulo.cantidad,
        0
      );
    },

    /* ── Obtener copia del estado actual ──
       Retorna copia superficial para evitar mutaciones externas. */
    obtenerArticulos() {
      return [...this._articulos];
    },

    /* ── Sincronizar contador visual en navbar ──
       Actualiza el badge del ícono de carrito en la barra de navegación.
       Si el elemento no existe en la página actual, lo ignora silenciosamente. */
    sincronizarContadorNavbar() {
      const contadorNavbar = document.getElementById('contador-carrito-navbar');
      if (!contadorNavbar) return;

      const totalUnidades = this.contarUnidades();

      if (totalUnidades > 0) {
        const textoAnterior = contadorNavbar.textContent;
        const textoNuevo    = totalUnidades > 99 ? '99+' : String(totalUnidades);

        contadorNavbar.textContent = textoNuevo;
        contadorNavbar.classList.remove('js-oculto');
        contadorNavbar.setAttribute('aria-label', `${totalUnidades} artículo${totalUnidades !== 1 ? 's' : ''} en el carrito`);

        /* Animación de pulso solo cuando el número cambia */
        if (textoAnterior !== textoNuevo) {
          contadorNavbar.classList.remove('contador-carrito-navbar--pulsando');
          /* Forzar reflow para reiniciar la animación */
          void contadorNavbar.offsetWidth;
          contadorNavbar.classList.add('contador-carrito-navbar--pulsando');
          /* Limpiar clase después de la animación */
          setTimeout(() => {
            contadorNavbar.classList.remove('contador-carrito-navbar--pulsando');
          }, 420);
        }
      } else {
        contadorNavbar.classList.add('js-oculto');
        contadorNavbar.setAttribute('aria-label', '0 artículos en el carrito');
      }
    },

    /* ── Formatear total para mostrar ──
       Ejemplo: 74.97 → "$ 74.97" */
    formatearTotal() {
      return `$ ${this.calcularTotal().toFixed(2)}`;
    }
  };


  /* ══════════════════════════════════════════════
     MÓDULO: AUTENTICACIÓN DE USUARIO
     Estado en memoria + localStorage para token
  ══════════════════════════════════════════════ */
  const moduloAutenticacion = {

    _autenticado:  false,
    _datosUsuario: null,
    _tokenSesion:  null,

    /* ── Cargar sesión desde localStorage ──
       Al iniciar la app, verifica si hay sesión activa. */
    cargarSesion() {
      try {
        const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO_USUARIO);
        if (datosGuardados) {
          const sesion = JSON.parse(datosGuardados);
          if (sesion && sesion.token && sesion.usuario) {
            this._autenticado  = true;
            this._datosUsuario = sesion.usuario;
            this._tokenSesion  = sesion.token;
            this._actualizarNavbarAutenticado();
          }
        }
      } catch (_error) {
        this._autenticado = false;
      }
    },

    /* ── Guardar sesión al autenticarse ──
       HOOK: llamar desde la respuesta exitosa del API de login */
    guardarSesion(token, datosUsuario) {
      this._autenticado  = true;
      this._datosUsuario = datosUsuario;
      this._tokenSesion  = token;
      try {
        localStorage.setItem(CLAVE_ALMACENAMIENTO_USUARIO, JSON.stringify({
          token,
          usuario:          datosUsuario,
          fechaAutenticacion: new Date().toISOString()
        }));
      } catch (_error) {
        console.warn('[VANGUARD] No se pudo persistir la sesión.');
      }
      this._actualizarNavbarAutenticado();
    },

    /* ── Cerrar sesión ──
       Limpia memoria y localStorage. */
    cerrarSesion() {
      this._autenticado  = false;
      this._datosUsuario = null;
      this._tokenSesion  = null;
      localStorage.removeItem(CLAVE_ALMACENAMIENTO_USUARIO);
      this._actualizarNavbarDesautenticado();
    },

    estaAutenticado()       { return this._autenticado; },
    obtenerToken()          { return this._tokenSesion; },
    obtenerDatosUsuario()   { return this._datosUsuario; },

    /* ── Actualizar navbar cuando el usuario está logueado ──
       Oculta "Iniciar Sesión / Registrarme", muestra nombre de usuario */
    _actualizarNavbarAutenticado() {
      const accionesAuth = document.getElementById('acciones-autenticacion');
      if (!accionesAuth || !this._datosUsuario) return;
      accionesAuth.innerHTML = `
        <span class="barra-navegacion__enlace" style="color:rgba(255,255,255,0.6);">
          ${this._datosUsuario.nombre || 'Mi cuenta'}
        </span>
        <button
          id="boton-cerrar-sesion"
          class="barra-navegacion__enlace"
          data-accion-boton="cerrar-sesion"
          style="cursor:pointer;background:none;border:none;"
        >cerrar sesión</button>
      `;
      /* Re-asignar listener al nuevo botón */
      document.getElementById('boton-cerrar-sesion')
              ?.addEventListener('click', () => this.cerrarSesion());
    },

    _actualizarNavbarDesautenticado() {
      /* Recargar la página es la manera más limpia de restaurar el navbar
         sin duplicar el HTML de los enlaces originales. */
      window.location.reload();
    }
  };


  /* ══════════════════════════════════════════════
     MÓDULO: SISTEMA DE NOTIFICACIONES (Toast)
     Muestra mensajes temporales no intrusivos
  ══════════════════════════════════════════════ */
  const moduloNotificaciones = {

    _contenedor: null,

    /* Crear el contenedor de notificaciones si no existe */
    _asegurarContenedor() {
      if (this._contenedor) return;
      this._contenedor = document.createElement('div');
      this._contenedor.id = 'contenedor-notificaciones';
      this._contenedor.setAttribute('aria-live', 'polite');
      this._contenedor.setAttribute('aria-atomic', 'false');
      this._contenedor.style.cssText = `
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 500;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 340px;
        pointer-events: none;
      `;
      document.body.appendChild(this._contenedor);
    },

    /* ── Mostrar notificación ──
       tipo: 'exito' | 'error' | 'informacion'
       duracion: milisegundos antes de desaparecer */
    mostrar(mensaje, tipo = 'exito', duracion = DURACION_NOTIFICACION_MS) {
      this._asegurarContenedor();

      const coloresPorTipo = {
        exito:       { fondo: '#22c55e', texto: 'white' },
        error:       { fondo: '#e31e1e', texto: 'white' },
        informacion: { fondo: '#1a1a1a', texto: 'white' }
      };
      const colores = coloresPorTipo[tipo] || coloresPorTipo.informacion;

      const notificacion = document.createElement('div');
      notificacion.setAttribute('role', 'status');
      notificacion.style.cssText = `
        background: ${colores.fondo};
        color: ${colores.texto};
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 0.82rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.75rem 1.25rem;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        opacity: 0;
        transform: translateY(10px) scale(0.97);
        transition: opacity 200ms ease, transform 200ms ease;
        pointer-events: auto;
      `;
      notificacion.textContent = mensaje;
      this._contenedor.appendChild(notificacion);

      /* Animar entrada */
      requestAnimationFrame(() => {
        notificacion.style.opacity   = '1';
        notificacion.style.transform = 'translateY(0) scale(1)';
      });

      /* Animar salida y remover */
      setTimeout(() => {
        notificacion.style.opacity   = '0';
        notificacion.style.transform = 'translateY(10px) scale(0.97)';
        setTimeout(() => notificacion.remove(), 220);
      }, duracion);
    },

    /* Atajos semánticos */
    exito(mensaje)       { this.mostrar(mensaje, 'exito'); },
    error(mensaje)       { this.mostrar(mensaje, 'error'); },
    informacion(mensaje) { this.mostrar(mensaje, 'informacion'); }
  };


  /* ══════════════════════════════════════════════
     MÓDULO: UTILIDADES COMPARTIDAS
  ══════════════════════════════════════════════ */
  const moduloUtilidades = {

    /* Formato de precio en español colombiano */
    formatearPrecio(valor) {
      return `$ ${Number(valor).toFixed(2)}`;
    },

    /* Validar correo electrónico */
    esCorreoValido(valorCorreo) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valorCorreo).trim());
    },

    /* Mostrar mensaje de error en campo */
    mostrarErrorCampo(idElemento, mensaje) {
      const elemento = document.getElementById(idElemento);
      if (!elemento) return;
      elemento.textContent = mensaje;
      elemento.classList.add('mensaje-error-campo--visible');
    },

    /* Ocultar mensaje de error en campo */
    ocultarErrorCampo(idElemento) {
      const elemento = document.getElementById(idElemento);
      if (!elemento) return;
      elemento.textContent = '';
      elemento.classList.remove('mensaje-error-campo--visible');
    },

    /* Debounce: retrasa la ejecución hasta que el usuario deja de escribir */
    crearDebounce(funcionObjetivo, retardoMs = 300) {
      let temporizador;
      return function ejecutarConDebounce(...argumentos) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcionObjetivo.apply(this, argumentos), retardoMs);
      };
    },

    /* Capitalizar primera letra de cada palabra */
    capitalizarPalabras(texto) {
      return texto.replace(/\b\w/g, letra => letra.toUpperCase());
    }
  };


  /* ══════════════════════════════════════════════
     MÓDULO: CONFIGURACIÓN GLOBAL
  ══════════════════════════════════════════════ */
  const moduloConfiguracion = {
    urlApi:          '/api/v1',
    versionApp:      '3.0.0',
    moneda:          'USD',
    simboloMoneda:   '$',
    entorno:         'desarrollo',   /* 'desarrollo' | 'produccion' */
    depurar:         true            /* false en producción */
  };


  /* ──── API PÚBLICA DEL NAMESPACE ──── */
  return {
    carrito:        moduloCarrito,
    autenticacion:  moduloAutenticacion,
    notificaciones: moduloNotificaciones,
    utilidades:     moduloUtilidades,
    config:         moduloConfiguracion
  };

})(); /* IIFE — se ejecuta inmediatamente al cargar */


/* ─────────────────────────────────────────────────────────
   INICIALIZACIÓN: Se ejecuta cuando el DOM está listo
   Orden de inicialización importa — respetar el orden
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. Cargar estado persistido */
  window.Vanguard.carrito.cargarDesdeAlmacenamiento();
  window.Vanguard.autenticacion.cargarSesion();

  /* 2. Inicializar menú móvil (todas las páginas) */
  inicializarMenuMovil();

  /* 3. Inicializar animaciones de entrada por scroll */
  inicializarAnimacionesEntrada();

  /* 4. Marcar el enlace de navegación activo */
  marcarEnlaceNavActivo();

  /* 5. Sincronizar multi-pestaña: escuchar cambios en localStorage */
  window.addEventListener('storage', (evento) => {
    if (evento.key === CLAVE_ALMACENAMIENTO_CARRITO) {
      window.Vanguard.carrito.cargarDesdeAlmacenamiento();
    }
  });

  if (window.Vanguard.config.depurar) {
    console.log('[VANGUARD] App inicializada v' + window.Vanguard.config.versionApp);
    console.log('[VANGUARD] Carrito:', window.Vanguard.carrito.contarUnidades(), 'unidades');
    console.log('[VANGUARD] Autenticado:', window.Vanguard.autenticacion.estaAutenticado());
  }
});


/* ─────────────────────────────────────────────────────────
   FUNCIÓN: inicializarMenuMovil
   Maneja el toggle del menú hamburguesa con:
   - Click en el botón
   - Click fuera del menú para cerrar
   - Tecla Escape para cerrar
   - Soporte para múltiples menús en la misma página
────────────────────────────────────────────────────────── */
function inicializarMenuMovil() {
  /* Soportar múltiples pares botón-menu por página
     (útil si la arquitectura escala a mega-menús) */
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

    /* Cerrar al hacer click fuera */
    document.addEventListener('click', (evento) => {
      if (menu.classList.contains('menu-movil--abierto') &&
          !menu.contains(evento.target) &&
          !boton.contains(evento.target)) {
        menu.classList.remove('menu-movil--abierto');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* Escape global para cerrar cualquier menú abierto */
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;
    document.querySelectorAll('.menu-movil--abierto').forEach(menuAbierto => {
      menuAbierto.classList.remove('menu-movil--abierto');
      /* Restaurar aria-expanded en el botón correspondiente */
      const idMenuAbierto = menuAbierto.id;
      document.querySelectorAll(`[aria-controls="${idMenuAbierto}"]`).forEach(boton => {
        boton.setAttribute('aria-expanded', 'false');
        boton.focus();
      });
    });
  });
}


/* ─────────────────────────────────────────────────────────
   FUNCIÓN: inicializarAnimacionesEntrada
   IntersectionObserver activa la clase --visible
   en elementos con .js-animacion-entrada al entrar al viewport.
   El retardo escalonado crea efecto cascada natural.
────────────────────────────────────────────────────────── */
function inicializarAnimacionesEntrada() {
  /* Si el browser no soporta IntersectionObserver (muy raro hoy), mostrar todo */
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


/* ─────────────────────────────────────────────────────────
   FUNCIÓN: marcarEnlaceNavActivo
   Compara data-enlace-nav con la URL actual y aplica
   la clase --activo al enlace correspondiente.
   Evita duplicar aria-current="page" en múltiples páginas.
────────────────────────────────────────────────────────── */
function marcarEnlaceNavActivo() {
  const rutaActual = window.location.pathname.split('/').pop() || 'index.html';

  const mapaEnlaces = {
    'index.html':      'inicio',
    'categorias.html': 'categorias',
    'login.html':      'iniciar-sesion',
    'registro.html':   'registrarme',
    'carrito.html':    'carrito',
    'checkout.html':   'checkout',
    'producto.html':   'categorias', /* producto pertenece a categorias */
  };

  const enlaceActivo = mapaEnlaces[rutaActual];
  if (!enlaceActivo) return;

  document.querySelectorAll(`[data-enlace-nav="${enlaceActivo}"]`).forEach(enlace => {
    enlace.classList.add('barra-navegacion__enlace--activo');
    enlace.setAttribute('aria-current', 'page');
  });
}


/* ─────────────────────────────────────────────────────────
   SINCRONIZACIÓN MULTI-PESTAÑA
   Cuando localStorage cambia en otra pestaña,
   el evento 'storage' permite actualizar el estado en esta.
────────────────────────────────────────────────────────── */
window.addEventListener('storage', (evento) => {
  if (evento.key !== CLAVE_ALMACENAMIENTO_CARRITO) return;
  /* Recargar el estado del carrito desde localStorage */
  window.Vanguard.carrito.cargarDesdeAlmacenamiento();
  window.Vanguard.notificaciones.informacion('Carrito actualizado desde otra pestaña');
});
