'use strict';

var CLAVE_ADMIN_PRODUCTOS = 'vng_admin_productos';

export const AdminProductos = {
  _datos: { editados: {}, eliminados: [], creados: [] },

  cargar() {
    try {
      var datos = localStorage.getItem(CLAVE_ADMIN_PRODUCTOS);
      if (datos) {
        var parsed = JSON.parse(datos);
        this._datos.editados = parsed.editados || {};
        this._datos.eliminados = parsed.eliminados || [];
        this._datos.creados = parsed.creados || [];
      }
    } catch (_e) {
      this._datos = { editados: {}, eliminados: [], creados: [] };
    }
  },

  _persistir() {
    try {
      localStorage.setItem(CLAVE_ADMIN_PRODUCTOS, JSON.stringify(this._datos));
    } catch (_e) {}
  },

  aplicarModificaciones(productos) {
    var filtrados = [];
    for (var i = 0; i < productos.length; i++) {
      if (this._datos.eliminados.indexOf(String(productos[i].id)) === -1) {
        filtrados.push(productos[i]);
      }
    }
    var resultado = [];
    for (var j = 0; j < filtrados.length; j++) {
      var p = filtrados[j];
      var editado = this._datos.editados[String(p.id)];
      if (editado) {
        var copia = {};
        for (var key in p) copia[key] = p[key];
        for (var ekey in editado) copia[ekey] = editado[ekey];
        resultado.push(copia);
      } else {
        resultado.push(p);
      }
    }
    for (var k = 0; k < this._datos.creados.length; k++) {
      resultado.push(this._datos.creados[k]);
    }
    return resultado;
  },

  eliminarProducto(idProducto) {
    var idStr = String(idProducto);
    if (this._datos.eliminados.indexOf(idStr) === -1) {
      this._datos.eliminados.push(idStr);
      this._persistir();
    }
  },

  editarProducto(idProducto, datosEditados) {
    this._datos.editados[String(idProducto)] = datosEditados;
    this._persistir();
  },

  crearProducto(datosProducto) {
    var nuevoId = 'admin_' + Date.now();
    var producto = {
      id: nuevoId,
      title: datosProducto.title || '',
      description: datosProducto.description || '',
      price: Number(datosProducto.price) || 0,
      brand: datosProducto.brand || '',
      category: datosProducto.category || '',
      thumbnail: datosProducto.thumbnail || 'https://via.placeholder.com/300',
      images: datosProducto.images || [datosProducto.thumbnail || 'https://via.placeholder.com/300'],
      stock: Number(datosProducto.stock) || 0,
      sku: datosProducto.sku || ''
    };
    producto.id = nuevoId;
    this._datos.creados.push(producto);
    this._persistir();
    return producto;
  }
};
