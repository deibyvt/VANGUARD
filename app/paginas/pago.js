'use strict';

function crearFilaProductoCheckout(articulo) {
  const precioTotal = articulo.precio * articulo.cantidad;
  return `
    <div class="fila-resumen-producto" data-id-producto-checkout="${articulo.id}">
      <img src="${articulo.imagen || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop'}"
           alt="${articulo.nombre}"
           class="fila-resumen-producto__imagen"
           loading="lazy" />
      <span class="fila-resumen-producto__nombre">
        ${articulo.nombre}${articulo.cantidad > 1 ? ` ×${articulo.cantidad}` : ''}
      </span>
      <span class="fila-resumen-producto__precio">
        $ ${precioTotal.toFixed(2)}
      </span>
    </div>
  `;
}

function renderizarTotalCheckout(total) {
  const contenedor = document.getElementById('bloque-lista-productos-checkout');
  if (!contenedor) return;

  document.getElementById('fila-total-checkout')?.remove();

  if (total <= 0) return;

  const filaTotal = document.createElement('div');
  filaTotal.id = 'fila-total-checkout';
  filaTotal.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0 0;
    margin-top: 0.5rem;
    border-top: 2px solid rgba(227,30,30,0.25);
  `;
  filaTotal.innerHTML = `
    <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;
                 font-size:0.8rem;letter-spacing:.12em;text-transform:uppercase;color:#666;">
      TOTAL DEL PEDIDO
    </span>
    <strong style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:#1a1a1a;">
      $ ${total.toFixed(2)}
    </strong>
  `;
  contenedor.appendChild(filaTotal);
}

function cargarProductosDesdeCarrito() {
  const articulosCarrito = window.Vanguard?.carrito?.obtenerArticulos() || [];
  const contenedor = document.getElementById('bloque-lista-productos-checkout');
  if (!contenedor) return;

  if (articulosCarrito.length === 0) {
    return;
  }

  contenedor.innerHTML = '';
  articulosCarrito.forEach(articulo => {
    contenedor.insertAdjacentHTML('beforeend', crearFilaProductoCheckout(articulo));
  });

  const totalReal = window.Vanguard.carrito.calcularTotal();
  renderizarTotalCheckout(totalReal);
}

const botonesMetodoPago = document.querySelectorAll('[data-metodo-pago]');
const campoMetodoPago   = document.getElementById('campo-metodo-pago-seleccionado');

botonesMetodoPago.forEach(boton => {
  boton.addEventListener('click', () => {
    botonesMetodoPago.forEach(b => {
      b.classList.remove('boton-metodo-pago--seleccionado');
      b.setAttribute('aria-checked', 'false');
    });
    boton.classList.add('boton-metodo-pago--seleccionado');
    boton.setAttribute('aria-checked', 'true');
    if (campoMetodoPago) campoMetodoPago.value = boton.dataset.metodoPago;
    window.Vanguard?.notificaciones?.informacion(
      `Método de pago: ${boton.dataset.metodoPago.toUpperCase()}`
    );
  });
});

function validarFormularioDireccion() {
  const nombreEntrega  = document.getElementById('campo-nombre-entrega')?.value.trim();
  const cedulaEntrega  = document.getElementById('campo-cedula-entrega')?.value.trim();
  const direccionEnvio = document.getElementById('campo-direccion-envio')?.value.trim();
  let formularioValido = true;

  if (!nombreEntrega || nombreEntrega.length < 3) {
    mostrarErrorCampo('error-nombre-entrega', 'El nombre es requerido');
    formularioValido = false;
  } else { ocultarErrorCampo('error-nombre-entrega'); }

  if (!cedulaEntrega || !/^\d{6,12}$/.test(cedulaEntrega)) {
    mostrarErrorCampo('error-cedula-entrega', 'Ingresa un documento válido (6–12 dígitos)');
    formularioValido = false;
  } else { ocultarErrorCampo('error-cedula-entrega'); }

  if (!direccionEnvio || direccionEnvio.length < 5) {
    mostrarErrorCampo('error-direccion-envio', 'La dirección de envío es requerida');
    formularioValido = false;
  } else { ocultarErrorCampo('error-direccion-envio'); }

  return formularioValido;
}

document.getElementById('boton-confirmar-pedido')?.addEventListener('click', async () => {
  if (!validarFormularioDireccion()) return;

  const metodoPagoElegido  = campoMetodoPago?.value || 'pse';
  const nombreDestinatario = document.getElementById('campo-nombre-entrega').value.trim();
  const cedulaDestinatario = document.getElementById('campo-cedula-entrega').value.trim();
  const direccionDespacho  = document.getElementById('campo-direccion-envio').value.trim();
  const articulosPedido    = window.Vanguard?.carrito?.obtenerArticulos() || [];
  const totalPedido        = window.Vanguard?.carrito?.calcularTotal() || 0;

  const cargaUtilPedido = {
    datosEntrega: {
      nombre:    nombreDestinatario,
      cedula:    cedulaDestinatario,
      direccion: direccionDespacho
    },
    metodoPago: metodoPagoElegido,
    articulos:  articulosPedido,
    totalPedido: totalPedido,
    fechaPedido: new Date().toISOString()
  };

  const botonConfirmar = document.getElementById('boton-confirmar-pedido');
  botonConfirmar.textContent = 'PROCESANDO...';
  botonConfirmar.disabled = true;

  try {
    console.log('[VANGUARD] Pedido listo para enviar:', cargaUtilPedido);

    await new Promise(resolucion => setTimeout(resolucion, 600));

    window.Vanguard?.carrito?.vaciar();

    mostrarConfirmacionPedido();

  } catch (errorPedido) {
    console.error('[VANGUARD] Error en pedido:', errorPedido);
    window.Vanguard?.notificaciones?.error('Error al procesar el pedido. Intenta de nuevo.');
    botonConfirmar.textContent = 'CONFIRMAR PEDIDO';
    botonConfirmar.disabled = false;
  }
});

function mostrarConfirmacionPedido() {
  document.getElementById('contenedor-boton-confirmar-pedido')?.classList.add('hidden');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion-pedido');
  if (mensajeConfirmacion) {
    mensajeConfirmacion.classList.remove('hidden');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarErrorCampo(idElemento, mensaje) {
  const el = document.getElementById(idElemento);
  if (!el) return;
  el.textContent = mensaje;
  el.classList.add('mensaje-error-campo--visible');
}

function ocultarErrorCampo(idElemento) {
  const el = document.getElementById(idElemento);
  if (!el) return;
  el.textContent = '';
  el.classList.remove('mensaje-error-campo--visible');
}

document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDesdeCarrito();
});
