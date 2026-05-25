# VANGUARD — Arquitectura Frontend Enterprise
**Versión:** 3.0 | **Naming:** 100% español | **Stack:** HTML5 + Tailwind CSS CDN

---

## Árbol de archivos

```
proyecto-vanguard/
│
├── index.html              ← Home (página principal)
├── home.html               ← Alias semántico → redirige a index.html
├── login.html              ← Inicio de sesión
├── registro.html           ← Creación de cuenta
├── categorias.html         ← Listado productos + sidebar + modal
├── producto.html           ← Detalle individual de producto
├── carrito.html            ← Carrito de compras
├── checkout.html           ← Proceso de pago
│
├── assets/
│   ├── css/
│   │   └── sistema-diseno.css    ← Tokens + componentes CSS enterprise
│   ├── js/
│   │   └── vanguard-principal.js ← Namespace + módulos + localStorage
│   ├── img/                      ← Imágenes locales del proyecto
│   ├── iconos/                   ← SVGs del sistema de iconografía
│   └── fuentes/                  ← Fuentes locales (si se descargan)
│
└── documentacion/
    ├── arquitectura.md     ← Este archivo
    ├── sistema-visual.md   ← Design tokens documentados
    └── hoja-de-ruta.md     ← Fases de desarrollo y estado
```

---

## Arquitectura del JavaScript (`vanguard-principal.js`)

El archivo usa el patrón **IIFE + módulos internos**:

```javascript
window.Vanguard = (function crearNamespaceVanguard() {
  const moduloCarrito        = { ... }  // localStorage real
  const moduloAutenticacion  = { ... }  // preparado para API
  const moduloNotificaciones = { ... }  // sistema toast
  const moduloUtilidades     = { ... }  // funciones compartidas
  const moduloConfiguracion  = { ... }  // config por ambiente
  return { carrito, autenticacion, notificaciones, utilidades, config }
})();
```

**Ventaja:** cada módulo está completamente aislado. Para integrar la API
real, solo se modifica `moduloCarrito.persistirEnAlmacenamiento()` y
`moduloCarrito.cargarDesdeAlmacenamiento()` — el resto de la app no cambia.

---

## Convenciones de naming

### IDs de elementos HTML
Patrón: `{seccion}-{elemento}-{modificador}`
```
✅ boton-agregar-carrito-producto
✅ campo-correo-sesion
✅ lista-articulos-carrito
✅ contenedor-modal-producto
❌ addCartBtn
❌ emailInput
❌ cartList
```

### Clases CSS (BEM en español)
```
.nombre-bloque
.nombre-bloque__elemento
.nombre-bloque--modificador
.nombre-bloque__elemento--modificador

✅ .articulo-carrito__imagen
✅ .barra-navegacion__enlace--activo
✅ .tarjeta-producto__etiqueta
❌ .product-card__label
❌ .navbar-link-active
```

### Atributos `data-*`
Patrón: `data-{accion}-{objeto}` o `data-{campo}`
```
✅ data-accion-boton="agregar-carrito"
✅ data-campo-validar="correo"
✅ data-id-producto="prod-001"
✅ data-enlace-nav="inicio"
❌ data-action="addCart"
❌ data-validate="email"
```

### Variables JavaScript
Patrón: camelCase en español
```javascript
✅ const articulosGuardados = ...
✅ let cantidadSeleccionada = 1
✅ function verificarCarritoVacio() {}
❌ const savedItems = ...
❌ let selectedQty = 1
```

---

## Flujo de datos del carrito

```
Usuario hace clic en "Agregar al carrito"
         ↓
window.Vanguard.carrito.agregar(datosArticulo)
         ↓
moduloCarrito._articulos.push(datosArticulo)
         ↓
persistirEnAlmacenamiento()
   → localStorage.setItem('vng_carrito_v3', JSON.stringify(...))
         ↓
sincronizarContadorNavbar()
   → actualiza badge visual en navbar
         ↓
moduloNotificaciones.exito('¡Producto agregado!')
   → crea toast DOM, anima entrada, auto-elimina a 3s
         ↓
[Si otra pestaña] → evento 'storage' → cargarDesdeAlmacenamiento()
```

---

## Rutas de integración con backend

Cuando el backend esté disponible, descomentar hooks en:

| Página          | Endpoint                                  | Método |
|----------------|------------------------------------------|--------|
| `login.html`    | `/api/v1/autenticacion/ingresar`         | POST   |
| `registro.html` | `/api/v1/autenticacion/registrar`        | POST   |
| `categorias.html`| `/api/v1/productos?categoria=...`       | GET    |
| `producto.html` | `/api/v1/productos/:id`                  | GET    |
| `carrito.html`  | `/api/v1/carrito`                        | GET    |
| `checkout.html` | `/api/v1/pedidos`                        | POST   |

Header de autenticación requerido:
```
Authorization: Bearer {localStorage.getItem('vng_token')}
```

---

## Responsive: breakpoints usados

| Breakpoint | Valor  | Comportamiento clave                            |
|-----------|-------|------------------------------------------------|
| Mobile    | <640px | 1 col, menú hamburguesa, imágenes decorativas ocultas |
| sm        | 640px  | 2 col para grillas de categorías               |
| md        | 768px  | Navbar desktop visible                         |
| lg        | 1024px | Barra lateral categorías visible, layout 2 col |

Estrategia mobile-first: estilos base = mobile, expand con `md:`, `lg:`.
