'use strict';

const DURACION_NOTIFICACION_MS = 3000;

export const Notificaciones = {
  _contenedor: null,

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

    requestAnimationFrame(() => {
      notificacion.style.opacity   = '1';
      notificacion.style.transform = 'translateY(0) scale(1)';
    });

    setTimeout(() => {
      notificacion.style.opacity   = '0';
      notificacion.style.transform = 'translateY(10px) scale(0.97)';
      setTimeout(() => notificacion.remove(), 220);
    }, duracion);
  },

  exito(mensaje)       { this.mostrar(mensaje, 'exito'); },
  error(mensaje)       { this.mostrar(mensaje, 'error'); },
  informacion(mensaje) { this.mostrar(mensaje, 'informacion'); }
};
