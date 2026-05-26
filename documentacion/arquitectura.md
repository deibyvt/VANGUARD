# VANGUARD — Arquitectura Frontend Enterprise
**Versión:** 4.0 | **Naming:** 100% español | **Stack:** HTML5 + Tailwind CSS v3 CDN + ES Modules

---

## Árbol de archivos

```
VANGUARD/
│
├── index.html                   ← Entry point → redirige a pages/inicio.html
├── .gitignore
│
├── pages/                       ← 7 páginas HTML (sin CSS/JS inline)
│   ├── inicio.html              ← Hero + categorías
│   ├── login.html               ← Inicio de sesión
│   ├── registro.html            ← Creación de cuenta
│   ├── categorias.html          ← Grid productos + sidebar + modal
│   ├── producto.html            ← Detalle individual de producto
│   ├── carrito.html             ← Carrito de compras
│   └── checkout.html            ← Proceso de pago
│
├── css/                         ← CSS modular por responsabilidad
│   ├── main.css                 ← Entry point (solo @imports)
│   ├── base/
│   │   ├── variables.css        ← Design tokens (colores, fuentes, sombras)
│   │   └── reset.css            ← Normalize / reset
│   ├── components/              ← Componentes reutilizables
│   │   ├── barra-navegacion.css
│   │   ├── pie-pagina.css
│   │   ├── botones.css
│   │   ├── formularios.css
│   │   ├── tarjetas.css
│   │   ├── modal.css
│   │   ├── carrito.css
│   │   └── buscador.css
│   ├── layout/
│   │   └── grid.css
│   └── pages/                   ← Estilos específicos por página
│       ├── inicio.css
│       ├── login.css
│       ├── registro.css
│       ├── categorias.css
│       ├── checkout.css
│       └── producto.css
│
├── app/                         ← JavaScript modular con ES Modules
│   ├── main.js                  ← Entry point (importa módulos, inicia todo)
│   ├── tailwind-config.js       ← Config Tailwind v3 centralizada
│   ├── utils/
│   │   ├── helpers.js           ← formatearPrecio, esCorreoValido, etc.
│   │   └── constantes.js        ← CLAVE_ALMACENAMIENTO_CARRITO, etc.
│   ├── modulos/
│   │   ├── carrito.js           ← Carrito con localStorage real
│   │   ├── autenticacion.js     ← Estructura para API futura
│   │   └── configuracion.js     ← Config por ambiente
│   └── pages/                   ← Scripts específicos por página
│       ├── inicio.js
│       ├── login.js
│       ├── registro.js
│       ├── categorias.js
│       ├── producto.js
│       ├── carrito.js
│       └── checkout.js
│
├── assets/
│   ├── images/                  ← Imágenes del proyecto (11 archivos)
│   └── icons/                   ← SVGs del sistema de iconografía (4 archivos)
│
└── documentacion/
    ├── arquitectura.md          ← Este archivo
    ├── sistema-visual.md        ← Design tokens documentados
    └── hoja-de-ruta.md          ← Fases de desarrollo y estado
```

---

## Arquitectura del JavaScript (`app/`)

### Entry point: `app/main.js` (ES Module)
```javascript
import './modulos/carro.js';
import './modulos/autenticacion.js';
// Inicializa menú móvil, animaciones, navbar
```

Los scripts de página (`app/pages/*.js`) se cargan con `defer` (no module)
y consumen `window.Vanguard` expuesto por `main.js`.

### Flujo de datos del carrito
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
notificaciones.mostrar('¡Producto agregado!')
   → crea toast DOM, anima entrada, auto-elimina a 3s
         ↓
[Si otra pestaña] → evento 'storage' → cargarDesdeAlmacenamiento()
```

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
```

### Variables JavaScript
camelCase en español:
```javascript
✅ const articulosGuardados = ...
✅ let cantidadSeleccionada = 1
✅ function verificarCarritoVacio() {}
```

---

## Carga de scripts en cada página
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="../app/tailwind-config.js"></script>
<link rel="stylesheet" href="../css/main.css" />
...
<script src="../app/main.js" type="module" defer></script>
<script src="../app/pages/{pagina}.js" defer></script>
```

---

## Rutas de integración con backend

| Página            | Endpoint                                  | Método |
|------------------|------------------------------------------|--------|
| `login.html`      | `/api/v1/autenticacion/ingresar`         | POST   |
| `registro.html`   | `/api/v1/autenticacion/registrar`        | POST   |
| `categorias.html` | `/api/v1/productos?categoria=...`        | GET    |
| `producto.html`   | `/api/v1/productos/:id`                  | GET    |
| `carrito.html`    | `/api/v1/carrito`                        | GET    |
| `checkout.html`   | `/api/v1/pedidos`                        | POST   |

Header de autenticación:
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
