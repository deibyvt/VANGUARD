# VANGUARD

**Mantente a la vanguardia** — Plataforma de comercio electrónico multicategoría.

## Estado del proyecto

Proyecto en etapa de estructuración. Arquitectura completa con HTML, CSS y JS separados y organizados por responsabilidad.

## Tecnologías

- HTML5 semántico en `pages/`
- CSS3 modular con sistema de diseño basado en tokens (`css/`)
- Tailwind CSS v3 vía CDN + config centralizada en `app/tailwind-config.js`
- Google Fonts (Bebas Neue, Barlow Condensed, Barlow)
- JavaScript vanilla modular con ES Modules (`app/`)

## Estructura

```
VANGUARD
├── index.html               # Entry point → redirige a pages/inicio.html
├── .gitignore
│
├── pages/                   # 7 páginas HTML (sin CSS/JS inline)
│   ├── inicio.html
│   ├── login.html
│   ├── registro.html
│   ├── categorias.html
│   ├── producto.html
│   ├── carrito.html
│   └── checkout.html
│
├── css/                     # CSS modular
│   ├── main.css             # Entry point con @imports
│   ├── base/                # variables.css, reset.css
│   ├── components/          # barra-navegacion, pie-pagina, botones…
│   ├── layout/              # grid.css
│   └── pages/               # inicio.css, login.css, checkout.css…
│
├── app/                     # JavaScript modular
│   ├── main.js              # Entry point ES Module
│   ├── tailwind-config.js   # Config Tailwind centralizada
│   ├── utils/               # helpers.js, constantes.js
│   ├── modulos/             # carrito.js, autenticacion.js
│   └── pages/               # inicio.js, checkout.js…
│
├── assets/
│   ├── images/
│   └── icons/
│
└── documentacion/
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
| `checkout.html`   | Dirección + método de pago           |

## Categorías

- Moda Hombre
- Moda Mujer
- Accesorios y Tecnología
- Cuidado Personal y Belleza
- Vehículos y Deporte

## Créditos

Desarrollado por [deibyvt](https://github.com/deibyvt).
