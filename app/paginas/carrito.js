'use strict';

function crearHtmlArticuloCarrito(articulo) {
  return `
    <article
      class="articulo-carrito js-animacion-entrada"
      role="listitem"
      data-id-articulo-carrito="${articulo.idLineaCarrito}"
      aria-label="${articulo.nombre} — ${window.Vanguard.utilidades.formatearPrecio(articulo.precio)}"
    >
      <img
        src="${articulo.imagen && articulo.imagen.startsWith('http') ? articulo.imagen : 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=200&fit=crop'}"
        alt="${articulo.nombre}"
        class="articulo-carrito__imagen"
        loading="lazy"
      />
      <div class="articulo-carrito__informacion">
        <h2 class="articulo-carrito__nombre">${articulo.nombre}</h2>
        <p class="articulo-carrito__meta">Marca: ${articulo.marca || '—'}</p>
        <p class="articulo-carrito__meta">Sku: ${articulo.sku || '—'}</p>
        ${articulo.talla && articulo.talla !== 'unica'
          ? `<p class="articulo-carrito__meta">Talla: ${articulo.talla}</p>`
          : ''}
        ${articulo.cantidad > 1
          ? `<p class="articulo-carrito__meta">Cantidad: ${articulo.cantidad}</p>`
          : ''}
      </div>
      <div class="articulo-carrito__precio-contenedor">
        <p class="articulo-carrito__precio">
          ${window.Vanguard.utilidades.formatearPrecio(articulo.precio * articulo.cantidad)}
        </p>
      </div>
      <button
        class="articulo-carrito__boton-eliminar"
        aria-label="Eliminar ${articulo.nombre} del carrito"
        data-accion-boton="eliminar-articulo"
        data-id-linea-carrito="${articulo.idLineaCarrito}"
      >
        <svg width="13" height="13" fill="none" stroke="currentColor"
             stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </article>
  `;
}

function renderizarTotalCarrito() {
  const total = window.Vanguard.carrito.calcularTotal();
  let bloqueTotal = document.getElementById('bloque-total-carrito');

  if (!bloqueTotal) {
    bloqueTotal = document.createElement('div');
    bloqueTotal.id = 'bloque-total-carrito';
    bloqueTotal.style.cssText = `
      text-align: right;
      margin-top: 0.5rem;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #666;
    `;
    document.getElementById('contenedor-boton-pago')?.prepend(bloqueTotal);
  }

  if (total > 0) {
    const unidades = window.Vanguard.carrito.contarUnidades();
    bloqueTotal.innerHTML = `
      <span>${unidades} ${unidades === 1 ? 'artículo' : 'artículos'} — </span>
      <strong style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#1a1a1a;">
        ${window.Vanguard.utilidades.formatearPrecio(total)}
      </strong>
    `;
  }
}

function verificarCarritoVacio() {
  const articulosEnDOM  = document.querySelectorAll('[data-id-articulo-carrito]');
  const estadoVacio     = document.getElementById('estado-carrito-vacio');
  const botonPago       = document.getElementById('contenedor-boton-pago');
  const listaCarrito    = document.getElementById('lista-articulos-carrito');

  const carritoEstaVacio = articulosEnDOM.length === 0;

  estadoVacio?.classList.toggle('hidden', !carritoEstaVacio);
  botonPago?.classList.toggle('hidden', carritoEstaVacio);
  if (listaCarrito) {
    listaCarrito.style.display = carritoEstaVacio ? 'none' : '';
  }
}

function asignarListenerEliminar(elementoArticulo) {
  const botonEliminar = elementoArticulo.querySelector('[data-accion-boton="eliminar-articulo"]');
  if (!botonEliminar) return;

  botonEliminar.addEventListener('click', () => {
    const idLinea = botonEliminar.dataset.idLineaCarrito;

    elementoArticulo.style.transition = 'opacity 280ms ease, transform 280ms ease';
    elementoArticulo.style.opacity    = '0';
    elementoArticulo.style.transform  = 'translateX(-24px)';

    setTimeout(() => {
      elementoArticulo.remove();
      window.Vanguard.carrito.eliminarPorLineaCarrito(idLinea);
      renderizarTotalCarrito();
      verificarCarritoVacio();
      window.Vanguard.notificaciones.exito('Producto eliminado');
    }, 290);
  });
}

function renderizarCarritoDesdeAlmacenamiento() {
  const articulosGuardados = window.Vanguard.carrito.obtenerArticulos();
  if (articulosGuardados.length === 0) return false;

  const listaCarrito = document.getElementById('lista-articulos-carrito');
  if (!listaCarrito) return false;

  listaCarrito.innerHTML = '';

  articulosGuardados.forEach(articulo => {
    const contenedorTemporal = document.createElement('div');
    contenedorTemporal.innerHTML = crearHtmlArticuloCarrito(articulo).trim();
    const elementoArticulo = contenedorTemporal.firstElementChild;
    listaCarrito.appendChild(elementoArticulo);
    asignarListenerEliminar(elementoArticulo);
  });

  renderizarTotalCarrito();

  requestAnimationFrame(() => {
    listaCarrito.querySelectorAll('.js-animacion-entrada').forEach(el => {
      el.classList.add('js-animacion-entrada--visible');
    });
  });

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarritoDesdeAlmacenamiento();
  verificarCarritoVacio();

  window.addEventListener('vng:carrito-actualizado', () => {
    renderizarCarritoDesdeAlmacenamiento();
    verificarCarritoVacio();
  });

  if (window.Vanguard?.autenticacion?.estaAutenticado()) {
    const navs = document.querySelectorAll('#pie-pagina nav');
    if (navs.length >= 2) {
      navs[1].style.display = 'none';
    }
  }
});
