(() => {
'use strict';

const CONFIG = window.LEVITEC_CONFIG;

const state = {
  credential: null,
  bootstrap: null,
  currentProject: null,
  adminProjects: [],
  purchases: [],
  purchaseSuggestions: {
    suppliers: [],
    families: [],
    destinations: [],
    materials: []
  },
  purchaseSubmitting: false,
  workflowRequest: null,
  workflowSubmitting: false,
  deliveries: [],
  constructionMilestones: [],
  selectedConstructionMilestone: null,
  deliveryFilter: 'ALL',
  deliveryCalendarDate: new Date(),
  selectedDelivery: null,
  deliverySubmitting: false,

  warehouses: [],
  warehouseZones: [],
  warehouseStock: [],
  warehouseRequests: [],
  selectedWarehouseId: null,
  warehousePermissions: {},
  materialRequestSelection: null,

  workControl: {
    projects: [],
    selectedProject: 'ALL',
    currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    selectedDate: new Date().toISOString().slice(0,10),
    monthDays: [],
    parts: [],
    incidents: [],
    presence: [],
    correctionIncident: null
  },

  equipmentGlobal: []
};

const $ = id => document.getElementById(id);

const el = {
  loginView: $('loginView'),
  projectsView: $('projectsView'),
  projectView: $('projectView'),
  workControlView: $('workControlView'),
  equipmentGlobalView: $('equipmentGlobalView'),
  globalAdminView: $('globalAdminView'),
  purchasesView: $('purchasesView'),
  deliveriesView: $('deliveriesView'),
  warehouseView: $('warehouseView'),

  googleButton: $('googleButton'),
  loginStatus: $('loginStatus'),

  topUser: $('topUser'),
  topUserName: $('topUserName'),
  topUserMeta: $('topUserMeta'),
  logoutBtn: $('logoutBtn'),

  welcomeText: $('welcomeText'),
  projectsGrid: $('projectsGrid'),
  noProjects: $('noProjects'),
  globalAdminBtn: $('globalAdminBtn'),

  backProjectsBtn: $('backProjectsBtn'),
  currentProjectName: $('currentProjectName'),
  currentProjectMeta: $('currentProjectMeta'),
  heroProjectName: $('heroProjectName'),
  heroProjectSubtitle: $('heroProjectSubtitle'),
  heroProjectRole: $('heroProjectRole'),
  modulesGrid: $('modulesGrid'),

  backFromGlobalAdminBtn: $('backFromGlobalAdminBtn'),
  newProjectBtn: $('newProjectBtn'),
  adminProjectStatus: $('adminProjectStatus'),
  adminProjectsList: $('adminProjectsList'),

  backFromPurchasesBtn: $('backFromPurchasesBtn'),
  purchasesProjectSubtitle: $('purchasesProjectSubtitle'),
  newPurchaseBtn: $('newPurchaseBtn'),
  purchaseStatus: $('purchaseStatus'),
  purchaseList: $('purchaseList'),
  purchaseCountTotal: $('purchaseCountTotal'),
  purchaseCountPending: $('purchaseCountPending'),
  purchaseCountIssued: $('purchaseCountIssued'),

  projectModal: $('projectModal'),
  projectModalTitle: $('projectModalTitle'),
  closeProjectModalBtn: $('closeProjectModalBtn'),
  cancelProjectBtn: $('cancelProjectBtn'),
  projectForm: $('projectForm'),
  projectFormMode: $('projectFormMode'),
  projectIdInput: $('projectIdInput'),
  projectNameInput: $('projectNameInput'),
  projectCampusInput: $('projectCampusInput'),
  projectActiveInput: $('projectActiveInput'),

  purchaseModal: $('purchaseModal'),
  closePurchaseModalBtn: $('closePurchaseModalBtn'),
  cancelPurchaseBtn: $('cancelPurchaseBtn'),
  purchaseForm: $('purchaseForm'),
  purchaseClientRequestId: $('purchaseClientRequestId'),
  purchaseModalProject: $('purchaseModalProject'),
  purchaseSupplier: $('purchaseSupplier'),
  purchaseFamily: $('purchaseFamily'),
  purchaseRequiredDate: $('purchaseRequiredDate'),
  purchaseQuoteRef: $('purchaseQuoteRef'),
  purchaseDestinationType: $('purchaseDestinationType'),
  purchaseDestination: $('purchaseDestination'),
  purchaseAddress: $('purchaseAddress'),
  purchaseContact: $('purchaseContact'),
  purchaseNotes: $('purchaseNotes'),
  materialsRows: $('materialsRows'),
  addMaterialRowBtn: $('addMaterialRowBtn'),
  supplierSuggestions: $('supplierSuggestions'),
  familySuggestions: $('familySuggestions'),
  destinationSuggestions: $('destinationSuggestions'),
  materialReferenceSuggestions: $('materialReferenceSuggestions'),
  submitPurchaseBtn: $('submitPurchaseBtn'),

  purchaseWorkflowModal: $('purchaseWorkflowModal'),
  closeWorkflowModalBtn: $('closeWorkflowModalBtn'),
  workflowRequestId: $('workflowRequestId'),
  workflowRequestMeta: $('workflowRequestMeta'),
  workflowSupplier: $('workflowSupplier'),
  workflowFamilyDisplay: $('workflowFamilyDisplay'),
  workflowRequiredDate: $('workflowRequiredDate'),
  workflowDestination: $('workflowDestination'),
  workflowMaterials: $('workflowMaterials'),
  workflowNotes: $('workflowNotes'),
  workflowFamilyInput: $('workflowFamilyInput'),
  workflowStatusInput: $('workflowStatusInput'),
  workflowPoInput: $('workflowPoInput'),
  workflowExpectedDateInput: $('workflowExpectedDateInput'),
  saveWorkflowBtn: $('saveWorkflowBtn'),

  backFromDeliveriesBtn: $('backFromDeliveriesBtn'),
  deliveriesProjectSubtitle: $('deliveriesProjectSubtitle'),
  prevMonthBtn: $('prevMonthBtn'),
  nextMonthBtn: $('nextMonthBtn'),
  todayMonthBtn: $('todayMonthBtn'),
  calendarMonthLabel: $('calendarMonthLabel'),
  deliveryCalendar: $('deliveryCalendar'),
  deliveryStatus: $('deliveryStatus'),
  deliveryUpcomingCount: $('deliveryUpcomingCount'),
  deliveryLateCount: $('deliveryLateCount'),
  deliveryReceivedCount: $('deliveryReceivedCount'),
  deliveryList: $('deliveryList'),
  newMilestoneBtn: $('newMilestoneBtn'),
  constructionMilestoneList: $('constructionMilestoneList'),

  constructionMilestoneModal: $('constructionMilestoneModal'),
  closeConstructionMilestoneModalBtn: $('closeConstructionMilestoneModalBtn'),
  constructionMilestoneModalTitle: $('constructionMilestoneModalTitle'),
  constructionMilestoneForm: $('constructionMilestoneForm'),
  constructionMilestoneId: $('constructionMilestoneId'),
  constructionMilestoneTitle: $('constructionMilestoneTitle'),
  constructionMilestoneDate: $('constructionMilestoneDate'),
  constructionMilestoneType: $('constructionMilestoneType'),
  constructionMilestoneDiscipline: $('constructionMilestoneDiscipline'),
  constructionMilestoneNotes: $('constructionMilestoneNotes'),
  deleteConstructionMilestoneBtn: $('deleteConstructionMilestoneBtn'),
  cancelConstructionMilestoneBtn: $('cancelConstructionMilestoneBtn'),

  deliveryModal: $('deliveryModal'),
  closeDeliveryModalBtn: $('closeDeliveryModalBtn'),
  deliveryModalTitle: $('deliveryModalTitle'),
  deliveryModalMeta: $('deliveryModalMeta'),
  deliverySupplier: $('deliverySupplier'),
  deliveryPo: $('deliveryPo'),
  deliveryFamily: $('deliveryFamily'),
  deliveryDestination: $('deliveryDestination'),
  deliveryMilestoneSelect: $('deliveryMilestoneSelect'),
  deliveryMilestoneOffset: $('deliveryMilestoneOffset'),
  saveDeliveryMilestoneBtn: $('saveDeliveryMilestoneBtn'),
  deliveryMaterials: $('deliveryMaterials'),
  deliveryDateInput: $('deliveryDateInput'),
  deliveryChangeReason: $('deliveryChangeReason'),
  saveDeliveryDateBtn: $('saveDeliveryDateBtn'),
  deliveryReceiptStatus: $('deliveryReceiptStatus'),
  deliveryReceiptNotes: $('deliveryReceiptNotes'),
  confirmDeliveryReceiptBtn: $('confirmDeliveryReceiptBtn'),

  backFromWarehouseBtn: $('backFromWarehouseBtn'),
  warehouseProjectSubtitle: $('warehouseProjectSubtitle'),
  warehouseStatus: $('warehouseStatus'),
  warehouseSelect: $('warehouseSelect'),
  warehouseMeta: $('warehouseMeta'),
  warehouseSkuCount: $('warehouseSkuCount'),
  warehouseQuarantineCount: $('warehouseQuarantineCount'),
  warehouseOpenRequestsCount: $('warehouseOpenRequestsCount'),
  warehouseStockBody: $('warehouseStockBody'),
  warehouseRequestsList: $('warehouseRequestsList'),
  warehouseZonesList: $('warehouseZonesList'),
  newMaterialRequestBtn: $('newMaterialRequestBtn'),
  newZoneBtn: $('newZoneBtn'),

  materialRequestModal: $('materialRequestModal'),
  closeMaterialRequestModalBtn: $('closeMaterialRequestModalBtn'),
  cancelMaterialRequestBtn: $('cancelMaterialRequestBtn'),
  materialRequestForm: $('materialRequestForm'),
  materialRequestWarehouse: $('materialRequestWarehouse'),
  materialRequestSearch: $('materialRequestSearch'),
  materialRequestZoneFilter: $('materialRequestZoneFilter'),
  materialRequestResults: $('materialRequestResults'),
  materialRequestSelected: $('materialRequestSelected'),
  materialRequestSelectedTitle: $('materialRequestSelectedTitle'),
  materialRequestSelectedDescription: $('materialRequestSelectedDescription'),
  materialRequestAvailable: $('materialRequestAvailable'),
  materialRequestZones: $('materialRequestZones'),
  materialRequestQuarantine: $('materialRequestQuarantine'),
  clearMaterialRequestSelectionBtn: $('clearMaterialRequestSelectionBtn'),
  materialRequestReference: $('materialRequestReference'),
  materialRequestDescription: $('materialRequestDescription'),
  materialRequestQuantity: $('materialRequestQuantity'),
  materialRequestQuantityHint: $('materialRequestQuantityHint'),
  materialRequestNotes: $('materialRequestNotes'),
  materialRequestStatus: $('materialRequestStatus'),
  submitMaterialRequestBtn: $('submitMaterialRequestBtn'),

  warehouseZoneModal: $('warehouseZoneModal'),
  closeWarehouseZoneModalBtn: $('closeWarehouseZoneModalBtn'),
  cancelWarehouseZoneBtn: $('cancelWarehouseZoneBtn'),
  warehouseZoneForm: $('warehouseZoneForm'),
  warehouseZoneId: $('warehouseZoneId'),
  warehouseZoneName: $('warehouseZoneName'),
  warehouseZoneType: $('warehouseZoneType'),

  backFromWorkControlBtn: $('backFromWorkControlBtn'),
  workControlSubtitle: $('workControlSubtitle'),
  workControlStatus: $('workControlStatus'),
  refreshWorkPresenceBtn: $('refreshWorkPresenceBtn'),
  workProjectScope: $('workProjectScope'),
  workScopeHint: $('workScopeHint'),
  workPresenceUpdated: $('workPresenceUpdated'),
  workPresenceList: $('workPresenceList'),
  workPrevMonthBtn: $('workPrevMonthBtn'),
  workNextMonthBtn: $('workNextMonthBtn'),
  workCalendarTitle: $('workCalendarTitle'),
  workCalendarGrid: $('workCalendarGrid'),
  workSelectedDateLabel: $('workSelectedDateLabel'),
  workWorkersSummary: $('workWorkersSummary'),
  workTasksSummary: $('workTasksSummary'),
  workPendingSummary: $('workPendingSummary'),
  workIncidentsSummary: $('workIncidentsSummary'),
  workSubcontractorFilter: $('workSubcontractorFilter'),
  workStateFilter: $('workStateFilter'),
  workIncidentPendingCount: $('workIncidentPendingCount'),
  workIncidentsContainer: $('workIncidentsContainer'),
  workPartsContainer: $('workPartsContainer'),

  workIncidentCorrectionModal: $('workIncidentCorrectionModal'),
  closeWorkCorrectionModalBtn: $('closeWorkCorrectionModalBtn'),
  cancelWorkCorrectionBtn: $('cancelWorkCorrectionBtn'),
  saveWorkCorrectionBtn: $('saveWorkCorrectionBtn'),
  workCorrectionIncidentText: $('workCorrectionIncidentText'),
  workCorrectionFields: $('workCorrectionFields'),

  backFromEquipmentGlobalBtn: $('backFromEquipmentGlobalBtn'),
  refreshEquipmentGlobalBtn: $('refreshEquipmentGlobalBtn'),
  equipmentGlobalStatus: $('equipmentGlobalStatus'),
  equipmentGlobalCount: $('equipmentGlobalCount'),
  equipmentPositionCount: $('equipmentPositionCount'),
  equipmentNoPositionCount: $('equipmentNoPositionCount'),
  equipmentGlobalSearch: $('equipmentGlobalSearch'),
  equipmentGlobalProjectFilter: $('equipmentGlobalProjectFilter'),
  equipmentGlobalList: $('equipmentGlobalList'),

  backendForm: $('backendForm'),
  backendAction: $('backendAction'),
  backendCredential: $('backendCredential'),
  backendPayload: $('backendPayload')
};

const ROLE_LABELS = {
  ADMIN: 'Administrador',
  PROJECT_MANAGER: 'Project Manager',
  SITE_MANAGER: 'Jefe de obra',
  FOREMAN: 'Encargado',
  ENGINEER: 'Ingeniero',
  WAREHOUSE: 'Almacenero',
  VIEWER: 'Consulta'
};

const DISCIPLINE_LABELS = {
  MECHANICAL: 'Mechanical',
  ELECTRICAL: 'Electrical',
  ALL: 'Todas las disciplinas'
};

const MODULES = [
  {key:'site', title:'Control de trabajos', icon:'S', description:'Partes de obra, presencia e incidencias del sistema de fichajes.', tags:['Fichajes','Partes','Incidencias']},
  {key:'equipment', title:'Maquinaria', icon:'E', description:'Localización global de equipos y trackers de obra.', tags:['Tracking','Global','Posición']},
  {key:'warehouse', title:'Warehouse', icon:'W', description:'Stock, solicitudes de material, recepciones y movimientos.', tags:['Stock','Solicitudes','Multi-almacén']},
  {key:'deliveries', title:'Deliveries', icon:'D', description:'Entregas previstas, calendario operativo y confirmaciones.', tags:['Calendario','Pedidos','Recepciones']},
  {key:'documents', title:'Documentación / Permisos', icon:'P', description:'Preparación interna de RFI, RAMS y E-Permits.', tags:['RFI','RAMS','E-Permits']},
  {key:'mechanical', title:'Mechanical', icon:'M', description:'Vista operativa y herramientas específicas de mecánica.', tags:['Mechanical']},
  {key:'electrical', title:'Electrical', icon:'⚡', description:'Vista operativa y herramientas específicas de eléctrica.', tags:['Electrical']},
  {key:'purchases', title:'Compras / Administración', icon:'C', description:'Solicitudes de pedido, seguimiento y coordinación administrativa del proyecto.', tags:['Solicitudes','Pedidos','Seguimiento']}
];

function show(view) {
  [
    el.loginView,
    el.projectsView,
    el.projectView,
    el.workControlView,
    el.equipmentGlobalView,
    el.globalAdminView,
    el.purchasesView,
    el.deliveriesView,
    el.warehouseView
  ].forEach(v => v.classList.add('hidden'));

  view.classList.remove('hidden');
}

function setStatus(target, message, kind='info') {
  target.textContent = message;
  target.className = 'status ' + kind;
  target.classList.remove('hidden');
}

function clearStatus(target) {
  target.classList.add('hidden');
  target.textContent = '';
}


/* GOOGLE LOGIN */
function initGoogleIdentity() {
  if (!window.google || !google.accounts || !google.accounts.id) {
    setTimeout(initGoogleIdentity, 150);
    return;
  }

  google.accounts.id.initialize({
    client_id: CONFIG.GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: false
  });

  google.accounts.id.renderButton(el.googleButton, {
    theme: 'outline',
    size: 'large',
    shape: 'rectangular',
    text: 'signin_with',
    width: 350,
    logo_alignment: 'left'
  });
}

function handleGoogleCredential(response) {
  if (!response?.credential) {
    setStatus(el.loginStatus, 'Google no devolvió una credencial válida.', 'error');
    return;
  }

  state.credential = response.credential;
  setStatus(el.loginStatus, 'Validando usuario y permisos…');
  postToBackend('bootstrap', {});
}


/* BACKEND */
function postToBackend(action, payload) {
  el.backendAction.value = action;
  el.backendCredential.value = state.credential || '';
  el.backendPayload.value = JSON.stringify(payload || {});
  el.backendForm.submit();
}

window.addEventListener('message', event => {
  const validOrigin =
    event.origin === 'https://script.google.com' ||
    event.origin.endsWith('.googleusercontent.com');

  if (!validOrigin) return;

  const msg = event.data;

  if (!msg || msg.source !== CONFIG.MESSAGE_SOURCE) return;

  switch (msg.type) {
    case 'bootstrap':
      handleBootstrap(msg.payload);
      break;

    case 'adminProjectsList':
      handleAdminProjectsList(msg.payload);
      break;

    case 'adminProjectCreate':
    case 'adminProjectUpdate':
      handleProjectMutation(msg.payload);
      break;

    case 'purchaseList':
      handlePurchaseList(msg.payload);
      break;

    case 'purchaseSuggestions':
      handlePurchaseSuggestions(msg.payload);
      break;

    case 'purchaseCreate':
      handlePurchaseMutation(msg.payload);
      break;

    case 'purchaseUpdateStatus':
      handlePurchaseMutation(msg.payload);
      break;

    case 'deliveryList':
      handleDeliveryList(msg.payload);
      break;

    case 'deliveryUpdateDate':
    case 'deliveryConfirmReceipt':
    case 'deliveryLinkMilestone':
    case 'constructionMilestoneSave':
    case 'constructionMilestoneDelete':
      handleDeliveryMutation(msg.payload);
      break;

    case 'workControlBootstrap':
      handleWorkControlBootstrap(msg.payload);
      break;

    case 'workControlMonth':
      handleWorkControlMonth(msg.payload);
      break;

    case 'workControlDay':
      handleWorkControlDay(msg.payload);
      break;

    case 'workControlPresence':
      handleWorkControlPresence(msg.payload);
      break;

    case 'workControlUpdate':
    case 'workControlBulkValidate':
    case 'workControlIncidentUpdate':
    case 'workControlIncidentCorrect':
    case 'workControlIncidentDiscard':
      handleWorkControlMutation(msg.payload);
      break;

    case 'equipmentLocationsGlobal':
      handleEquipmentLocationsGlobal(msg.payload);
      break;

    case 'warehouseBootstrap':
      handleWarehouseBootstrap(msg.payload);
      break;

    case 'warehouseStockList':
      handleWarehouseStock(msg.payload);
      break;

    case 'warehouseRequestList':
      handleWarehouseRequests(msg.payload);
      break;

    case 'warehouseRequestCreate':
    case 'warehouseZoneCreate':
      handleWarehouseMutation(msg.payload);
      break;

    case 'error':
      if (!el.loginView.classList.contains('hidden')) {
        setStatus(el.loginStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }
      if (!el.globalAdminView.classList.contains('hidden')) {
        setStatus(el.adminProjectStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }
      if (!el.purchasesView.classList.contains('hidden')) {
        setPurchaseSubmitting(false);
        setStatus(el.purchaseStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }

      if (!el.deliveriesView.classList.contains('hidden')) {
        setDeliverySubmitting(false);
        setStatus(el.deliveryStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }

      if (!el.warehouseView.classList.contains('hidden')) {
        setStatus(el.warehouseStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }
      break;
  }
});


/* BOOTSTRAP */
function handleBootstrap(payload) {
  if (!payload?.ok) {
    setStatus(el.loginStatus, payload?.message || 'No se ha podido iniciar sesión.', 'error');
    return;
  }

  state.bootstrap = payload;

  clearStatus(el.loginStatus);
  renderUser();
  renderProjects();
  renderGlobalAdminButton();

  show(el.projectsView);
}

function renderUser() {
  const user = state.bootstrap.user;
  const role = ROLE_LABELS[user.role] || user.role;
  const discipline = DISCIPLINE_LABELS[user.discipline] || user.discipline;

  el.topUserName.textContent = user.name || user.email;
  el.topUserMeta.textContent = [role, discipline].filter(Boolean).join(' · ');
  el.topUser.classList.remove('hidden');

  el.welcomeText.textContent =
    `${user.name || user.email} · ${role} · ${discipline}`;
}


/* PROJECTS */
function renderProjects() {
  const projects = Array.isArray(state.bootstrap.projects)
    ? state.bootstrap.projects
    : [];

  el.projectsGrid.innerHTML = '';

  if (!projects.length) {
    el.noProjects.classList.remove('hidden');
    return;
  }

  el.noProjects.classList.add('hidden');

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const role = ROLE_LABELS[project.projectRole] || project.projectRole || '';

    card.innerHTML = `
      <div class="project-card-top">
        <div>
          <h2>${esc(project.name || project.id)}</h2>
          <div class="project-campus">${esc(project.campus || '')}</div>
        </div>
        <div class="project-chip">ACTIVO</div>
      </div>

      <div class="project-role">${esc(role)}</div>

      <button class="btn btn-primary" type="button">
        Abrir proyecto →
      </button>
    `;

    card.querySelector('button').addEventListener('click', () => openProject(project));
    el.projectsGrid.appendChild(card);
  });
}

function renderGlobalAdminButton() {
  const allowed = state.bootstrap.modules?.globalAdmin === true;
  el.globalAdminBtn.classList.toggle('hidden', !allowed);
}

function openProject(project) {
  state.currentProject = project;

  const role = ROLE_LABELS[project.projectRole] || project.projectRole || '';

  el.currentProjectName.textContent = project.name || project.id;
  el.currentProjectMeta.textContent = [project.campus, role].filter(Boolean).join(' · ');

  el.heroProjectName.textContent = project.name || project.id;
  el.heroProjectSubtitle.textContent =
    `${project.campus || ''}${project.campus ? ' · ' : ''}Gestión operativa de proyecto`;

  el.heroProjectRole.textContent = role || 'Proyecto';

  renderModules();
  show(el.projectView);
}


/* PROJECT MODULES */
function renderModules() {
  el.modulesGrid.innerHTML = '';

  const access = state.bootstrap.modules || {};

  MODULES
    .filter(module => access[module.key] === true)
    .forEach(module => {
      const card = document.createElement('article');
      card.className = 'module-card';

      if (['site','equipment','purchases','deliveries','warehouse'].includes(module.key)) {
        card.classList.add('clickable');
      }

      card.innerHTML = `
        <div class="module-icon">${esc(module.icon)}</div>
        <h3>${esc(module.title)}</h3>
        <p>${esc(module.description)}</p>
        <div class="module-actions">
          ${module.tags.map(tag => `<span class="module-tag">${esc(tag)}</span>`).join('')}
        </div>
      `;

      if (module.key === 'purchases') {
        card.addEventListener('click', openPurchases);
      }

      if (module.key === 'deliveries') {
        card.addEventListener('click', openDeliveries);
      }

      if (module.key === 'site') {
        card.addEventListener('click', openWorkControl);
      }

      if (module.key === 'equipment') {
        card.addEventListener('click', openEquipmentGlobal);
      }

      if (module.key === 'warehouse') {
        card.addEventListener('click', openWarehouse);
      }

      el.modulesGrid.appendChild(card);
    });
}



/* CONTROL DE TRABAJOS · INTEGRACIÓN CONTROL HORARIO */
function workDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

function workMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
}

function openWorkControl() {
  if (!state.currentProject) return;

  const wc = state.workControl;
  wc.currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  wc.selectedDate = workDateKey(new Date());
  wc.selectedProject = state.currentProject.id;

  el.workControlSubtitle.textContent =
    `${state.currentProject.name || state.currentProject.id} · La visibilidad depende de tus proyectos autorizados en Site Control.`;

  show(el.workControlView);
  setStatus(el.workControlStatus, 'Cargando partes, incidencias y presencia…');

  postToBackend('workControlBootstrap', {
    project:wc.selectedProject,
    month:workMonthKey(wc.currentMonth),
    date:wc.selectedDate
  });
}


function handleWorkControlBootstrap(payload) {
  if (!payload?.ok) {
    setStatus(el.workControlStatus, payload?.message || 'No se ha podido cargar Control de trabajos.', 'error');
    return;
  }

  const wc = state.workControl;
  wc.projects = Array.isArray(payload.projects) ? payload.projects : [];
  wc.selectedProject = payload.selectedProject || wc.selectedProject;
  wc.monthDays = payload.month?.days || [];
  wc.parts = payload.day?.parts || [];
  wc.incidents = payload.day?.incidents || [];
  wc.presence = Array.isArray(payload.presence) ? payload.presence : [];

  renderWorkProjectScope();
  renderWorkPresence();
  renderWorkCalendar();
  renderWorkDay();
  clearStatus(el.workControlStatus);
}


function renderWorkProjectScope() {
  const wc = state.workControl;
  const projects = wc.projects || [];

  el.workProjectScope.innerHTML = '';

  if (projects.length > 1) {
    const all = document.createElement('option');
    all.value = 'ALL';
    all.textContent = 'Todos mis proyectos';
    el.workProjectScope.appendChild(all);
  }

  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = `${project.id} · ${project.name || project.id}`;
    el.workProjectScope.appendChild(option);
  });

  if ([...el.workProjectScope.options].some(o => o.value === wc.selectedProject)) {
    el.workProjectScope.value = wc.selectedProject;
  } else if (projects.length === 1) {
    wc.selectedProject = projects[0].id;
    el.workProjectScope.value = projects[0].id;
  } else {
    wc.selectedProject = 'ALL';
    el.workProjectScope.value = 'ALL';
  }

  el.workProjectScope.disabled = projects.length <= 1;

  if (projects.length <= 1) {
    el.workScopeHint.textContent = 'Tu usuario solo tiene acceso a este proyecto.';
  } else {
    el.workScopeHint.textContent = 'Puedes consultar cualquiera de tus proyectos autorizados o todos en conjunto.';
  }
}


function reloadWorkScope() {
  const wc = state.workControl;
  wc.selectedProject = el.workProjectScope.value || 'ALL';
  setStatus(el.workControlStatus, 'Actualizando ámbito…');

  postToBackend('workControlBootstrap', {
    project:wc.selectedProject,
    month:workMonthKey(wc.currentMonth),
    date:wc.selectedDate
  });
}


function renderWorkPresence() {
  const rows = state.workControl.presence || [];
  const grouped = {};

  rows.forEach(row => {
    const key = row.project || 'SIN PROYECTO';
    (grouped[key] ||= []).push(row);
  });

  el.workPresenceList.innerHTML = '';

  if (!rows.length) {
    el.workPresenceList.innerHTML = '<div class="empty-state">No hay entradas abiertas en el ámbito seleccionado.</div>';
  } else {
    Object.keys(grouped).sort().forEach(project => {
      const block = document.createElement('div');
      block.className = 'work-presence-project';
      block.innerHTML = `
        <div class="work-presence-project-head">
          <strong>${esc(project)}</strong>
          <span>${grouped[project].length} en obra</span>
        </div>
        <div class="work-presence-workers">
          ${grouped[project].map(row => `
            <div class="work-presence-worker">
              <strong>${esc(row.worker || row.email)}</strong>
              <span>${esc(row.subcontractor || '')}</span>
              <small>Entrada ${esc(row.entryTime || '')}</small>
            </div>
          `).join('')}
        </div>
      `;
      el.workPresenceList.appendChild(block);
    });
  }

  el.workPresenceUpdated.textContent =
    `Actualizado ${new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(new Date())}`;
}


function renderWorkCalendar() {
  const wc = state.workControl;
  const first = new Date(wc.currentMonth.getFullYear(), wc.currentMonth.getMonth(), 1);
  const last = new Date(wc.currentMonth.getFullYear(), wc.currentMonth.getMonth()+1, 0);
  const startPad = (first.getDay() + 6) % 7;

  el.workCalendarTitle.textContent =
    new Intl.DateTimeFormat('es-ES',{month:'long',year:'numeric'}).format(first);

  const activity = {};
  (wc.monthDays || []).forEach(day => activity[day.date] = day);

  el.workCalendarGrid.innerHTML = '';

  for (let i=0;i<startPad;i++) {
    const blank = document.createElement('div');
    blank.className = 'work-day blank';
    el.workCalendarGrid.appendChild(blank);
  }

  for (let day=1; day<=last.getDate(); day++) {
    const d = new Date(first.getFullYear(), first.getMonth(), day);
    const key = workDateKey(d);
    const info = activity[key] || {};
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'work-day';
    if (key === wc.selectedDate) btn.classList.add('selected');
    if (key === workDateKey(new Date())) btn.classList.add('today');

    btn.innerHTML = `
      <span class="work-day-number">${day}</span>
      <span class="work-day-dots">
        ${Number(info.count || 0) ? '<i class="dot parts"></i>' : ''}
        ${Number(info.incidents || 0) ? '<i class="dot incidents"></i>' : ''}
      </span>
      ${Number(info.pending || 0) ? `<small>${Number(info.pending)} pend.</small>` : ''}
    `;

    btn.addEventListener('click', () => {
      wc.selectedDate = key;
      renderWorkCalendar();
      setStatus(el.workControlStatus, 'Cargando día…');
      postToBackend('workControlDay', {
        project:wc.selectedProject,
        date:wc.selectedDate
      });
    });

    el.workCalendarGrid.appendChild(btn);
  }
}


function handleWorkControlMonth(payload) {
  if (!payload?.ok) {
    setStatus(el.workControlStatus, payload?.message || 'No se pudo cargar el mes.', 'error');
    return;
  }
  state.workControl.monthDays = payload.days || [];
  renderWorkCalendar();
  clearStatus(el.workControlStatus);
}


function handleWorkControlDay(payload) {
  if (!payload?.ok) {
    setStatus(el.workControlStatus, payload?.message || 'No se pudo cargar el día.', 'error');
    return;
  }
  state.workControl.parts = payload.parts || [];
  state.workControl.incidents = payload.incidents || [];
  renderWorkDay();
  clearStatus(el.workControlStatus);
}


function handleWorkControlPresence(payload) {
  if (!payload?.ok) {
    setStatus(el.workControlStatus, payload?.message || 'No se pudo actualizar la presencia.', 'error');
    return;
  }
  state.workControl.presence = payload.presence || [];
  renderWorkPresence();
  clearStatus(el.workControlStatus);
}


function workStatusLabel(status) {
  return ({
    PENDIENTE:'Pendiente',
    VALIDADO:'Validado',
    REVISAR:'Revisar',
    RECHAZADO:'Rechazado'
  })[status] || status || 'Pendiente';
}


function renderWorkDay() {
  const wc = state.workControl;
  const parts = wc.parts || [];
  const incidents = wc.incidents || [];

  const date = new Date(`${wc.selectedDate}T12:00:00`);
  el.workSelectedDateLabel.textContent =
    new Intl.DateTimeFormat('es-ES',{
      weekday:'long',day:'numeric',month:'long',year:'numeric'
    }).format(date);

  const workers = new Set(parts.map(p => p.email || p.worker).filter(Boolean));
  el.workWorkersSummary.textContent = workers.size;
  el.workTasksSummary.textContent = parts.length;
  el.workPendingSummary.textContent = parts.filter(p => p.status === 'PENDIENTE').length;
  el.workIncidentsSummary.textContent = incidents.length;

  const subs = [...new Set(parts.map(p => p.subcontractor).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  const currentSub = el.workSubcontractorFilter.value;

  el.workSubcontractorFilter.innerHTML =
    '<option value="">Todas</option>' +
    subs.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');

  if (subs.includes(currentSub)) el.workSubcontractorFilter.value = currentSub;

  renderWorkIncidents();
  renderWorkParts();
}


function renderWorkIncidents() {
  const incidents = state.workControl.incidents || [];
  el.workIncidentPendingCount.textContent =
    incidents.filter(i => i.status === 'PENDIENTE' || i.status === 'REVISAR').length;

  if (!incidents.length) {
    el.workIncidentsContainer.innerHTML =
      '<div class="work-empty-small">No hay incidencias para este día.</div>';
    return;
  }

  el.workIncidentsContainer.innerHTML = '';

  incidents.forEach(incident => {
    const card = document.createElement('article');
    card.className = 'work-incident-card';
    card.innerHTML = `
      <div class="work-incident-head">
        <div>
          <strong>${esc(incident.worker || incident.email)}</strong>
          <span>${esc(incident.project || '')} · ${esc(incident.subcontractor || '')}</span>
        </div>
        <span class="work-status-badge ${String(incident.status || '').toLowerCase()}">${esc(incident.status || 'PENDIENTE')}</span>
      </div>
      <div class="work-incident-body">
        <strong>${esc(incident.type || 'INCIDENCIA')}</strong>
        <p>${esc(incident.description || '')}</p>
        ${incident.approxTime ? `<small>Hora aproximada: ${esc(incident.approxTime)}</small>` : ''}
      </div>
      <div class="work-card-actions">
        ${incident.status !== 'RESUELTA' && incident.status !== 'RECHAZADA'
          ? '<button class="btn btn-secondary incident-correct-btn" type="button">Corregir</button><button class="btn btn-secondary incident-review-btn" type="button">Marcar revisar</button><button class="btn btn-danger incident-discard-btn" type="button">Descartar</button>'
          : ''}
      </div>
    `;

    card.querySelector('.incident-correct-btn')?.addEventListener('click', () => openWorkCorrection(incident));
    card.querySelector('.incident-review-btn')?.addEventListener('click', () => {
      const resolution = window.prompt('Observación para dejar la incidencia en REVISAR:');
      if (!resolution) return;
      postToBackend('workControlIncidentUpdate', {
        incidentRowNumber:incident.rowNumber,
        incidentStatus:'REVISAR',
        incidentResolution:resolution
      });
    });
    card.querySelector('.incident-discard-btn')?.addEventListener('click', () => {
      if (!window.confirm('¿Descartar esta incidencia?')) return;
      postToBackend('workControlIncidentDiscard', {
        incidentRowNumber:incident.rowNumber
      });
    });

    el.workIncidentsContainer.appendChild(card);
  });
}


function filteredWorkParts() {
  const sub = el.workSubcontractorFilter.value;
  const stateFilter = el.workStateFilter.value;

  return (state.workControl.parts || []).filter(part => {
    if (sub && part.subcontractor !== sub) return false;
    if (stateFilter && part.status !== stateFilter) return false;
    return true;
  });
}


function renderWorkParts() {
  const parts = filteredWorkParts();

  if (!parts.length) {
    el.workPartsContainer.innerHTML =
      '<div class="empty-state">No hay partes que coincidan con los filtros.</div>';
    return;
  }

  const groups = {};
  parts.forEach(part => {
    const key = `${part.project}|${part.subcontractor}|${part.worker}`;
    (groups[key] ||= []).push(part);
  });

  el.workPartsContainer.innerHTML = '';

  Object.values(groups).forEach(rows => {
    const block = document.createElement('section');
    block.className = 'work-part-group';
    const first = rows[0];
    const pendingRows = rows.filter(r => r.status === 'PENDIENTE').map(r => r.rowNumber);

    block.innerHTML = `
      <div class="work-part-group-head">
        <div>
          <strong>${esc(first.worker || first.email)}</strong>
          <span>${esc(first.project || '')} · ${esc(first.subcontractor || '')}</span>
        </div>
        ${pendingRows.length
          ? `<button class="btn btn-secondary btn-sm validate-group-btn" type="button">Validar pendientes (${pendingRows.length})</button>`
          : ''}
      </div>
      <div class="work-part-list"></div>
    `;

    block.querySelector('.validate-group-btn')?.addEventListener('click', () => {
      if (!window.confirm(`¿Validar ${pendingRows.length} tarea(s) pendientes de este bloque?`)) return;
      postToBackend('workControlBulkValidate', {rowNumbers:pendingRows});
    });

    const list = block.querySelector('.work-part-list');

    rows.forEach(part => {
      const item = document.createElement('article');
      item.className = 'work-part-card';
      item.innerHTML = `
        <div class="work-part-main">
          <div class="work-part-title">${esc(part.task || 'Tarea')}</div>
          <div class="work-part-meta">
            ${esc(part.entryTime || '')}${part.exitTime ? '–' + esc(part.exitTime) : ''}
            ${part.hours ? ' · ' + esc(part.hours) : ''}
            ${part.zone ? ' · ' + esc(part.zone) : ''}
          </div>
          ${part.description ? `<p>${esc(part.description)}</p>` : ''}
          ${part.observation ? `<small>Obs.: ${esc(part.observation)}</small>` : ''}
        </div>
        <div class="work-part-side">
          <span class="work-status-badge ${String(part.status || '').toLowerCase()}">${esc(workStatusLabel(part.status))}</span>
          <div class="work-part-actions">
            <button type="button" class="mini-action validate">Validar</button>
            <button type="button" class="mini-action review">Revisar</button>
            <button type="button" class="mini-action reject">Rechazar</button>
          </div>
        </div>
      `;

      item.querySelector('.validate').addEventListener('click', () => {
        postToBackend('workControlUpdate', {
          rowNumber:part.rowNumber,
          status:'VALIDADO',
          observation:''
        });
      });

      item.querySelector('.review').addEventListener('click', () => {
        const observation = window.prompt('Observación para REVISAR:');
        if (!observation) return;
        postToBackend('workControlUpdate', {
          rowNumber:part.rowNumber,
          status:'REVISAR',
          observation
        });
      });

      item.querySelector('.reject').addEventListener('click', () => {
        const observation = window.prompt('Motivo de RECHAZO:');
        if (!observation) return;
        postToBackend('workControlUpdate', {
          rowNumber:part.rowNumber,
          status:'RECHAZADO',
          observation
        });
      });

      list.appendChild(item);
    });

    el.workPartsContainer.appendChild(block);
  });
}


function handleWorkControlMutation(payload) {
  if (!payload?.ok) {
    setStatus(el.workControlStatus, payload?.message || 'No se ha podido guardar el cambio.', 'error');
    return;
  }

  closeWorkCorrection();
  setStatus(el.workControlStatus, 'Cambio guardado.', 'success');

  // Serializamos: primero día. Después mes desde el handler.
  postToBackend('workControlDay', {
    project:state.workControl.selectedProject,
    date:state.workControl.selectedDate
  });

  setTimeout(() => {
    postToBackend('workControlMonth', {
      project:state.workControl.selectedProject,
      month:workMonthKey(state.workControl.currentMonth)
    });
  }, 250);
}


function openWorkCorrection(incident) {
  state.workControl.correctionIncident = incident;
  const correction = incident.correction || {};
  const mode = correction.mode || 'MANUAL';

  el.workCorrectionIncidentText.textContent =
    `${incident.worker || incident.email} · ${incident.project || ''} · ${incident.description || ''}`;

  let html = '';

  if (mode === 'PROJECT') {
    html = `
      <label><span>Bloque a corregir</span><select id="wcBlock">
        ${(correction.blocks || []).map(b => `<option value="${esc(b.id)}">${esc(b.project)} · ${esc(b.entryTime)}${b.exitTime ? '–'+esc(b.exitTime) : ' · abierta'}</option>`).join('')}
      </select></label>
      <label><span>Proyecto correcto</span><select id="wcProject">
        ${(correction.projects || []).map(p => `<option value="${esc(p)}">${esc(p)}</option>`).join('')}
      </select></label>`;
  } else if (mode === 'EXIT') {
    html = `
      <label><span>Entrada abierta</span><select id="wcBlock">
        ${(correction.blocks || []).map(b => `<option value="${esc(b.id)}">${esc(b.project)} · entrada ${esc(b.entryTime)}</option>`).join('')}
      </select></label>
      <label><span>Hora de salida</span><input id="wcExitTime" type="time"></label>`;
  } else if (mode === 'ENTRY') {
    html = `
      <label><span>Proyecto</span><select id="wcProject">
        ${(correction.projects || []).map(p => `<option value="${esc(p)}">${esc(p)}</option>`).join('')}
      </select></label>
      <label><span>Hora de entrada</span><input id="wcEntryTime" type="time"></label>
      <label><span>Hora de salida</span><input id="wcExitTime" type="time"></label>`;
  } else {
    html = `
      <div class="empty-state">
        Este tipo de incidencia requiere revisión manual. Puedes marcarla como REVISAR o descartarla.
      </div>`;
  }

  el.workCorrectionFields.innerHTML = html;
  el.saveWorkCorrectionBtn.classList.toggle('hidden', mode === 'MANUAL');
  el.workIncidentCorrectionModal.classList.remove('hidden');
}


function closeWorkCorrection() {
  el.workIncidentCorrectionModal.classList.add('hidden');
  state.workControl.correctionIncident = null;
  el.workCorrectionFields.innerHTML = '';
}


function saveWorkCorrection() {
  const incident = state.workControl.correctionIncident;
  if (!incident) return;

  postToBackend('workControlIncidentCorrect', {
    incidentRowNumber:incident.rowNumber,
    correctionBlockId:document.getElementById('wcBlock')?.value || '',
    correctionProject:document.getElementById('wcProject')?.value || '',
    correctionEntryTime:document.getElementById('wcEntryTime')?.value || '',
    correctionExitTime:document.getElementById('wcExitTime')?.value || ''
  });
}


/* MAQUINARIA · VISTA GLOBAL */
function openEquipmentGlobal() {
  show(el.equipmentGlobalView);
  setStatus(el.equipmentGlobalStatus, 'Cargando maquinaria…');
  postToBackend('equipmentLocationsGlobal', {});
}


function handleEquipmentLocationsGlobal(payload) {
  if (!payload?.ok) {
    setStatus(el.equipmentGlobalStatus, payload?.message || 'No se ha podido cargar maquinaria.', 'error');
    return;
  }

  state.equipmentGlobal = Array.isArray(payload.locations) ? payload.locations : [];

  if (payload.configured === false) {
    setStatus(el.equipmentGlobalStatus, payload.message || 'Módulo de maquinaria pendiente de configurar.', 'info');
  } else {
    clearStatus(el.equipmentGlobalStatus);
  }

  renderEquipmentGlobalFilters();
  renderEquipmentGlobal();
}


function renderEquipmentGlobalFilters() {
  const projects = [...new Set(
    (state.equipmentGlobal || []).map(x => x.project).filter(Boolean)
  )].sort((a,b)=>a.localeCompare(b,'es'));

  const current = el.equipmentGlobalProjectFilter.value;
  el.equipmentGlobalProjectFilter.innerHTML =
    '<option value="">Todos</option>' +
    projects.map(p => `<option value="${esc(p)}">${esc(p)}</option>`).join('');

  if (projects.includes(current)) el.equipmentGlobalProjectFilter.value = current;
}


function renderEquipmentGlobal() {
  const all = state.equipmentGlobal || [];
  const q = el.equipmentGlobalSearch.value.trim().toLowerCase();
  const project = el.equipmentGlobalProjectFilter.value;

  const filtered = all.filter(item => {
    if (project && item.project !== project) return false;
    if (q) {
      const haystack = [
        item.equipmentId,item.name,item.type,item.supplier,item.project,item.trackerId,item.imei
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  el.equipmentGlobalCount.textContent = all.length;
  el.equipmentPositionCount.textContent =
    all.filter(x => Number.isFinite(Number(x.easting)) && Number.isFinite(Number(x.northing))).length;
  el.equipmentNoPositionCount.textContent =
    all.length - Number(el.equipmentPositionCount.textContent);

  if (!filtered.length) {
    el.equipmentGlobalList.innerHTML = '<div class="empty-state">No hay maquinaria que coincida con los filtros.</div>';
    return;
  }

  el.equipmentGlobalList.innerHTML = filtered.map(item => `
    <article class="equipment-global-card">
      <div>
        <strong>${esc(item.name || item.equipmentId || 'Equipo')}</strong>
        <span>${esc(item.type || '')}${item.supplier ? ' · '+esc(item.supplier) : ''}</span>
      </div>
      <div class="equipment-global-tags">
        ${item.project ? `<span>${esc(item.project)}</span>` : ''}
        ${item.trackerStatus ? `<span>${esc(item.trackerStatus)}</span>` : ''}
      </div>
      <dl>
        <dt>ID</dt><dd>${esc(item.equipmentId || '—')}</dd>
        <dt>Tracker</dt><dd>${esc(item.trackerId || '—')}</dd>
        <dt>Batería</dt><dd>${item.battery == null ? '—' : esc(item.battery) + '%'}</dd>
        <dt>Posición E/N</dt><dd>${item.easting == null || item.northing == null ? 'Sin posición' : `${esc(item.easting)} / ${esc(item.northing)}`}</dd>
        <dt>Última posición</dt><dd>${esc(item.lastPosition || '—')}</dd>
        <dt>Última comunicación</dt><dd>${esc(item.lastCommunication || '—')}</dd>
      </dl>
    </article>
  `).join('');
}


/* GLOBAL ADMIN */
function openGlobalAdmin() {
  show(el.globalAdminView);
  setStatus(el.adminProjectStatus, 'Cargando proyectos…');
  postToBackend('adminProjectsList', {});
}

function handleAdminProjectsList(payload) {
  if (!payload?.ok) {
    setStatus(el.adminProjectStatus, payload?.message || 'No se han podido cargar los proyectos.', 'error');
    return;
  }

  state.adminProjects = Array.isArray(payload.projects) ? payload.projects : [];

  clearStatus(el.adminProjectStatus);
  renderAdminProjects();
}

function renderAdminProjects() {
  el.adminProjectsList.innerHTML = '';

  if (!state.adminProjects.length) {
    el.adminProjectsList.innerHTML =
      '<div class="empty-state">No hay proyectos creados.</div>';
    return;
  }

  state.adminProjects.forEach(project => {
    const row = document.createElement('div');
    row.className = 'admin-project-row';

    row.innerHTML = `
      <div class="admin-project-id">${esc(project.id)}</div>
      <div class="admin-project-name">${esc(project.name || project.id)}</div>
      <div class="admin-project-campus">${esc(project.campus || '—')}</div>
      <div>
        <span class="state-pill ${project.active ? 'active' : 'inactive'}">
          ${project.active ? 'ACTIVO' : 'INACTIVO'}
        </span>
      </div>
      <button class="btn btn-secondary edit-project-btn" type="button">Editar</button>
    `;

    row.querySelector('.edit-project-btn')
      .addEventListener('click', () => openProjectModal('edit', project));

    el.adminProjectsList.appendChild(row);
  });
}

function openProjectModal(mode, project) {
  const editing = mode === 'edit';

  el.projectFormMode.value = editing ? 'edit' : 'create';
  el.projectModalTitle.textContent = editing ? 'Editar proyecto' : 'Nuevo proyecto';

  el.projectIdInput.value = editing ? project.id : '';
  el.projectNameInput.value = editing ? project.name : '';
  el.projectCampusInput.value = editing ? project.campus : '';
  el.projectActiveInput.checked = editing ? project.active : true;

  el.projectIdInput.disabled = editing;
  el.projectModal.classList.remove('hidden');
}

function closeProjectModal() {
  el.projectModal.classList.add('hidden');
  el.projectForm.reset();
  el.projectIdInput.disabled = false;
}

el.projectForm.addEventListener('submit', event => {
  event.preventDefault();

  const payload = {
    projectId: el.projectIdInput.value,
    name: el.projectNameInput.value,
    campus: el.projectCampusInput.value,
    active: el.projectActiveInput.checked
  };

  setStatus(el.adminProjectStatus, 'Guardando…');

  postToBackend(
    el.projectFormMode.value === 'edit'
      ? 'adminProjectUpdate'
      : 'adminProjectCreate',
    payload
  );
});

function handleProjectMutation(payload) {
  if (!payload?.ok) {
    setStatus(el.adminProjectStatus, payload?.message || 'No se ha podido guardar.', 'error');
    return;
  }

  closeProjectModal();
  setStatus(el.adminProjectStatus, payload.message || 'Guardado correctamente.', 'success');

  postToBackend('adminProjectsList', {});

  setTimeout(() => {
    postToBackend('bootstrap', {});
  }, 250);
}


/* PURCHASES */
function openPurchases() {
  if (!state.currentProject) return;

  el.purchasesProjectSubtitle.textContent =
    `${state.currentProject.name || state.currentProject.id} · ${state.currentProject.campus || ''}`;

  show(el.purchasesView);

  setStatus(el.purchaseStatus, 'Cargando solicitudes…');

  // IMPORTANTE:
  // El formulario oculto usa un único iframe como target.
  // No debemos lanzar dos POST consecutivos porque el segundo
  // puede cancelar la navegación/respuesta del primero.
  postToBackend('purchaseList', {
    projectId: state.currentProject.id
  });
}


function handlePurchaseSuggestions(payload) {
  if (!payload?.ok) return;

  state.purchaseSuggestions = {
    suppliers: Array.isArray(payload.suppliers) ? payload.suppliers : [],
    families: Array.isArray(payload.families) ? payload.families : [],
    destinations: Array.isArray(payload.destinations) ? payload.destinations : [],
    materials: Array.isArray(payload.materials) ? payload.materials : []
  };

  renderPurchaseSuggestions();
}

function renderPurchaseSuggestions() {
  el.supplierSuggestions.innerHTML =
    state.purchaseSuggestions.suppliers
      .map(value => `<option value="${esc(value)}"></option>`)
      .join('');

  el.familySuggestions.innerHTML =
    state.purchaseSuggestions.families
      .map(value => `<option value="${esc(value)}"></option>`)
      .join('');

  el.destinationSuggestions.innerHTML =
    state.purchaseSuggestions.destinations
      .map(item => `<option value="${esc(item.destination)}"></option>`)
      .join('');

  el.materialReferenceSuggestions.innerHTML =
    state.purchaseSuggestions.materials
      .filter(item => item.reference)
      .map(item => `<option value="${esc(item.reference)}">${esc(item.description || '')}</option>`)
      .join('');
}

function applyDestinationSuggestion() {
  const value = el.purchaseDestination.value.trim().toLowerCase();

  const match = state.purchaseSuggestions.destinations.find(item =>
    String(item.destination || '').trim().toLowerCase() === value
  );

  if (!match) return;

  if (match.type) el.purchaseDestinationType.value = match.type;
  if (match.address) el.purchaseAddress.value = match.address;
  if (match.contact) el.purchaseContact.value = match.contact;
  if (match.family && !el.purchaseFamily.value) el.purchaseFamily.value = match.family;
}

function applyMaterialSuggestion(row) {
  const refInput = row.querySelector('.mat-ref');
  const value = refInput.value.trim().toLowerCase();

  const match = state.purchaseSuggestions.materials.find(item =>
    String(item.reference || '').trim().toLowerCase() === value
  );

  if (!match) return;

  const desc = row.querySelector('.mat-desc');
  const price = row.querySelector('.mat-price');

  if (!desc.value && match.description) desc.value = match.description;
  if (!price.value && match.unitPrice) price.value = match.unitPrice;

  if (!el.purchaseSupplier.value && match.supplier) {
    el.purchaseSupplier.value = match.supplier;
  }

  if (!el.purchaseFamily.value && match.family) {
    el.purchaseFamily.value = match.family;
  }
}

function newClientRequestId() {
  if (window.crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2) +
    '-' +
    Math.random().toString(36).slice(2)
  );
}

function setPurchaseSubmitting(isSubmitting) {
  state.purchaseSubmitting = isSubmitting;
  el.submitPurchaseBtn.disabled = isSubmitting;
  el.submitPurchaseBtn.textContent = isSubmitting
    ? 'Creando…'
    : 'Crear solicitud';
}

function handlePurchaseList(payload) {
  if (!payload?.ok) {
    setStatus(el.purchaseStatus, payload?.message || 'No se han podido cargar las solicitudes.', 'error');
    return;
  }

  state.purchases = Array.isArray(payload.requests) ? payload.requests : [];

  clearStatus(el.purchaseStatus);
  renderPurchaseSummary();
  renderPurchases();

  // Cargamos sugerencias SOLO después de haber recibido
  // y pintado correctamente el listado.
  postToBackend('purchaseSuggestions', {
    projectId: state.currentProject.id
  });
}

function renderPurchaseSummary() {
  const total = state.purchases.length;
  const pending = state.purchases.filter(x =>
    ['PENDIENTE_ADMINISTRACION', 'EN_TRAMITACION'].includes(x.status)
  ).length;
  const issued = state.purchases.filter(x =>
    ['PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(x.status)
  ).length;

  el.purchaseCountTotal.textContent = total;
  el.purchaseCountPending.textContent = pending;
  el.purchaseCountIssued.textContent = issued;
}

function renderPurchases() {
  el.purchaseList.innerHTML = '';

  if (!state.purchases.length) {
    el.purchaseList.innerHTML =
      '<div class="empty-state"><h3>No hay solicitudes todavía</h3><p>Crea la primera solicitud de pedido para este proyecto.</p></div>';
    return;
  }

  state.purchases.forEach(req => {
    const card = document.createElement('article');
    card.className = 'purchase-card';

    const statusLabel = statusText(req.status);
    const statusClass =
      ['PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(req.status)
        ? 'issued'
        : req.status === 'CANCELADO'
          ? 'cancelled'
          : '';

    const materialRows = (req.materials || []).map(item => `
      <tr>
        <td>${esc(item.reference || '—')}</td>
        <td>${esc(item.description || '—')}</td>
        <td>${esc(item.quantity || '—')}</td>
        <td>${esc(item.unitPrice || '—')}</td>
      </tr>
    `).join('');

    card.innerHTML = `
      <div class="purchase-card-head">
        <div class="purchase-card-title">
          <strong>${esc(req.requestId)}</strong>
          <span>${esc(req.supplier)} · ${esc(req.createdAt)}</span>
        </div>
        <div class="purchase-card-head-actions">
          <span class="purchase-status-pill ${statusClass}">${esc(statusLabel)}</span>
          <button class="btn btn-secondary btn-sm workflow-purchase-btn" type="button">Tramitar</button>
          <button class="btn btn-secondary btn-sm reuse-purchase-btn" type="button">Reutilizar</button>
        </div>
      </div>

      <div class="purchase-card-body">
        <div class="data-pair"><span>Familia</span><strong>${esc(req.family || '—')}</strong></div>
        <div class="data-pair"><span>Fecha requerida</span><strong>${esc(req.requiredDate || '—')}</strong></div>
        <div class="data-pair"><span>Destino</span><strong>${esc([req.destinationType, req.destination].filter(Boolean).join(' · ') || '—')}</strong></div>
        <div class="data-pair"><span>PO</span><strong>${esc(req.poNumber || 'Pendiente')}</strong></div>
      </div>

      ${materialRows ? `
        <div class="purchase-materials">
          <table>
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio unit.</th>
              </tr>
            </thead>
            <tbody>${materialRows}</tbody>
          </table>
        </div>
      ` : ''}

      ${req.notes ? `<div class="purchase-notes">${esc(req.notes)}</div>` : ''}
    `;

    card.querySelector('.workflow-purchase-btn')
      .addEventListener('click', () => openPurchaseWorkflow(req));

    card.querySelector('.reuse-purchase-btn')
      .addEventListener('click', () => openPurchaseModal(req));

    el.purchaseList.appendChild(card);
  });
}

function statusText(status) {
  const map = {
    PENDIENTE_ADMINISTRACION: 'Pendiente administración',
    EN_TRAMITACION: 'En tramitación',
    PEDIDO_EMITIDO: 'Pedido emitido',
    CONFIRMADO_PROVEEDOR: 'Confirmado proveedor',
    CANCELADO: 'Cancelado'
  };
  return map[status] || status || '—';
}


function openPurchaseWorkflow(req) {
  state.workflowRequest = req;

  el.workflowRequestId.textContent = req.requestId || 'Solicitud';
  el.workflowRequestMeta.textContent =
    [req.projectId, req.createdAt, req.requester]
      .filter(Boolean)
      .join(' · ');

  el.workflowSupplier.textContent = req.supplier || '—';
  el.workflowFamilyDisplay.textContent = req.family || 'PENDIENTE';
  el.workflowRequiredDate.textContent = req.requiredDate || '—';
  el.workflowDestination.textContent =
    [req.destinationType, req.destination]
      .filter(Boolean)
      .join(' · ') || '—';

  el.workflowFamilyInput.value = req.family || '';
  el.workflowStatusInput.value = req.status || 'PENDIENTE_ADMINISTRACION';
  el.workflowPoInput.value = req.poNumber || '';
  el.workflowExpectedDateInput.value = req.expectedDeliveryDate || '';

  const materials = Array.isArray(req.materials)
    ? req.materials
    : [];

  if (materials.length) {
    el.workflowMaterials.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Referencia</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio unit.</th>
          </tr>
        </thead>
        <tbody>
          ${materials.map(item => `
            <tr>
              <td>${esc(item.reference || '—')}</td>
              <td>${esc(item.description || '—')}</td>
              <td>${esc(item.quantity || '—')}</td>
              <td>${esc(item.unitPrice || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    el.workflowMaterials.innerHTML =
      '<div class="empty-state">Sin líneas de material.</div>';
  }

  el.workflowNotes.textContent = req.notes || 'Sin observaciones';

  setWorkflowSubmitting(false);
  el.purchaseWorkflowModal.classList.remove('hidden');
}

function closePurchaseWorkflow() {
  el.purchaseWorkflowModal.classList.add('hidden');
  state.workflowRequest = null;
  setWorkflowSubmitting(false);
}

function setWorkflowSubmitting(value) {
  state.workflowSubmitting = value;
  el.saveWorkflowBtn.disabled = value;
  el.saveWorkflowBtn.textContent = value
    ? 'Guardando…'
    : 'Guardar tramitación';
}

function savePurchaseWorkflow() {
  if (!state.workflowRequest || state.workflowSubmitting) return;

  const family = el.workflowFamilyInput.value.trim();
  const status = el.workflowStatusInput.value;
  const poNumber = el.workflowPoInput.value.trim();
  const expectedDeliveryDate = el.workflowExpectedDateInput.value;

  if (
    ['PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(status) &&
    !family
  ) {
    setStatus(
      el.purchaseStatus,
      'La familia / imputación es obligatoria para emitir el pedido.',
      'error'
    );
    return;
  }

  if (
    ['PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(status) &&
    !poNumber
  ) {
    setStatus(
      el.purchaseStatus,
      'Introduce el nº PO / Sage antes de emitir el pedido.',
      'error'
    );
    return;
  }

  if (
    status === 'CONFIRMADO_PROVEEDOR' &&
    !expectedDeliveryDate
  ) {
    setStatus(
      el.purchaseStatus,
      'Introduce la fecha prevista de entrega para confirmar el pedido con proveedor.',
      'error'
    );
    return;
  }

  setWorkflowSubmitting(true);

  postToBackend('purchaseUpdateStatus', {
    requestId: state.workflowRequest.requestId,
    family: family,
    status: status,
    poNumber: poNumber,
    expectedDeliveryDate: expectedDeliveryDate
  });
}

function openPurchaseModal(sourceRequest=null) {
  if (!state.currentProject) return;

  el.purchaseForm.reset();
  el.materialsRows.innerHTML = '';
  el.purchaseClientRequestId.value = newClientRequestId();

  el.purchaseModalProject.textContent =
    `${state.currentProject.name || state.currentProject.id} · ${state.currentProject.campus || ''}`;

  if (sourceRequest) {
    el.purchaseSupplier.value = sourceRequest.supplier || '';
    el.purchaseFamily.value = sourceRequest.family || '';
    el.purchaseRequiredDate.value = sourceRequest.requiredDate || '';
    el.purchaseQuoteRef.value = sourceRequest.quoteRef || '';
    el.purchaseDestinationType.value = sourceRequest.destinationType || 'ALMACEN';
    el.purchaseDestination.value = sourceRequest.destination || '';
    el.purchaseAddress.value = sourceRequest.deliveryAddress || '';
    el.purchaseContact.value = sourceRequest.siteContact || '';
    el.purchaseNotes.value = sourceRequest.notes || '';

    const materials = Array.isArray(sourceRequest.materials)
      ? sourceRequest.materials
      : [];

    if (materials.length) {
      materials.forEach(item => addMaterialRow(item));
    } else {
      addMaterialRow();
    }
  } else {
    addMaterialRow();
  }

  setPurchaseSubmitting(false);
  el.purchaseModal.classList.remove('hidden');
}

function closePurchaseModal() {
  el.purchaseModal.classList.add('hidden');
}

function addMaterialRow(source=null) {
  const row = document.createElement('div');
  row.className = 'material-row';

  row.innerHTML = `
    <label>
      <span>Referencia</span>
      <input class="mat-ref" type="text" list="materialReferenceSuggestions" placeholder="738953159" value="${esc(source?.reference || '')}">
    </label>

    <label>
      <span>Descripción</span>
      <input class="mat-desc" type="text" placeholder="Descripción del material" value="${esc(source?.description || '')}">
    </label>

    <label>
      <span>Cantidad</span>
      <input class="mat-qty" type="text" placeholder="100" value="${esc(source?.quantity || '')}">
    </label>

    <label>
      <span>Precio unit.</span>
      <input class="mat-price" type="text" placeholder="Opcional" value="${esc(source?.unitPrice || '')}">
    </label>

    <button class="remove-material" type="button" title="Eliminar línea">×</button>
  `;

  row.querySelector('.mat-ref')
    .addEventListener('change', () => applyMaterialSuggestion(row));

  row.querySelector('.mat-ref')
    .addEventListener('blur', () => applyMaterialSuggestion(row));

  row.querySelector('.remove-material').addEventListener('click', () => {
    if (el.materialsRows.children.length === 1) {
      row.querySelectorAll('input').forEach(input => input.value = '');
      return;
    }
    row.remove();
  });

  el.materialsRows.appendChild(row);
}

function collectMaterials() {
  return [...el.materialsRows.querySelectorAll('.material-row')]
    .map(row => ({
      reference: row.querySelector('.mat-ref').value.trim(),
      description: row.querySelector('.mat-desc').value.trim(),
      quantity: row.querySelector('.mat-qty').value.trim(),
      unitPrice: row.querySelector('.mat-price').value.trim()
    }))
    .filter(item =>
      item.reference ||
      item.description ||
      item.quantity ||
      item.unitPrice
    );
}

el.purchaseForm.addEventListener('submit', event => {
  event.preventDefault();

  if (!state.currentProject || state.purchaseSubmitting) return;

  const payload = {
    clientRequestId: el.purchaseClientRequestId.value || newClientRequestId(),
    projectId: state.currentProject.id,
    supplier: el.purchaseSupplier.value,
    family: el.purchaseFamily.value,
    requiredDate: el.purchaseRequiredDate.value,
    quoteRef: el.purchaseQuoteRef.value,
    destinationType: el.purchaseDestinationType.value,
    destination: el.purchaseDestination.value,
    deliveryAddress: el.purchaseAddress.value,
    siteContact: el.purchaseContact.value,
    notes: el.purchaseNotes.value,
    materials: collectMaterials()
  };

  setPurchaseSubmitting(true);
  setStatus(el.purchaseStatus, 'Creando solicitud…');

  postToBackend('purchaseCreate', payload);
});

function handlePurchaseMutation(payload) {
  setPurchaseSubmitting(false);
  setWorkflowSubmitting(false);

  if (!payload?.ok) {
    setStatus(el.purchaseStatus, payload?.message || 'No se ha podido guardar.', 'error');
    return;
  }

  closePurchaseModal();
  closePurchaseWorkflow();
  setStatus(el.purchaseStatus, payload.message || 'Guardado correctamente.', 'success');

  postToBackend('purchaseList', {
    projectId: state.currentProject.id
  });
}



/* DELIVERIES */
function openDeliveries() {
  if (!state.currentProject) return;

  el.deliveriesProjectSubtitle.textContent =
    `${state.currentProject.name || state.currentProject.id} · ${state.currentProject.campus || ''}`;

  state.deliveryFilter = 'ALL';
  state.deliveryCalendarDate = new Date();

  show(el.deliveriesView);
  setStatus(el.deliveryStatus, 'Cargando entregas…');

  postToBackend('deliveryList', {projectId: state.currentProject.id});
}

function handleDeliveryList(payload) {
  if (!payload?.ok) {
    setStatus(el.deliveryStatus, payload?.message || 'No se han podido cargar las entregas.', 'error');
    return;
  }

  state.deliveries = Array.isArray(payload.deliveries) ? payload.deliveries : [];
  state.constructionMilestones = Array.isArray(payload.milestones) ? payload.milestones : [];
  clearStatus(el.deliveryStatus);
  renderDeliverySummary();
  renderConstructionMilestones();
  renderDeliveryCalendar();
  renderDeliveryList();
}

function todayIso() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
}

function isDeliveryReceived(item) {
  return ['COMPLETA','PARCIAL'].includes(item.receiptStatus);
}

function isDeliveryLate(item) {
  return !isDeliveryReceived(item) && item.expectedDeliveryDate && item.expectedDeliveryDate < todayIso();
}

function isDeliveryUpcoming(item) {
  return !isDeliveryReceived(item) && item.expectedDeliveryDate && item.expectedDeliveryDate >= todayIso();
}

function renderDeliverySummary() {
  el.deliveryUpcomingCount.textContent = state.deliveries.filter(isDeliveryUpcoming).length;
  el.deliveryLateCount.textContent = state.deliveries.filter(isDeliveryLate).length;
  el.deliveryReceivedCount.textContent = state.deliveries.filter(isDeliveryReceived).length;
}

function renderDeliveryCalendar() {
  const base = state.deliveryCalendarDate;
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  el.calendarMonthLabel.textContent = `${monthNames[month]} ${year}`;

  const weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  let html = weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('');

  const first = new Date(year,month,1);
  const firstIndex = (first.getDay()+6)%7;
  const start = new Date(year,month,1-firstIndex);

  for (let i=0;i<42;i++) {
    const date = new Date(start);
    date.setDate(start.getDate()+i);

    const iso = [
      date.getFullYear(),
      String(date.getMonth()+1).padStart(2,'0'),
      String(date.getDate()).padStart(2,'0')
    ].join('-');

    const items = state.deliveries.filter(item => item.expectedDeliveryDate === iso);
    const milestones = state.constructionMilestones.filter(item => item.date === iso);
    const classes = ['calendar-day'];
    if (date.getMonth() !== month) classes.push('outside');
    if (iso === todayIso()) classes.push('today');

    html += `
      <div class="${classes.join(' ')}">
        <div class="calendar-day-number">${date.getDate()}</div>
        ${milestones.map(milestone => `
          <button class="calendar-milestone" type="button" data-milestone-id="${esc(milestone.milestoneId)}">
            <strong>◆ ${esc(milestone.title)}</strong>
            <span>${esc(milestone.type || 'HITO')}</span>
          </button>
        `).join('')}
        ${items.map(item => {
          const eventClass = isDeliveryReceived(item) ? 'received' : isDeliveryLate(item) ? 'late' : '';
          return `
            <button class="calendar-event ${eventClass}" type="button" data-request-id="${esc(item.requestId)}">
              <strong>${esc(item.supplier || item.requestId)}</strong>
              <span>${esc(item.poNumber || item.requestId)}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  el.deliveryCalendar.innerHTML = html;

  el.deliveryCalendar.querySelectorAll('.calendar-event').forEach(button => {
    button.addEventListener('click', () => {
      const item = state.deliveries.find(d => d.requestId === button.dataset.requestId);
      if (item) openDeliveryModal(item);
    });
  });

  el.deliveryCalendar.querySelectorAll('.calendar-milestone').forEach(button => {
    button.addEventListener('click', () => {
      const milestone = state.constructionMilestones.find(m => m.milestoneId === button.dataset.milestoneId);
      if (milestone) openConstructionMilestoneModal(milestone);
    });
  });
}

function renderDeliveryList() {
  const rows = state.deliveries.filter(item => {
    if (state.deliveryFilter === 'UPCOMING') return isDeliveryUpcoming(item);
    if (state.deliveryFilter === 'LATE') return isDeliveryLate(item);
    if (state.deliveryFilter === 'RECEIVED') return isDeliveryReceived(item);
    return true;
  });

  el.deliveryList.innerHTML = '';

  if (!rows.length) {
    el.deliveryList.innerHTML = '<div class="empty-state">No hay entregas para este filtro.</div>';
    return;
  }

  rows.forEach(item => {
    const row = document.createElement('div');
    row.className = 'delivery-row';
    const dateClass = isDeliveryReceived(item) ? 'received' : isDeliveryLate(item) ? 'late' : '';

    row.innerHTML = `
      <div class="delivery-main">
        <strong>${esc(item.supplier || 'Proveedor')}</strong>
        <span>${esc(item.requestId)} · ${esc(item.poNumber || 'PO pendiente')}</span>
      </div>
      <div class="delivery-data"><span>Familia</span><strong>${esc(item.family || '—')}</strong></div>
      <div class="delivery-data"><span>Destino</span><strong>${esc(item.destination || '—')}</strong></div>
      <div class="delivery-data"><span>Hito</span><strong>${esc(item.milestoneTitle || 'Sin referencia')}</strong><small>${esc(deliveryMilestoneDeltaText(item))}</small></div>
      <div><span class="delivery-date-pill ${dateClass}">${esc(item.expectedDeliveryDate || 'Sin fecha')}</span></div>
      <button class="btn btn-secondary btn-sm open-delivery-btn" type="button">Abrir</button>
    `;

    row.querySelector('.open-delivery-btn').addEventListener('click', () => openDeliveryModal(item));
    el.deliveryList.appendChild(row);
  });
}

function openDeliveryModal(item) {
  state.selectedDelivery = item;

  el.deliveryModalTitle.textContent = item.requestId || 'Entrega';
  el.deliveryModalMeta.textContent = [item.projectId,item.expectedDeliveryDate].filter(Boolean).join(' · ');
  el.deliverySupplier.textContent = item.supplier || '—';
  el.deliveryPo.textContent = item.poNumber || 'Pendiente';
  el.deliveryFamily.textContent = item.family || '—';
  el.deliveryDestination.textContent = [item.destinationType,item.destination].filter(Boolean).join(' · ') || '—';

  el.deliveryMilestoneSelect.innerHTML =
    '<option value="">Sin hito asociado</option>' +
    state.constructionMilestones.map(m => `
      <option value="${esc(m.milestoneId)}">${esc(m.date)} · ${esc(m.title)}</option>
    `).join('');
  el.deliveryMilestoneSelect.value = item.milestoneId || '';
  updateDeliveryMilestoneOffset();

  el.deliveryDateInput.value = item.expectedDeliveryDate || '';
  el.deliveryChangeReason.value = '';
  el.deliveryReceiptStatus.value = item.receiptStatus === 'PARCIAL' ? 'PARCIAL' : 'COMPLETA';
  el.deliveryReceiptNotes.value = item.receiptNotes || '';

  const materials = Array.isArray(item.materials) ? item.materials : [];
  el.deliveryMaterials.innerHTML = materials.length ? `
    <table>
      <thead><tr><th>Referencia</th><th>Descripción</th><th>Cantidad</th><th>Precio unit.</th></tr></thead>
      <tbody>
        ${materials.map(m => `<tr><td>${esc(m.reference||'—')}</td><td>${esc(m.description||'—')}</td><td>${esc(m.quantity||'—')}</td><td>${esc(m.unitPrice||'—')}</td></tr>`).join('')}
      </tbody>
    </table>
  ` : '<div class="empty-state">Sin líneas de material.</div>';

  setDeliverySubmitting(false);
  el.deliveryModal.classList.remove('hidden');
}


function dateToUtcDays_(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ''))) return null;
  const [y,m,d] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y,m-1,d) / 86400000);
}

function deliveryMilestoneDelta_(deliveryDate, milestoneDate) {
  const a = dateToUtcDays_(deliveryDate);
  const b = dateToUtcDays_(milestoneDate);
  if (a === null || b === null) return null;
  return b - a; // positivo = entrega antes del hito
}

function deliveryMilestoneDeltaText(item) {
  if (!item?.milestoneId || !item?.milestoneDate) return '';
  const days = deliveryMilestoneDelta_(item.expectedDeliveryDate, item.milestoneDate);
  if (days === null) return '';
  if (days > 0) return `${days} día${days === 1 ? '' : 's'} antes del hito`;
  if (days < 0) return `${Math.abs(days)} día${Math.abs(days) === 1 ? '' : 's'} después del hito`;
  return 'Mismo día que el hito';
}

function updateDeliveryMilestoneOffset() {
  if (!state.selectedDelivery) return;

  const milestone = state.constructionMilestones.find(
    m => m.milestoneId === el.deliveryMilestoneSelect.value
  );

  el.deliveryMilestoneOffset.className = 'milestone-offset neutral';

  if (!milestone) {
    el.deliveryMilestoneOffset.textContent = 'Sin referencia constructiva.';
    return;
  }

  const days = deliveryMilestoneDelta_(state.selectedDelivery.expectedDeliveryDate, milestone.date);

  if (days === null) {
    el.deliveryMilestoneOffset.textContent = 'No se puede calcular el margen.';
    return;
  }

  if (days > 0) {
    el.deliveryMilestoneOffset.className = 'milestone-offset positive';
    el.deliveryMilestoneOffset.textContent =
      `Llegada prevista ${days} día${days === 1 ? '' : 's'} antes del hito (${milestone.date}).`;
  } else if (days < 0) {
    el.deliveryMilestoneOffset.className = 'milestone-offset negative';
    el.deliveryMilestoneOffset.textContent =
      `Atención: llegada prevista ${Math.abs(days)} día${Math.abs(days) === 1 ? '' : 's'} después del hito (${milestone.date}).`;
  } else {
    el.deliveryMilestoneOffset.className = 'milestone-offset warning';
    el.deliveryMilestoneOffset.textContent = `Llegada prevista el mismo día del hito (${milestone.date}).`;
  }
}

function saveDeliveryMilestone() {
  if (!state.selectedDelivery || state.deliverySubmitting) return;

  setDeliverySubmitting(true);
  postToBackend('deliveryLinkMilestone', {
    requestId: state.selectedDelivery.requestId,
    milestoneId: el.deliveryMilestoneSelect.value
  });
}

function renderConstructionMilestones() {
  el.constructionMilestoneList.innerHTML = '';

  if (!state.constructionMilestones.length) {
    el.constructionMilestoneList.innerHTML = `
      <div class="empty-state milestone-empty">
        Todavía no hay hitos constructivos. Añade fechas como L3, Mechanical Complete, commissioning, PFHO o handover para referenciar las entregas.
      </div>`;
    return;
  }

  state.constructionMilestones.forEach(milestone => {
    const linked = state.deliveries.filter(d => d.milestoneId === milestone.milestoneId);
    const late = linked.filter(d => {
      const delta = deliveryMilestoneDelta_(d.expectedDeliveryDate, milestone.date);
      return delta !== null && delta < 0 && !isDeliveryReceived(d);
    }).length;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'milestone-card';
    card.innerHTML = `
      <div class="milestone-card-date">
        <strong>${esc(milestone.date || '—')}</strong>
        <span>${esc(milestone.type || 'CONSTRUCTIVO')}</span>
      </div>
      <div class="milestone-card-main">
        <strong>${esc(milestone.title || 'Hito')}</strong>
        <span>${esc(milestone.discipline || 'GENERAL')}${milestone.notes ? ' · ' + esc(milestone.notes) : ''}</span>
      </div>
      <div class="milestone-card-metrics">
        <span><strong>${linked.length}</strong> deliveries</span>
        ${late ? `<span class="milestone-risk"><strong>${late}</strong> después del hito</span>` : '<span class="milestone-ok">Sin conflictos</span>'}
      </div>
    `;
    card.addEventListener('click', () => openConstructionMilestoneModal(milestone));
    el.constructionMilestoneList.appendChild(card);
  });
}

function openConstructionMilestoneModal(milestone = null) {
  state.selectedConstructionMilestone = milestone;

  el.constructionMilestoneModalTitle.textContent =
    milestone ? 'Editar hito constructivo' : 'Nuevo hito constructivo';

  el.constructionMilestoneId.value = milestone?.milestoneId || '';
  el.constructionMilestoneTitle.value = milestone?.title || '';
  el.constructionMilestoneDate.value = milestone?.date || '';
  el.constructionMilestoneType.value = milestone?.type || 'CONSTRUCTIVO';
  el.constructionMilestoneDiscipline.value = milestone?.discipline || '';
  el.constructionMilestoneNotes.value = milestone?.notes || '';

  el.deleteConstructionMilestoneBtn.classList.toggle('hidden', !milestone);
  el.constructionMilestoneModal.classList.remove('hidden');
}

function closeConstructionMilestoneModal() {
  el.constructionMilestoneModal.classList.add('hidden');
  state.selectedConstructionMilestone = null;
  el.constructionMilestoneForm.reset();
  el.constructionMilestoneId.value = '';
  el.deleteConstructionMilestoneBtn.classList.add('hidden');
}

function saveConstructionMilestone(event) {
  event.preventDefault();
  if (!state.currentProject || state.deliverySubmitting) return;

  const title = el.constructionMilestoneTitle.value.trim();
  const date = el.constructionMilestoneDate.value;

  if (!title || !date) {
    setStatus(el.deliveryStatus, 'Indica nombre y fecha del hito.', 'error');
    return;
  }

  setDeliverySubmitting(true);
  postToBackend('constructionMilestoneSave', {
    projectId: state.currentProject.id,
    milestoneId: el.constructionMilestoneId.value,
    title: title,
    date: date,
    type: el.constructionMilestoneType.value,
    discipline: el.constructionMilestoneDiscipline.value,
    notes: el.constructionMilestoneNotes.value.trim()
  });
}

function deleteConstructionMilestone() {
  if (!state.currentProject || !state.selectedConstructionMilestone || state.deliverySubmitting) return;
  if (!window.confirm(`¿Eliminar el hito "${state.selectedConstructionMilestone.title}"? Las deliveries vinculadas quedarán sin referencia.`)) return;

  setDeliverySubmitting(true);
  postToBackend('constructionMilestoneDelete', {
    projectId: state.currentProject.id,
    milestoneId: state.selectedConstructionMilestone.milestoneId
  });
}

function closeDeliveryModal() {
  el.deliveryModal.classList.add('hidden');
  state.selectedDelivery = null;
  setDeliverySubmitting(false);
}

function setDeliverySubmitting(value) {
  state.deliverySubmitting = value;
  el.saveDeliveryDateBtn.disabled = value;
  el.saveDeliveryMilestoneBtn.disabled = value;
  el.confirmDeliveryReceiptBtn.disabled = value;
}

function saveDeliveryDate() {
  if (!state.selectedDelivery || state.deliverySubmitting) return;

  const newDate = el.deliveryDateInput.value;
  const reason = el.deliveryChangeReason.value.trim();

  if (!newDate) {
    setStatus(el.deliveryStatus,'Selecciona la nueva fecha de entrega.','error');
    return;
  }
  if (!reason) {
    setStatus(el.deliveryStatus,'Indica el motivo del cambio de fecha.','error');
    return;
  }

  setDeliverySubmitting(true);
  postToBackend('deliveryUpdateDate',{
    requestId:state.selectedDelivery.requestId,
    newDate:newDate,
    reason:reason
  });
}

function confirmDeliveryReceipt() {
  if (!state.selectedDelivery || state.deliverySubmitting) return;

  const receiptStatus = el.deliveryReceiptStatus.value;
  const notes = el.deliveryReceiptNotes.value.trim();

  if (receiptStatus === 'PARCIAL' && !notes) {
    setStatus(el.deliveryStatus,'En una recepción parcial indica qué material queda pendiente.','error');
    return;
  }

  setDeliverySubmitting(true);
  postToBackend('deliveryConfirmReceipt',{
    requestId:state.selectedDelivery.requestId,
    receiptStatus:receiptStatus,
    notes:notes
  });
}

function handleDeliveryMutation(payload) {
  setDeliverySubmitting(false);

  if (!payload?.ok) {
    setStatus(el.deliveryStatus,payload?.message || 'No se ha podido actualizar la entrega.','error');
    return;
  }

  if (!el.deliveryModal.classList.contains('hidden')) closeDeliveryModal();
  if (!el.constructionMilestoneModal.classList.contains('hidden')) closeConstructionMilestoneModal();
  setStatus(el.deliveryStatus,payload.message || 'Planificación actualizada.','success');
  postToBackend('deliveryList',{projectId:state.currentProject.id});
}



/* WAREHOUSE */
function openWarehouse() {
  if (!state.currentProject) return;

  el.warehouseProjectSubtitle.textContent =
    `${state.currentProject.name || state.currentProject.id} · ${state.currentProject.campus || ''}`;

  show(el.warehouseView);
  setStatus(el.warehouseStatus, 'Cargando almacenes…');

  postToBackend('warehouseBootstrap', {
    projectId: state.currentProject.id
  });
}

function handleWarehouseBootstrap(payload) {
  if (!payload?.ok) {
    setStatus(el.warehouseStatus, payload?.message || 'No se han podido cargar los almacenes.', 'error');
    return;
  }

  state.warehouses = Array.isArray(payload.warehouses) ? payload.warehouses : [];
  state.warehouseZones = Array.isArray(payload.zones) ? payload.zones : [];
  state.warehousePermissions = payload.permissions || {};

  clearStatus(el.warehouseStatus);

  renderWarehouseSelector();

  if (state.warehouses.length) {
    const currentCampus = String(state.currentProject?.campus || '').trim().toLowerCase();

    const preferred = state.warehouses.find(w =>
      String(w.campus || '').trim().toLowerCase() === currentCampus
    ) || state.warehouses[0];

    state.selectedWarehouseId = preferred.id;
    el.warehouseSelect.value = preferred.id;

    loadWarehouseData();
  } else {
    el.warehouseStockBody.innerHTML =
      '<tr><td colspan="6">No hay almacenes configurados para este proyecto.</td></tr>';
  }

  renderWarehouseZones();
  el.newZoneBtn.classList.toggle(
    'hidden',
    !state.warehousePermissions.canConfigure
  );
}

function renderWarehouseSelector() {
  el.warehouseSelect.innerHTML =
    state.warehouses
      .map(w =>
        `<option value="${esc(w.id)}">${esc(w.name || w.id)} · ${esc(w.discipline || '')}</option>`
      )
      .join('');

  el.materialRequestWarehouse.innerHTML =
    state.warehouses
      .map(w =>
        `<option value="${esc(w.id)}">${esc(w.name || w.id)}</option>`
      )
      .join('');
}

function loadWarehouseData() {
  if (!state.selectedWarehouseId) return;

  const warehouse = state.warehouses.find(
    w => w.id === state.selectedWarehouseId
  );

  el.warehouseMeta.textContent = warehouse
    ? [warehouse.campus, warehouse.discipline, warehouse.warehouseRole]
        .filter(Boolean)
        .join(' · ')
    : '';

  postToBackend('warehouseStockList', {
    projectId: state.currentProject.id,
    warehouseId: state.selectedWarehouseId
  });

  renderWarehouseZones();
}

function handleWarehouseStock(payload) {
  if (!payload?.ok) {
    setStatus(el.warehouseStatus, payload?.message || 'No se ha podido cargar el stock.', 'error');
    return;
  }

  state.warehouseStock = Array.isArray(payload.stock)
    ? payload.stock
    : [];

  renderWarehouseStock();
  renderWarehouseSummary();

  if (!el.materialRequestModal.classList.contains('hidden')) {
    refreshMaterialRequestFinder();
  }

  // El frontend usa un único iframe oculto: serializamos las llamadas.
  postToBackend('warehouseRequestList', {
    projectId: state.currentProject.id
  });
}

function handleWarehouseRequests(payload) {
  if (!payload?.ok) {
    setStatus(el.warehouseStatus, payload?.message || 'No se han podido cargar las solicitudes.', 'error');
    return;
  }

  state.warehouseRequests = Array.isArray(payload.requests)
    ? payload.requests
    : [];

  renderWarehouseRequests();
  renderWarehouseSummary();
}

function renderWarehouseSummary() {
  const warehouseId = state.selectedWarehouseId;

  const stock = state.warehouseStock.filter(
    item => item.warehouseId === warehouseId
  );

  const refs = new Set(
    stock
      .map(item => item.reference)
      .filter(Boolean)
  );

  const quarantine = stock.filter(
    item => item.status === 'QUARANTINE'
  ).length;

  const openRequests = state.warehouseRequests.filter(
    req =>
      req.warehouseId === warehouseId &&
      !['ENTREGADA','CANCELADA'].includes(req.status)
  ).length;

  el.warehouseSkuCount.textContent = refs.size;
  el.warehouseQuarantineCount.textContent = quarantine;
  el.warehouseOpenRequestsCount.textContent = openRequests;
}

function renderWarehouseStock() {
  const rows = state.warehouseStock.filter(
    item => item.warehouseId === state.selectedWarehouseId
  );

  el.warehouseStockBody.innerHTML = '';

  if (!rows.length) {
    el.warehouseStockBody.innerHTML =
      '<tr><td colspan="6">No hay stock registrado en este almacén.</td></tr>';
    return;
  }

  rows.forEach(item => {
    const tr = document.createElement('tr');
    const isQuarantine = item.status === 'QUARANTINE';

    tr.innerHTML = `
      <td>${esc(item.reference || '—')}</td>
      <td>${esc(item.description || '—')}</td>
      <td>${esc(item.zoneId || '—')}</td>
      <td>${esc(item.quantity || '0')} ${esc(item.unit || '')}</td>
      <td>${esc(item.status || 'OK')}</td>
      <td class="warehouse-row-action"></td>
    `;

    const actionCell = tr.querySelector('.warehouse-row-action');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary btn-sm';
    button.textContent = isQuarantine ? 'Cuarentena' : 'Solicitar';
    button.disabled = isQuarantine;

    if (!isQuarantine) {
      button.addEventListener('click', () => {
        openMaterialRequestModal({
          reference: item.reference,
          description: item.description
        });
      });
    }

    actionCell.appendChild(button);
    el.warehouseStockBody.appendChild(tr);
  });
}

function renderWarehouseRequests() {
  const rows = state.warehouseRequests.filter(
    req => req.warehouseId === state.selectedWarehouseId
  );

  el.warehouseRequestsList.innerHTML = '';

  if (!rows.length) {
    el.warehouseRequestsList.innerHTML =
      '<div class="empty-state">No hay solicitudes para este almacén.</div>';
    return;
  }

  rows.forEach(req => {
    const card = document.createElement('div');
    card.className = 'warehouse-request-card';

    card.innerHTML = `
      <strong>${esc(req.reference || req.description || req.requestId)}</strong>
      <span>${esc(req.quantity)} · ${esc(req.status)} · ${esc(req.requestedAt)}</span>
      ${req.notes ? `<span>${esc(req.notes)}</span>` : ''}
    `;

    el.warehouseRequestsList.appendChild(card);
  });
}

function renderWarehouseZones() {
  const rows = state.warehouseZones.filter(
    zone => zone.warehouseId === state.selectedWarehouseId
  );

  el.warehouseZonesList.innerHTML = '';

  if (!rows.length) {
    el.warehouseZonesList.innerHTML =
      '<div class="empty-state">No hay zonas configuradas.</div>';
    return;
  }

  rows.forEach(zone => {
    const card = document.createElement('div');
    card.className =
      'zone-card' +
      (zone.type === 'QUARANTINE' ? ' quarantine' : '');

    card.innerHTML = `
      <strong>${esc(zone.name || zone.zoneId)}</strong>
      <span>${esc(zone.zoneId)} · ${esc(zone.type)}</span>
    `;

    el.warehouseZonesList.appendChild(card);
  });
}

function materialRequestCatalog(warehouseId) {
  const grouped = new Map();

  state.warehouseStock
    .filter(item => item.warehouseId === warehouseId)
    .forEach(item => {
      const reference = String(item.reference || '').trim();
      const description = String(item.description || '').trim();
      const key = (reference || description).toLowerCase();
      if (!key) return;

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          reference,
          description,
          unit: item.unit || '',
          available: 0,
          quarantine: 0,
          zones: new Set(),
          quarantineZones: new Set()
        });
      }

      const material = grouped.get(key);
      const qty = Number(item.quantity) || 0;

      if (item.status === 'QUARANTINE') {
        material.quarantine += qty;
        if (item.zoneId) material.quarantineZones.add(item.zoneId);
      } else {
        material.available += qty;
        if (item.zoneId) material.zones.add(item.zoneId);
      }
    });

  return Array.from(grouped.values())
    .map(item => ({
      ...item,
      zones: Array.from(item.zones).sort(),
      quarantineZones: Array.from(item.quarantineZones).sort()
    }))
    .sort((a, b) =>
      String(a.description || a.reference).localeCompare(
        String(b.description || b.reference),
        'es',
        { sensitivity: 'base' }
      )
    );
}

function refreshMaterialRequestFinder() {
  const warehouseId = el.materialRequestWarehouse.value || state.selectedWarehouseId;
  const catalog = materialRequestCatalog(warehouseId);
  const currentZone = el.materialRequestZoneFilter.value;

  const zones = Array.from(new Set(
    catalog.flatMap(item => item.zones)
  )).sort();

  el.materialRequestZoneFilter.innerHTML =
    '<option value="">Todas las zonas</option>' +
    zones.map(zone => `<option value="${esc(zone)}">${esc(zone)}</option>`).join('');

  if (zones.includes(currentZone)) {
    el.materialRequestZoneFilter.value = currentZone;
  }

  renderMaterialRequestResults();
}

function renderMaterialRequestResults() {
  if (state.materialRequestSelection) {
    el.materialRequestResults.innerHTML = '';
    return;
  }

  const warehouseId = el.materialRequestWarehouse.value || state.selectedWarehouseId;
  const query = String(el.materialRequestSearch.value || '').trim().toLowerCase();
  const zone = el.materialRequestZoneFilter.value;

  let rows = materialRequestCatalog(warehouseId)
    .filter(item => {
      const haystack = `${item.reference} ${item.description}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesZone = !zone || item.zones.includes(zone);
      return matchesQuery && matchesZone;
    });

  if (!query && !zone) rows = rows.slice(0, 8);
  else rows = rows.slice(0, 20);

  el.materialRequestResults.innerHTML = '';

  if (!rows.length) {
    el.materialRequestResults.innerHTML =
      '<div class="material-search-empty">No hay materiales que coincidan con la búsqueda.</div>';
    return;
  }

  rows.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'material-search-item';
    button.disabled = item.available <= 0;

    button.innerHTML = `
      <div>
        <strong>${esc(item.reference || 'Sin referencia')}</strong>
        <span>${esc(item.description || 'Sin descripción')}</span>
        <small>${item.zones.length ? esc(item.zones.join(' · ')) : 'Sin ubicación disponible'}</small>
      </div>
      <div class="material-search-stock ${item.available <= 0 ? 'empty' : ''}">
        <strong>${esc(item.available)} ${esc(item.unit || 'ud')}</strong>
        <span>disponibles</span>
        ${item.quarantine > 0 ? `<small>${esc(item.quarantine)} en cuarentena</small>` : ''}
      </div>
    `;

    if (item.available > 0) {
      button.addEventListener('click', () => selectMaterialForRequest(item));
    }

    el.materialRequestResults.appendChild(button);
  });
}

function selectMaterialForRequest(item) {
  state.materialRequestSelection = item;

  el.materialRequestReference.value = item.reference || '';
  el.materialRequestDescription.value = item.description || '';
  el.materialRequestSelectedTitle.textContent = item.reference || 'Sin referencia';
  el.materialRequestSelectedDescription.textContent = item.description || '';
  el.materialRequestAvailable.textContent = `${item.available} ${item.unit || 'ud'}`;
  el.materialRequestZones.textContent = item.zones.join(' · ') || '—';
  el.materialRequestQuarantine.textContent = `${item.quarantine} ${item.unit || 'ud'}`;
  el.materialRequestSelected.classList.remove('hidden');
  el.materialRequestResults.innerHTML = '';

  el.materialRequestQuantity.disabled = false;
  el.materialRequestQuantity.max = String(item.available);
  el.materialRequestQuantity.placeholder = `Máximo ${item.available}`;
  el.materialRequestQuantityHint.textContent =
    `Stock disponible para solicitar: ${item.available} ${item.unit || 'ud'}.`;
  el.submitMaterialRequestBtn.disabled = false;
  clearStatus(el.materialRequestStatus);
  el.materialRequestQuantity.focus();
}

function clearMaterialRequestSelection() {
  state.materialRequestSelection = null;
  el.materialRequestReference.value = '';
  el.materialRequestDescription.value = '';
  el.materialRequestSelected.classList.add('hidden');
  el.materialRequestQuantity.value = '';
  el.materialRequestQuantity.disabled = true;
  el.materialRequestQuantity.removeAttribute('max');
  el.materialRequestQuantity.placeholder = 'Selecciona primero un material';
  el.materialRequestQuantityHint.textContent = '';
  el.submitMaterialRequestBtn.disabled = true;
  clearStatus(el.materialRequestStatus);
  renderMaterialRequestResults();
  el.materialRequestSearch.focus();
}

function openMaterialRequestModal(prefill = null) {
  if (!state.warehouses.length) return;

  el.materialRequestForm.reset();
  clearStatus(el.materialRequestStatus);
  state.materialRequestSelection = null;

  el.materialRequestWarehouse.value = state.selectedWarehouseId || state.warehouses[0].id;
  el.materialRequestSelected.classList.add('hidden');
  el.materialRequestQuantity.disabled = true;
  el.submitMaterialRequestBtn.disabled = true;
  el.materialRequestModal.classList.remove('hidden');

  refreshMaterialRequestFinder();

  if (prefill) {
    const catalog = materialRequestCatalog(el.materialRequestWarehouse.value);
    const match = catalog.find(item =>
      String(item.reference || '') === String(prefill.reference || '') &&
      String(item.description || '') === String(prefill.description || '')
    ) || catalog.find(item =>
      String(item.reference || '') === String(prefill.reference || '')
    );

    if (match && match.available > 0) {
      selectMaterialForRequest(match);
      return;
    }
  }

  el.materialRequestSearch.focus();
}

function closeMaterialRequestModal() {
  el.materialRequestModal.classList.add('hidden');
  state.materialRequestSelection = null;
}

el.materialRequestForm.addEventListener('submit', event => {
  event.preventDefault();

  const selected = state.materialRequestSelection;
  if (!selected) {
    setStatus(el.materialRequestStatus, 'Selecciona un material del stock.', 'error');
    return;
  }

  const quantity = Number(el.materialRequestQuantity.value);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    setStatus(el.materialRequestStatus, 'Indica una cantidad válida.', 'error');
    return;
  }

  if (quantity > selected.available) {
    setStatus(
      el.materialRequestStatus,
      `La cantidad solicitada supera el stock disponible (${selected.available} ${selected.unit || 'ud'}).`,
      'error'
    );
    return;
  }

  el.submitMaterialRequestBtn.disabled = true;
  setStatus(el.materialRequestStatus, 'Enviando solicitud…');

  postToBackend('warehouseRequestCreate', {
    projectId: state.currentProject.id,
    warehouseId: el.materialRequestWarehouse.value,
    reference: selected.reference,
    description: selected.description,
    quantity: quantity,
    notes: el.materialRequestNotes.value
  });
});

function openWarehouseZoneModal() {
  el.warehouseZoneForm.reset();
  el.warehouseZoneModal.classList.remove('hidden');
}

function closeWarehouseZoneModal() {
  el.warehouseZoneModal.classList.add('hidden');
}

el.warehouseZoneForm.addEventListener('submit', event => {
  event.preventDefault();

  postToBackend('warehouseZoneCreate', {
    warehouseId: state.selectedWarehouseId,
    zoneId: el.warehouseZoneId.value,
    name: el.warehouseZoneName.value,
    type: el.warehouseZoneType.value
  });
});

function handleWarehouseMutation(payload) {
  if (!payload?.ok) {
    if (!el.materialRequestModal.classList.contains('hidden')) {
      el.submitMaterialRequestBtn.disabled = !state.materialRequestSelection;
      setStatus(el.materialRequestStatus, payload?.message || 'No se ha podido enviar la solicitud.', 'error');
    } else {
      setStatus(el.warehouseStatus, payload?.message || 'No se ha podido guardar.', 'error');
    }
    return;
  }

  closeMaterialRequestModal();
  closeWarehouseZoneModal();

  setStatus(el.warehouseStatus, payload.message || 'Guardado correctamente.', 'success');

  postToBackend('warehouseBootstrap', {
    projectId: state.currentProject.id
  });
}

function setWarehouseTab(tabName) {
  document.querySelectorAll('.warehouse-tab').forEach(btn => {
    btn.classList.toggle(
      'active',
      btn.dataset.tab === tabName
    );
  });

  el.warehouseStockPanel.classList.toggle('hidden', tabName !== 'stock');
  el.warehouseRequestsPanel.classList.toggle('hidden', tabName !== 'requests');
  el.warehouseZonesPanel.classList.toggle('hidden', tabName !== 'zones');
}


/* LOGOUT / HELPERS */
function logout() {
  state.credential = null;
  state.bootstrap = null;
  state.currentProject = null;
  state.adminProjects = [];
  state.purchases = [];

  if (window.google?.accounts?.id) {
    google.accounts.id.disableAutoSelect();
  }

  el.topUser.classList.add('hidden');
  clearStatus(el.loginStatus);
  show(el.loginView);
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


// Start Google login before wiring the rest of the UI.
// This makes the login screen resilient to any later module-specific runtime error.

el.backFromDeliveriesBtn.addEventListener('click', () => show(el.projectView));

el.prevMonthBtn.addEventListener('click', () => {
  state.deliveryCalendarDate = new Date(
    state.deliveryCalendarDate.getFullYear(),
    state.deliveryCalendarDate.getMonth() - 1,
    1
  );
  renderDeliveryCalendar();
});

el.nextMonthBtn.addEventListener('click', () => {
  state.deliveryCalendarDate = new Date(
    state.deliveryCalendarDate.getFullYear(),
    state.deliveryCalendarDate.getMonth() + 1,
    1
  );
  renderDeliveryCalendar();
});

el.todayMonthBtn.addEventListener('click', () => {
  state.deliveryCalendarDate = new Date();
  renderDeliveryCalendar();
});

document.querySelectorAll('.delivery-filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.delivery-filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.deliveryFilter = button.dataset.filter;
    renderDeliveryList();
  });
});

el.newMilestoneBtn.addEventListener('click', () => openConstructionMilestoneModal());
el.closeConstructionMilestoneModalBtn.addEventListener('click', closeConstructionMilestoneModal);
el.cancelConstructionMilestoneBtn.addEventListener('click', closeConstructionMilestoneModal);
el.constructionMilestoneModal.querySelector('.modal-backdrop').addEventListener('click', closeConstructionMilestoneModal);
el.constructionMilestoneForm.addEventListener('submit', saveConstructionMilestone);
el.deleteConstructionMilestoneBtn.addEventListener('click', deleteConstructionMilestone);

el.closeDeliveryModalBtn.addEventListener('click', closeDeliveryModal);
el.deliveryModal.querySelector('.modal-backdrop').addEventListener('click', closeDeliveryModal);
el.deliveryMilestoneSelect.addEventListener('change', updateDeliveryMilestoneOffset);
el.saveDeliveryMilestoneBtn.addEventListener('click', saveDeliveryMilestone);
el.saveDeliveryDateBtn.addEventListener('click', saveDeliveryDate);
el.confirmDeliveryReceiptBtn.addEventListener('click', confirmDeliveryReceipt);


el.backFromWarehouseBtn.addEventListener('click', () => show(el.projectView));

el.warehouseSelect.addEventListener('change', () => {
  state.selectedWarehouseId = el.warehouseSelect.value;
  loadWarehouseData();
});

document.querySelectorAll('.warehouse-tab').forEach(button => {
  button.addEventListener('click', () => {
    setWarehouseTab(button.dataset.tab);
  });
});

el.newMaterialRequestBtn.addEventListener('click', openMaterialRequestModal);
el.closeMaterialRequestModalBtn.addEventListener('click', closeMaterialRequestModal);
el.cancelMaterialRequestBtn.addEventListener('click', closeMaterialRequestModal);
el.materialRequestModal.querySelector('.modal-backdrop')
  .addEventListener('click', closeMaterialRequestModal);

el.materialRequestSearch.addEventListener('input', renderMaterialRequestResults);
el.materialRequestZoneFilter.addEventListener('change', renderMaterialRequestResults);
el.clearMaterialRequestSelectionBtn.addEventListener('click', clearMaterialRequestSelection);
el.materialRequestWarehouse.addEventListener('change', () => {
  clearMaterialRequestSelection();

  const warehouseId = el.materialRequestWarehouse.value;
  if (warehouseId !== state.selectedWarehouseId) {
    state.selectedWarehouseId = warehouseId;
    el.warehouseSelect.value = warehouseId;
    setStatus(el.materialRequestStatus, 'Cargando stock del almacén…');
    loadWarehouseData();
  } else {
    refreshMaterialRequestFinder();
  }
});

el.materialRequestQuantity.addEventListener('input', () => {
  const selected = state.materialRequestSelection;
  if (!selected) return;

  const quantity = Number(el.materialRequestQuantity.value);
  if (Number.isFinite(quantity) && quantity > selected.available) {
    setStatus(
      el.materialRequestStatus,
      `Máximo disponible: ${selected.available} ${selected.unit || 'ud'}.`,
      'error'
    );
  } else {
    clearStatus(el.materialRequestStatus);
  }
});

el.newZoneBtn.addEventListener('click', openWarehouseZoneModal);
el.closeWarehouseZoneModalBtn.addEventListener('click', closeWarehouseZoneModal);
el.cancelWarehouseZoneBtn.addEventListener('click', closeWarehouseZoneModal);
el.warehouseZoneModal.querySelector('.modal-backdrop')
  .addEventListener('click', closeWarehouseZoneModal);

show(el.loginView);
initGoogleIdentity();


/* CONTROL DE TRABAJOS / MAQUINARIA EVENTS */
el.backFromWorkControlBtn.addEventListener('click', () => show(el.projectView));
el.workProjectScope.addEventListener('change', reloadWorkScope);
el.refreshWorkPresenceBtn.addEventListener('click', () => {
  setStatus(el.workControlStatus, 'Actualizando presencia…');
  postToBackend('workControlPresence', {
    project:state.workControl.selectedProject
  });
});
el.workPrevMonthBtn.addEventListener('click', () => {
  const wc = state.workControl;
  wc.currentMonth = new Date(wc.currentMonth.getFullYear(), wc.currentMonth.getMonth()-1, 1);
  postToBackend('workControlMonth', {
    project:wc.selectedProject,
    month:workMonthKey(wc.currentMonth)
  });
});
el.workNextMonthBtn.addEventListener('click', () => {
  const wc = state.workControl;
  wc.currentMonth = new Date(wc.currentMonth.getFullYear(), wc.currentMonth.getMonth()+1, 1);
  postToBackend('workControlMonth', {
    project:wc.selectedProject,
    month:workMonthKey(wc.currentMonth)
  });
});
el.workSubcontractorFilter.addEventListener('change', renderWorkParts);
el.workStateFilter.addEventListener('change', renderWorkParts);
el.closeWorkCorrectionModalBtn.addEventListener('click', closeWorkCorrection);
el.cancelWorkCorrectionBtn.addEventListener('click', closeWorkCorrection);
el.workIncidentCorrectionModal.querySelector('.modal-backdrop').addEventListener('click', closeWorkCorrection);
el.saveWorkCorrectionBtn.addEventListener('click', saveWorkCorrection);

el.backFromEquipmentGlobalBtn.addEventListener('click', () => show(el.projectView));
el.refreshEquipmentGlobalBtn.addEventListener('click', openEquipmentGlobal);
el.equipmentGlobalSearch.addEventListener('input', renderEquipmentGlobal);
el.equipmentGlobalProjectFilter.addEventListener('change', renderEquipmentGlobal);

/* EVENTS */
el.logoutBtn.addEventListener('click', logout);
el.backProjectsBtn.addEventListener('click', () => show(el.projectsView));
el.globalAdminBtn.addEventListener('click', openGlobalAdmin);
el.backFromGlobalAdminBtn.addEventListener('click', () => show(el.projectsView));
el.newProjectBtn.addEventListener('click', () => openProjectModal('create', null));
el.closeProjectModalBtn.addEventListener('click', closeProjectModal);
el.cancelProjectBtn.addEventListener('click', closeProjectModal);
el.projectModal.querySelector('.modal-backdrop').addEventListener('click', closeProjectModal);

el.backFromPurchasesBtn.addEventListener('click', () => show(el.projectView));
el.newPurchaseBtn.addEventListener('click', openPurchaseModal);
el.closePurchaseModalBtn.addEventListener('click', closePurchaseModal);
el.cancelPurchaseBtn.addEventListener('click', closePurchaseModal);
el.purchaseModal.querySelector('.modal-backdrop').addEventListener('click', closePurchaseModal);
el.addMaterialRowBtn.addEventListener('click', () => addMaterialRow());
el.purchaseDestination.addEventListener('change', applyDestinationSuggestion);
el.purchaseDestination.addEventListener('blur', applyDestinationSuggestion);

el.closeWorkflowModalBtn.addEventListener('click', closePurchaseWorkflow);
el.purchaseWorkflowModal
  .querySelector('.modal-backdrop')
  .addEventListener('click', closePurchaseWorkflow);
el.saveWorkflowBtn.addEventListener('click', savePurchaseWorkflow);

})();