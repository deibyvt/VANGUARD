'use strict';

const CLAVE_ALMACENAMIENTO_USUARIO = 'vng_usuario_v2';

export const Autenticacion = {
  _autenticado:  false,
  _datosUsuario: null,
  _tokenSesion:  null,

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
    document.getElementById('boton-cerrar-sesion')
            ?.addEventListener('click', () => this.cerrarSesion());
  },

  _actualizarNavbarDesautenticado() {
    window.location.reload();
  }
};
