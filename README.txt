LEVITEC SITE CONTROL v0.2.1
===========================

CORRECCION FRONTEND
-------------------
- Administración tiene ahora botón visible "Abrir administración".
- La tarjeta completa también es clicable y accesible por teclado.
- Se añade cache busting ?v=0.2.1 para evitar que GitHub/Chrome use app.js o styles.css antiguos.
- Administración > Proyectos mantiene: listar, crear, editar y activar/desactivar proyectos.

GITHUB
------
Sustituir en la raíz del repositorio:
- index.html
- app.js
- styles.css

No es necesario borrar el historial de GitHub. Subir los nuevos archivos con el mismo nombre crea un nuevo commit y conserva las versiones anteriores para rollback.

APPS SCRIPT
-----------
Code.gs es el mismo backend v0.5.0. Si ya está desplegado y funciona, NO hace falta volver a sustituirlo ni desplegarlo.
