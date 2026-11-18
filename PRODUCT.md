# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML, CSS y JavaScript puro (estático, sin dependencias ni compilación; se abre directamente en el navegador o mediante servidor estático local).

## Users

Estudiantes y docentes de estructuras de datos que necesitan visualizar, operar y demostrar paso a paso el funcionamiento de un Árbol Binario de Búsqueda (ABB) en clase o en entregas académicas.

## Product Purpose

Proveer una aplicación web dinámica e interactiva que represente gráficamente un Árbol Binario de Búsqueda (ABB) de números enteros y permita ejecutar sus 15 operaciones (10 obligatorias + 5 operaciones libres con título personalizado en el menú) con animaciones de recorrido, manejo claro de estados, colores y efectos visuales comprensibles.

## Positioning

Laboratorio interactivo de Árboles Binarios de Búsqueda en navegador sin instalación, donde cada operación del menú se ejecuta visualmente sobre el grafo SVG en tiempo real —mostrando comparaciones, rutas, niveles, factores de equilibrio y resultados paso a paso.

## Operating Context

Uso directo en navegador de escritorio o portátil (y adaptable a pantallas más pequeñas) para prácticas, demostraciones en vivo y revisión académica de las 15 operaciones del menú de opciones.

## Capabilities and Constraints

- Representación gráfica dinámica del ABB (nodos, aristas, jerarquía por niveles, zoom/paneo o ajuste automático al lienzo).
- Manejo de números enteros con carga de ejemplos predefinidos (presets) y generación aleatoria.
- 10 operaciones base obligatorias:
  1. Imprimir los elementos del árbol
  2. Buscar un elemento en el árbol
  3. Insertar un elemento en el árbol
  4. Borrar un elemento del árbol (hoja, un hijo, dos hijos)
  5. Recorrido en anchura o amplitud (por niveles)
  6. Recorrido en preorden
  7. Recorrido en postorden
  8. Recorrido en inorden
  9. Número de niveles del árbol
  10. Nivel de un nodo en específico
- 5 operaciones libres (incisos 11–15) con título propio en el menú de opciones:
  11. Extremos: Mínimo y Máximo del ABB
  12. Estadísticas: Conteo de nodos, hojas y suma total
  13. Verificar Balanceo (factor de equilibrio por nodo)
  14. Ancestro Común Más Cercano (LCA) y camino entre dos nodos
  15. Balancear ABB (reconstrucción equilibrada)
- Idioma de la interfaz: español.
- Aplicación web dinámica con diseño cuidado, manejo de colores y efectos visuales claros sin sacrificar legibilidad.

## Product Principles

- Cada operación debe verse reflejada directamente sobre el árbol gráfico, no solo como texto en consola.
- El menú de las 15 operaciones debe ser inmediato de localizar, con títulos claros (incluyendo los títulos personalizados para las opciones 11–15).
- Las animaciones de búsqueda, inserción, eliminación y recorridos deben permitir seguir el orden lógico de las comparaciones y visitas.
- El diseño debe mantenerse limpio, contrastado y usable tanto en árboles pequeños como en árboles de varios niveles.
