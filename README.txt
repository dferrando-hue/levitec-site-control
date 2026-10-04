LEVITEC SITE CONTROL v0.6.0
============================

WAREHOUSE SHARED DATA INTEGRATION

This version keeps Site Control as the management/query interface but reads
live stock from the operational LEVITEC Warehouse EVENTS ledger.

Shared Google Sheets:
- ALMACENES
- USUARIO_ALMACEN
- ALMACEN_PROYECTO
- ZONES
- MATERIALS
- EVENTS
- PROJECT_TRANSFERS
- SOLICITUDES_MATERIAL

The Warehouse portal performs operational movements.
Site Control queries stock and creates material requests.

Deploy backend as:
CORE v0.9.0 - Shared Warehouse integration

GitHub:
replace index.html, app.js, styles.css
commit:
Frontend v0.6.0 - Shared Warehouse integration
