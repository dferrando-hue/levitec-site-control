LEVITEC SITE CONTROL v0.7.0 · DELIVERY + HITOS CONSTRUCTIVOS
============================================================

OBJETIVO
--------
Añade planificación constructiva al módulo Deliveries para poder referenciar
la llegada de equipos contra hitos reales de obra.

NOVEDADES
---------
- Crear/editar/eliminar hitos constructivos por proyecto.
- Hitos visibles dentro del calendario de Deliveries.
- Tipos: Constructivo, Commissioning, PFHO, Energización, Handover y Otro.
- Disciplina: General, Mechanical o Electrical.
- Asociar cada delivery a un hito constructivo.
- Cálculo automático del margen:
    * X días antes del hito.
    * mismo día.
    * X días después del hito.
- En la lista de hitos se ve cuántas deliveries están vinculadas y si existe
  alguna llegada prevista después del hito.
- La tabla de deliveries muestra el hito asociado y su margen.
- Nueva hoja automática: HITOS_CONSTRUCTIVOS.
- Nueva columna automática en SOLICITUDES_PEDIDO: HITO_ID.

IMPORTANTE
----------
Esta versión NO toca Warehouse.
No ejecutar setup() de Warehouse.
No modificar las propiedades WAREHOUSE_API_URL / WAREHOUSE_API_KEY.

INSTALACIÓN
-----------
1. APPS SCRIPT DE SITE CONTROL
   Sustituir el Code.gs actual por el Code.gs de este paquete.
   Guardar.
   Implementar > Gestionar implementaciones > Editar > Nueva versión.
   Descripción sugerida:
   CORE v1.1.0 - Delivery Construction Milestones

2. GITHUB · levitec-site-control
   Sustituir:
   - index.html
   - app.js
   - styles.css

   Commit sugerido:
   Frontend v0.7.0 - Delivery Construction Milestones

3. RECARGA
   Esperar a GitHub Pages y hacer Ctrl+F5.

PRIMER USO
----------
Entrar en un proyecto > Deliveries.
Pulsar '+ Hito constructivo'.

La hoja HITOS_CONSTRUCTIVOS se crea automáticamente al cargar Deliveries
con el backend nuevo. La columna HITO_ID también se añade automáticamente a
SOLICITUDES_PEDIDO sin borrar datos existentes.

EJEMPLOS DE HITOS
-----------------
- L3 - Mechanical Complete
- L4 - Ready for Commissioning
- PFHO
- Energización sala MV
- Cierre falso suelo
- Handover de fase
