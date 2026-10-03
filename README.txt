LEVITEC SITE CONTROL v0.3.3
=========================

FIX PANEL DE SOLICITUDES
------------------------
La v0.3.2 lanzaba al abrir Compras dos POST consecutivos:
- purchaseList
- purchaseSuggestions

Ambos usaban el mismo formulario y el mismo iframe oculto.
El segundo POST podía cancelar la respuesta del primero, dejando
la pantalla permanentemente en "Cargando solicitudes...".

v0.3.3 serializa las peticiones:
1. carga primero purchaseList;
2. renderiza el panel;
3. después solicita purchaseSuggestions.

BACKEND
-------
Se mantiene Code.gs v0.6.2. Si ya lo desplegaste correctamente,
no necesitas volver a desplegar Apps Script.

GITHUB
------
Reemplazar:
- index.html
- app.js
- styles.css

Commit:
Frontend v0.3.3 - Sequential purchase loading

Después Ctrl+F5.
