LEVITEC SITE CONTROL · Warehouse request UX v0.6.2
=====================================================

Esta actualización SOLO modifica el frontend de Site Control.
No toca el backend de Warehouse ni el bridge que ya está funcionando.

Sustituir en el repositorio de LEVITEC SITE CONTROL:
- index.html
- app.js
- styles.css

Commit sugerido:
Frontend v0.6.2 - Guided warehouse material request

Después:
1. Esperar a que GitHub Pages publique.
2. Ctrl + F5.
3. Abrir un proyecto > Almacenes.

NOVEDADES
---------
- + Solicitar material ya no exige memorizar la referencia.
- Buscador por referencia o descripción.
- Filtro por zona.
- Resultados con stock disponible, zonas y cuarentena.
- Selección de material con ficha resumen.
- La cantidad no puede superar el stock disponible.
- Cuarentena queda excluida del stock solicitabile.
- Botón Solicitar directamente desde cada línea de stock utilizable.
- La selección desde la tabla abre el formulario ya precargado.

NO CAMBIAR
----------
- Backend Warehouse.
- Propiedades WAREHOUSE_API_URL / WAREHOUSE_API_KEY.
- Backend Site Control.
