LEVITEC SITE CONTROL v0.3.2
=========================

FIX CRITICO
-----------
En v0.3.1, si la hoja SOLICITUDES_PEDIDO ya existía, la columna
CLIENT_REQUEST_ID se añadía al final de la hoja, pero las nuevas solicitudes
se escribían por posición como si esa columna fuese la segunda.

Resultado:
- la solicitud sí se guardaba,
- pero PROYECTO_ID quedaba desplazado,
- por eso la solicitud no aparecía en el panel del proyecto.

v0.3.2 corrige esto:
- las nuevas solicitudes se escriben por NOMBRE DE CABECERA, nunca por posición;
- el backend detecta y repara automáticamente las solicitudes mal alineadas
  creadas con v0.3.1;
- también existe repairPurchaseRequestsV031() por si quieres ejecutar la
  reparación manualmente y ver cuántas filas se corrigieron.

INSTALACION
-----------
APPS SCRIPT
1. Sustituir TODO Código.gs por Code.gs.
2. Guardar.
3. Ejecutar testUserAccess().
4. Opcional: ejecutar repairPurchaseRequestsV031().
5. Desplegar nueva versión:
   CORE v0.6.2 - Purchase schema fix

GITHUB
1. Reemplazar index.html, styles.css y app.js.
2. Commit:
   Frontend v0.3.2 - Purchase schema fix
3. Ctrl+F5.

No hay que borrar la hoja SOLICITUDES_PEDIDO.
