---
name: ABB Signal Lab
description: Laboratorio web interactivo de Árboles Binarios de Búsqueda con señalización cromática y pulsos animados sobre grafo SVG.
colors:
  rail-deep: "#0a1420"
  rail-footer: "#0c1724"
  rail-navy: "#101d2c"
  rail-surface: "#17273b"
  rail-hover: "#1e334d"
  rail-border: "#263c56"
  rail-border-hover: "#3a5678"
  rail-text: "#f3f5f8"
  rail-muted: "#9eb2c7"
  rail-placeholder: "#7c93ab"
  ink-muted: "#64748b"
  edge-muted: "#8a99aa"
  canvas-chalk: "#f7f6f2"
  surface-white: "#ffffff"
  surface-stone: "#f0eee8"
  border-stone: "#ddd8cc"
  signal-cobalt: "#1d63dc"
  signal-cobalt-hover: "#1754bf"
  signal-cobalt-dark: "#0c3582"
  signal-cobalt-focus: "#60a5fa"
  signal-cobalt-tint: "#dbeafe"
  signal-amber: "#e08b00"
  signal-emerald: "#128a5b"
  signal-emerald-dark: "#095236"
  signal-crimson: "#c93636"
  signal-crimson-bright: "#ef4444"
  signal-crimson-border: "#f87171"
  signal-crimson-dark: "#7f1d1d"
  signal-crimson-soft: "#fca5a5"
  signal-crimson-pale: "#fecaca"
typography:
  headline:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  body-sm:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.06em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 700
    fontFeature: "\"tnum\" 1"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.signal-cobalt}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-op:
    backgroundColor: "{colors.rail-surface}"
    textColor: "{colors.rail-text}"
    rounded: "{rounded.sm}"
    padding: "8px 11px"
  button-op-active:
    backgroundColor: "{colors.signal-cobalt}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.sm}"
    padding: "8px 11px"
  button-danger:
    backgroundColor: "transparent"
    textColor: "#fecaca"
    rounded: "{rounded.sm}"
    padding: "8px 11px"
---

# Design System: ABB Signal Lab

## Overview

**Creative North Star: "Señal Metro & Grafo"**

ABB Signal Lab combina la claridad de un diagrama de señalización ferroviaria con un riel operativo de alto contraste. La zona de comandos y menú de operaciones permanece anclada en marino profundo mientras el árbol respira sobre un lienzo tiza cálido de alta legibilidad para proyección o escritorio.

El color no es ornamental: cuatro señales de alta saturación codifican exclusivamente estados algorítmicos sobre el grafo SVG y la tira de resultados, permitiendo leer rutas, comparaciones y eliminaciones de un vistazo.

**Key Characteristics:**
- Riel operativo fijo a la izquierda con separación deliberada para acciones destructivas al pie.
- Lienzo SVG interactivo con retícula punteada, bandas de nivel alternadas y pulsos animados entre nodos.
- Tipografía geométrica limpia emparejada con cifras tabulares monoespaciadas para claves, niveles y factores de equilibrio.

## Colors

La paleta separa la cromática del riel de control (marino profundo) de la superficie de trabajo (tiza y blanco), reservando los tonos saturados exclusivamente para estados del árbol.

### Primary
- **Signal Cobalt** (`colors.signal-cobalt`): Acción principal de inserción, botón de operación activa y nodos/aristas visitados durante la ruta.

### Secondary
- **Signal Amber** (`colors.signal-amber`): Nodo en comparación activa y extremo máximo del ABB.
- **Signal Emerald** (`colors.signal-emerald`): Nodo encontrado, recién insertado, hojas en estadísticas o Ancestro Común (LCA).

### Tertiary
- **Signal Crimson** (`colors.signal-crimson`): Reservado únicamente para `04 · Borrar un elemento`, `Vaciar árbol completo`, nodos fuera de balanceo AVL y errores de entrada.

### Neutral
- **Rail Navy** (`colors.rail-navy`): Fondo del riel operativo izquierdo y bordes de contraste fuerte.
- **Rail Surface** (`colors.rail-surface`) / **Rail Border** (`colors.rail-border`): Superficie de botones de menú y divisiones internas del riel.
- **Canvas Chalk** (`colors.canvas-chalk`) / **Surface White** (`colors.surface-white`): Fondo del lienzo del árbol, barra superior y tira de salida inferior.

### Named Rules
**The Signal-Only Color Rule.** Los colores cobalto, ámbar, esmeralda y carmesí solo aparecen en botones primarios/destructivos y estados activos del grafo; nunca como relleno decorativo de paneles.

**The Isolated Danger Rule.** Las operaciones destructivas (`04 · Borrar un elemento` y `Vaciar árbol completo`) viven separadas al pie del riel operativo y usan contorno carmesí hasta confirmarse.

## Typography

**Display & Body Font:** Public Sans (con respaldo `system-ui, sans-serif`)
**Mono Font:** JetBrains Mono (con respaldo `ui-monospace, monospace`)

**Character:** Public Sans aporta legibilidad neutra en menús y mensajes explicativos en español, mientras JetBrains Mono asegura alineación tabular estricta en claves numéricas, niveles y secuencias de recorrido.

### Hierarchy
- **Headline** (700, 18px, line-height 1.25, tracking -0.02em): Título principal de la barra superior y cabecera del riel.
- **Body** (400–500, 13–14px, line-height 1.45): Etiquetas de las 15 operaciones y mensajes de estado en la tira inferior.
- **Label** (700, 12px, uppercase, tracking 0.06em): Encabezados de sección en el menú y nombre de la operación activa.
- **Mono** (700, 12–16px, tabular-nums): Valores dentro de los nodos SVG, etiquetas de nivel, factores AVL y fichas de secuencia.

## Layout

Rejilla principal de dos columnas en escritorio (`332px 1fr`, altura `100vh` sin desbordamiento horizontal): riel operativo izquierdo con desplazamiento interno para el menú de 15 operaciones y área principal dividida en barra superior (`auto`), lienzo SVG (`1fr`) y tira de salida inferior (`minmax(98px, auto)`). En pantallas menores o iguales a `960px` pasa a columna única con menú colapsable mediante el botón `Menú`.

## Elevation & Depth

Superficies planas delimitadas por bordes de `1px` y `2px` en `#101d2c` o `#ddd8cc`. La elevación por sombra se reserva exclusivamente para controles flotantes sobre el lienzo (`0 4px 14px rgba(16, 29, 44, 0.08)` en la barra de zoom y `0 14px 36px rgba(16, 29, 44, 0.18)` en el panel desplegable de impresión).

## Shapes

Radios sobrios de `6px` en botones, inputs y fichas de secuencia; `10px` en la barra flotante de herramientas y `14px` en el panel de impresión estructural. Los nodos del ABB son círculos de radio `24px` con halo de estado de `30px`.

## Components

### Buttons
- **Shape:** Rectángulo suavizado (`6px`).
- **Primary:** Relleno cobalto con texto blanco y padding `8px 14px`.
- **Menu Operation:** Superficie marino medio con número tabular a la izquierda y etiqueta corta monoespaciada a la derecha.
- **Destructive:** Contorno carmesí transparente en reposo, relleno carmesí solo al activar o armar confirmación.

### Inputs / Fields
- **Style:** Fondo marino oscuro (`#0a1420`), borde `1px` en `#263c56`, radio `6px`, tipografía monoespaciada.
- **Focus:** Anillo visible de `2px` en cobalto.

### Signature Component: Grafo SVG con Pulsos de Señal
- **Behavior:** Cada transición de nodo usa desaceleración exponencial `cubic-bezier(0.16, 1, 0.3, 1)` de `0.4s` (desactivada bajo `prefers-reduced-motion`). Durante búsquedas, inserciones, eliminaciones y LCA, un pulso luminoso viaja sobre la arista SVG desde el nodo padre hasta el hijo evaluado.

## Do's and Don'ts

### Do:
- **Do** mantener todas las cifras numéricas de nodos, niveles y recorridos con `tabular-nums` en JetBrains Mono.
- **Do** limpiar o actualizar el estado previo del grafo antes de iniciar una nueva animación para evitar rutas huérfanas.

### Don't:
- **Don't** mover `04 · Borrar un elemento` ni `Vaciar árbol completo` junto al botón de inserción rápida.
- **Don't** usar texto menor a `12px` en etiquetas, insignias SVG o encabezados de tabla.
