'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ── Modal de producto ──
  const capaModalProducto       = document.getElementById('capa-modal-producto');
  const botonCerrarModalProducto = document.getElementById('boton-cerrar-modal-producto');

  document.querySelectorAll('[data-abrir-modal-producto="true"]').forEach(tarjeta => {
    tarjeta.addEventListener('click',  () => abrirModalProducto(tarjeta.dataset.idProducto));
    tarjeta.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        abrirModalProducto(tarjeta.dataset.idProducto);
      }
    });
  });

  function abrirModalProducto() {
    capaModalProducto.classList.add('capa-modal-producto--activo');
    document.body.style.overflow = 'hidden';
    botonCerrarModalProducto.focus();
  }

  function cerrarModalProducto() {
    capaModalProducto.classList.remove('capa-modal-producto--activo');
    document.body.style.overflow = '';
  }

  botonCerrarModalProducto?.addEventListener('click', cerrarModalProducto);
  capaModalProducto?.addEventListener('click', (evento) => {
    if (evento.target === capaModalProducto) cerrarModalProducto();
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarModalProducto();
  });

  // ── Filtrado por subcategoría ──
  document.querySelectorAll('.barra-lateral-categorias__enlace').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.barra-lateral-categorias__enlace')
              .forEach(b => {
                b.classList.remove('barra-lateral-categorias__enlace--activo');
                b.removeAttribute('aria-pressed');
              });
      boton.classList.add('barra-lateral-categorias__enlace--activo');
      boton.setAttribute('aria-pressed', 'true');

      const nombreSubcategoria = boton.textContent.trim();
      document.getElementById('etiqueta-subcategoria-activa').textContent = nombreSubcategoria;

      const parametrosConsulta = {
        categoria:    boton.dataset.categoria,
        subcategoria: boton.dataset.subcategoria
      };
      console.log('[VANGUARD] Filtrar productos:', parametrosConsulta);
    });
  });

  // ── Buscador con debounce ──
  const campoBuscarProductos = document.getElementById('campo-buscar-productos');
  let temporizadorBusqueda;
  campoBuscarProductos?.addEventListener('input', () => {
    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(() => {
      const textoBusqueda = campoBuscarProductos.value.trim();
      if (textoBusqueda.length < 2) return;
      console.log('[VANGUARD] Búsqueda:', textoBusqueda);
    }, 350);
  });

  // ── Agregar al carrito desde el modal ──
  document.getElementById('boton-agregar-al-carrito')?.addEventListener('click', () => {
    const botonCarrito = document.getElementById('boton-agregar-al-carrito');

    const datosArticulo = {
      id:       botonCarrito.dataset.idProductoModal || 'prod-001',
      nombre:   document.getElementById('modal-nombre-producto')?.textContent?.trim()
                  || 'GIGABYTE AORUS MEN TSHIRT',
      precio:   parseFloat(
                  document.getElementById('modal-precio-producto')
                            ?.textContent?.replace(/[^0-9.]/g, '') || '24.99'
                ),
      imagen:   document.getElementById('modal-imagen-producto')?.src || '',
      talla:    'unica',
      cantidad: 1,
      marca:    'Gigabyte',
      sku:      'MEN-GIG-GIG-084'
    };

    window.Vanguard.carrito.agregar(datosArticulo);
    window.Vanguard.notificaciones.exito('¡Producto agregado al carrito!');
    cerrarModalProducto();
  });
});
