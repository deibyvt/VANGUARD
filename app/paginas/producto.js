'use strict';

var URL_API_DUMMYJSON = 'https://dummyjson.com';
var productoActual = null;

var CATEGORIAS_CON_TALLA = {
  tops: true,
  'womens-dresses': true,
  'womens-shoes': true,
  'mens-shirts': true,
  'mens-shoes': true
};

document.addEventListener('DOMContentLoaded', async function () {
  var params = new URLSearchParams(window.location.search);
  var productId = params.get('id');

  if (productId) {
    try {
      var resp = await fetch(URL_API_DUMMYJSON + '/products/' + productId);
      if (resp.ok) {
        productoActual = await resp.json();
        poblarPaginaProducto(productoActual);
      } else {
        console.warn('[VANGUARD] Producto no encontrado, usando demo');
      }
    } catch (e) {
      console.warn('[VANGUARD] Error al cargar producto:', e);
    }
  }

  configurarGaleria();
  configurarSelectorTalla();
  configurarContadorCantidad();
  configurarBotonAgregarCarrito();
  configurarSidebar();
});

function poblarPaginaProducto(producto) {
  var imagenPrincipal = document.getElementById('imagen-principal-producto');
  if (imagenPrincipal) {
    imagenPrincipal.src = producto.images && producto.images.length > 0
      ? producto.images[0]
      : producto.thumbnail;
    imagenPrincipal.alt = producto.title;
  }

  var contenedorMiniaturas = document.getElementById('galeria-miniaturas-producto');
  if (contenedorMiniaturas && producto.images && producto.images.length > 0) {
    contenedorMiniaturas.innerHTML = '';
    for (var i = 0; i < producto.images.length; i++) {
      (function (url, idx) {
        var btn = document.createElement('button');
        btn.className = 'miniatura-galeria' + (idx === 0 ? ' miniatura-galeria--activa' : '');
        btn.role = 'listitem';
        btn.setAttribute('aria-label', 'Ver imagen ' + (idx + 1) + ' del producto');
        btn.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
        btn.dataset.urlImagen = url;
        btn.dataset.altImagen = producto.title + ' — vista ' + (idx + 1);

        var img = document.createElement('img');
        img.src = url;
        img.alt = 'Miniatura ' + (idx + 1);
        img.loading = 'lazy';
        btn.appendChild(img);

        btn.addEventListener('click', function () {
          document.getElementById('imagen-principal-producto').src = url;
          document.getElementById('imagen-principal-producto').alt = producto.title;
          document.querySelectorAll('.miniatura-galeria').forEach(function (m) {
            m.classList.remove('miniatura-galeria--activa');
            m.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('miniatura-galeria--activa');
          btn.setAttribute('aria-pressed', 'true');
        });

        contenedorMiniaturas.appendChild(btn);
      })(producto.images[i], i);
    }
  }

  var nombreEl = document.getElementById('nombre-producto-principal');
  if (nombreEl) nombreEl.textContent = producto.title;

  var descEl = document.getElementById('descripcion-producto-principal');
  if (descEl) descEl.textContent = producto.description;

  var marcaEl = document.getElementById('metadatos-producto');
  if (marcaEl) {
    var marcaP = marcaEl.querySelector('[data-campo-producto="marca"]');
    if (marcaP) marcaP.innerHTML = '<span class="font-semibold text-gray-600">Marca:</span> ' + (producto.brand || 'No especificada');
    var skuP = marcaEl.querySelector('[data-campo-producto="sku"]');
    if (skuP) skuP.innerHTML = '<span class="font-semibold text-gray-600">Sku:</span> ' + (producto.sku || 'N/A');
  }

  var breadcrumbActual = document.querySelector('.miga-de-pan__actual');
  if (breadcrumbActual) breadcrumbActual.textContent = producto.title.toLowerCase();

  var stockEl = document.getElementById('indicador-stock-producto');
  if (stockEl) stockEl.textContent = producto.stock > 0 ? 'STOCK ' + producto.stock : 'AGOTADO';

  var precioEl = document.getElementById('precio-producto-principal');
  if (precioEl) precioEl.textContent = '$ ' + producto.price.toFixed(2);

  var btnCarrito = document.getElementById('boton-agregar-carrito-producto');
  if (btnCarrito) btnCarrito.dataset.idProducto = producto.id;

  var ficha = document.getElementById('ficha-producto-principal');
  if (ficha) ficha.dataset.idProducto = 'prod-' + producto.id;

  var selectorTalla = document.getElementById('selector-talla-producto');
  if (selectorTalla) {
    if (CATEGORIAS_CON_TALLA[producto.category]) {
      selectorTalla.classList.remove('hidden');
    } else {
      selectorTalla.classList.add('hidden');
    }
  }

  var stockMaximo = producto.stock || 90;
  var contador = document.getElementById('contador-cantidad-producto');
  if (contador) {
    contador.textContent = '1';
  }
}

function configurarGaleria() {
  document.querySelectorAll('.miniatura-galeria').forEach(function (miniatura) {
    miniatura.addEventListener('click', function () {
      var urlNueva = miniatura.dataset.urlImagen;
      var altNueva = miniatura.dataset.altImagen;
      var imgPrincipal = document.getElementById('imagen-principal-producto');
      if (!imgPrincipal) return;
      imgPrincipal.classList.add('js-cambiando');
      setTimeout(function () {
        imgPrincipal.src = urlNueva;
        imgPrincipal.alt = altNueva;
        imgPrincipal.classList.remove('js-cambiando');
      }, 200);
      document.querySelectorAll('.miniatura-galeria').forEach(function (m) {
        m.classList.remove('miniatura-galeria--activa');
        m.setAttribute('aria-pressed', 'false');
      });
      miniatura.classList.add('miniatura-galeria--activa');
      miniatura.setAttribute('aria-pressed', 'true');
    });
  });
}

function configurarSelectorTalla() {
  var tallaSeleccionada = 'S';
  document.querySelectorAll('[data-talla]').forEach(function (botonTalla) {
    botonTalla.addEventListener('click', function () {
      tallaSeleccionada = botonTalla.dataset.talla;
      document.querySelectorAll('[data-talla]').forEach(function (b) {
        b.classList.remove('border-vng-rojo', 'text-vng-rojo', 'bg-red-50');
        b.classList.add('border-gray-200', 'text-gray-500', 'bg-white');
        b.setAttribute('aria-checked', 'false');
      });
      botonTalla.classList.add('border-vng-rojo', 'text-vng-rojo', 'bg-red-50');
      botonTalla.classList.remove('border-gray-200', 'text-gray-500', 'bg-white');
      botonTalla.setAttribute('aria-checked', 'true');
    });
  });
}

function configurarContadorCantidad() {
  var cantidad = 1;
  var contador = document.getElementById('contador-cantidad-producto');
  var stockMaximo = productoActual ? productoActual.stock : 90;
  document.getElementById('boton-disminuir-cantidad')?.addEventListener('click', function () {
    if (cantidad > 1) { cantidad--; contador.textContent = cantidad; }
  });
  document.getElementById('boton-aumentar-cantidad')?.addEventListener('click', function () {
    if (cantidad < stockMaximo) { cantidad++; contador.textContent = cantidad; }
  });
}

function configurarBotonAgregarCarrito() {
  document.getElementById('boton-agregar-carrito-producto')?.addEventListener('click', function () {
    var talla = 'S';
    document.querySelectorAll('[data-talla]').forEach(function (b) {
      if (b.getAttribute('aria-checked') === 'true') talla = b.dataset.talla;
    });
    var cantidad = parseInt(document.getElementById('contador-cantidad-producto')?.textContent || '1');
    var btn = document.getElementById('boton-agregar-carrito-producto');
    var datosArticulo = {
      id:       btn.dataset.idProducto || 'unknown',
      nombre:   (document.getElementById('nombre-producto-principal')?.textContent || 'Producto').trim(),
      precio:   parseFloat((document.getElementById('precio-producto-principal')?.textContent || '$0').replace(/[^0-9.]/g, '') || '0'),
      imagen:   document.getElementById('imagen-principal-producto')?.src || '',
      talla:    talla,
      cantidad: cantidad,
      marca:    productoActual ? (productoActual.brand || '') : '',
      sku:      productoActual ? (productoActual.sku || '') : ''
    };
    if (!window.Vanguard || !window.Vanguard.carrito) {
      alert('Carrito no disponible');
      return;
    }
    window.Vanguard.carrito.agregar(datosArticulo);
    window.Vanguard.notificaciones.exito(
      (cantidad > 1 ? cantidad + 'x ' : '') + datosArticulo.nombre + ' agregado al carrito'
    );
    var mensaje = document.getElementById('mensaje-agregado-carrito');
    if (mensaje) {
      mensaje.classList.remove('hidden');
      setTimeout(function () { mensaje.classList.add('hidden'); }, 2500);
    }
  });
}

function configurarSidebar() {
  document.querySelectorAll('.barra-lateral-categorias__enlace').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var params = new URLSearchParams({
        categoria: boton.dataset.categoria,
        subcategoria: boton.dataset.subcategoria
      });
      window.location.href = 'categorias.html?' + params.toString();
    });
  });
}
