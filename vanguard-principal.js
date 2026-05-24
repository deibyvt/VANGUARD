/**
 * VANGUARD — Script Principal Compartido
 * Versión: 2.0 | Naming: 100% español
 *
 * Este archivo se carga en TODAS las páginas mediante <script defer>.
 * Contiene: toggle menú, namespace global, observer de animaciones.
 * Preparado para: integración API, autenticación, carrito con localStorage.
 */

'use strict';

/* ──────────────────────────────────────────
   NAMESPACE GLOBAL VANGUARD
   Centraliza estado, config e instancias
   Para acceder desde cualquier módulo: window.Vanguard.*
────────────────────────────────────────── */
window.Vanguard = window.Vanguard || {

  /* Estado del carrito */
  carrito: {
    articulos:    [],
    totalPrecio:  0,

    contarArticulos() {
      return this.articulos.length;
    },

    /* HOOK: Agregar artículo — integrar con localStorage + API */
    agregar(idProducto, datosProducto) {
      // localStorage.setItem('vng_carrito', JSON.stringify(this.articulos));
      console.log('[VANGUARD] carrito.agregar →', idProducto, datosProducto);
    },

    /* HOOK: Eliminar artículo */
    eliminar(idProducto) {
      this.articulos = this.articulos.filter(a => a.id !== idProducto);
      // localStorage.setItem('vng_carrito', JSON.stringify(this.articulos));
    },

    /* HOOK: Cargar desde localStorage */
    cargarDesdeAlmacenamiento() {
      // const datos = localStorage.getItem('vng_carrito');
      // if (datos) this.articulos = JSON.parse(datos);
    },

    /* HOOK: Calcular total */
    recalcularTotal() {
      this.totalPrecio = this.articulos.reduce(
        (acumulador, articulo) => acumulador + (articulo.precio * articulo.cantidad), 0
      );
      return this.totalPrecio;
    }
  },

  /* Estado del usuario autenticado */
  usuario: {
    autenticado:  false,
    datosUsuario: null,

    /* HOOK: Iniciar sesión — POST /api/v1/autenticacion/ingresar */
    async iniciarSesion(correo, contrasena) {
      // const respuesta = await fetch(`${window.Vanguard.config.urlApi}/autenticacion/ingresar`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ correo, contrasena })
      // });
      // const datos = await respuesta.json();
      // if (datos.exito) { this.autenticado = true; this.datosUsuario = datos.usuario; }
    },

    /* HOOK: Registrar usuario — POST /api/v1/autenticacion/registrar */
    async registrar(nombre, correo, contrasena) {
      // const respuesta = await fetch(`${window.Vanguard.config.urlApi}/autenticacion/registrar`, ...);
    },

    /* HOOK: Cerrar sesión */
    cerrarSesion() {
      this.autenticado = false;
      this.datosUsuario = null;
      // localStorage.removeItem('vng_usuario');
    }
  },

  /* Configuración global */
  config: {
    urlApi:      '/api/v1',
    versionApp:  '2.0.0',
    moneda:      'USD',
    simboloMoneda: '$'
  }
};

/* ──────────────────────────────────────────
   INICIALIZACIÓN GLOBAL
   Se ejecuta cuando el DOM está listo
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Toggle menú móvil — funciona en todas las páginas */
  inicializarMenuMovil();

  /* Animaciones de entrada por scroll */
  inicializarAnimacionesEntrada();

  /* Cargar estado del carrito desde almacenamiento */
  window.Vanguard.carrito.cargarDesdeAlmacenamiento();
});

/* ──────────────────────────────────────────
   FUNCIÓN: inicializarMenuMovil
   Maneja el estado del menú hamburguesa
────────────────────────────────────────── */
function inicializarMenuMovil() {
  const botonMenuMovil = document.getElementById('boton-menu-movil');
  const menuMovil      = document.getElementById('menu-movil');

  if (!botonMenuMovil || !menuMovil) return;

  botonMenuMovil.addEventListener('click', () => {
    const estaAbierto = menuMovil.classList.toggle('menu-movil--abierto');
    botonMenuMovil.setAttribute('aria-expanded', String(estaAbierto));
  });

  /* Cerrar menú al hacer click fuera */
  document.addEventListener('click', (evento) => {
    const fueraDelMenu = !botonMenuMovil.contains(evento.target) &&
                         !menuMovil.contains(evento.target);
    if (fueraDelMenu && menuMovil.classList.contains('menu-movil--abierto')) {
      menuMovil.classList.remove('menu-movil--abierto');
      botonMenuMovil.setAttribute('aria-expanded', 'false');
    }
  });

  /* Cerrar con Escape */
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menuMovil.classList.contains('menu-movil--abierto')) {
      menuMovil.classList.remove('menu-movil--abierto');
      botonMenuMovil.setAttribute('aria-expanded', 'false');
      botonMenuMovil.focus();
    }
  });
}

/* ──────────────────────────────────────────
   FUNCIÓN: inicializarAnimacionesEntrada
   IntersectionObserver para animaciones CSS
────────────────────────────────────────── */
function inicializarAnimacionesEntrada() {
  const observadorEntrada = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, indice) => {
        if (entrada.isIntersecting) {
          /* Retardo escalonado para efecto en cascada */
          setTimeout(() => {
            entrada.target.classList.add('js-animacion-entrada--visible');
          }, indice * 80);
          observadorEntrada.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.js-animacion-entrada').forEach(elemento => {
    observadorEntrada.observe(elemento);
  });
}

/* ──────────────────────────────────────────
   FUNCIÓN: formatearPrecio
   Centraliza el formato de moneda
────────────────────────────────────────── */
function formatearPrecio(valor, moneda = 'USD') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2
  }).format(valor);
}

/* ──────────────────────────────────────────
   FUNCIÓN: mostrarMensajeError / ocultarMensajeError
   Reutilizable en todos los formularios
────────────────────────────────────────── */
function mostrarMensajeError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.classList.add('mensaje-error-campo--visible');
  }
}

function ocultarMensajeError(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = '';
    elemento.classList.remove('mensaje-error-campo--visible');
  }
}

/* ──────────────────────────────────────────
   FUNCIÓN: validarCampoCorreo
   Reutilizable en login y registro
────────────────────────────────────────── */
function validarCampoCorreo(valorCorreo) {
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresionRegular.test(valorCorreo);
}

/* Exportar funciones al namespace global para uso en páginas individuales */
window.Vanguard.utilidades = {
  formatearPrecio,
  mostrarMensajeError,
  ocultarMensajeError,
  validarCampoCorreo
};
