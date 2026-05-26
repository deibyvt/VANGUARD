'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ── Galería de imágenes ──
  const imagenPrincipal = document.getElementById('imagen-principal-producto');

  document.querySelectorAll('.miniatura-galeria').forEach(miniatura => {
    miniatura.addEventListener('click', () => {
      const urlNuevaImagen = miniatura.dataset.urlImagen;
      const altNuevaImagen = miniatura.dataset.altImagen;

      imagenPrincipal.classList.add('js-cambiando');

      setTimeout(() => {
        imagenPrincipal.src = urlNuevaImagen;
        imagenPrincipal.alt = altNuevaImagen;
        imagenPrincipal.classList.remove('js-cambiando');
      }, 200);

      document.querySelectorAll('.miniatura-galeria').forEach(m => {
        m.classList.remove('miniatura-galeria--activa');
        m.setAttribute('aria-pressed', 'false');
      });
      miniatura.classList.add('miniatura-galeria--activa');
      miniatura.setAttribute('aria-pressed', 'true');
    });
  });

  // ── Selector de talla ──
  let tallaSeleccionada = 'S';
  document.querySelectorAll('[data-talla]').forEach(botonTalla => {
    botonTalla.addEventListener('click', () => {
      tallaSeleccionada = botonTalla.dataset.talla;

      document.querySelectorAll('[data-talla]').forEach(b => {
        b.classList.remove('border-vng-rojo', 'text-vng-rojo', 'bg-red-50');
        b.classList.add('border-gray-200', 'text-gray-500', 'bg-white');
        b.setAttribute('aria-checked', 'false');
      });
      botonTalla.classList.add('border-vng-rojo', 'text-vng-rojo', 'bg-red-50');
      botonTalla.classList.remove('border-gray-200', 'text-gray-500', 'bg-white');
      botonTalla.setAttribute('aria-checked', 'true');
    });
  });

  // ── Contador de cantidad ──
  let cantidadSeleccionada = 1;
  const contadorCantidad   = document.getElementById('contador-cantidad-producto');
  const stockMaximo        = 90;

  document.getElementById('boton-disminuir-cantidad')?.addEventListener('click', () => {
    if (cantidadSeleccionada > 1) {
      cantidadSeleccionada--;
      contadorCantidad.textContent = cantidadSeleccionada;
    }
  });

  document.getElementById('boton-aumentar-cantidad')?.addEventListener('click', () => {
    if (cantidadSeleccionada < stockMaximo) {
      cantidadSeleccionada++;
      contadorCantidad.textContent = cantidadSeleccionada;
    }
  });

  // ── Agregar al carrito con localStorage real ──
  document.getElementById('boton-agregar-carrito-producto')?.addEventListener('click', () => {
    const tallaElegida    = tallaSeleccionada;
    const cantidadElegida = cantidadSeleccionada;

    const datosArticulo = {
      id:       document.getElementById('boton-agregar-carrito-producto').dataset.idProducto,
      nombre:   document.getElementById('nombre-producto-principal')?.textContent?.trim()
                  || 'GIGABYTE AORUS MEN TSHIRT',
      precio:   parseFloat(
                  document.getElementById('precio-producto-principal')
                            ?.textContent?.replace(/[^0-9.]/g, '') || '24.99'
                ),
      imagen:   document.getElementById('imagen-principal-producto')?.src || '',
      talla:    tallaElegida,
      cantidad: cantidadElegida,
      marca:    'Gigabyte',
      sku:      'MEN-GIG-GIG-084'
    };

    window.Vanguard.carrito.agregar(datosArticulo);

    window.Vanguard.notificaciones.exito(
      `¡${cantidadElegida > 1 ? cantidadElegida + 'x ' : ''}${datosArticulo.nombre} agregado!`
    );

    const mensajeAgregado = document.getElementById('mensaje-agregado-carrito');
    mensajeAgregado.classList.remove('hidden');
    setTimeout(() => mensajeAgregado.classList.add('hidden'), 2500);
  });

  // ── Navegación desde barra lateral ──
  document.querySelectorAll('.barra-lateral-categorias__enlace').forEach(boton => {
    boton.addEventListener('click', () => {
      const parametros = new URLSearchParams({
        categoria:    boton.dataset.categoria,
        subcategoria: boton.dataset.subcategoria
      });
      window.location.href = `categorias.html?${parametros.toString()}`;
    });
  });
});
