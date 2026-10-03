LEVITEC SITE CONTROL v0.3.4
=========================

NUEVO: TRAMITACION DE PEDIDOS
-----------------------------
Cada solicitud incorpora ahora el botón TRAMITAR.

La ventana de tramitación muestra claramente:
- proveedor
- familia / imputación
- fecha requerida
- destino
- materiales
- observaciones

Administración puede editar:
- familia / imputación
- estado
- nº PO / Sage
- fecha prevista de entrega

VALIDACIONES
------------
PEDIDO EMITIDO:
- familia obligatoria
- nº PO / Sage obligatorio

CONFIRMADO PROVEEDOR:
- familia obligatoria
- nº PO / Sage obligatorio
- fecha prevista de entrega obligatoria

BACKEND
-------
La hoja SOLICITUDES_PEDIDO se amplía automáticamente con:
FECHA_ENTREGA_PREVISTA

No borres la hoja ni los pedidos existentes.

INSTALACION
-----------
APPS SCRIPT
1. Sustituir TODO Código.gs por Code.gs.
2. Guardar.
3. Ejecutar testUserAccess().
4. Desplegar nueva versión:
   CORE v0.6.3 - Purchase Workflow

GITHUB
1. Reemplazar index.html, styles.css y app.js.
2. Commit:
   Frontend v0.3.4 - Purchase Workflow
3. Ctrl+F5.
