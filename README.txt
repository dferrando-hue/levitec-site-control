LEVITEC SITE CONTROL v0.3.6

FIX
---
Corrige la migración automática de columnas de SOLICITUDES_PEDIDO.

Error corregido:
Falta la columna FECHA_ENTREGA_PREVISTA en SOLICITUDES_PEDIDO.

PASOS
-----
1. Sustituir Código.gs por Code.gs.
2. Guardar.
3. Ejecutar migratePurchaseSchemaV064().
4. Confirmar en el log que aparecen:
   FECHA_ENTREGA_PREVISTA
   FECHA_ACTUALIZACION
5. Ejecutar testUserAccess().
6. Desplegar:
   CORE v0.6.4 - Purchase schema migration fix

GitHub:
- reemplazar index.html, app.js y styles.css
- commit: Frontend v0.3.6 - Purchase schema migration fix
- Ctrl+F5
