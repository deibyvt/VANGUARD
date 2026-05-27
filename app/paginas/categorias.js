'use strict';

(function () {
  var URL_API_DUMMYJSON = 'https://dummyjson.com';

  var GRUPOS_CATEGORIAS = [
    {
      id: 'moda-hombre',
      nombre: 'MODA HOMBRE',
      imagen: '../recursos/imagenes/moda hombre.png',
      subcategorias: [
        { id: 'camisas-hombre',  nombre: 'CAMISAS DE HOMBRE',  slugApi: 'mens-shirts' },
        { id: 'zapatos-hombre',  nombre: 'ZAPATOS DE HOMBRE',  slugApi: 'mens-shoes' },
        { id: 'relojes-hombre',  nombre: 'RELOJES DE HOMBRE',  slugApi: 'mens-watches' }
      ]
    },
    {
      id: 'moda-mujer',
      nombre: 'MODA MUJER',
      imagen: '../recursos/imagenes/moda mujer.png',
      subcategorias: [
        { id: 'bolsos-mujer',    nombre: 'BOLSOS DE MUJER',          slugApi: 'womens-bags' },
        { id: 'vestidos-mujer',  nombre: 'VESTIDOS DE MUJER',       slugApi: 'womens-dresses' },
        { id: 'joyeria-mujer',   nombre: 'JOYERÍA DE MUJER',        slugApi: 'womens-jewellery' },
        { id: 'zapatos-mujer',   nombre: 'ZAPATOS DE MUJER',        slugApi: 'womens-shoes' },
        { id: 'relojes-mujer',   nombre: 'RELOJES DE MUJER',        slugApi: 'womens-watches' },
        { id: 'blusas-mujer',    nombre: 'PRENDAS SUPERIORES/BLUSAS', slugApi: 'tops' }
      ]
    },
    {
      id: 'accesorios-tecnologia',
      nombre: 'ACCESORIOS Y TECNOLOGÍA',
      imagen: '../recursos/imagenes/accesorios y tecnologia.png',
      subcategorias: [
        { id: 'portatiles',          nombre: 'PORTÁTILES',                slugApi: 'laptops' },
        { id: 'accesorios-celular',  nombre: 'ACCESORIOS PARA CELULARES', slugApi: 'mobile-accessories' },
        { id: 'celulares',           nombre: 'CELULARES',                 slugApi: 'smartphones' },
        { id: 'tablets',             nombre: 'TABLETS',                   slugApi: 'tablets' }
      ]
    },
    {
      id: 'vehiculos-deporte',
      nombre: 'VEHICULOS Y DEPORTE',
      imagen: '../recursos/imagenes/deportes y vehiculos.png',
      subcategorias: [
        { id: 'motocicletas',         nombre: 'MOTOCICLETAS',           slugApi: 'motorcycle' },
        { id: 'vehiculos-automoviles', nombre: 'VEHÍCULOS/AUTOMÓVILES', slugApi: 'vehicle' },
        { id: 'accesorios-deportivos', nombre: 'ACCESORIOS DEPORTIVOS', slugApi: 'sports-accessories' }
      ]
    }
  ];

  var productosCargados = [];
  var grupoActivo = null;

  function cargarDatosAdminLocal() {
    try {
      var datos = localStorage.getItem('vng_admin_productos');
      if (datos) return JSON.parse(datos);
    } catch (_e) {}
    return { editados: {}, eliminados: [], creados: [] };
  }

  function aplicarModificacionesAdmin(productos, datosAdmin, slugApi) {
    var filtrados = [];
    for (var i = 0; i < productos.length; i++) {
      if (datosAdmin.eliminados.indexOf(String(productos[i].id)) === -1) {
        filtrados.push(productos[i]);
      }
    }
    var resultado = [];
    for (var j = 0; j < filtrados.length; j++) {
      var p = filtrados[j];
      var editado = datosAdmin.editados[String(p.id)];
      if (editado) {
        var copia = {};
        for (var key in p) copia[key] = p[key];
        for (var ekey in editado) copia[ekey] = editado[ekey];
        resultado.push(copia);
      } else {
        resultado.push(p);
      }
    }
    for (var k = 0; k < datosAdmin.creados.length; k++) {
      if (!slugApi || datosAdmin.creados[k].category === slugApi) {
        resultado.push(datosAdmin.creados[k]);
      }
    }
    return resultado;
  }


  function renderizarGruposCategorias() {
    var grilla = document.getElementById('grilla-tarjetas-producto');
    var nomCategoria = document.getElementById('nombre-categoria-activa');
    var subEtiqueta = document.getElementById('etiqueta-subcategoria-activa');

    if (!grilla) {
      grillaError('No se encontró #grilla-tarjetas-producto');
      return;
    }

    grilla.innerHTML = '';
    if (nomCategoria) nomCategoria.textContent = 'TODAS LAS CATEGORÍAS';
    if (subEtiqueta) subEtiqueta.textContent = '';

    for (var g = 0; g < GRUPOS_CATEGORIAS.length; g++) {
      var grupo = GRUPOS_CATEGORIAS[g];
      var tarjeta = document.createElement('article');
      tarjeta.className = 'tarjeta-categoria js-animacion-entrada';
      tarjeta.setAttribute('data-grupo-id', grupo.id);
      tarjeta.setAttribute('tabindex', '0');
      tarjeta.setAttribute('role', 'button');
      tarjeta.setAttribute('aria-label', 'Ver ' + grupo.nombre);

      var imgDiv = document.createElement('div');
      imgDiv.className = 'tarjeta-categoria__imagen-contenedor';
      var img = document.createElement('img');
      img.src = grupo.imagen;
      img.alt = grupo.nombre;
      img.className = 'tarjeta-categoria__imagen';
      img.loading = 'lazy';
      imgDiv.appendChild(img);
      tarjeta.appendChild(imgDiv);

      var nombreP = document.createElement('p');
      nombreP.className = 'tarjeta-categoria__nombre';
      nombreP.textContent = grupo.nombre;
      tarjeta.appendChild(nombreP);

      (function (id) {
        tarjeta.addEventListener('click', function () { seleccionarGrupo(id); });
        tarjeta.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            seleccionarGrupo(id);
          }
        });
      })(grupo.id);

      grilla.appendChild(tarjeta);
    }
  }

  function grillaError(msg) {
    var grilla = document.getElementById('grilla-tarjetas-producto');
    if (grilla) grilla.innerHTML = '<p class="text-red-400 col-span-full text-center py-12">' + msg + '</p>';
  }

  async function seleccionarGrupo(idGrupo) {
    var grupo = null;
    for (var g = 0; g < GRUPOS_CATEGORIAS.length; g++) {
      if (GRUPOS_CATEGORIAS[g].id === idGrupo) { grupo = GRUPOS_CATEGORIAS[g]; break; }
    }
    if (!grupo) return;

    grupoActivo = grupo;
    var nomCat = document.getElementById('nombre-categoria-activa');
    if (nomCat) nomCat.textContent = grupo.nombre;

    if (grupo.subcategorias.length > 0) {
      await seleccionarSubcategoria(grupo.subcategorias[0]);
    }
  }

  async function seleccionarSubcategoria(subcategoria) {
    var enlaces = document.querySelectorAll('.barra-lateral-categorias__enlace');
    for (var e = 0; e < enlaces.length; e++) {
      var b = enlaces[e];
      if (b.dataset.subcategoria === subcategoria.id) {
        b.classList.add('barra-lateral-categorias__enlace--activo');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('barra-lateral-categorias__enlace--activo');
        b.removeAttribute('aria-pressed');
      }
    }

    var subEtq = document.getElementById('etiqueta-subcategoria-activa');
    if (subEtq) subEtq.textContent = subcategoria.nombre;

    var grilla = document.getElementById('grilla-tarjetas-producto');
    grilla.innerHTML = '<p class="text-white/60 col-span-full text-center py-12">Cargando productos...</p>';

    try {
      var respuesta = await fetch(URL_API_DUMMYJSON + '/products/category/' + subcategoria.slugApi);
      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
      var datos = await respuesta.json();
      productosCargados = datos.products;
      var datosAdmin = cargarDatosAdminLocal();
      var productosAdmin = aplicarModificacionesAdmin(datos.products, datosAdmin, subcategoria.slugApi);
      var esAdmin = window.Vanguard && window.Vanguard.autenticacion && window.Vanguard.autenticacion.esAdmin();
      renderizarProductos(productosAdmin,
        grupoActivo ? grupoActivo.nombre : subcategoria.nombre,
        esAdmin
      );
    } catch (error) {
      grilla.innerHTML = '<p class="text-red-400 col-span-full text-center py-12">ERROR: ' + error.message + '</p>';
    }
  }

  function renderizarProductos(productos, nombreGrupo, esAdmin) {
    var grilla = document.getElementById('grilla-tarjetas-producto');
    grilla.innerHTML = '';

    if (!productos || productos.length === 0) {
      grilla.innerHTML = '<p class="text-white/60 col-span-full text-center py-12">No hay productos en esta categoría.</p>';
      return;
    }

    for (var i = 0; i < productos.length; i++) {
      var producto = productos[i];
      var tarjeta = document.createElement('article');
      tarjeta.className = 'tarjeta-producto js-animacion-entrada js-animacion-entrada--visible';
      tarjeta.setAttribute('role', 'listitem');
      tarjeta.dataset.idProducto = producto.id;
      tarjeta.setAttribute('tabindex', '0');
      tarjeta.setAttribute('aria-label', 'Ver ' + producto.title + ' — $' + producto.price);

      var imgDiv = document.createElement('div');
      imgDiv.className = 'tarjeta-producto__imagen-contenedor';
      var img = document.createElement('img');
      img.src = producto.thumbnail;
      img.alt = producto.title;
      img.className = 'tarjeta-producto__imagen';
      img.loading = 'lazy';
      imgDiv.appendChild(img);
      tarjeta.appendChild(imgDiv);

      var infoDiv = document.createElement('div');
      infoDiv.className = 'p-3';
      var tituloP = document.createElement('p');
      tituloP.className = 'text-sm font-medium text-black truncate';
      tituloP.textContent = producto.title;
      var precioP = document.createElement('p');
      precioP.className = 'font-condensada text-base font-bold text-black mt-1';
      precioP.textContent = '$ ' + producto.price.toFixed(2);
      infoDiv.appendChild(tituloP);
      infoDiv.appendChild(precioP);
      tarjeta.appendChild(infoDiv);

      var etiqueta = document.createElement('p');
      etiqueta.className = 'tarjeta-producto__etiqueta';
      etiqueta.textContent = nombreGrupo;
      tarjeta.appendChild(etiqueta);

      if (esAdmin) {
        var acciones = document.createElement('div');
        acciones.className = 'flex gap-2 px-3 pb-3 pt-1';
        var btnEditar = document.createElement('button');
        btnEditar.className = 'flex-1 text-xs font-condensada tracking-widest py-1.5 rounded-lg border border-vng-rojo text-vng-rojo hover:bg-vng-rojo hover:text-white transition-all';
        btnEditar.textContent = 'EDITAR';
        var btnEliminar = document.createElement('button');
        btnEliminar.className = 'flex-1 text-xs font-condensada tracking-widest py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all';
        btnEliminar.textContent = 'ELIMINAR';
        (function (p) {
          btnEditar.addEventListener('click', function (e) { e.stopPropagation(); abrirModalEditarProducto(p); });
          btnEliminar.addEventListener('click', function (e) { e.stopPropagation(); eliminarProductoAdmin(p); });
        })(producto);
        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);
        tarjeta.appendChild(acciones);
      }

      (function (p) {
        tarjeta.addEventListener('click', function () { abrirModalProducto(p, esAdmin); });
        tarjeta.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            abrirModalProducto(p, esAdmin);
          }
        });
      })(producto);

      grilla.appendChild(tarjeta);
    }
  }

  function abrirModalProducto(producto, esAdmin) {
    esAdmin = esAdmin || (window.Vanguard && window.Vanguard.autenticacion && window.Vanguard.autenticacion.esAdmin());
    document.getElementById('modal-imagen-producto').src = producto.images && producto.images.length > 0 ? producto.images[0] : producto.thumbnail;
    document.getElementById('modal-imagen-producto').alt = producto.title;
    document.getElementById('modal-nombre-producto').textContent = producto.title;
    document.getElementById('modal-descripcion-producto').textContent = producto.description;
    document.getElementById('modal-marca-producto').textContent = 'Marca: ' + (producto.brand || 'No especificada');
    document.getElementById('modal-sku-producto').textContent = 'SKU: ' + (producto.sku || 'N/A');
    document.getElementById('modal-etiqueta-disponibles').textContent = producto.stock > 0 ? 'STOCK ' + producto.stock : 'AGOTADO';
    document.getElementById('modal-precio-producto').textContent = '$ ' + producto.price.toFixed(2);
    document.getElementById('boton-agregar-al-carrito').dataset.idProductoModal = producto.id;
    var detalleLink = document.getElementById('enlace-ver-detalle-producto');
    if (detalleLink) detalleLink.href = 'producto.html?id=' + producto.id;
    if (esAdmin) {
      document.getElementById('boton-agregar-al-carrito').style.display = 'none';
      if (detalleLink) detalleLink.style.display = 'none';
    } else {
      document.getElementById('boton-agregar-al-carrito').style.display = '';
      if (detalleLink) detalleLink.style.display = '';
    }
    document.getElementById('capa-modal-producto').classList.add('capa-modal-producto--activo');
    document.body.style.overflow = 'hidden';
    document.getElementById('boton-cerrar-modal-producto').focus();
  }

  function cerrarModalProducto() {
    document.getElementById('capa-modal-producto').classList.remove('capa-modal-producto--activo');
    document.body.style.overflow = '';
  }

  // ─── Admin CRUD ──────────────────────────────────

  function eliminarProductoAdmin(producto) {
    if (!confirm('¿Eliminar "' + producto.title + '"?')) return;
    if (window.Vanguard && window.Vanguard.adminProductos) {
      window.Vanguard.adminProductos.eliminarProducto(producto.id);
    } else {
      var datosAd = cargarDatosAdminLocal();
      if (datosAd.eliminados.indexOf(String(producto.id)) === -1) {
        datosAd.eliminados.push(String(producto.id));
        localStorage.setItem('vng_admin_productos', JSON.stringify(datosAd));
      }
    }
    window.Vanguard.notificaciones.exito('Producto eliminado con éxito');
    recargarProductos();
  }

  function abrirModalEditarProducto(producto) {
    document.getElementById('admin-modal-titulo').textContent = 'EDITAR PRODUCTO';
    document.getElementById('admin-producto-id').value = producto.id;
    document.getElementById('admin-campo-titulo').value = producto.title || '';
    document.getElementById('admin-campo-descripcion').value = producto.description || '';
    document.getElementById('admin-campo-precio').value = producto.price || 0;
    document.getElementById('admin-campo-stock').value = producto.stock || 0;
    document.getElementById('admin-campo-marca').value = producto.brand || '';
    document.getElementById('admin-campo-sku').value = producto.sku || '';
    document.getElementById('admin-campo-thumbnail').value = producto.thumbnail || '';
    document.getElementById('admin-campo-categoria').value = producto.category || '';
    document.getElementById('capa-modal-admin-producto').classList.add('capa-modal-producto--activo');
    document.body.style.overflow = 'hidden';
  }

  function abrirModalAgregarProducto() {
    document.getElementById('admin-modal-titulo').textContent = 'AGREGAR PRODUCTO';
    document.getElementById('admin-producto-id').value = '';
    document.getElementById('admin-campo-titulo').value = '';
    document.getElementById('admin-campo-descripcion').value = '';
    document.getElementById('admin-campo-precio').value = '';
    document.getElementById('admin-campo-stock').value = '';
    document.getElementById('admin-campo-marca').value = '';
    document.getElementById('admin-campo-sku').value = '';
    document.getElementById('admin-campo-thumbnail').value = '';
    document.getElementById('admin-campo-categoria').value = '';
    document.getElementById('capa-modal-admin-producto').classList.add('capa-modal-producto--activo');
    document.body.style.overflow = 'hidden';
  }

  function guardarProductoAdmin(evento) {
    evento.preventDefault();
    var idProducto = document.getElementById('admin-producto-id').value;
    var datosForm = {
      title: document.getElementById('admin-campo-titulo').value.trim(),
      description: document.getElementById('admin-campo-descripcion').value.trim(),
      price: parseFloat(document.getElementById('admin-campo-precio').value) || 0,
      stock: parseInt(document.getElementById('admin-campo-stock').value) || 0,
      brand: document.getElementById('admin-campo-marca').value.trim(),
      sku: document.getElementById('admin-campo-sku').value.trim(),
      thumbnail: document.getElementById('admin-campo-thumbnail').value.trim() || 'https://via.placeholder.com/300',
      category: document.getElementById('admin-campo-categoria').value.trim()
    };

    if (idProducto) {
      if (window.Vanguard && window.Vanguard.adminProductos) {
        window.Vanguard.adminProductos.editarProducto(idProducto, datosForm);
      } else {
        var datosAd = cargarDatosAdminLocal();
        datosAd.editados[String(idProducto)] = datosForm;
        localStorage.setItem('vng_admin_productos', JSON.stringify(datosAd));
      }
      window.Vanguard.notificaciones.exito('Producto modificado con éxito');
    } else {
      if (window.Vanguard && window.Vanguard.adminProductos) {
        window.Vanguard.adminProductos.crearProducto(datosForm);
      } else {
        var datosAd2 = cargarDatosAdminLocal();
        var nuevoId = 'admin_' + Date.now();
        datosForm.id = nuevoId;
        datosForm.images = [datosForm.thumbnail];
        datosAd2.creados.push(datosForm);
        localStorage.setItem('vng_admin_productos', JSON.stringify(datosAd2));
      }
      window.Vanguard.notificaciones.exito('Producto creado con éxito');
    }

    cerrarModalAdminProducto();
    recargarProductos();
  }

  function cerrarModalAdminProducto() {
    document.getElementById('capa-modal-admin-producto').classList.remove('capa-modal-producto--activo');
    document.body.style.overflow = '';
  }

  function recargarProductos() {
    var esAdmin = window.Vanguard && window.Vanguard.autenticacion && window.Vanguard.autenticacion.esAdmin();
    if (grupoActivo && grupoActivo.subcategorias.length > 0) {
      seleccionarSubcategoria(grupoActivo.subcategorias[0]);
    } else {
      var grilla = document.getElementById('grilla-tarjetas-producto');
      if (grilla) grilla.innerHTML = '<p class="text-white/60 col-span-full text-center py-12">Selecciona una categoría</p>';
    }
  }

  function configurarModal(capaModal, botonCerrar) {
    if (botonCerrar) botonCerrar.addEventListener('click', cerrarModalProducto);
    if (capaModal) capaModal.addEventListener('click', function (evento) {
      if (evento.target === capaModal) cerrarModalProducto();
    });
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') cerrarModalProducto();
    });
  }

  function configurarSidebar() {
    var enlaces = document.querySelectorAll('.barra-lateral-categorias__enlace');
    for (var e = 0; e < enlaces.length; e++) {
      (function (boton) {
        boton.addEventListener('click', function () {
          var idSub = boton.dataset.subcategoria;
          var grupo = null;
          for (var g = 0; g < GRUPOS_CATEGORIAS.length; g++) {
            var subs = GRUPOS_CATEGORIAS[g].subcategorias;
            for (var s = 0; s < subs.length; s++) {
              if (subs[s].id === idSub) { grupo = GRUPOS_CATEGORIAS[g]; break; }
            }
            if (grupo) break;
          }
          if (!grupo) return;
          var sub = null;
          for (var s = 0; s < grupo.subcategorias.length; s++) {
            if (grupo.subcategorias[s].id === idSub) { sub = grupo.subcategorias[s]; break; }
          }
          if (!sub) return;
          grupoActivo = grupo;
          var nc = document.getElementById('nombre-categoria-activa');
          if (nc) nc.textContent = grupo.nombre;
          seleccionarSubcategoria(sub);
        });
      })(enlaces[e]);
    }
  }

  function configurarBuscador(campo) {
    if (!campo) return;
    var temporizador = null;
    campo.addEventListener('input', function () {
      if (temporizador) clearTimeout(temporizador);
      temporizador = setTimeout(async function () {
        var texto = campo.value.trim();
        if (texto.length < 2) return;
        try {
          var respuesta = await fetch(URL_API_DUMMYJSON + '/products/search?q=' + encodeURIComponent(texto));
          if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
          var datos = await respuesta.json();
          productosCargados = datos.products;
          var datosAdmin = cargarDatosAdminLocal();
          var productosAdmin = aplicarModificacionesAdmin(datos.products, datosAdmin);
          var nc = document.getElementById('nombre-categoria-activa');
          if (nc) nc.textContent = 'B\u00daSQUEDA: "' + texto + '"';
          document.getElementById('etiqueta-subcategoria-activa').textContent = productosAdmin.length + ' resultados';
          var esAdmin = window.Vanguard && window.Vanguard.autenticacion && window.Vanguard.autenticacion.esAdmin();
          renderizarProductos(productosAdmin, 'RESULTADOS', esAdmin);
        } catch (error) {
          grillaError('Error en b\u00fasqueda: ' + error.message);
        }
      }, 350);
    });
  }

  function agregarProductoAlCarrito() {
    var boton = document.getElementById('boton-agregar-al-carrito');
    var idProducto = parseInt(boton.dataset.idProductoModal);
    var producto = null;
    for (var p = 0; p < productosCargados.length; p++) {
      if (productosCargados[p].id === idProducto) { producto = productosCargados[p]; break; }
    }
    if (!producto) return;
    if (!window.Vanguard || !window.Vanguard.carrito) {
      alert('Vanguard.carrito no disponible');
      return;
    }
    window.Vanguard.carrito.agregar({
      id: producto.id,
      nombre: producto.title,
      precio: producto.price,
      imagen: producto.thumbnail,
      talla: 'unica',
      cantidad: 1,
      marca: producto.brand || '',
      sku: producto.sku || ''
    });
    window.Vanguard.notificaciones.exito('Producto agregado al carrito');
    cerrarModalProducto();
  }


  // ─── Manejar parámetros de URL ──────────────────

  function manejarParametrosUrl() {
    var params = new URLSearchParams(window.location.search);
    var idCategoria = params.get('categoria');
    var idSubcategoria = params.get('subcategoria');
    if (!idCategoria || !idSubcategoria) return false;

    for (var g = 0; g < GRUPOS_CATEGORIAS.length; g++) {
      var grupo = GRUPOS_CATEGORIAS[g];
      if (grupo.id === idCategoria) {
        for (var s = 0; s < grupo.subcategorias.length; s++) {
          var sub = grupo.subcategorias[s];
          if (sub.id === idSubcategoria) {
            grupoActivo = grupo;
            var nc = document.getElementById('nombre-categoria-activa');
            if (nc) nc.textContent = grupo.nombre;
            seleccionarSubcategoria(sub);
            return true;
          }
        }
      }
    }
    return false;
  }

  // ─── Admin inicialización ───────────────────────

  function inicializarAdmin() {
    var esAdmin = window.Vanguard && window.Vanguard.autenticacion && window.Vanguard.autenticacion.esAdmin();
    var btnAgregar = document.getElementById('boton-agregar-producto-admin');
    if (btnAgregar) {
      btnAgregar.style.display = esAdmin ? '' : 'none';
      if (esAdmin) btnAgregar.addEventListener('click', abrirModalAgregarProducto);
    }
    // Poblar el select de categorías
    var selectCat = document.getElementById('admin-campo-categoria');
    if (selectCat) {
      selectCat.innerHTML = '<option value="">Seleccionar categoría</option>';
      for (var g = 0; g < GRUPOS_CATEGORIAS.length; g++) {
        var grupo = GRUPOS_CATEGORIAS[g];
        for (var s = 0; s < grupo.subcategorias.length; s++) {
          var sub = grupo.subcategorias[s];
          var opt = document.createElement('option');
          opt.value = sub.slugApi;
          opt.textContent = grupo.nombre + ' — ' + sub.nombre;
          selectCat.appendChild(opt);
        }
      }
    }
    if (esAdmin) {
      var adminModal = document.getElementById('capa-modal-admin-producto');
      var adminCerrar = document.getElementById('boton-cerrar-modal-admin');
      var cancelarBtn = document.getElementById('boton-cancelar-admin-modal');
      var formulario = document.getElementById('formulario-admin-producto');

      if (adminCerrar) adminCerrar.addEventListener('click', cerrarModalAdminProducto);
      if (cancelarBtn) cancelarBtn.addEventListener('click', cerrarModalAdminProducto);
      if (adminModal) adminModal.addEventListener('click', function (ev) {
        if (ev.target === adminModal) cerrarModalAdminProducto();
      });
      if (formulario) formulario.addEventListener('submit', guardarProductoAdmin);
    }
  }

  // ─── Iniciar ────────────────────────────────────

  if (!manejarParametrosUrl()) {
    renderizarGruposCategorias();
  }

  configurarModal(
    document.getElementById('capa-modal-producto'),
    document.getElementById('boton-cerrar-modal-producto')
  );
  configurarSidebar();
  configurarBuscador(document.getElementById('campo-buscar-productos'));

  var btnCarrito = document.getElementById('boton-agregar-al-carrito');
  if (btnCarrito) btnCarrito.addEventListener('click', agregarProductoAlCarrito);

  // Inicializar admin después de un tick para asegurar que window.Vanguard esté listo
  if (document.readyState === 'complete') {
    inicializarAdmin();
  } else {
    window.addEventListener('load', inicializarAdmin);
  }

})();
