LEVITEC SITE CONTROL v0.4.0
=========================

NUEVO MODULO DELIVERIES
-----------------------
- Calendario mensual por proyecto.
- Próximas / Retrasadas / Recibidas.
- Una entrega aparece cuando el pedido tiene FECHA_ENTREGA_PREVISTA.
- La fecha puede modificarse tantas veces como sea necesario.
- Cada cambio exige MOTIVO.
- Cada cambio queda registrado en HISTORIAL_ENTREGAS.
- Confirmación de recepción completa o parcial.
- En recepción parcial se exige indicar qué queda pendiente.

NUEVAS COLUMNAS EN SOLICITUDES_PEDIDO
-------------------------------------
RECEPCION_ESTADO
FECHA_RECEPCION
RECIBIDO_POR
RECEPCION_NOTAS

NUEVA HOJA
----------
HISTORIAL_ENTREGAS

INSTALACION
-----------
APPS SCRIPT
1. Sustituir Código.gs por Code.gs.
2. Guardar.
3. Ejecutar migratePurchaseSchemaV064().
4. Ejecutar testUserAccess().
5. Desplegar:
   CORE v0.7.0 - Deliveries Calendar

GITHUB
1. Reemplazar index.html, app.js y styles.css.
2. Commit:
   Frontend v0.4.0 - Deliveries Calendar
3. Ctrl+F5.

NOTA
----
Todavía no se mueve stock automáticamente al confirmar recepción.
Ese enlace se implementará con Warehouse multi-almacén.
