LEVITEC SITE CONTROL v0.3.1
=========================

MEJORAS DEL MODULO COMPRAS
--------------------------
- Protección contra doble envío:
  * el botón queda deshabilitado mientras se crea la solicitud
  * el backend usa CLIENT_REQUEST_ID e impide duplicados aunque llegue el POST dos veces
- Formulario simplificado:
  * Proveedor
  * Fecha requerida
  * Destino
  * Materiales
  * Observaciones
- Datos adicionales quedan plegados:
  * familia
  * referencia de oferta
  * dirección
  * contacto
- Autocomplete usando histórico:
  * proveedores
  * familias
  * destinos
  * referencias de material
- Al introducir una referencia ya utilizada:
  * rellena descripción
  * último precio
  * proveedor
  * familia
- Al elegir un destino conocido:
  * rellena tipo
  * dirección
  * contacto
  * familia si estaba vacía
- Botón REUTILIZAR en cada solicitud para precargar una nueva.

INSTALACION
-----------
APPS SCRIPT
1. Sustituir Código.gs por Code.gs.
2. Guardar.
3. Ejecutar testUserAccess().
4. Desplegar nueva versión:
   CORE v0.6.1 - Assisted Purchases + Idempotency

GITHUB
1. Reemplazar index.html, styles.css y app.js.
2. Commit:
   Frontend v0.3.1 - Assisted Purchases
3. Esperar GitHub Pages y hacer Ctrl+F5.

MIGRACION
---------
No hay que tocar la hoja SOLICITUDES_PEDIDO.
El backend añade automáticamente la nueva columna CLIENT_REQUEST_ID si falta.
Las solicitudes antiguas siguen siendo válidas.
