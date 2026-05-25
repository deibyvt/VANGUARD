# VANGUARD — Hoja de Ruta de Desarrollo
**Actualización:** Sesión 4 | Estado: Fase 6 completada

---

## FASE 1 — Arquitectura ✅ COMPLETADA
- [x] Estructura de carpetas enterprise
- [x] Naming 100% español (variables, IDs, clases, archivos)
- [x] Namespace global `window.Vanguard` con IIFE
- [x] Preparación para dark mode (`data-tema="oscuro"`)
- [x] Sistema de capas Z documentado

## FASE 2 — Sistema Visual ✅ COMPLETADA
- [x] Variables CSS (design tokens) en `sistema-diseno.css`
- [x] Tipografía: Bebas Neue + Barlow Condensed + Barlow
- [x] Paleta extraída exactamente del PDF
- [x] Sistema de espaciado base 8px con `clamp()`
- [x] Escala tipográfica responsiva fluida

## FASE 3 — Componentes ✅ COMPLETADA
- [x] `.barra-navegacion` con menú móvil accesible
- [x] `.pie-pagina` con 4 columnas y redes sociales
- [x] `.boton-primario` con estados hover/active/focus
- [x] `.campo-formulario` (variante oscura y clara)
- [x] `.tarjeta-producto` y `.tarjeta-categoria`
- [x] `.articulo-carrito` con animación de eliminación
- [x] `.capa-modal-producto` con trampa de foco
- [x] `.barra-lateral-categorias` con grupos y estados
- [x] `.buscador-navegacion` con animación de expansión
- [x] Sistema de notificaciones toast

## FASE 4 — Páginas ✅ COMPLETADA
- [x] `index.html` / `home.html` — Hero + categorías
- [x] `login.html` — Moto decorativa + formulario
- [x] `registro.html` — Modelo decorativa + formulario
- [x] `categorias.html` — Grid + sidebar + modal de producto
- [x] `producto.html` — Página completa: galería + variantes
- [x] `carrito.html` — Lista con eliminación animada + total
- [x] `checkout.html` — 3 secciones: productos/dirección/pago

## FASE 5 — JavaScript Base ✅ COMPLETADA
- [x] `vanguard-principal.js` v3.0 con IIFE y módulos aislados
- [x] Carrito con localStorage REAL y funcional
- [x] Sincronización multi-pestaña via `storage` events
- [x] Módulo de notificaciones toast
- [x] Módulo de autenticación (estructura lista para API)
- [x] IntersectionObserver para animaciones escalonadas
- [x] `marcarEnlaceNavActivo()` automático
- [x] Debounce para buscador
- [x] `formatearPrecio()`, `esCorreoValido()` compartidos

## FASE 6 — Integración entre páginas ✅ COMPLETADA
- [x] `categorias.html` → `producto.html` (enlace directo)
- [x] `categorias.html` → `carrito.html` (agregar desde modal)
- [x] `producto.html` → carrito con localStorage real
- [x] `carrito.html` → renderizado dinámico desde localStorage
- [x] Toast de confirmación al agregar al carrito

## FASE 7 — Backend / API ⏳ PENDIENTE
Cuando el equipo de backend esté listo, descomentar hooks en:
- `login.html` → `POST /api/v1/autenticacion/ingresar`
- `registro.html` → `POST /api/v1/autenticacion/registrar`
- `categorias.html` → `GET /api/v1/productos?categoria=...`
- `producto.html` → `GET /api/v1/productos/:id`
- `checkout.html` → `POST /api/v1/pedidos`

Headers requeridos:
```
Authorization: Bearer {token_de_localStorage}
Content-Type: application/json
```

## FASE 8 — Optimización ⏳ PENDIENTE
- [ ] Preload de fuentes críticas en `<head>`
- [ ] `loading="lazy"` ya implementado en imágenes no críticas
- [ ] Service Worker para caché offline
- [ ] Compresión Brotli de assets estáticos
- [ ] Auditoría Lighthouse (objetivo: >90 en todos los scores)

## FASE 9 — Deploy ⏳ PENDIENTE
Opciones recomendadas:
- **Netlify**: arrastrar carpeta del proyecto, listo en 30s
- **Vercel**: `vercel deploy` desde terminal
- **GitHub Pages**: push a rama `gh-pages`

Para producción, cambiar en `vanguard-principal.js`:
```javascript
entorno: 'produccion',
depurar: false,
urlApi:  'https://api.vanguard.com/v1'
```

---

## Convenciones del proyecto

### Naming de IDs
`{seccion}-{elemento}-{modificador}`
Ejemplos: `boton-agregar-carrito-producto`, `campo-correo-sesion`

### Naming de clases CSS
Bloques BEM en español: `.nombre-bloque__elemento--modificador`
Ejemplos: `.articulo-carrito__imagen`, `.barra-navegacion__enlace--activo`

### Naming de atributos data-*
`data-{accion}-{objeto}` o `data-{tipo}-{campo}`
Ejemplos: `data-accion-boton="agregar-carrito"`, `data-campo-validar="correo"`
