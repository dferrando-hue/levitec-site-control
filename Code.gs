/* =========================================================
   LEVITEC SITE CONTROL
   CORE BACKEND v1.8.0 · Control Horario JSON Bridge
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
  VERSION: '1.12.3-rc13',
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
  PURCHASE_REQUESTS: 'SOLICITUDES_PEDIDO',
  DELIVERY_HISTORY: 'HISTORIAL_ENTREGAS',
  DELIVERY_COMMENTS: 'COMENTARIOS_ENTREGAS',
  CONSTRUCTION_MILESTONES: 'HITOS_CONSTRUCTIVOS',
  SUBMITTAL_PACKAGES: 'SUBMITTAL_PACKAGES',
  MECHANICAL_SUBMITTALS: 'MECHANICAL_SUBMITTALS',
  MILESTONE_SUBMITTALS: 'HITO_SUBMITTAL',
  FOK_MASTER: 'FOK_MASTER',
  FOK_PROJECT: 'FOK_PROJECT',
  MILESTONE_FOK: 'HITO_FOK',
  DRAWINGS: 'MECHANICAL_PLANOS',
  DRAWING_HISTORY: 'MECHANICAL_PLANOS_HISTORIAL',
  MILESTONE_DRAWINGS: 'HITO_PLANO',

  WAREHOUSES: 'ALMACENES',
  USER_WAREHOUSE: 'USUARIO_ALMACEN',
  WAREHOUSE_ZONES: 'ZONAS_ALMACEN',
  MATERIALS: 'MATERIALES',
  WAREHOUSE_STOCK: 'STOCK_ALMACEN',
  MATERIAL_REQUESTS: 'SOLICITUDES_MATERIAL'
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
  'HITO_ID',
  'RECEPCION_ESTADO',
  'FECHA_RECEPCION',
  'RECIBIDO_POR',
  'RECEPCION_NOTAS',
  'FECHA_ACTUALIZACION',
  'TRAMITADO_POR',
  'FECHA_INICIO_TRAMITACION',
  'EMAIL_ESTADO',
  'EMAIL_FECHA_ENVIO',
  'EMAIL_ERROR'
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

      case 'globalPurchaseSearch':
        return postMessageHtml_(globalPurchaseSearch_(p), 'globalPurchaseSearch');

      case 'purchaseSuggestions':
        return postMessageHtml_(purchaseSuggestions_(p), 'purchaseSuggestions');

      case 'purchaseCreate':
        return postMessageHtml_(purchaseCreate_(p), 'purchaseCreate');

      case 'purchaseNotify':
        try {
          return postMessageHtml_(purchaseNotify_(p), 'purchaseNotify');
        } catch (error) {
          return postMessageHtml_({ok:false,
            message:error && error.message ? error.message : String(error)},
            'purchaseNotify');
        }

      case 'purchaseUpdateStatus':
        return postMessageHtml_(purchaseUpdateStatus_(p), 'purchaseUpdateStatus');

      case 'warehouseSyncConfirmedOrders':
        return postMessageHtml_(warehouseSyncConfirmedOrders_(p), 'warehouseSyncConfirmedOrders');

      case 'warehouseReceiptDestinations':
        return warehouseModuleReply_(p,warehouseReceiptDestinationsRC13_,'warehouseReceiptDestinations');

      case 'warehouseOrderProgress':
        return postMessageHtml_(warehouseOrderProgress_(p), 'warehouseOrderProgress');

      case 'purchaseStartProcessing':
        return postMessageHtml_(purchaseStartProcessing_(p), 'purchaseStartProcessing');

      case 'deliveryList':
        return postMessageHtml_(deliveryList_(p), 'deliveryList');

      case 'deliveryCommentsList':
        return postMessageHtml_(deliveryCommentsList_(p), 'deliveryCommentsList');

      case 'deliveryCommentAdd':
        return postMessageHtml_(deliveryCommentAdd_(p), 'deliveryCommentAdd');

      case 'deliveryUpdateDate':
        return postMessageHtml_(deliveryUpdateDate_(p), 'deliveryUpdateDate');

      case 'deliveryConfirmReceipt':
        return postMessageHtml_(deliveryConfirmReceipt_(p), 'deliveryConfirmReceipt');

      case 'subcontractWorkSave':
        return postMessageHtml_(subcontractWorkSave_(p), 'subcontractWorkSave');

      case 'subcontractWorkDelete':
        return postMessageHtml_(subcontractWorkDelete_(p), 'subcontractWorkDelete');

      case 'deliveryLinkMilestone':
        return postMessageHtml_(deliveryLinkMilestone_(p), 'deliveryLinkMilestone');

      case 'constructionMilestoneSave':
        return postMessageHtml_(constructionMilestoneSave_(p), 'constructionMilestoneSave');

      case 'constructionMilestoneDelete':
        return postMessageHtml_(constructionMilestoneDelete_(p), 'constructionMilestoneDelete');

      case 'mechanicalDrawingHistory':
        return postMessageHtml_(mechanicalDrawingHistory_(p), 'mechanicalDrawingHistory');
      case 'mechanicalDrawingList':
        return postMessageHtml_(mechanicalDrawingList_(p), 'mechanicalDrawingList');
      case 'mechanicalDrawingSave':
        return postMessageHtml_(mechanicalDrawingSave_(p), 'mechanicalDrawingSave');
      case 'mechanicalDrawingMilestonesSave':
        return postMessageHtml_(mechanicalDrawingMilestonesSave_(p), 'mechanicalDrawingMilestonesSave');
      case 'mechanicalMilestoneDrawingsSaveBatch':
        return postMessageHtml_(mechanicalMilestoneDrawingsSaveBatch_(p), 'mechanicalMilestoneDrawingsSaveBatch');
      case 'mechanicalReadiness':
        return postMessageHtml_(mechanicalReadiness_(p), 'mechanicalReadiness');
      case 'mechanicalSubmittalSave':
        return postMessageHtml_(mechanicalSubmittalSave_(p), 'mechanicalSubmittalSave');

      case 'mechanicalSubmittalDelete':
        return postMessageHtml_(mechanicalSubmittalDelete_(p), 'mechanicalSubmittalDelete');

      case 'milestoneSubmittalLinksSaveBatch':
        return postMessageHtml_(milestoneSubmittalLinksSaveBatch_(p), 'milestoneSubmittalLinksSaveBatch');

      case 'fokProjectSave':
        return postMessageHtml_(fokProjectSave_(p), 'fokProjectSave');

      case 'fokCopyDocumentation':
        return postMessageHtml_(fokCopyDocumentation_(p), 'fokCopyDocumentation');

      case 'milestoneFokLinksSaveBatch':
        return postMessageHtml_(milestoneFokLinksSaveBatch_(p), 'milestoneFokLinksSaveBatch');

      case 'workControlBootstrap':
        return postMessageHtml_(workControlBootstrap_(p), 'workControlBootstrap');

      case 'workControlMonth':
        return postMessageHtml_(workControlMonth_(p), 'workControlMonth');

      case 'workControlDay':
        return postMessageHtml_(workControlDay_(p), 'workControlDay');

      case 'workControlPresence':
        return postMessageHtml_(workControlPresence_(p), 'workControlPresence');

      case 'workControlUpdate':
        return postMessageHtml_(workControlUpdate_(p), 'workControlUpdate');

      case 'workControlBulkValidate':
        return postMessageHtml_(workControlBulkValidate_(p), 'workControlBulkValidate');

      case 'workControlIncidentUpdate':
        return postMessageHtml_(workControlIncidentUpdate_(p), 'workControlIncidentUpdate');

      case 'workControlIncidentCorrect':
        return postMessageHtml_(workControlIncidentCorrect_(p), 'workControlIncidentCorrect');

      case 'workControlIncidentDiscard':
        return postMessageHtml_(workControlIncidentDiscard_(p), 'workControlIncidentDiscard');

      case 'equipmentLocationsGlobal':
        return postMessageHtml_(equipmentLocationsGlobal_(p), 'equipmentLocationsGlobal');

      case 'warehouseBootstrap':
        return warehouseModuleReply_(p, warehouseBootstrap_, 'warehouseBootstrap');

      case 'warehouseStockList':
        return warehouseModuleReply_(p, warehouseStockList_, 'warehouseStockList');

      case 'warehouseRequestCreate':
        return warehouseModuleReply_(p, warehouseRequestCreate_, 'warehouseRequestCreate');

      case 'warehouseRequestList':
        return warehouseModuleReply_(p, warehouseRequestList_, 'warehouseRequestList');

      case 'warehouseZoneCreate':
        return warehouseModuleReply_(p, warehouseZoneCreate_, 'warehouseZoneCreate');

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


/**
 * Lee las asignaciones de proyectos con validación de encabezados.
 * Compatibilidad: algunas hojas antiguas utilizan PROYECTO_I
 * en lugar de PROYECTO_ID. No se modifica la hoja original.
 */
function readUserProjectAssignments_() {
  const sh = getSheet_(SHEETS.USER_PROJECT);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn())
    .getDisplayValues()[0].map(cleanKey_);

  const projectColumn = headers.includes('PROYECTO_ID')
    ? 'PROYECTO_ID'
    : (headers.includes('PROYECTO_I') ? 'PROYECTO_I' : '');

  if (!projectColumn) {
    throw new Error(
      'La hoja USUARIO_PROYECTO debe contener la columna PROYECTO_ID. ' +
      'Encabezados detectados: ' + headers.join(' | ')
    );
  }
  ['EMAIL', 'ACTIVO'].forEach(column => {
    if (!headers.includes(column)) {
      throw new Error('Falta la columna ' + column + ' en USUARIO_PROYECTO.');
    }
  });

  return readTable_(SHEETS.USER_PROJECT).map(row => ({
    ...row,
    PROYECTO_ID: cleanKey_(row[projectColumn])
  }));
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

  const assignments = readUserProjectAssignments_();
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


function purchaseCreatedAtValue_(value) {
  const text = cleanText_(value);
  const m = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (!m) return 0;

  return Date.UTC(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
    Number(m[6] || 0)
  );
}



function purchaseSearchNormalize_(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}


function globalPurchaseSearch_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  const query = cleanText_(payload.query);
  const normalizedQuery = purchaseSearchNormalize_(query);

  if (normalizedQuery.length < 2) {
    throw new Error('Introduce al menos 2 caracteres para buscar.');
  }

  ensurePurchaseSheet_();
  repairMalformedPurchaseRows_();

  const accessibleProjects = getUserProjects_(
    session.user.email,
    session.user.role
  );

  const projectMap = {};
  accessibleProjects.forEach(project => {
    projectMap[cleanKey_(project.id)] = project;
  });

  const allowedProjectIds = new Set(Object.keys(projectMap));

  const userNameMap = {};
  readTable_(SHEETS.USERS).forEach(row => {
    const email = cleanEmail_(row.EMAIL);
    if (!email) return;
    userNameMap[email] = cleanText_(row.NOMBRE) || email;
  });

  const tokens = normalizedQuery
    .split(/\s+/)
    .map(x => x.trim())
    .filter(Boolean);

  const results = [];

  readTable_(SHEETS.PURCHASE_REQUESTS).forEach(row => {
    const projectId = cleanKey_(row.PROYECTO_ID);
    if (!allowedProjectIds.has(projectId)) return;

    const materials = safeJsonParse_(row.MATERIALES_JSON, []);
    const createdBy = cleanEmail_(row.CREADO_POR);
    const creatorName =
      userNameMap[createdBy] ||
      cleanText_(row.SOLICITANTE) ||
      createdBy;

    const fields = [
      row.REQUEST_ID,
      row.PO_NUMERO,
      row.CLIENT_REQUEST_ID,
      row.PROYECTO_ID,
      row.PROVEEDOR,
      row.FAMILIA,
      row.DESTINO,
      row.DESTINO_TIPO,
      row.OFERTA_REF,
      row.OBSERVACIONES,
      row.SOLICITANTE,
      row.CREADO_POR,
      creatorName
    ];

    materials.forEach(item => {
      fields.push(
        item.reference,
        item.description,
        item.quantity
      );
    });

    const haystack = purchaseSearchNormalize_(fields.join(' '));

    if (!tokens.every(token => haystack.includes(token))) {
      return;
    }

    const poNumber = cleanText_(row.PO_NUMERO);
    const requestId = cleanText_(row.REQUEST_ID);

    let score = 10;

    if (purchaseSearchNormalize_(poNumber) === normalizedQuery) score = 100;
    else if (purchaseSearchNormalize_(requestId) === normalizedQuery) score = 95;
    else if (purchaseSearchNormalize_(poNumber).startsWith(normalizedQuery)) score = 80;
    else if (purchaseSearchNormalize_(requestId).startsWith(normalizedQuery)) score = 75;
    else if (purchaseSearchNormalize_(poNumber).includes(normalizedQuery)) score = 65;
    else if (purchaseSearchNormalize_(requestId).includes(normalizedQuery)) score = 60;

    results.push({
      requestId: requestId,
      projectId: projectId,
      projectName: projectMap[projectId] ? projectMap[projectId].name : projectId,
      campus: projectMap[projectId] ? projectMap[projectId].campus : '',
      createdAt: cleanText_(row.FECHA_CREACION),
      createdBy: createdBy,
      creatorName: creatorName,
      requester: cleanText_(row.SOLICITANTE),
      supplier: cleanText_(row.PROVEEDOR),
      family: cleanText_(row.FAMILIA),
      destinationType: cleanText_(row.DESTINO_TIPO),
      destination: cleanText_(row.DESTINO),
      requiredDate: cleanText_(row.FECHA_REQUERIDA),
      quoteRef: cleanText_(row.OFERTA_REF),
      materials: materials,
      notes: cleanText_(row.OBSERVACIONES),
      status: cleanKey_(row.ESTADO),
      poNumber: poNumber,
      expectedDeliveryDate: cleanText_(row.FECHA_ENTREGA_PREVISTA),
      score: score
    });
  });

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

    const byDate =
      purchaseCreatedAtValue_(b.createdAt) -
      purchaseCreatedAtValue_(a.createdAt);

    if (byDate !== 0) return byDate;

    return String(b.requestId).localeCompare(
      String(a.requestId),
      undefined,
      {numeric:true}
    );
  });

  return {
    ok: true,
    query: query,
    total: results.length,
    results: results.slice(0, 50)
  };
}


function purchaseList_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  requireProjectAccess_(session, projectId);

  ensurePurchaseSheet_();
  repairMalformedPurchaseRows_();

  const purchaseUserNames = {};
  readTable_(SHEETS.USERS).forEach(row => {
    const email = cleanEmail_(row.EMAIL);
    if (email) purchaseUserNames[email] = cleanText_(row.NOMBRE) || email;
  });

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
      receiptStatus: cleanKey_(row.RECEPCION_ESTADO),
      receivedAt: cleanText_(row.FECHA_RECEPCION),
      receivedBy: cleanText_(row.RECIBIDO_POR),
      receiptNotes: cleanText_(row.RECEPCION_NOTAS),
      updatedAt: cleanText_(row.FECHA_ACTUALIZACION),
      processingBy: cleanEmail_(row.TRAMITADO_POR),
      processingByName: purchaseUserNames[cleanEmail_(row.TRAMITADO_POR)] || cleanEmail_(row.TRAMITADO_POR),
      processingStartedAt: cleanText_(row.FECHA_INICIO_TRAMITACION),
      emailStatus: cleanKey_(row.EMAIL_ESTADO)
    }))
    .sort((a, b) => {
      const byDate =
        purchaseCreatedAtValue_(b.createdAt) -
        purchaseCreatedAtValue_(a.createdAt);

      if (byDate !== 0) return byDate;

      return String(b.requestId).localeCompare(
        String(a.requestId),
        undefined,
        {numeric:true}
      );
    });

  return {
    ok: true,
    projectId: projectId,
    requests: rows
  };
}



function purchaseAdministrationRecipients_(projectId) {
  // El rol determina permisos, no quién recibe avisos de pedidos.
  // Solo se notifican usuarios activos, asignados al proyecto y con
  // NOTIFICAR_PEDIDOS = SI. EMAIL_EMPRESA es el destinatario real.
  const assignedEmails = new Set(
    readUserProjectAssignments_()
      .filter(row =>
        isYes_(row.ACTIVO) &&
        cleanKey_(row.PROYECTO_ID) === cleanKey_(projectId)
      )
      .map(row => cleanEmail_(row.EMAIL))
      .filter(Boolean)
  );

  const users = readTable_(SHEETS.USERS);
  const missingColumn = users.length &&
    !Object.prototype.hasOwnProperty.call(users[0], 'NOTIFICAR_PEDIDOS');
  if (missingColumn) {
    throw new Error('Falta la columna NOTIFICAR_PEDIDOS en USUARIOS. ' +
      'Añádela y marca SI para los destinatarios de avisos.');
  }

  const recipientsUsers = users.filter(row =>
    isYes_(row.ACTIVO) &&
    isYes_(row.NOTIFICAR_PEDIDOS) &&
    assignedEmails.has(cleanEmail_(row.EMAIL))
  );
  if (!recipientsUsers.length) return [];

  const missing = recipientsUsers.filter(row => !cleanEmail_(row.EMAIL_EMPRESA));
  if (missing.length) {
    throw new Error('Falta EMAIL_EMPRESA para los usuarios que tienen ' +
      'NOTIFICAR_PEDIDOS = SI: ' +
      missing.map(row => cleanEmail_(row.EMAIL)).join(', '));
  }

  const recipients = [...new Set(
    recipientsUsers.map(row => cleanEmail_(row.EMAIL_EMPRESA))
  )];
  const invalid = recipients.filter(email =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
  if (invalid.length) {
    throw new Error('EMAIL_EMPRESA contiene direcciones no válidas: ' + invalid.join(', '));
  }
  return recipients;
}

function purchaseProjectName_(projectId) {
  const row = readTable_(SHEETS.PROJECTS).find(project =>
    cleanKey_(project.PROYECTO_ID) === cleanKey_(projectId)
  );

  return row
    ? cleanText_(row.NOMBRE) || cleanKey_(projectId)
    : cleanKey_(projectId);
}


function purchaseQuoteBlob_(quotePdf) {
  if (!quotePdf || !quotePdf.base64) return null;

  const mimeType = cleanText_(quotePdf.mimeType) || 'application/pdf';
  if (mimeType !== 'application/pdf') {
    throw new Error('La oferta adjunta debe ser un archivo PDF.');
  }

  const bytes = Utilities.base64Decode(String(quotePdf.base64));
  const maxBytes = 8 * 1024 * 1024;

  if (bytes.length > maxBytes) {
    throw new Error('La oferta PDF supera 8 MB.');
  }

  const fileName = cleanText_(quotePdf.name) || 'oferta.pdf';
  const safeName = /\.pdf$/i.test(fileName) ? fileName : fileName + '.pdf';

  return Utilities.newBlob(bytes, 'application/pdf', safeName);
}


function purchaseEmailEscape_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function purchaseRequestEmailHtml_(request) {
  const materials = Array.isArray(request.materials) ? request.materials : [];

  const materialRows = materials.map(item => `
    <tr>
      <td style="padding:7px 8px;border-bottom:1px solid #e7ecef">${purchaseEmailEscape_(item.reference)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #e7ecef">${purchaseEmailEscape_(item.description)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #e7ecef;text-align:right">${purchaseEmailEscape_(item.quantity)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #e7ecef;text-align:right">${purchaseEmailEscape_(item.unitPrice)}</td>
    </tr>
  `).join('');

  const line = (label, value) => `
    <tr>
      <td style="width:190px;padding:6px 8px;color:#60727d"><b>${purchaseEmailEscape_(label)}</b></td>
      <td style="padding:6px 8px">${purchaseEmailEscape_(value) || '—'}</td>
    </tr>`;

  return `
    <div style="font-family:Arial,sans-serif;color:#173042;max-width:920px">
      <div style="border-left:5px solid #008b87;padding-left:14px;margin-bottom:18px">
        <h2 style="margin:0 0 4px;color:#087f7b">Nueva solicitud de pedido</h2>
        <div style="color:#60727d">LEVITEC Site Control</div>
      </div>

      <table style="border-collapse:collapse;width:100%;margin-bottom:20px;font-size:13px">
        ${line('Solicitud', request.requestId)}
        ${line('Proyecto', request.projectId + ' · ' + request.projectName)}
        ${line('Creado por', request.creatorName + ' · ' + request.createdBy)}
        ${line('Fecha de creación', request.createdAt)}
        ${line('Proveedor', request.supplier)}
        ${line('Familia / imputación', request.family)}
        ${line('Fecha requerida', request.requiredDate)}
        ${line('Tipo de destino', request.destinationType)}
        ${line('Destino', request.destination)}
        ${line('Dirección de entrega', request.deliveryAddress)}
        ${line('Contacto en obra', request.siteContact)}
        ${line('Oferta / presupuesto', request.quoteRef)}
        ${line('Observaciones', request.notes)}
      </table>

      <h3 style="font-size:15px;margin:0 0 8px">Materiales</h3>
      <table style="border-collapse:collapse;width:100%;font-size:12px">
        <thead>
          <tr style="background:#eef7f6">
            <th style="text-align:left;padding:7px 8px">Referencia</th>
            <th style="text-align:left;padding:7px 8px">Descripción</th>
            <th style="text-align:right;padding:7px 8px">Cantidad</th>
            <th style="text-align:right;padding:7px 8px">Precio unit.</th>
          </tr>
        </thead>
        <tbody>${materialRows || '<tr><td colspan="4" style="padding:8px">Sin líneas de material.</td></tr>'}</tbody>
      </table>

      <p style="margin-top:20px;font-size:11px;color:#72838d">
        Si la solicitud incluía una oferta PDF, se adjunta a este correo. El archivo no se almacena permanentemente en Site Control ni en Google Drive.
      </p>
    </div>`;
}


function notifyAdministrationPurchaseRequest_(request, quoteBlob, recipients) {
  const subject =
    '[Site Control] ' + request.requestId +
    ' · ' + request.projectId +
    ' · ' + request.supplier;

  const options = {
    htmlBody: purchaseRequestEmailHtml_(request),
    name: 'LEVITEC Site Control'
  };

  if (quoteBlob) {
    options.attachments = [quoteBlob];
  }

  MailApp.sendEmail(
    recipients.join(','),
    subject,
    'Nueva solicitud ' + request.requestId + ' para ' + request.projectId,
    options
  );
}


function purchaseCreate_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);
  const projectId = cleanKey_(payload.projectId);
  requireProjectAccess_(session, projectId);

  const administrationRecipients = purchaseAdministrationRecipients_(projectId);
  if (!administrationRecipients.length) {
    throw new Error(
      'No hay destinatarios de pedidos activos asignados a ' +
      projectId + '. Marca NOTIFICAR_PEDIDOS = SI en USUARIOS y revisa USUARIO_PROYECTO.'
    );
  }

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

  validateBusinessDateSC3_(requiredDate, 'La fecha requerida');

  if (!materials.length && !notes) {
    throw new Error(
      'Indica al menos una línea de material o una observación de pedido.'
    );
  }

  const createLock = LockService.getScriptLock();
  if (!createLock.tryLock(20000)) {
    throw new Error('Hay otra solicitud en proceso. Espera unos segundos y vuelve a intentarlo.');
  }

  try {
    ensurePurchaseSheet_();

    const existing = readTable_(SHEETS.PURCHASE_REQUESTS)
      .find(row => cleanText_(row.CLIENT_REQUEST_ID) === clientRequestId);

    if (existing) {
      // SC-A01: un identificador no acredita proyecto ni propietario.
      const previousProject = cleanKey_(existing.PROYECTO_ID);
      requireProjectAccess_(session, previousProject);
      if (previousProject !== projectId ||
          !cleanEmail_(existing.CREADO_POR) ||
          cleanEmail_(existing.CREADO_POR) !== cleanEmail_(session.user.email)) {
        throw new Error('El identificador de solicitud ya existe para otro usuario o proyecto.');
      }
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
      RECEPCION_ESTADO: '',
      FECHA_RECEPCION: '',
      RECIBIDO_POR: '',
      RECEPCION_NOTAS: '',
      FECHA_ACTUALIZACION: now,
      EMAIL_ESTADO: 'PENDIENTE'
    });

    return {
      ok: true,
      duplicate: false,
      emailPending: true,
      message: 'Solicitud guardada. Enviando aviso a Administración…',
      requestId: requestId
    };
  } finally {
    createLock.releaseLock();
  }

}


function purchaseNotify_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);
  const requestId = cleanText_(payload.requestId);
  if (!requestId) throw new Error('Identificador de solicitud requerido.');

  // No se guarda el PDF: se recibe únicamente en esta llamada de notificación.
  const quoteBlob = purchaseQuoteBlob_(payload.quotePdf);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    throw new Error('Hay otra notificación en curso. Vuelve a intentarlo.');
  }

  try {
    ensurePurchaseSheet_();
    const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
    const values = sh.getDataRange().getDisplayValues();
    const headers = headerMap_(values[0]);
    const index = values.findIndex((row, i) =>
      i > 0 && cleanText_(row[headers.REQUEST_ID]) === requestId
    );
    if (index < 1) throw new Error('Solicitud no encontrada.');
    const row = values[index];
    const val = key => cleanText_(row[headers[key]]);
    const projectId = cleanKey_(val('PROYECTO_ID'));
    requireProjectAccess_(session, projectId);
    if (cleanEmail_(val('CREADO_POR')) !== cleanEmail_(session.user.email) &&
        cleanKey_(session.user.role) !== 'ADMIN') {
      throw new Error('Solo el solicitante o un administrador puede notificar esta solicitud.');
    }
    if (cleanKey_(val('EMAIL_ESTADO')) === 'ENVIADO') {
      return {ok:true, alreadySent:true, requestId,
        message:'El correo ya había sido enviado a Administración.'};
    }
    if (['ENVIANDO','REVISAR_ENVIO','ERROR'].includes(cleanKey_(val('EMAIL_ESTADO')))) {
      return {ok:false, emailSent:null, emailUncertain:true, requestId,
        message:'El resultado del envío anterior está pendiente de comprobar. Revisa el correo con Administración antes de autorizar otro envío.'};
    }
    const recipients = purchaseAdministrationRecipients_(projectId);
    if (!recipients.length) {
      throw new Error('No hay destinatarios con NOTIFICAR_PEDIDOS = SI asignados a ' + projectId + '.');
    }
    let materials=[];
    try { materials=JSON.parse(val('MATERIALES_JSON')||'[]'); }
    catch(e) { throw new Error('No se pueden leer las líneas de la solicitud.'); }
    const request = {
      requestId,
      projectId,
      projectName: purchaseProjectName_(projectId),
      createdAt: val('FECHA_CREACION'),
      createdBy: val('CREADO_POR'),
      creatorName: val('SOLICITANTE'),
      supplier: val('PROVEEDOR'),
      family: val('FAMILIA'),
      destinationType: val('DESTINO_TIPO'),
      destination: val('DESTINO'),
      deliveryAddress: val('DIRECCION_ENTREGA'),
      siteContact: val('CONTACTO_OBRA'),
      requiredDate: val('FECHA_REQUERIDA'),
      quoteRef: val('OFERTA_REF'),
      notes: val('OBSERVACIONES'),
      materials
    };
    ['EMAIL_ESTADO','EMAIL_FECHA_ENVIO','EMAIL_ERROR'].forEach(key => {
      if (headers[key] === undefined) throw new Error('Falta la columna ' + key + ' para registrar el envío.');
    });
    const r = index + 1;
    // SC-A02: persistir la intención antes del correo; un resultado incierto no se reenvía.
    sh.getRange(r,headers.EMAIL_ESTADO+1).setValue('ENVIANDO');
    SpreadsheetApp.flush();
    let emailAcknowledged = false;
    try {
      notifyAdministrationPurchaseRequest_(request, quoteBlob, recipients);
      emailAcknowledged = true;
      sh.getRange(r,headers.EMAIL_FECHA_ENVIO+1).setValue(
        Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Europe/Madrid','yyyy-MM-dd HH:mm:ss')
      );
      sh.getRange(r,headers.EMAIL_ERROR+1).clearContent();
      // ENVIADO cierra el registro; una interrupción anterior mantiene ENVIANDO.
      sh.getRange(r,headers.EMAIL_ESTADO+1).setValue('ENVIADO');
      SpreadsheetApp.flush();
      return {ok:true, emailSent:true, requestId,
        message:'Solicitud ' + requestId + ' enviada a ' + recipients.length + ' correo(s) corporativo(s).'};
    } catch (err) {
      const message = err && err.message ? err.message : 'Resultado de envío no confirmado';
      try {
        sh.getRange(r,headers.EMAIL_ESTADO+1).setValue('REVISAR_ENVIO');
        sh.getRange(r,headers.EMAIL_ERROR+1).setValue(message.slice(0,500));
        SpreadsheetApp.flush();
      } catch (recordError) {
        // La intención persistida sigue bloqueando el reenvío automático.
      }
      return {ok:emailAcknowledged, emailSent:emailAcknowledged ? true : null,
        emailUncertain:true, requestId,
        message:emailAcknowledged
          ? 'Google ha aceptado el correo, pero no se ha podido cerrar su registro. Comprueba el envío con Administración; no lo reenvíes.'
          : 'No se puede confirmar el resultado del correo. Comprueba el envío con Administración antes de autorizar otro envío.'};
    }
  } finally {
    lock.releaseLock();
  }
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


function purchaseStartProcessing_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);
  const role = cleanKey_(session.user.role);
  const canManage =
    ['ADMIN', 'PROJECT_MANAGER', 'SITE_MANAGER', 'ADMINISTRATION'].includes(role) ||
    session.permissions.includes('PURCHASE_MANAGE');

  if (!canManage) throw new Error('No tienes permiso para tramitar pedidos.');

  const requestId = cleanText_(payload.requestId);
  if (!requestId) throw new Error('Identificador de solicitud requerido.');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    throw new Error('Hay otra operación en curso. Actualiza y vuelve a intentarlo.');
  }

  try {
    ensurePurchaseSheet_();
    const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
    const data = sh.getDataRange().getDisplayValues();
    const h = headerMap_(data[0]);
    const rowIndex = data.findIndex((row, i) =>
      i > 0 && cleanText_(row[h.REQUEST_ID]) === requestId
    );
    if (rowIndex < 1) throw new Error('No existe la solicitud.');

    const row = data[rowIndex];
    requireProjectAccess_(session, cleanKey_(row[h.PROYECTO_ID]));

    const currentStatus = cleanKey_(row[h.ESTADO]);
    const processingBy = cleanEmail_(row[h.TRAMITADO_POR]);

    if (currentStatus !== 'PENDIENTE_ADMINISTRACION') {
      return {
        ok: false,
        message: 'Esta solicitud ya no está pendiente. Actualiza el listado para ver quién la tramita.'
      };
    }

    if (processingBy) {
      return {
        ok: false,
        message: 'La solicitud ya tiene un administrativo que inició la tramitación.'
      };
    }

    const now = Utilities.formatDate(
      new Date(), Session.getScriptTimeZone() || 'Europe/Madrid',
      'yyyy-MM-dd HH:mm:ss'
    );

    const rowNumber = rowIndex + 1;
    sh.getRange(rowNumber, h.ESTADO + 1).setValue('EN_TRAMITACION');
    sh.getRange(rowNumber, h.TRAMITADO_POR + 1).setValue(session.user.email);
    sh.getRange(rowNumber, h.FECHA_INICIO_TRAMITACION + 1).setValue(now);
    sh.getRange(rowNumber, h.FECHA_ACTUALIZACION + 1).setValue(now);
    SpreadsheetApp.flush();

    return {
      ok: true,
      requestId: requestId,
      message: 'Tramitación iniciada por ' +
        (session.user.name || session.user.email) + '.'
    };
  } finally {
    lock.releaseLock();
  }
}


function purchaseUpdateStatus_(p) {
  const session = requireAuthenticatedUser_(p, 'CORE_VIEW');
  const payload = parsePayload_(p.payload);

  const canManagePurchases =
    ['ADMIN', 'PROJECT_MANAGER', 'SITE_MANAGER', 'ADMINISTRATION'].includes(
      cleanKey_(session.user.role)
    ) ||
    session.permissions.includes('PURCHASE_MANAGE');

  if (!canManagePurchases) {
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

  if (expectedDeliveryDate) validateBusinessDateSC3_(expectedDeliveryDate, 'La fecha prevista');

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

  const currentStatus = cleanKey_(
    sh.getRange(foundRow, headers.ESTADO + 1).getDisplayValue()
  );

  if (
    currentStatus !== 'PENDIENTE_ADMINISTRACION' &&
    status === 'PENDIENTE_ADMINISTRACION'
  ) {
    throw new Error('No se puede devolver a pendiente una solicitud que ya ha iniciado su tramitación.');
  }

  if (
    currentStatus === 'CONFIRMADO_PROVEEDOR' &&
    status !== 'CONFIRMADO_PROVEEDOR'
  ) {
    throw new Error(
      'El pedido ya está confirmado por proveedor. Puedes editar sus datos, pero no volver a tramitarlo.'
    );
  }

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const existingProcessingBy = cleanEmail_(
    sh.getRange(foundRow, headers.TRAMITADO_POR + 1).getDisplayValue()
  );
  const markProcessing =
    !existingProcessingBy &&
    ['EN_TRAMITACION', 'PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(status);

  const updates = {
    FAMILIA: family,
    ESTADO: status,
    PO_NUMERO: poNumber,
    FECHA_ENTREGA_PREVISTA: expectedDeliveryDate,
    FECHA_ACTUALIZACION: now
  };

  if (markProcessing) {
    updates.TRAMITADO_POR = session.user.email;
    updates.FECHA_INICIO_TRAMITACION = now;
  }

  Object.keys(updates).forEach(header => {
    if (headers[header] === undefined) {
      throw new Error('Falta la columna ' + header + ' en SOLICITUDES_PEDIDO.');
    }

    sh.getRange(foundRow, headers[header] + 1).setValue(updates[header]);
  });

  SpreadsheetApp.flush();

  let warehouseSync = null;
  if (status === 'CONFIRMADO_PROVEEDOR') {
    const rowForSync = readTable_(SHEETS.PURCHASE_REQUESTS)
      .find(r => cleanText_(r.REQUEST_ID) === requestId);
    warehouseSync = warehouseSyncOne_(rowForSync, false);
  }

  return {
    ok: true,
    warehouseSync: warehouseSync,
    message: warehouseSync && warehouseSync.ok === false
      ? 'Pedido guardado en Site Control, pero no sincronizado con Warehouse: ' + warehouseSync.error
      : 'Pedido actualizado correctamente.' + (warehouseSync && warehouseSync.ok ? ' Sincronizado con Warehouse.' : ''),
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

  let lastColumn = sh.getLastColumn();

  let currentHeaders = sh
    .getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0]
    .map(cleanKey_);

  PURCHASE_HEADERS.forEach(header => {
    const normalized = cleanKey_(header);

    if (currentHeaders.includes(normalized)) {
      return;
    }

    const nextColumn = lastColumn + 1;

    if (nextColumn > sh.getMaxColumns()) {
      sh.insertColumnAfter(sh.getMaxColumns());
    }

    sh.getRange(1, nextColumn).setValue(header);

    currentHeaders.push(normalized);
    lastColumn = nextColumn;
  });

  const headers = sh
    .getRange(1, 1, 1, sh.getLastColumn())
    .getDisplayValues()[0];

  const map = headerMap_(headers);

  if (
    map.FECHA_ENTREGA_PREVISTA !== undefined &&
    map.FECHA_ACTUALIZACION !== undefined &&
    sh.getLastRow() > 1
  ) {
    const deliveryRange = sh.getRange(
      2,
      map.FECHA_ENTREGA_PREVISTA + 1,
      sh.getLastRow() - 1,
      1
    );

    const updateRange = sh.getRange(
      2,
      map.FECHA_ACTUALIZACION + 1,
      sh.getLastRow() - 1,
      1
    );

    const deliveryValues = deliveryRange.getDisplayValues();
    const updateValues = updateRange.getDisplayValues();

    let changed = false;

    for (let i = 0; i < deliveryValues.length; i++) {
      const deliveryValue = cleanText_(deliveryValues[i][0]);
      const updateValue = cleanText_(updateValues[i][0]);

      const looksLikeTimestamp =
        /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(deliveryValue);

      if (looksLikeTimestamp && !updateValue) {
        updateValues[i][0] = deliveryValue;
        deliveryValues[i][0] = '';
        changed = true;
      }
    }

    if (changed) {
      deliveryRange.setValues(deliveryValues);
      updateRange.setValues(updateValues);
    }
  }

  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  sh.setFrozenRows(1);

  return sh;
}


function migratePurchaseSchemaV064_() {
  const sh = ensurePurchaseSheet_();

  Logger.log(
    'Schema SOLICITUDES_PEDIDO correcto. Columnas: ' +
    sh.getRange(1, 1, 1, sh.getLastColumn())
      .getDisplayValues()[0]
      .join(' | ')
  );
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
   DELIVERIES
   ========================================================= */

function deliveryList_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);
  const projectId = cleanKey_(payload.projectId);

  requireProjectAccess_(session, projectId);
  ensurePurchaseSheet_();
  ensureDeliveryHistorySheet_();
  ensureConstructionMilestonesSheet_();
  ensurePlanningSheet_('ENTREGA_HITOS', ['REQUEST_ID','PROYECTO_ID','HITOS_JSON','ACTUALIZADO_POR','FECHA_ACTUALIZACION']);
  ensurePlanningSheet_('PLAN_SUBCONTRATAS', ['PLAN_ID','PROYECTO_ID','SUBCONTRATA','ACTIVIDAD','INICIO','FIN','PERSONAL_PREVISTO','PERSONAL_REAL','ESTADO','HITOS_JSON','NOTAS','ACTIVO','ACTUALIZADO_POR','FECHA_ACTUALIZACION']);

  const milestones = readTable_(SHEETS.CONSTRUCTION_MILESTONES)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === projectId &&
      cleanKey_(row.ACTIVO || 'SI') !== 'NO'
    )
    .map(row => ({
      milestoneId: cleanText_(row.HITO_ID),
      projectId: cleanKey_(row.PROYECTO_ID),
      title: cleanText_(row.TITULO),
      date: cleanText_(row.FECHA_HITO),
      type: cleanText_(row.TIPO),
      discipline: cleanText_(row.DISCIPLINA),
      notes: cleanText_(row.NOTAS)
    }))
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.title.localeCompare(b.title));

  ensureMechanicalSubmittalSheets_();
  const readinessMap = mechanicalReadinessMap_(projectId, milestones);
  milestones.forEach(m => {
    m.documentReadiness = readinessMap[m.milestoneId] || null;
  });

  const milestoneById = {};
  milestones.forEach(m => milestoneById[m.milestoneId] = m);

  const linkMap = {};
  readTable_('ENTREGA_HITOS').filter(r => cleanKey_(r.PROYECTO_ID) === projectId).forEach(r => {
    const ids = safeJsonParse_(r.HITOS_JSON, []);
    linkMap[cleanText_(r.REQUEST_ID)] = Array.isArray(ids) ? ids.map(cleanText_).filter(Boolean) : [];
  });
  const subcontractWorks = readTable_('PLAN_SUBCONTRATAS')
    .filter(r => cleanKey_(r.PROYECTO_ID) === projectId && cleanKey_(r.ACTIVO || 'SI') !== 'NO')
    .map(r => ({id:cleanText_(r.PLAN_ID),projectId:projectId,supplier:cleanText_(r.SUBCONTRATA),activity:cleanText_(r.ACTIVIDAD),start:cleanText_(r.INICIO),end:cleanText_(r.FIN),planned:Number(r.PERSONAL_PREVISTO)||0,actual:r.PERSONAL_REAL === '' ? null : Number(r.PERSONAL_REAL),status:cleanText_(r.ESTADO),milestoneIds:safeJsonParse_(r.HITOS_JSON, []),notes:cleanText_(r.NOTAS)}));

  const deliveries = readTable_(SHEETS.PURCHASE_REQUESTS)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === projectId &&
      cleanKey_(row.ESTADO) !== 'CANCELADO'
    )
    .map(row => {
      const milestoneId = cleanText_(row.HITO_ID);
      const milestoneIds = Object.prototype.hasOwnProperty.call(linkMap, cleanText_(row.REQUEST_ID)) ? linkMap[cleanText_(row.REQUEST_ID)] : (milestoneId ? [milestoneId] : []);
      const milestone = milestoneById[milestoneIds[0]] || null;

      return {
        requestId: cleanText_(row.REQUEST_ID),
        projectId: cleanKey_(row.PROYECTO_ID),
        supplier: cleanText_(row.PROVEEDOR),
        family: cleanText_(row.FAMILIA),
        poNumber: cleanText_(row.PO_NUMERO),
        expectedDeliveryDate: cleanText_(row.FECHA_ENTREGA_PREVISTA),
        requiredDate: cleanText_(row.FECHA_REQUERIDA),
        destinationType: cleanText_(row.DESTINO_TIPO),
        destination: cleanText_(row.DESTINO),
        deliveryAddress: cleanText_(row.DIRECCION_ENTREGA),
        siteContact: cleanText_(row.CONTACTO_OBRA),
        materials: safeJsonParse_(row.MATERIALES_JSON, []),
        purchaseStatus: cleanKey_(row.ESTADO),
        receiptStatus: cleanKey_(row.RECEPCION_ESTADO),
        receivedAt: cleanText_(row.FECHA_RECEPCION),
        receivedBy: cleanText_(row.RECIBIDO_POR),
        receiptNotes: cleanText_(row.RECEPCION_NOTAS),
        milestoneIds: milestoneIds.filter(id => !!milestoneById[id]),
        milestoneId: milestone ? milestone.milestoneId : '',
        milestoneTitle: milestone ? milestone.title : '',
        milestoneDate: milestone ? milestone.date : ''
      };
    })
    .sort((a, b) => (a.expectedDeliveryDate || '9999-12-31').localeCompare(b.expectedDeliveryDate || '9999-12-31'));

  return {
    ok:true,
    projectId:projectId,
    deliveries:deliveries,
    subcontractWorks:subcontractWorks,
    milestones:milestones
  };
}


// Historial de seguimiento independiente del listado general: se consulta solo al abrir un pedido.
function ensureDeliveryCommentsSheet_() {
  const ss = getDb_();
  let sh = ss.getSheetByName(SHEETS.DELIVERY_COMMENTS);
  if (!sh) {
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      sh = ss.getSheetByName(SHEETS.DELIVERY_COMMENTS);
      if (!sh) {
        sh = ss.insertSheet(SHEETS.DELIVERY_COMMENTS);
        sh.getRange(1, 1, 1, 6).setValues([[
          'COMENTARIO_ID','REQUEST_ID','PROYECTO_ID','COMENTARIO','AUTOR','FECHA_COMENTARIO'
        ]]).setFontWeight('bold');
        sh.setFrozenRows(1);
      }
    } finally { lock.releaseLock(); }
  }
  return sh;
}

function deliveryCommentRequest_(session, requestId) {
  if (!requestId) throw new Error('REQUEST_ID requerido.');
  ensurePurchaseSheet_();
  const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
  const lastRow = sh.getLastRow();
  if (lastRow < 2) throw new Error('No existe el pedido indicado.');
  const headers = headerMap_(sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0]);
  const matches = sh.getRange(2, headers.REQUEST_ID+1, lastRow-1, 1)
    .createTextFinder(requestId).matchEntireCell(true).findAll();
  if (!matches.length) throw new Error('No existe el pedido indicado.');
  const row = matches[0].getRow();
  const projectId = cleanKey_(sh.getRange(row, headers.PROYECTO_ID+1).getDisplayValue());
  requireProjectAccess_(session, projectId);
  return projectId;
}

function deliveryCommentsList_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);
  const requestId = cleanText_(payload.requestId);
  const projectId = deliveryCommentRequest_(session, requestId);
  const sh = ensureDeliveryCommentsSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {ok:true,requestId:requestId,comments:[]};
  const matches = sh.getRange(2,2,lastRow-1,1)
    .createTextFinder(requestId).matchEntireCell(true).findAll();
  // Solo los 50 comentarios más recientes. Sin añadir el historial a deliveryList_.
  const rows = matches.map(r => r.getRow()).sort((a,b)=>b-a).slice(0,50);
  const first = rows.length ? Math.min.apply(null, rows) : 0;
  const last = rows.length ? Math.max.apply(null, rows) : 0;
  const values = rows.length ? sh.getRange(first,1,last-first+1,6).getDisplayValues() : [];
  const comments = rows.map(row => {
    const v = values[row-first];
    return {id:v[0],text:v[3],author:v[4],createdAt:v[5]};
  });
  return {ok:true,requestId:requestId,projectId:projectId,comments:comments,hasMore:matches.length>50};
}

function deliveryCommentAdd_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);
  const requestId = cleanText_(payload.requestId);
  const comment = cleanText_(payload.comment);
  if (!comment || comment.length>1500) throw new Error('Escribe un comentario de hasta 1500 caracteres.');
  const projectId = deliveryCommentRequest_(session, requestId);
  const sh = ensureDeliveryCommentsSheet_();
  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss');
  const id = 'COM-' + Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
  // Escritura puntual, sin recalcular el resto de entregas ni consultar hitos.
  sh.appendRow([id,requestId,projectId,comment,session.user.email,now]);
  return {ok:true,requestId:requestId,message:'Comentario añadido.',comment:{id:id,text:comment,author:session.user.email,createdAt:now}};
}


function deliveryUpdateDate_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);
  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER'].includes(cleanKey_(session.user.role))) {
    throw new Error('No tienes permiso para modificar fechas de entrega.');
  }
  const requestId = cleanText_(payload.requestId);
  const newDate = cleanText_(payload.newDate);
  const reason = cleanText_(payload.reason);
  if (!requestId) throw new Error('REQUEST_ID requerido.');
  validateBusinessDateSC3_(newDate, 'La nueva fecha');
  if (!reason) throw new Error('Indica el motivo del cambio de fecha.');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('Hay otro cambio en curso. Espera y vuelve a intentarlo.');
  let result;
  try {
    ensurePurchaseSheet_();
    const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
    const data = sh.getDataRange().getDisplayValues();
    const headers = headerMap_(data[0] || []);
    deliveryDateHeadersSC4_(headers, ['REQUEST_ID','PROYECTO_ID','FECHA_ENTREGA_PREVISTA','FECHA_ACTUALIZACION']);
    const matches = data.map((r,i)=>i>0 && cleanText_(r[headers.REQUEST_ID])===requestId ? i+1 : 0).filter(Boolean);
    if (matches.length !== 1) throw new Error('La solicitud no existe o su identificador está duplicado.');
    const row = matches[0];
    const projectId = cleanKey_(sh.getRange(row,headers.PROYECTO_ID+1).getDisplayValue());
    requireProjectAccess_(session, projectId);
    let journal = deliveryDateJournalSC4_(false);
    const pending = journal ? deliveryDatePendingSC4_(journal,requestId) : [];
    if (pending.length > 1) throw new Error('Hay varios cambios pendientes para esta solicitud. Requiere conciliación.');
    let recovered = false;
    if (pending.length) {
      if (pending[0].op.projectId !== projectId) throw new Error('El proyecto de la operación pendiente ha cambiado. Requiere conciliación.');
      deliveryDateApplySC4_(sh,row,headers,journal,pending[0]);
      recovered = true;
    }
    const oldDate = deliveryDateCellSC4_(sh.getRange(row,headers.FECHA_ENTREGA_PREVISTA+1).getValue());
    if (oldDate !== newDate) {
      journal = journal || deliveryDateJournalSC4_(true);
      const op = {
        id:'DLV-SC4-'+Utilities.getUuid().replace(/-/g,''), requestId:requestId,
        projectId:projectId, oldDate:oldDate, newDate:newDate, reason:reason,
        changedBy:cleanEmail_(session.user.email),
        changedAt:Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Europe/Madrid','yyyy-MM-dd HH:mm:ss')
      };
      const json = JSON.stringify(op);
      journal.appendRow([op.id,json,deliveryDateHashSC4_(json),'PREPARED']);
      SpreadsheetApp.flush();
      // Volver a leer evita asumir la posición del append ante otros escritores.
      const saved = deliveryDatePendingSC4_(journal,requestId);
      if (saved.length!==1 || saved[0].op.id!==op.id) throw new Error('No se puede identificar la intención guardada. Reintenta para conciliar.');
      deliveryDateApplySC4_(sh,row,headers,journal,saved[0]);
    }
    result = {ok:true,requestId:requestId,oldDate:recovered && oldDate===newDate ? pending[0].op.oldDate : oldDate,newDate:newDate,recovered:recovered,
      message:recovered ? 'Cambio pendiente recuperado y fecha de entrega comprobada.' : oldDate===newDate ? 'La fecha indicada coincide con la actual.' : 'Fecha de entrega actualizada.'};
  } finally {
    lock.releaseLock();
  }
  // La sincronización remota no mantiene el bloqueo ni invalida el cierre local.
  let sync = null;
  try {
    const rowForSync = readTable_(SHEETS.PURCHASE_REQUESTS).find(r=>cleanText_(r.REQUEST_ID)===requestId);
    if (!rowForSync) throw new Error('No se encuentra el pedido para sincronizar.');
    requireProjectAccess_(session,cleanKey_(rowForSync.PROYECTO_ID));
    if (cleanKey_(rowForSync.ESTADO)==='CONFIRMADO_PROVEEDOR') sync = warehouseSyncOne_(rowForSync,false);
  } catch (err) {
    sync = {ok:false,error:String(err && err.message || err)};
  }
  result.warehouseSync = sync;
  if (sync && sync.ok===false) result.message += ' Guardado en Site Control; sincronización con Warehouse pendiente: '+sync.error;
  return result;
}

// Diario de intención SC-A04. No contiene claves ni acredita entrega remota.
function deliveryDateHeadersSC4_(headers,required) {
  required.forEach(k=>{if (!Number.isInteger(headers[k]) || headers[k]<0) throw new Error('Falta la columna '+k+' para recuperar el cambio de entrega.');});
}
function deliveryDateCellSC4_(value) {
  return Object.prototype.toString.call(value)==='[object Date]'
    ? Utilities.formatDate(new Date(value),Session.getScriptTimeZone()||'Europe/Madrid','yyyy-MM-dd') : cleanText_(value);
}
function deliveryDateHashSC4_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8)
    .map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
}
function deliveryDateJournalSC4_(create) {
  const db = getDb_();
  const name = 'SC_DELIVERY_DATE_JOURNAL';
  let sh = db.getSheetByName(name);
  if (!sh && !create) return null;
  if (!sh) sh = db.insertSheet(name);
  if (sh.getLastRow()===0) sh.getRange(1,1,1,4).setValues([['CHANGE_ID','PAYLOAD_JSON','PAYLOAD_SHA256','STATE']]);
  const h = headerMap_(sh.getRange(1,1,1,Math.max(sh.getLastColumn(),4)).getDisplayValues()[0]);
  deliveryDateHeadersSC4_(h,['CHANGE_ID','PAYLOAD_JSON','PAYLOAD_SHA256','STATE']);
  // No adaptar silenciosamente un diario desplazado o con esquema distinto.
  if (h.CHANGE_ID!==0 || h.PAYLOAD_JSON!==1 || h.PAYLOAD_SHA256!==2 || h.STATE!==3) throw new Error('Esquema de diario incompatible; requiere conciliación.');
  return sh;
}
function deliveryDatePendingSC4_(journal,requestId) {
  const rows = journal.getDataRange().getValues();
  const out = [];
  for (let i=1;i<rows.length;i++) {
    const r=rows[i];
    if (r.every(v=>v==='' || v===null)) continue;
    const state = String(r[3]||'');
    if (state==='COMPLETE') continue;
    if (!['PREPARED','DATE_APPLIED'].includes(state)) throw new Error('Estado de diario no válido; requiere conciliación.');
    const json=String(r[1]||'');
    if (deliveryDateHashSC4_(json)!==String(r[2]||'')) throw new Error('El diario no supera la comprobación de integridad.');
    let op;
    try { op=JSON.parse(json); } catch(e) { throw new Error('El diario contiene una intención ilegible.'); }
    if (!op || typeof op!=='object' || Array.isArray(op) || !/^DLV-SC4-[a-f0-9]{32}$/i.test(op.id||'') || op.id!==r[0] ||
        !['requestId','projectId','newDate','reason','changedBy','changedAt'].every(k=>typeof op[k]==='string' && op[k].trim()) || typeof op.oldDate!=='string') {
      throw new Error('La intención del diario está incompleta o es incompatible.');
    }
    validateBusinessDateSC3_(op.newDate,'La fecha del diario');
    if (op.requestId===requestId) out.push({op:op,row:i+1,state:state});
  }
  return out;
}
function deliveryDateApplySC4_(sh,row,h,journal,entry) {
  const op = entry.op;
  const current = deliveryDateCellSC4_(sh.getRange(row,h.FECHA_ENTREGA_PREVISTA+1).getValue());
  if ((entry.state==='DATE_APPLIED' && current!==op.newDate) || (current!==op.oldDate && current!==op.newDate)) {
    throw new Error('La fecha cambió fuera de la operación pendiente. Requiere conciliación; no se sobrescribe.');
  }
  const history = ensureDeliveryHistorySheet_();
  const values = history.getDataRange().getDisplayValues();
  const hh = headerMap_(values[0]||[]);
  const fields = ['CHANGE_ID','REQUEST_ID','PROYECTO_ID','FECHA_ANTERIOR','FECHA_NUEVA','MOTIVO','MODIFICADO_POR','FECHA_CAMBIO'];
  deliveryDateHeadersSC4_(hh,fields);
  const expected = [op.id,op.requestId,op.projectId,op.oldDate,op.newDate,op.reason,op.changedBy,op.changedAt];
  const found = values.slice(1).filter(r=>cleanText_(r[hh.CHANGE_ID])===op.id);
  if (found.length>1 || (found.length===1 && fields.some((k,i)=>String(found[0][hh[k]]||'')!==expected[i]))) {
    throw new Error('El histórico contiene un identificador duplicado o datos distintos. Requiere conciliación.');
  }
  if (entry.state==='PREPARED') {
    sh.getRange(row,h.FECHA_ENTREGA_PREVISTA+1).setValue(op.newDate);
    sh.getRange(row,h.FECHA_ACTUALIZACION+1).setValue(op.changedAt);
    SpreadsheetApp.flush();
    journal.getRange(entry.row,4).setValue('DATE_APPLIED');
    SpreadsheetApp.flush();
  }
  if (!found.length) {
    const width=history.getLastColumn();
    const record=new Array(width).fill('');
    fields.forEach((k,i)=>{record[hh[k]]=/^=/.test(expected[i]) ? "'"+expected[i] : expected[i];});
    const target=history.getRange(history.getLastRow()+1,1,1,width);
    target.setNumberFormat('@');
    target.setValues([record]);
    SpreadsheetApp.flush();
  }
  journal.getRange(entry.row,4).setValue('COMPLETE');
  SpreadsheetApp.flush();
}


function deliveryConfirmReceipt_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);

  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER','FOREMAN','WAREHOUSE'].includes(cleanKey_(session.user.role))) {
    throw new Error('No tienes permiso para confirmar recepciones.');
  }

  const requestId = cleanText_(payload.requestId);
  const receiptStatus = cleanKey_(payload.receiptStatus);
  const notes = cleanText_(payload.notes);

  if (!requestId) throw new Error('REQUEST_ID requerido.');
  if (!['COMPLETA','PARCIAL'].includes(receiptStatus)) throw new Error('Selecciona recepción completa o parcial.');
  if (receiptStatus === 'PARCIAL' && !notes) throw new Error('En recepción parcial indica qué queda pendiente.');

  ensurePurchaseSheet_();

  const sh = getSheet_(SHEETS.PURCHASE_REQUESTS);
  const data = sh.getDataRange().getDisplayValues();
  const headers = headerMap_(data[0]);

  let foundRow = 0;
  for (let i=1;i<data.length;i++) {
    if (cleanText_(data[i][headers.REQUEST_ID]) === requestId) {
      foundRow = i+1;
      break;
    }
  }
  if (!foundRow) throw new Error('No existe la solicitud ' + requestId + '.');

  const projectId = cleanKey_(sh.getRange(foundRow, headers.PROYECTO_ID+1).getDisplayValue());
  requireProjectAccess_(session, projectId);

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const updates = {
    RECEPCION_ESTADO: receiptStatus,
    FECHA_RECEPCION: now,
    RECIBIDO_POR: session.user.name || session.user.email,
    RECEPCION_NOTAS: notes,
    FECHA_ACTUALIZACION: now
  };

  Object.keys(updates).forEach(header => {
    sh.getRange(foundRow, headers[header]+1).setValue(updates[header]);
  });

  SpreadsheetApp.flush();

  return {
    ok:true,
    message:receiptStatus === 'COMPLETA'
      ? 'Recepción completa confirmada.'
      : 'Recepción parcial registrada.',
    requestId:requestId
  };
}


function ensurePlanningSheet_(name, headers) {
  const ss = getDb_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function planningNow_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss');
}

function planningMilestoneIds_(projectId, ids) {
  if (!Array.isArray(ids) || ids.length > 60) throw new Error('Selección de hitos no válida.');
  const unique = [...new Set(ids.map(cleanText_).filter(Boolean))];
  if (unique.length) {
    const valid = new Set(readTable_(SHEETS.CONSTRUCTION_MILESTONES)
      .filter(r => cleanKey_(r.PROYECTO_ID) === projectId && cleanKey_(r.ACTIVO || 'SI') !== 'NO')
      .map(r => cleanText_(r.HITO_ID)));
    if (unique.some(id => !valid.has(id))) throw new Error('Algún hito no pertenece al proyecto.');
  }
  return unique;
}

function deliveryLinkMilestone_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER'].includes(cleanKey_(session.user.role))) throw new Error('Sin permiso para asociar hitos.');
  const payload = parsePayload_(p.payload);
  const requestId = cleanText_(payload.requestId);
  if (!requestId) throw new Error('REQUEST_ID requerido.');
  ensurePurchaseSheet_();
  ensureConstructionMilestonesSheet_();
  const purchase = readTable_(SHEETS.PURCHASE_REQUESTS).find(r => cleanText_(r.REQUEST_ID) === requestId);
  if (!purchase) throw new Error('Pedido no encontrado.');
  const projectId = cleanKey_(purchase.PROYECTO_ID);
  requireProjectAccess_(session, projectId);
  const ids = planningMilestoneIds_(projectId, Array.isArray(payload.milestoneIds) ? payload.milestoneIds : (payload.milestoneId ? [payload.milestoneId] : []));
  const sh = ensurePlanningSheet_('ENTREGA_HITOS', ['REQUEST_ID','PROYECTO_ID','HITOS_JSON','ACTUALIZADO_POR','FECHA_ACTUALIZACION']);
  const data = sh.getDataRange().getDisplayValues();
  const header = headerMap_(data[0]);
  const row = data.findIndex((r,i) => i > 0 && cleanText_(r[header.REQUEST_ID]) === requestId);
  const values = [requestId,projectId,JSON.stringify(ids),session.user.email,planningNow_()];
  if (row >= 0) sh.getRange(row+1,1,1,values.length).setValues([values]);
  else sh.appendRow(values);
  return {ok:true,requestId:requestId,message:'Hitos asociados actualizados.'};
}

function subcontractWorkSave_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER'].includes(cleanKey_(session.user.role))) throw new Error('Sin permiso para planificar subcontratas.');
  const v = parsePayload_(p.payload), projectId = cleanKey_(v.projectId);
  requireProjectAccess_(session,projectId);
  if (!cleanText_(v.supplier) || !cleanText_(v.activity)) throw new Error('Indica subcontrata y actividad.');
  validateBusinessDateSC3_(v.start, 'La fecha de inicio');
  if (v.end) validateBusinessDateSC3_(v.end, 'La fecha de fin');
  if (v.end && v.end < v.start) throw new Error('Fecha de fin anterior al inicio.');
  const planned = Number(v.planned);
  if (!Number.isInteger(planned) || planned < 1 || planned > 10000) throw new Error('Personal previsto no válido.');
  const actual = v.actual === '' || v.actual === null || v.actual === undefined ? '' : Number(v.actual);
  if (actual !== '' && (!Number.isInteger(actual) || actual < 0 || actual > 10000)) throw new Error('Personal real no válido.');
  ensureConstructionMilestonesSheet_();
  const ids = planningMilestoneIds_(projectId,v.milestoneIds || []);
  const sh = ensurePlanningSheet_('PLAN_SUBCONTRATAS', ['PLAN_ID','PROYECTO_ID','SUBCONTRATA','ACTIVIDAD','INICIO','FIN','PERSONAL_PREVISTO','PERSONAL_REAL','ESTADO','HITOS_JSON','NOTAS','ACTIVO','ACTUALIZADO_POR','FECHA_ACTUALIZACION']);
  const data = sh.getDataRange().getDisplayValues(), hdr = headerMap_(data[0]);
  const existing = cleanText_(v.id);
  const index = existing ? data.findIndex((r,i) => i>0 && cleanText_(r[hdr.PLAN_ID])===existing && cleanKey_(r[hdr.PROYECTO_ID])===projectId) : -1;
  if (existing && index < 0) throw new Error('Planificación no encontrada.');
  const id = existing || 'SUB-' + Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
  const values = [id,projectId,cleanText_(v.supplier).slice(0,180),cleanText_(v.activity).slice(0,300),v.start,cleanText_(v.end),planned,actual,cleanText_(v.status || 'PLANIFICADO'),JSON.stringify(ids),cleanText_(v.notes).slice(0,2000),'SI',session.user.email,planningNow_()];
  if (index>=0) sh.getRange(index+1,1,1,values.length).setValues([values]); else sh.appendRow(values);
  return {ok:true,message:'Planificación de subcontrata guardada.',id:id};
}

function subcontractWorkDelete_(p) {
  const session = requireAuthenticatedUser_(p,'DELIVERY_VIEW');
  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER'].includes(cleanKey_(session.user.role))) throw new Error('Sin permiso.');
  const v = parsePayload_(p.payload), projectId = cleanKey_(v.projectId);
  requireProjectAccess_(session,projectId);
  const sh = ensurePlanningSheet_('PLAN_SUBCONTRATAS', ['PLAN_ID','PROYECTO_ID','SUBCONTRATA','ACTIVIDAD','INICIO','FIN','PERSONAL_PREVISTO','PERSONAL_REAL','ESTADO','HITOS_JSON','NOTAS','ACTIVO','ACTUALIZADO_POR','FECHA_ACTUALIZACION']);
  const data = sh.getDataRange().getDisplayValues(), hdr = headerMap_(data[0]);
  const index = data.findIndex((r,i) => i>0 && cleanText_(r[hdr.PLAN_ID])===cleanText_(v.id) && cleanKey_(r[hdr.PROYECTO_ID])===projectId);
  if (index<0) throw new Error('Planificación no encontrada.');
  sh.getRange(index+1,hdr.ACTIVO+1).setValue('NO');
  return {ok:true,message:'Planificación desactivada.'};
}


function constructionMilestoneSave_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);

  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER'].includes(cleanKey_(session.user.role))) {
    throw new Error('No tienes permiso para gestionar hitos constructivos.');
  }

  const projectId = cleanKey_(payload.projectId);
  const milestoneId = cleanText_(payload.milestoneId);
  const title = cleanText_(payload.title);
  const date = cleanText_(payload.date);
  const type = cleanText_(payload.type) || 'CONSTRUCTIVO';
  const discipline = cleanText_(payload.discipline);
  const notes = cleanText_(payload.notes);

  requireProjectAccess_(session, projectId);

  if (!title) throw new Error('Indica el nombre del hito.');
  validateBusinessDateSC3_(date, 'La fecha del hito');

  const sh = ensureConstructionMilestonesSheet_();
  const data = sh.getDataRange().getDisplayValues();
  const headers = headerMap_(data[0]);

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  if (milestoneId) {
    let rowNumber = 0;
    for (let i=1; i<data.length; i++) {
      if (cleanText_(data[i][headers.HITO_ID]) === milestoneId) {
        rowNumber = i + 1;
        break;
      }
    }
    if (!rowNumber) throw new Error('No existe el hito indicado.');

    const storedProject = cleanKey_(sh.getRange(rowNumber, headers.PROYECTO_ID+1).getDisplayValue());
    requireProjectAccess_(session, storedProject);
    if (storedProject !== projectId) throw new Error('El hito no pertenece al proyecto indicado.');

    const updates = {
      TITULO:title,
      FECHA_HITO:date,
      TIPO:type,
      DISCIPLINA:discipline,
      NOTAS:notes,
      ACTIVO:'SI',
      ACTUALIZADO_POR:session.user.email,
      FECHA_ACTUALIZACION:now
    };

    Object.keys(updates).forEach(header => {
      sh.getRange(rowNumber, headers[header]+1).setValue(updates[header]);
    });

    SpreadsheetApp.flush();
    return {ok:true,message:'Hito constructivo actualizado.',milestoneId:milestoneId};
  }

  const newId = 'HITO-' + projectId + '-' +
    Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();

  sh.appendRow([
    newId,
    projectId,
    title,
    date,
    type,
    discipline,
    notes,
    'SI',
    session.user.email,
    now,
    session.user.email,
    now
  ]);

  SpreadsheetApp.flush();
  return {ok:true,message:'Hito constructivo creado.',milestoneId:newId};
}


function constructionMilestoneDelete_(p) {
  const session = requireAuthenticatedUser_(p, 'DELIVERY_VIEW');
  const payload = parsePayload_(p.payload);

  if (!['ADMIN','PROJECT_MANAGER','SITE_MANAGER'].includes(cleanKey_(session.user.role))) {
    throw new Error('No tienes permiso para eliminar hitos constructivos.');
  }

  const projectId = cleanKey_(payload.projectId);
  const milestoneId = cleanText_(payload.milestoneId);

  requireProjectAccess_(session, projectId);
  if (!milestoneId) throw new Error('HITO_ID requerido.');

  const sh = ensureConstructionMilestonesSheet_();
  const data = sh.getDataRange().getDisplayValues();
  const headers = headerMap_(data[0]);

  let rowNumber = 0;
  for (let i=1; i<data.length; i++) {
    if (
      cleanText_(data[i][headers.HITO_ID]) === milestoneId &&
      cleanKey_(data[i][headers.PROYECTO_ID]) === projectId
    ) {
      rowNumber = i + 1;
      break;
    }
  }
  if (!rowNumber) throw new Error('No existe el hito indicado.');

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  sh.getRange(rowNumber, headers.ACTIVO+1).setValue('NO');
  sh.getRange(rowNumber, headers.ACTUALIZADO_POR+1).setValue(session.user.email);
  sh.getRange(rowNumber, headers.FECHA_ACTUALIZACION+1).setValue(now);

  // Desvincula las entregas que apunten a este hito.
  ensurePurchaseSheet_();
  const purchaseSh = getSheet_(SHEETS.PURCHASE_REQUESTS);
  const purchaseData = purchaseSh.getDataRange().getDisplayValues();
  const purchaseHeaders = headerMap_(purchaseData[0]);

  for (let i=1; i<purchaseData.length; i++) {
    if (
      cleanKey_(purchaseData[i][purchaseHeaders.PROYECTO_ID]) === projectId &&
      cleanText_(purchaseData[i][purchaseHeaders.HITO_ID]) === milestoneId
    ) {
      purchaseSh.getRange(i+1, purchaseHeaders.HITO_ID+1).setValue('');
    }
  }

  SpreadsheetApp.flush();
  return {ok:true,message:'Hito eliminado y entregas desvinculadas.',milestoneId:milestoneId};
}


function ensureConstructionMilestonesSheet_() {
  const ss = getDb_();
  const headers = [
    'HITO_ID','PROYECTO_ID','TITULO','FECHA_HITO','TIPO','DISCIPLINA',
    'NOTAS','ACTIVO','CREADO_POR','FECHA_CREACION','ACTUALIZADO_POR','FECHA_ACTUALIZACION'
  ];

  let sh = ss.getSheetByName(SHEETS.CONSTRUCTION_MILESTONES);

  if (!sh) {
    sh = ss.insertSheet(SHEETS.CONSTRUCTION_MILESTONES);
    sh.getRange(1,1,1,headers.length)
      .setValues([headers])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1,headers.length);
    return sh;
  }

  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,headers.length)
      .setValues([headers])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
    return sh;
  }

  const currentHeaders = sh.getRange(1,1,1,sh.getLastColumn())
    .getDisplayValues()[0]
    .map(cleanKey_);

  headers.forEach(header => {
    if (currentHeaders.includes(cleanKey_(header))) return;
    sh.insertColumnAfter(sh.getLastColumn());
    sh.getRange(1,sh.getLastColumn()).setValue(header);
    currentHeaders.push(cleanKey_(header));
  });

  sh.getRange(1,1,1,sh.getLastColumn()).setFontWeight('bold');
  sh.setFrozenRows(1);
  return sh;
}


function ensureDeliveryHistorySheet_() {
  const ss = getDb_();
  const headers = [
    'CHANGE_ID','REQUEST_ID','PROYECTO_ID','FECHA_ANTERIOR',
    'FECHA_NUEVA','MOTIVO','MODIFICADO_POR','FECHA_CAMBIO'
  ];

  let sh = ss.getSheetByName(SHEETS.DELIVERY_HISTORY);

  if (!sh) {
    sh = ss.insertSheet(SHEETS.DELIVERY_HISTORY);
    sh.getRange(1,1,1,headers.length)
      .setValues([headers])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
  }

  return sh;
}


function appendDeliveryHistory_(entry) {
  const sh = ensureDeliveryHistorySheet_();
  const changeId = 'DLV-' + Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();

  sh.appendRow([
    changeId,
    entry.requestId,
    entry.projectId,
    entry.oldDate,
    entry.newDate,
    entry.reason,
    entry.changedBy,
    entry.changedAt
  ]);
}




/* =========================================================
   CONTROL HORARIO / ENCARGADOS BRIDGE
   ========================================================= */

function controlHorarioApiCall_(action, data) {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty('CONTROL_HORARIO_API_URL');
  const apiKey = props.getProperty('CONTROL_HORARIO_API_KEY');

  if (!url) throw new Error('Falta CONTROL_HORARIO_API_URL en propiedades del script.');
  if (!apiKey) throw new Error('Falta CONTROL_HORARIO_API_KEY en propiedades del script.');

  const response = UrlFetchApp.fetch(url, {
    method:'post',
    payload:{
      channel:'SITE_CONTROL',
      apiKey:apiKey,
      action:action,
      data:JSON.stringify(data || {})
    },
    muteHttpExceptions:true,
    followRedirects:true
  });

  const text = response.getContentText();
  let body;
  try {
    body = JSON.parse(text);
  } catch (err) {
    throw new Error('Control Horario no devolvió JSON válido. Revisa que el backend v1.2.1 esté desplegado.');
  }

  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('Control Horario API HTTP ' + response.getResponseCode() + '.');
  }
  if (!body || !body.ok) throw new Error(body && body.message ? body.message : 'Error de Control Horario.');
  return body;
}


function workControlAccess_(p) {
  const session = requireAuthenticatedUser_(p, 'SITE_VIEW');
  const projects = getUserProjects_(session.user.email, session.user.role);

  if (!projects.length) {
    throw new Error('No tienes proyectos asignados para Control de trabajos.');
  }

  // ADMIN ve todo Control Horario, incluso ubicaciones auxiliares como AWB/ACB.
  // Un responsable con más de un proyecto se considera encargado general
  // y también recibe el ámbito completo. Un encargado de un solo proyecto
  // queda estrictamente limitado a ese proyecto.
  const globalScope =
    cleanKey_(session.user.role) === 'ADMIN' ||
    projects.length > 1;

  const allowedProjects = globalScope
    ? ['*']
    : projects.map(project => cleanKey_(project.id));

  return {
    session:session,
    projects:projects,
    allowedProjects:allowedProjects,
    globalScope:globalScope
  };
}


function workControlBaseData_(access, extra) {
  return Object.assign({
    actorEmail:access.session.user.email,
    allowedProjects:access.allowedProjects
  }, extra || {});
}


function workControlValidateProjectSelection_(selected, allowedProjects) {
  selected = cleanKey_(selected || 'ALL');

  if (selected === 'ALL') return 'ALL';
  if (allowedProjects.includes('*')) return selected;

  if (!allowedProjects.includes(selected)) {
    throw new Error('No tienes acceso al proyecto ' + selected + '.');
  }

  return selected;
}


function workControlBootstrap_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const selected = workControlValidateProjectSelection_(
    payload.project || payload.projectId || 'ALL',
    access.allowedProjects
  );

  const remote = controlHorarioApiCall_('workBootstrap', workControlBaseData_(access, {
    project:selected,
    month:cleanText_(payload.month),
    date:cleanText_(payload.date)
  }));

  return {
    ok:true,
    projects:Array.isArray(remote.scopeProjects) && remote.scopeProjects.length
      ? remote.scopeProjects.map(id => ({id:id, name:id, campus:''}))
      : access.projects,
    selectedProject:selected,
    manager:remote.manager || {},
    month:remote.month || {days:[]},
    monthParts:Array.isArray(remote.monthParts) ? remote.monthParts : [],
    monthIncidents:Array.isArray(remote.monthIncidents) ? remote.monthIncidents : [],
    presence:Array.isArray(remote.presence) ? remote.presence : []
  };
}


function workControlMonth_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const selected = workControlValidateProjectSelection_(payload.project, access.allowedProjects);
  const remote = controlHorarioApiCall_('workMonth', workControlBaseData_(access, {
    project:selected,
    month:cleanText_(payload.month)
  }));

  return {
    ok:true,
    month:remote.month,
    days:remote.days || [],
    parts:Array.isArray(remote.parts) ? remote.parts : [],
    incidents:Array.isArray(remote.incidents) ? remote.incidents : [],
    scopeProjects:Array.isArray(remote.scopeProjects) ? remote.scopeProjects : []
  };
}


function workControlDay_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const selected = workControlValidateProjectSelection_(payload.project, access.allowedProjects);
  const remote = controlHorarioApiCall_('workDay', workControlBaseData_(access, {
    project:selected,
    date:cleanText_(payload.date)
  }));

  return {
    ok:true,
    date:remote.date,
    parts:remote.parts || [],
    incidents:remote.incidents || []
  };
}


function workControlPresence_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const selected = workControlValidateProjectSelection_(payload.project, access.allowedProjects);
  const remote = controlHorarioApiCall_('workPresence', workControlBaseData_(access, {
    project:selected
  }));

  return {
    ok:true,
    generatedAt:remote.generatedAt,
    presence:remote.presence || []
  };
}


function workControlUpdate_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const remote = controlHorarioApiCall_('workUpdate', workControlBaseData_(access, {
    rowNumber:Number(payload.rowNumber),
    status:cleanKey_(payload.status),
    observation:cleanText_(payload.observation)
  }));

  return Object.assign({ok:true}, remote);
}


function workControlBulkValidate_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const rows = Array.isArray(payload.rowNumbers)
    ? payload.rowNumbers.map(Number).filter(Number.isInteger)
    : [];

  const remote = controlHorarioApiCall_('workBulkValidate', workControlBaseData_(access, {
    rowNumbers:rows
  }));

  return Object.assign({ok:true}, remote);
}


function workControlIncidentUpdate_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const remote = controlHorarioApiCall_('incidentUpdate', workControlBaseData_(access, {
    incidentRowNumber:Number(payload.incidentRowNumber),
    incidentStatus:cleanKey_(payload.incidentStatus),
    incidentResolution:cleanText_(payload.incidentResolution)
  }));

  return Object.assign({ok:true}, remote);
}


function workControlIncidentCorrect_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const remote = controlHorarioApiCall_('incidentCorrect', workControlBaseData_(access, {
    incidentRowNumber:Number(payload.incidentRowNumber),
    correctionBlockId:cleanText_(payload.correctionBlockId),
    correctionProject:cleanKey_(payload.correctionProject),
    correctionEntryTime:cleanText_(payload.correctionEntryTime),
    correctionExitTime:cleanText_(payload.correctionExitTime)
  }));

  return Object.assign({ok:true}, remote);
}


function workControlIncidentDiscard_(p) {
  const access = workControlAccess_(p);
  const payload = parsePayload_(p.payload);

  const remote = controlHorarioApiCall_('incidentDiscard', workControlBaseData_(access, {
    incidentRowNumber:Number(payload.incidentRowNumber)
  }));

  return Object.assign({ok:true}, remote);
}


function equipmentLocationsGlobal_(p) {
  const session = requireAuthenticatedUser_(p, 'EQUIPMENT_VIEW');

  const remote = controlHorarioApiCall_('equipmentLocationsGlobal', {
    actorEmail:session.user.email,
    // La API exige una lista no vacía, aunque maquinaria no se filtra.
    allowedProjects:getUserProjects_(session.user.email, session.user.role).map(project => cleanKey_(project.id))
  });

  return {
    ok:true,
    configured:remote.configured !== false,
    generatedAt:remote.generatedAt || Date.now(),
    message:remote.message || '',
    locations:Array.isArray(remote.locations) ? remote.locations : []
  };
}


/* =========================================================
   WAREHOUSE MULTI-ALMACÉN
   ========================================================= */

function setupWarehouseCore_() {
  const ss = getDb_();

  ensureNamedSheet_(ss, SHEETS.WAREHOUSES, [
    'ALMACEN_ID',
    'NOMBRE',
    'CAMPUS',
    'DISCIPLINA',
    'ACTIVO'
  ]);

  ensureNamedSheet_(ss, SHEETS.USER_WAREHOUSE, [
    'EMAIL',
    'ALMACEN_ID',
    'ROL_ALMACEN',
    'ACTIVO'
  ]);

  ensureNamedSheet_(ss, SHEETS.WAREHOUSE_ZONES, [
    'ALMACEN_ID',
    'ZONA_ID',
    'NOMBRE',
    'TIPO',
    'ACTIVO'
  ]);

  ensureNamedSheet_(ss, SHEETS.MATERIALS, [
    'REFERENCIA',
    'DESCRIPCION',
    'CATEGORIA',
    'PROVEEDOR_HABITUAL',
    'ACTIVO'
  ]);

  ensureNamedSheet_(ss, SHEETS.WAREHOUSE_STOCK, [
    'ALMACEN_ID',
    'ZONA_ID',
    'REFERENCIA',
    'CANTIDAD',
    'UNIDAD',
    'LOTE_ID',
    'ESTADO',
    'FECHA_ACTUALIZACION'
  ]);

  ensureNamedSheet_(ss, SHEETS.MATERIAL_REQUESTS, [
    'SOLICITUD_ID',
    'PROYECTO_ID',
    'ALMACEN_ID',
    'REFERENCIA',
    'DESCRIPCION',
    'CANTIDAD',
    'SOLICITADO_POR',
    'FECHA_SOLICITUD',
    'ESTADO',
    'OBSERVACIONES'
  ]);

  SpreadsheetApp.flush();
}


function ensureNamedSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);

  if (!sh) {
    sh = ss.insertSheet(name);
  }

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight('bold');
    sh.setFrozenRows(1);
    return sh;
  }

  const current = sh
    .getRange(1, 1, 1, sh.getLastColumn())
    .getDisplayValues()[0]
    .map(cleanKey_);

  let lastColumn = sh.getLastColumn();

  headers.forEach(header => {
    const key = cleanKey_(header);

    if (current.includes(key)) return;

    lastColumn += 1;

    if (lastColumn > sh.getMaxColumns()) {
      sh.insertColumnAfter(sh.getMaxColumns());
    }

    sh.getRange(1, lastColumn).setValue(header);
    current.push(key);
  });

  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  sh.setFrozenRows(1);

  return sh;
}


function getUserWarehouses_(email, globalRole) {
  setupWarehouseCore_();

  const warehouses = readTable_(SHEETS.WAREHOUSES)
    .filter(row =>
      cleanKey_(row.ALMACEN_ID) &&
      isYes_(row.ACTIVO)
    )
    .map(row => ({
      id: cleanKey_(row.ALMACEN_ID),
      name: cleanText_(row.NOMBRE),
      campus: cleanText_(row.CAMPUS),
      discipline: cleanKey_(row.DISCIPLINA)
    }));

  if (cleanKey_(globalRole) === 'ADMIN') {
    return warehouses.map(w => ({
      ...w,
      warehouseRole: 'ADMIN'
    }));
  }

  const assignments = readTable_(SHEETS.USER_WAREHOUSE);
  const byId = {};

  warehouses.forEach(w => {
    byId[w.id] = w;
  });

  const result = [];

  assignments.forEach(row => {
    if (cleanEmail_(row.EMAIL) !== cleanEmail_(email)) return;
    if (!isYes_(row.ACTIVO)) return;

    const warehouseId = cleanKey_(row.ALMACEN_ID);
    const warehouse = byId[warehouseId];

    if (!warehouse) return;

    result.push({
      ...warehouse,
      warehouseRole: cleanKey_(row.ROL_ALMACEN) || 'VIEWER'
    });
  });

  return result;
}


function warehouseApiCall_(action, data) {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty('WAREHOUSE_API_URL');
  const apiKey = props.getProperty('WAREHOUSE_API_KEY');

  if (!url) throw new Error('Falta WAREHOUSE_API_URL en las propiedades del script.');
  if (!apiKey) throw new Error('Falta WAREHOUSE_API_KEY en las propiedades del script.');

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    payload: {
      channel: 'SITE_CONTROL',
      apiKey: apiKey,
      action: action,
      data: JSON.stringify(data || {})
    },
    muteHttpExceptions: true,
    followRedirects: true
  });

  const text = response.getContentText();

  let body;
  try {
    body = JSON.parse(text);
  } catch (_) {
    throw new Error(
      'Warehouse no devolvió JSON válido. Comprueba que el backend Warehouse v1.1 esté desplegado.'
    );
  }

  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('Warehouse API HTTP ' + response.getResponseCode());
  }

  if (!body || !body.ok) {
    throw new Error(body?.message || 'Error de comunicación con Warehouse.');
  }

  return body.result || {};
}



// Correlación y errores del módulo Warehouse. Conserva autenticación en cada acción.
function warehouseModuleReply_(p, handler, type){
  let context={};
  try{
    const data=parsePayload_(p.payload);
    context={projectId:cleanKey_(data.projectId),warehouseId:cleanKey_(data.warehouseId),
      queryId:cleanText_(data.queryId),clientRequestId:cleanText_(data.clientRequestId)};
    const result=handler(p);
    return postMessageHtml_(Object.assign({},result,context),type);
  }catch(err){
    return postMessageHtml_(Object.assign({ok:false,message:String(err&&err.message||err)},context),type);
  }
}

function warehouseBootstrap_(p) {
  const session = requireAuthenticatedUser_(p, 'WAREHOUSE_VIEW');
  const payload = parsePayload_(p.payload);
  const projectId = cleanKey_(payload.projectId);

  requireProjectAccess_(session, projectId);

  const remote = warehouseApiCall_('bootstrap', {
    projectId: projectId
  });

  return {
    ok: true,
    warehouses: Array.isArray(remote.warehouses) ? remote.warehouses : [],
    zones: Array.isArray(remote.zones) ? remote.zones : [],
    permissions: {
      canReceive: false,
      canConfigure: false,
      canRequest: session.permissions.includes('WAREHOUSE_REQUEST'),
      canViewStock: true
    }
  };
}


function warehouseStockList_(p) {
  const session = requireAuthenticatedUser_(p, 'WAREHOUSE_VIEW');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  const warehouseId = cleanKey_(payload.warehouseId);

  requireProjectAccess_(session, projectId);

  const remote = warehouseApiCall_('stock', {
    projectId: projectId,
    warehouseId: warehouseId
  });

  return {
    ok: true,
    warehouseId: warehouseId,
    stock: Array.isArray(remote.stock) ? remote.stock : []
  };
}


function warehouseRequestCreate_(p) {
  const session = requireAuthenticatedUser_(p, 'WAREHOUSE_REQUEST');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);
  const warehouseId = cleanKey_(payload.warehouseId);

  requireProjectAccess_(session, projectId);
  const clientRequestId=cleanText_(payload.clientRequestId);
  if(!/^[a-zA-Z0-9_-]{8,100}$/.test(clientRequestId))throw new Error('Falta el identificador estable de la solicitud. Actualiza Site Control.');

  const remote = warehouseApiCall_('createRequest', {
    clientRequestId: clientRequestId,
    projectId: projectId,
    warehouseId: warehouseId,
    reference: cleanText_(payload.reference),
    description: cleanText_(payload.description),
    quantity: cleanText_(payload.quantity),
    notes: cleanText_(payload.notes),
    requestedBy: session.user.email
  });

  return {
    ok: true,
    message: remote.message || 'Solicitud de material enviada al almacén.',
    duplicate: remote.duplicate === true,
    requestId: remote.requestId
  };
}


function warehouseRequestList_(p) {
  const session = requireAuthenticatedUser_(p, 'WAREHOUSE_VIEW');
  const payload = parsePayload_(p.payload);

  const projectId = cleanKey_(payload.projectId);

  requireProjectAccess_(session, projectId);

  const remote = warehouseApiCall_('requests', {
    projectId: projectId
  });

  return {
    ok: true,
    requests: Array.isArray(remote.requests) ? remote.requests : []
  };
}


function warehouseZoneCreate_(p) {
  requireAuthenticatedUser_(p, 'WAREHOUSE_VIEW');

  return {
    ok: false,
    message: 'Las zonas se configuran únicamente desde LEVITEC Warehouse.'
  };
}



/* =========================================================
   MECHANICAL · SUBMITTALS INDIVIDUALES / READINESS POR HITO
   ========================================================= */

function ensureMechanicalSubmittalSheets_() {
  const props = PropertiesService.getScriptProperties();
  const setupKey = 'MECHANICAL_SUBMITTAL_SETUP_V11';
  const ss = getDb_();

  // En operación normal no repetimos migración + seed en cada click.
  if (props.getProperty(setupKey) === 'DONE') {
    return;
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    if (props.getProperty(setupKey) === 'DONE') return;

    ensureSheetHeaders_(ss, SHEETS.MECHANICAL_SUBMITTALS, [
      'SUBMITTAL_ID','PROYECTO_ID','SUBPAQUETE','TRACKER_NUM',
      'TECHNICAL_NUM','TITULO','ESTADO','REVISION','RESPONSABLE',
      'FECHA_PLANIFICADA','FECHA_PREVISTA_APROBACION','FUENTE',
      'OBSERVACIONES','ACTIVO','CREADO_POR','FECHA_CREACION',
      'ACTUALIZADO_POR','FECHA_ACTUALIZACION'
    ]);

    ensureSheetHeaders_(ss, SHEETS.MILESTONE_SUBMITTALS, [
      'LINK_ID','PROYECTO_ID','HITO_ID','SUBMITTAL_ID',
      'ACTIVO','CREADO_POR','FECHA_CREACION',
      'ACTUALIZADO_POR','FECHA_ACTUALIZACION'
    ]);

    migrateLegacyMilestoneSubmittalSheet_();
    seedZaz091MechanicalSubmittals_();
    seedZaz081MechanicalSubmittals_();
    ensureFokSheets_();

    props.setProperty(setupKey, 'DONE');
  } finally {
    lock.releaseLock();
  }
}


function ensureSheetHeaders_(ss, sheetName, headers) {
  let sh = ss.getSheetByName(sheetName);

  if (!sh) {
    sh = ss.insertSheet(sheetName);
  }

  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1,headers.length);
    SpreadsheetApp.flush();
    return sh;
  }

  const lastColumn = Math.max(sh.getLastColumn(), 1);
  const currentRaw = sh.getRange(1,1,1,lastColumn).getDisplayValues()[0];
  const current = currentRaw.map(cleanKey_);
  const missing = headers.filter(header => !current.includes(cleanKey_(header)));

  if (missing.length) {
    // Escribe las nuevas cabeceras de una vez. Esto es más robusto que
    // insertColumnAfter() repetido sobre hojas antiguas con esquemas previos.
    const startColumn = sh.getLastColumn() + 1;

    if (startColumn + missing.length - 1 > sh.getMaxColumns()) {
      sh.insertColumnsAfter(
        sh.getMaxColumns(),
        startColumn + missing.length - 1 - sh.getMaxColumns()
      );
    }

    sh.getRange(1,startColumn,1,missing.length).setValues([missing]);
  }

  sh.getRange(1,1,1,Math.max(sh.getLastColumn(),headers.length)).setFontWeight('bold');
  sh.setFrozenRows(1);
  SpreadsheetApp.flush();

  // Verificación explícita para evitar continuar con un esquema incompleto.
  const finalHeaders = sh
    .getRange(1,1,1,sh.getLastColumn())
    .getDisplayValues()[0]
    .map(cleanKey_);

  headers.forEach(header => {
    if (!finalHeaders.includes(cleanKey_(header))) {
      throw new Error(
        'No se ha podido crear la columna ' + header + ' en ' + sheetName + '.'
      );
    }
  });

  return sh;
}


function migrateLegacyMilestoneSubmittalSheet_() {
  const sh = getSheet_(SHEETS.MILESTONE_SUBMITTALS);

  const requiredHeaders = [
    'LINK_ID','PROYECTO_ID','HITO_ID','SUBMITTAL_ID',
    'ACTIVO','CREADO_POR','FECHA_CREACION',
    'ACTUALIZADO_POR','FECHA_ACTUALIZACION'
  ];

  ensureSheetHeaders_(getDb_(), SHEETS.MILESTONE_SUBMITTALS, requiredHeaders);

  if (sh.getLastRow() < 2) return;

  const data = sh.getDataRange().getDisplayValues();
  const h = headerMap_(data[0]);

  // Las asociaciones antiguas eran a PAQUETE_ID. No se convierten
  // automáticamente a un submittal individual porque no existe una
  // equivalencia 1:1 segura. Se conservan en la hoja, pero se desactivan
  // para que no interfieran con el nuevo modelo.
  if (h.PAQUETE_ID === undefined) return;

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  for (let i=1;i<data.length;i++) {
    const oldPackageId = cleanText_(data[i][h.PAQUETE_ID]);
    const submittalId =
      h.SUBMITTAL_ID !== undefined
        ? cleanText_(data[i][h.SUBMITTAL_ID])
        : '';

    if (!oldPackageId || submittalId) continue;

    sh.getRange(i+1, h.ACTIVO+1).setValue('NO');

    if (h.ACTUALIZADO_POR !== undefined) {
      sh.getRange(i+1, h.ACTUALIZADO_POR+1).setValue('MIGRATION_v1.4.2');
    }

    if (h.FECHA_ACTUALIZACION !== undefined) {
      sh.getRange(i+1, h.FECHA_ACTUALIZACION+1).setValue(now);
    }
  }

  SpreadsheetApp.flush();
}


function mechanicalCanEdit_(session) {
  return ['ADMIN','PROJECT_MANAGER','SITE_MANAGER','ENGINEER']
    .includes(cleanKey_(session.user.role));
}


function mechanicalStatusRank_(status) {
  const ranks = {
    'REJECTED':0,
    'PENDING':1,
    'D':1,
    'SUBMITTED':2,
    'C':3,
    'B':4,
    'A':5
  };
  const key = cleanKey_(status);
  return ranks[key] !== undefined ? ranks[key] : 0;
}


function mechanicalIsApproved_(status) {
  return cleanKey_(status) === 'A';
}


function isoDateDays_(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanText_(iso))) return null;
  const parts = iso.split('-').map(Number);
  return Math.floor(Date.UTC(parts[0],parts[1]-1,parts[2]) / 86400000);
}


function todayIso_() {
  return Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd'
  );
}


function seedZaz091MechanicalSubmittals_() {
    const sh = getSheet_(SHEETS.MECHANICAL_SUBMITTALS);
    const data = sh.getDataRange().getDisplayValues();
    const headers = headerMap_(data[0]);

    const existingTechnical = new Set();
    const existingTracker = new Set();

    for (let i=1;i<data.length;i++) {
      if (cleanKey_(data[i][headers.PROYECTO_ID]) !== 'ZAZ091') continue;

      const technical = cleanKey_(data[i][headers.TECHNICAL_NUM]);
      const tracker = cleanKey_(data[i][headers.TRACKER_NUM]);

      if (technical) existingTechnical.add(technical);
      if (tracker) existingTracker.add(tracker);
    }

    const rows = [{"trackerNumber":"0001.01","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.01","subpackage":"Industrial Water System","title":"Distribution Pumps","status":"A","revision":"4","plannedDate":"2026-05-18","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.02","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.02","subpackage":"Industrial Water System","title":"External Water Storage Tanks and accesories including ladder","status":"B","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0001.03","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.03","subpackage":"Industrial Water System","title":"Water Meters","status":"A","revision":"1","plannedDate":"2026-06-10","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.04","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.04","subpackage":"Industrial Water System","title":"Safety Valves","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0001.05","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.05","subpackage":"Industrial Water System","title":"Isolation Valves","status":"A","revision":"1","plannedDate":"2026-07-13","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.06","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.06","subpackage":"Industrial Water System","title":"Nonreturen Valves","status":"A","revision":"0","plannedDate":"2026-08-25","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.07","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.07","subpackage":"Industrial Water System","title":"Pressure Gauges","status":"A","revision":"0","plannedDate":"2026-07-23","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.08","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.08","subpackage":"Industrial Water System","title":"Expansion Vessels","status":"A","revision":"0","plannedDate":"2026-08-25","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.09","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.09","subpackage":"Industrial Water System","title":"Water oxidation equipment","status":"B","revision":"2","plannedDate":"2026-08-25","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0001.10","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.10","subpackage":"Industrial Water System","title":"Water Hammer Arrestors","status":"A","revision":"2","plannedDate":"2026-05-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.11","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0001.11","subpackage":"Industrial Water System","title":"Insulation HDPE pipes IW Room","status":"A","revision":"1","plannedDate":"2026-06-29","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.12","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.12-R","subpackage":"Industrial Water System","title":"Motorized modulating valve","status":"B","revision":"2","plannedDate":"2026-08-25","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0001.13","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.13","subpackage":"Industrial Water System","title":"Commissioning Valves","status":"A","revision":"2","plannedDate":"2026-06-09","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.14","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.14","subpackage":"Industrial Water System","title":"IW Pipework Pressure Test Method Statement","status":"PENDING","revision":"","plannedDate":"2026-12-31","reviewedBy":"","notes":""},{"trackerNumber":"0001.15","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.15","subpackage":"Industrial Water System","title":"Industrial Water Flushing Method Satement","status":"PENDING","revision":"","plannedDate":"2026-12-31","reviewedBy":"","notes":""},{"trackerNumber":"0001.16","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.16","subpackage":"Industrial Water System","title":"IW Tanks Cleaning Method Statement","status":"PENDING","revision":"","plannedDate":"2026-12-31","reviewedBy":"","notes":""},{"trackerNumber":"0001.17","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.17","subpackage":"Industrial Water System","title":"Method Statement. HYDRAULIC TAB ZAZ071","status":"PENDING","revision":"","plannedDate":"2026-12-31","reviewedBy":"","notes":""},{"trackerNumber":"0001.18","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.18","subpackage":"Industrial Water System","title":"IW Tanks Hydrostatic Test Method Statement","status":"PENDING","revision":"","plannedDate":"2026-12-31","reviewedBy":"","notes":""},{"trackerNumber":"0001.19","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.19","subpackage":"Industrial Water System","title":"Instrumentation","status":"PENDING","revision":"","plannedDate":"2026-10-30","reviewedBy":"","notes":""},{"trackerNumber":"0001.20","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0001.20","subpackage":"Industrial Water System","title":"Motorized valve","status":"A","revision":"0","plannedDate":"2026-09-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.01","subpackage":"Pipework","title":"Drains and grids","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.02","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.02","subpackage":"Pipework","title":"Interior manholes and covers","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.03","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.03","subpackage":"Pipework","title":"Linear drains","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.04","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.04","subpackage":"Pipework","title":"Soils & Waste water layout","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.05","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.05","subpackage":"Pipework","title":"Industrial, rainwater & sewage pipes","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.06","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.06","subpackage":"Pipework","title":"Copper Pipework","status":"A","revision":"0","plannedDate":"2026-08-20","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.07","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.07","subpackage":"Pipework","title":"Coolfit PE 4.0 for HW System","status":"A","revision":"0","plannedDate":"2026-05-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.08","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.08","subpackage":"Pipework","title":"HDPE Pipework for Drainage System","status":"A","revision":"1","plannedDate":"2026-08-20","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.09","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.09","subpackage":"Pipework","title":"Pipework/Ductwork Labelling","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.10","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.10","subpackage":"Pipework","title":"Valves Labelling_ROMP1-12","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0002.11","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.11","subpackage":"Pipework","title":"Water Hammer Arrestors","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.12","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.12","subpackage":"Pipework","title":"PPR for Domestic Water","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.13","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.13","subpackage":"Pipework","title":"HDPE Pipework IW Room","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.14","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.14","subpackage":"Pipework","title":"Penny valves","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.15","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.15","subpackage":"Pipework","title":"Underground Fire Main Piping \n","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.16","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.16","subpackage":"Pipework","title":"IW Room - Working Drawings","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0002.17","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.17","subpackage":"Pipework","title":"IW Pipework Supports","status":"C","revision":"0","plannedDate":"2026-09-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0002.18","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0002.18","subpackage":"Pipework","title":"BMS Reference Pipe & Valves","status":"B","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0003.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.01","subpackage":"Diesel Fuel System","title":"Seamless Pipe for Fuel Oil System","status":"SUBMITTED","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0003.02","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.02","subpackage":"Diesel Fuel System","title":"Diesel System Ball Valve","status":"A","revision":"0","plannedDate":"2026-06-12","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0003.03","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.03","subpackage":"Diesel Fuel System","title":"Diesel System Connection Hose_ROMP1-12","status":"A","revision":"1","plannedDate":"2026-09-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0003.04","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.04","subpackage":"Diesel Fuel System","title":"Mechanical Diesel Fuel System","status":"C","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0003.05","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.05","subpackage":"Diesel Fuel System","title":"Automation Diesel Fuel System","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0003.06","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.06","subpackage":"Diesel Fuel System","title":"Diesel Pressure Test Method Statement","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0003.07","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0003.07","subpackage":"Diesel Fuel System","title":"Diesel Pipe Flushing Method Statement","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0004.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.1","subpackage":"Fire Suppression System","title":"Sprinkler Piping","status":"SUBMITTED","revision":"0","plannedDate":"2026-09-11","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.02","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.2","subpackage":"Fire Suppression System","title":"Fire Protection Installation Sprinklers","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-05","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.03","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.3","subpackage":"Fire Suppression System","title":"Fire Protection test and Drain Valves","status":"SUBMITTED","revision":"0","plannedDate":"2026-09-11","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.04","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.4","subpackage":"Fire Suppression System","title":"Fire Extinguisher","status":"SUBMITTED","revision":"0","plannedDate":"2026-09-11","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.05","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.5","subpackage":"Fire Suppression System","title":"Sprinkler Fitting","status":"SUBMITTED","revision":"0","plannedDate":"2026-09-11","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.06","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.6","subpackage":"Fire Suppression System","title":"","status":"PENDING","revision":"","plannedDate":"2026-09-11","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.07","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.7","subpackage":"Fire Suppression System","title":"Sprinklers Fittings Accesories","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.08","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.8","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp01","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.09","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.9","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp02","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.10","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.10","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp03","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.11","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.11","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp04","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.12","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.12","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp05","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.13","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.13","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp06","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.14","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.14","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp07","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.15","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.15","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp08","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.16","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.16","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp09","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.17","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.17","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp10","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.18","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.18","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp11","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.19","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.19","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Romp12","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.20","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.20","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System Office","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.21","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.21","subpackage":"Fire Suppression System","title":"Hydaulic calculations por Sprinklers System IW Plant","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.22","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.22","subpackage":"Fire Suppression System","title":"Pressure Switch","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.23","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.23","subpackage":"Fire Suppression System","title":"Fire Pipework Support","status":"SUBMITTED","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.24","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.24","subpackage":"Fire Suppression System","title":"Threaded fittings:Romp1-12","status":"A","revision":"0","plannedDate":"2026-09-11","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0004.25","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.25","subpackage":"Fire Suppression System","title":"Alarm valve pre-action System","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.26","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.26","subpackage":"Fire Suppression System","title":"Sprinkler Nitrogen Generator","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.27","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.27","subpackage":"Fire Suppression System","title":"ZAZ101-FIC-XX-XX-DR-F-0006_ Mechanical General Services Fire Fighting Schematic","status":"PENDING","revision":"","plannedDate":"2026-10-23","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.28","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.28","subpackage":"Fire Suppression System","title":"Fire Protection shut-off Valves","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-23","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.29","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.29","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Access Control Building","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.30","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.30","subpackage":"Fire Suppression System","title":"Sprinklers System Layout","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.31","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.31","subpackage":"Fire Suppression System","title":"Iron structure to main fire pipe supporter","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.32","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.32","subpackage":"Fire Suppression System","title":"Pump House & Water tanks Layout","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.33","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.33","subpackage":"Fire Suppression System","title":"Fire Pumps","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.34","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.34","subpackage":"Fire Suppression System","title":"Fire Water Tanks","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.35","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.35","subpackage":"Fire Suppression System","title":"Isolation & Trace Heating pipes","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.36","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.36","subpackage":"Fire Suppression System","title":"Sprinkler Control Valve","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0004.37","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0004.37","subpackage":"Fire Suppression System","title":"Sprinkler room layout","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":""},{"trackerNumber":"0005.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.01","subpackage":"Ductwork System","title":"Helicoidal Ducts & insulation","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0005.02","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.02","subpackage":"Ductwork System","title":"Pressure relief dampers","status":"B","revision":"0","plannedDate":"2026-08-15","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.03","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.03","subpackage":"Ductwork System","title":"Motorized Dampers","status":"C","revision":"0","plannedDate":"2026-08-15","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.04","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.04","subpackage":"Ductwork System","title":"Motorized Dampers Actuators","status":"A","revision":"1","plannedDate":"2026-08-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.05","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.05","subpackage":"Ductwork System","title":"Electrical room heat recovery units (HRU)","status":"A","revision":"1","plannedDate":"2026-04-29","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.06","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.06","subpackage":"Ductwork System","title":"External Weather louver","status":"A","revision":"0","plannedDate":"2026-08-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.07","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.07","subpackage":"Ductwork System","title":"CRAC Units","status":"A","revision":"0","plannedDate":"2026-04-22","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.08","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.08","subpackage":"Ductwork System","title":"Air Volume Flow Controller","status":"C","revision":"0","plannedDate":"2026-05-21","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.09","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.09","subpackage":"Ductwork System","title":"Rectangular Fibre Glass Rigid Ductwork","status":"SUBMITTED","revision":"0","plannedDate":"2026-07-14","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0005.10","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.10","subpackage":"Ductwork System","title":"TAB Roomp 01","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.11","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.11","subpackage":"Ductwork System","title":"TAB Roomp 02","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.12","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.12","subpackage":"Ductwork System","title":"TAB Roomp 03","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.13","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.13","subpackage":"Ductwork System","title":"TAB Roomp 04","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.14","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.14","subpackage":"Ductwork System","title":"TAB Roomp 05","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.15","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.15","subpackage":"Ductwork System","title":"TAB Roomp 06","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.16","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.16","subpackage":"Ductwork System","title":"TAB Roomp 07","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.17","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.17","subpackage":"Ductwork System","title":"TAB Roomp 08","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.18","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.18","subpackage":"Ductwork System","title":"TAB Roomp 09","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.19","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.19","subpackage":"Ductwork System","title":"TAB Roomp 10","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.20","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.20","subpackage":"Ductwork System","title":"TAB Roomp 11","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.21","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.21","subpackage":"Ductwork System","title":"TAB Roomp 12","status":"PENDING","revision":"","plannedDate":"2027-02-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.22","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.22","subpackage":"Ductwork System","title":"Ductwork access doors","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0005.23","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.23","subpackage":"Ductwork System","title":"Office working drawings","status":"PENDING","revision":"","plannedDate":"2026-09-10","reviewedBy":"","notes":""},{"trackerNumber":"0005.24","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.24","subpackage":"Ductwork System","title":"TAB PLAN","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0005.25","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0005.25","subpackage":"Ductwork System","title":"TAB PLAN Office area","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0005.26","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0005.26","subpackage":"Ductwork System","title":"External HRU Grilles","status":"A","revision":"0","plannedDate":"2026-08-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.27","technicalNumber":"ZAZ091-CAF-10-XX-SU-M-0005.27","subpackage":"Ductwork System","title":"Electrical room HRU supportation","status":"C","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0006.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.01","subpackage":"Admin Area","title":"Air Handling Unit","status":"A","revision":"1","plannedDate":"2026-05-21","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.02","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.02","subpackage":"Admin Area","title":"DX Air Conditioning Units","status":"A","revision":"1","plannedDate":"2026-06-22","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.03","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.03","subpackage":"Admin Area","title":"VRF Air Conditioning system","status":"A","revision":"1","plannedDate":"2026-06-17","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0006.04","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.04","subpackage":"Admin Area","title":"Potable Water Pumps","status":"B","revision":"2","plannedDate":"2026-07-15","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0006.05","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.05","subpackage":"Admin Area","title":"Potable Water Storage Tank","status":"B","revision":"2","plannedDate":"2026-07-16","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0006.06","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.06","subpackage":"Admin Area","title":"Potable Water Storage Water Treatment System","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.07","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.07","subpackage":"Admin Area","title":"Domestic hot water calorifier","status":"B","revision":"3","plannedDate":"2026-05-22","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0006.08","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.08","subpackage":"Admin Area","title":"Toilets in Office Area","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0006.09","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.09","subpackage":"Admin Area","title":"Fire Dampers ","status":"A","revision":"1","plannedDate":"2026-07-16","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.10","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.10","subpackage":"Admin Area","title":"Diffusion in Office Area","status":"PENDING","revision":"","plannedDate":"2026-09-15","reviewedBy":"","notes":""},{"trackerNumber":"0006.11","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.11","subpackage":"Admin Area","title":"Extractor","status":"A","revision":"1","plannedDate":"2026-05-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.12","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.12","subpackage":"Admin Area","title":"VRF Support frame","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.13","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.13","subpackage":"Admin Area","title":"Domestic Water Meter","status":"A","revision":"0","plannedDate":"2026-08-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.14","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.14","subpackage":"Admin Area","title":"Shut-Off Dampers","status":"C","revision":"0","plannedDate":"2026-07-20","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0006.15","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0006.15","subpackage":"Admin Area","title":"Pressure Reducing Valve","status":"A","revision":"0","plannedDate":"2026-05-20","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0007.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0007.01","subpackage":"MV Rooms","title":"MV Rooms - DX Air Conditioning Units","status":"C","revision":"3","plannedDate":"2026-06-15","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0008.01","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0008.01","subpackage":"Materials","title":"EXTERIOR MANHOLE COVER","status":"D","revision":"0","plannedDate":"2026-04-21","reviewedBy":"ARRUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0008.02","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0008.02","subpackage":"Materials","title":"","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0008.03","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0008.03","subpackage":"Materials","title":"","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0008.04","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0008.04","subpackage":"Materials","title":"","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0008.05","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0008.05","subpackage":"Materials","title":"","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0008.06","technicalNumber":"ZAZ091-CAF-10-01-SU-M-0008.06","subpackage":"Materials","title":"","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""}];

    const pending = rows.filter(item => {
      const technical = cleanKey_(item.technicalNumber);
      const tracker = cleanKey_(item.trackerNumber);

      if (technical && existingTechnical.has(technical)) return false;
      if (tracker && existingTracker.has(tracker)) return false;
      return true;
    });

    if (!pending.length) return;

    const now = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || 'Europe/Madrid',
      'yyyy-MM-dd HH:mm:ss'
    );

    const headerRow = sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];

    const matrix = pending.map((item, index) => {
      const record = {
        SUBMITTAL_ID:'M-SUB-ZAZ091-' +
          Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
        PROYECTO_ID:'ZAZ091',
        SUBPAQUETE:cleanText_(item.subpackage),
        TRACKER_NUM:cleanText_(item.trackerNumber),
        TECHNICAL_NUM:cleanText_(item.technicalNumber),
        TITULO:cleanText_(item.title),
        ESTADO:cleanKey_(item.status || 'PENDING'),
        REVISION:cleanText_(item.revision),
        RESPONSABLE:cleanText_(item.reviewedBy),
        FECHA_PLANIFICADA:cleanText_(item.plannedDate),
        FECHA_PREVISTA_APROBACION:'',
        FUENTE:'ZAZ091_Project_Submittal_Tracker_Rev01.xlsx',
        OBSERVACIONES:cleanText_(item.notes),
        ACTIVO:'SI',
        CREADO_POR:'IMPORT_TRACKER',
        FECHA_CREACION:now,
        ACTUALIZADO_POR:'IMPORT_TRACKER',
        FECHA_ACTUALIZACION:now
      };

      return headerRow.map(header => (record[cleanKey_(header)] !== undefined ? record[cleanKey_(header)] : ''));
    });

    sh.getRange(
      sh.getLastRow() + 1,
      1,
      matrix.length,
      headerRow.length
    ).setValues(matrix);

  SpreadsheetApp.flush();
}

function seedZaz081MechanicalSubmittals_() {
  const sh = getSheet_(SHEETS.MECHANICAL_SUBMITTALS);
  const data = sh.getDataRange().getDisplayValues();
  const headers = headerMap_(data[0]);

  const existingTechnical = new Set();
  const existingTracker = new Set();

  for (let i=1;i<data.length;i++) {
    if (cleanKey_(data[i][headers.PROYECTO_ID]) !== 'ZAZ081') continue;

    const technical = cleanKey_(data[i][headers.TECHNICAL_NUM]);
    const tracker = cleanKey_(data[i][headers.TRACKER_NUM]);

    if (technical) existingTechnical.add(technical);
    if (tracker) existingTracker.add(tracker);
  }

  const rows = [{"trackerNumber":"0001.01","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.01","subpackage":"Industrial Water System","title":"Distribution pumps - IW","status":"A","revision":"2","plannedDate":"2026-05-18","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.02","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.02","subpackage":"Industrial Water System","title":"External Water Storage Tanks and accesories including ladder","status":"B","revision":"1","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0001.03","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.03","subpackage":"Industrial Water System","title":"Water Meters","status":"A","revision":"2","plannedDate":"2026-06-04","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0001.04","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.04","subpackage":"Industrial Water System","title":"Safety valves","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0001.05","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.05","subpackage":"Industrial Water System","title":"Isolation Valves","status":"A","revision":"2","plannedDate":"2026-06-16","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.06","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.06","subpackage":"Industrial Water System","title":"Non Return Valves","status":"A","revision":"2","plannedDate":"2026-06-11","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.07","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.07","subpackage":"Industrial Water System","title":"Pressure Gauges","status":"A","revision":"2","plannedDate":"2026-06-16","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.08","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.08","subpackage":"Industrial Water System","title":"Expansion Vessels","status":"A","revision":"1","plannedDate":"2026-06-16","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.09","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.09","subpackage":"Industrial Water System","title":"Water oxidation equipment","status":"A","revision":"1","plannedDate":"2026-06-16","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.10","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.10","subpackage":"Industrial Water System","title":"Water Hammer Arrestors","status":"A","revision":"2","plannedDate":"2026-05-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.11","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.11","subpackage":"Industrial Water System","title":"Insulation HDPE pipes IW Room","status":"A","revision":"1","plannedDate":"2026-06-29","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.12","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.12","subpackage":"Industrial Water System","title":"Motorized modulating valve","status":"A","revision":"0","plannedDate":"2026-07-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.13","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.13","subpackage":"Industrial Water System","title":"Commissioning Valves","status":"A","revision":"2","plannedDate":"2026-06-09","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0001.14","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.14","subpackage":"Industrial Water System","title":"IW Pipework Pressure Test Method Statement","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0001.15","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.15","subpackage":"Industrial Water System","title":"Industrial Water Flushing Method Satement","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0001.16","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0001.16","subpackage":"Industrial Water System","title":"IW Tanks Cleaning Method Statement","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0002.06","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.06","subpackage":"Pipework","title":"Copper Pipework","status":"A","revision":"2","plannedDate":"2026-05-29","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.07","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.07","subpackage":"Pipework","title":"Coolfit PE 4.0 for HW System","status":"A","revision":"0","plannedDate":"2026-05-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.08","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.08","subpackage":"Pipework","title":"HDPE Pipework for Drainage System","status":"A","revision":"1","plannedDate":"2026-06-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.09","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.09","subpackage":"Pipework","title":"Pipework/Ductwork Labelling","status":"A","revision":"2","plannedDate":"2026-07-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.10","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.10","subpackage":"Pipework","title":"Valves Labelling_ROMP1-12","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0002.11","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.11","subpackage":"Pipework","title":"Water Storage P&Id diagram","status":"A","revision":"1","plannedDate":"2026-06-25","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.12","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.12","subpackage":"Pipework","title":"PPR for Domestic Water","status":"A","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.13","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.13","subpackage":"Pipework","title":"HDPE Pipework IW Room","status":"A","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.14","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.14","subpackage":"Pipework","title":"Penny valves","status":"A","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0002.15","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.15","subpackage":"Pipework","title":"Underground Fire Main Piping","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0002.16","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.16","subpackage":"Pipework","title":"IW Room - Working Drawings","status":"PENDING","revision":"","plannedDate":"2026-07-30","reviewedBy":"","notes":""},{"trackerNumber":"0002.17","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.17","subpackage":"Pipework","title":"IW Pipework Supports","status":"C","revision":"0","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0002.18","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0002.18","subpackage":"Pipework","title":"BMS Reference Pipe & Valves","status":"B","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0003.01","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0003.01","subpackage":"Diesel Fuel System","title":"Seamless Pipe for Fuel Oil System","status":"A","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0003.02","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0003.02","subpackage":"Diesel Fuel System","title":"Diesel System Ball Valve","status":"A","revision":"0","plannedDate":"2026-06-12","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0003.03","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0003.03","subpackage":"Diesel Fuel System","title":"Diesel System Connection Hose_ROMP1-12","status":"A","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0003.04","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0003.04","subpackage":"Diesel Fuel System","title":"Mechanical Diesel Fuel System","status":"A","revision":"1","plannedDate":"2026-06-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0003.05","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0003.05","subpackage":"Diesel Fuel System","title":"Automation Diesel Fuel System","status":"B","revision":"0","plannedDate":"2026-06-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0003.07","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0003.07","subpackage":"Diesel Fuel System","title":"Diesel Pipe Flushing Method Statement","status":"PENDING","revision":"","plannedDate":"2026-09-30","reviewedBy":"","notes":""},{"trackerNumber":"0004.01","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.01","subpackage":"Fire Suppression System","title":"Sprinkler Piping","status":"A","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0004.02","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.02","subpackage":"Fire Suppression System","title":"Fire Protection Installation Sprinklers","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-02","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.03","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.03","subpackage":"Fire Suppression System","title":"Fire Protection test and Drain Valves","status":"A","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0004.04","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.04","subpackage":"Fire Suppression System","title":"Fire Extinguisher","status":"A","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0004.05","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.05","subpackage":"Fire Suppression System","title":"Sprinkler Fitting","status":"A","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0004.06","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.06","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp01-Zone 02","status":"D","revision":"","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.07","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.07","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp02-Zone 08","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.08","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.08","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp03-Zone 03","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.09","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.09","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp04-Zone 04","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.10","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.10","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp05-Zone 05","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.11","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.11","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp06-Zone 06","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.12","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.12","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp07- Zone 07","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.13","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.13","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp08- Zone 09","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.14","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.14","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp09- Zone 10","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.15","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.15","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp10-Zone 11","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.16","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.16","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp11-Zone 12","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.17","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.17","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Romp12-Zone 13","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.18","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.18","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers Systems Office- Zone 01","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0004.19","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.19","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers Systems Office- Zone 14","status":"D","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0004.20","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.20","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers Systems Office- Zone 15","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0004.21","technicalNumber":"ZAZ081-CAF-33-XX-SU-M-0004.21","subpackage":"Fire Suppression System","title":"Hydraulic calculations Sprinklers System Access Control Building","status":"PENDING","revision":"","plannedDate":"","reviewedBy":"","notes":""},{"trackerNumber":"0004.22","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.22","subpackage":"Fire Suppression System","title":"Pressure Switch","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.23","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.23","subpackage":"Fire Suppression System","title":"Fire Pipework Support","status":"SUBMITTED","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.24","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.24","subpackage":"Fire Suppression System","title":"Threaded fittings:Romp1-12","status":"A","revision":"0","plannedDate":"","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0004.25","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.25","subpackage":"Fire Suppression System","title":"Alarm Valve Doble Interlock Pre-action system","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"","notes":""},{"trackerNumber":"0004.26","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.26","subpackage":"Fire Suppression System","title":"Sprinkler Nitrogen Generator & Fittings","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"","notes":""},{"trackerNumber":"0004.27","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.27","subpackage":"Fire Suppression System","title":"Mechanical General Services Fire Fighting Schematic","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"","notes":""},{"trackerNumber":"0004.28","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.28","subpackage":"Fire Suppression System","title":"Sprinkler Wet Control Valve","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.29","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.29","subpackage":"Fire Suppression System","title":"Fire Protection shut-off Valves","status":"SUBMITTED","revision":"0","plannedDate":"2026-10-16","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0004.30","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.30","subpackage":"Fire Suppression System","title":"Sprinklers System Layout","status":"SUBMITTED","revision":"1","plannedDate":"","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0004.31","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.31","subpackage":"Fire Suppression System","title":"Iron structure to main fire pipe supporter","status":"PENDING","revision":"","plannedDate":"2026-09-18","reviewedBy":"","notes":""},{"trackerNumber":"0004.32","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.32","subpackage":"Fire Suppression System","title":"Wet system Air Release Valve","status":"PENDING","revision":"","plannedDate":"2026-10-16","reviewedBy":"","notes":""},{"trackerNumber":"0004.33","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.33","subpackage":"Fire Suppression System","title":"Pre Integration & Integration check list","status":"PENDING","revision":"","plannedDate":"2026-11-13","reviewedBy":"","notes":""},{"trackerNumber":"0004.34","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.34","subpackage":"Fire Suppression System","title":"Fire Pressure Test Procedure","status":"PENDING","revision":"","plannedDate":"2026-11-13","reviewedBy":"","notes":""},{"trackerNumber":"0004.35","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0004.35","subpackage":"Fire Suppression System","title":"PPI´s Sprinklers System Fire Supression System","status":"PENDING","revision":"","plannedDate":"2026-11-13","reviewedBy":"","notes":""},{"trackerNumber":"0005.01","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.01","subpackage":"Ductwork System","title":"Helicoidal Ducts & insulation","status":"A","revision":"3","plannedDate":"2026-07-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.02","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.02","subpackage":"Ductwork System","title":"Pressure relief dampers","status":"A","revision":"0","plannedDate":"2026-07-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.03","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.03","subpackage":"Ductwork System","title":"Motorized Dampers","status":"C","revision":"0","plannedDate":"2026-03-19","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.04","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.04","subpackage":"Ductwork System","title":"Motorized Dampers Actuators","status":"A","revision":"1","plannedDate":"2026-03-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.05","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.05","subpackage":"Ductwork System","title":"Electrical room heat recovery units (HRU)","status":"A","revision":"1","plannedDate":"2026-04-27","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.06","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.06","subpackage":"Ductwork System","title":"External Weather louver","status":"A","revision":"1","plannedDate":"2026-06-11","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.07","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.07","subpackage":"Ductwork System","title":"CRAC Units","status":"A","revision":"3","plannedDate":"2025-10-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.08","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.08","subpackage":"Ductwork System","title":"Air Volume Flow Controller","status":"B","revision":"1","plannedDate":"2026-05-21","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.09","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.09","subpackage":"Ductwork System","title":"Rectangular Fibre Glass Rigid Ductwork","status":"A","revision":"0","plannedDate":"2026-07-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0005.10","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.10","subpackage":"Ductwork System","title":"TAB ROMP 01","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.11","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.11","subpackage":"Ductwork System","title":"TAB ROMP 02","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.12","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.12","subpackage":"Ductwork System","title":"TAB ROMP 03","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.13","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.13","subpackage":"Ductwork System","title":"TAB ROMP 04","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.14","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.14","subpackage":"Ductwork System","title":"TAB ROMP 05","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.15","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.15","subpackage":"Ductwork System","title":"TAB ROMP 06","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.16","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.16","subpackage":"Ductwork System","title":"TAB ROMP 07","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.17","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.17","subpackage":"Ductwork System","title":"TAB ROMP 08","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.18","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.18","subpackage":"Ductwork System","title":"TAB ROMP 09","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.19","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.19","subpackage":"Ductwork System","title":"TAB ROMP 10","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.20","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.20","subpackage":"Ductwork System","title":"TAB ROMP 11","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.21","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.21","subpackage":"Ductwork System","title":"TAB ROMP 12","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0005.22","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.22","subpackage":"Ductwork System","title":"Ductwork access doors","status":"SUBMITTED","revision":"0","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.23","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.23","subpackage":"Ductwork System","title":"Office working drawings","status":"SUBMITTED","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0005.24","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.24","subpackage":"Ductwork System","title":"TAB PLAN","status":"SUBMITTED","revision":"0","plannedDate":"2027-01-01","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0005.25","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0005.25","subpackage":"Ductwork System","title":"TAB PLAN Office area","status":"PENDING","revision":"","plannedDate":"2027-01-01","reviewedBy":"","notes":""},{"trackerNumber":"0006.01","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.01","subpackage":"Admin Area","title":"Air Handling Unit","status":"A","revision":"1","plannedDate":"2026-03-20","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.02","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.02","subpackage":"Admin Area","title":"DX Air Conditioning Units","status":"A","revision":"2","plannedDate":"2026-06-22","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.03","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.03","subpackage":"Admin Area","title":"VRF Air Conditioning system","status":"A","revision":"2","plannedDate":"2026-06-17","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.04","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.04","subpackage":"Admin Area","title":"Potable Water Pumps","status":"D","revision":"","plannedDate":"","reviewedBy":"","notes":"Status D: Not reviewed / Not applicable"},{"trackerNumber":"0006.05","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.05","subpackage":"Admin Area","title":"Potable Water Storage Tank","status":"A","revision":"2","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.06","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.06","subpackage":"Admin Area","title":"Potable Water Storage Water Treatment System","status":"A","revision":"1","plannedDate":"2026-07-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.07","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.07","subpackage":"Admin Area","title":"Domestic hot water calorifier","status":"B","revision":"4","plannedDate":"2026-05-22","reviewedBy":"ARUP","notes":"Pending Consultant feedback"},{"trackerNumber":"0006.08","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.08","subpackage":"Admin Area","title":"Toilets in Office Area","status":"SUBMITTED","revision":"0","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"0006.09","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.09","subpackage":"Admin Area","title":"Fire Dampers","status":"A","revision":"1","plannedDate":"2026-08-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.10","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.10","subpackage":"Admin Area","title":"Diffusion in Office Area","status":"PENDING","revision":"","plannedDate":"2026-08-30","reviewedBy":"","notes":""},{"trackerNumber":"0006.11","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.11","subpackage":"Admin Area","title":"Extractor","status":"A","revision":"2","plannedDate":"2026-05-19","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0006.12","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0006.12","subpackage":"Admin Area","title":"VRF Support frame","status":"A","revision":"0","plannedDate":"2026-06-30","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0007.01","technicalNumber":"ZAZ081-CAF-10-XX-SU-M-0007.01","subpackage":"MV Rooms","title":"MV Rooms - DX Air Conditioning Units","status":"A","revision":"5","plannedDate":"2026-06-15","reviewedBy":"ARUP","notes":"Status A: Proceed, no comments"},{"trackerNumber":"0008.01","technicalNumber":"ZAZ081-CAF-00-XX-SU-M-0008.01","subpackage":"Legalisation","title":"HVAC Legalisation Project for review and approval _ROMP1-12","status":"PENDING","revision":"","plannedDate":"2027-03-31","reviewedBy":"","notes":""},{"trackerNumber":"00010.17","technicalNumber":"ZAZ081-CAF-33-XX-SU-M-0010.17","subpackage":"Auxiliary Buildings","title":"Hydraulic calculations Sprinklers System Access Control Building","status":"PENDING","revision":"","plannedDate":"2026-10-23","reviewedBy":"","notes":""},{"trackerNumber":"00010.18","technicalNumber":"ZAZ081-CAF-80-XX-SU-M-0010.18","subpackage":"Auxiliary Buildings","title":"Pump House and water tank layout","status":"SUBMITTED","revision":"0","plannedDate":"2026-09-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"00010.19","technicalNumber":"ZAZ081-CAF-80-XX-SU-M-0010.19","subpackage":"Auxiliary Buildings","title":"Fire Pumps","status":"SUBMITTED","revision":"0","plannedDate":"2026-08-25","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"00010.20","technicalNumber":"ZAZ081-CAF-80-XX-SU-M-0010.20","subpackage":"Auxiliary Buildings","title":"Fire Water Tanks","status":"SUBMITTED","revision":"0","plannedDate":"2026-09-30","reviewedBy":"ARUP","notes":"Pending GC feedback"},{"trackerNumber":"00010.21","technicalNumber":"ZAZ081-CAF-80-XX-SU-M-0010.21","subpackage":"Auxiliary Buildings","title":"Isolation & Trace Heating pipes","status":"PENDING","revision":"","plannedDate":"2026-10-02","reviewedBy":"","notes":""},{"trackerNumber":"00010.22","technicalNumber":"ZAZ081-CAF-80-XX-SU-M-0010.22","subpackage":"Auxiliary Buildings","title":"Fire Pumps Test Procedure","status":"PENDING","revision":"","plannedDate":"2026-11-13","reviewedBy":"","notes":""},{"trackerNumber":"00010.23","technicalNumber":"ZAZ081-CAF-33-XX-SU-M-0010.23","subpackage":"Auxiliary Buildings","title":"Sprinklers System Access Control Building Layout","status":"PENDING","revision":"","plannedDate":"2026-10-23","reviewedBy":"","notes":""},{"trackerNumber":"00010.24","technicalNumber":"ZAZ081-CAF-80-XX-SU-M-0010.24","subpackage":"Auxiliary Buildings","title":"Fire Pumps Container","status":"SUBMITTED","revision":"1","plannedDate":"2026-07-24","reviewedBy":"ARUP","notes":"Pending GC feedback"}];

  const pending = rows.filter(item => {
    const technical = cleanKey_(item.technicalNumber);
    const tracker = cleanKey_(item.trackerNumber);

    if (technical && existingTechnical.has(technical)) return false;
    if (tracker && existingTracker.has(tracker)) return false;
    return true;
  });

  if (!pending.length) return;

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const headerRow = sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];

  const matrix = pending.map(item => {
    const record = {
      SUBMITTAL_ID:'M-SUB-ZAZ081-' +
        Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
      PROYECTO_ID:'ZAZ081',
      SUBPAQUETE:cleanText_(item.subpackage),
      TRACKER_NUM:cleanText_(item.trackerNumber),
      TECHNICAL_NUM:cleanText_(item.technicalNumber),
      TITULO:cleanText_(item.title),
      ESTADO:cleanKey_(item.status || 'PENDING'),
      REVISION:cleanText_(item.revision),
      RESPONSABLE:cleanText_(item.reviewedBy),
      FECHA_PLANIFICADA:cleanText_(item.plannedDate),
      FECHA_PREVISTA_APROBACION:'',
      FUENTE:'ZAZ081_Project_Submittal_Tracker_Rev01.xlsx',
      OBSERVACIONES:cleanText_(item.notes),
      ACTIVO:'SI',
      CREADO_POR:'IMPORT_TRACKER',
      FECHA_CREACION:now,
      ACTUALIZADO_POR:'IMPORT_TRACKER',
      FECHA_ACTUALIZACION:now
    };

    return headerRow.map(header => {
      const key = cleanKey_(header);
      return record[key] !== undefined ? record[key] : '';
    });
  });

  sh.getRange(
    sh.getLastRow() + 1,
    1,
    matrix.length,
    headerRow.length
  ).setValues(matrix);

  SpreadsheetApp.flush();
}


function mechanicalSubmittalsForProject_(projectId) {
  ensureMechanicalSubmittalSheets_();

  return readTable_(SHEETS.MECHANICAL_SUBMITTALS)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === cleanKey_(projectId) &&
      cleanKey_(row.ACTIVO || 'SI') !== 'NO'
    )
    .map(row => ({
      submittalId:cleanText_(row.SUBMITTAL_ID),
      projectId:cleanKey_(row.PROYECTO_ID),
      subpackage:cleanText_(row.SUBPAQUETE) || 'Sin subpaquete',
      trackerNumber:cleanText_(row.TRACKER_NUM),
      technicalNumber:cleanText_(row.TECHNICAL_NUM),
      title:cleanText_(row.TITULO),
      status:cleanKey_(row.ESTADO || 'PENDING') || 'PENDING',
      revision:cleanText_(row.REVISION),
      owner:cleanText_(row.RESPONSABLE),
      plannedDate:cleanText_(row.FECHA_PLANIFICADA),
      forecastApprovalDate:cleanText_(row.FECHA_PREVISTA_APROBACION),
      source:cleanText_(row.FUENTE),
      notes:cleanText_(row.OBSERVACIONES)
    }))
    .sort((a,b) =>
      (a.subpackage || '').localeCompare(b.subpackage || '') ||
      (a.trackerNumber || '').localeCompare(b.trackerNumber || '') ||
      (a.title || '').localeCompare(b.title || '')
    );
}


function mechanicalReadinessMap_(projectId, milestones) {
  const submittals = mechanicalSubmittalsForProject_(projectId);
  const byId = {};
  submittals.forEach(item => byId[item.submittalId] = item);

  const links = readTable_(SHEETS.MILESTONE_SUBMITTALS)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === cleanKey_(projectId) &&
      cleanKey_(row.ACTIVO || 'SI') !== 'NO'
    );

  const byMilestone = {};
  links.forEach(link => {
    const milestoneId = cleanText_(link.HITO_ID);
    if (!byMilestone[milestoneId]) byMilestone[milestoneId] = [];
    byMilestone[milestoneId].push(link);
  });

  const todayDays = isoDateDays_(todayIso_());
  const result = {};

  (milestones || []).forEach(milestone => {
    const linked = (byMilestone[milestone.milestoneId] || [])
      .map(link => byId[cleanText_(link.SUBMITTAL_ID)])
      .filter(Boolean);

    const approved = linked.filter(x => mechanicalIsApproved_(x.status));
    const blockers = linked.filter(x => !mechanicalIsApproved_(x.status));

    const milestoneDays = isoDateDays_(milestone.date);
    const daysToMilestone =
      milestoneDays !== null && todayDays !== null
        ? milestoneDays - todayDays
        : null;

    let latestForecastDays = null;
    blockers.forEach(item => {
      const d = isoDateDays_(item.forecastApprovalDate);
      if (d === null) return;
      latestForecastDays = latestForecastDays === null ? d : Math.max(latestForecastDays, d);
    });

    const forecastMarginDays =
      latestForecastDays !== null && milestoneDays !== null
        ? milestoneDays - latestForecastDays
        : null;

    const readinessIndex =
      linked.length
        ? Math.round((approved.length / linked.length) * 100)
        : 0;

    let readinessStatus = 'NOT_CONFIGURED';

    if (linked.length) {
      if (!blockers.length) {
        readinessStatus = 'READY';
      } else {
        const hardBlock = blockers.some(x =>
          ['C','D','REJECTED'].includes(cleanKey_(x.status))
        );
        const forecastLate = forecastMarginDays !== null && forecastMarginDays < 0;
        const milestoneReached = daysToMilestone !== null && daysToMilestone <= 0;

        readinessStatus =
          hardBlock || forecastLate || milestoneReached
            ? 'BLOCKED'
            : 'AT_RISK';
      }
    }

    const statusCounts = {
      A:0,B:0,C:0,D:0,SUBMITTED:0,PENDING:0,REJECTED:0
    };
    linked.forEach(x => {
      const key = cleanKey_(x.status);
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    });

    result[milestone.milestoneId] = {
      milestoneId:milestone.milestoneId,
      readinessStatus:readinessStatus,
      readinessIndex:readinessIndex,
      approvedSubmittals:approved.length,
      requiredSubmittals:linked.length,
      blockers:blockers.length,
      daysToMilestone:daysToMilestone,
      forecastMarginDays:forecastMarginDays,
      linkedSubmittals:linked,
      statusCounts:statusCounts
    };
  });

  return result;
}


function mechanicalReadiness_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);
  const projectId = cleanKey_(payload.projectId);

  requireProjectAccess_(session, projectId);
  ensureConstructionMilestonesSheet_();
  ensureMechanicalSubmittalSheets_();

  const submittals = mechanicalSubmittalsForProject_(projectId);

  const milestones = readTable_(SHEETS.CONSTRUCTION_MILESTONES)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === projectId &&
      cleanKey_(row.ACTIVO || 'SI') !== 'NO' &&
      ['', 'GENERAL', 'MECHANICAL'].includes(cleanKey_(row.DISCIPLINA))
    )
    .map(row => ({
      milestoneId:cleanText_(row.HITO_ID),
      projectId:projectId,
      title:cleanText_(row.TITULO),
      date:cleanText_(row.FECHA_HITO),
      type:cleanText_(row.TIPO),
      discipline:cleanText_(row.DISCIPLINA) || 'GENERAL',
      notes:cleanText_(row.NOTAS)
    }))
    .sort((a,b) =>
      (a.date || '').localeCompare(b.date || '') ||
      (a.title || '').localeCompare(b.title || '')
    );

  const links = readTable_(SHEETS.MILESTONE_SUBMITTALS)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === projectId &&
      cleanKey_(row.ACTIVO || 'SI') !== 'NO'
    )
    .map(row => ({
      linkId:cleanText_(row.LINK_ID),
      milestoneId:cleanText_(row.HITO_ID),
      submittalId:cleanText_(row.SUBMITTAL_ID)
    }));

  const readinessMap = mechanicalReadinessMap_(projectId, milestones);
  ensureFokSheets_();
  seedProjectFoks_(projectId);
  const fokReadinessMap = fokReadinessMap_(projectId, milestones);
  const foks = fokProjectData_(projectId);

  const fokLinks = readTable_(SHEETS.MILESTONE_FOK)
    .filter(row =>
      cleanKey_(row.PROYECTO_ID) === projectId &&
      cleanKey_(row.ACTIVO || 'SI') !== 'NO'
    )
    .map(row => ({
      linkId:cleanText_(row.LINK_ID),
      milestoneId:cleanText_(row.HITO_ID),
      fokId:cleanText_(row.FOK_ID)
    }));

  const linkedCount = {};
  links.forEach(link => {
    linkedCount[link.submittalId] = (linkedCount[link.submittalId] || 0) + 1;
  });
  submittals.forEach(item => {
    item.linkedMilestones = linkedCount[item.submittalId] || 0;
  });

  const subpackages = [...new Set(submittals.map(x => x.subpackage).filter(Boolean))].sort();

  return {
    ok:true,
    projectId:projectId,
    canEdit:mechanicalCanEdit_(session),
    submittals:submittals,
    subpackages:subpackages,
    milestones:milestones.map(m => Object.assign({}, m, {
      readiness:readinessMap[m.milestoneId] || null,
      fokReadiness:fokReadinessMap[m.milestoneId] || null
    })),
    links:links,
    foks:foks,
    fokLinks:fokLinks
  };
}


function mechanicalSubmittalSave_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);

  if (!mechanicalCanEdit_(session)) {
    throw new Error('No tienes permiso para editar submittals.');
  }

  const projectId = cleanKey_(payload.projectId);
  const submittalId = cleanText_(payload.submittalId);
  const subpackage = cleanText_(payload.subpackage);
  const title = cleanText_(payload.title);
  const trackerNumber = cleanText_(payload.trackerNumber);
  const technicalNumber = cleanText_(payload.technicalNumber);
  const status = cleanKey_(payload.status || 'PENDING') || 'PENDING';
  const revision = cleanText_(payload.revision);
  const owner = cleanText_(payload.owner);
  const plannedDate = cleanText_(payload.plannedDate);
  const forecast = cleanText_(payload.forecastApprovalDate);
  const notes = cleanText_(payload.notes);

  requireProjectAccess_(session, projectId);

  if (!subpackage) throw new Error('Indica el subpaquete.');
  if (!title) throw new Error('Indica el título del submittal.');
  if (!['A','B','C','D','SUBMITTED','PENDING','REJECTED'].includes(status)) {
    throw new Error('Estado de submittal no válido.');
  }
  if (plannedDate) validateBusinessDateSC3_(plannedDate, 'La fecha planificada');
  if (forecast) validateBusinessDateSC3_(forecast, 'La fecha prevista de aprobación');
  ensureMechanicalSubmittalSheets_();

  const sh = getSheet_(SHEETS.MECHANICAL_SUBMITTALS);
  const data = sh.getDataRange().getDisplayValues();
  const h = headerMap_(data[0]);

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  if (submittalId) {
    let rowNumber = 0;
    for (let i=1;i<data.length;i++) {
      if (
        cleanText_(data[i][h.SUBMITTAL_ID]) === submittalId &&
        cleanKey_(data[i][h.PROYECTO_ID]) === projectId
      ) {
        rowNumber = i + 1;
        break;
      }
    }

    if (!rowNumber) throw new Error('No existe el submittal indicado.');

    const updates = {
      SUBPAQUETE:subpackage,
      TRACKER_NUM:trackerNumber,
      TECHNICAL_NUM:technicalNumber,
      TITULO:title,
      ESTADO:status,
      REVISION:revision,
      RESPONSABLE:owner,
      FECHA_PLANIFICADA:plannedDate,
      FECHA_PREVISTA_APROBACION:forecast,
      OBSERVACIONES:notes,
      ACTIVO:'SI',
      ACTUALIZADO_POR:session.user.email,
      FECHA_ACTUALIZACION:now
    };

    Object.keys(updates).forEach(header => {
      sh.getRange(rowNumber, h[header]+1).setValue(updates[header]);
    });

    SpreadsheetApp.flush();
    return {ok:true,message:'Submittal actualizado.',submittalId:submittalId};
  }

  const newId = 'M-SUB-' + projectId + '-' +
    Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();

  appendRowByHeaders_(sh, {
    SUBMITTAL_ID:newId,
    PROYECTO_ID:projectId,
    SUBPAQUETE:subpackage,
    TRACKER_NUM:trackerNumber,
    TECHNICAL_NUM:technicalNumber,
    TITULO:title,
    ESTADO:status,
    REVISION:revision,
    RESPONSABLE:owner,
    FECHA_PLANIFICADA:plannedDate,
    FECHA_PREVISTA_APROBACION:forecast,
    FUENTE:'MANUAL',
    OBSERVACIONES:notes,
    ACTIVO:'SI',
    CREADO_POR:session.user.email,
    FECHA_CREACION:now,
    ACTUALIZADO_POR:session.user.email,
    FECHA_ACTUALIZACION:now
  });

  SpreadsheetApp.flush();
  return {ok:true,message:'Submittal añadido.',submittalId:newId};
}


function mechanicalSubmittalDelete_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);

  if (!mechanicalCanEdit_(session)) {
    throw new Error('No tienes permiso para eliminar submittals.');
  }

  const projectId = cleanKey_(payload.projectId);
  const submittalId = cleanText_(payload.submittalId);

  requireProjectAccess_(session, projectId);
  ensureMechanicalSubmittalSheets_();

  const sh = getSheet_(SHEETS.MECHANICAL_SUBMITTALS);
  const data = sh.getDataRange().getDisplayValues();
  const h = headerMap_(data[0]);
  let rowNumber = 0;

  for (let i=1;i<data.length;i++) {
    if (
      cleanText_(data[i][h.SUBMITTAL_ID]) === submittalId &&
      cleanKey_(data[i][h.PROYECTO_ID]) === projectId
    ) {
      rowNumber = i + 1;
      break;
    }
  }

  if (!rowNumber) throw new Error('No existe el submittal.');

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  sh.getRange(rowNumber, h.ACTIVO+1).setValue('NO');
  sh.getRange(rowNumber, h.ACTUALIZADO_POR+1).setValue(session.user.email);
  sh.getRange(rowNumber, h.FECHA_ACTUALIZACION+1).setValue(now);

  const linkSh = getSheet_(SHEETS.MILESTONE_SUBMITTALS);
  const linkData = linkSh.getDataRange().getDisplayValues();
  const lh = headerMap_(linkData[0]);

  for (let i=1;i<linkData.length;i++) {
    if (
      cleanKey_(linkData[i][lh.PROYECTO_ID]) === projectId &&
      cleanText_(linkData[i][lh.SUBMITTAL_ID]) === submittalId &&
      cleanKey_(linkData[i][lh.ACTIVO] || 'SI') !== 'NO'
    ) {
      linkSh.getRange(i+1, lh.ACTIVO+1).setValue('NO');
      linkSh.getRange(i+1, lh.ACTUALIZADO_POR+1).setValue(session.user.email);
      linkSh.getRange(i+1, lh.FECHA_ACTUALIZACION+1).setValue(now);
    }
  }

  SpreadsheetApp.flush();
  return {ok:true,message:'Submittal eliminado y asociaciones desactivadas.'};
}


function milestoneSubmittalLinksSaveBatch_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);

  if (!mechanicalCanEdit_(session)) {
    throw new Error('No tienes permiso para gestionar asociaciones.');
  }

  const projectId = cleanKey_(payload.projectId);
  const milestoneId = cleanText_(payload.milestoneId);
  const selectedIds = Array.isArray(payload.submittalIds)
    ? [...new Set(payload.submittalIds.map(cleanText_).filter(Boolean))]
    : [];

  requireProjectAccess_(session, projectId);
  ensureMechanicalSubmittalSheets_();

  // Validación directa, sin volver a ejecutar setup/seed.
  const milestone = readTable_(SHEETS.CONSTRUCTION_MILESTONES).find(row =>
    cleanText_(row.HITO_ID) === milestoneId &&
    cleanKey_(row.PROYECTO_ID) === projectId &&
    cleanKey_(row.ACTIVO || 'SI') !== 'NO'
  );

  if (!milestone) {
    throw new Error('El hito no existe en este proyecto.');
  }

  const validIds = new Set(
    readTable_(SHEETS.MECHANICAL_SUBMITTALS)
      .filter(row =>
        cleanKey_(row.PROYECTO_ID) === projectId &&
        cleanKey_(row.ACTIVO || 'SI') !== 'NO'
      )
      .map(row => cleanText_(row.SUBMITTAL_ID))
      .filter(Boolean)
  );

  selectedIds.forEach(id => {
    if (!validIds.has(id)) {
      throw new Error('Hay un submittal seleccionado que no pertenece al proyecto.');
    }
  });

  const sh = getSheet_(SHEETS.MILESTONE_SUBMITTALS);
  const range = sh.getDataRange();
  const data = range.getDisplayValues();
  const h = headerMap_(data[0]);

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const selectedSet = new Set(selectedIds);
  const existingIds = new Set();
  let changedExisting = false;

  // Modificamos en memoria todas las filas existentes del hito.
  for (let i=1;i<data.length;i++) {
    if (
      cleanKey_(data[i][h.PROYECTO_ID]) !== projectId ||
      cleanText_(data[i][h.HITO_ID]) !== milestoneId
    ) {
      continue;
    }

    const submittalId = cleanText_(data[i][h.SUBMITTAL_ID]);
    if (!submittalId) continue;

    existingIds.add(submittalId);

    const newActive = selectedSet.has(submittalId) ? 'SI' : 'NO';

    if (
      cleanKey_(data[i][h.ACTIVO]) !== newActive ||
      cleanText_(data[i][h.ACTUALIZADO_POR]) !== session.user.email ||
      cleanText_(data[i][h.FECHA_ACTUALIZACION]) !== now
    ) {
      data[i][h.ACTIVO] = newActive;
      data[i][h.ACTUALIZADO_POR] = session.user.email;
      data[i][h.FECHA_ACTUALIZACION] = now;
      changedExisting = true;
    }
  }

  // Una sola escritura para todas las filas existentes.
  if (changedExisting && data.length > 1) {
    sh.getRange(2,1,data.length - 1,data[0].length)
      .setValues(data.slice(1));
  }

  // Nuevas asociaciones: construirlas en memoria y escribirlas de una vez.
  const headerRow = data[0];
  const newRows = [];

  selectedIds.forEach(submittalId => {
    if (existingIds.has(submittalId)) return;

    const record = {
      LINK_ID:'HSL-' + Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
      PROYECTO_ID:projectId,
      HITO_ID:milestoneId,
      SUBMITTAL_ID:submittalId,
      ACTIVO:'SI',
      CREADO_POR:session.user.email,
      FECHA_CREACION:now,
      ACTUALIZADO_POR:session.user.email,
      FECHA_ACTUALIZACION:now
    };

    newRows.push(
      headerRow.map(header => {
        const key = cleanKey_(header);
        return record[key] !== undefined ? record[key] : '';
      })
    );
  });

  if (newRows.length) {
    sh.getRange(
      sh.getLastRow() + 1,
      1,
      newRows.length,
      headerRow.length
    ).setValues(newRows);
  }

  SpreadsheetApp.flush();

  return {
    ok:true,
    message:'Asociación guardada.',
    selectedCount:selectedIds.length,
    newLinks:newRows.length
  };
}



/* =========================================================
   MECHANICAL · FIRST OF A KIND (FoK)
   Catálogo compartido + tracker independiente por proyecto
   ========================================================= */

function ensureFokSheets_() {
  const props = PropertiesService.getScriptProperties();
  const setupKey = 'MECHANICAL_FOK_SETUP_V1';
  if (props.getProperty(setupKey) === 'DONE') return;

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    if (props.getProperty(setupKey) === 'DONE') return;

    const ss = getDb_();

    ensureSheetHeaders_(ss, SHEETS.FOK_MASTER, [
      'FOK_ID','DISCIPLINA','CATEGORIA','BENCHMARK_NAME',
      'SITE','DC','AWB','ACB','CAB','DODING','ACTIVO'
    ]);

    ensureSheetHeaders_(ss, SHEETS.FOK_PROJECT, [
      'PROJECT_FOK_ID','PROYECTO_ID','FOK_ID',
      'DOC_STATUS','EXECUTION_STATUS','RESPONSABLE',
      'FECHA_INSPECCION','REPORT_LINK','COMMENTS',
      'INSPECTION_TOOL_LINK','COPIED_FROM_PROJECT','COPIED_AT',
      'ACTIVO','CREADO_POR','FECHA_CREACION',
      'ACTUALIZADO_POR','FECHA_ACTUALIZACION'
    ]);

    ensureSheetHeaders_(ss, SHEETS.MILESTONE_FOK, [
      'LINK_ID','PROYECTO_ID','HITO_ID','FOK_ID',
      'ACTIVO','CREADO_POR','FECHA_CREACION',
      'ACTUALIZADO_POR','FECHA_ACTUALIZACION'
    ]);

    seedFokMaster_();
    seedProjectFoks_('ZAZ081');
    seedProjectFoks_('ZAZ091');

    props.setProperty(setupKey, 'DONE');
  } finally {
    lock.releaseLock();
  }
}


function seedFokMaster_() {
  const sh = getSheet_(SHEETS.FOK_MASTER);
  const existing = readTable_(SHEETS.FOK_MASTER);
  const existingIds = new Set(existing.map(r => cleanText_(r.FOK_ID)).filter(Boolean));

  const rows = [{"fokId":"M001","discipline":"MECHANICAL","category":"Data Hall Cooling","benchmarkName":"DAHU, IW Distribution Pipework serving DAHUs, water arrestors","site":"","dc":"X","awb":"","acb":"","cab":"","doding":"MEP - Mech - DAHU - Equipment Installation"},{"fokId":"M002","discipline":"MECHANICAL","category":"Data Hall Cooling","benchmarkName":"Exhaust Fan","site":"","dc":"X","awb":"","acb":"","cab":"","doding":"MEP - Mech - DAHU - Exhaust Fan Installation"},{"fokId":"M003","discipline":"MECHANICAL","category":"Electrical Room","benchmarkName":"CRAC","site":"","dc":"X","awb":"","acb":"","cab":"","doding":""},{"fokId":"M012","discipline":"MECHANICAL","category":"Admin Area","benchmarkName":"Split Systems","site":"","dc":"X","awb":"X","acb":"X","cab":"X","doding":"MEP - Mech - HVAC - Splits Installation"},{"fokId":"M017","discipline":"MECHANICAL","category":"IW System","benchmarkName":"IW Oxidation Skid / IW Pump Set / Water meters / PICVs","site":"","dc":"X","awb":"","acb":"","cab":"","doding":"MEP - Mech - IW - Installation"},{"fokId":"M018","discipline":"MECHANICAL","category":"IW System","benchmarkName":"IW Distribution Pipework serving DAHUs","site":"","dc":"X","awb":"","acb":"","cab":"","doding":"MEP - Mech - DAHU - Installation"},{"fokId":"M020","discipline":"MECHANICAL","category":"Diesel System","benchmarkName":"Tank Assembly / Airpurges in wet sprn system / Attenuation tank discharge valve / drain points, test poitns, nitrogen purge valves / Trace Heating","site":"X","dc":"","awb":"","acb":"","cab":"","doding":"MEP - Mech - Tank -  Diesel Tank Installation"},{"fokId":"M021","discipline":"MECHANICAL","category":"Diesel System","benchmarkName":"Diesel Distribution Skid / Pipework and connection","site":"","dc":"X","awb":"X","acb":"","cab":"","doding":"MEP - Mech - Diesel - Skid Installation"},{"fokId":"M024","discipline":"MECHANICAL","category":"General","benchmarkName":"MDPE Pipe - Support/Insulation/Cladding","site":"X","dc":"X","awb":"X","acb":"X","cab":"X","doding":"MEP - Mech - Piping -MDPE Piping Installation"},{"fokId":"M025","discipline":"MECHANICAL","category":"HVAC","benchmarkName":"VCD","site":"","dc":"X","awb":"","acb":"","cab":"","doding":""},{"fokId":"M026","discipline":"MECHANICAL","category":"HVAC","benchmarkName":"Fire Dampers","site":"","dc":"X","awb":"","acb":"","cab":"","doding":"MEP - HVAC - Sealing Ductwork Installation"},{"fokId":"M034","discipline":"MECHANICAL","category":"IW System","benchmarkName":"End of ROMP IW bypass and air vents","site":"","dc":"X","awb":"","acb":"","cab":"","doding":""},{"fokId":"M035","discipline":"MECHANICAL","category":"BMS","benchmarkName":"Data hall sensors","site":"","dc":"X","awb":"","acb":"","cab":"","doding":"MEP - Elec - BMS DH sensors installation"},{"fokId":"M038","discipline":"MECHANICAL","category":"Generator Exhaust Ducts","benchmarkName":"Chimneys detail","site":"","dc":"X","awb":"X","acb":"","cab":"","doding":"MEP - Mech - Generator - Installation Cimmney"},{"fokId":"M039","discipline":"MECHANICAL","category":"HVAC","benchmarkName":"Condensate pumps (if any) and drainages","site":"","dc":"X","awb":"X","acb":"X","cab":"X","doding":"MEP - Mech - HVAC - Condensate Installation"},{"fokId":"M040","discipline":"MECHANICAL","category":"IW system","benchmarkName":"Tank Assembly","site":"","dc":"X","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M041","discipline":"MECHANICAL","category":"Electrical Room","benchmarkName":"HRU","site":"","dc":"X","awb":"","acb":"","cab":"","doding":""},{"fokId":"M042","discipline":"MECHANICAL","category":"IW System","benchmarkName":"IW Pump Set","site":"","dc":"X","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M043","discipline":"MECHANICAL","category":"IW System","benchmarkName":"Water meters / PICVs","site":"","dc":"X","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M044","discipline":"MECHANICAL","category":"IW System","benchmarkName":"IW Oxidation Skid","site":"","dc":"X","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M045","discipline":"MECHANICAL","category":"IW System","benchmarkName":"Clarifier","site":"","dc":"","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M046","discipline":"MECHANICAL","category":"IW System","benchmarkName":"UF skid","site":"","dc":"","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M047","discipline":"MECHANICAL","category":"IW System","benchmarkName":"RO skid","site":"","dc":"","awb":"X","acb":"","cab":"","doding":""},{"fokId":"M048","discipline":"MECHANICAL","category":"IW System","benchmarkName":"Chemical dosing system","site":"","dc":"","awb":"X","acb":"","cab":"","doding":""}];
  const headerRow = sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];
  const newRows = [];

  rows.forEach(item => {
    if (existingIds.has(item.fokId)) return;

    const record = {
      FOK_ID:item.fokId,
      DISCIPLINA:item.discipline,
      CATEGORIA:item.category,
      BENCHMARK_NAME:item.benchmarkName,
      SITE:item.site,
      DC:item.dc,
      AWB:item.awb,
      ACB:item.acb,
      CAB:item.cab,
      DODING:item.doding,
      ACTIVO:'SI'
    };

    newRows.push(headerRow.map(header => {
      const key = cleanKey_(header);
      return record[key] !== undefined ? record[key] : '';
    }));
  });

  if (newRows.length) {
    sh.getRange(sh.getLastRow()+1,1,newRows.length,headerRow.length).setValues(newRows);
    SpreadsheetApp.flush();
  }
}


function seedProjectFoks_(projectId) {
  const master = readTable_(SHEETS.FOK_MASTER)
    .filter(r =>
      cleanKey_(r.DISCIPLINA) === 'MECHANICAL' &&
      cleanKey_(r.ACTIVO || 'SI') !== 'NO'
    );

  const sh = getSheet_(SHEETS.FOK_PROJECT);
  const existing = readTable_(SHEETS.FOK_PROJECT)
    .filter(r => cleanKey_(r.PROYECTO_ID) === cleanKey_(projectId));

  const existingIds = new Set(existing.map(r => cleanText_(r.FOK_ID)).filter(Boolean));
  const headerRow = sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];
  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const rows = [];

  master.forEach(item => {
    const fokId = cleanText_(item.FOK_ID);
    if (!fokId || existingIds.has(fokId)) return;

    const record = {
      PROJECT_FOK_ID:'PFOK-' + projectId + '-' + fokId,
      PROYECTO_ID:projectId,
      FOK_ID:fokId,
      DOC_STATUS:'PENDING',
      EXECUTION_STATUS:'NOT_PLANNED',
      RESPONSABLE:'',
      FECHA_INSPECCION:'',
      REPORT_LINK:'',
      COMMENTS:'',
      INSPECTION_TOOL_LINK:'',
      COPIED_FROM_PROJECT:'',
      COPIED_AT:'',
      ACTIVO:'SI',
      CREADO_POR:'FOK_MASTER',
      FECHA_CREACION:now,
      ACTUALIZADO_POR:'FOK_MASTER',
      FECHA_ACTUALIZACION:now
    };

    rows.push(headerRow.map(header => {
      const key = cleanKey_(header);
      return record[key] !== undefined ? record[key] : '';
    }));
  });

  if (rows.length) {
    sh.getRange(sh.getLastRow()+1,1,rows.length,headerRow.length).setValues(rows);
    SpreadsheetApp.flush();
  }
}


function siblingFokProject_(projectId) {
  const p = cleanKey_(projectId);
  if (p === 'ZAZ081') return 'ZAZ091';
  if (p === 'ZAZ091') return 'ZAZ081';
  return '';
}


function fokDocReady_(status) {
  return ['READY','COPIED'].includes(cleanKey_(status));
}


function fokExecutionReady_(status) {
  return cleanKey_(status) === 'APPROVED';
}


function fokProjectData_(projectId) {
  ensureFokSheets_();
  seedProjectFoks_(projectId);

  const master = readTable_(SHEETS.FOK_MASTER);
  const masterMap = {};
  master.forEach(r => masterMap[cleanText_(r.FOK_ID)] = r);

  const allProject = readTable_(SHEETS.FOK_PROJECT)
    .filter(r => cleanKey_(r.ACTIVO || 'SI') !== 'NO');

  const currentMap = {};
  const siblingMap = {};
  const siblingProject = siblingFokProject_(projectId);

  allProject.forEach(r => {
    const pid = cleanKey_(r.PROYECTO_ID);
    const fokId = cleanText_(r.FOK_ID);
    if (pid === cleanKey_(projectId)) currentMap[fokId] = r;
    if (siblingProject && pid === siblingProject) siblingMap[fokId] = r;
  });

  return Object.keys(currentMap).map(fokId => {
    const row = currentMap[fokId];
    const m = masterMap[fokId] || {};
    const sibling = siblingMap[fokId] || null;

    const siblingReady = sibling && fokDocReady_(sibling.DOC_STATUS);
    const currentReady = fokDocReady_(row.DOC_STATUS);

    return {
      fokId:fokId,
      projectId:cleanKey_(projectId),
      category:cleanText_(m.CATEGORIA),
      benchmarkName:cleanText_(m.BENCHMARK_NAME),
      applicability:{
        site:cleanKey_(m.SITE) === 'X',
        dc:cleanKey_(m.DC) === 'X',
        awb:cleanKey_(m.AWB) === 'X',
        acb:cleanKey_(m.ACB) === 'X',
        cab:cleanKey_(m.CAB) === 'X'
      },
      doding:cleanText_(m.DODING),
      docStatus:cleanKey_(row.DOC_STATUS || 'PENDING'),
      executionStatus:cleanKey_(row.EXECUTION_STATUS || 'NOT_PLANNED'),
      owner:cleanText_(row.RESPONSABLE),
      inspectionDate:cleanText_(row.FECHA_INSPECCION),
      reportLink:cleanText_(row.REPORT_LINK),
      comments:cleanText_(row.COMMENTS),
      inspectionToolLink:cleanText_(row.INSPECTION_TOOL_LINK),
      copiedFromProject:cleanKey_(row.COPIED_FROM_PROJECT),
      siblingProject:siblingProject,
      siblingDocStatus:sibling ? cleanKey_(sibling.DOC_STATUS || 'PENDING') : '',
      siblingExecutionStatus:sibling ? cleanKey_(sibling.EXECUTION_STATUS || 'NOT_PLANNED') : '',
      copyAvailable:Boolean(siblingReady && !currentReady)
    };
  }).sort((a,b) => a.fokId.localeCompare(b.fokId));
}


function fokReadinessMap_(projectId, milestones) {
  const foks = fokProjectData_(projectId);
  const byId = {};
  foks.forEach(x => byId[x.fokId] = x);

  const links = readTable_(SHEETS.MILESTONE_FOK)
    .filter(r =>
      cleanKey_(r.PROYECTO_ID) === cleanKey_(projectId) &&
      cleanKey_(r.ACTIVO || 'SI') !== 'NO'
    );

  const byMilestone = {};
  links.forEach(r => {
    const id = cleanText_(r.HITO_ID);
    if (!byMilestone[id]) byMilestone[id] = [];
    byMilestone[id].push(cleanText_(r.FOK_ID));
  });

  const result = {};

  (milestones || []).forEach(m => {
    const linked = (byMilestone[m.milestoneId] || [])
      .map(id => byId[id])
      .filter(Boolean);

    const approved = linked.filter(x => fokExecutionReady_(x.executionStatus));
    const blockers = linked.filter(x => !fokExecutionReady_(x.executionStatus));
    const docReusable = linked.filter(x => x.copyAvailable);

    result[m.milestoneId] = {
      requiredFoks:linked.length,
      approvedFoks:approved.length,
      blockers:blockers.length,
      docReuseAvailable:docReusable.length,
      readinessStatus:
        !linked.length ? 'NOT_CONFIGURED' :
        !blockers.length ? 'READY' : 'BLOCKED',
      linkedFoks:linked
    };
  });

  return result;
}


function fokProjectSave_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);

  if (!mechanicalCanEdit_(session)) {
    throw new Error('No tienes permiso para editar FoK.');
  }

  const projectId = cleanKey_(payload.projectId);
  const fokId = cleanText_(payload.fokId);
  if (cleanText_(payload.inspectionDate)) validateBusinessDateSC3_(payload.inspectionDate, 'La fecha de inspección');
  requireProjectAccess_(session, projectId);
  ensureFokSheets_();
  seedProjectFoks_(projectId);

  const docStatus = cleanKey_(payload.docStatus || 'PENDING');
  const executionStatus = cleanKey_(payload.executionStatus || 'NOT_PLANNED');

  if (!['PENDING','IN_PROGRESS','READY','COPIED'].includes(docStatus)) {
    throw new Error('Estado documental FoK no válido.');
  }

  if (!['NOT_PLANNED','PLANNED','INSPECTED','APPROVED','REINSPECTION'].includes(executionStatus)) {
    throw new Error('Estado de ejecución FoK no válido.');
  }

  const sh = getSheet_(SHEETS.FOK_PROJECT);
  const data = sh.getDataRange().getDisplayValues();
  const h = headerMap_(data[0]);
  let rowNumber = 0;

  for (let i=1;i<data.length;i++) {
    if (
      cleanKey_(data[i][h.PROYECTO_ID]) === projectId &&
      cleanText_(data[i][h.FOK_ID]) === fokId
    ) {
      rowNumber = i + 1;
      break;
    }
  }

  if (!rowNumber) throw new Error('No se encuentra el FoK del proyecto.');

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  const updates = {
    DOC_STATUS:docStatus,
    EXECUTION_STATUS:executionStatus,
    RESPONSABLE:cleanText_(payload.owner),
    FECHA_INSPECCION:cleanText_(payload.inspectionDate),
    REPORT_LINK:cleanText_(payload.reportLink),
    COMMENTS:cleanText_(payload.comments),
    INSPECTION_TOOL_LINK:cleanText_(payload.inspectionToolLink),
    ACTUALIZADO_POR:session.user.email,
    FECHA_ACTUALIZACION:now
  };

  Object.keys(updates).forEach(key => {
    sh.getRange(rowNumber,h[key]+1).setValue(updates[key]);
  });

  SpreadsheetApp.flush();
  return {ok:true,message:'FoK actualizado.'};
}


function fokCopyDocumentation_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);

  if (!mechanicalCanEdit_(session)) {
    throw new Error('No tienes permiso para copiar documentación FoK.');
  }

  const targetProject = cleanKey_(payload.projectId);
  const fokId = cleanText_(payload.fokId);
  const sourceProject = siblingFokProject_(targetProject);

  if (!sourceProject) throw new Error('No hay proyecto equivalente configurado.');

  requireProjectAccess_(session, targetProject);
  requireProjectAccess_(session, sourceProject); // SC-A07: authorize both sides before reads or seeding.
  ensureFokSheets_();
  seedProjectFoks_(targetProject);
  seedProjectFoks_(sourceProject);

  const sh = getSheet_(SHEETS.FOK_PROJECT);
  const data = sh.getDataRange().getDisplayValues();
  const h = headerMap_(data[0]);

  let sourceRow = null;
  let targetRowNumber = 0;

  for (let i=1;i<data.length;i++) {
    const pid = cleanKey_(data[i][h.PROYECTO_ID]);
    const id = cleanText_(data[i][h.FOK_ID]);

    if (pid === sourceProject && id === fokId) sourceRow = data[i];
    if (pid === targetProject && id === fokId) targetRowNumber = i + 1;
  }

  if (!sourceRow || !targetRowNumber) throw new Error('No se encuentra el FoK origen/destino.');
  if (!fokDocReady_(sourceRow[h.DOC_STATUS])) {
    throw new Error('La documentación del proyecto origen todavía no está lista.');
  }

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  // Copia únicamente la parte documental. La ejecución/inspección sigue siendo
  // independiente para el proyecto destino.
  const copies = {
    DOC_STATUS:'COPIED',
    REPORT_LINK:sourceRow[h.REPORT_LINK],
    COMMENTS:sourceRow[h.COMMENTS],
    INSPECTION_TOOL_LINK:sourceRow[h.INSPECTION_TOOL_LINK],
    COPIED_FROM_PROJECT:sourceProject,
    COPIED_AT:now,
    ACTUALIZADO_POR:session.user.email,
    FECHA_ACTUALIZACION:now
  };

  Object.keys(copies).forEach(key => {
    sh.getRange(targetRowNumber,h[key]+1).setValue(copies[key] || '');
  });

  SpreadsheetApp.flush();

  return {
    ok:true,
    message:'Documentación copiada desde ' + sourceProject + '. La inspección del FoK sigue pendiente en ' + targetProject + '.'
  };
}


function milestoneFokLinksSaveBatch_(p) {
  const session = requireAuthenticatedUser_(p, 'MECHANICAL_VIEW');
  const payload = parsePayload_(p.payload);

  if (!mechanicalCanEdit_(session)) {
    throw new Error('No tienes permiso para gestionar FoK del hito.');
  }

  const projectId = cleanKey_(payload.projectId);
  const milestoneId = cleanText_(payload.milestoneId);
  const selectedIds = Array.isArray(payload.fokIds)
    ? [...new Set(payload.fokIds.map(cleanText_).filter(Boolean))]
    : [];

  requireProjectAccess_(session, projectId);
  ensureFokSheets_();

  const sh = getSheet_(SHEETS.MILESTONE_FOK);
  const data = sh.getDataRange().getDisplayValues();
  const h = headerMap_(data[0]);
  const selectedSet = new Set(selectedIds);
  const existing = new Set();

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone() || 'Europe/Madrid',
    'yyyy-MM-dd HH:mm:ss'
  );

  let changed = false;

  for (let i=1;i<data.length;i++) {
    if (
      cleanKey_(data[i][h.PROYECTO_ID]) !== projectId ||
      cleanText_(data[i][h.HITO_ID]) !== milestoneId
    ) continue;

    const fokId = cleanText_(data[i][h.FOK_ID]);
    if (!fokId) continue;
    existing.add(fokId);

    const active = selectedSet.has(fokId) ? 'SI' : 'NO';
    if (cleanKey_(data[i][h.ACTIVO]) !== active) {
      data[i][h.ACTIVO] = active;
      data[i][h.ACTUALIZADO_POR] = session.user.email;
      data[i][h.FECHA_ACTUALIZACION] = now;
      changed = true;
    }
  }

  if (changed && data.length > 1) {
    sh.getRange(2,1,data.length-1,data[0].length).setValues(data.slice(1));
  }

  const headerRow = data[0];
  const newRows = [];

  selectedIds.forEach(fokId => {
    if (existing.has(fokId)) return;

    const record = {
      LINK_ID:'HFK-' + Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
      PROYECTO_ID:projectId,
      HITO_ID:milestoneId,
      FOK_ID:fokId,
      ACTIVO:'SI',
      CREADO_POR:session.user.email,
      FECHA_CREACION:now,
      ACTUALIZADO_POR:session.user.email,
      FECHA_ACTUALIZACION:now
    };

    newRows.push(headerRow.map(header => {
      const key = cleanKey_(header);
      return record[key] !== undefined ? record[key] : '';
    }));
  });

  if (newRows.length) {
    sh.getRange(sh.getLastRow()+1,1,newRows.length,headerRow.length).setValues(newRows);
  }

  SpreadsheetApp.flush();
  return {ok:true,message:'FoK aplicables al hito actualizados.'};
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
      has('PURCHASE_VIEW') ||
      has('PURCHASE_MANAGE') ||
      ['ADMIN', 'PROJECT_MANAGER', 'SITE_MANAGER', 'ENGINEER', 'ADMINISTRATION']
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


function repairPurchaseRequestsV031_() {
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

function testUserAccess_() {
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
// Añade temporalmente esta función al Code.gs de Site Control.
// Ejecútala desde el editor de Apps Script. NO es necesario desplegarla.
// No modifica datos ni envía correos.
function diagnosticarDestinatariosZAZ091_() {
  const projectId = 'ZAZ091';
  const users = readTable_(SHEETS.USERS);
  const assignments = readUserProjectAssignments_();
  Logger.log('Encabezados USUARIO_PROYECTO: ' +
    getSheet_(SHEETS.USER_PROJECT).getRange(1, 1, 1,
      getSheet_(SHEETS.USER_PROJECT).getLastColumn()).getDisplayValues()[0].join(' | '));
  const assignedEmails = new Set(assignments
    .filter(row => isYes_(row.ACTIVO) && cleanKey_(row.PROYECTO_ID) === projectId)
    .map(row => cleanEmail_(row.EMAIL)));
  const report = users.map(row => ({
    email: cleanEmail_(row.EMAIL),
    activo: isYes_(row.ACTIVO),
    notificarPedidos: isYes_(row.NOTIFICAR_PEDIDOS),
    asignadoAZAZ091: assignedEmails.has(cleanEmail_(row.EMAIL)),
    emailEmpresaInformado: !!cleanEmail_(row.EMAIL_EMPRESA),
    elegible: isYes_(row.ACTIVO) && isYes_(row.NOTIFICAR_PEDIDOS) && assignedEmails.has(cleanEmail_(row.EMAIL))
  }));
  Logger.log(JSON.stringify(report, null, 2));
  Logger.log('Destinatarios detectados: ' + JSON.stringify(purchaseAdministrationRecipients_(projectId)));
}


/* =========================================================
   MECHANICAL / PLANOS - additive, project-scoped, audited
   No existing submittal or FOK data is modified.
   ========================================================= */
const DRAWING_HEADERS_ = [
 'PLANO_ID','PROYECTO_ID','CODIGO','TITULO','TIPO','DISCIPLINA','ZONA',
 'REVISION','ESTADO','ESTADO_CDE','DELINEANTE','INGENIERO','RESPONSABLE_DESBLOQUEO',
 'FECHA_LIMITE','RUTA','REFERENCIA_SUBMITTAL','NOTAS','APROBACION_ARUP_EVIDENCIA',
 'ORIGEN','ACTIVO','CREADO_POR','FECHA_CREACION','MODIFICADO_POR','FECHA_MODIFICACION','SUBMITTAL_REQUERIDO'
];
const DRAWING_HISTORY_HEADERS_ = [
 'EVENTO_ID','PLANO_ID','PROYECTO_ID','FECHA','ACTOR','TIPO_EVENTO',
 'ESTADO_ANTERIOR','ESTADO_NUEVO','REVISION_ANTERIOR','REVISION_NUEVA','DETALLE'
];
const DRAWING_MILESTONE_HEADERS_ = ['PROYECTO_ID','HITO_ID','PLANO_ID','ACTIVO','FECHA_MODIFICACION','MODIFICADO_POR'];
const DRAWING_STATES_ = [
 'PENDIENTE','EN_DESARROLLO','BORRADOR_ENTREGADO','REVISION_INTERNA',
 'VALIDADO_INTERNAMENTE','SUBMITTADO','APROBADO_ARUP','RECHAZADO_ARUP','BLOQUEADO'
];
function drawingEnsure_() {
  const ss = getDb_();
  [[SHEETS.DRAWINGS,DRAWING_HEADERS_],[SHEETS.DRAWING_HISTORY,DRAWING_HISTORY_HEADERS_],
   [SHEETS.MILESTONE_DRAWINGS,DRAWING_MILESTONE_HEADERS_]].forEach(pair => {
    let sh=ss.getSheetByName(pair[0]);
    if(!sh) { sh=ss.insertSheet(pair[0]); sh.getRange(1,1,1,pair[1].length).setValues([pair[1]]); sh.setFrozenRows(1); }
    else {
      const current=sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getDisplayValues()[0].map(cleanKey_);
      pair[1].forEach(header => { if(!current.includes(header)) { if(header==='SUBMITTAL_REQUERIDO' && pair[0]===SHEETS.DRAWINGS) { sh.getRange(1,sh.getLastColumn()+1).setValue(header); current.push(header); } else throw new Error('Esquema incompatible en '+pair[0]+': falta '+header); } });
    }
  });
}
function drawingClassify_(code, flag) {
  const segments=cleanKey_(code).split('-');
  const isXX=segments.includes('XX'),isCM=segments.includes('CM');
  if(isXX===isCM) throw new Error('El código debe contener el segmento XX (ARUP) o CM (Levitec).');
  if(isXX) return {type:'ARUP_REFERENCIA',required:'SI'};
  if(!['SI','NO'].includes(cleanKey_(flag))) throw new Error('Indica si el plano CM requiere submittal.');
  return {type:cleanKey_(flag)==='SI'?'LEVITEC_SUBMITTAL':'LEVITEC_INTERNO',required:cleanKey_(flag)};
}
function drawingRequired_(d) {
  if(d.type==='ARUP_REFERENCIA' || d.TIPO==='ARUP_REFERENCIA') return true;
  return d.submittalRequired==='SI' || d.SUBMITTAL_REQUERIDO==='SI' ||
    (d.type==='LEVITEC_SUBMITTAL' || d.TIPO==='LEVITEC_SUBMITTAL');
}
function drawingRole_(session) {
  return cleanKey_(session.user.role);
}
function drawingCanEdit_(session) {
  return ['ADMIN','PROJECT_MANAGER','SITE_MANAGER','ENGINEER','DRAUGHTSMAN','DELINEANTE','BIM'].includes(drawingRole_(session));
}
function drawingCanValidate_(session) {
  return ['ADMIN','PROJECT_MANAGER','ENGINEER'].includes(drawingRole_(session));
}
function drawingNow_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone()||'Europe/Madrid','yyyy-MM-dd HH:mm:ss'); }
function drawingFindRow_(sh, drawingId) {
  const values=sh.getDataRange().getDisplayValues();
  const h=headerMap_(values[0]);
  for(let i=1;i<values.length;i++) if(cleanText_(values[i][h.PLANO_ID])===drawingId) {
    const data={}; Object.keys(h).forEach(k=>data[k]=values[i][h[k]]);
    return {number:i+1,data,headers:h};
  }
  return null;
}
function mechanicalDrawingList_(p) {
  const session=requireAuthenticatedUser_(p,'MECHANICAL_VIEW');
  const projectId=cleanKey_(parsePayload_(p.payload).projectId);
  requireProjectAccess_(session,projectId);
  drawingEnsure_();
  const drawings=readTable_(SHEETS.DRAWINGS).filter(x=>cleanKey_(x.PROYECTO_ID)===projectId && cleanKey_(x.ACTIVO||'SI')!=='NO')
   .map(x=>({id:x.PLANO_ID,projectId:x.PROYECTO_ID,code:x.CODIGO,title:x.TITULO,type:x.TIPO,
     discipline:x.DISCIPLINA,zone:x.ZONA,revision:x.REVISION,status:x.ESTADO,cdeStatus:x.ESTADO_CDE,
     draughtsman:x.DELINEANTE,engineer:x.INGENIERO,unblockOwner:x.RESPONSABLE_DESBLOQUEO,
     deadline:x.FECHA_LIMITE,path:x.RUTA,submittalRef:x.REFERENCIA_SUBMITTAL,notes:x.NOTAS,
     evidence:x.APROBACION_ARUP_EVIDENCIA,source:x.ORIGEN,submittalRequired:x.TIPO==='ARUP_REFERENCIA'?'SI':cleanKey_(x.SUBMITTAL_REQUERIDO||'NO'),updatedAt:x.FECHA_MODIFICACION}));
  const ids=new Set(drawings.map(x=>x.id));
  const links=readTable_(SHEETS.MILESTONE_DRAWINGS)
    .filter(x=>cleanKey_(x.PROYECTO_ID)===projectId && cleanKey_(x.ACTIVO||'SI')!=='NO' && ids.has(x.PLANO_ID))
    .map(x=>({drawingId:x.PLANO_ID,milestoneId:x.HITO_ID}));
  return {ok:true,projectId,drawings,links,canEdit:drawingCanEdit_(session),canValidate:drawingCanValidate_(session)};
}
function mechanicalDrawingHistory_(p) {
  const session=requireAuthenticatedUser_(p,'MECHANICAL_VIEW');
  const d=parsePayload_(p.payload),projectId=cleanKey_(d.projectId),drawingId=cleanText_(d.drawingId);
  requireProjectAccess_(session,projectId);
  if(!drawingId) throw new Error('Falta el identificador del plano.');
  drawingEnsure_();
  const found=drawingFindRow_(getSheet_(SHEETS.DRAWINGS),drawingId);
  if(!found || cleanKey_(found.data.PROYECTO_ID)!==projectId) throw new Error('Plano no encontrado en este proyecto.');
  const history=readTable_(SHEETS.DRAWING_HISTORY)
    .filter(x=>cleanKey_(x.PROYECTO_ID)===projectId && cleanText_(x.PLANO_ID)===drawingId)
    .map(x=>({drawingId:x.PLANO_ID,at:x.FECHA,actor:x.ACTOR,event:x.TIPO_EVENTO,
      from:x.ESTADO_ANTERIOR,to:x.ESTADO_NUEVO,oldRevision:x.REVISION_ANTERIOR,
      revision:x.REVISION_NUEVA,detail:x.DETALLE}));
  return {ok:true,projectId,drawingId,history};
}
function mechanicalDrawingSave_(p) {
  const session=requireAuthenticatedUser_(p,'MECHANICAL_VIEW');
  if(!drawingCanEdit_(session)) throw new Error('No tienes permiso para editar planos.');
  const d=parsePayload_(p.payload),projectId=cleanKey_(d.projectId);
  requireProjectAccess_(session,projectId);
  if(projectId!=='ZAZ081' && projectId!=='ZAZ091') throw new Error('Proyecto de planos no habilitado.');
  const code=cleanText_(d.code),title=cleanText_(d.title),status=cleanKey_(d.status||'PENDIENTE');
  if(!code || !title) throw new Error('Código y título son obligatorios.');
  if(!DRAWING_STATES_.includes(status)) throw new Error('Estado de plano no válido.');
  const revision=cleanText_(d.revision),evidence=cleanText_(d.evidence);
  if(cleanText_(d.deadline)) validateBusinessDateSC3_(d.deadline,'La fecha límite');
  const classification=drawingClassify_(code,d.submittalRequired||'NO');
  if(classification.type==='ARUP_REFERENCIA' && ['EN_DESARROLLO','BORRADOR_ENTREGADO','REVISION_INTERNA','VALIDADO_INTERNAMENTE'].includes(status)) throw new Error('Los planos XX son originales ARUP: no participan en delineación o validación interna Levitec. Sí requieren submittal.');
  if(classification.required==='NO' && ['SUBMITTADO','APROBADO_ARUP','RECHAZADO_ARUP'].includes(status)) throw new Error('Activa Requiere submittal antes de utilizar estados de revisión ARUP.');
  if(status==='VALIDADO_INTERNAMENTE' && !drawingCanValidate_(session)) throw new Error('La validación interna corresponde a un ingeniero o PM.');
  if(status==='APROBADO_ARUP' && !evidence) throw new Error('Indica referencia o evidencia documental de la aprobación ARUP.');
  if(code.length>160 || title.length>500 || cleanText_(d.notes).length>4000) throw new Error('Longitud de campos excedida.');
  const lock=LockService.getScriptLock(); if(!lock.tryLock(20000)) throw new Error('Otra edición en curso.');
  try {
    drawingEnsure_(); const sh=getSheet_(SHEETS.DRAWINGS);
    const id=cleanText_(d.id); const old=id?drawingFindRow_(sh,id):null;
    if(id && !old) throw new Error('Plano no encontrado. Actualiza el listado.');
    if(old && cleanKey_(old.data.PROYECTO_ID)!==projectId) throw new Error('Plano de otro proyecto.');
    if(old && cleanKey_(old.data.CODIGO)!==cleanKey_(code)) throw new Error('El código documental es inmutable. Crea un registro nuevo para un código distinto.');
    if(old && cleanText_(d.expectedUpdatedAt)!==cleanText_(old.data.FECHA_MODIFICACION))
      throw new Error('El plano fue modificado por otra persona. Actualiza antes de guardar.');
    const duplicate=readTable_(SHEETS.DRAWINGS).some(x=>cleanKey_(x.PROYECTO_ID)===projectId &&
      cleanKey_(x.CODIGO)===cleanKey_(code) && cleanText_(x.PLANO_ID)!==id && cleanKey_(x.ACTIVO||'SI')!=='NO');
    if(duplicate) throw new Error('Ya existe un plano activo con ese código en el proyecto.');
    const prev=old?old.data:{};
    if(old && cleanText_(prev.REVISION)!==revision && status==='APROBADO_ARUP')
      throw new Error('Nueva revisión: debe registrarse y aprobarse documentalmente antes de marcar APROBADO_ARUP.');
    if(old && !drawingCanValidate_(session) && status==='VALIDADO_INTERNAMENTE')
      throw new Error('La validación interna corresponde a un ingeniero o PM.');
    if(old && cleanKey_(prev.SUBMITTAL_REQUERIDO)==='SI' && classification.required==='NO' && ['SUBMITTADO','APROBADO_ARUP','RECHAZADO_ARUP'].includes(cleanKey_(prev.ESTADO))) throw new Error('No se puede retirar el requisito de submittal de un plano ya enviado o revisado por ARUP sin gestionar previamente su situación documental.');
    if(old && cleanKey_(prev.SUBMITTAL_REQUERIDO||'NO')==='NO' && classification.required==='SI' && status==='APROBADO_ARUP') throw new Error('La conversión a plano para submittal requiere envío y respuesta documental de ARUP.');
    const now=drawingNow_(),drawingId=old?id:'PL-'+projectId+'-'+Utilities.getUuid().slice(0,12).toUpperCase();
    const data={PLANO_ID:drawingId,PROYECTO_ID:projectId,CODIGO:code,TITULO:title,
      TIPO:classification.type,SUBMITTAL_REQUERIDO:classification.required,DISCIPLINA:'MECHANICAL',ZONA:cleanText_(d.zone),
      REVISION:revision,ESTADO:status,ESTADO_CDE:cleanText_(d.cdeStatus),
      DELINEANTE:cleanText_(d.draughtsman),INGENIERO:cleanText_(d.engineer),
      RESPONSABLE_DESBLOQUEO:cleanText_(d.unblockOwner),FECHA_LIMITE:cleanText_(d.deadline),
      RUTA:cleanText_(d.path),REFERENCIA_SUBMITTAL:cleanText_(d.submittalRef),
      NOTAS:cleanText_(d.notes),APROBACION_ARUP_EVIDENCIA:evidence,
      ORIGEN:old?prev.ORIGEN:cleanText_(d.source||'SITE_CONTROL'),ACTIVO:'SI',
      CREADO_POR:old?prev.CREADO_POR:session.user.email,FECHA_CREACION:old?prev.FECHA_CREACION:now,
      MODIFICADO_POR:session.user.email,FECHA_MODIFICACION:now};
    if(old) {
      const row=sh.getRange(old.number,1,1,sh.getLastColumn()).getValues()[0];
      Object.keys(data).forEach(k=>row[old.headers[k]]=data[k]);
      sh.getRange(old.number,1,1,row.length).setValues([row]);
    } else appendRowByHeaders_(sh,data);
    appendRowByHeaders_(getSheet_(SHEETS.DRAWING_HISTORY),{
      EVENTO_ID:Utilities.getUuid(),PLANO_ID:drawingId,PROYECTO_ID:projectId,FECHA:now,
      ACTOR:session.user.email,TIPO_EVENTO:old?'ACTUALIZACION':'CREACION',
      ESTADO_ANTERIOR:prev.ESTADO||'',ESTADO_NUEVO:status,
      REVISION_ANTERIOR:prev.REVISION||'',REVISION_NUEVA:revision,
      DETALLE:[cleanText_(d.changeReason)||'Actualización de registro',old && cleanKey_(prev.SUBMITTAL_REQUERIDO||'NO')!==classification.required ? 'Cambio requisito submittal: '+cleanKey_(prev.SUBMITTAL_REQUERIDO||'NO')+' -> '+classification.required : ''].filter(Boolean).join(' | ')});
    return {ok:true,message:'Plano guardado correctamente.',drawingId};
  } finally {lock.releaseLock();}
}
function mechanicalDrawingMilestonesSave_(p) {
  const session=requireAuthenticatedUser_(p,'MECHANICAL_VIEW');
  if(!drawingCanEdit_(session)) throw new Error('No tienes permiso para asociar hitos.');
  const d=parsePayload_(p.payload),projectId=cleanKey_(d.projectId),id=cleanText_(d.drawingId);
  requireProjectAccess_(session,projectId);drawingEnsure_();
  const found=drawingFindRow_(getSheet_(SHEETS.DRAWINGS),id);
  if(!found || cleanKey_(found.data.PROYECTO_ID)!==projectId) throw new Error('Plano no encontrado.');
  const validMilestones=new Set(readTable_(SHEETS.CONSTRUCTION_MILESTONES)
    .filter(x=>cleanKey_(x.PROYECTO_ID)===projectId && cleanKey_(x.ACTIVO||'SI')!=='NO')
    .map(x=>cleanText_(x.HITO_ID)));
  const desired=[...new Set((Array.isArray(d.milestoneIds)?d.milestoneIds:[]).map(cleanText_).filter(Boolean))];
  if(desired.some(x=>!validMilestones.has(x))) throw new Error('Se ha indicado un hito que no pertenece al proyecto.');
  const lock=LockService.getScriptLock();if(!lock.tryLock(20000)) throw new Error('Otra edición en curso.');
  try {
    const sh=getSheet_(SHEETS.MILESTONE_DRAWINGS),rows=sh.getDataRange().getDisplayValues(),h=headerMap_(rows[0]);
    const now=drawingNow_();const seen=new Set();
    for(let i=1;i<rows.length;i++) if(cleanKey_(rows[i][h.PROYECTO_ID])===projectId && cleanText_(rows[i][h.PLANO_ID])===id) {
      const milestone=cleanText_(rows[i][h.HITO_ID]);
      const active=desired.includes(milestone)&&!seen.has(milestone);if(active) seen.add(milestone);
      sh.getRange(i+1,h.ACTIVO+1).setValue(active?'SI':'NO');
      sh.getRange(i+1,h.FECHA_MODIFICACION+1).setValue(now);
      sh.getRange(i+1,h.MODIFICADO_POR+1).setValue(session.user.email);
    }
    desired.filter(x=>!seen.has(x)).forEach(milestone=>appendRowByHeaders_(sh,{
      PROYECTO_ID:projectId,HITO_ID:milestone,PLANO_ID:id,ACTIVO:'SI',
      FECHA_MODIFICACION:now,MODIFICADO_POR:session.user.email}));
    appendRowByHeaders_(getSheet_(SHEETS.DRAWING_HISTORY),{
      EVENTO_ID:Utilities.getUuid(),PLANO_ID:id,PROYECTO_ID:projectId,FECHA:now,
      ACTOR:session.user.email,TIPO_EVENTO:'HITOS',DETALLE:desired.join(', ')||'Sin hitos'});
    return {ok:true,message:'Asociaciones de hitos guardadas.'};
  } finally {lock.releaseLock();}
}

/** Asociaciones desde un hito, guardadas en una sola operación. No altera otros hitos. */
function mechanicalMilestoneDrawingsSaveBatch_(p) {
  const session=requireAuthenticatedUser_(p,'MECHANICAL_VIEW');
  if(!drawingCanEdit_(session)) throw new Error('Sin permiso para asociar planos.');
  const d=parsePayload_(p.payload),projectId=cleanKey_(d.projectId),milestoneId=cleanText_(d.milestoneId);
  requireProjectAccess_(session,projectId);
  drawingEnsure_();
  const validMilestone=readTable_(SHEETS.CONSTRUCTION_MILESTONES).some(x=>
    cleanKey_(x.PROYECTO_ID)===projectId && cleanText_(x.HITO_ID)===milestoneId && cleanKey_(x.ACTIVO||'SI')!=='NO');
  if(!validMilestone) throw new Error('Hito inexistente o ajeno al proyecto.');
  const drawingIds=[...new Set((Array.isArray(d.drawingIds)?d.drawingIds:[]).map(cleanText_).filter(Boolean))];
  const validIds=new Set(readTable_(SHEETS.DRAWINGS).filter(x=>cleanKey_(x.PROYECTO_ID)===projectId && cleanKey_(x.ACTIVO||'SI')!=='NO').map(x=>cleanText_(x.PLANO_ID)));
  if(drawingIds.some(id=>!validIds.has(id))) throw new Error('Algún plano no pertenece al proyecto.');
  const lock=LockService.getScriptLock();if(!lock.tryLock(20000)) throw new Error('Otra operación en curso.');
  try {
    const sh=getSheet_(SHEETS.MILESTONE_DRAWINGS),rows=sh.getDataRange().getValues(),h=headerMap_(rows[0]);
    const now=drawingNow_(),wanted=new Set(drawingIds),seen=new Set();let changed=false;
    for(let i=1;i<rows.length;i++) {
      const row=rows[i];
      if(cleanKey_(row[h.PROYECTO_ID])!==projectId || cleanText_(row[h.HITO_ID])!==milestoneId) continue;
      const id=cleanText_(row[h.PLANO_ID]),active=wanted.has(id)&&!seen.has(id);
      if(active)seen.add(id);
      if(cleanKey_(row[h.ACTIVO])===(active?'SI':'NO')) continue;
      row[h.ACTIVO]=active?'SI':'NO';row[h.FECHA_MODIFICACION]=now;row[h.MODIFICADO_POR]=session.user.email;
      changed=true;
    }
    if(changed && rows.length>1) sh.getRange(2,1,rows.length-1,rows[0].length).setValues(rows.slice(1));
    const toAdd=drawingIds.filter(id=>!seen.has(id));
    for(const id of toAdd) appendRowByHeaders_(sh,{PROYECTO_ID:projectId,HITO_ID:milestoneId,PLANO_ID:id,
      ACTIVO:'SI',FECHA_MODIFICACION:now,MODIFICADO_POR:session.user.email});
    return {ok:true,projectId,milestoneId,drawingIds,message:'Asociaciones guardadas.'};
  } finally {lock.releaseLock();}
}




/* =========================================================
   SITE CONTROL -> WAREHOUSE · CONFIRMED ORDER BRIDGE v1.12.0
   - Upsert by REQUEST_ID, never creates warehouse receipts.
   - Existing receipts remain authoritative in Warehouse.
   - Initial sync, on-confirm sync, and optional hourly retry.
   ========================================================= */
const WAREHOUSE_SYNC_SHEET = 'WAREHOUSE_ORDER_SYNC';
const WAREHOUSE_SYNC_HEADERS = ['REQUEST_ID','PROYECTO_ID','HASH','ESTADO','ULTIMO_INTENTO','ULTIMO_EXITO','ERROR'];

function warehouseSyncSheet_(){
  const ss=getDb_();
  let sh=ss.getSheetByName(WAREHOUSE_SYNC_SHEET);
  if(!sh){sh=ss.insertSheet(WAREHOUSE_SYNC_SHEET);sh.getRange(1,1,1,WAREHOUSE_SYNC_HEADERS.length).setValues([WAREHOUSE_SYNC_HEADERS]);sh.setFrozenRows(1);}
  return sh;
}
function warehouseSyncTime_(){
  return Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Europe/Madrid','yyyy-MM-dd HH:mm:ss');
}
function warehouseSyncHash_(value){
  const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(value));
  return Utilities.base64EncodeWebSafe(bytes);
}
function warehouseSyncOrderFromRow_(row){
  const requestId=cleanText_(row.REQUEST_ID);
  const projectId=cleanKey_(row.PROYECTO_ID);
  const raw=safeJsonParse_(row.MATERIALES_JSON,[]);
  if(!Array.isArray(raw)||!raw.length)throw new Error('El pedido no contiene líneas de material.');
  const lines=raw.map((item,i)=>{
    const reference=cleanText_(item.reference),description=cleanText_(item.description);
    const rawQty=String(item.quantity||'').replace(/\s/g,'');
    const qtyText=/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(rawQty) ? rawQty.replace(/\./g,'').replace(',','.') : rawQty.replace(',','.');
    const quantity=Number(qtyText);
    if(!reference||!description)throw new Error('Línea '+(i+1)+': referencia y descripción obligatorias para Warehouse.');
    if(!Number.isFinite(quantity)||quantity<=0)throw new Error('Línea '+(i+1)+': cantidad inválida ('+String(item.quantity||'')+').');
    return {lineId:String(i+1),reference:reference,description:description,unit:cleanText_(item.unit)||'ud',quantity:quantity};
  });
  return {requestId:requestId,projectId:projectId,poNumber:cleanText_(row.PO_NUMERO),supplier:cleanText_(row.PROVEEDOR),family:cleanText_(row.FAMILIA),expectedDeliveryDate:cleanText_(row.FECHA_ENTREGA_PREVISTA),status:'CONFIRMADO_PROVEEDOR',lines:lines};
}
function warehouseSyncLog_(requestId,projectId,hash,status,error){
  const sh=warehouseSyncSheet_(),values=sh.getDataRange().getDisplayValues(),h=headerMap_(values[0]);
  const idx=values.findIndex((r,i)=>i>0&&cleanText_(r[h.REQUEST_ID])===requestId);
  const now=warehouseSyncTime_();
  const previous=idx>0?values[idx]:null;
  const record={REQUEST_ID:requestId,PROYECTO_ID:projectId,HASH:hash,ESTADO:status,ULTIMO_INTENTO:now,ULTIMO_EXITO:status==='OK'?now:(previous?previous[h.ULTIMO_EXITO]:''),ERROR:String(error||'').slice(0,500)};
  if(idx>0){WAREHOUSE_SYNC_HEADERS.forEach((key)=>sh.getRange(idx+1,h[key]+1).setValue(record[key]));}
  else appendRowByHeaders_(sh,record);
}
function warehouseSyncOne_(row,force){
  const requestId=cleanText_(row.REQUEST_ID),projectId=cleanKey_(row.PROYECTO_ID);
  if(cleanKey_(row.ESTADO)!=='CONFIRMADO_PROVEEDOR')return {requestId,skipped:true,reason:'NO_CONFIRMADO'};
  let hash='';
  try{
    const order=warehouseSyncOrderFromRow_(row);
    hash=warehouseSyncHash_(order);
    if(!force){
      const prev=readTable_(WAREHOUSE_SYNC_SHEET).find(r=>cleanText_(r.REQUEST_ID)===requestId);
      if(prev&&cleanKey_(prev.ESTADO)==='OK'&&cleanText_(prev.HASH)===hash)return {requestId,skipped:true,reason:'SIN_CAMBIOS'};
    }
    const result=warehouseApiCall_('upsertOrder',{order:order});
    warehouseSyncLog_(requestId,projectId,hash,'OK','');
    return {requestId,ok:true,updated:!!result.updated};
  }catch(err){
    const message=String(err&&err.message||err);
    try { warehouseSyncLog_(requestId,projectId,hash,'ERROR',message); } catch(logError) { console.error('Warehouse sync log:',String(logError)); }
    return {requestId,ok:false,error:message};
  }
}
function warehouseSyncConfirmedOrders_(p){
  const session=requireAuthenticatedUser_(p,'CORE_VIEW');
  const role=cleanKey_(session.user.role);
  if(!['ADMIN','PROJECT_MANAGER','SITE_MANAGER','ADMINISTRATION'].includes(role)&&!session.permissions.includes('PURCHASE_MANAGE'))throw new Error('No tienes permiso para sincronizar pedidos.');
  const payload=parsePayload_(p.payload),projectId=cleanKey_(payload.projectId);
  requireProjectAccess_(session,projectId);
  ensurePurchaseSheet_();
  warehouseSyncSheet_();
  const rows=readTable_(SHEETS.PURCHASE_REQUESTS).filter(r=>cleanKey_(r.PROYECTO_ID)===projectId&&cleanKey_(r.ESTADO)==='CONFIRMADO_PROVEEDOR');
  const results=rows.map(r=>warehouseSyncOne_(r,true));
  const sent=results.filter(r=>r.ok).length,failed=results.filter(r=>r.ok===false).length;
  return {ok:true,projectId:projectId,total:rows.length,synced:sent,failed:failed,results:results,message:'Sincronización: '+sent+' pedido(s) enviados; '+failed+' con incidencias.'};
}
function warehouseOrderProgress_(p){
  const session=requireAuthenticatedUser_(p,'DELIVERY_VIEW');
  const payload=parsePayload_(p.payload),projectId=cleanKey_(payload.projectId);
  requireProjectAccess_(session,projectId);
  const remote=warehouseApiCall_('orderProgress',{projectId:projectId});
  const config=warehouseApiCall_('bootstrap',{projectId:projectId});
  return {ok:true,projectId,orders:Array.isArray(remote.orders)?remote.orders:[],warehouses:config.warehouses||[],zones:config.zones||[]};
}
// Trigger opcional: ejecutar manualmente UNA vez warehouseInstallHourlySyncTrigger_ desde Apps Script.
function warehouseInstallHourlySyncTrigger_(){
  const fn='warehouseSyncConfirmedOrdersScheduled_';
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()===fn))ScriptApp.newTrigger(fn).timeBased().everyHours(1).create();
  return 'Trigger horario de sincronización instalado.';
}
function warehouseSyncConfirmedOrdersScheduled_(){
  ensurePurchaseSheet_();warehouseSyncSheet_();
  const rows=readTable_(SHEETS.PURCHASE_REQUESTS).filter(r=>cleanKey_(r.ESTADO)==='CONFIRMADO_PROVEEDOR');
  // Batches to stay within Apps Script execution time; later runs retry failures.
  let count=0;
  rows.forEach(r=>{if(count>=35)return;const result=warehouseSyncOne_(r,false);if(!result.skipped)count++;});
}


/** Catálogo ligero. Autorizar siempre, también antes de leer la caché. */
function warehouseReceiptDestinationsRC13_(p){
  const session=requireAuthenticatedUser_(p,'DELIVERY_VIEW');
  const payload=parsePayload_(p.payload),projectId=cleanKey_(payload.projectId);
  requireProjectAccess_(session,projectId);
  const key='receipt-destinations-rc13:'+projectId;let cache=null,config=null;
  try{cache=CacheService.getScriptCache();if(!payload.force){const saved=cache.get(key);if(saved)config=JSON.parse(saved);}}catch(e){config=null;}
  if(!config){
    const remote=warehouseApiCall_('bootstrap',{projectId});
    if(!Array.isArray(remote.warehouses)||!Array.isArray(remote.zones))throw new Error('Warehouse no devolvió un catálogo de destinos válido.');
    config={warehouses:remote.warehouses,zones:remote.zones};
    try{const value=JSON.stringify(config);if(cache&&value.length<80000)cache.put(key,value,60);}catch(e){}
  }
  return {ok:true,projectId,warehouses:config.warehouses,zones:config.zones};
}


// SC-A03: fecha ISO existente en calendario; no impone una política de plazo.
function validateBusinessDateSC3_(value, label) {
  const text = String(value || '').trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(text + 'T00:00:00Z') : null;
  if (!date || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== text) {
    throw new Error((label || 'La fecha') + ' no es una fecha de calendario válida.');
  }
  return text;
}
