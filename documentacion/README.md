# VANGUARD

**Mantente a la vanguardia** — Plataforma de comercio electrónico multicategoría.

## Estado del proyecto

Proyecto en etapa de estructuración. Arquitectura completa con HTML, CSS y JS separados y organizados por responsabilidad.

## Tecnologías

- HTML5 semántico en `paginas/`
- CSS3 modular con sistema de diseño basado en tokens (`estilos/`)
- Tailwind CSS v3 vía CDN + config centralizada en `app/tailwind-config.js`
- Google Fonts (Bebas Neue, Barlow Condensed, Barlow)
- JavaScript vanilla modular con ES Modules (`app/`)

## Estructura

```
VANGUARD
├── paginas/                 # Páginas HTML
│   ├── index.html           # Entry point → redirige a inicio.html
│   ├── home.html            # Alias semántico → redirige a index.html
│   ├── inicio.html
│   ├── login.html
│   ├── registro.html
│   ├── categorias.html
│   ├── producto.html
│   ├── carrito.html
│   └── pago.html
│
├── estilos/                 # CSS modular
│   ├── main.css             # Entry point con @imports
│   ├── base/                # variables.css, reinicio.css
│   ├── components/          # barra-navegacion, pie-pagina, botones…
│   ├── layout/              # grid.css
│   └── paginas/             # inicio.css, login.css, pago.css…
│
├── app/                     # JavaScript modular
│   ├── main.js              # Entry point ES Module
│   ├── tailwind-config.js   # Config Tailwind centralizada
│   ├── utilidades/          # helpers.js, notificaciones.js
│   ├── modulos/             # carrito.js, autenticacion.js
│   └── paginas/             # inicio.js, pago.js…
│
├── recursos/
│   ├── imagenes/
│   └── iconos/
│
└── documentacion/
    ├── README.md
    ├── arquitectura.md
    ├── sistema-visual.md
    └── hoja-de-ruta.md
```

## Páginas

| Archivo           | Descripción                          |
|------------------|--------------------------------------|
| `inicio.html`     | Hero + categorías + animaciones      |
| `login.html`      | Inicio de sesión con formulario      |
| `registro.html`   | Creación de cuenta                   |
| `categorias.html` | Grid productos + sidebar + modal     |
| `producto.html`   | Detalle con galería y variantes      |
| `carrito.html`    | Lista de artículos + total           |
| `pago.html`       | Dirección + método de pago           |

## Categorías

- Moda Hombre
- Moda Mujer
- Accesorios y Tecnología
- Cuidado Personal y Belleza
- Vehículos y Deporte

## Créditos

Desarrollado por [deibyvt](https://github.com/deibyvt).
