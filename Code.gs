/* =========================================================
   LEVITEC SITE CONTROL
   CORE BACKEND v0.6.3
   Global Admin + Project Purchases
   ========================================================= */

const SPREADSHEET_ID =
  '1yAZj3KXPYerlOcZFs3hASbVTPbgAbEuPoK8HSEsDRBA';

const GOOGLE_CLIENT_ID =
  '125715939878-v29u8atv0k8g6smekk6lfuhrtqob4c1b.apps.googleusercontent.com';

const FRONTEND_ORIGIN =
  'https://dferrando-hue.github.io';

const APP = {
  NAME: 'LEVITEC SITE CONTROL',
  VERSION: '0.6.3',
  MESSAGE_SOURCE: 'LEVITEC_SITE_CONTROL'
};

const SHEETS = {
  USERS: 'USUARIOS',
  PROJECTS: 'PROYECTOS',
  USER_PROJECT: 'USUARIO_PROYECTO',
  ROLES: 'ROLES',
  PERMISSIONS: 'PERMISOS',
  ROLE_PERMISSION: 'ROL_PERMISO',
  CONFIG: 'CONFIG',
  PURCHASE_REQUESTS: 'SOLICITUDES_PEDIDO'
};

const PURCHASE_HEADERS = [
  'REQUEST_ID',
  'CLIENT_REQUEST_ID',
  'PROYECTO_ID',
  'FECHA_CREACION',
  'CREADO_POR',
  'SOLICITANTE',
  'PROVEEDOR',
  'FAMILIA',
  'DESTINO_TIPO',
  'DESTINO',
  'DIRECCION_ENTREGA',
  'CONTACTO_OBRA',
  'FECHA_REQUERIDA',
  'OFERTA_REF',
  'MATERIALES_JSON',
  'OBSERVACIONES',
  'ESTADO',
  'PO_NUMERO',
  'FECHA_ENTREGA_PREVISTA',
  'FECHA_ACTUALIZACION'
];


/* =========================================================
   WEB APP
   ========================================================= */

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      app: APP.NAME,
      version: APP.VERSION
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


function doPost(e) {
  try {
    const p = getRequestParams_(e);
    const action = cleanText_(p.action);

    if (!action) {
      return postMessageHtml_({
        ok: false,
        error: 'ACTION_REQUIRED',
        message: 'No se ha indicado ninguna acción.'
      }, 'error');
    }

    switch (action) {
      case 'bootstrap':
        return postMessageHtml_(bootstrap_(p), 'bootstrap');

      case 'adminProjectsList':
        return postMessageHtml_(adminProjectsList_(p), 'adminProjectsList');

      case 'adminProjectCreate':
        return postMessageHtml_(adminProjectCreate_(p), 'adminProjectCreate');

      case 'adminProjectUpdate':
        return postMessageHtml_(adminProjectUpdate_(p), 'adminProjectUpdate');

      case 'purchaseList':
        return postMessageHtml_(purchaseList_(p), 'purchaseList');

      case 'purchaseSuggestions':
        return postMessageHtml_(purchaseSuggestions_(p), 'purchaseSuggestions');

      case 'purchaseCreate':
        return postMessageHtml_(purchaseCreate_(p), 'purchaseCreate');

      case 'purchaseUpdateStatus':
        return postMessageHtml_(purchaseUpdateStatus_(p), 'purchaseUpdateStatus');

      default:
        return postMessageHtml_({
          ok: false,
          error: 'UNKNOWN_ACTION',
          message: 'La acción solicitada no existe.'
        }, 'error');
    }

  } catch (err) {
    return postMessageHtml_({
      ok: false,
      error: 'SERVER_ERROR',
      message: err && err.message ? err.message : String(err)
    }, 'error');
  }
}


/* =========================================================
   AUTH / BOOTSTRAP
   ========================================================= */

function bootstrap_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');

  return {
    ok: true,

    app: {
      name: APP.NAME,
      version: APP.VERSION
    },

    user: {
      email: session.user.email,
      name: session.user.name || session.identity.name || session.user.email,
      role: session.user.role,
      discipline: session.user.discipline
    },

    projects: getUserProjects_(
      session.user.email,
      session.user.role
    ),

    permissions: session.permissions,

    modules: buildModuleAccess_(
      session.permissions,
      session.user.role
    )
  };
}


function requireAuthenticatedUser_(p, requiredPermission) {
  const identity = verifyGoogleIdToken_(p.credential);
  const email = cleanEmail_(identity.email);

  const user = getUserProfile_(email);

  if (!user) {
    throw new Error('Tu cuenta no está autorizada en LEVITEC SITE CONTROL.');
  }

  if (!isYes_(user.active)) {
    throw new Error('Tu usuario está desactivado.');
  }

  const permissions = getUserPermissions_(user.role);

  if (
    requiredPermission &&
    !permissions.includes(requiredPermission)
  ) {
    throw new Error('No tienes permiso para realizar esta acción.');
  }

  return {
    identity: identity,
    user: user,
    permissions: permissions
  };
}


function requireProjectAccess_(session, projectId) {
  projectId = cleanKey_(projectId);

  const projects = getUserProjects_(
    session.user.email,
    session.user.role
  );

  const project = projects.find(
    item => cleanKey_(item.id) === projectId
  );

  if (!project) {
    throw new Error('No tienes acceso al proyecto ' + projectId + '.');
  }

  return project;
}


/* =========================================================
   GOOGLE IDENTITY
   ========================================================= */

function verifyGoogleIdToken_(idToken) {
  idToken = cleanText_(idToken);

  if (!idToken) {
    throw new Error('Google ID token requerido.');
  }

  const url =
    'https://oauth2.googleapis.com/tokeninfo?id_token=' +
    encodeURIComponent(idToken);

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error('El token de Google no es válido.');
  }

  let payload;

  try {
    payload = JSON.parse(response.getContentText());
  } catch (err) {
    throw new Error('No se pudo interpretar la respuesta de Google.');
  }

  if (cleanText_(payload.aud) !== GOOGLE_CLIENT_ID) {
    throw new Error('El token pertenece a otro cliente OAuth.');
  }

  const issuer = cleanText_(payload.iss);

  if (
    issuer !== 'accounts.google.com' &&
    issuer !== 'https://accounts.google.com'
  ) {
    throw new Error('Emisor del token no válido.');
  }

  if (String(payload.email_verified).toLowerCase() !== 'true') {
    throw new Error('El correo de Google no está verificado.');
  }

  const expiresAt = Number(payload.exp || 0);
  const now = Math.floor(Date.now() / 1000);

  if (!expiresAt || expiresAt <= now) {
    throw new Error('El token de Google ha caducado.');
  }

  const email = cleanEmail_(payload.email);

  if (!email) {
    throw new Error('Google no ha devuelto un correo válido.');
  }

  return {
    email: email,
    name: cleanText_(payload.name),
    picture: cleanText_(payload.picture),
    subject: cleanText_(payload.sub)
  };
}


/* =========================================================
   USERS / ACCESS
   ========================================================= */

function getUserProfile_(email) {
  email = cleanEmail_(email);

  const users = readTable_(SHEETS.USERS);

  const user = users.find(
    row => cleanEmail_(row.EMAIL) === email
  );

  if (!user) return null;

  return {
    email: cleanEmail_(user.EMAIL),
    name: cleanText_(user.NOMBRE),
    role: cleanKey_(user.ROL),
    discipline: cleanKey_(user.DISCIPLINA),
    active: user.ACTIVO
  };
}


function getUserProjects_(email, globalRole) {
  email = cleanEmail_(email);
  globalRole = cleanKey_(globalRole);

  const projects = readTable_(SHEETS.PROJECTS);

  const activeProjects = projects
    .filter(project =>
      cleanKey_(project.PROYECTO_ID) &&
      isYes_(project.ACTIVO)
    )
    .map(project => ({
      id: cleanKey_(project.PROYECTO_ID),
      name:
        cleanText_(project.NOMBRE) ||
        cleanKey_(project.PROYECTO_ID),
      campus: cleanText_(project.CAMPUS)
    }));

  if (globalRole === 'ADMIN') {
    return activeProjects.map(project => ({
      id: project.id,
      name: project.name,
      campus: project.campus,
      projectRole: 'ADMIN'
    }));
  }

  const assignments = readTable_(SHEETS.USER_PROJECT);
  const projectMap = {};

  activeProjects.forEach(project => {
    projectMap[project.id] = project;
  });

  const result = [];

  assignments.forEach(assignment => {
    if (cleanEmail_(assignment.EMAIL) !== email) return;
    if (!isYes_(assignment.ACTIVO)) return;

    const projectId = cleanKey_(assignment.PROYECTO_ID);
    const project = projectMap[projectId];

    if (!project) return;

    result.push({
      id: project.id,
      name: project.name,
      campus: project.campus,
      projectRole:
        cleanKey_(assignment.ROL_PROYECTO) ||
        globalRole
    });
  });

  const unique = {};
  result.forEach(project => {
    unique[project.id] = project;
  });

  return Object.values(unique);
}


/* =========================================================
   GLOBAL ADMIN > PROJECTS
   ========================================================= */

function adminProjectsList_(p) {
  requireAuthenticatedUser_(p, 'ADMIN_PROJECTS');

  const projects = readTable_(SHEETS.PROJECTS)
    .filter(row => cleanKey_(row.PROYECTO_ID))
    .map(row => ({
      id: cleanKey_(row.PROYECTO_ID),
      name: cleanText_(row.NOMBRE),
      campus: cleanText_(row.CAMPUS),
      active: isYes_(row.ACTIVO)
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    ok: true,
    projects: projects
  };
}


function adminProjectCreate_(p) {
  requireAuthenticatedUser_(p, 'ADMIN_PROJECTS');

  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  const name = cleanText_(payload.name) || projectId;
  const campus = cleanText_(payload.campus);
  const active = payload.active === false ? 'NO' : 'SI';

  if (!projectId) {
    throw new Error('El ID del proyecto es obligatorio.');
  }

  if (!/^[A-Z0-9_-]{2,30}$/.test(projectId)) {
    throw new Error(
      'El ID de proyecto solo puede contener letras, números, guion y guion bajo.'
    );
  }

  const sh = getSheet_(SHEETS.PROJECTS);
  const data = sh.getDataRange().getDisplayValues();

  for (let i = 1; i < data.length; i++) {
    if (cleanKey_(data[i][0]) === projectId) {
      throw new Error('Ya existe un proyecto con ID ' + projectId + '.');
    }
  }

  sh.appendRow([
    projectId,
    name,
    campus,
    active
  ]);

  SpreadsheetApp.flush();

  return {
    ok: true,
    message: 'Proyecto creado correctamente.',
    project: {
      id: projectId,
      name: name,
      campus: campus,
      active: active === 'SI'
    }
  };
}


function adminProjectUpdate_(p) {
  requireAuthenticatedUser_(p, 'ADMIN_PROJECTS');

  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  const name = cleanText_(payload.name);
  const campus = cleanText_(payload.campus);
  const active = payload.active === true ? 'SI' : 'NO';

  if (!projectId) {
    throw new Error('El ID del proyecto es obligatorio.');
  }

  const sh = getSheet_(SHEETS.PROJECTS);
  const data = sh.getDataRange().getDisplayValues();

  let foundRow = 0;

  for (let i = 1; i < data.length; i++) {
    if (cleanKey_(data[i][0]) === projectId) {
      foundRow = i + 1;
      break;
    }
  }

  if (!foundRow) {
    throw new Error('No existe el proyecto ' + projectId + '.');
  }

  sh.getRange(foundRow, 2, 1, 3).setValues([[
    name || projectId,
    campus,
    active
  ]]);

  SpreadsheetApp.flush();

  return {
    ok: true,
    message: 'Proyecto actualizado correctamente.'
  };
}


/* =========================================================
   PROJECT > PURCHASES / ADMINISTRATION
   ========================================================= */

function purchaseList_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  requireProjectAccess_(session, projectId);

  ensurePurchaseSheet_();
  repairMalformedPurchaseRows_();

  const rows = readTable_(SHEETS.PURCHASE_REQUESTS)
    .filter(row => cleanKey_(row.PROYECTO_ID) === projectId)
    .map(row => ({
      requestId: cleanText_(row.REQUEST_ID),
      projectId: cleanKey_(row.PROYECTO_ID),
      createdAt: cleanText_(row.FECHA_CREACION),
      createdBy: cleanEmail_(row.CREADO_POR),
      requester: cleanText_(row.SOLICITANTE),
      supplier: cleanText_(row.PROVEEDOR),
      family: cleanText_(row.FAMILIA),
      destinationType: cleanText_(row.DESTINO_TIPO),
      destination: cleanText_(row.DESTINO),
      deliveryAddress: cleanText_(row.DIRECCION_ENTREGA),
      siteContact: cleanText_(row.CONTACTO_OBRA),
      requiredDate: cleanText_(row.FECHA_REQUERIDA),
      quoteRef: cleanText_(row.OFERTA_REF),
      materials: safeJsonParse_(row.MATERIALES_JSON, []),
      notes: cleanText_(row.OBSERVACIONES),
      status: cleanKey_(row.ESTADO),
      poNumber: cleanText_(row.PO_NUMERO),
      expectedDeliveryDate: cleanText_(row.FECHA_ENTREGA_PREVISTA),
      updatedAt: cleanText_(row.FECHA_ACTUALIZACION)
    }))
    .sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt))
    );

  return {
    ok: true,
    projectId: projectId,
    requests: rows
  };
}


function purchaseCreate_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  requireProjectAccess_(session, projectId);

  const clientRequestId = cleanText_(payload.clientRequestId);
  const supplier = cleanText_(payload.supplier);
  const family = cleanText_(payload.family);
  const destinationType = cleanText_(payload.destinationType);
  const destination = cleanText_(payload.destination);
  const deliveryAddress = cleanText_(payload.deliveryAddress);
  const siteContact = cleanText_(payload.siteContact);
  const requiredDate = cleanText_(payload.requiredDate);
  const quoteRef = cleanText_(payload.quoteRef);
  const notes = cleanText_(payload.notes);

  const materials =
    Array.isArray(payload.materials)
      ? payload.materials
          .map(item => ({
            reference: cleanText_(item.reference),
            description: cleanText_(item.description),
            quantity: cleanText_(item.quantity),
            unitPrice: cleanText_(item.unitPrice)
          }))
          .filter(item =>
            item.reference ||
            item.description ||
            item.quantity ||
            item.unitPrice
          )
      : [];

  if (!clientRequestId) {
    throw new Error('Identificador de solicitud requerido.');
  }

  if (!supplier) {
    throw new Error('El proveedor es obligatorio.');
  }

  if (!requiredDate) {
    throw new Error('La fecha requerida es obligatoria.');
  }

  if (!materials.length && !notes) {
    throw new Error(
      'Indica al menos una línea de material o una observación de pedido.'
    );
  }

  ensurePurchaseSheet_();

  const existing = readTable_(SHEETS.PURCHASE_REQUESTS)
    .find(row => cleanText_(row.CLIENT_REQUEST_ID) === clientRequestId);

  if (existing) {
    return {
      ok: true,
      duplicate: true,
      message: 'La solicitud ya había sido registrada.',
      requestId: cleanText_(existing.REQUEST_ID)
    };
  }

  const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
  const requestId = nextPurchaseRequestId_(projectId);
  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  appendRowByHeaders_(sh, {
    REQUEST_ID: requestId,
    CLIENT_REQUEST_ID: clientRequestId,
    PROYECTO_ID: projectId,
    FECHA_CREACION: now,
    CREADO_POR: session.user.email,
    SOLICITANTE: session.user.name || session.identity.name || session.user.email,
    PROVEEDOR: supplier,
    FAMILIA: family,
    DESTINO_TIPO: destinationType,
    DESTINO: destination,
    DIRECCION_ENTREGA: deliveryAddress,
    CONTACTO_OBRA: siteContact,
    FECHA_REQUERIDA: requiredDate,
    OFERTA_REF: quoteRef,
    MATERIALES_JSON: JSON.stringify(materials),
    OBSERVACIONES: notes,
    ESTADO: 'PENDIENTE_ADMINISTRACION',
    PO_NUMERO: '',
    FECHA_ENTREGA_PREVISTA: '',
    FECHA_ACTUALIZACION: now
  });

  SpreadsheetApp.flush();

  return {
    ok: true,
    duplicate: false,
    message: 'Solicitud de pedido creada correctamente.',
    requestId: requestId
  };
}


function purchaseSuggestions_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  requireProjectAccess_(session, projectId);

  ensurePurchaseSheet_();
  repairMalformedPurchaseRows_();

  const accessibleProjects = new Set(
    getUserProjects_(session.user.email, session.user.role)
      .map(project => cleanKey_(project.id))
  );

  const rows = readTable_(SHEETS.PURCHASE_REQUESTS)
    .filter(row => accessibleProjects.has(cleanKey_(row.PROYECTO_ID)));

  const suppliers = new Map();
  const materials = new Map();
  const destinations = new Map();
  const families = new Set();

  rows.forEach(row => {
    const supplier = cleanText_(row.PROVEEDOR);
    if (supplier) {
      suppliers.set(supplier.toUpperCase(), supplier);
    }

    const family = cleanText_(row.FAMILIA);
    if (family) families.add(family);

    const destination = cleanText_(row.DESTINO);
    const destinationType = cleanText_(row.DESTINO_TIPO);
    const deliveryAddress = cleanText_(row.DIRECCION_ENTREGA);
    const siteContact = cleanText_(row.CONTACTO_OBRA);

    if (destination) {
      const key = (destinationType + '|' + destination).toUpperCase();

      destinations.set(key, {
        type: destinationType,
        destination: destination,
        address: deliveryAddress,
        contact: siteContact,
        family: family
      });
    }

    const rowMaterials = safeJsonParse_(row.MATERIALES_JSON, []);

    rowMaterials.forEach(item => {
      const reference = cleanText_(item.reference);
      const description = cleanText_(item.description);
      const unitPrice = cleanText_(item.unitPrice);

      if (!reference && !description) return;

      const key = (reference || description).toUpperCase();

      materials.set(key, {
        reference: reference,
        description: description,
        unitPrice: unitPrice,
        supplier: supplier,
        family: family
      });
    });
  });

  return {
    ok: true,
    suppliers: Array.from(suppliers.values()).sort(),
    families: Array.from(families.values()).sort(),
    destinations: Array.from(destinations.values()),
    materials: Array.from(materials.values())
  };
}


function purchaseUpdateStatus_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  if (
    !['ADMIN', 'PROJECT_MANAGER', 'SITE_MANAGER'].includes(
      cleanKey_(session.user.role)
    )
  ) {
    throw new Error('No tienes permiso para tramitar pedidos.');
  }

  const requestId = cleanText_(payload.requestId);
  const status = cleanKey_(payload.status);
  const poNumber = cleanText_(payload.poNumber);
  const family = cleanText_(payload.family);
  const expectedDeliveryDate = cleanText_(payload.expectedDeliveryDate);

  const allowedStatuses = [
    'PENDIENTE_ADMINISTRACION',
    'EN_TRAMITACION',
    'PEDIDO_EMITIDO',
    'CONFIRMADO_PROVEEDOR',
    'CANCELADO'
  ];

  if (!requestId) {
    throw new Error('REQUEST_ID requerido.');
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error('Estado no válido.');
  }

  if (
    ['PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(status) &&
    !family
  ) {
    throw new Error(
      'La familia / imputación es obligatoria antes de emitir el pedido.'
    );
  }

  if (
    ['PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(status) &&
    !poNumber
  ) {
    throw new Error(
      'El número de PO / Sage es obligatorio antes de emitir el pedido.'
    );
  }

  if (
    status === 'CONFIRMADO_PROVEEDOR' &&
    !expectedDeliveryDate
  ) {
    throw new Error(
      'La fecha prevista de entrega es obligatoria para confirmar el pedido con proveedor.'
    );
  }

  ensurePurchaseSheet_();

  const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
  const data = sh.getDataRange().getDisplayValues();
  const headers = headerMap_(data[0]);

  let foundRow = 0;

  for (let i = 1; i < data.length; i++) {
    if (cleanText_(data[i][headers.REQUEST_ID]) === requestId) {
      foundRow = i + 1;
      break;
    }
  }

  if (!foundRow) {
    throw new Error('No existe la solicitud ' + requestId + '.');
  }

  const projectId =
    cleanKey_(
      sh
        .getRange(foundRow, headers.PROYECTO_ID + 1)
        .getDisplayValue()
    );

  requireProjectAccess_(session, projectId);

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const updates = {
    FAMILIA: family,
    ESTADO: status,
    PO_NUMERO: poNumber,
    FECHA_ENTREGA_PREVISTA: expectedDeliveryDate,
    FECHA_ACTUALIZACION: now
  };

  Object.keys(updates).forEach(header => {
    if (headers[header] === undefined) {
      throw new Error('Falta la columna ' + header + ' en SOLICITUDES_PEDIDO.');
    }

    sh.getRange(foundRow, headers[header] + 1).setValue(updates[header]);
  });

  SpreadsheetApp.flush();

  return {
    ok: true,
    message: 'Pedido actualizado correctamente.',
    requestId: requestId,
    status: status,
    poNumber: poNumber,
    family: family,
    expectedDeliveryDate: expectedDeliveryDate
  };
}


function ensurePurchaseSheet_() {
  const ss = getDb_();
  let sh = ss.getSheetByName(SHEETS.PURCHASE_REQUESTS);

  if (!sh) {
    sh = ss.insertSheet(SHEETS.PURCHASE_REQUESTS);
    sh.getRange(1, 1, 1, PURCHASE_HEADERS.length)
      .setValues([PURCHASE_HEADERS])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, PURCHASE_HEADERS.length);
    return sh;
  }

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, PURCHASE_HEADERS.length)
      .setValues([PURCHASE_HEADERS])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
    return sh;
  }

  const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn())
    .getDisplayValues()[0]
    .map(cleanKey_);

  PURCHASE_HEADERS.forEach(header => {
    if (!currentHeaders.includes(cleanKey_(header))) {
      sh.insertColumnAfter(sh.getLastColumn());
      sh.getRange(1, sh.getLastColumn()).setValue(header);
      currentHeaders.push(cleanKey_(header));
    }
  });

  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  sh.setFrozenRows(1);

  return sh;
}


function nextPurchaseRequestId_(projectId) {
  const rows = readTable_(SHEETS.PURCHASE_REQUESTS);

  let max = 0;

  rows.forEach(row => {
    const id = cleanText_(row.REQUEST_ID);
    const prefix = 'REQ-' + projectId + '-';

    if (!id.startsWith(prefix)) return;

    const n = Number(id.slice(prefix.length));

    if (Number.isFinite(n) && n > max) {
      max = n;
    }
  });

  return (
    'REQ-' +
    projectId +
    '-' +
    String(max + 1).padStart(4, '0')
  );
}


/* =========================================================
   PERMISSIONS / MODULE ACCESS
   ========================================================= */

function getUserPermissions_(role) {
  role = cleanKey_(role);

  const rows = readTable_(SHEETS.ROLE_PERMISSION);
  const result = [];

  rows.forEach(row => {
    if (cleanKey_(row.ROL_ID) !== role) return;
    if (!isYes_(row.ACTIVO)) return;

    const permission = cleanKey_(row.PERMISO_ID);

    if (permission) result.push(permission);
  });

  return [...new Set(result)];
}


function buildModuleAccess_(permissions, role) {
  const has = permission =>
    permissions.includes(permission);

  role = cleanKey_(role);

  return {
    site: has('SITE_VIEW'),
    equipment: has('EQUIPMENT_VIEW'),
    warehouse: has('WAREHOUSE_VIEW'),
    deliveries: has('DELIVERY_VIEW'),

    documents:
      has('RFI_CREATE') ||
      has('RAMS_CREATE') ||
      has('EPERMIT_CREATE'),

    mechanical: has('MECHANICAL_VIEW'),
    electrical: has('ELECTRICAL_VIEW'),

    purchases:
      ['ADMIN', 'PROJECT_MANAGER', 'SITE_MANAGER', 'ENGINEER']
        .includes(role),

    globalAdmin:
      has('ADMIN_USERS') ||
      has('ADMIN_PROJECTS')
  };
}


/* =========================================================
   TABLE / REQUEST HELPERS
   ========================================================= */

function readTable_(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getDisplayValues();

  if (!values.length) return [];

  const headers =
    values[0].map(header => cleanKey_(header));

  const rows = [];

  for (let i = 1; i < values.length; i++) {
    const sourceRow = values[i];

    const isEmpty =
      sourceRow.every(value => !cleanText_(value));

    if (isEmpty) continue;

    const obj = {};

    headers.forEach((header, index) => {
      if (!header) return;
      obj[header] = sourceRow[index];
    });

    rows.push(obj);
  }

  return rows;
}


function headerMap_(headers) {
  const map = {};
  headers.forEach((header, index) => {
    map[cleanKey_(header)] = index;
  });
  return map;
}


function appendRowByHeaders_(sheet, valuesByHeader) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0];

  const map = headerMap_(headers);
  const row = new Array(lastColumn).fill('');

  Object.keys(valuesByHeader).forEach(key => {
    const normalized = cleanKey_(key);

    if (map[normalized] === undefined) {
      throw new Error('Falta la columna ' + normalized + ' en ' + sheet.getName() + '.');
    }

    row[map[normalized]] = valuesByHeader[key];
  });

  sheet.appendRow(row);
}


function repairMalformedPurchaseRows_() {
  ensurePurchaseSheet_();

  const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);

  if (sh.getLastRow() < 2) {
    return 0;
  }

  const headers = sh
    .getRange(1, 1, 1, sh.getLastColumn())
    .getDisplayValues()[0];

  const map = headerMap_(headers);
  const data = sh
    .getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn())
    .getDisplayValues();

  const validProjects = new Set(
    readTable_(SHEETS.PROJECTS)
      .map(row => cleanKey_(row.PROYECTO_ID))
      .filter(Boolean)
  );

  let repaired = 0;

  data.forEach((row, index) => {
    const currentProjectId =
      cleanKey_(row[map.PROYECTO_ID]);

    if (validProjects.has(currentProjectId)) {
      return;
    }

    /*
      v0.3.1 wrote rows positionally after adding CLIENT_REQUEST_ID
      as the last column of an existing sheet. In those malformed rows:
      physical column C contains the real project ID.
    */
    const physicalProjectId =
      cleanKey_(row[2]);

    if (!validProjects.has(physicalProjectId)) {
      return;
    }

    const fixed = {
      REQUEST_ID: row[0],
      CLIENT_REQUEST_ID: row[1],
      PROYECTO_ID: row[2],
      FECHA_CREACION: row[3],
      CREADO_POR: row[4],
      SOLICITANTE: row[5],
      PROVEEDOR: row[6],
      FAMILIA: row[7],
      DESTINO_TIPO: row[8],
      DESTINO: row[9],
      DIRECCION_ENTREGA: row[10],
      CONTACTO_OBRA: row[11],
      FECHA_REQUERIDA: row[12],
      OFERTA_REF: row[13],
      MATERIALES_JSON: row[14],
      OBSERVACIONES: row[15],
      ESTADO: row[16],
      PO_NUMERO: row[17],
      FECHA_ENTREGA_PREVISTA: '',
      FECHA_ACTUALIZACION: row[18]
    };

    const output = new Array(sh.getLastColumn()).fill('');

    Object.keys(fixed).forEach(key => {
      if (map[key] !== undefined) {
        output[map[key]] = fixed[key];
      }
    });

    sh
      .getRange(index + 2, 1, 1, output.length)
      .setValues([output]);

    repaired++;
  });

  if (repaired) {
    SpreadsheetApp.flush();
  }

  return repaired;
}


function repairPurchaseRequestsV031() {
  const repaired = repairMalformedPurchaseRows_();

  Logger.log(
    'Solicitudes reparadas: ' + repaired
  );
}


function getRequestParams_(e) {
  if (!e) return {};

  if (
    e.postData &&
    e.postData.type &&
    e.postData.type.includes('application/json')
  ) {
    try {
      return JSON.parse(e.postData.contents || '{}');
    } catch (err) {
      throw new Error('JSON de entrada no válido.');
    }
  }

  return e.parameter || {};
}


function parsePayload_(value) {
  if (!value) return {};

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(String(value));
  } catch (err) {
    throw new Error('Payload no válido.');
  }
}


function safeJsonParse_(value, fallback) {
  try {
    return JSON.parse(String(value || ''));
  } catch (err) {
    return fallback;
  }
}


function postMessageHtml_(payload, type) {
  const safePayload =
    JSON.stringify(payload)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');

  const safeType =
    JSON.stringify(type || 'response');

  const safeSource =
    JSON.stringify(APP.MESSAGE_SOURCE);

  const safeOrigin =
    JSON.stringify(FRONTEND_ORIGIN);

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<script>
(function(){
  var message = {
    source: ${safeSource},
    type: ${safeType},
    payload: ${safePayload}
  };
  window.top.postMessage(message, ${safeOrigin});
})();
</script>
</body>
</html>
`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


/* =========================================================
   DATABASE / NORMALIZATION
   ========================================================= */

function getDb_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}


function getSheet_(name) {
  const sheet = getDb_().getSheetByName(name);

  if (!sheet) {
    throw new Error('No existe la hoja: ' + name);
  }

  return sheet;
}


function cleanText_(value) {
  return String(value == null ? '' : value)
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .trim();
}


function cleanEmail_(value) {
  return cleanText_(value)
    .replace(/\s+/g, '')
    .toLowerCase();
}


function cleanKey_(value) {
  return cleanText_(value)
    .replace(/\s+/g, '')
    .toUpperCase();
}


function isYes_(value) {
  const normalized = cleanKey_(value);

  return [
    'SI',
    'SÍ',
    'YES',
    'TRUE',
    '1'
  ].includes(normalized);
}


/* =========================================================
   TESTS
   ========================================================= */

function testUserAccess() {
  const email = 'dferrando@levitec.es';
  const user = getUserProfile_(email);
  const permissions = user ? getUserPermissions_(user.role) : [];
  const projects = user ? getUserProjects_(email, user.role) : [];

  Logger.log(JSON.stringify({
    user: user,
    projects: projects,
    permissions: permissions,
    modules: user ? buildModuleAccess_(permissions, user.role) : {}
  }, null, 2));
}
