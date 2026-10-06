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
  workPresencePeople: $('workPresencePeople'),
  workPresenceSubs: $('workPresenceSubs'),
  workPresenceProjectsCount: $('workPresenceProjectsCount'),
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
  equipmentUpdated: $('equipmentUpdated'),
  equipmentTypeFilter: $('equipmentTypeFilter'),
  equipmentMapCard: $('equipmentMapCard'),
  equipmentCampusMap: $('equipmentCampusMap'),
  equipmentSiteLayer: $('equipmentSiteLayer'),
  equipmentMarkerLayer: $('equipmentMarkerLayer'),
  equipmentDetailPop: $('equipmentDetailPop'),
  equipmentCleanMap: $('equipmentCleanMap'),
  equipmentFullscreen: $('equipmentFullscreen'),

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
      if (!el.workControlView.classList.contains('hidden')) {
        setStatus(el.workControlStatus, msg.payload?.message || 'Error de Control Horario.', 'error');
      }
      if (!el.equipmentGlobalView.classList.contains('hidden')) {
        setStatus(el.equipmentGlobalStatus, msg.payload?.message || 'Error de maquinaria.', 'error');
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
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
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
  el.workControlSubtitle.textContent = `${state.currentProject.name || state.currentProject.id} · Control de fichajes, partes e incidencias.`;
  show(el.workControlView);
  setStatus(el.workControlStatus, 'Cargando partes, incidencias y presencia…');
  postToBackend('workControlBootstrap', {project:wc.selectedProject,month:workMonthKey(wc.currentMonth),date:wc.selectedDate});
}

function handleWorkControlBootstrap(payload) {
  if (!payload?.ok) { setStatus(el.workControlStatus, payload?.message || 'No se ha podido cargar Control de trabajos.', 'error'); return; }
  const wc = state.workControl;
  wc.projects = Array.isArray(payload.projects) ? payload.projects : [];
  wc.selectedProject = payload.selectedProject || wc.selectedProject;
  wc.monthDays = payload.month?.days || [];
  wc.parts = payload.day?.parts || [];
  wc.incidents = payload.day?.incidents || [];
  wc.presence = Array.isArray(payload.presence) ? payload.presence : [];
  renderWorkProjectScope(); renderWorkPresence(); renderWorkCalendar(); renderWorkDay(); clearStatus(el.workControlStatus);
}

function renderWorkProjectScope() {
  const wc = state.workControl, projects = wc.projects || [];
  el.workProjectScope.innerHTML = '';
  if (projects.length > 1) {
    const o = document.createElement('option'); o.value='ALL'; o.textContent='Todos mis proyectos'; el.workProjectScope.appendChild(o);
  }
  projects.forEach(project => { const o=document.createElement('option'); o.value=project.id; o.textContent=`${project.id} · ${project.name || project.id}`; el.workProjectScope.appendChild(o); });
  if ([...el.workProjectScope.options].some(o=>o.value===wc.selectedProject)) el.workProjectScope.value=wc.selectedProject;
  else if (projects.length===1) { wc.selectedProject=projects[0].id; el.workProjectScope.value=projects[0].id; }
  else { wc.selectedProject='ALL'; el.workProjectScope.value='ALL'; }
  el.workProjectScope.disabled = projects.length <= 1;
  el.workScopeHint.textContent = projects.length <= 1 ? 'Solo tienes acceso a este proyecto.' : 'Puedes cambiar de proyecto o consultar todos.';
}

function reloadWorkScope() {
  const wc = state.workControl; wc.selectedProject = el.workProjectScope.value || 'ALL';
  setStatus(el.workControlStatus,'Actualizando ámbito…');
  postToBackend('workControlBootstrap',{project:wc.selectedProject,month:workMonthKey(wc.currentMonth),date:wc.selectedDate});
}

function renderWorkPresence() {
  const rows = state.workControl.presence || [];
  const subs = new Set(rows.map(r=>r.subcontractor).filter(Boolean));
  const projects = new Set(rows.map(r=>r.project).filter(Boolean));
  el.workPresencePeople.textContent = rows.length;
  el.workPresenceSubs.textContent = subs.size;
  el.workPresenceProjectsCount.textContent = projects.size;
  el.workPresenceUpdated.textContent = `Actualizado ${new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(new Date())}`;
  if (!rows.length) { el.workPresenceList.innerHTML='<div class="presence-empty">No hay fichajes de entrada abiertos en este momento.</div>'; return; }
  const grouped={}; rows.forEach(r=>{ (grouped[r.project] ||= {}); (grouped[r.project][r.subcontractor] ||= []).push(r); });
  el.workPresenceList.innerHTML = Object.keys(grouped).sort().map(project => {
    const subHtml = Object.keys(grouped[project]).sort().map(sub => {
      const workers=grouped[project][sub];
      return `<div class="presence-sub-row"><button type="button" class="presence-sub-head"><span class="presence-sub-name">${esc(sub)}</span><span class="presence-sub-count">${workers.length} persona${workers.length===1?'':'s'} · ver detalle ▾</span></button><div class="presence-workers">${workers.map(w=>`<div class="presence-worker"><div><div class="presence-worker-name">${esc(w.worker || w.email)}</div><div class="presence-worker-meta">${esc(w.email || '')}</div></div><div class="presence-entry">Entrada ${esc(w.entryTime || '')}</div></div>`).join('')}</div></div>`;
    }).join('');
    return `<div class="presence-project"><div class="presence-project-head"><span class="presence-project-name">${esc(project)}</span><span class="presence-project-count">${Object.values(grouped[project]).flat().length} en obra</span></div>${subHtml}</div>`;
  }).join('');
  el.workPresenceList.querySelectorAll('.presence-sub-head').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.presence-sub-row').classList.toggle('open')));
}

function renderWorkCalendar() {
  const wc=state.workControl;
  const year=wc.currentMonth.getFullYear(), month=wc.currentMonth.getMonth();
  const first=new Date(year,month,1), last=new Date(year,month+1,0);
  el.workCalendarTitle.textContent=new Intl.DateTimeFormat('es-ES',{month:'long',year:'numeric'}).format(first);
  const activity={}; (wc.monthDays||[]).forEach(d=>activity[d.date]=d);
  el.workCalendarGrid.innerHTML='';
  const startPad=(first.getDay()+6)%7;
  const prevLast=new Date(year,month,0).getDate();
  for(let i=startPad-1;i>=0;i--){ const b=document.createElement('button'); b.type='button'; b.className='day other'; b.textContent=prevLast-i; b.disabled=true; el.workCalendarGrid.appendChild(b); }
  for(let day=1;day<=last.getDate();day++){
    const d=new Date(year,month,day), key=workDateKey(d), info=activity[key]||{};
    const b=document.createElement('button'); b.type='button'; b.className='day';
    if(key===wc.selectedDate)b.classList.add('selected'); if(key===workDateKey(new Date()))b.classList.add('today');
    b.innerHTML=`${day}${Number(info.incidents||0)?'<span class="incident-calendar-mark"></span>':''}${Number(info.count||0)?'<span class="dot"></span>':''}${Number(info.pending||0)?`<span class="pending-dot">${Number(info.pending)}</span>`:''}`;
    b.addEventListener('click',()=>{wc.selectedDate=key; renderWorkCalendar(); setStatus(el.workControlStatus,'Cargando día…'); postToBackend('workControlDay',{project:wc.selectedProject,date:key});});
    el.workCalendarGrid.appendChild(b);
  }
  const totalCells=startPad+last.getDate(), tail=(7-(totalCells%7))%7;
  for(let i=1;i<=tail;i++){ const b=document.createElement('button'); b.type='button'; b.className='day other'; b.textContent=i; b.disabled=true; el.workCalendarGrid.appendChild(b); }
}

function handleWorkControlMonth(payload){ if(!payload?.ok){setStatus(el.workControlStatus,payload?.message||'No se pudo cargar el mes.','error');return;} state.workControl.monthDays=payload.days||[]; renderWorkCalendar(); clearStatus(el.workControlStatus); }
function handleWorkControlDay(payload){ if(!payload?.ok){setStatus(el.workControlStatus,payload?.message||'No se pudo cargar el día.','error');return;} state.workControl.parts=payload.parts||[]; state.workControl.incidents=payload.incidents||[]; renderWorkDay(); clearStatus(el.workControlStatus); }
function handleWorkControlPresence(payload){ if(!payload?.ok){setStatus(el.workControlStatus,payload?.message||'No se pudo actualizar la presencia.','error');return;} state.workControl.presence=payload.presence||[]; renderWorkPresence(); clearStatus(el.workControlStatus); }

function workStatusLabel(status){return({PENDIENTE:'Pendiente',VALIDADO:'Validado',REVISAR:'Revisar',RECHAZADO:'Rechazado'})[status]||status||'Pendiente';}

function renderWorkDay(){
  const wc=state.workControl, parts=wc.parts||[], incidents=wc.incidents||[];
  const date=new Date(`${wc.selectedDate}T12:00:00`);
  el.workSelectedDateLabel.textContent=new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);
  const workers=new Set(parts.map(p=>p.email||p.worker).filter(Boolean));
  el.workWorkersSummary.textContent=`${workers.size} trabajador${workers.size===1?'':'es'}`;
  el.workTasksSummary.textContent=`${parts.length} tarea${parts.length===1?'':'s'}`;
  const pending=parts.filter(p=>p.status==='PENDIENTE').length;
  el.workPendingSummary.textContent=`${pending} pendiente${pending===1?'':'s'}`;
  el.workIncidentsSummary.textContent=`${incidents.length} incidencia${incidents.length===1?'':'s'}`;
  const subs=[...new Set(parts.map(p=>p.subcontractor).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  const current=el.workSubcontractorFilter.value;
  el.workSubcontractorFilter.innerHTML='<option value="">Todas</option>'+subs.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
  if(subs.includes(current))el.workSubcontractorFilter.value=current;
  renderWorkIncidents(); renderWorkParts();
}

function renderWorkIncidents(){
  const incidents=state.workControl.incidents||[];
  el.workIncidentPendingCount.textContent=incidents.filter(i=>['PENDIENTE','REVISAR'].includes(i.status)).length;
  if(!incidents.length){el.workIncidentsContainer.className='incidents-empty';el.workIncidentsContainer.innerHTML='No hay incidencias para este día.';return;}
  el.workIncidentsContainer.className=''; el.workIncidentsContainer.innerHTML='';
  incidents.forEach(incident=>{
    const card=document.createElement('div'); card.className='incident-admin-card';
    card.innerHTML=`<div class="incident-admin-top"><div><div class="incident-admin-name">${esc(incident.type||'INCIDENCIA')}</div><div class="incident-admin-meta">${esc(incident.worker||incident.email)} · ${esc(incident.project||'')} · ${esc(incident.subcontractor||'')}${incident.approxTime?' · '+esc(incident.approxTime):''}</div></div><span class="incident-status incident-status-${esc(incident.status||'PENDIENTE')}">${esc(incident.status||'PENDIENTE')}</span></div><div class="incident-admin-desc">${esc(incident.description||'Sin descripción')}</div><div class="incident-admin-actions">${!['RESUELTA','RECHAZADA'].includes(incident.status)?'<button type="button" class="incident-resolve-btn correct">CORREGIR</button><button type="button" class="incident-review-btn review">REVISAR</button><button type="button" class="incident-reject-btn discard">DESCARTAR</button>':''}</div>`;
    card.querySelector('.correct')?.addEventListener('click',()=>openWorkCorrection(incident));
    card.querySelector('.review')?.addEventListener('click',()=>{const r=window.prompt('Observación para dejar la incidencia en REVISAR:');if(r)postToBackend('workControlIncidentUpdate',{incidentRowNumber:incident.rowNumber,incidentStatus:'REVISAR',incidentResolution:r});});
    card.querySelector('.discard')?.addEventListener('click',()=>{if(window.confirm('¿Descartar esta incidencia?'))postToBackend('workControlIncidentDiscard',{incidentRowNumber:incident.rowNumber});});
    el.workIncidentsContainer.appendChild(card);
  });
}

function filteredWorkParts(){const sub=el.workSubcontractorFilter.value,stateFilter=el.workStateFilter.value;return(state.workControl.parts||[]).filter(p=>(!sub||p.subcontractor===sub)&&(!stateFilter||p.status===stateFilter));}
function renderWorkParts(){
  const parts=filteredWorkParts(); if(!parts.length){el.workPartsContainer.innerHTML='<div class="empty-state">No hay partes que coincidan con los filtros.</div>';return;}
  const groups={}; parts.forEach(p=>{const k=`${p.project}|${p.subcontractor}|${p.worker}`;(groups[k]||=[]).push(p);});
  el.workPartsContainer.innerHTML='';
  Object.values(groups).forEach(rows=>{
    const first=rows[0], pendingRows=rows.filter(r=>r.status==='PENDIENTE').map(r=>r.rowNumber);
    const block=document.createElement('section');block.className='work-part-group';
    block.innerHTML=`<div class="work-part-group-head"><div><strong>${esc(first.worker||first.email)}</strong><span>${esc(first.project||'')} · ${esc(first.subcontractor||'')}</span></div>${pendingRows.length?`<button class="btn btn-secondary btn-sm validate-group-btn" type="button">Validar pendientes (${pendingRows.length})</button>`:''}</div><div class="work-part-list"></div>`;
    block.querySelector('.validate-group-btn')?.addEventListener('click',()=>{if(window.confirm(`¿Validar ${pendingRows.length} tarea(s) pendientes?`))postToBackend('workControlBulkValidate',{rowNumbers:pendingRows});});
    const list=block.querySelector('.work-part-list');
    rows.forEach(part=>{const item=document.createElement('article');item.className='work-part-card';item.innerHTML=`<div class="work-part-main"><div class="work-part-title">${esc(part.task||'Tarea')}</div><div class="work-part-meta">${esc(part.entryTime||'')}${part.exitTime?'–'+esc(part.exitTime):''}${part.hours?' · '+esc(part.hours):''}${part.zone?' · '+esc(part.zone):''}</div>${part.description?`<p>${esc(part.description)}</p>`:''}${part.observation?`<small>Obs.: ${esc(part.observation)}</small>`:''}</div><div class="work-part-side"><span class="work-status-badge ${String(part.status||'').toLowerCase()}">${esc(workStatusLabel(part.status))}</span><div class="work-part-actions"><button class="mini-action validate" type="button">Validar</button><button class="mini-action review" type="button">Revisar</button><button class="mini-action reject" type="button">Rechazar</button></div></div>`;
      item.querySelector('.validate').addEventListener('click',()=>postToBackend('workControlUpdate',{rowNumber:part.rowNumber,status:'VALIDADO',observation:''}));
      item.querySelector('.review').addEventListener('click',()=>{const o=window.prompt('Observación para REVISAR:');if(o)postToBackend('workControlUpdate',{rowNumber:part.rowNumber,status:'REVISAR',observation:o});});
      item.querySelector('.reject').addEventListener('click',()=>{const o=window.prompt('Motivo de RECHAZO:');if(o)postToBackend('workControlUpdate',{rowNumber:part.rowNumber,status:'RECHAZADO',observation:o});});
      list.appendChild(item);});
    el.workPartsContainer.appendChild(block);
  });
}

function handleWorkControlMutation(payload){if(!payload?.ok){setStatus(el.workControlStatus,payload?.message||'No se ha podido guardar el cambio.','error');return;}closeWorkCorrection();setStatus(el.workControlStatus,'Cambio guardado.','success');postToBackend('workControlDay',{project:state.workControl.selectedProject,date:state.workControl.selectedDate});setTimeout(()=>postToBackend('workControlMonth',{project:state.workControl.selectedProject,month:workMonthKey(state.workControl.currentMonth)}),300);}

function openWorkCorrection(incident){
  state.workControl.correctionIncident=incident;const correction=incident.correction||{},mode=correction.mode||'MANUAL';
  el.workCorrectionIncidentText.textContent=`${incident.worker||incident.email} · ${incident.project||''} · ${incident.description||''}`;
  let html='';
  if(mode==='PROJECT')html=`<label><span>Bloque a corregir</span><select id="wcBlock">${(correction.blocks||[]).map(b=>`<option value="${esc(b.id)}">${esc(b.project)} · ${esc(b.entryTime)}${b.exitTime?'–'+esc(b.exitTime):' · abierta'}</option>`).join('')}</select></label><label><span>Proyecto correcto</span><select id="wcProject">${(correction.projects||[]).map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></label>`;
  else if(mode==='EXIT')html=`<label><span>Entrada abierta</span><select id="wcBlock">${(correction.blocks||[]).map(b=>`<option value="${esc(b.id)}">${esc(b.project)} · entrada ${esc(b.entryTime)}</option>`).join('')}</select></label><label><span>Hora de salida</span><input id="wcExitTime" type="time"></label>`;
  else if(mode==='ENTRY')html=`<label><span>Proyecto</span><select id="wcProject">${(correction.projects||[]).map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></label><label><span>Hora de entrada</span><input id="wcEntryTime" type="time"></label><label><span>Hora de salida</span><input id="wcExitTime" type="time"></label>`;
  else html='<div class="empty-state">Este tipo de incidencia requiere revisión manual.</div>';
  el.workCorrectionFields.innerHTML=html;el.saveWorkCorrectionBtn.classList.toggle('hidden',mode==='MANUAL');el.workIncidentCorrectionModal.classList.remove('hidden');
}
function closeWorkCorrection(){el.workIncidentCorrectionModal.classList.add('hidden');state.workControl.correctionIncident=null;el.workCorrectionFields.innerHTML='';}
function saveWorkCorrection(){const i=state.workControl.correctionIncident;if(!i)return;postToBackend('workControlIncidentCorrect',{incidentRowNumber:i.rowNumber,correctionBlockId:document.getElementById('wcBlock')?.value||'',correctionProject:document.getElementById('wcProject')?.value||'',correctionEntryTime:document.getElementById('wcEntryTime')?.value||'',correctionExitTime:document.getElementById('wcExitTime')?.value||''});}

/* MAQUINARIA · BETA 3 INTEGRADA */
const EQUIPMENT_GEOREF = {
  imageWidth:4963,
  imageHeight:3509,
  originE:710000.0,
  originN:4665500.0,
  // Robust global affine fallback. P10 is excluded from calibration because it
  // behaves as a clear outlier against the rest of the control network.
  px:{a:2.54696676,b:-3.23890439,c:2090.78949737},
  py:{a:-3.24378133,b:-2.55343643,c:3015.05760}
};

// Exact control correspondences on the current 4963 x 3509 campus raster.
// They allow a piecewise-affine transform: each point inside the calibrated
// campus is resolved by barycentric interpolation in its local triangle.
const EQUIPMENT_CONTROL_POINTS = {
  1:{e:710177.486,n:4666154.421,x:421.75,y:769.64},
  2:{e:710244.400,n:4666013.365,x:1058.16,y:917.28},
  3:{e:710660.219,n:4665487.225,x:3809.22,y:917.17},
  4:{e:710478.441,n:4665346.198,x:3808.97,y:1855.59},
  5:{e:710638.440,n:4665304.345,x:4353.76,y:1446.58},
  6:{e:710504.199,n:4665194.668,x:4369.94,y:2163.06},
  7:{e:710216.812,n:4665597.285,x:2324.73,y:2064.63},
  8:{e:710062.441,n:4665869.793,x:1054.60,y:1864.69},
  9:{e:710189.556,n:4666206.790,x:281.70,y:593.61},
  11:{e:709927.119,n:4665632.970,x:1472.0,y:2913.0},
  12:{e:709982.573,n:4665559.198,x:1852.05,y:2914.13},
  13:{e:710088.571,n:4665509.434,x:2282.05,y:2705.63},
  14:{e:710089.486,n:4665219.003,x:3227.90,y:3440.05},
  15:{e:710197.247,n:4665219.004,x:3500.31,y:3095.19},
  16:{e:710197.382,n:4665371.269,x:3020.0,y:2703.0},
  17:{e:710378.684,n:4665368.012,x:3486.53,y:2124.18},
  18:{e:710419.712,n:4665052.468,x:4605.67,y:2798.03},
  19:{e:710774.007,n:4665412.580,x:4339.65,y:710.01}
};

const EQUIPMENT_TRIANGLES = [
  [8,9,11],[7,8,11],[2,8,7],[3,2,7],[9,3,19],[2,3,9],[8,1,9],[1,2,9],[2,1,8],
  [5,18,19],[3,5,19],[5,3,4],[15,14,18],[14,12,11],[13,12,14],[12,7,11],[12,13,7],
  [5,6,18],[6,5,4],[6,15,18],[16,13,14],[15,16,14],[13,16,7],[16,17,7],[17,3,7],
  [3,17,4],[17,16,15],[17,6,4],[6,17,15]
];

const EQUIPMENT_SITE_LABELS = [
  {name:'ZAZ121',x:34.4,y:30.0},{name:'ZAZ111',x:34.4,y:49.3},
  {name:'ZAZ081',x:64.0,y:30.0},{name:'ZAZ101',x:64.0,y:49.3},
  {name:'ZAZ091',x:86.0,y:51.5},{name:'AWB',x:45.0,y:60.7},{name:'ACB',x:85.3,y:81.8}
];

window.addEventListener('load', () => {
  document.getElementById('backendForm').action = BACKEND_WEBAPP_URL;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: true,
    cancel_on_tap_outside: false
  });

  google.accounts.id.renderButton(
    document.getElementById('googleButton'),
    {
      theme:'outline',
      size:'large',
      text:'continue_with',
      width:320
    }
  );

  google.accounts.id.prompt();

  document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
  document.getElementById('projectFilter').addEventListener('change', renderParts);
  document.getElementById('subFilter').addEventListener('change', renderParts);
  document.getElementById('stateFilter').addEventListener('change', () => {
    if (document.getElementById('stateFilter').value) {
      incidentsOnly = false;
      document.getElementById('incidentsToggle').classList.remove('active');
    }
    renderParts();
  });

  document.getElementById('incidentsToggle').addEventListener('click', () => {
    incidentsOnly = !incidentsOnly;

    const btn = document.getElementById('incidentsToggle');
    btn.classList.toggle('active', incidentsOnly);

    if (incidentsOnly) {
      // El filtro rápido manda sobre el selector de estado.
      document.getElementById('stateFilter').value = '';
    }

    renderParts();
  });

  document.getElementById('workTab').addEventListener('click', () => switchModule('work'));
  document.getElementById('equipmentTab').addEventListener('click', () => switchModule('equipment'));
  document.getElementById('equipmentRefresh').addEventListener('click', loadEquipmentLocations);
  document.getElementById('equipmentProjectFilter').addEventListener('change', renderEquipmentModule);
  document.getElementById('equipmentTypeFilter').addEventListener('change', renderEquipmentModule);
  document.getElementById('equipmentCleanMap').addEventListener('click', toggleEquipmentCleanMap);
  document.getElementById('equipmentFullscreen').addEventListener('click', toggleEquipmentFullscreen);
  document.getElementById('presenceRefresh').addEventListener('click', loadPresence);
  document.getElementById('presenceProjects').addEventListener('click', handlePresenceClick);
  document.getElementById('equipmentDetailPop').addEventListener('click', event => {
    if (event.target && event.target.id === 'equipmentDetailClose') closeEquipmentDetail();
  });
  renderEquipmentSiteLabels();
});

function handleCredentialResponse(response) {
  if (!response || !response.credential) {
    showStatus('No se pudo obtener la identidad de Google.', 'err');
    return;
  }

  googleCredential = response.credential;
  showStatus('Validando acceso…', 'info');
  postToBackend({
    action:'adminBootstrap',
    credential:googleCredential
  });
}

function postToBackend(data, context = null) {
  requestContext = context;

  ['action','credential','month','date','rowNumber','status','observation','rowNumbersJson',
   'incidentRowNumber','incidentStatus','incidentResolution',
   'correctionBlockId','correctionProject','correctionEntryTime','correctionExitTime']
    .forEach(k => {
      const el = document.getElementById('f_' + k);
      if (el) el.value = '';
    });

  Object.entries(data).forEach(([k,v]) => {
    const el = document.getElementById('f_' + k);
    if (el) el.value = v == null ? '' : String(v);
  });

  document.getElementById('backendForm').submit();
}

window.addEventListener('message', event => {
  if (
    event.origin !== 'https://script.google.com' &&
    !event.origin.endsWith('.googleusercontent.com')
  ) return;

  const data = event.data || {};
  if (data.source !== 'LEVITEC_BACKEND') return;

  if (!data.ok) {
    showStatus(data.message || 'Se ha producido un error.', 'err');

    // Si una actualización optimista falla, recargamos el día
    // para devolver la interfaz al estado real guardado en Sheets.
    if (
      data.type === 'adminUpdate' ||
      data.type === 'adminBulkValidate' ||
      data.type === 'adminIncidentUpdate' ||
      data.type === 'adminIncidentCorrect' ||
      data.type === 'adminIncidentDiscard'
    ) {
      setTimeout(() => loadDay(selectedDate), 700);
    }

    return;
  }

  if (data.type === 'adminBootstrap') {
    manager = data;
    document.getElementById('managerName').textContent = data.name;
    document.getElementById('managerEmail').textContent = data.email;
    document.getElementById('managerRole').textContent = data.role;
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    hideStatus();

    loadMonth();
    loadDay(selectedDate);
    loadPresence();
    return;
  }

  if (data.type === 'adminMonth') {
    monthActivity = {};
    (data.days || []).forEach(d => monthActivity[d.date] = d);
    renderCalendar();
    return;
  }

  if (data.type === 'adminDay') {
    currentParts = Array.isArray(data.parts) ? data.parts : [];
    currentIncidents = Array.isArray(data.incidents) ? data.incidents : [];
    populateFilters();
    updateSummary();
    renderIncidents();
    renderParts();
    hideStatus();
    return;
  }

  if (data.type === 'adminPresence') {
    presenceLoaded = true;
    currentPresence = Array.isArray(data.presence) ? data.presence : [];
    const updated = document.getElementById('presenceUpdated');
    if (updated) {
      updated.textContent = 'Actualizado: ' + new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'});
    }
    renderPresence();
    hideStatus();
    return;
  }

  if (data.type === 'equipmentLocations') {
    equipmentLoaded = true;
    currentEquipment = Array.isArray(data.locations) ? data.locations : [];

    if (!data.configured) {
      document.getElementById('equipmentUpdated').textContent = data.message || 'Módulo pendiente de configurar.';
    } else {
      document.getElementById('equipmentUpdated').textContent =
        'Última consulta: ' + new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'});
    }

    populateEquipmentFilters();
    renderEquipmentModule();
    hideStatus();
    return;
  }

  if (data.type === 'adminUpdate') {
    const part = currentParts.find(
      p => Number(p.rowNumber) === Number(data.rowNumber)
    );

    if (part) {
      part.status = data.status;
      part.validatedBy = data.validatedBy || '';
      part.observation = data.observation || '';
      part._saving = false;
    }

    showStatus('Tarea guardada correctamente.', 'ok');

    // El cambio visual ya se hizo al pulsar.
    // Solo refrescamos los indicadores del calendario.
    updateSummary();
    loadMonth();
    return;
  }

  if (data.type === 'adminBulkValidate') {
    showStatus(
      (data.updated || 0) + ' tarea(s) pendiente(s) validadas.',
      'ok'
    );

    currentParts.forEach(p => p._saving = false);
    updateSummary();
    loadMonth();
    return;
  }

  if (
    data.type === 'adminIncidentCorrect' ||
    data.type === 'adminIncidentDiscard'
  ) {
    const incident = currentIncidents.find(
      i => Number(i.rowNumber) === Number(data.rowNumber)
    );

    if (incident) {
      incident.status = data.status;
      incident.resolvedBy = data.resolvedBy || '';
      incident.resolution = data.resolution || '';
      incident.resolutionDate = data.resolutionDate || '';
      incident._saving = false;
    }

    renderIncidents();
    updateSummary();
    loadMonth();

    showStatus(
      data.type === 'adminIncidentCorrect'
        ? 'Incidencia corregida y cerrada.'
        : 'Incidencia descartada.',
      'ok'
    );
    return;
  }

  if (data.type === 'adminIncidentUpdate') {
    const incident = currentIncidents.find(
      i => Number(i.rowNumber) === Number(data.rowNumber)
    );

    if (incident) {
      incident.status = data.status;
      incident.resolvedBy = data.resolvedBy || '';
      incident.resolution = data.resolution || '';
      incident.resolutionDate = data.resolutionDate || '';
      incident._saving = false;
    }

    renderIncidents();
    updateSummary();
    loadMonth();

    showStatus('Incidencia actualizada correctamente.', 'ok');
    return;
  }
});

function loadMonth() {
  if (!googleCredential) return;
  postToBackend({
    action:'adminMonth',
    credential:googleCredential,
    month:monthKey(currentMonth)
  });
}

function loadDay(key) {
  if (!googleCredential || !key) return;
  selectedDate = key;
  updateSelectedDateLabel();
  renderCalendar();
  showStatus('Cargando trabajos del día…', 'info');

  postToBackend({
    action:'adminDay',
    credential:googleCredential,
    date:key
  });
}

function changeMonth(delta) {
  currentMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + delta,
    1
  );

  loadMonth();
  renderCalendar();
}

function renderCalendar() {
  const title = new Intl.DateTimeFormat('es-ES', {
    month:'long',
    year:'numeric'
  }).format(currentMonth);

  document.getElementById('calendarTitle').textContent = title;

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startOffset);

  const today = dateKey(new Date());

  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const key = dateKey(d);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day';
    btn.textContent = d.getDate();

    if (d.getMonth() !== month) btn.classList.add('other');
    if (key === selectedDate) btn.classList.add('selected');
    if (key === today) btn.classList.add('today');

    const activity = monthActivity[key];

    if (activity && activity.count > 0) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      btn.appendChild(dot);

      if (activity.pending > 0) {
        const badge = document.createElement('span');
        badge.className = 'pending-dot';
        badge.textContent = activity.pending > 9 ? '9+' : activity.pending;
        btn.appendChild(badge);
      }
    }

    if (activity && activity.incidents > 0) {
      const incidentMark = document.createElement('span');
      incidentMark.className = 'incident-calendar-mark';
      btn.appendChild(incidentMark);
    }

    btn.addEventListener('click', () => {
      if (d.getMonth() !== currentMonth.getMonth() || d.getFullYear() !== currentMonth.getFullYear()) {
        currentMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        loadMonth();
      }
      loadDay(key);
    });

    grid.appendChild(btn);
  }
}

function populateFilters() {
  const project = document.getElementById('projectFilter');
  const sub = document.getElementById('subFilter');

  const oldProject = project.value;
  const oldSub = sub.value;

  const projects = uniqueSorted(currentParts.map(p => p.project));
  const subs = uniqueSorted(currentParts.map(p => p.subcontractor));

  project.innerHTML = '<option value="">Todos</option>' +
    projects.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  sub.innerHTML = '<option value="">Todas</option>' +
    subs.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  if (projects.includes(oldProject)) project.value = oldProject;
  if (subs.includes(oldSub)) sub.value = oldSub;
}

function updateSummary() {
  const workers = new Set(currentParts.map(p => p.email || p.worker)).size;
  const tasks = currentParts.length;
  const pending = currentParts.filter(p => p.status === 'PENDIENTE').length;
  const review = currentParts.filter(p => p.status === 'REVISAR').length;
  const rejected = currentParts.filter(p => p.status === 'RECHAZADO').length;

  const incidentPending =
    currentIncidents.filter(i => i.status === 'PENDIENTE').length;

  document.getElementById('incidentsSummary').textContent =
    currentIncidents.length +
    (currentIncidents.length === 1 ? ' incidencia' : ' incidencias');

  document.getElementById('incidentPendingCount').textContent =
    incidentPending > 99 ? '99+' : String(incidentPending);

  document.getElementById('workersSummary').textContent =
    workers + (workers === 1 ? ' trabajador' : ' trabajadores');

  document.getElementById('tasksSummary').textContent =
    tasks + (tasks === 1 ? ' tarea' : ' tareas');

  document.getElementById('pendingSummary').textContent =
    pending + ' pendientes · ' + review + ' revisar · ' + rejected + ' rechazadas';
}


function renderIncidents() {
  const container =
    document.getElementById('incidentsContainer');

  if (!currentIncidents.length) {
    container.className = 'incidents-empty';
    container.innerHTML = 'No hay incidencias para este día.';
    return;
  }

  container.className = '';
  container.innerHTML = '';

  const order = {
    PENDIENTE:0,
    REVISAR:1,
    RECHAZADA:2,
    RESUELTA:3
  };

  [...currentIncidents]
    .sort((a,b) =>
      (order[a.status] ?? 9) - (order[b.status] ?? 9)
    )
    .forEach(incident => {
      container.appendChild(
        renderIncidentCard(incident)
      );
    });
}


function renderIncidentCard(incident) {
  const el = document.createElement('div');
  el.className = 'incident-admin-card';

  const typeLabel = incidentTypeLabel(incident.type);
  const meta = [
    incident.worker || incident.email,
    incident.subcontractor,
    incident.project || 'Sin proyecto',
    incident.approxTime ? 'Hora aprox. ' + incident.approxTime : ''
  ].filter(Boolean).join(' · ');

  const existingResolution = incident.resolution
    ? `
      <div class="incident-resolution-existing">
        <strong>Resolución:</strong>
        ${escapeHtml(incident.resolution)}
        ${incident.resolvedBy ? `<br><span>${escapeHtml(incident.resolvedBy)}</span>` : ''}
      </div>
    `
    : '';

  const correction = incident.correction || {mode:'MANUAL', projects:[], blocks:[]};
  const canQuickCorrect = ['PROJECT','EXIT','ENTRY'].includes(correction.mode) && incident.status !== 'RESUELTA';
  const isClosed = ['RESUELTA','RECHAZADA'].includes(incident.status);

  el.innerHTML = `
    <div class="incident-admin-top">
      <div>
        <div class="incident-admin-name">${escapeHtml(typeLabel)}</div>
        <div class="incident-admin-meta">${escapeHtml(meta)}</div>
      </div>
      <span class="incident-status incident-status-${incident.status}">${escapeHtml(incident.status)}</span>
    </div>

    <div class="incident-admin-desc">${escapeHtml(incident.description || 'Sin descripción')}</div>
    ${existingResolution}

    ${!isClosed ? `
      <div class="incident-admin-actions">
        ${canQuickCorrect ? '<button type="button" class="incident-resolve-btn quick-open">CORREGIR</button>' : '<button type="button" class="incident-review-btn manual-open">REVISAR</button>'}
        <button type="button" class="incident-reject-btn quick-discard">DESCARTAR</button>
      </div>
    ` : ''}

    <div class="quick-correction"></div>

    <div class="incident-editor">
      <label>Observación</label>
      <textarea maxlength="700" placeholder="Añade una breve observación."></textarea>
      <div class="incident-editor-actions">
        <button type="button" class="incident-cancel-admin">CANCELAR</button>
        <button type="button" class="incident-save-admin">GUARDAR</button>
      </div>
    </div>
  `;

  const quickOpen = el.querySelector('.quick-open');
  if (quickOpen) {
    quickOpen.addEventListener('click', () => {
      openQuickCorrection(el, incident);
    });
  }

  const discard = el.querySelector('.quick-discard');
  if (discard) {
    discard.addEventListener('click', () => {
      if (!confirm('¿Descartar esta incidencia?')) return;
      discardIncident(incident);
    });
  }

  const manual = el.querySelector('.manual-open');
  if (manual) {
    manual.addEventListener('click', () => {
      openIncidentEditor(el, incident, 'REVISAR');
    });
  }

  const cancelAdmin = el.querySelector('.incident-cancel-admin');
  if (cancelAdmin) {
    cancelAdmin.addEventListener('click', () => {
      el.querySelector('.incident-editor').classList.remove('open');
    });
  }

  return el;
}


function openQuickCorrection(el, incident) {
  const box = el.querySelector('.quick-correction');
  const c = incident.correction || {};
  box.innerHTML = '';

  if (c.mode === 'PROJECT') {
    const blocks = Array.isArray(c.blocks) ? c.blocks : [];
    const projects = Array.isArray(c.projects) ? c.projects : [];

    if (!blocks.length) {
      showStatus('No se ha encontrado ningún bloque para corregir.', 'err');
      return;
    }

    box.innerHTML = `
      <div class="quick-correction-row">
        <div>
          <label>Bloque a corregir</label>
          <select class="qc-block">
            ${blocks.map(b => `<option value="${escapeHtml(b.id)}">${escapeHtml(b.project)} · ${escapeHtml(b.entryTime)}${b.exitTime ? '–' + escapeHtml(b.exitTime) : ' · abierta'}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Proyecto correcto</label>
          <select class="qc-project">
            ${projects.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="quick-correction-actions">
        <button type="button" class="quick-cancel">CANCELAR</button>
        <button type="button" class="quick-save">CORREGIR</button>
      </div>
    `;

    const first = blocks[0];
    const projectSelect = box.querySelector('.qc-project');
    const alternative = projects.find(p => p !== first.project);
    if (alternative) projectSelect.value = alternative;
  }

  if (c.mode === 'EXIT') {
    const blocks = Array.isArray(c.blocks) ? c.blocks : [];

    if (!blocks.length) {
      showStatus('No se ha encontrado ninguna entrada abierta para este trabajador.', 'err');
      return;
    }

    box.innerHTML = `
      <div class="quick-correction-row">
        <div>
          <label>Entrada abierta</label>
          <select class="qc-block">
            ${blocks.map(b => `<option value="${escapeHtml(b.id)}">${escapeHtml(b.project)} · ${escapeHtml(b.entryTime)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Hora de salida</label>
          <input class="qc-exit" type="time" value="${escapeHtml(incident.approxTime || '')}">
        </div>
      </div>
      <div class="quick-correction-actions">
        <button type="button" class="quick-cancel">CANCELAR</button>
        <button type="button" class="quick-save">CORREGIR</button>
      </div>
    `;
  }

  if (c.mode === 'ENTRY') {
    const projects = Array.isArray(c.projects) ? c.projects : [];

    box.innerHTML = `
      <div class="quick-correction-row">
        <div>
          <label>Proyecto</label>
          <select class="qc-project">
            ${projects.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Hora de entrada</label>
          <input class="qc-entry" type="time" value="${escapeHtml(incident.approxTime || '')}">
        </div>
      </div>
      <div class="quick-correction-row">
        <div>
          <label>Hora de salida</label>
          <input class="qc-exit" type="time">
        </div>
        <div></div>
      </div>
      <div class="quick-correction-actions">
        <button type="button" class="quick-cancel">CANCELAR</button>
        <button type="button" class="quick-save">CORREGIR</button>
      </div>
    `;

    if (incident.project && projects.includes(incident.project)) {
      box.querySelector('.qc-project').value = incident.project;
    }
  }

  box.classList.add('open');

  box.querySelector('.quick-cancel').onclick = () => {
    box.classList.remove('open');
  };

  box.querySelector('.quick-save').onclick = () => {
    sendQuickCorrection(box, incident);
  };
}


function sendQuickCorrection(box, incident) {
  if (incident._saving) return;

  const payload = {
    action:'adminIncidentCorrect',
    credential:googleCredential,
    incidentRowNumber:incident.rowNumber,
    correctionBlockId:'',
    correctionProject:'',
    correctionEntryTime:'',
    correctionExitTime:''
  };

  const block = box.querySelector('.qc-block');
  const project = box.querySelector('.qc-project');
  const entry = box.querySelector('.qc-entry');
  const exit = box.querySelector('.qc-exit');

  if (block) payload.correctionBlockId = block.value;
  if (project) payload.correctionProject = project.value;
  if (entry) payload.correctionEntryTime = entry.value;
  if (exit) payload.correctionExitTime = exit.value;

  if (incident.correction.mode === 'PROJECT' && (!payload.correctionBlockId || !payload.correctionProject)) {
    showStatus('Selecciona el bloque y el proyecto correcto.', 'err');
    return;
  }

  if (incident.correction.mode === 'EXIT' && (!payload.correctionBlockId || !payload.correctionExitTime)) {
    showStatus('Selecciona la entrada e indica la hora de salida.', 'err');
    return;
  }

  if (incident.correction.mode === 'ENTRY' && (!payload.correctionProject || !payload.correctionEntryTime || !payload.correctionExitTime)) {
    showStatus('Indica proyecto, entrada y salida.', 'err');
    return;
  }

  incident._saving = true;
  showStatus('Aplicando corrección…', 'info');
  postToBackend(payload);
}


function discardIncident(incident) {
  if (incident._saving) return;
  incident._saving = true;
  showStatus('Descartando incidencia…', 'info');

  postToBackend({
    action:'adminIncidentDiscard',
    credential:googleCredential,
    incidentRowNumber:incident.rowNumber
  });
}


function openIncidentEditor(
  el,
  incident,
  status
) {
  const editor =
    el.querySelector('.incident-editor');

  const textarea =
    editor.querySelector('textarea');

  const save =
    editor.querySelector('.incident-save-admin');

  textarea.value =
    incident.resolution || '';

  editor.classList.add('open');
  textarea.focus();

  save.onclick = () => {
    const resolution =
      textarea.value.trim();

    if (!resolution) {
      showStatus(
        'Debes indicar una observación o resolución.',
        'err'
      );
      return;
    }

    updateIncident(
      incident.rowNumber,
      status,
      resolution
    );
  };
}


function updateIncident(
  rowNumber,
  status,
  resolution
) {
  const incident =
    currentIncidents.find(
      i => Number(i.rowNumber) === Number(rowNumber)
    );

  if (!incident || incident._saving) return;

  incident.status = status;
  incident.resolution = resolution;
  incident.resolvedBy =
    manager && manager.email
      ? manager.email
      : '';
  incident._saving = true;

  renderIncidents();
  updateSummary();

  showStatus(
    'Guardando incidencia…',
    'info'
  );

  postToBackend({
    action:'adminIncidentUpdate',
    credential:googleCredential,
    incidentRowNumber:rowNumber,
    incidentStatus:status,
    incidentResolution:resolution
  });
}


function incidentTypeLabel(type) {
  const labels = {
    OLVIDO_ENTRADA:'Olvido de ENTRADA',
    OLVIDO_SALIDA:'Olvido de SALIDA',
    PROYECTO_INCORRECTO:'Proyecto incorrecto',
    FICHAJE_NO_REGISTRADO:'Fichaje no registrado',
    OTRO:'Otro'
  };

  return labels[type] || type || 'Incidencia';
}



function renderParts() {
  const projectFilter = document.getElementById('projectFilter').value;
  const subFilter = document.getElementById('subFilter').value;
  const stateFilter = document.getElementById('stateFilter').value;

  const filtered = currentParts.filter(p =>
    (!projectFilter || p.project === projectFilter) &&
    (!subFilter || p.subcontractor === subFilter) &&
    (!stateFilter || p.status === stateFilter) &&
    (!incidentsOnly || ['REVISAR','RECHAZADO'].includes(p.status))
  );

  const container = document.getElementById('partsContainer');

  if (!filtered.length) {
    container.className = 'empty';
    container.innerHTML = 'No hay tareas que coincidan con los filtros seleccionados.';
    return;
  }

  container.className = '';
  container.innerHTML = '';

  const bySub = groupBy(filtered, p => p.subcontractor || 'SIN SUBCONTRATA');

  Object.keys(bySub).sort(localeSort).forEach(subName => {
    const subParts = bySub[subName];

    const subGroup = document.createElement('section');
    subGroup.className = 'sub-group';

    const subHead = document.createElement('div');
    subHead.className = 'sub-head';
    const subWorkers =
      new Set(subParts.map(p => p.email || p.worker)).size;

    const subPending =
      subParts.filter(p => p.status === 'PENDIENTE').length;

    const subIncidents =
      subParts.filter(p => ['REVISAR','RECHAZADO'].includes(p.status)).length;

    subHead.innerHTML = `
      <div>
        <div class="sub-name">${escapeHtml(subName)}</div>
        <div class="sub-stats">
          ${subWorkers} trabajador(es) · ${subParts.length} tarea(s) ·
          ${subPending} pendiente(s) · ${subIncidents} incidencia(s)
        </div>
      </div>
      <div class="sub-count">${subParts.length} tarea(s)</div>
    `;
    subGroup.appendChild(subHead);

    const byProject = groupBy(subParts, p => p.project || 'SIN PROYECTO');

    Object.keys(byProject).sort(localeSort).forEach(projectName => {
      const projectParts = byProject[projectName];

      const projectGroup = document.createElement('div');
      projectGroup.className = 'project-group';

      const projectTitle = document.createElement('div');
      projectTitle.className = 'project-title';
      projectTitle.textContent = projectName;
      projectGroup.appendChild(projectTitle);

      const byWorkerBlock = groupBy(
        projectParts,
        p => [p.email, p.entry, p.exit].join('|')
      );

      Object.keys(byWorkerBlock).forEach(blockKey => {
        const block = byWorkerBlock[blockKey];
        projectGroup.appendChild(renderWorkerBlock(block));
      });

      subGroup.appendChild(projectGroup);
    });

    container.appendChild(subGroup);
  });
}

function renderWorkerBlock(parts) {
  const first = parts[0];
  const worker = document.createElement('div');
  worker.className = 'worker';

  const workerKey =
    [first.subcontractor, first.project, first.email, first.entry, first.exit].join('|');

  if (collapsedWorkers.has(workerKey)) {
    worker.classList.add('collapsed');
  }

  const pendingRows = parts
    .filter(p => p.status === 'PENDIENTE')
    .map(p => p.rowNumber);

  const head = document.createElement('div');
  head.className = 'worker-head';

  const info = document.createElement('div');
  info.innerHTML = `
    <div class="worker-name">${escapeHtml(first.worker || first.email)}</div>
    <div class="worker-time">
      ${escapeHtml(first.entryTime || '--:--')} → ${escapeHtml(first.exitTime || '--:--')}
      · ${escapeHtml(getHoursDisplay(first))} h
    </div>
  `;
  head.appendChild(info);

  const headActions = document.createElement('div');
  headActions.className = 'worker-head-actions';

  if (pendingRows.length) {
    const bulk = document.createElement('button');
    bulk.type = 'button';
    bulk.className = 'bulk-btn';
    bulk.textContent = 'VALIDAR PENDIENTES';
    bulk.addEventListener('click', event => {
      event.stopPropagation();
      bulkValidate(pendingRows);
    });
    headActions.appendChild(bulk);
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'worker-toggle';
  toggle.textContent = '⌄';
  toggle.setAttribute('aria-label', 'Plegar o desplegar trabajador');

  toggle.addEventListener('click', event => {
    event.stopPropagation();

    if (worker.classList.toggle('collapsed')) {
      collapsedWorkers.add(workerKey);
    } else {
      collapsedWorkers.delete(workerKey);
    }
  });

  headActions.appendChild(toggle);
  head.appendChild(headActions);

  const body = document.createElement('div');
  body.className = 'worker-body';

  parts.forEach(part => {
    body.appendChild(renderTask(part));
  });

  worker.appendChild(head);
  worker.appendChild(body);

  return worker;
}

function getHoursDisplay(part) {
  const raw = String(part.hours || '').trim();

  // Si ya viene como una duración limpia, la usamos.
  if (/^\d+:\d{2}$/.test(raw)) return raw;

  // Si Sheets devolvió una duración como fecha 1899,
  // calculamos la duración directamente con ENTRADA y SALIDA.
  const entry = parseFrontDateTime(part.entry);
  const exit = parseFrontDateTime(part.exit);

  if (entry && exit && exit >= entry) {
    const totalMinutes = Math.max(
      0,
      Math.round((exit.getTime() - entry.getTime()) / 60000)
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours + ':' + String(minutes).padStart(2, '0');
  }

  return raw && !raw.includes('1899') ? raw : '--:--';
}

function parseFrontDateTime(value) {
  const text = String(value || '').trim();
  const match = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
  );

  if (!match) return null;

  return new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6])
  );
}

function renderTask(part) {
  const el = document.createElement('div');
  el.className = 'task';
  el.dataset.row = part.rowNumber;

  const existingObs = part.observation
    ? `<div class="obs-existing"><strong>Observación:</strong> ${escapeHtml(part.observation)}</div>`
    : '';

  el.innerHTML = `
    <div class="task-top">
      <div>
        <div class="task-title">${escapeHtml(part.task || 'Sin tarea')}</div>
        ${part.zone ? `<div class="task-zone">Zona: ${escapeHtml(part.zone)}</div>` : ''}
        ${part.description ? `<div class="task-desc">${escapeHtml(part.description)}</div>` : ''}
      </div>
      <span class="status-pill status-${part.status}">${escapeHtml(part.status)}</span>
    </div>

    ${existingObs}

    <div class="actions">
      <button type="button" class="action-btn action-valid" data-action="VALIDADO">VALIDAR</button>
      <button type="button" class="action-btn action-review" data-action="REVISAR">REVISAR</button>
      <button type="button" class="action-btn action-reject" data-action="RECHAZADO">RECHAZAR</button>
    </div>

    <div class="editor">
      <label>Observación</label>
      <textarea maxlength="500" placeholder="Indica el motivo o comentario…"></textarea>
      <div class="editor-actions">
        <button type="button" class="cancel-edit">CANCELAR</button>
        <button type="button" class="save-edit">GUARDAR</button>
      </div>
    </div>
  `;

  el.querySelector('[data-action="VALIDADO"]').addEventListener('click', () => {
    updateTask(part.rowNumber, 'VALIDADO', '');
  });

  el.querySelector('[data-action="REVISAR"]').addEventListener('click', () => {
    openEditor(el, part, 'REVISAR');
  });

  el.querySelector('[data-action="RECHAZADO"]').addEventListener('click', () => {
    openEditor(el, part, 'RECHAZADO');
  });

  el.querySelector('.cancel-edit').addEventListener('click', () => {
    el.querySelector('.editor').classList.remove('open');
  });

  return el;
}

function openEditor(el, part, status) {
  const editor = el.querySelector('.editor');
  const textarea = editor.querySelector('textarea');
  const save = editor.querySelector('.save-edit');

  textarea.value = part.observation || '';
  editor.classList.add('open');
  textarea.focus();

  save.onclick = () => {
    const observation = textarea.value.trim();

    if (!observation) {
      showStatus('Debes indicar una observación para ' + status + '.', 'err');
      return;
    }

    updateTask(part.rowNumber, status, observation);
  };
}

function updateTask(rowNumber, status, observation) {

  const part = currentParts.find(
    p => Number(p.rowNumber) === Number(rowNumber)
  );

  if (!part || part._saving) return;

  // Actualización optimista:
  // el usuario ve el cambio de forma inmediata, sin esperar a Sheets.
  part.status = status;
  part.observation = observation || '';
  part.validatedBy =
    status === 'PENDIENTE'
      ? ''
      : (manager && manager.email ? manager.email : '');
  part._saving = true;

  updateSummary();
  renderParts();

  showStatus('Guardando cambio…', 'info');

  postToBackend({
    action:'adminUpdate',
    credential:googleCredential,
    rowNumber:rowNumber,
    status:status,
    observation:observation
  });
}

function bulkValidate(rows) {
  if (!rows.length) return;

  if (!confirm('¿Validar todas las tareas pendientes de este bloque?')) return;

  const rowSet = new Set(rows.map(Number));

  currentParts.forEach(part => {
    if (
      rowSet.has(Number(part.rowNumber)) &&
      part.status === 'PENDIENTE'
    ) {
      part.status = 'VALIDADO';
      part.validatedBy =
        manager && manager.email ? manager.email : '';
      part.observation = '';
      part._saving = true;
    }
  });

  // Desaparecen al instante si el filtro activo es PENDIENTES.
  updateSummary();
  renderParts();

  showStatus('Guardando validaciones…', 'info');

  postToBackend({
    action:'adminBulkValidate',
    credential:googleCredential,
    rowNumbersJson:JSON.stringify(rows)
  });
}



function loadPresence() {
  if (!googleCredential) return;
  const btn = document.getElementById('presenceRefresh');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'ACTUALIZANDO…';
  }
  const updated = document.getElementById('presenceUpdated');
  if (updated) updated.textContent = 'Consultando fichajes abiertos…';

  postToBackend({
    action:'adminPresence',
    credential:googleCredential
  }, 'adminPresence');
}

function renderPresence() {
  const rows = Array.isArray(currentPresence) ? currentPresence : [];
  const container = document.getElementById('presenceProjects');
  if (!container) return;

  const uniqueSubs = new Set(rows.map(r => String(r.subcontractor || '').trim()).filter(Boolean));
  const uniqueProjects = new Set(rows.map(r => String(r.project || '').trim()).filter(Boolean));
  document.getElementById('presencePeopleCount').textContent = rows.length;
  document.getElementById('presenceSubCount').textContent = uniqueSubs.size;
  document.getElementById('presenceProjectCount').textContent = uniqueProjects.size;

  const btn = document.getElementById('presenceRefresh');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'ACTUALIZAR';
  }

  if (!rows.length) {
    container.innerHTML = '<div class="presence-empty">No hay fichajes de entrada abiertos en este momento.</div>';
    return;
  }

  const byProject = groupBy(rows, r => r.project || 'SIN PROYECTO');
  const projectNames = Object.keys(byProject).sort(localeSort);

  container.innerHTML = projectNames.map(project => {
    const projectRows = byProject[project];
    const bySub = groupBy(projectRows, r => r.subcontractor || 'SIN SUBCONTRATA');
    const subNames = Object.keys(bySub).sort(localeSort);

    const subHtml = subNames.map((sub, idx) => {
      const workers = bySub[sub].slice().sort((a,b) => localeSort(a.worker, b.worker));
      const key = escapeHtml(project + '__' + sub + '__' + idx);
      return '<div class="presence-sub-row" data-presence-key="' + key + '">' +
        '<button type="button" class="presence-sub-head" data-presence-toggle="' + key + '">' +
          '<span class="presence-sub-name">' + escapeHtml(sub) + '</span>' +
          '<span class="presence-sub-count">' + workers.length + ' persona' + (workers.length === 1 ? '' : 's') + ' · ver detalle ▾</span>' +
        '</button>' +
        '<div class="presence-workers">' +
          workers.map(w =>
            '<div class="presence-worker">' +
              '<div><div class="presence-worker-name">' + escapeHtml(w.worker || w.email || 'Trabajador') + '</div>' +
              '<div class="presence-worker-meta">' + escapeHtml(project) + ' · ' + escapeHtml(w.subcontractor || '') + '</div></div>' +
              '<div class="presence-entry">Desde ' + escapeHtml(w.entryTime || '') + '</div>' +
            '</div>'
          ).join('') +
        '</div>' +
      '</div>';
    }).join('');

    return '<div class="presence-project">' +
      '<div class="presence-project-head"><span class="presence-project-name">' + escapeHtml(project) + '</span>' +
      '<span class="presence-project-count">' + projectRows.length + ' presente' + (projectRows.length === 1 ? '' : 's') + '</span></div>' +
      subHtml +
    '</div>';
  }).join('');
}

function handlePresenceClick(event) {
  const btn = event.target.closest('[data-presence-toggle]');
  if (!btn) return;
  const key = btn.getAttribute('data-presence-toggle');
  const row = [...document.querySelectorAll('.presence-sub-row')].find(el => el.getAttribute('data-presence-key') === key);
  if (row) row.classList.toggle('open');
}

function switchModule(moduleName) {
  const isEquipment = moduleName === 'equipment';

  document.getElementById('workTab').classList.toggle('active', !isEquipment);
  document.getElementById('equipmentTab').classList.toggle('active', isEquipment);
  document.getElementById('workModule').classList.toggle('active', !isEquipment);
  document.getElementById('equipmentModule').classList.toggle('active', isEquipment);
  document.getElementById('mainWrap').classList.toggle('equipment-wide', isEquipment);

  if (isEquipment && !equipmentLoaded) {
    loadEquipmentLocations();
  }
  if (!isEquipment && !presenceLoaded) {
    loadPresence();
  }
}

function loadEquipmentLocations() {
  if (!googleCredential) return;

  const btn = document.getElementById('equipmentRefresh');
  btn.disabled = true;
  btn.textContent = 'ACTUALIZANDO…';
  document.getElementById('equipmentUpdated').textContent = 'Consultando posiciones…';

  postToBackend({
    action:'equipmentLocations',
    credential:googleCredential
  }, 'equipmentLocations');

  // The response handler restores the visual state. This timeout is only a
  // safety valve in case the external request is interrupted.
  window.setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'ACTUALIZAR POSICIONES';
  }, 8000);
}

function equipmentWorldToPixel(easting, northing) {
  // First use the local calibrated triangle. This exactly honours the control
  // points and avoids the several-metre drift seen with one global transform.
  for (const tri of EQUIPMENT_TRIANGLES) {
    const a = EQUIPMENT_CONTROL_POINTS[tri[0]];
    const b = EQUIPMENT_CONTROL_POINTS[tri[1]];
    const c = EQUIPMENT_CONTROL_POINTS[tri[2]];
    const weights = equipmentBarycentric(easting, northing, a, b, c);
    if (!weights) continue;
    const eps = -1e-8;
    if (weights.u >= eps && weights.v >= eps && weights.w >= eps) {
      return {
        x:weights.u*a.x + weights.v*b.x + weights.w*c.x,
        y:weights.u*a.y + weights.v*b.y + weights.w*c.y,
        method:'LOCAL'
      };
    }
  }

  // Outside the calibrated hull: robust global affine fallback.
  const g = EQUIPMENT_GEOREF;
  const dE = easting - g.originE;
  const dN = northing - g.originN;
  return {
    x:g.px.a * dE + g.px.b * dN + g.px.c,
    y:g.py.a * dE + g.py.b * dN + g.py.c,
    method:'GLOBAL'
  };
}

function equipmentBarycentric(e, n, a, b, c) {
  const den = (b.n - c.n)*(a.e - c.e) + (c.e - b.e)*(a.n - c.n);
  if (Math.abs(den) < 1e-9) return null;
  const u = ((b.n - c.n)*(e - c.e) + (c.e - b.e)*(n - c.n)) / den;
  const v = ((c.n - a.n)*(e - c.e) + (a.e - c.e)*(n - c.n)) / den;
  const w = 1 - u - v;
  return {u,v,w};
}

function equipmentWorldToPercent(easting, northing) {
  const g = EQUIPMENT_GEOREF;
  const p = equipmentWorldToPixel(easting, northing);
  return {
    x:(p.x / g.imageWidth) * 100,
    y:(p.y / g.imageHeight) * 100,
    inside:p.x >= 0 && p.x <= g.imageWidth && p.y >= 0 && p.y <= g.imageHeight,
    method:p.method
  };
}

function equipmentAgeMinutes(item) {
  const epoch = Number(item.lastPositionEpoch);
  if (!Number.isFinite(epoch) || epoch <= 0) return null;
  return Math.max(0, Math.floor((Date.now() - epoch) / 60000));
}

function equipmentFreshness(item) {
  const age = equipmentAgeMinutes(item);
  if (age == null) return 'unknown';
  if (age < 10) return 'fresh';
  if (age <= 30) return 'warn';
  return 'stale';
}

function equipmentAgeLabel(item) {
  const age = equipmentAgeMinutes(item);
  if (age == null) return 'Sin posición';
  if (age < 1) return 'Ahora';
  if (age < 60) return 'Hace ' + age + ' min';
  const hours = Math.floor(age / 60);
  return 'Hace ' + hours + ' h';
}

function equipmentIcon(type) {
  const t = normalizeFrontText(type);
  if (t.includes('GRUA')) return '🏗';
  if (t.includes('PEMP') || t.includes('PLATAFORMA')) return '↕';
  if (t.includes('MANITOU') || t.includes('TELEHANDLER')) return 'M';
  return '•';
}

function populateEquipmentFilters() {
  const projectEl = document.getElementById('equipmentProjectFilter');
  const typeEl = document.getElementById('equipmentTypeFilter');
  const oldProject = projectEl.value;
  const oldType = typeEl.value;

  const projects = uniqueSorted(currentEquipment.map(x => x.project));
  const types = uniqueSorted(currentEquipment.map(x => x.type));

  projectEl.innerHTML = '<option value="">Todos los proyectos</option>' +
    projects.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  typeEl.innerHTML = '<option value="">Todos los tipos</option>' +
    types.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  if (projects.includes(oldProject)) projectEl.value = oldProject;
  if (types.includes(oldType)) typeEl.value = oldType;
}

function renderEquipmentModule() {
  const project = document.getElementById('equipmentProjectFilter').value;
  const type = document.getElementById('equipmentTypeFilter').value;
  const visible = currentEquipment.filter(item =>
    (!project || item.project === project) &&
    (!type || item.type === type)
  );

  const layer = document.getElementById('equipmentMarkerLayer');
  const list = document.getElementById('equipmentList');
  layer.innerHTML = '';
  list.innerHTML = '';

  let fresh = 0;
  let warnings = 0;

  visible.forEach(item => {
    const cls = equipmentFreshness(item);
    if (cls === 'fresh') fresh++;
    if (cls === 'stale' || cls === 'unknown') warnings++;

    const e = Number(item.easting);
    const n = Number(item.northing);

    if (Number.isFinite(e) && Number.isFinite(n)) {
      const pos = equipmentWorldToPercent(e, n);
      if (pos.inside) {
        const marker = document.createElement('div');
        marker.className = 'equipment-marker ' + cls + (selectedEquipmentId === item.equipmentId ? ' selected' : '');
        marker.style.left = pos.x + '%';
        marker.style.top = pos.y + '%';
        marker.title = (item.name || item.equipmentId || 'Equipo') + ' · ' + equipmentAgeLabel(item);
        marker.innerHTML =
          '<div class="equipment-marker-dot"><span>' + escapeHtml(equipmentIcon(item.type)) + '</span></div>' +
          '<div class="equipment-marker-label">' + escapeHtml(item.name || item.equipmentId || 'Equipo') + '</div>';
        marker.addEventListener('click', () => selectEquipmentItem(item.equipmentId));
        layer.appendChild(marker);
      }
    }

    const row = document.createElement('div');
    row.className = 'equipment-row' + (selectedEquipmentId === item.equipmentId ? ' selected' : '');
    row.innerHTML =
      '<div>' +
        '<div class="equipment-row-name">' + escapeHtml(item.name || item.equipmentId || 'Equipo sin nombre') + '</div>' +
        '<div class="equipment-row-meta">' +
          escapeHtml([item.type, item.project, item.supplier, item.trackerId].filter(Boolean).join(' · ')) +
        '</div>' +
      '</div>' +
      '<div class="equipment-freshness ' + cls + '">' + escapeHtml(equipmentAgeLabel(item)) + '</div>';
    row.addEventListener('click', () => selectEquipmentItem(item.equipmentId));
    list.appendChild(row);
  });

  document.getElementById('equipmentCount').textContent = visible.length;
  document.getElementById('equipmentFreshCount').textContent = fresh;
  document.getElementById('equipmentWarningCount').textContent = warnings;

  const btn = document.getElementById('equipmentRefresh');
  btn.disabled = false;
  btn.textContent = 'ACTUALIZAR POSICIONES';

  if (!visible.length) {
    list.innerHTML = '<div class="equipment-empty">No hay equipos activos con los filtros actuales o el módulo todavía no tiene datos.</div>';
  }
}


function renderEquipmentSiteLabels() {
  const layer = document.getElementById('equipmentSiteLayer');
  if (!layer) return;
  layer.innerHTML = '';
  EQUIPMENT_SITE_LABELS.forEach(site => {
    const el = document.createElement('div');
    el.className = 'equipment-site-label';
    el.style.left = site.x + '%';
    el.style.top = site.y + '%';
    el.textContent = site.name;
    layer.appendChild(el);
  });
}

function toggleEquipmentCleanMap() {
  equipmentCleanBase = !equipmentCleanBase;
  const img = document.getElementById('equipmentCampusMap');
  const btn = document.getElementById('equipmentCleanMap');
  img.src = equipmentCleanBase ? './campus-location-map-clean.png' : './campus-location-map.png';
  img.classList.toggle('clean-base', equipmentCleanBase);
  btn.classList.toggle('active', equipmentCleanBase);
  btn.textContent = equipmentCleanBase ? 'BASE LIMPIA' : 'PLANO ORIGINAL';
}

function toggleEquipmentFullscreen() {
  const card = document.getElementById('equipmentMapCard');
  if (!document.fullscreenElement) {
    if (card.requestFullscreen) card.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function selectEquipmentItem(id) {
  selectedEquipmentId = id;
  renderEquipmentModule();
  const item = currentEquipment.find(x => x.equipmentId === id);
  renderEquipmentDetail(item);
}

function renderEquipmentDetail(item) {
  const pop = document.getElementById('equipmentDetailPop');
  if (!pop) return;
  if (!item) { pop.classList.remove('open'); pop.innerHTML=''; return; }
  const cls = equipmentFreshness(item);
  const e = Number(item.easting), n = Number(item.northing);
  const method = Number.isFinite(e) && Number.isFinite(n) ? equipmentWorldToPercent(e,n).method : '';
  pop.innerHTML =
    '<div class="equipment-detail-head">' +
      '<div><div class="equipment-detail-name">' + escapeHtml(item.name || item.equipmentId || 'Equipo') + '</div>' +
      '<div class="equipment-row-meta">' + escapeHtml(item.type || '') + '</div></div>' +
      '<button type="button" class="equipment-detail-close" id="equipmentDetailClose">×</button>' +
    '</div>' +
    '<dl class="equipment-detail-grid">' +
      '<dt>Proyecto</dt><dd>' + escapeHtml(item.project || '—') + '</dd>' +
      '<dt>Proveedor</dt><dd>' + escapeHtml(item.supplier || '—') + '</dd>' +
      '<dt>Tracker</dt><dd>' + escapeHtml(item.trackerId || '—') + '</dd>' +
      '<dt>Batería</dt><dd>' + escapeHtml(item.battery == null || item.battery === '' ? '—' : item.battery + '%') + '</dd>' +
      '<dt>Posición</dt><dd class="equipment-freshness ' + cls + '">' + escapeHtml(equipmentAgeLabel(item)) + '</dd>' +
      '<dt>Este</dt><dd>' + (Number.isFinite(e) ? e.toFixed(3) + ' m' : '—') + '</dd>' +
      '<dt>Norte</dt><dd>' + (Number.isFinite(n) ? n.toFixed(3) + ' m' : '—') + '</dd>' +
    '</dl>' +
    '<div class="equipment-calibration-note">Georreferencia: ' + escapeHtml(method === 'LOCAL' ? 'ajuste local calibrado' : 'ajuste global') + '</div>';
  pop.classList.add('open');
}

function closeEquipmentDetail() {
  selectedEquipmentId = null;
  const pop = document.getElementById('equipmentDetailPop');
  if (pop) { pop.classList.remove('open'); pop.innerHTML=''; }
  renderEquipmentModule();
}


let selectedEquipmentId = null;
let equipmentCleanBase = true;

function normalizeFrontText(v){return String(v||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function equipmentWorldToPixel(easting,northing){for(const tri of EQUIPMENT_TRIANGLES){const a=EQUIPMENT_CONTROL_POINTS[tri[0]],b=EQUIPMENT_CONTROL_POINTS[tri[1]],c=EQUIPMENT_CONTROL_POINTS[tri[2]],weights=equipmentBarycentric(easting,northing,a,b,c);if(!weights)continue;const eps=-1e-8;if(weights.u>=eps&&weights.v>=eps&&weights.w>=eps)return{x:weights.u*a.x+weights.v*b.x+weights.w*c.x,y:weights.u*a.y+weights.v*b.y+weights.w*c.y,method:'LOCAL'};}const g=EQUIPMENT_GEOREF,dE=easting-g.originE,dN=northing-g.originN;return{x:g.px.a*dE+g.px.b*dN+g.px.c,y:g.py.a*dE+g.py.b*dN+g.py.c,method:'GLOBAL'};}
function equipmentBarycentric(e,n,a,b,c){const den=(b.n-c.n)*(a.e-c.e)+(c.e-b.e)*(a.n-c.n);if(Math.abs(den)<1e-9)return null;const u=((b.n-c.n)*(e-c.e)+(c.e-b.e)*(n-c.n))/den,v=((c.n-a.n)*(e-c.e)+(a.e-c.e)*(n-c.n))/den;return{u,v,w:1-u-v};}
function equipmentWorldToPercent(e,n){const g=EQUIPMENT_GEOREF,p=equipmentWorldToPixel(e,n);return{x:p.x/g.imageWidth*100,y:p.y/g.imageHeight*100,inside:p.x>=0&&p.x<=g.imageWidth&&p.y>=0&&p.y<=g.imageHeight,method:p.method};}
function equipmentAgeMinutes(item){const epoch=Number(item.lastPositionEpoch);if(!Number.isFinite(epoch)||epoch<=0)return null;return Math.max(0,Math.floor((Date.now()-epoch)/60000));}
function equipmentFreshness(item){const age=equipmentAgeMinutes(item);if(age==null)return'unknown';if(age<10)return'fresh';if(age<=30)return'warn';return'stale';}
function equipmentAgeLabel(item){const age=equipmentAgeMinutes(item);if(age==null)return'Sin posición';if(age<1)return'Ahora';if(age<60)return'Hace '+age+' min';return'Hace '+Math.floor(age/60)+' h';}
function equipmentIcon(type){const t=normalizeFrontText(type);if(t.includes('GRUA'))return'🏗';if(t.includes('PEMP')||t.includes('PLATAFORMA'))return'↕';if(t.includes('MANITOU')||t.includes('TELEHANDLER'))return'M';return'•';}

function openEquipmentGlobal(){show(el.equipmentGlobalView);renderEquipmentSiteLabels();setStatus(el.equipmentGlobalStatus,'Cargando maquinaria…');postToBackend('equipmentLocationsGlobal',{});}
function handleEquipmentLocationsGlobal(payload){if(!payload?.ok){setStatus(el.equipmentGlobalStatus,payload?.message||'No se ha podido cargar maquinaria.','error');return;}state.equipmentGlobal=Array.isArray(payload.locations)?payload.locations:[];if(payload.configured===false)setStatus(el.equipmentGlobalStatus,payload.message||'Módulo de maquinaria pendiente de configurar.','info');else clearStatus(el.equipmentGlobalStatus);populateEquipmentFilters();renderEquipmentGlobal();}
function populateEquipmentFilters(){const projectEl=el.equipmentGlobalProjectFilter,typeEl=el.equipmentTypeFilter,oldProject=projectEl.value,oldType=typeEl.value;const projects=[...new Set(state.equipmentGlobal.map(x=>x.project).filter(Boolean))].sort(),types=[...new Set(state.equipmentGlobal.map(x=>x.type).filter(Boolean))].sort();projectEl.innerHTML='<option value="">Todos los proyectos</option>'+projects.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');typeEl.innerHTML='<option value="">Todos los tipos</option>'+types.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');if(projects.includes(oldProject))projectEl.value=oldProject;if(types.includes(oldType))typeEl.value=oldType;}
function renderEquipmentGlobal(){
  const project=el.equipmentGlobalProjectFilter.value,type=el.equipmentTypeFilter.value,q=el.equipmentGlobalSearch.value.trim().toLowerCase();
  const visible=(state.equipmentGlobal||[]).filter(item=>(!project||item.project===project)&&(!type||item.type===type)&&(!q||[item.name,item.equipmentId,item.type,item.supplier,item.project,item.trackerId].join(' ').toLowerCase().includes(q)));
  el.equipmentMarkerLayer.innerHTML='';el.equipmentGlobalList.innerHTML='';let fresh=0,warnings=0;
  visible.forEach(item=>{const cls=equipmentFreshness(item);if(cls==='fresh')fresh++;if(cls==='stale'||cls==='unknown')warnings++;const e=Number(item.easting),n=Number(item.northing);if(Number.isFinite(e)&&Number.isFinite(n)){const pos=equipmentWorldToPercent(e,n);if(pos.inside){const marker=document.createElement('div');marker.className='equipment-marker '+cls+(selectedEquipmentId===item.equipmentId?' selected':'');marker.style.left=pos.x+'%';marker.style.top=pos.y+'%';marker.title=(item.name||item.equipmentId||'Equipo')+' · '+equipmentAgeLabel(item);marker.innerHTML='<div class="equipment-marker-dot"><span>'+esc(equipmentIcon(item.type))+'</span></div><div class="equipment-marker-label">'+esc(item.name||item.equipmentId||'Equipo')+'</div>';marker.addEventListener('click',()=>selectEquipmentItem(item.equipmentId));el.equipmentMarkerLayer.appendChild(marker);}}
    const row=document.createElement('div');row.className='equipment-row'+(selectedEquipmentId===item.equipmentId?' selected':'');row.innerHTML='<div><div class="equipment-row-name">'+esc(item.name||item.equipmentId||'Equipo sin nombre')+'</div><div class="equipment-row-meta">'+esc([item.type,item.project,item.supplier,item.trackerId].filter(Boolean).join(' · '))+'</div></div><div class="equipment-freshness '+cls+'">'+esc(equipmentAgeLabel(item))+'</div>';row.addEventListener('click',()=>selectEquipmentItem(item.equipmentId));el.equipmentGlobalList.appendChild(row);
  });
  el.equipmentGlobalCount.textContent=visible.length;el.equipmentPositionCount.textContent=fresh;el.equipmentNoPositionCount.textContent=warnings;el.equipmentUpdated.textContent='Actualizado '+new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  if(!visible.length)el.equipmentGlobalList.innerHTML='<div class="equipment-empty">No hay equipos activos con los filtros actuales o el módulo todavía no tiene datos.</div>';
}
function renderEquipmentSiteLabels(){if(!el.equipmentSiteLayer)return;el.equipmentSiteLayer.innerHTML='';EQUIPMENT_SITE_LABELS.forEach(site=>{const x=document.createElement('div');x.className='equipment-site-label';x.style.left=site.x+'%';x.style.top=site.y+'%';x.textContent=site.name;el.equipmentSiteLayer.appendChild(x);});}
function selectEquipmentItem(id){selectedEquipmentId=id;renderEquipmentGlobal();const item=(state.equipmentGlobal||[]).find(x=>x.equipmentId===id);if(!item){el.equipmentDetailPop.innerHTML='';el.equipmentDetailPop.classList.remove('show');return;}el.equipmentDetailPop.innerHTML=`<button type="button" class="equipment-detail-close">×</button><strong>${esc(item.name||item.equipmentId)}</strong><span>${esc([item.type,item.project,item.supplier].filter(Boolean).join(' · '))}</span><dl><dt>Tracker</dt><dd>${esc(item.trackerId||'—')}</dd><dt>Batería</dt><dd>${item.battery==null?'—':esc(item.battery)+'%'}</dd><dt>Posición</dt><dd>${item.easting==null||item.northing==null?'Sin posición':esc(item.easting)+' / '+esc(item.northing)}</dd><dt>Última posición</dt><dd>${esc(item.lastPosition||'—')}</dd><dt>Comunicación</dt><dd>${esc(item.lastCommunication||'—')}</dd></dl>`;el.equipmentDetailPop.classList.add('show');el.equipmentDetailPop.querySelector('.equipment-detail-close').addEventListener('click',()=>{selectedEquipmentId=null;el.equipmentDetailPop.classList.remove('show');renderEquipmentGlobal();});}
function toggleEquipmentCleanMap(){equipmentCleanBase=!equipmentCleanBase;el.equipmentCampusMap.src=equipmentCleanBase?'campus-location-map-clean.png':'campus-location-map.png';el.equipmentCampusMap.classList.toggle('clean-base',equipmentCleanBase);el.equipmentCleanMap.classList.toggle('active',equipmentCleanBase);el.equipmentCleanMap.textContent=equipmentCleanBase?'BASE LIMPIA':'PLANO ORIGINAL';}
function toggleEquipmentFullscreen(){if(!document.fullscreenElement){el.equipmentMapCard.requestFullscreen?.();}else document.exitFullscreen?.();}

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
el.equipmentTypeFilter.addEventListener('change', renderEquipmentGlobal);
el.equipmentCleanMap.addEventListener('click', toggleEquipmentCleanMap);
el.equipmentFullscreen.addEventListener('click', toggleEquipmentFullscreen);

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