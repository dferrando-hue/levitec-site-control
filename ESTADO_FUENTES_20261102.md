# Estado de las fuentes al 2 de noviembre de 2026

Code.gs es la copia contrastada del archivo principal del backend SITE CONTROL desplegado como versión 47. La etiqueta APP.VERSION conserva 1.12.3-rc13; la identidad de esta entrega debe verificarse por versión y SHA256 normalizado, no por esa etiqueta.

SHA256 con saltos de línea LF: f843e356ec509e1dbf10eab779a8e90562dd580457b14c89c72d331c8455a231.

El backend activo se administra en Google Apps Script. GitHub Pages no ejecuta Code.gs. Las utilidades IMPORT_ZAZ081.gs y SETUP_DELINEANTE.gs están en el proyecto Apps Script y deben formar parte de una transferencia completa; no se incorporan aquí por esta sincronización. Las claves de servicio son propiedades privadas y no deben publicarse.

Correcciones v46: fechas reales de calendario en planificación/submittals/FoK/planos y autorización del proyecto origen y destino al copiar FoK. El frontend mantiene la corrección 4a5ee98 sobre disponibilidad de módulos y alcance del indicador de submittals.

Reserva SC-A05: recuperación del historial de planos ante fallo parcial aún pendiente. No se declara capacidad concurrente certificada ni validación de cuentas reales de todos los perfiles.


Versión 47: SC-A08 privatiza utilidades administrativas, incluidas las dos auxiliares del proyecto Apps Script. No se ejecutó mantenimiento ni se alteraron datos por esta corrección. Los nombres privados quedan fuera del canal google.script.run.
