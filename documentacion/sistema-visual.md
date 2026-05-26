# VANGUARD — Sistema Visual Completo (Design Tokens)
**Versión:** 3.0 | Archivo fuente: `estilos/base/variables.css`

---

## Paleta de colores
| Token CSS                      | Valor HEX  | Tailwind config    | Uso principal                    |
|-------------------------------|-----------|-------------------|----------------------------------|
| `--color-negro-principal`      | `#1a1a1a` | `vng-negro`       | Navbar, textos, fondo héroe      |
| `--color-negro-secundario`     | `#2d2d2d` | `vng-negro-2`     | Menú móvil, íconos redes         |
| `--color-negro-hero`           | `#2a2a2a` | —                 | Fondo área productos             |
| `--color-gris-claro`           | `#e8e8e8` | `vng-gris`        | Bordes suaves                    |
| `--color-gris-medio`           | `#d0d0d0` | —                 | Inputs checkout                  |
| `--color-gris-fondo`           | `#ececec` | `vng-gris-fondo`  | Fondo carrito y checkout         |
| `--color-gris-sidebar`         | `#c8c8c8` | `vng-gris-barra`  | Fondo barra lateral categorías   |
| `--color-rojo-principal`       | `#e31e1e` | `vng-rojo`        | CTAs, bordes activos, footer     |
| `--color-rojo-oscuro`          | `#c41818` | `vng-rojo-oscuro` | Hover del rojo principal         |
| `--color-blanco`               | `#ffffff` | —                 | Fondos de tarjetas               |
| `--color-blanco-tarjeta`       | `#f8f8f8` | —                 | Fondo tarjetas producto          |

---

## Sistema tipográfico
| Token CSS             | Familia          | Peso    | Uso                              |
|----------------------|-----------------|---------|----------------------------------|
| `--fuente-display`    | Bebas Neue      | 400     | Títulos gigantes, logos VNGRD    |
| `--fuente-condensada` | Barlow Condensed| 600-800 | Etiquetas, nav, botones, precios |
| `--fuente-cuerpo`     | Barlow          | 400-600 | Párrafos, descripciones, meta    |

### Escala tipográfica responsiva (mobile → desktop)
Usa `clamp(min, preferido, max)` para fluidez sin breakpoints artificiales:

| Token                  | Mínimo   | Preferido | Máximo    | Uso                  |
|-----------------------|---------|----------|----------|----------------------|
| `--texto-gigante`      | `4rem`  | `15vw`   | `12rem`  | Título VANGUARD héroe |
| `--texto-heroe`        | `3rem`  | `10vw`   | `8rem`   | REGISTRATE, INICIAR  |
| `--texto-seccion`      | `2rem`  | `6vw`    | `4rem`   | ELIGE, MODA HOMBRE   |
| `--texto-titulo`       | `1.2rem`| `3vw`    | `1.8rem` | Nombres de producto  |
| `--texto-cuerpo`       | `0.9rem`| —        | —        | Descripciones        |

---

## Sistema de espaciado (base 8px)
| Token                | Valor     | Píxeles equivalentes |
|---------------------|----------|---------------------|
| `--espacio-xs`       | `0.5rem` | 8px                 |
| `--espacio-sm`       | `1rem`   | 16px                |
| `--espacio-md`       | `1.5rem` | 24px                |
| `--espacio-lg`       | `2rem`   | 32px                |
| `--espacio-xl`       | `3rem`   | 48px                |
| `--espacio-2xl`      | `4rem`   | 64px                |
| `--espacio-3xl`      | `6rem`   | 96px                |

---

## Radios de borde
| Token           | Valor    | Ejemplo de uso                    |
|----------------|---------|----------------------------------|
| `--radio-sm`    | `8px`   | Inputs, chips                    |
| `--radio-md`    | `16px`  | Tarjetas de producto             |
| `--radio-lg`    | `24px`  | Tarjetas de categoría            |
| `--radio-xl`    | `32px`  | Artículos del carrito            |
| `--radio-total` | `9999px`| Botones, badges, indicadores     |

---

## Sistema de capas Z-index
| Token                  | Valor | Elemento                          |
|-----------------------|-------|----------------------------------|
| `--capa-fondo`         | 0     | Blobs decorativos, fondos         |
| `--capa-contenido`     | 10    | Contenido en flujo normal         |
| `--capa-flotante`      | 50    | Imágenes flotantes (moto, modelo) |
| `--capa-superpuesto`   | 100   | Overlays ligeros                  |
| `--capa-modal`         | 200   | Modales de producto               |
| `--capa-navegacion`    | 300   | Barra de navegación sticky        |
| `--capa-tooltip`       | 400   | Tooltips y notificaciones toast   |

---

## Sombras definidas
```css
--sombra-tarjeta:       0 4px 20px rgba(0,0,0,0.08)
--sombra-tarjeta-hover: 0 8px 32px rgba(0,0,0,0.15)
--sombra-modal:         0 20px 60px rgba(0,0,0,0.30)
--sombra-boton-rojo:    0 4px 16px rgba(227,30,30,0.40)
--sombra-tarjeta-roja:  0 6px 24px rgba(227,30,30,0.12)
```

---

## Transiciones
```css
--transicion-rapida: 150ms ease   /* hover states inmediatos */
--transicion-normal: 250ms ease   /* transiciones estándar   */
--transicion-suave:  400ms ease   /* cambios de layout/posición */
```

---

## Config Tailwind v3 centralizada

Archivo: `app/tailwind-config.js`

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'vng-negro':       '#1a1a1a',
        'vng-negro-2':     '#2d2d2d',
        'vng-rojo':        '#e31e1e',
        'vng-rojo-oscuro': '#c41818',
        'vng-gris-fondo':  '#ececec',
        'vng-gris':        '#e8e8e8',
        'vng-gris-barra':  '#c8c8c8',
      },
      fontFamily: {
        'display':    ['Bebas Neue',       'Arial Black',  'sans-serif'],
        'condensada': ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
        'cuerpo':     ['Barlow',           'Arial',        'sans-serif'],
      },
    }
  }
};
```
