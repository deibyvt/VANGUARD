'use strict';

var CLAVE_BASE_CARRITO = 'vng_carrito_v3';

export const Carrito = {
  _articulos: [],

  _obtenerClaveAlmacenamiento() {
    const usuario = window.Vanguard?.autenticacion?.obtenerDatosUsuario();
    const sufijo = usuario?.correo
      ? '_' + btoa(usuario.correo).replace(/[=/+]/g, function (c) { return { '=': '', '+': '-', '/': '_' }[c]; })
      : '_anonimo';
    return CLAVE_BASE_CARRITO + sufijo;
  },

  cargarDesdeAlmacenamiento() {
    try {
      const clave = this._obtenerClaveAlmacenamiento();
      const datosGuardados = localStorage.getItem(clave);
      if (datosGuardados) {
        const articulosParseados = JSON.parse(datosGuardados);
        if (Array.isArray(articulosParseados)) {
          this._articulos = articulosParseados;
        }
      } else {
        this._articulos = [];
      }
    } catch (errorAlmacenamiento) {
      console.warn('[VANGUARD] Carrito: datos corruptos en localStorage, reseteando.', errorAlmacenamiento);
      this._articulos = [];
      this.persistirEnAlmacenamiento();
    }
    this.sincronizarContadorNavbar();
  },

  persistirEnAlmacenamiento() {
    try {
      const clave = this._obtenerClaveAlmacenamiento();
      localStorage.setItem(
        clave,
        JSON.stringify(this._articulos)
      );
      window.dispatchEvent(new CustomEvent('vng:carrito-actualizado', {
        detail: { articulos: this._articulos, total: this.calcularTotal() }
      }));
    } catch (errorAlmacenamiento) {
      console.error('[VANGUARD] Carrito: error al guardar en localStorage.', errorAlmacenamiento);
    }
  },

  agregar(datosArticulo) {
    const claveUnica = `${datosArticulo.id}_${datosArticulo.talla || 'unica'}`;

    const articuloExistente = this._articulos.find(
      articulo => `${articulo.id}_${articulo.talla || 'unica'}` === claveUnica
    );

    if (articuloExistente) {
      articuloExistente.cantidad += (datosArticulo.cantidad || 1);
    } else {
      this._articulos.push({
        ...datosArticulo,
        idLineaCarrito: `linea_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        cantidad:        datosArticulo.cantidad || 1,
        fechaAgregado:   new Date().toISOString()
      });
    }

    this.persistirEnAlmacenamiento();
    this.sincronizarContadorNavbar();
  },

  eliminarPorLineaCarrito(idLineaCarrito) {
    const cantidadAntes = this._articulos.length;
    this._articulos = this._articulos.filter(
      articulo => articulo.idLineaCarrito !== idLineaCarrito
    );
    if (this._articulos.length !== cantidadAntes) {
      this.persistirEnAlmacenamiento();
      this.sincronizarContadorNavbar();
    }
  },

  vaciar() {
    this._articulos = [];
    this.persistirEnAlmacenamiento();
    this.sincronizarContadorNavbar();
  },

  calcularTotal() {
    return this._articulos.reduce(
      (acumulador, articulo) => acumulador + (articulo.precio * articulo.cantidad),
      0
    );
  },

  contarArticulos() {
    return this._articulos.length;
  },

  contarUnidades() {
    return this._articulos.reduce(
      (acumulador, articulo) => acumulador + articulo.cantidad,
      0
    );
  },

  obtenerArticulos() {
    return [...this._articulos];
  },

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

      if (textoAnterior !== textoNuevo) {
        contadorNavbar.classList.remove('contador-carrito-navbar--pulsando');
        void contadorNavbar.offsetWidth;
        contadorNavbar.classList.add('contador-carrito-navbar--pulsando');
        setTimeout(() => {
          contadorNavbar.classList.remove('contador-carrito-navbar--pulsando');
        }, 420);
      }
    } else {
      contadorNavbar.classList.add('js-oculto');
      contadorNavbar.setAttribute('aria-label', '0 artículos en el carrito');
    }
  },

  formatearTotal() {
    return `$ ${this.calcularTotal().toFixed(2)}`;
  }
};
