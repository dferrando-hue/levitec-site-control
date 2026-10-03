LEVITEC SITE CONTROL v0.3.0
=========================

CAMBIOS PRINCIPALES
-------------------
1. Administración de plataforma pasa a ser GLOBAL:
   - visible desde "Mis proyectos"
   - alta/edición/activación de proyectos
   - ya no depende de entrar previamente en ZAZ081/ZAZ091/etc.

2. Dentro de cada proyecto aparece:
   COMPRAS / ADMINISTRACIÓN
   - solicitudes de pedido
   - proveedor
   - familia/imputación
   - fecha requerida
   - oferta/presupuesto (referencia o enlace)
   - destino y dirección
   - contacto en obra
   - varias líneas de material
   - observaciones
   - estados de seguimiento

3. El backend crea automáticamente la hoja:
   SOLICITUDES_PEDIDO
   la primera vez que se usa el módulo.

PASOS DE INSTALACION
--------------------
APPS SCRIPT
1. Sustituir TODO Código.gs por Code.gs.
2. Guardar.
3. Ejecutar testUserAccess().
4. Si es correcto:
   Implementar > Gestionar implementaciones > Editar > Nueva versión.
   Descripción:
   CORE v0.6.0 - Global Admin + Purchases

GITHUB
1. Reemplazar:
   index.html
   styles.css
   app.js
2. Commit recomendado:
   Frontend v0.3.0 - Global Admin + Purchases
3. Esperar GitHub Pages.
4. Ctrl+F5 una vez.

NOTA SOBRE ADJUNTOS
-------------------
En esta primera versión, "Oferta / presupuesto" almacena una referencia,
número de oferta o enlace. La subida directa de PDFs a Drive se añadirá
en una iteración posterior para no mezclar todavía gestión documental
con el primer flujo operativo de pedidos.
