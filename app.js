(() => {
'use strict';

const CONFIG = window.LEVITEC_CONFIG;

const state = {
  credential: null,
  credentialExpiresAt: 0,
  bootstrap: null,
  currentProject: null,
  adminProjects: [],
  purchases: [],
  globalPurchaseSearch: {
    query: '',
    results: [],
    loading: false
  },
  purchaseSuggestions: {
    suppliers: [],
    families: [],
    destinations: [],
    materials: []
  },
  purchaseSuggestionsLoadedAt: 0,
  purchaseSuggestionsProjectId: '',
  purchaseSubmitting: false,
  pendingPurchaseQuotePdf: null,
  pendingPurchaseQuoteFile: null,
  pendingPurchaseNotification: null,
  purchaseNotice: null,
  workflowRequest: null,
  workflowSubmitting: false,
  deliveries: [],
  constructionMilestones: [],
  subcontractWorks: [],
  planningCalendarFilter: 'ALL',
  selectedSubcontractWork: null,
  selectedConstructionMilestone: null,
  deliveryFilter: 'ALL',
  deliveryCalendarDate: new Date(),
  selectedDelivery: null,
  deliverySubmitting: false,
  deliveryCommentSubmitting: false,
  selectedMilestoneDetailId: null,

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
    monthParts: [],
    monthIncidents: [],
    parts: [],
    incidents: [],
    presence: [],
    correctionIncident: null
  },

  equipmentGlobal: [],

  mechanical: {
    submittals: [],
    subpackages: [],
    milestones: [],
    links: [],
    canEdit: false,
    selectedSubmittal: null,
    selectedMilestone: null,
    milestoneDraftSelection: new Set(),
    foks: [],
    fokLinks: [],
    selectedFok: null,
    selectedFokMilestone: null,
    fokDraftSelection: new Set(),
    drawings: [], drawingLinks: [], drawingHistory: [], drawingsLoaded: false,
    drawingCanEdit: false, drawingCanValidate: false, drawingEditing: null,
    drawingPendingLinks: null, drawingTab: 'milestones'
  }
};

const $ = id => document.getElementById(id);

const el = {
  loginView: $('loginView'),
  projectsView: $('projectsView'),
  projectView: $('projectView'),
  workControlView: $('workControlView'),
  equipmentGlobalView: $('equipmentGlobalView'),
  mechanicalView: $('mechanicalView'),
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
  globalPurchaseSearchForm: $('globalPurchaseSearchForm'),
  globalPurchaseSearchInput: $('globalPurchaseSearchInput'),
  globalPurchaseSearchBtn: $('globalPurchaseSearchBtn'),
  globalPurchaseSearchHint: $('globalPurchaseSearchHint'),
  globalPurchaseSearchStatus: $('globalPurchaseSearchStatus'),
  globalPurchaseSearchResults: $('globalPurchaseSearchResults'),

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
  purchaseStatusFilter: $('purchaseStatusFilter'),
  purchaseFilterCount: $('purchaseFilterCount'),

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
  purchaseModalStatus: $('purchaseModalStatus'),
  closePurchaseModalBtn: $('closePurchaseModalBtn'),
  cancelPurchaseBtn: $('cancelPurchaseBtn'),
  purchaseForm: $('purchaseForm'),
  purchaseClientRequestId: $('purchaseClientRequestId'),
  purchaseModalProject: $('purchaseModalProject'),
  purchaseSupplier: $('purchaseSupplier'),
  purchaseFamily: $('purchaseFamily'),
  purchaseRequiredDate: $('purchaseRequiredDate'),
  purchaseQuoteRef: $('purchaseQuoteRef'),
  purchaseQuotePdf: $('purchaseQuotePdf'),
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

  milestoneDetailModal: $('milestoneDetailModal'),
  milestoneDetailTitle: $('milestoneDetailTitle'),
  milestoneDetailMeta: $('milestoneDetailMeta'),
  milestoneDetailSummary: $('milestoneDetailSummary'),
  milestoneDetailDeliveries: $('milestoneDetailDeliveries'),
  milestoneDetailSubcontracts: $('milestoneDetailSubcontracts'),
  closeMilestoneDetailBtn: $('closeMilestoneDetailBtn'),
  editMilestoneFromDetailBtn: $('editMilestoneFromDetailBtn'),
  deliveryModal: $('deliveryModal'),
  closeDeliveryModalBtn: $('closeDeliveryModalBtn'),
  deliveryModalTitle: $('deliveryModalTitle'),
  deliveryModalMeta: $('deliveryModalMeta'),
  deliverySupplier: $('deliverySupplier'),
  deliveryPo: $('deliveryPo'),
  deliveryFamily: $('deliveryFamily'),
  deliveryDestination: $('deliveryDestination'),
  deliveryMilestoneSelect: $('deliveryMilestoneSelect'),
  newSubcontractBtn: $('newSubcontractBtn'),
  subcontractModal: $('subcontractModal'),
  subcontractForm: $('subcontractForm'),
  subcontractId: $('subcontractId'),
  subcontractSupplier: $('subcontractSupplier'),
  subcontractActivity: $('subcontractActivity'),
  subcontractStart: $('subcontractStart'),
  subcontractEnd: $('subcontractEnd'),
  subcontractPlanned: $('subcontractPlanned'),
  subcontractActual: $('subcontractActual'),
  subcontractStatus: $('subcontractStatus'),
  subcontractNotes: $('subcontractNotes'),
  subcontractMilestones: $('subcontractMilestones'),
  subcontractList: $('subcontractList'),
  closeSubcontractBtn: $('closeSubcontractBtn'),
  cancelSubcontractBtn: $('cancelSubcontractBtn'),
  deleteSubcontractBtn: $('deleteSubcontractBtn'),
  deliveryMilestoneOffset: $('deliveryMilestoneOffset'),
  saveDeliveryMilestoneBtn: $('saveDeliveryMilestoneBtn'),
  deliveryMaterials: $('deliveryMaterials'),
  deliveryDateInput: $('deliveryDateInput'),
  deliveryChangeReason: $('deliveryChangeReason'),
  saveDeliveryDateBtn: $('saveDeliveryDateBtn'),
  deliveryReceiptStatus: $('deliveryReceiptStatus'),
  deliveryReceiptNotes: $('deliveryReceiptNotes'),
  confirmDeliveryReceiptBtn: $('confirmDeliveryReceiptBtn'),
  deliveryCommentsStatus: $('deliveryCommentsStatus'),
  deliveryCommentsList: $('deliveryCommentsList'),
  deliveryNewComment: $('deliveryNewComment'),
  saveDeliveryCommentBtn: $('saveDeliveryCommentBtn'),

  backFromWarehouseBtn: $('backFromWarehouseBtn'),
  warehouseProjectSubtitle: $('warehouseProjectSubtitle'),
  warehouseStatus: $('warehouseStatus'),
  warehouseSelect: $('warehouseSelect'),
  warehouseMeta: $('warehouseMeta'),
  warehouseSkuCount: $('warehouseSkuCount'),
  warehouseQuarantineCount: $('warehouseQuarantineCount'),
  warehouseOpenRequestsCount: $('warehouseOpenRequestsCount'),
  warehouseStockBody: $('warehouseStockBody'),
  warehouseStockPanel: $('warehouseStockPanel'),
  warehouseRequestsPanel: $('warehouseRequestsPanel'),
  warehouseZonesPanel: $('warehouseZonesPanel'),
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

  backFromMechanicalBtn: $('backFromMechanicalBtn'),
  mechanicalProjectSubtitle: $('mechanicalProjectSubtitle'),
  mechanicalStatus: $('mechanicalStatus'),
  newMechanicalSubmittalBtn: $('newMechanicalSubmittalBtn'),
  mechanicalMilestoneCount: $('mechanicalMilestoneCount'),
  mechanicalReadyCount: $('mechanicalReadyCount'),
  mechanicalRiskCount: $('mechanicalRiskCount'),
  mechanicalApprovedCount: $('mechanicalApprovedCount'),
  mechanicalApprovedMeta: $('mechanicalApprovedMeta'),
  mechanicalReadinessGrid: $('mechanicalReadinessGrid'),
  mechanicalSubpackageSummary: $('mechanicalSubpackageSummary'),
  mechanicalSubmittalSearch: $('mechanicalSubmittalSearch'),
  mechanicalSubpackageFilter: $('mechanicalSubpackageFilter'),
  mechanicalSubmittalStatusFilter: $('mechanicalSubmittalStatusFilter'),
  mechanicalSubmittalBody: $('mechanicalSubmittalBody'),

  mechanicalSubmittalModal: $('mechanicalSubmittalModal'),
  mechanicalSubmittalModalTitle: $('mechanicalSubmittalModalTitle'),
  closeMechanicalSubmittalModalBtn: $('closeMechanicalSubmittalModalBtn'),
  cancelMechanicalSubmittalBtn: $('cancelMechanicalSubmittalBtn'),
  mechanicalSubmittalForm: $('mechanicalSubmittalForm'),
  mechanicalSubmittalId: $('mechanicalSubmittalId'),
  mechanicalSubmittalSubpackage: $('mechanicalSubmittalSubpackage'),
  mechanicalNewSubpackageWrap: $('mechanicalNewSubpackageWrap'),
  mechanicalNewSubpackage: $('mechanicalNewSubpackage'),
  mechanicalSubmittalTrackerNumber: $('mechanicalSubmittalTrackerNumber'),
  mechanicalSubmittalTechnicalNumber: $('mechanicalSubmittalTechnicalNumber'),
  mechanicalSubmittalTitle: $('mechanicalSubmittalTitle'),
  mechanicalSubmittalStatus: $('mechanicalSubmittalStatus'),
  mechanicalSubmittalRevision: $('mechanicalSubmittalRevision'),
  mechanicalSubmittalOwner: $('mechanicalSubmittalOwner'),
  mechanicalSubmittalPlannedDate: $('mechanicalSubmittalPlannedDate'),
  mechanicalSubmittalForecast: $('mechanicalSubmittalForecast'),
  mechanicalSubmittalNotes: $('mechanicalSubmittalNotes'),
  deleteMechanicalSubmittalBtn: $('deleteMechanicalSubmittalBtn'),

  milestoneSubmittalModal: $('milestoneSubmittalModal'),
  milestoneSubmittalModalTitle: $('milestoneSubmittalModalTitle'),
  milestoneSubmittalModalMeta: $('milestoneSubmittalModalMeta'),
  closeMilestoneSubmittalModalBtn: $('closeMilestoneSubmittalModalBtn'),
  cancelMilestoneSubmittalBtn: $('cancelMilestoneSubmittalBtn'),
  milestoneSubmittalSearch: $('milestoneSubmittalSearch'),
  milestoneSelectAllVisibleBtn: $('milestoneSelectAllVisibleBtn'),
  milestoneClearVisibleBtn: $('milestoneClearVisibleBtn'),
  milestoneSubmittalGroups: $('milestoneSubmittalGroups'),
  milestoneSelectedCount: $('milestoneSelectedCount'),
  saveMilestoneSubmittalLinksBtn: $('saveMilestoneSubmittalLinksBtn'),

  fokCrossSiteNotice: $('fokCrossSiteNotice'),
  fokSearch: $('fokSearch'),
  fokCategoryFilter: $('fokCategoryFilter'),
  fokExecutionFilter: $('fokExecutionFilter'),
  fokBody: $('fokBody'),

  fokEditModal: $('fokEditModal'),
  fokEditTitle: $('fokEditTitle'),
  fokEditMeta: $('fokEditMeta'),
  closeFokEditModalBtn: $('closeFokEditModalBtn'),
  cancelFokEditBtn: $('cancelFokEditBtn'),
  fokEditForm: $('fokEditForm'),
  fokEditId: $('fokEditId'),
  fokDocStatus: $('fokDocStatus'),
  fokOwner: $('fokOwner'),
  fokReportLink: $('fokReportLink'),
  fokInspectionToolLink: $('fokInspectionToolLink'),
  fokExecutionStatus: $('fokExecutionStatus'),
  fokInspectionDate: $('fokInspectionDate'),
  fokComments: $('fokComments'),

  milestoneFokModal: $('milestoneFokModal'),
  milestoneFokModalTitle: $('milestoneFokModalTitle'),
  milestoneFokModalMeta: $('milestoneFokModalMeta'),
  closeMilestoneFokModalBtn: $('closeMilestoneFokModalBtn'),
  cancelMilestoneFokBtn: $('cancelMilestoneFokBtn'),
  milestoneFokSearch: $('milestoneFokSearch'),
  milestoneFokSelectAllBtn: $('milestoneFokSelectAllBtn'),
  milestoneFokClearBtn: $('milestoneFokClearBtn'),
  milestoneFokGroups: $('milestoneFokGroups'),
  milestoneFokSelectedCount: $('milestoneFokSelectedCount'),
  saveMilestoneFokBtn: $('saveMilestoneFokBtn'),

  backendForm: $('backendForm'),
  backendAction: $('backendAction'),
  backendCredential: $('backendCredential'),
  backendPayload: $('backendPayload')
};

const ROLE_LABELS = {
  DRAUGHTSMAN:'Delineante', DELINEANTE:'Delineante', BIM:'BIM / Delineación',
  ADMIN: 'Administrador',
  PROJECT_MANAGER: 'Project Manager',
  SITE_MANAGER: 'Jefe de obra',
  FOREMAN: 'Encargado',
  ENGINEER: 'Ingeniero',
  WAREHOUSE: 'Almacenero',
  ADMINISTRATION: 'Administración',
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
    el.mechanicalView,
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


/* SESION GOOGLE: aviso preventivo. La caducidad real se valida en el backend. */
const SESSION_WARNING_MS = 5 * 60 * 1000;
let sessionWarningNode = null;

function googleTokenExpirationMs_(credential) {
  try {
    const part = String(credential || '').split('.')[1];
    if (!part) return 0;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded));
    const exp = Number(payload.exp);
    return Number.isFinite(exp) && exp > 0 ? exp * 1000 : 0;
  } catch (_) {
    return 0;
  }
}

function sessionNotice_() {
  if (sessionWarningNode) return sessionWarningNode;
  const notice = document.createElement('div');
  notice.id = 'sessionExpiryNotice';
  notice.setAttribute('role', 'alert');
  notice.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#163a4a;color:white;padding:14px 16px;border-radius:12px;box-shadow:0 5px 24px #0005;display:none;align-items:center;gap:12px;flex-wrap:wrap;font:14px Arial,sans-serif';
  const message = document.createElement('span');
  message.id = 'sessionExpiryMessage';
  message.style.cssText = 'flex:1;min-width:210px;line-height:1.4';
  const renew = document.createElement('button');
  renew.type = 'button';
  renew.textContent = 'Renovar sesión';
  renew.style.cssText = 'padding:10px 14px;border:0;border-radius:7px;background:#fff;color:#163a4a;font-weight:700;cursor:pointer';
  renew.addEventListener('click', () => {
    // No se solicita ni se almacena ninguna contraseña. Google vuelve a emitir la credencial.
    show(el.loginView);
    setStatus(el.loginStatus, 'Vuelve a identificarte con Google para continuar. Los datos ya guardados no se perderán.', 'info');
  });
  notice.append(message, renew);
  document.body.appendChild(notice);
  sessionWarningNode = notice;
  return notice;
}

function checkSessionExpiry_() {
  const notice = sessionNotice_();
  const expires = state.credentialExpiresAt;
  if (!state.credential || !expires) {
    notice.style.display = 'none';
    return false;
  }
  const remaining = expires - Date.now();
  if (remaining > SESSION_WARNING_MS) {
    notice.style.display = 'none';
    return false;
  }
  const expired = remaining <= 0;
  const mins = Math.max(1, Math.ceil(remaining / 60000));
  notice.querySelector('#sessionExpiryMessage').textContent = expired
    ? 'Tu sesión de Google ha caducado. Renueva la sesión antes de realizar otra operación; no se ha enviado ninguna solicitud.'
    : 'Tu sesión de Google caducará en aproximadamente ' + mins + ' minuto(s). Renueva la sesión antes de guardar nuevos cambios.';
  notice.style.display = 'flex';
  return expired;
}

setInterval(checkSessionExpiry_, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkSessionExpiry_(); });
window.addEventListener('focus', checkSessionExpiry_);

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
  state.credentialExpiresAt = googleTokenExpirationMs_(response.credential);
  checkSessionExpiry_();
  setStatus(el.loginStatus, 'Validando usuario y permisos…');
  postToBackend('bootstrap', {});
}


/* BACKEND */
function postToBackend(action, payload) {
  if (checkSessionExpiry_()) {
    if (action === 'purchaseCreate' || action === 'purchaseNotify') {
      setPurchaseSubmitting(false);
      if (el.purchaseModalStatus) setStatus(el.purchaseModalStatus, 'La sesión ha caducado. Renueva tu acceso antes de enviar la solicitud.', 'error');
    }
    if (action === 'deliveryCommentAdd') {
      setDeliveryCommentSubmitting(false);
      el.deliveryCommentsStatus.textContent = 'Sesión caducada. Renueva tu acceso antes de guardar el comentario.';
    }
    if (action === 'deliveryCommentsList') {
      el.deliveryCommentsStatus.textContent = 'Sesión caducada. Renueva tu acceso para consultar el historial.';
    }
    if (['deliveryUpdateDate','deliveryConfirmReceipt','deliveryLinkMilestone','constructionMilestoneSave','constructionMilestoneDelete'].includes(action)) {
      setDeliverySubmitting(false);
      setStatus(el.deliveryStatus,'Sesión caducada. Renueva tu acceso antes de guardar cambios.','error');
    }
    return;
  }
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
    case 'globalPurchaseSearch':
      handleGlobalPurchaseSearch(msg.payload);
      break;

    case 'purchaseSuggestions':
      handlePurchaseSuggestions(msg.payload);
      break;

    case 'purchaseCreate':
      handlePurchaseCreate(msg.payload);
      break;

    case 'purchaseNotify':
      handlePurchaseNotify(msg.payload);
      break;

    case 'purchaseUpdateStatus':
      handlePurchaseMutation(msg.payload);
      break;

    case 'purchaseStartProcessing':
      handlePurchaseStartProcessing(msg.payload);
      break;

    case 'deliveryList':
      handleDeliveryList(msg.payload);
      break;
    case 'warehouseSyncConfirmedOrders':
      handleWarehouseSyncConfirmedOrders(msg.payload);
      break;
    case 'warehouseReceiptDestinations':
      handleReceiptDestinationsRC13(msg.payload);
      break;
    case 'warehouseOrderProgress':
      handleWarehouseOrderProgress(msg.payload);
      break;
    case 'deliveryCommentsList':
      handleDeliveryCommentsList(msg.payload);
      break;
    case 'deliveryCommentAdd':
      handleDeliveryCommentAdd(msg.payload);
      break;

    case 'subcontractWorkSave':
    case 'subcontractWorkDelete':
    case 'deliveryUpdateDate':
    case 'deliveryConfirmReceipt':
    case 'deliveryLinkMilestone':
    case 'constructionMilestoneSave':
    case 'constructionMilestoneDelete':
      handleDeliveryMutation(msg.payload);
      break;

    case 'mechanicalDrawingHistory':
      handleDrawingHistory(msg.payload);
      break;
    case 'mechanicalDrawingList':
      handleDrawingList(msg.payload);
      break;
    case 'mechanicalDrawingSave':
      handleDrawingSave(msg.payload);
      break;
    case 'mechanicalDrawingMilestonesSave':
      handleDrawingMilestonesSave(msg.payload);
      break;
    case 'mechanicalMilestoneDrawingsSaveBatch':
      handleMilestoneDrawingsBatch(msg.payload);
      break;
    case 'mechanicalReadiness':
      handleMechanicalReadiness(msg.payload);
      break;

    case 'mechanicalSubmittalSave':
    case 'mechanicalSubmittalDelete':
    case 'milestoneSubmittalLinksSaveBatch':
      handleMechanicalMutation(msg.payload,msg.type);
      break;
    case 'fokProjectSave':
    case 'fokCopyDocumentation':
    case 'milestoneFokLinksSaveBatch':
      handleMechanicalMutation(msg.payload,msg.type);
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
      wmCompleteRequest(msg.payload);
      break;
    case 'warehouseZoneCreate':
      handleWarehouseMutation(msg.payload);
      break;

    case 'error':
      if(state.warehouseReceiptConsultPending && /warehouse|la acción solicitada no existe/i.test(msg.payload?.message||'')){
        handleWarehouseOrderProgress({ok:false,message:msg.payload?.message});
        break;
      }
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
        setDeliveryCommentSubmitting(false);
        if (!el.deliveryModal.classList.contains('hidden')) {
          el.deliveryCommentsStatus.textContent = msg.payload?.message || 'Error de servidor.';
        }
        setStatus(el.deliveryStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }

      if (!el.warehouseView.classList.contains('hidden')) {
        setStatus(el.warehouseStatus, msg.payload?.message || 'Error de servidor.', 'error');
      }
      if (!el.mechanicalView.classList.contains('hidden')) {
        for(const action of [...mechanicalSaveLocks.keys()]) mechanicalSaveFinish(action,false,msg.payload?.message);
        if(state.mechanical.drawingSaveInFlight) {
          state.mechanical.drawingSaveInFlight=false;
          const btn=document.getElementById('mechDrawingSave');btn.disabled=false;btn.textContent='Guardar plano';
        }
        setStatus(el.mechanicalStatus, msg.payload?.message || 'Error de Mechanical.', 'error');
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



/* GLOBAL PURCHASE SEARCH */
function submitGlobalPurchaseSearch(event) {
  if (event) event.preventDefault();

  const query = el.globalPurchaseSearchInput.value.trim();

  if (query.length < 2) {
    setStatus(
      el.globalPurchaseSearchStatus,
      'Introduce al menos 2 caracteres para buscar.',
      'error'
    );
    return;
  }

  state.globalPurchaseSearch.query = query;
  state.globalPurchaseSearch.loading = true;

  el.globalPurchaseSearchBtn.disabled = true;
  el.globalPurchaseSearchBtn.textContent = 'Buscando…';
  el.globalPurchaseSearchResults.classList.add('hidden');
  clearStatus(el.globalPurchaseSearchStatus);

  postToBackend('globalPurchaseSearch', {query:query});
}


function handleGlobalPurchaseSearch(payload) {
  state.globalPurchaseSearch.loading = false;
  el.globalPurchaseSearchBtn.disabled = false;
  el.globalPurchaseSearchBtn.textContent = 'Buscar';

  if (!payload || !payload.ok) {
    setStatus(
      el.globalPurchaseSearchStatus,
      payload && payload.message
        ? payload.message
        : 'No se ha podido realizar la búsqueda.',
      'error'
    );
    return;
  }

  state.globalPurchaseSearch.results =
    Array.isArray(payload.results) ? payload.results : [];

  clearStatus(el.globalPurchaseSearchStatus);
  renderGlobalPurchaseSearchResults(
    payload.query || state.globalPurchaseSearch.query
  );
}


function generalPurchaseStatusLabel(status) {
  return ({
    PENDIENTE_ADMINISTRACION:'Pendiente administración',
    EN_TRAMITACION:'En tramitación',
    PEDIDO_EMITIDO:'Pedido emitido',
    CONFIRMADO_PROVEEDOR:'Confirmado proveedor',
    CANCELADO:'Cancelado'
  })[status] || status || 'Sin estado';
}


function renderGlobalPurchaseSearchResults(query) {
  const results = state.globalPurchaseSearch.results || [];
  el.globalPurchaseSearchResults.classList.remove('hidden');

  if (!results.length) {
    el.globalPurchaseSearchResults.innerHTML = `
      <div class="global-search-empty">
        <strong>Sin resultados</strong>
        <span>No se ha encontrado ningún pedido o material para “${esc(query)}” dentro de tus proyectos.</span>
      </div>`;
    return;
  }

  el.globalPurchaseSearchResults.innerHTML = `
    <div class="global-search-results-head">
      <strong>${results.length} resultado${results.length === 1 ? '' : 's'}</strong>
      <span>Consulta transversal de pedidos</span>
    </div>
    <div class="global-search-result-list"></div>
  `;

  const list = el.globalPurchaseSearchResults.querySelector(
    '.global-search-result-list'
  );

  results.forEach(req => {
    const card = document.createElement('article');
    card.className = 'global-search-result-card';

    const materials = Array.isArray(req.materials) ? req.materials : [];
    const materialsHtml = materials.length
      ? materials.slice(0, 8).map(item => `
          <div class="global-search-material-row">
            <strong>${esc(item.reference || '—')}</strong>
            <span>${esc(item.description || '')}</span>
            <span class="global-search-material-qty">${esc(item.quantity || '—')}</span>
          </div>
        `).join('')
      : '<div class="global-search-no-materials">Sin líneas de material.</div>';

    card.innerHTML = `
      <div class="global-search-result-top">
        <div>
          <div class="global-search-po">${esc(req.poNumber || 'PO pendiente')}</div>
          <h3>${esc(req.requestId || 'Solicitud')}</h3>
        </div>
        <span class="purchase-status-pill status-${String(req.status || '').toLowerCase()}">
          ${esc(generalPurchaseStatusLabel(req.status))}
        </span>
      </div>

      <div class="global-search-project-band">
        <div>
          <span>PROYECTO</span>
          <strong>${esc(req.projectId)} · ${esc(req.projectName || req.projectId)}</strong>
          <small>${esc(req.campus || '')}</small>
        </div>
        <div>
          <span>PEDIDO REALIZADO POR</span>
          <strong>${esc(req.creatorName || req.createdBy || '—')}</strong>
          <small>${esc(req.createdBy || '')}</small>
        </div>
      </div>

      <div class="global-search-meta-grid">
        <div><span>Proveedor</span><strong>${esc(req.supplier || '—')}</strong></div>
        <div><span>Destino</span><strong>${esc(req.destination || req.destinationType || '—')}</strong></div>
        <div><span>Fecha requerida</span><strong>${esc(req.requiredDate || '—')}</strong></div>
        <div><span>Fecha prevista</span><strong>${esc(req.expectedDeliveryDate || '—')}</strong></div>
      </div>

      <div class="global-search-materials">
        <div class="global-search-materials-head">
          <strong>Materiales</strong>
          <span>${materials.length} línea${materials.length === 1 ? '' : 's'}</span>
        </div>
        ${materialsHtml}
        ${materials.length > 8
          ? `<div class="global-search-more">+ ${materials.length - 8} líneas adicionales</div>`
          : ''}
      </div>

      ${req.notes
        ? `<div class="global-search-notes">${esc(req.notes)}</div>`
        : ''}

      <div class="global-search-result-actions">
        <button class="btn btn-secondary btn-sm global-open-project-btn" type="button">
          Abrir ${esc(req.projectId)}
        </button>
      </div>
    `;

    card.querySelector('.global-open-project-btn')
      ?.addEventListener('click', () => {
        const project = (state.bootstrap.projects || []).find(
          p => p.id === req.projectId
        );

        if (!project) return;

        openProject(project);

        if (state.bootstrap.modules && state.bootstrap.modules.purchases === true) {
          openPurchases();
        }
      });

    list.appendChild(card);
  });
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

      if (['site','equipment','mechanical','purchases','deliveries','warehouse'].includes(module.key)) {
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

      if (module.key === 'mechanical') {
        card.addEventListener('click', openMechanical);
      }

      if (module.key === 'warehouse') {
        card.addEventListener('click', openWarehouse);
      }

      el.modulesGrid.appendChild(card);
    });
}




/* MECHANICAL · SUBMITTALS INDIVIDUALES / READINESS POR HITO */
function openMechanical() {
  if (!state.currentProject) return;
  mechanicalSaveResetForProject();

  show(el.mechanicalView);
  el.mechanicalProjectSubtitle.textContent =
    `${state.currentProject.id} · ${state.currentProject.name || state.currentProject.id}`;

  // Borrar inmediatamente los datos del proyecto anterior: nunca mostrar ZAZ081 en ZAZ091.
  Object.assign(state.mechanical, {submittals:[],subpackages:[],milestones:[],links:[],foks:[],fokLinks:[],
    drawings:[],drawingLinks:[],drawingHistory:[],drawingsLoaded:false,drawingsLoading:true,
    canEdit:false,drawingCanEdit:false,drawingCanValidate:false,drawingEditing:null,drawingPendingLinks:null});
  el.mechanicalReadinessGrid.innerHTML = '<div class="mechanical-empty-panel">Cargando hitos del proyecto…</div>';
  for(const id of ['mechanicalMilestoneCount','mechanicalReadyCount','mechanicalRiskCount','mechanicalApprovedCount'])
    document.getElementById(id).textContent='—';
  document.getElementById('mechanicalApprovedMeta').textContent='Cargando proyecto…';
  el.mechanicalSubmittalBody.innerHTML='';
  document.getElementById('mechanicalSubpackageSummary').innerHTML='';
  document.getElementById('fokBody').innerHTML='';
  document.getElementById('mechDrawingRows').innerHTML = '';
  document.getElementById('mechDrawingEmpty').textContent = 'Cargando planos del proyecto…';
  document.getElementById('mechMyPending').innerHTML = '';
  document.getElementById('mechDrawingKpis').innerHTML = '';
  document.getElementById('mechDrawingOverview').textContent = 'Cargando planos del proyecto…';
  document.getElementById('mechNewDrawing').classList.add('hidden');
  closeDrawingModal();
  setMechanicalTab('milestones');
  setStatus(el.mechanicalStatus, 'Cargando preparación documental…');
  // Cargar readiness y después planos: el transporte usa un único iframe de respuesta.
  postToBackend('mechanicalReadiness', {projectId:state.currentProject.id});
}


function handleMechanicalReadiness(payload) {
  if (payload?.projectId && payload.projectId !== state.currentProject?.id) return;
  if (!payload?.ok) {
    setStatus(el.mechanicalStatus, payload?.message || 'No se ha podido cargar Mechanical.', 'error');
    return;
  }

  const m = state.mechanical;
  m.submittals = Array.isArray(payload.submittals) ? payload.submittals : [];
  m.subpackages = Array.isArray(payload.subpackages) ? payload.subpackages : [];
  m.milestones = Array.isArray(payload.milestones) ? payload.milestones : [];
  m.links = Array.isArray(payload.links) ? payload.links : [];
  m.foks = Array.isArray(payload.foks) ? payload.foks : [];
  m.fokLinks = Array.isArray(payload.fokLinks) ? payload.fokLinks : [];
  m.canEdit = payload.canEdit === true;

  el.newMechanicalSubmittalBtn.classList.toggle('hidden', !m.canEdit);

  populateMechanicalFilters();
  renderMechanicalSummary();
  renderMechanicalReadiness();
  renderMechanicalSubpackages();
  renderMechanicalSubmittals();
  populateFokFilters();
  renderFokTracker();
  renderDrawingOverview();
  clearStatus(el.mechanicalStatus);
  if(!m.drawingsLoaded && m.drawingsLoading) postToBackend('mechanicalDrawingList',{projectId:state.currentProject.id});
}


function mechanicalReadinessStatusLabel(status) {
  return ({
    READY:'LISTO PARA EJECUTAR',
    AT_RISK:'EN RIESGO',
    BLOCKED:'BLOQUEADO',
    NOT_CONFIGURED:'SIN CONFIGURAR'
  })[status] || status || 'SIN CONFIGURAR';
}


function mechanicalSubmittalStatusLabel(status) {
  return ({
    A:'A · Aprobado',
    B:'B',
    C:'C',
    D:'D · No revisado / no aplica',
    SUBMITTED:'Enviado',
    PENDING:'Pendiente',
    REJECTED:'Rechazado'
  })[status] || status || 'Pendiente';
}



function fokDocStatusLabel(status) {
  return ({
    PENDING:'Pendiente',
    IN_PROGRESS:'En preparación',
    READY:'Lista',
    COPIED:'Copiada'
  })[status] || status || 'Pendiente';
}

function fokExecutionStatusLabel(status) {
  return ({
    NOT_PLANNED:'No planificado',
    PLANNED:'Planificado',
    INSPECTED:'Inspección realizada',
    APPROVED:'Aprobado',
    REINSPECTION:'Reinspección'
  })[status] || status || 'No planificado';
}

function mechanicalDaysText(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  if (n === 0) return 'HOY';
  if (n > 0) return `${n} d`;
  return `${Math.abs(n)} d tarde`;
}


function mechanicalForecastText(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  if (n === 0) return '0 d';
  return n > 0 ? `+${n} d` : `${n} d`;
}


function renderMechanicalSummary() {
  const milestones = state.mechanical.milestones || [];
  const submittals = state.mechanical.submittals || [];

  const configured = milestones.filter(x => (x.readiness?.requiredSubmittals || 0) > 0);
  const ready = configured.filter(x => x.readiness?.readinessStatus === 'READY');
  const risk = configured.filter(x =>
    ['AT_RISK','BLOCKED'].includes(x.readiness?.readinessStatus)
  );
  const approved = submittals.filter(x => x.status === 'A').length;

  el.mechanicalMilestoneCount.textContent = configured.length;
  el.mechanicalReadyCount.textContent = ready.length;
  el.mechanicalRiskCount.textContent = risk.length;
  el.mechanicalApprovedCount.textContent = approved;
  el.mechanicalApprovedMeta.textContent = `de ${submittals.length} submittals`;
}


function renderMechanicalReadiness() {
  const milestones = state.mechanical.milestones || [];
  el.mechanicalReadinessGrid.innerHTML = '';

  if (!milestones.length) {
    el.mechanicalReadinessGrid.innerHTML = `
      <div class="mechanical-empty-panel">
        No hay hitos Mechanical/General en Deliveries. Crea primero el hito constructivo.
      </div>`;
    return;
  }

  milestones.forEach(milestone => {
    const r = milestone.readiness || {
      readinessStatus:'NOT_CONFIGURED',
      readinessIndex:0,
      approvedSubmittals:0,
      requiredSubmittals:0,
      blockers:0,
      daysToMilestone:null,
      forecastMarginDays:null,
      linkedSubmittals:[],
      statusCounts:{}
    };

    const card = document.createElement('article');
    card.className = `readiness-kpi-panel ${String(r.readinessStatus || '').toLowerCase().replace('_','-')}`;

    const grouped = {};
    (r.linkedSubmittals || []).forEach(item => {
      const key = item.subpackage || 'Sin subpaquete';
      (grouped[key] ||= []).push(item);
    });

    const groupsHtml = Object.keys(grouped).length
      ? Object.keys(grouped).sort().map(group => `
          <div class="readiness-subpackage-group">
            <div class="readiness-subpackage-title">
              <strong>${esc(group)}</strong>
              <span>${grouped[group].filter(x => x.status === 'A').length}/${grouped[group].length} en A</span>
            </div>
            ${grouped[group].map(item => `
              <div class="readiness-package-row ${item.status === 'A' ? 'met' : 'blocking'}">
                <div>
                  <strong>${esc(item.title)}</strong>
                  <span>${esc(item.technicalNumber || item.trackerNumber || 'Sin referencia')} · Rev ${esc(item.revision || '—')}</span>
                </div>
                <div class="readiness-package-requirement">
                  <span class="submittal-status status-${String(item.status || '').toLowerCase()}">${esc(mechanicalSubmittalStatusLabel(item.status))}</span>
                  <small>${item.status === 'A' ? 'cumple' : 'debe alcanzar A'}</small>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')
      : `<div class="readiness-no-packages">Sin submittals asociados a este hito.</div>`;

    const blockerHeadline =
      r.blockers > 0
        ? `${r.blockers} submittal${r.blockers === 1 ? '' : 's'} pendiente${r.blockers === 1 ? '' : 's'} de A`
        : r.requiredSubmittals > 0
          ? 'Sin bloqueos documentales'
          : 'Pendiente de definir los documentos aplicables';

    card.innerHTML = `
      <div class="readiness-panel-head">
        <div>
          <div class="readiness-date">${esc(milestone.date || 'Sin fecha')}</div>
          <h3>${esc(milestone.title || 'Hito')}</h3>
          <p>${esc(milestone.type || 'CONSTRUCTIVO')} · ${esc(milestone.discipline || 'MECHANICAL')}</p>
        </div>
        <span class="readiness-state state-${String(r.readinessStatus || '').toLowerCase().replace('_','-')}">
          ${esc(mechanicalReadinessStatusLabel(r.readinessStatus))}
        </span>
      </div>

      <div class="readiness-kpi-grid">
        <div class="readiness-kpi primary">
          <span>ÍNDICE DE PREPARACIÓN</span>
          <strong>${Number(r.readinessIndex || 0)}</strong>
          <small>submittals en A / 100</small>
        </div>
        <div class="readiness-kpi">
          <span>SUBMITTALS EN A</span>
          <strong>${Number(r.approvedSubmittals || 0)} / ${Number(r.requiredSubmittals || 0)}</strong>
          <small>documentos requeridos</small>
        </div>
        <div class="readiness-kpi ${r.blockers ? 'danger' : ''}">
          <span>BLOQUEOS</span>
          <strong>${Number(r.blockers || 0)}</strong>
          <small>${esc(blockerHeadline)}</small>
        </div>
        <div class="readiness-kpi">
          <span>DÍAS HASTA EL HITO</span>
          <strong>${esc(mechanicalDaysText(r.daysToMilestone))}</strong>
          <small>${esc(milestone.date || '—')}</small>
        </div>
        <div class="readiness-kpi ${Number(r.forecastMarginDays) < 0 ? 'danger' : ''}">
          <span>MARGEN PREVISTO</span>
          <strong>${esc(mechanicalForecastText(r.forecastMarginDays))}</strong>
          <small>última aprobación prevista frente al hito</small>
        </div>
      </div>

      <div class="readiness-associated-head">
        <div>
          <strong>Submittals aplicables al hito</strong>
          <span>${Number(r.requiredSubmittals || 0)} documento${Number(r.requiredSubmittals || 0) === 1 ? '' : 's'} requerido${Number(r.requiredSubmittals || 0) === 1 ? '' : 's'}</span>
        </div>
        ${state.mechanical.canEdit
          ? `<button type="button" class="btn btn-secondary btn-sm readiness-manage-btn">Definir documentos aplicables</button>`
          : ''}
      </div>

      <div class="readiness-packages-list">
        ${groupsHtml}
      </div>

      ${renderMilestoneFokGate(milestone)}
      ${renderMilestoneDrawingGate(milestone)}

      <div class="readiness-action ${(r.blockers || milestone.fokReadiness?.blockers) ? 'has-action' : 'no-action'}">
        <strong>Acción requerida</strong>
        <span>${
          (r.blockers || milestone.fokReadiness?.blockers)
            ? [
                r.blockers ? `${r.blockers} submittal${r.blockers === 1 ? '' : 's'} pendiente${r.blockers === 1 ? '' : 's'} de A` : '',
                milestone.fokReadiness?.blockers ? `${milestone.fokReadiness.blockers} FoK pendiente${milestone.fokReadiness.blockers === 1 ? '' : 's'} de aprobación` : ''
              ].filter(Boolean).join(' · ')
            : 'Ninguna. Los condicionantes configurados para el hito están cumplidos.'
        }</span>
      </div>
    `;

    card.querySelector('.readiness-manage-btn')?.addEventListener('click', () => {
      openMilestoneSubmittalModal(milestone);
    });

    el.mechanicalReadinessGrid.appendChild(card);
  });

  bindMilestoneFokButtons();
}


function populateMechanicalFilters() {
  const current = el.mechanicalSubpackageFilter.value;

  el.mechanicalSubpackageFilter.innerHTML =
    '<option value="">Todos los subpaquetes</option>' +
    (state.mechanical.subpackages || [])
      .map(x => `<option value="${esc(x)}">${esc(x)}</option>`)
      .join('');

  if ([...el.mechanicalSubpackageFilter.options].some(o => o.value === current)) {
    el.mechanicalSubpackageFilter.value = current;
  }
}


function renderMechanicalSubpackages() {
  const submittals = state.mechanical.submittals || [];
  const groups = {};

  submittals.forEach(item => {
    const key = item.subpackage || 'Sin subpaquete';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  el.mechanicalSubpackageSummary.innerHTML = Object.keys(groups)
    .sort()
    .map(name => {
      const items = groups[name];
      const approved = items.filter(x => x.status === 'A').length;
      const active = items.filter(x => !['A','D'].includes(x.status)).length;
      return `
        <button class="subpackage-summary-card" type="button" data-subpackage="${esc(name)}">
          <span>${esc(name)}</span>
          <strong>${approved}/${items.length}</strong>
          <small>${approved} en A · ${active} abiertos</small>
        </button>`;
    }).join('');

  el.mechanicalSubpackageSummary.querySelectorAll('.subpackage-summary-card').forEach(btn => {
    btn.addEventListener('click', () => {
      el.mechanicalSubpackageFilter.value = btn.dataset.subpackage;
      renderMechanicalSubmittals();
    });
  });
}


function renderMechanicalSubmittals() {
  const q = el.mechanicalSubmittalSearch.value.trim().toLowerCase();
  const subpackage = el.mechanicalSubpackageFilter.value;
  const status = el.mechanicalSubmittalStatusFilter.value;

  const rows = (state.mechanical.submittals || []).filter(item => {
    if (subpackage && item.subpackage !== subpackage) return false;
    if (status && item.status !== status) return false;

    if (q) {
      const haystack = [
        item.trackerNumber,
        item.technicalNumber,
        item.title,
        item.subpackage,
        item.owner,
        item.status
      ].join(' ').toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  el.mechanicalSubmittalBody.innerHTML = '';

  if (!rows.length) {
    el.mechanicalSubmittalBody.innerHTML = `
      <tr><td colspan="8"><div class="empty-state">No hay submittals que coincidan con los filtros.</div></td></tr>`;
    return;
  }

  rows.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        <strong>${esc(item.title)}</strong>
        <small>${esc(item.technicalNumber || item.trackerNumber || 'Sin referencia')}</small>
      </td>
      <td>${esc(item.subpackage || '—')}</td>
      <td><span class="submittal-status status-${String(item.status || '').toLowerCase()}">${esc(mechanicalSubmittalStatusLabel(item.status))}</span></td>
      <td>${esc(item.revision || '—')}</td>
      <td>${esc(item.owner || '—')}</td>
      <td>${esc(item.forecastApprovalDate || item.plannedDate || '—')}</td>
      <td><strong>${Number(item.linkedMilestones || 0)}</strong></td>
      <td>${state.mechanical.canEdit ? '<button type="button" class="btn btn-secondary btn-sm submittal-edit-btn">Editar</button>' : ''}</td>
    `;

    tr.querySelector('.submittal-edit-btn')?.addEventListener('click', () => {
      openMechanicalSubmittalModal(item);
    });

    el.mechanicalSubmittalBody.appendChild(tr);
  });
}



function renderMilestoneFokGate(milestone) {
  const r = milestone.fokReadiness || {
    requiredFoks:0,
    approvedFoks:0,
    blockers:0,
    docReuseAvailable:0,
    readinessStatus:'NOT_CONFIGURED',
    linkedFoks:[]
  };

  const rows = (r.linkedFoks || []).map(item => `
    <div class="fok-gate-row">
      <div>
        <strong>${esc(item.fokId)} · ${esc(item.benchmarkName)}</strong>
        <span>${esc(item.category || 'Mechanical')}</span>
      </div>
      <div class="fok-gate-status">
        <span class="fok-chip doc-${String(item.docStatus || '').toLowerCase()}">${esc(fokDocStatusLabel(item.docStatus))}</span>
        <span class="fok-chip exec-${String(item.executionStatus || '').toLowerCase()}">${esc(fokExecutionStatusLabel(item.executionStatus))}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="fok-gate">
      <div class="readiness-associated-head">
        <div>
          <strong>FoK requeridos antes del hito</strong>
          <span>${r.approvedFoks}/${r.requiredFoks} aprobados${r.docReuseAvailable ? ` · ${r.docReuseAvailable} documentación reutilizable` : ''}</span>
        </div>
        ${state.mechanical.canEdit
          ? `<button type="button" class="btn btn-secondary btn-sm fok-manage-btn" data-milestone="${esc(milestone.milestoneId)}">Definir FoK aplicables</button>`
          : ''}
      </div>
      <div class="fok-gate-body">
        ${rows || '<div class="readiness-no-packages">Sin FoK asociados a este hito.</div>'}
      </div>
    </div>
  `;
}


function bindMilestoneFokButtons() {
  el.mechanicalReadinessGrid.querySelectorAll('.fok-manage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const milestone = state.mechanical.milestones.find(
        x => x.milestoneId === btn.dataset.milestone
      );
      if (milestone) openMilestoneFokModal(milestone);
    });
  });
}


function populateFokFilters() {
  const current = el.fokCategoryFilter.value;
  const categories = [...new Set(
    (state.mechanical.foks || []).map(x => x.category).filter(Boolean)
  )].sort();

  el.fokCategoryFilter.innerHTML =
    '<option value="">Todas las categorías</option>' +
    categories.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');

  if ([...el.fokCategoryFilter.options].some(o => o.value === current)) {
    el.fokCategoryFilter.value = current;
  }
}


function renderFokTracker() {
  const q = el.fokSearch.value.trim().toLowerCase();
  const category = el.fokCategoryFilter.value;
  const execution = el.fokExecutionFilter.value;

  const all = state.mechanical.foks || [];
  const copyAvailable = all.filter(x => x.copyAvailable);

  el.fokCrossSiteNotice.classList.toggle('hidden', !copyAvailable.length);
  el.fokCrossSiteNotice.innerHTML = copyAvailable.length
    ? `<strong>${copyAvailable.length} FoK con documentación disponible en el otro proyecto.</strong>
       Puedes reutilizar la documentación sin marcar como realizada la inspección del proyecto actual.`
    : '';

  const rows = all.filter(item => {
    if (category && item.category !== category) return false;
    if (execution && item.executionStatus !== execution) return false;

    if (q) {
      const haystack = [
        item.fokId,item.category,item.benchmarkName,item.doding,item.owner
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  el.fokBody.innerHTML = '';

  rows.forEach(item => {
    const tr = document.createElement('tr');
    const siblingText = item.siblingProject
      ? `${item.siblingProject}: ${fokDocStatusLabel(item.siblingDocStatus)}`
      : '—';

    tr.innerHTML = `
      <td>
        <strong>${esc(item.fokId)} · ${esc(item.benchmarkName)}</strong>
        <small>${esc(item.doding || '')}</small>
      </td>
      <td>${esc(item.category || '—')}</td>
      <td><span class="fok-chip doc-${String(item.docStatus || '').toLowerCase()}">${esc(fokDocStatusLabel(item.docStatus))}</span></td>
      <td><span class="fok-chip exec-${String(item.executionStatus || '').toLowerCase()}">${esc(fokExecutionStatusLabel(item.executionStatus))}</span></td>
      <td>${esc(item.inspectionDate || '—')}</td>
      <td>
        <div class="fok-sibling-cell">
          <span>${esc(siblingText)}</span>
          ${item.copyAvailable
            ? `<button type="button" class="btn btn-secondary btn-sm fok-copy-btn">Disponible en ${esc(item.siblingProject)} · Copiar</button>`
            : ''}
        </div>
      </td>
      <td>${state.mechanical.canEdit ? '<button type="button" class="btn btn-secondary btn-sm fok-edit-btn">Editar</button>' : ''}</td>
    `;

    tr.querySelector('.fok-edit-btn')?.addEventListener('click', () => openFokEditModal(item));
    tr.querySelector('.fok-copy-btn')?.addEventListener('click', () => copyFokDocumentation(item));

    el.fokBody.appendChild(tr);
  });

  if (!rows.length) {
    el.fokBody.innerHTML = '<tr><td colspan="7"><div class="empty-state">No hay FoK que coincidan con los filtros.</div></td></tr>';
  }
}


// MECHANICAL: one active save per action. Never allow a second click before acknowledgement.
const mechanicalSaveLocks = new Map();
function mechanicalSaveStart(action, button, modal) {
  if (mechanicalSaveLocks.has(action)) return false;
  const projectId=state.currentProject?.id;
  if (!projectId) return false;
  mechanicalSaveLocks.set(action,{button,modal,projectId,label:button?.textContent||'Guardar'});
  if(button){button.disabled=true;button.textContent='Guardando…';button.setAttribute('aria-busy','true');}
  return true;
}
function mechanicalSaveFinish(action,success,message) {
  const pending=mechanicalSaveLocks.get(action);
  if(!pending) return false;
  mechanicalSaveLocks.delete(action);
  if(pending.button){pending.button.disabled=false;pending.button.textContent=pending.label;pending.button.removeAttribute('aria-busy');}
  if(pending.projectId!==state.currentProject?.id) return false;
  if(success && pending.modal) pending.modal.classList.add('hidden');
  if(!success) setStatus(el.mechanicalStatus,message||'No se ha podido guardar. Comprueba los datos y vuelve a intentarlo.','error');
  return true;
}
function mechanicalSaveResetForProject() {
  for(const pending of mechanicalSaveLocks.values()) {
    if(pending.button){pending.button.disabled=false;pending.button.textContent=pending.label;pending.button.removeAttribute('aria-busy');}
  }
  mechanicalSaveLocks.clear();
}

function openFokEditModal(item) {
  if(mechanicalSaveLocks.has('fokProjectSave')) return;
  state.mechanical.selectedFok = item;
  el.fokEditId.value = item.fokId;
  el.fokEditTitle.textContent = `${item.fokId} · ${item.benchmarkName}`;
  el.fokEditMeta.textContent = `${item.category || 'Mechanical'} · ${state.currentProject.id}`;
  el.fokDocStatus.value = item.docStatus || 'PENDING';
  el.fokOwner.value = item.owner || '';
  el.fokReportLink.value = item.reportLink || '';
  el.fokInspectionToolLink.value = item.inspectionToolLink || '';
  el.fokExecutionStatus.value = item.executionStatus || 'NOT_PLANNED';
  el.fokInspectionDate.value = item.inspectionDate || '';
  el.fokComments.value = item.comments || '';
  el.fokEditModal.classList.remove('hidden');
}


function closeFokEditModal() {
  if(mechanicalSaveLocks.has('fokProjectSave')) return;
  el.fokEditModal.classList.add('hidden');
  state.mechanical.selectedFok = null;
}


function submitFokEdit(event) {
  event.preventDefault();
  const item = state.mechanical.selectedFok;
  if (!item || !state.currentProject) return;
  if(checkSessionExpiry_()) return;
  if(!mechanicalSaveStart('fokProjectSave',el.fokEditForm.querySelector('[type=submit]'),el.fokEditModal)) return;

  postToBackend('fokProjectSave', {
    projectId:state.currentProject.id,
    fokId:item.fokId,
    docStatus:el.fokDocStatus.value,
    executionStatus:el.fokExecutionStatus.value,
    owner:el.fokOwner.value,
    inspectionDate:el.fokInspectionDate.value,
    reportLink:el.fokReportLink.value,
    comments:el.fokComments.value,
    inspectionToolLink:el.fokInspectionToolLink.value
  });
}


function copyFokDocumentation(item) {
  if (!window.confirm(
    `Copiar la documentación de ${item.fokId} desde ${item.siblingProject} a ${state.currentProject.id}?\n\nLa inspección y el estado de ejecución NO se copiarán.`
  )) return;

  postToBackend('fokCopyDocumentation', {
    projectId:state.currentProject.id,
    fokId:item.fokId
  });
}


function openMilestoneFokModal(milestone) {
  state.mechanical.selectedFokMilestone = milestone;
  state.mechanical.fokDraftSelection = new Set(
    (state.mechanical.fokLinks || [])
      .filter(x => x.milestoneId === milestone.milestoneId)
      .map(x => x.fokId)
  );

  el.milestoneFokModalTitle.textContent = milestone.title || 'Hito';
  el.milestoneFokModalMeta.textContent = `${milestone.date || 'Sin fecha'} · ${state.currentProject.id}`;
  el.milestoneFokSearch.value = '';
  renderMilestoneFokSelector();
  el.milestoneFokModal.classList.remove('hidden');
}


function closeMilestoneFokModal() {
  if(mechanicalSaveLocks.has('milestoneFokLinksSaveBatch')) return;
  el.milestoneFokModal.classList.add('hidden');
  state.mechanical.selectedFokMilestone = null;
  state.mechanical.fokDraftSelection = new Set();
}


function visibleMilestoneFoks() {
  const q = el.milestoneFokSearch.value.trim().toLowerCase();
  return (state.mechanical.foks || []).filter(item => {
    if (!q) return true;
    return [item.fokId,item.category,item.benchmarkName,item.doding]
      .join(' ').toLowerCase().includes(q);
  });
}


function renderMilestoneFokSelector() {
  const items = visibleMilestoneFoks();
  const selected = state.mechanical.fokDraftSelection;
  const groups = {};

  items.forEach(item => {
    const key = item.category || 'General';
    (groups[key] ||= []).push(item);
  });

  el.milestoneFokGroups.innerHTML = Object.keys(groups).sort().map(group => `
    <section class="milestone-submittal-group">
      <div class="milestone-submittal-group-head">
        <div>
          <strong>${esc(group)}</strong>
          <span>${groups[group].filter(x => selected.has(x.fokId)).length}/${groups[group].length} seleccionados</span>
        </div>
      </div>
      <div class="milestone-submittal-group-body">
        ${groups[group].map(item => `
          <label class="milestone-submittal-option">
            <input type="checkbox" value="${esc(item.fokId)}" ${selected.has(item.fokId) ? 'checked' : ''}>
            <span class="milestone-option-main">
              <strong>${esc(item.fokId)} · ${esc(item.benchmarkName)}</strong>
              <small>${esc(item.doding || 'Sin DoDing')}</small>
            </span>
            <span class="fok-chip exec-${String(item.executionStatus || '').toLowerCase()}">${esc(fokExecutionStatusLabel(item.executionStatus))}</span>
          </label>
        `).join('')}
      </div>
    </section>
  `).join('');

  el.milestoneFokGroups.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) selected.add(input.value);
      else selected.delete(input.value);
      el.milestoneFokSelectedCount.textContent = selected.size;
    });
  });

  el.milestoneFokSelectedCount.textContent = selected.size;
}


function selectVisibleFoks(checked) {
  visibleMilestoneFoks().forEach(item => {
    if (checked) state.mechanical.fokDraftSelection.add(item.fokId);
    else state.mechanical.fokDraftSelection.delete(item.fokId);
  });
  renderMilestoneFokSelector();
}


function saveMilestoneFokLinks() {
  const milestone = state.mechanical.selectedFokMilestone;
  if (!milestone || !state.currentProject) return;

  if(checkSessionExpiry_()) return;
  if(!mechanicalSaveStart('milestoneFokLinksSaveBatch',el.saveMilestoneFokBtn,el.milestoneFokModal)) return;
  postToBackend('milestoneFokLinksSaveBatch', {
    projectId:state.currentProject.id,
    milestoneId:milestone.milestoneId,
    fokIds:[...state.mechanical.fokDraftSelection]
  });
}


function buildSubpackageSelector(selected = '') {
  const list = [...new Set(state.mechanical.subpackages || [])].sort();
  const values = list.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');

  el.mechanicalSubmittalSubpackage.innerHTML =
    '<option value="">Selecciona subpaquete…</option>' +
    values +
    '<option value="__NEW__">+ Crear nuevo subpaquete</option>';

  if (selected && list.includes(selected)) {
    el.mechanicalSubmittalSubpackage.value = selected;
  } else if (selected) {
    el.mechanicalSubmittalSubpackage.value = '__NEW__';
    el.mechanicalNewSubpackage.value = selected;
  } else {
    el.mechanicalSubmittalSubpackage.value = '';
  }

  toggleNewSubpackage();
}


function toggleNewSubpackage() {
  const isNew = el.mechanicalSubmittalSubpackage.value === '__NEW__';
  el.mechanicalNewSubpackageWrap.classList.toggle('hidden', !isNew);
  if (!isNew) el.mechanicalNewSubpackage.value = '';
}


function openMechanicalSubmittalModal(item = null) {
  state.mechanical.selectedSubmittal = item;

  el.mechanicalSubmittalModalTitle.textContent =
    item ? 'Editar submittal' : 'Añadir submittal';

  el.mechanicalSubmittalId.value = item?.submittalId || '';
  buildSubpackageSelector(item?.subpackage || '');
  el.mechanicalSubmittalTrackerNumber.value = item?.trackerNumber || '';
  el.mechanicalSubmittalTechnicalNumber.value = item?.technicalNumber || '';
  el.mechanicalSubmittalTitle.value = item?.title || '';
  el.mechanicalSubmittalStatus.value = item?.status || 'PENDING';
  el.mechanicalSubmittalRevision.value = item?.revision || '';
  el.mechanicalSubmittalOwner.value = item?.owner || '';
  el.mechanicalSubmittalPlannedDate.value = item?.plannedDate || '';
  el.mechanicalSubmittalForecast.value = item?.forecastApprovalDate || '';
  el.mechanicalSubmittalNotes.value = item?.notes || '';
  el.deleteMechanicalSubmittalBtn.classList.toggle('hidden', !item);

  el.mechanicalSubmittalModal.classList.remove('hidden');
}


function closeMechanicalSubmittalModal() {
  if(mechanicalSaveLocks.has('mechanicalSubmittalSave')) return;
  el.mechanicalSubmittalModal.classList.add('hidden');
  state.mechanical.selectedSubmittal = null;
}


function submitMechanicalSubmittal(event) {
  event.preventDefault();
  if (!state.currentProject) return;

  const selected = el.mechanicalSubmittalSubpackage.value;
  const subpackage =
    selected === '__NEW__'
      ? el.mechanicalNewSubpackage.value.trim()
      : selected;

  if (!subpackage) {
    window.alert('Selecciona o crea un subpaquete.');
    return;
  }

  if(checkSessionExpiry_()) return;
  if(!mechanicalSaveStart('mechanicalSubmittalSave',el.mechanicalSubmittalForm.querySelector('[type=submit]'),el.mechanicalSubmittalModal)) return;
  postToBackend('mechanicalSubmittalSave', {
    projectId:state.currentProject.id,
    submittalId:el.mechanicalSubmittalId.value,
    subpackage:subpackage,
    trackerNumber:el.mechanicalSubmittalTrackerNumber.value,
    technicalNumber:el.mechanicalSubmittalTechnicalNumber.value,
    title:el.mechanicalSubmittalTitle.value,
    status:el.mechanicalSubmittalStatus.value,
    revision:el.mechanicalSubmittalRevision.value,
    owner:el.mechanicalSubmittalOwner.value,
    plannedDate:el.mechanicalSubmittalPlannedDate.value,
    forecastApprovalDate:el.mechanicalSubmittalForecast.value,
    notes:el.mechanicalSubmittalNotes.value
  });
}


function deleteMechanicalSubmittal() {
  const item = state.mechanical.selectedSubmittal;
  if (!item || !state.currentProject) return;

  if (!window.confirm(`¿Eliminar el submittal "${item.title}"? También se quitará de los hitos asociados.`)) return;

  postToBackend('mechanicalSubmittalDelete', {
    projectId:state.currentProject.id,
    submittalId:item.submittalId
  });
}


function openMilestoneSubmittalModal(milestone) {
  state.mechanical.selectedMilestone = milestone;

  const selected = new Set(
    (state.mechanical.links || [])
      .filter(link => link.milestoneId === milestone.milestoneId)
      .map(link => link.submittalId)
  );

  state.mechanical.milestoneDraftSelection = selected;

  el.milestoneSubmittalModalTitle.textContent = milestone.title || 'Hito';
  el.milestoneSubmittalModalMeta.textContent =
    `${milestone.date || 'Sin fecha'} · ${milestone.type || 'CONSTRUCTIVO'}`;
  el.milestoneSubmittalSearch.value = '';

  renderMilestoneSubmittalSelector();
  el.milestoneSubmittalModal.classList.remove('hidden');
}


function closeMilestoneSubmittalModal() {
  if(mechanicalSaveLocks.has('milestoneSubmittalLinksSaveBatch')) return;
  el.milestoneSubmittalModal.classList.add('hidden');
  state.mechanical.selectedMilestone = null;
  state.mechanical.milestoneDraftSelection = new Set();
}


function visibleMilestoneSubmittals() {
  const q = el.milestoneSubmittalSearch.value.trim().toLowerCase();

  return (state.mechanical.submittals || []).filter(item => {
    if (!q) return true;

    const haystack = [
      item.trackerNumber,
      item.technicalNumber,
      item.title,
      item.subpackage,
      item.owner
    ].join(' ').toLowerCase();

    return haystack.includes(q);
  });
}


function renderMilestoneSubmittalSelector() {
  const items = visibleMilestoneSubmittals();
  const selected = state.mechanical.milestoneDraftSelection;
  const groups = {};

  items.forEach(item => {
    const key = item.subpackage || 'Sin subpaquete';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  el.milestoneSubmittalGroups.innerHTML = Object.keys(groups).sort().map(group => {
    const rows = groups[group];

    return `
      <section class="milestone-submittal-group">
        <div class="milestone-submittal-group-head">
          <div>
            <strong>${esc(group)}</strong>
            <span>${rows.filter(x => selected.has(x.submittalId)).length}/${rows.length} seleccionados</span>
          </div>
          <button class="group-toggle-btn" type="button">Ver documentos</button>
        </div>

        <div class="milestone-submittal-group-body">
          ${rows.map(item => `
            <label class="milestone-submittal-option">
              <input
                type="checkbox"
                value="${esc(item.submittalId)}"
                ${selected.has(item.submittalId) ? 'checked' : ''}
              >
              <span class="milestone-option-main">
                <strong>${esc(item.title)}</strong>
                <small>${esc(item.technicalNumber || item.trackerNumber || 'Sin referencia')} · Rev ${esc(item.revision || '—')}</small>
              </span>
              <span class="submittal-status status-${String(item.status || '').toLowerCase()}">${esc(mechanicalSubmittalStatusLabel(item.status))}</span>
            </label>
          `).join('')}
        </div>
      </section>`;
  }).join('');

  el.milestoneSubmittalGroups.querySelectorAll('.milestone-submittal-option input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) selected.add(input.value);
      else selected.delete(input.value);
      updateMilestoneSelectedCount();
    });
  });

  el.milestoneSubmittalGroups.querySelectorAll('.group-toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.milestone-submittal-group');
      section.classList.toggle('collapsed');
      button.textContent = section.classList.contains('collapsed')
        ? 'Ver documentos'
        : 'Ocultar';
    });
  });

  updateMilestoneSelectedCount();
}


function updateMilestoneSelectedCount() {
  el.milestoneSelectedCount.textContent =
    state.mechanical.milestoneDraftSelection.size;
}


function selectVisibleMilestoneSubmittals(checked) {
  const selected = state.mechanical.milestoneDraftSelection;

  visibleMilestoneSubmittals().forEach(item => {
    if (checked) selected.add(item.submittalId);
    else selected.delete(item.submittalId);
  });

  renderMilestoneSubmittalSelector();
}


function saveMilestoneSubmittalLinks() {
  const milestone = state.mechanical.selectedMilestone;
  if (!milestone || !state.currentProject) return;

  if(checkSessionExpiry_()) return;
  if(!mechanicalSaveStart('milestoneSubmittalLinksSaveBatch',el.saveMilestoneSubmittalLinksBtn,el.milestoneSubmittalModal)) return;
  postToBackend('milestoneSubmittalLinksSaveBatch', {
    projectId:state.currentProject.id,
    milestoneId:milestone.milestoneId,
    submittalIds:[...state.mechanical.milestoneDraftSelection]
  });
}


function handleMechanicalMutation(payload,action) {
  const success=payload?.ok===true;
  const hadLock=mechanicalSaveLocks.has(action);
  if(hadLock) mechanicalSaveFinish(action,success,payload?.message);
  if(!success) {
    if(!hadLock) setStatus(el.mechanicalStatus,payload?.message||'No se ha podido guardar el cambio.','error');
    return;
  }
  // Acknowledge immediately; never keep the dialog open waiting for the expensive refresh.
  if(action==='fokProjectSave') state.mechanical.selectedFok=null;
  if(action==='milestoneFokLinksSaveBatch') state.mechanical.selectedFokMilestone=null;
  if(action==='mechanicalSubmittalSave') state.mechanical.selectedSubmittal=null;
  if(action==='milestoneSubmittalLinksSaveBatch') state.mechanical.selectedMilestone=null;
  if(!hadLock) {
    closeMechanicalSubmittalModal();
    closeMilestoneSubmittalModal();
  }
  setStatus(el.mechanicalStatus,(payload.message||'Guardado correctamente.')+' Actualizando datos…','success');
  // Refresh in the background. This is not part of the save transaction.
  if(state.currentProject) postToBackend('mechanicalReadiness',{projectId:state.currentProject.id});
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
  wc.selectedProject = 'ALL';
  el.workControlSubtitle.textContent = `Control de fichajes, partes e incidencias · todos tus proyectos autorizados.`;
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
  wc.monthParts = Array.isArray(payload.monthParts) ? payload.monthParts : [];
  wc.monthIncidents = Array.isArray(payload.monthIncidents) ? payload.monthIncidents : [];
  wc.presence = Array.isArray(payload.presence) ? payload.presence : [];
  selectWorkDateLocal(wc.selectedDate);
  renderWorkProjectScope();
  renderWorkPresence();
  renderWorkCalendar();
  renderWorkDay();
  clearStatus(el.workControlStatus);
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
  state.workControl.selectedProject = el.workProjectScope.value || 'ALL';
  renderWorkDay();
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


function selectWorkDateLocal(dateKey) {
  const wc = state.workControl;
  wc.selectedDate = dateKey;
  wc.parts = (wc.monthParts || []).filter(p => p.date === dateKey);
  wc.incidents = (wc.monthIncidents || []).filter(i => (i.date || i.affectedDate) === dateKey);
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
    b.addEventListener('click',()=>{
      selectWorkDateLocal(key);
      renderWorkCalendar();
      renderWorkDay();
    });
    el.workCalendarGrid.appendChild(b);
  }
  const totalCells=startPad+last.getDate(), tail=(7-(totalCells%7))%7;
  for(let i=1;i<=tail;i++){ const b=document.createElement('button'); b.type='button'; b.className='day other'; b.textContent=i; b.disabled=true; el.workCalendarGrid.appendChild(b); }
}

function handleWorkControlMonth(payload){
  if(!payload?.ok){
    setStatus(el.workControlStatus,payload?.message||'No se pudo cargar el mes.','error');
    return;
  }

  const wc = state.workControl;
  wc.monthDays = payload.days || [];
  wc.monthParts = Array.isArray(payload.parts) ? payload.parts : [];
  wc.monthIncidents = Array.isArray(payload.incidents) ? payload.incidents : [];

  if(Array.isArray(payload.scopeProjects) && payload.scopeProjects.length){
    wc.projects = payload.scopeProjects.map(id => ({id:id,name:id,campus:''}));
    renderWorkProjectScope();
  }

  const year = wc.currentMonth.getFullYear();
  const month = wc.currentMonth.getMonth();
  const selected = new Date(`${wc.selectedDate}T12:00:00`);

  if (selected.getFullYear() !== year || selected.getMonth() !== month) {
    const today = new Date();
    wc.selectedDate =
      today.getFullYear() === year && today.getMonth() === month
        ? workDateKey(today)
        : workDateKey(new Date(year, month, 1));
  }

  selectWorkDateLocal(wc.selectedDate);
  renderWorkCalendar();
  renderWorkDay();
  clearStatus(el.workControlStatus);
}
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

function filteredWorkParts(){
  const project = state.workControl.selectedProject === 'ALL' ? '' : state.workControl.selectedProject;
  const sub = el.workSubcontractorFilter.value;
  const stateFilter = el.workStateFilter.value;

  return (state.workControl.parts || []).filter(p =>
    (!project || p.project === project) &&
    (!sub || p.subcontractor === sub) &&
    (!stateFilter || p.status === stateFilter)
  );
}
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

function handleWorkControlMutation(payload){if(!payload?.ok){setStatus(el.workControlStatus,payload?.message||'No se ha podido guardar el cambio.','error');return;}closeWorkCorrection();setStatus(el.workControlStatus,'Cambio guardado.','success');
  postToBackend('workControlMonth', {
    project:'ALL',
    month:workMonthKey(state.workControl.currentMonth)
  });
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

function openEquipmentGlobal(){
  show(el.equipmentGlobalView);
  renderEquipmentSiteLabels();
  refreshEquipmentPositions();
}

function refreshEquipmentPositions(){
  setStatus(el.equipmentGlobalStatus,'Actualizando posiciones…');
  if(el.refreshEquipmentGlobalBtn){
    el.refreshEquipmentGlobalBtn.disabled = true;
    el.refreshEquipmentGlobalBtn.textContent = 'ACTUALIZANDO…';
  }
  postToBackend('equipmentLocationsGlobal',{});
}
function handleEquipmentLocationsGlobal(payload){
  if(el.refreshEquipmentGlobalBtn){
    el.refreshEquipmentGlobalBtn.disabled = false;
    el.refreshEquipmentGlobalBtn.textContent = 'ACTUALIZAR POSICIONES';
  }

  if(!payload?.ok){
    setStatus(el.equipmentGlobalStatus,payload?.message||'No se ha podido cargar maquinaria.','error');
    return;
  }

  state.equipmentGlobal=Array.isArray(payload.locations)?payload.locations:[];
  if(payload.configured===false){
    setStatus(el.equipmentGlobalStatus,payload.message||'Módulo de maquinaria pendiente de configurar.','info');
  }else{
    clearStatus(el.equipmentGlobalStatus);
  }
  populateEquipmentFilters();
  renderEquipmentGlobal();
}
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

  state.purchaseSuggestionsLoadedAt = Date.now();
  state.purchaseSuggestionsProjectId = state.currentProject?.id || '';
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

  if (state.purchaseNotice) {
    setStatus(el.purchaseStatus, state.purchaseNotice,
      state.purchaseNotice.includes('reintentar') ? 'error' :
      state.purchaseNotice.includes('Enviando') ? undefined : 'success');
  } else {
    clearStatus(el.purchaseStatus);
  }
  renderPurchaseSummary();
  renderPurchases();

  // v0.18: no repetir una lectura completa del histórico tras cada
  // actualización de pedido, aviso por email o reapertura del módulo.
  const suggestionsFresh =
    state.purchaseSuggestionsProjectId === state.currentProject?.id &&
    Date.now() - state.purchaseSuggestionsLoadedAt < 5 * 60 * 1000;
  if (!suggestionsFresh && state.currentProject) {
    postToBackend('purchaseSuggestions', {
      projectId: state.currentProject.id
    });
  }
}


function canManagePurchases() {
  const role = state.bootstrap?.user?.role || '';
  const permissions = Array.isArray(state.bootstrap?.permissions)
    ? state.bootstrap.permissions
    : [];

  return (
    ['ADMIN', 'PROJECT_MANAGER', 'SITE_MANAGER', 'ADMINISTRATION'].includes(role) ||
    permissions.includes('PURCHASE_MANAGE')
  );
}


function filteredPurchases() {
  const status = el.purchaseStatusFilter.value;
  if (!status) return state.purchases || [];
  return (state.purchases || []).filter(item => item.status === status);
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

  const purchases = filteredPurchases();
  el.purchaseFilterCount.textContent =
    `${purchases.length} de ${state.purchases.length} solicitudes`;

  if (!purchases.length) {
    el.purchaseList.innerHTML =
      '<div class="empty-state"><h3>Sin solicitudes</h3><p>No hay pedidos que coincidan con el filtro seleccionado.</p></div>';
    return;
  }

  purchases.forEach(req => {
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
          ${canManagePurchases()
            ? req.status === 'PENDIENTE_ADMINISTRACION'
              ? '<button class="btn btn-primary btn-sm start-purchase-btn" type="button">Iniciar tramitación</button>'
              : ['EN_TRAMITACION', 'PEDIDO_EMITIDO', 'CONFIRMADO_PROVEEDOR'].includes(req.status)
                ? '<button class="btn btn-secondary btn-sm workflow-purchase-btn edit-mode" type="button">Editar</button>'
                : ''
            : ''}
          <button class="btn btn-secondary btn-sm reuse-purchase-btn" type="button">Reutilizar</button>
        </div>
      </div>

      ${['PENDIENTE', 'ERROR'].includes(req.emailStatus) ? `
        <div class="purchase-processing-info" style="background:#fff5e8;border-color:#f0d7b4">
          <strong>Correo a Administración: ${req.emailStatus === 'ERROR' ? 'error de envío' : 'pendiente de envío'}</strong>
          <span>La solicitud está registrada, pero no consta confirmación de envío.</span>
        </div>
      ` : ''}
      ${req.processingBy ? `
        <div class="purchase-processing-info">
          <span>Tramitación iniciada por</span>
          <strong>${esc(req.processingByName || req.processingBy)}</strong>
          <small>${esc(req.processingStartedAt || '')}</small>
        </div>
      ` : ''}
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

    card.querySelector('.start-purchase-btn')
      ?.addEventListener('click', event => {
        const button = event.currentTarget;
        if (button.disabled) return;
        button.disabled = true;
        button.textContent = 'Registrando…';
        setStatus(el.purchaseStatus, 'Marcando solicitud en tramitación…');
        postToBackend('purchaseStartProcessing', {requestId: req.requestId});
      });

    card.querySelector('.workflow-purchase-btn')
      ?.addEventListener('click', () => openPurchaseWorkflow(req));

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
  el.workflowStatusInput.querySelector('option[value="PENDIENTE_ADMINISTRACION"]').disabled =
    req.status !== 'PENDIENTE_ADMINISTRACION';
  el.workflowStatusInput.disabled = req.status === 'CONFIRMADO_PROVEEDOR';
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
  el.workflowStatusInput.disabled = false;
  state.workflowRequest = null;
  setWorkflowSubmitting(false);
}

function setWorkflowSubmitting(value) {
  state.workflowSubmitting = value;
  el.saveWorkflowBtn.disabled = value;

  const confirmed =
    state.workflowRequest?.status === 'CONFIRMADO_PROVEEDOR';

  el.saveWorkflowBtn.textContent = value
    ? 'Guardando…'
    : confirmed
      ? 'Guardar cambios'
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
  if (!state.currentProject || state.purchaseSubmitting || state.pendingPurchaseNotification) {
    if (state.purchaseSubmitting) {
      setStatus(el.purchaseStatus, 'Hay una solicitud guardándose. Espera a recibir la confirmación antes de crear otra.', 'info');
    } else if (state.pendingPurchaseNotification) {
      setStatus(el.purchaseStatus, 'Hay una notificación pendiente. Reintenta el envío antes de crear otra solicitud.', 'error');
    }
    return;
  }

  el.purchaseForm.reset();
  clearStatus(el.purchaseModalStatus);
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
  if (state.purchaseSubmitting) {
    setStatus(el.purchaseModalStatus, 'La solicitud sigue guardándose. Espera a recibir la confirmación para evitar duplicados.', 'info');
    return;
  }
  el.purchaseModal.classList.add('hidden');
  clearStatus(el.purchaseModalStatus);
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

el.purchaseStatusFilter.addEventListener('change', renderPurchases);
document.getElementById('purchaseRetryEmail')?.addEventListener('click', async () => {
  if (!state.pendingPurchaseNotification) return;
  try {
    if (!state.pendingPurchaseNotification.quotePdf && state.pendingPurchaseQuoteFile) {
      state.pendingPurchaseNotification.quotePdf =
        await getPurchaseQuotePdfPayload(state.pendingPurchaseQuoteFile);
    }
  } catch (error) {
    setStatus(el.purchaseStatus, error?.message || 'Error al preparar PDF.', 'error');
    return;
  }
  document.getElementById('purchaseRetryEmail').classList.add('hidden');
  state.purchaseNotice = 'Reintentando notificación a Administración…';
  setStatus(el.purchaseStatus, state.purchaseNotice);
  postToBackend('purchaseNotify', state.pendingPurchaseNotification);
});

async function getPurchaseQuotePdfPayload(fileOverride) {
  const file = fileOverride || (el.purchaseQuotePdf && el.purchaseQuotePdf.files
    ? el.purchaseQuotePdf.files[0]
    : null);

  if (!file) return null;

  if (file.type && file.type !== 'application/pdf') {
    throw new Error('La oferta adjunta debe ser un archivo PDF.');
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('La oferta PDF supera 8 MB. Reduce el archivo antes de adjuntarlo.');
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se ha podido leer la oferta PDF.'));
    reader.readAsDataURL(file);
  });

  return {
    name: file.name || 'oferta.pdf',
    mimeType: 'application/pdf',
    base64: String(dataUrl || '').split(',')[1] || ''
  };
}

el.purchaseForm.addEventListener('submit', async event => {
  event.preventDefault();

  if (!state.currentProject || state.purchaseSubmitting || state.pendingPurchaseNotification) {
    setStatus(el.purchaseStatus, 'Hay una notificación pendiente. Termina o reintenta su envío antes de crear otra solicitud.', 'error');
    return;
  }

  try {
    const quoteFile = el.purchaseQuotePdf?.files?.[0] || null;
    if (quoteFile && quoteFile.type && quoteFile.type !== 'application/pdf') {
      throw new Error('La oferta debe ser PDF.');
    }
    if (quoteFile && quoteFile.size > 8 * 1024 * 1024) {
      throw new Error('La oferta PDF supera 8 MB.');
    }

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
      materials: collectMaterials(),
      quotePdf: null
    };

    state.pendingPurchaseQuoteFile = quoteFile;
    state.pendingPurchaseQuotePdf = null;
    setPurchaseSubmitting(true);
    setStatus(el.purchaseModalStatus, 'Guardando solicitud… No vuelvas a pulsar Crear solicitud.', 'info');
    setStatus(el.purchaseStatus, 'Guardando solicitud…');

    postToBackend('purchaseCreate', payload);
  } catch (error) {
    setPurchaseSubmitting(false);
    setStatus(el.purchaseModalStatus, error?.message || 'No se ha podido preparar la solicitud.', 'error');
    setStatus(
      el.purchaseStatus,
      error && error.message ? error.message : 'No se ha podido preparar la oferta PDF.',
      'error'
    );
  }
});

async function handlePurchaseCreate(payload) {
  setPurchaseSubmitting(false);
  if (!payload?.ok) {
    state.pendingPurchaseQuotePdf = null;
    state.pendingPurchaseQuoteFile = null;
    const errorMessage = payload?.message || 'No se ha podido crear la solicitud.';
    setStatus(el.purchaseModalStatus, errorMessage, 'error');
    setStatus(el.purchaseStatus, errorMessage, 'error');
    return;
  }
  if (el.purchaseQuotePdf) el.purchaseQuotePdf.value = '';
  closePurchaseModal();
  state.purchaseSuggestionsLoadedAt = 0;
  state.pendingPurchaseNotification = {
    requestId: payload.requestId,
    quotePdf: null
  };
  state.purchaseNotice = 'Solicitud ' + payload.requestId +
    ' guardada. Enviando correo a Administración… No cierres la página hasta confirmar el envío.';
  setStatus(el.purchaseStatus, state.purchaseNotice);
  document.getElementById('purchaseRetryEmail')?.classList.add('hidden');
  try {
    state.pendingPurchaseQuotePdf = await getPurchaseQuotePdfPayload(state.pendingPurchaseQuoteFile);
    state.pendingPurchaseNotification.quotePdf = state.pendingPurchaseQuotePdf;
    postToBackend('purchaseNotify', state.pendingPurchaseNotification);
  } catch (error) {
    state.purchaseNotice = 'Solicitud guardada, pero no se pudo preparar el PDF: ' +
      (error?.message || String(error)) + '. Puedes reintentar el envío.';
    setStatus(el.purchaseStatus, state.purchaseNotice, 'error');
    document.getElementById('purchaseRetryEmail')?.classList.remove('hidden');
  }
}

function handlePurchaseNotify(payload) {
  if (payload?.ok) {
    state.pendingPurchaseNotification = null;
    state.pendingPurchaseQuotePdf = null;
    state.pendingPurchaseQuoteFile = null;
    state.purchaseNotice = payload.message || 'Correo enviado a Administración.';
  } else {
    state.purchaseNotice = (payload?.message || 'Error al enviar el correo.') +
      ' La solicitud está guardada. Puedes reintentar el envío sin crear otra.';
  }
  setStatus(el.purchaseStatus, state.purchaseNotice, payload?.ok ? 'success' : 'error');
  document.getElementById('purchaseRetryEmail')?.classList.toggle('hidden', !!payload?.ok);
  postToBackend('purchaseList', {projectId: state.currentProject.id});
}

function handlePurchaseStartProcessing(payload) {
  if (!payload?.ok) {
    setStatus(el.purchaseStatus,
      payload?.message || 'No se ha podido iniciar la tramitación.', 'error');
  } else {
    setStatus(el.purchaseStatus, payload.message || 'Tramitación iniciada.', 'success');
  }
  postToBackend('purchaseList', {projectId: state.currentProject.id});
}


function handlePurchaseMutation(payload) {
  setPurchaseSubmitting(false);
  setWorkflowSubmitting(false);

  if (!payload?.ok) {
    setStatus(el.purchaseStatus, payload?.message || 'No se ha podido guardar.', 'error');
    return;
  }

  if (el.purchaseQuotePdf) el.purchaseQuotePdf.value = '';
  closePurchaseModal();
  closePurchaseWorkflow();
  setStatus(
    el.purchaseStatus,
    payload.message || 'Guardado correctamente.',
    payload.emailSent === false || payload.warehouseSync?.ok === false ? 'error' : 'success'
  );

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
  state.planningCalendarFilter = 'ALL';
  document.querySelectorAll('[data-planning-filter]').forEach(b => b.classList.toggle('active', b.dataset.planningFilter === 'ALL'));
  state.deliveryCalendarDate = new Date();

  show(el.deliveriesView);
  loadReceiptDestinationsRC13(state.currentProject?.id);
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
  state.subcontractWorks = Array.isArray(payload.subcontractWorks) ? payload.subcontractWorks : [];
  renderSubcontractList();
  clearStatus(el.deliveryStatus);
  renderDeliverySummary();
  renderConstructionMilestones();
  renderDeliveryCalendar();
  renderDeliveryList();
  // La consulta remota se inicia únicamente con el botón del pedido.
  state.warehouseOrderProgress = {};
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

    const items = state.planningCalendarFilter === 'SUBCONTRACTS' ? [] : state.deliveries.filter(item => item.expectedDeliveryDate === iso);
    const works = state.planningCalendarFilter === 'DELIVERIES' ? [] : state.subcontractWorks.filter(w => w.start === iso);
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
        ${works.map(w => `<button class="calendar-event subcontract-event" type="button" data-work-id="${esc(w.id)}"><strong>👷 ${esc(w.supplier)}</strong><span>${esc(w.planned)} pers. · ${esc(w.activity)}</span></button>`).join('')}
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

  el.deliveryCalendar.querySelectorAll('[data-work-id]').forEach(button => {
    const w = state.subcontractWorks.find(x => x.id === button.dataset.workId);
    button.addEventListener('click', () => { if (w) openSubcontractModal(w); });
  });
  el.deliveryCalendar.querySelectorAll('.calendar-milestone').forEach(button => {
    button.addEventListener('click', () => {
      const milestone = state.constructionMilestones.find(m => m.milestoneId === button.dataset.milestoneId);
      if (milestone) openMilestoneDetail(milestone);
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
      <div class="delivery-data"><span>Destino</span><strong>${esc(item.destination || '—')}</strong><small>${esc(warehouseDeliveryProgressText_(item))}</small></div>
      <div class="delivery-data"><span>Hito</span><strong>${esc(deliveryMilestoneTitles(item) || 'Sin referencia')}</strong><small>${esc(deliveryMilestoneDeltaText(item))}</small></div>
      <div><span class="delivery-date-pill ${dateClass}">${esc(item.expectedDeliveryDate || 'Sin fecha')}</span></div>
      <button class="btn btn-secondary btn-sm open-delivery-btn" type="button">Abrir</button>
    `;

    row.querySelector('.open-delivery-btn').addEventListener('click', () => openDeliveryModal(item));
    el.deliveryList.appendChild(row);
  });
}

function openDeliveryModal(item) {
  finishWarehouseReceiptConsult_();
  state.selectedDelivery = item;
  loadReceiptDestinationsRC13(item.projectId);

  el.deliveryModalTitle.textContent = item.requestId || 'Entrega';
  el.deliveryModalMeta.textContent = [item.projectId,item.expectedDeliveryDate].filter(Boolean).join(' · ');
  el.deliverySupplier.textContent = item.supplier || '—';
  el.deliveryPo.textContent = item.poNumber || 'Pendiente';
  el.deliveryFamily.textContent = item.family || '—';
  el.deliveryDestination.textContent = [item.destinationType,item.destination].filter(Boolean).join(' · ') || '—';

  el.deliveryMilestoneSelect.innerHTML = state.constructionMilestones.map(m =>
    `<label class="planning-check"><input type="checkbox" value="${esc(m.milestoneId)}" ${(item.milestoneIds || (item.milestoneId ? [item.milestoneId] : [])).includes(m.milestoneId) ? 'checked' : ''}><span>${esc(m.date)} · ${esc(m.title)}</span></label>`
  ).join('') || '<span class="muted">Crea primero un hito constructivo.</span>';
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
  setDeliveryCommentSubmitting(false);
  el.deliveryNewComment.value = '';
  el.deliveryCommentsList.innerHTML = '';
  el.deliveryCommentsStatus.textContent = 'Cargando historial…';
  el.deliveryModal.classList.remove('hidden');
  postToBackend('deliveryCommentsList', {requestId:item.requestId});
  const receiptPreview = document.getElementById('warehouseReceiptPreviewContent');
  if(receiptPreview) receiptPreview.textContent='Pulsa «Consultar recepciones» para ver el pendiente real.';
}


function handleWarehouseReceiptContext(payload){
  const target=document.getElementById('warehouseReceiptPreviewContent');
  if(!target)return;
  if(!payload?.ok){target.textContent=payload?.message||'No se ha podido consultar Warehouse.';return;}
  if(!state.selectedDelivery||state.selectedDelivery.requestId!==payload.requestId)return;
  if(!payload.found){target.textContent=payload.message||'Pedido no sincronizado.';return;}
  const order=payload.order||{};
  // Se muestra únicamente información que devuelve la API; no se inventan pendientes.
  const rawLines=order.lines||order.materials||order.lineProgress||[];
  const lines=Array.isArray(rawLines)?rawLines:[];
  const summary=document.createElement('div');
  const status=document.createElement('p');
  status.textContent='Pedido sincronizado con Warehouse · '+String(order.status||order.receiptStatus||'Consulta disponible');
  summary.appendChild(status);
  if(lines.length){
    const table=document.createElement('table');
    const head=document.createElement('thead');
    head.innerHTML='<tr><th>Referencia</th><th>Pedido</th><th>Recibido</th><th>Pendiente</th></tr>';
    table.appendChild(head);
    const body=document.createElement('tbody');
    lines.forEach(line=>{
      const row=document.createElement('tr');
      const vals=[line.reference??line.referencia??'',line.quantity??line.orderedQty??'',line.received??line.receivedQty??line.acceptedQty??'',line.pending??line.pendingQty??''];
      vals.forEach(value=>{const td=document.createElement('td');td.textContent=String(value);row.appendChild(td);});
      body.appendChild(row);
    });
    table.appendChild(body);summary.appendChild(table);
  }else{
    const note=document.createElement('p');note.textContent='Warehouse no devolvió un desglose de líneas para este pedido.';summary.appendChild(note);
  }
  target.replaceChildren(summary);
}
let warehouseReceiptTimer=null;
function finishWarehouseReceiptConsult_(){
  clearTimeout(warehouseReceiptTimer);warehouseReceiptTimer=null;
  state.warehouseReceiptConsultPending=null;
  state.warehouseReceiptConsultProject=null;
  const button=document.getElementById('warehouseReceiptCheckBtn');
  if(button){button.disabled=false;button.textContent='Consultar cantidades recibidas';}
}
function consultWarehouseReceiptsFromDelivery(){
  const item=state.selectedDelivery;
  if(!item||state.warehouseReceiptConsultPending)return;
  const target=document.getElementById('warehouseReceiptPreviewContent');
  if(checkSessionExpiry_()){
    if(target)target.textContent='La sesión ha caducado. Inicia sesión para consultar Warehouse.';
    return;
  }
  if(!item.projectId){if(target)target.textContent='El pedido no tiene proyecto asociado.';return;}
  if(target)target.textContent='Consultando Warehouse… Puede tardar hasta 30 segundos.';
  state.warehouseReceiptConsultPending=item.requestId;
  state.warehouseReceiptConsultProject=item.projectId;
  const button=document.getElementById('warehouseReceiptCheckBtn');
  if(button){button.disabled=true;button.textContent='Consultando…';}
  warehouseReceiptTimer=setTimeout(()=>{
    const selected=state.selectedDelivery?.requestId===item.requestId;
    finishWarehouseReceiptConsult_();
    if(selected&&target)target.textContent='Warehouse no ha respondido en 30 segundos. El estado no se ha comprobado. Puedes abrir Warehouse o volver a consultar.';
  },30000);
  postToBackend('warehouseOrderProgress',{projectId:item.projectId});
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

function selectedPlanningIds(container) {
  return [...container.querySelectorAll('input[type="checkbox"]:checked')].map(x => x.value);
}
function deliveryMilestoneTitles(item) {
  const ids = item.milestoneIds || (item.milestoneId ? [item.milestoneId] : []);
  return ids.map(id => state.constructionMilestones.find(m => m.milestoneId === id)?.title || '').filter(Boolean).join(' · ');
}
function updateDeliveryMilestoneOffset() {
  if (!state.selectedDelivery) return;
  const ids = selectedPlanningIds(el.deliveryMilestoneSelect);
  const milestones = state.constructionMilestones.filter(m => ids.includes(m.milestoneId));
  const warnings = milestones.filter(m => deliveryMilestoneDelta_(state.selectedDelivery.expectedDeliveryDate,m.date) < 0);
  el.deliveryMilestoneOffset.className = 'milestone-offset ' + (warnings.length ? 'negative' : 'neutral');
  el.deliveryMilestoneOffset.textContent = !milestones.length ? 'Sin hitos asociados.' :
    warnings.length ? `Atención: entrega posterior a ${warnings.length} hito(s): ${warnings.map(m=>m.title).join(', ')}` :
    `${milestones.length} hito(s) asociados. Sin conflictos de fecha detectados.`;
}
function saveDeliveryMilestone() {
  if (!state.selectedDelivery || state.deliverySubmitting) return;
  setDeliverySubmitting(true);
  postToBackend('deliveryLinkMilestone', {requestId:state.selectedDelivery.requestId,milestoneIds:selectedPlanningIds(el.deliveryMilestoneSelect)});
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
    const linked = state.deliveries.filter(d => (d.milestoneIds || [d.milestoneId]).includes(milestone.milestoneId));
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
        ${milestone.documentReadiness
          ? `<span class="delivery-doc-readiness doc-${String(milestone.documentReadiness.readinessStatus || '').toLowerCase().replace('_','-')}">
              Documentación: <strong>${esc(mechanicalReadinessStatusLabel(milestone.documentReadiness.readinessStatus))}</strong>
              · ${Number(milestone.documentReadiness.approvedSubmittals || 0)}/${Number(milestone.documentReadiness.requiredSubmittals || 0)} en A
              ${milestone.documentReadiness.blockers ? ` · ${Number(milestone.documentReadiness.blockers)} bloqueo` : ''}
            </span>`
          : '<span class="delivery-doc-readiness doc-not-configured">Documentación: sin configurar</span>'}
      </div>
    `;
    card.addEventListener('click', () => openMilestoneDetail(milestone));
    el.constructionMilestoneList.appendChild(card);
  });
}

function openMilestoneDetail(milestone) {
  if (!milestone) return;
  state.selectedMilestoneDetailId = milestone.milestoneId;
  el.milestoneDetailTitle.textContent = milestone.title || 'Hito constructivo';
  el.milestoneDetailMeta.textContent = [milestone.date,milestone.type,milestone.discipline].filter(Boolean).join(' · ');
  const linked = state.deliveries.filter(d => (d.milestoneIds || [d.milestoneId]).includes(milestone.milestoneId));
  const workLinked = state.subcontractWorks.filter(w => (w.milestoneIds || []).includes(milestone.milestoneId));
  const received = linked.filter(isDeliveryReceived).length;
  const risk = linked.filter(d => { const delta = deliveryMilestoneDelta_(d.expectedDeliveryDate,milestone.date); return !isDeliveryReceived(d) && delta !== null && delta < 0; }).length;
  el.milestoneDetailSummary.innerHTML = `
    <div><strong>${linked.length}</strong><span>Asociadas</span></div>
    <div><strong>${received}</strong><span>Recibidas / parciales</span></div>
    <div><strong>${risk}</strong><span>Después del hito</span></div>
    <div><strong>${workLinked.length}</strong><span>Trabajos subcontratas</span></div>`;
  el.milestoneDetailDeliveries.innerHTML = '';
  if (!linked.length) {
    el.milestoneDetailDeliveries.innerHTML = '<div class="empty-state">No hay deliveries vinculadas a este hito.</div>';
  } else {
    linked.slice().sort((a,b) => (a.expectedDeliveryDate||'').localeCompare(b.expectedDeliveryDate||'')).forEach(d => {
      const row = document.createElement('div');
      row.className = 'milestone-detail-row';
      const status = isDeliveryReceived(d) ? 'Recibida / parcial' : isDeliveryLate(d) ? 'Atrasada' : 'Pendiente';
      const delta = deliveryMilestoneDelta_(d.expectedDeliveryDate,milestone.date);
      const warning = delta!==null && delta<0 && !isDeliveryReceived(d);
      row.innerHTML = `<div><strong>${esc(d.supplier||'Proveedor')}</strong><span>${esc(d.poNumber||d.requestId)} · ${esc(d.family||'—')}</span></div>
        <div><strong>${esc(d.expectedDeliveryDate||'Sin fecha')}</strong><span class="${warning?'milestone-risk':''}">${esc(status)} · ${esc((()=>{const n=deliveryMilestoneDelta_(d.expectedDeliveryDate,milestone.date);return n===null?'Sin margen':n<0?Math.abs(n)+' días después del hito':n===0?'Mismo día del hito':n+' días antes del hito';})())}</span></div>
        <button class="btn btn-secondary btn-sm" type="button">Abrir pedido</button>`;
      row.querySelector('button').addEventListener('click', () => {
        closeMilestoneDetail();
        openDeliveryModal(d);
      });
      el.milestoneDetailDeliveries.appendChild(row);
    });
  }
  el.milestoneDetailSubcontracts.innerHTML = workLinked.length ? '' : '<div class="empty-state">Sin trabajos asociados.</div>';
  workLinked.forEach(w => {
    const row = document.createElement('div'); row.className='milestone-detail-row';
    row.innerHTML=`<div><strong>${esc(w.supplier)}</strong><span>${esc(w.activity)}</span></div><div><strong>${esc(w.start)} → ${esc(w.end||'Sin fin')}</strong><span>${esc(w.planned)} personas previstas · ${esc(w.status)}</span></div><button class="btn btn-secondary btn-sm" type="button">Abrir</button>`;
    row.querySelector('button').addEventListener('click',()=>{closeMilestoneDetail();openSubcontractModal(w);});
    el.milestoneDetailSubcontracts.appendChild(row);
  });
  el.milestoneDetailModal.classList.remove('hidden');
}

function closeMilestoneDetail() {
  el.milestoneDetailModal.classList.add('hidden');
  state.selectedMilestoneDetailId = null;
}

function setDeliveryCommentSubmitting(value) {
  state.deliveryCommentSubmitting = value;
  el.saveDeliveryCommentBtn.disabled = value;
  el.saveDeliveryCommentBtn.textContent = value ? 'Guardando…' : 'Añadir al historial';
}

function renderDeliveryComments(comments, hasMore) {
  el.deliveryCommentsList.innerHTML = '';
  if (!comments.length) {
    el.deliveryCommentsList.innerHTML = '<div class="muted">Todavía no hay comentarios.</div>';
  } else {
    comments.forEach(c => {
      const row = document.createElement('div');
      row.className = 'delivery-comment';
      row.innerHTML = `<div class="delivery-comment-meta"><strong>${esc(c.author||'Usuario')}</strong><span>${esc(c.createdAt||'')}</span></div><p>${esc(c.text||'')}</p>`;
      el.deliveryCommentsList.appendChild(row);
    });
  }
  el.deliveryCommentsStatus.textContent = hasMore ? 'Se muestran los 50 comentarios más recientes.' : '';
}

function handleDeliveryCommentsList(payload) {
  if (!state.selectedDelivery || payload?.requestId !== state.selectedDelivery.requestId) return;
  if (!payload?.ok) {
    el.deliveryCommentsStatus.textContent = payload?.message || 'No se ha podido cargar el historial.';
    return;
  }
  renderDeliveryComments(Array.isArray(payload.comments)?payload.comments:[],payload.hasMore);
}

function saveDeliveryComment() {
  if (!state.selectedDelivery || state.deliveryCommentSubmitting) return;
  const comment = el.deliveryNewComment.value.trim();
  if (!comment) { el.deliveryCommentsStatus.textContent = 'Escribe un comentario antes de guardarlo.'; return; }
  setDeliveryCommentSubmitting(true);
  el.deliveryCommentsStatus.textContent = '';
  postToBackend('deliveryCommentAdd', {requestId:state.selectedDelivery.requestId,comment});
}

function handleDeliveryCommentAdd(payload) {
  setDeliveryCommentSubmitting(false);
  if (!state.selectedDelivery || payload?.requestId !== state.selectedDelivery.requestId) return;
  if (!payload?.ok) {
    el.deliveryCommentsStatus.textContent = payload?.message || 'No se ha podido guardar el comentario.';
    return;
  }
  el.deliveryNewComment.value = '';
  const empty = el.deliveryCommentsList.querySelector('.muted');
  if (empty) el.deliveryCommentsList.innerHTML = '';
  const c = payload.comment;
  if (c) {
    const row = document.createElement('div');
    row.className = 'delivery-comment';
    row.innerHTML = `<div class="delivery-comment-meta"><strong>${esc(c.author||'Usuario')}</strong><span>${esc(c.createdAt||'')}</span></div><p>${esc(c.text||'')}</p>`;
    el.deliveryCommentsList.prepend(row);
  }
  el.deliveryCommentsStatus.textContent = 'Comentario guardado.';
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
  finishWarehouseReceiptConsult_();
  el.deliveryModal.classList.add('hidden');
  state.selectedDelivery = null;
  setDeliverySubmitting(false);
  setDeliveryCommentSubmitting(false);
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
  if (!el.subcontractModal.classList.contains('hidden')) closeSubcontractModal();
  if (!el.constructionMilestoneModal.classList.contains('hidden')) closeConstructionMilestoneModal();
  setStatus(el.deliveryStatus,payload.message || 'Planificación actualizada.','success');
  postToBackend('deliveryList',{projectId:state.currentProject.id});
}



/* WAREHOUSE */
// Warehouse Site Control RC9: lecturas identificadas y solicitudes recuperables.
const wm={read:null,queue:[],stockCache:new Map(),requestCache:new Map(),bootstrapCache:new Map(),
  stockKey:null,stockLoading:false,tab:'stock',writeTimer:null,writing:false};
const wmClosed=new Set(['ENTREGADA','RECHAZADA','CANCELADA']);
function wmProject(){return state.currentProject?.id||'';}
function wmKey(warehouse=state.selectedWarehouseId){return wmProject()+'|'+warehouse;}
function wmFresh(entry){return entry&&Date.now()-entry.at<30000;}
function wmDate(value){const d=new Date(value);return Number.isNaN(d.getTime())?String(value||'—'):d.toLocaleString('es-ES');}
function wmRead(action,payload){
  const key=action+'|'+payload.projectId+'|'+(payload.warehouseId||'');
  if(wm.read?.key===key||wm.queue.some(j=>j.key===key))return;
  wm.queue.push({key,action,payload:{...payload,queryId:newClientRequestId()}});wmPump();
}
function wmPump(){
  if(wm.read||wm.writing)return;
  wm.queue=wm.queue.filter(j=>j.payload.projectId===wmProject()&&(j.action!=='warehouseStockList'||j.payload.warehouseId===state.selectedWarehouseId));
  const job=wm.queue.shift();if(!job)return;
  if(checkSessionExpiry_()){wm.queue=[];wm.stockLoading=false;wmControls();return;}
  wm.read=job;
  job.timer=setTimeout(()=>{
    if(wm.read!==job)return;wm.read=null;
    if(job.payload.projectId===wmProject()){
      if(job.action==='warehouseStockList'&&job.payload.warehouseId===state.selectedWarehouseId){wm.stockLoading=false;wmControls();el.warehouseStockBody.innerHTML='<tr><td colspan="6">Consulta sin respuesta. Pulsa Actualizar para reintentar.</td></tr>';}
      if(job.action==='warehouseBootstrap'){wm.stockLoading=false;state.selectedWarehouseId=null;el.warehouseSelect.disabled=true;wmControls();el.warehouseStockBody.innerHTML='<tr><td colspan="6">No se han podido cargar los almacenes. Pulsa Actualizar.</td></tr>';}
      setStatus(el.warehouseStatus,'La consulta ha superado 30 segundos. Pulsa Actualizar para volver a intentarlo.','error');
    }
    wmPump();
  },30000);
  postToBackend(job.action,job.payload);
}
function wmAccept(payload,action){
  const job=wm.read;
  if(!job||job.action!==action||payload?.queryId!==job.payload.queryId)return false;
  clearTimeout(job.timer);wm.read=null;setTimeout(wmPump,0);
  if(payload.projectId!==wmProject())return false;
  if(action==='warehouseStockList'&&payload.warehouseId!==state.selectedWarehouseId)return false;
  if(!payload.ok){
    if(action==='warehouseBootstrap'){wm.stockLoading=false;state.selectedWarehouseId=null;el.warehouseSelect.disabled=true;wmControls();el.warehouseStockBody.innerHTML='<tr><td colspan="6">No se han podido cargar los almacenes. Pulsa Actualizar.</td></tr>';}
    if(action==='warehouseStockList'){wm.stockLoading=false;wmControls();el.warehouseStockBody.innerHTML='<tr><td colspan="6">Existencias no disponibles. Pulsa Actualizar para reintentar.</td></tr>';}
    setStatus(el.warehouseStatus,payload.message||'No se pudo consultar Warehouse.','error');return false;
  }
  return true;
}
function wmControls(){
  const ready=!wm.stockLoading&&wm.stockKey===wmKey();
  el.newMaterialRequestBtn.disabled=!ready||!state.warehousePermissions.canRequest||!!wmPending();
  if(!ready)el.submitMaterialRequestBtn.disabled=true;
  document.getElementById('warehouseStockUpdated').textContent=wm.stockLoading?'Consultando existencias…':
    ready?'Datos consultados: '+wmDate(wm.stockCache.get(wmKey())?.at):'Existencias sin consultar';
  wmRenderPending();
  if(ready)renderWarehouseStock();
}
function wmApplyStock(entry){
  state.warehouseStock=entry.stock;wm.stockKey=wmKey();wm.stockLoading=false;
  const zone=document.getElementById('warehouseStockZone'),previous=zone.value;
  zone.innerHTML='<option value="">Todas las zonas</option>'+[...new Set(entry.stock.map(x=>x.zoneId).filter(Boolean))].sort().map(z=>'<option value="'+esc(z)+'">'+esc(z)+'</option>').join('');
  if([...zone.options].some(x=>x.value===previous))zone.value=previous;
  renderWarehouseStock();renderWarehouseSummary();wmControls();
  if(!el.materialRequestModal.classList.contains('hidden')){refreshMaterialRequestFinder();clearStatus(el.materialRequestStatus);}
}
function wmLoadRequests(force=false){
  const entry=wm.requestCache.get(wmProject());
  if(!force&&wmFresh(entry)){state.warehouseRequests=entry.requests;renderWarehouseRequests();renderWarehouseSummary();return;}
  setStatus(el.warehouseStatus,'Consultando solicitudes…');
  wmRead('warehouseRequestList',{projectId:wmProject()});
}
function wmPendingKey(){return 'levitec.warehouse.pending.v1|'+String(state.bootstrap?.user?.email||'').toLowerCase()+'|'+wmProject();}
function wmPending(){
  try{const p=JSON.parse(sessionStorage.getItem(wmPendingKey())||'null');
    return p&&typeof p.clientRequestId==='string'&&p.payload?.projectId===wmProject()?p:null;
  }catch{return null;}
}
function wmRenderPending(){
  const p=wmPending(),box=document.getElementById('warehousePendingRequest');box.classList.toggle('hidden',!p);
  if(!p)return;
  document.getElementById('warehousePendingText').textContent='Solicitud por confirmar: '+p.payload.reference+' · '+p.payload.quantity+' · '+p.payload.warehouseId+'. Comprueba o reenvía la misma solicitud para recuperar el resultado sin duplicarla.';
  document.getElementById('warehouseRetryRequest').disabled=wm.writing;
}
function wmSendPending(){
  const p=wmPending();if(!p||wm.writing)return;
  if(wm.read){setStatus(el.warehouseStatus,'Espera a que termine la consulta y pulsa Comprobar / reenviar.','info');return;}
  if(checkSessionExpiry_())return;
  const attempt={...p,key:wmPendingKey()};wm.writeContext=attempt;
  wm.writing=true;wmRenderPending();
  setStatus(el.warehouseStatus,'Enviando solicitud de material…');
  wm.writeTimer=setTimeout(()=>{
    if(wm.writeContext!==attempt)return;
    wm.writing=false;wmRenderPending();
    wmPump();
    if(attempt.payload.projectId===wmProject())setStatus(el.warehouseStatus,'No se ha confirmado el envío. Conservamos la solicitud: usa Comprobar / reenviar, sin crear otra.','error');
  },30000);
  postToBackend('warehouseRequestCreate',{...p.payload,clientRequestId:p.clientRequestId});
}
function wmCompleteRequest(payload){
  const p=wm.writeContext;
  if(!p||payload?.clientRequestId!==p.clientRequestId||payload.projectId!==p.payload.projectId)return;
  clearTimeout(wm.writeTimer);wm.writing=false;
  setTimeout(wmPump,0);
  const current=payload.projectId===wmProject();
  if(!payload.ok){
    wmRenderPending();if(current)setStatus(el.warehouseStatus,(payload.message||'No se ha confirmado la solicitud.')+' Conservamos el identificador para comprobar o reintentar el mismo envío.','error');return;
  }
  sessionStorage.removeItem(p.key);wm.writeContext=null;
  wm.requestCache.delete(payload.projectId);
  if(!current)return;
  wmRenderPending();wmControls();
  setWarehouseTab('requests');
  setStatus(el.warehouseStatus,'Solicitud '+payload.requestId+(payload.duplicate?' recuperada; ya estaba registrada.':' registrada. No reserva ni descuenta existencias.'),'success');
}
function wmReset(){
  resetReceiptDestinationsRC13();
  if(wm.read)clearTimeout(wm.read.timer);clearTimeout(wm.writeTimer);
  wm.read=null;wm.queue=[];wm.writing=false;wm.writeContext=null;wm.stockLoading=false;wm.stockKey=null;
  wm.stockCache.clear();wm.requestCache.clear();wm.bootstrapCache.clear();
  state.warehouseStock=[];state.warehouseRequests=[];state.warehouses=[];state.warehouseZones=[];
}

function openWarehouse() {
  if(!state.currentProject)return;
  el.warehouseProjectSubtitle.textContent=(state.currentProject.name||wmProject())+' · Existencias de este proyecto';
  show(el.warehouseView);wm.tab='stock';setWarehouseTab('stock');
  state.warehouseStock=[];state.warehouseRequests=[];wm.stockKey=null;wm.stockLoading=true;
  el.warehouseRequestsList.innerHTML='<div class="empty-state">Abre Solicitudes para consultar su estado.</div>';
  el.warehouseStockBody.innerHTML='<tr><td colspan="6">Cargando almacenes y existencias…</td></tr>';
  el.warehouseSelect.disabled=true;el.warehouseSkuCount.textContent='—';el.warehouseQuarantineCount.textContent='—';el.warehouseOpenRequestsCount.textContent='—';
  wmControls();
  const cached=wm.bootstrapCache.get(wmProject());
  if(wmFresh(cached)){wmBootstrap(cached.payload);return;}
  setStatus(el.warehouseStatus,'Cargando almacenes…');
  wmRead('warehouseBootstrap',{projectId:wmProject()});
}

function handleWarehouseBootstrap(payload){
  if(!wmAccept(payload,'warehouseBootstrap'))return;
  wm.bootstrapCache.set(wmProject(),{at:Date.now(),payload});wmBootstrap(payload);
}
function wmBootstrap(payload){
  state.warehouses=Array.isArray(payload.warehouses)?payload.warehouses:[];
  state.warehouseZones=Array.isArray(payload.zones)?payload.zones:[];
  state.warehousePermissions=payload.permissions||{};
  state.warehouseRequests=wm.requestCache.get(wmProject())?.requests||[];
  renderWarehouseSelector();el.warehouseSelect.disabled=!state.warehouses.length;
  el.newZoneBtn.classList.add('hidden');
  const previous=state.warehouses.find(w=>w.id===state.selectedWarehouseId);
  const campus=String(state.currentProject?.campus||'').trim().toLowerCase();
  const preferred=previous||state.warehouses.find(w=>String(w.campus||'').trim().toLowerCase()===campus)||state.warehouses[0];
  state.selectedWarehouseId=preferred?.id||null;el.warehouseSelect.value=state.selectedWarehouseId||'';
  clearStatus(el.warehouseStatus);renderWarehouseZones();
  if(preferred)loadWarehouseData();
  else{wm.stockLoading=false;wm.stockKey=null;state.warehouseStock=[];renderWarehouseStock();renderWarehouseSummary();wmControls();}
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

function loadWarehouseData(force=false){
  if(!state.selectedWarehouseId)return;
  const warehouse=state.warehouses.find(w=>w.id===state.selectedWarehouseId);
  el.warehouseMeta.textContent=warehouse?[warehouse.campus,warehouse.discipline].filter(Boolean).join(' · '):'';
  state.materialRequestSelection=null;el.submitMaterialRequestBtn.disabled=true;
  if(!el.materialRequestModal.classList.contains('hidden'))clearMaterialRequestSelection();
  renderWarehouseZones();
  renderWarehouseRequests();
  if(wm.tab==='requests')wmLoadRequests();
  const cached=wm.stockCache.get(wmKey());
  if(!force&&wmFresh(cached)){wmApplyStock(cached);return;}
  wm.stockLoading=true;wm.stockKey=null;state.warehouseStock=[];
  el.warehouseStockBody.innerHTML='<tr><td colspan="6">Consultando existencias de este almacén…</td></tr>';
  el.warehouseSkuCount.textContent='—';el.warehouseQuarantineCount.textContent='—';wmControls();
  wmRead('warehouseStockList',{projectId:wmProject(),warehouseId:state.selectedWarehouseId});
}

function handleWarehouseStock(payload){
  if(!wmAccept(payload,'warehouseStockList'))return;
  if(!Array.isArray(payload.stock)){wm.stockLoading=false;wmControls();setStatus(el.warehouseStatus,'Warehouse devolvió una lista de existencias no válida.','error');return;}
  const entry={at:Date.now(),stock:payload.stock};wm.stockCache.set(wmKey(),entry);
  clearStatus(el.warehouseStatus);wmApplyStock(entry);
}

function handleWarehouseRequests(payload){
  if(!wmAccept(payload,'warehouseRequestList'))return;
  if(!Array.isArray(payload.requests)){setStatus(el.warehouseStatus,'Warehouse devolvió una lista de solicitudes no válida.','error');return;}
  wm.requestCache.set(wmProject(),{at:Date.now(),requests:payload.requests});state.warehouseRequests=payload.requests;
  renderWarehouseRequests();renderWarehouseSummary();
  setStatus(el.warehouseStatus,'Solicitudes actualizadas: '+wmDate(Date.now())+'.','success');
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

  const quarantine = new Set(stock.filter(
    item => item.status === 'QUARANTINE'
  ).map(item=>item.reference||item.description).filter(Boolean)).size;

  const openRequests = state.warehouseRequests.filter(
    req =>
      req.warehouseId === warehouseId &&
      !wmClosed.has(String(req.status||'').trim().toUpperCase())
  ).length;

  el.warehouseSkuCount.textContent = wm.stockLoading||wm.stockKey!==wmKey()?'—':refs.size;
  el.warehouseQuarantineCount.textContent = wm.stockLoading||wm.stockKey!==wmKey()?'—':quarantine;
  el.warehouseOpenRequestsCount.textContent = wm.requestCache.has(wmProject())?openRequests:'—';
}

function renderWarehouseStock() {
  const rows = state.warehouseStock.filter(
    item => item.warehouseId === state.selectedWarehouseId &&
      (!document.getElementById('warehouseStockZone').value||item.zoneId===document.getElementById('warehouseStockZone').value) &&
      (!document.getElementById('warehouseStockState').value||item.status===document.getElementById('warehouseStockState').value) &&
      (String(item.reference||'')+' '+String(item.description||'')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(document.getElementById('warehouseStockSearch').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim())
  );

  el.warehouseStockBody.innerHTML = '';

  if (!rows.length) {
    el.warehouseStockBody.innerHTML =
      '<tr><td colspan="6">No hay existencias de este proyecto que coincidan con los filtros.</td></tr>';
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
      <td>${isQuarantine?'Cuarentena':'Disponible'}</td>
      <td class="warehouse-row-action"></td>
    `;

    const actionCell = tr.querySelector('.warehouse-row-action');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary btn-sm';
    button.textContent = isQuarantine ? 'Cuarentena' : 'Solicitar';
    button.disabled = isQuarantine || !state.warehousePermissions.canRequest || wm.stockLoading || !!wmPending();

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
  const entry=wm.requestCache.get(wmProject());
  document.getElementById('warehouseRequestsUpdated').textContent=entry?'Datos consultados: '+wmDate(entry.at):'Solicitudes sin consultar';
  const rows = state.warehouseRequests.filter(
    req => req.warehouseId === state.selectedWarehouseId &&
      (!document.getElementById('warehouseRequestState').value||String(req.status||'').toUpperCase()===document.getElementById('warehouseRequestState').value)
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
      <span>${esc(req.requestId)} · ${esc(req.requestedBy || '')}</span>
      <span>${esc(req.quantity)} · ${esc(req.status)} · ${esc(wmDate(req.requestedAt))}</span>
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
      (['QUARANTINE','CUARENTENA'].includes(zone.type) ? ' quarantine' : '');

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
  if(wm.stockLoading||wm.stockKey!==wmKey(el.materialRequestWarehouse.value)){el.materialRequestResults.innerHTML='<div class="material-search-empty">Existencias pendientes de consulta.</div>';return;}
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
  if (!state.warehouses.length || wm.stockLoading || wm.stockKey!==wmKey() || !state.warehousePermissions.canRequest || wmPending()) return;
  if(!wmFresh(wm.stockCache.get(wmKey()))){loadWarehouseData(true);setStatus(el.warehouseStatus,'Actualizando existencias antes de solicitar. Cuando termine, vuelve a pulsar Solicitar material.','info');return;}

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

  if(wm.writing||wmPending())return;
  if(wm.stockLoading||wm.stockKey!==wmKey()||!state.warehousePermissions.canRequest){
    setStatus(el.materialRequestStatus,'Espera a la consulta de existencias y comprueba tus permisos.','error');return;
  }
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

  if(Math.abs(quantity*1000-Math.round(quantity*1000))>0.000001||String(selected.reference||'').length>80||String(selected.description||'').length>200||el.materialRequestNotes.value.length>250){
    setStatus(el.materialRequestStatus,'Usa como máximo 3 decimales, 80 caracteres de referencia, 200 de descripción y 250 de observaciones.','error');return;
  }

  if(checkSessionExpiry_())return;
  const clientRequestId=newClientRequestId();
  const payload={projectId:wmProject(),warehouseId:el.materialRequestWarehouse.value,
    reference:selected.reference,description:selected.description,quantity,notes:el.materialRequestNotes.value};
  try{sessionStorage.setItem(wmPendingKey(),JSON.stringify({clientRequestId,payload}));}
  catch{setStatus(el.materialRequestStatus,'No se puede conservar el identificador del envío en este navegador. Habilita el almacenamiento de la sesión para evitar duplicados.','error');return;}
  closeMaterialRequestModal();wmControls();wmSendPending();
  return;

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

  wm.tab=tabName;
  if(tabName==='requests')wmLoadRequests();
  el.warehouseStockPanel.classList.toggle('hidden', tabName !== 'stock');
  el.warehouseRequestsPanel.classList.toggle('hidden', tabName !== 'requests');
  el.warehouseZonesPanel.classList.toggle('hidden', tabName !== 'zones');
}


/* LOGOUT / HELPERS */
function logout() {
  wmReset();
  state.credential = null;
  state.credentialExpiresAt = 0;
  checkSessionExpiry_();
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

function renderSubcontractList() {
  el.subcontractList.innerHTML = '';
  state.subcontractWorks.forEach(w => {
    const row=document.createElement('div'); row.className='delivery-row';
    row.innerHTML=`<div class="delivery-main"><strong>${esc(w.supplier)}</strong><span>${esc(w.activity)}</span></div><div class="delivery-data"><span>Inicio / fin</span><strong>${esc(w.start)} / ${esc(w.end||'—')}</strong></div><div class="delivery-data"><span>Personal previsto / real</span><strong>${esc(w.planned)} / ${w.actual===null?'—':esc(w.actual)}</strong></div><div class="delivery-data"><span>Estado</span><strong>${esc(w.status)}</strong></div><button class="btn btn-secondary btn-sm" type="button">Abrir</button>`;
    row.querySelector('button').addEventListener('click',()=>openSubcontractModal(w));
    el.subcontractList.appendChild(row);
  });
  if (!state.subcontractWorks.length) el.subcontractList.innerHTML='<div class="empty-state">Todavía no hay incorporaciones planificadas.</div>';
}
function openSubcontractModal(w=null) {
  state.selectedSubcontractWork=w;
  el.subcontractForm.reset();
  el.subcontractId.value=w?.id||'';
  el.subcontractSupplier.value=w?.supplier||'';
  el.subcontractActivity.value=w?.activity||'';
  el.subcontractStart.value=w?.start||'';
  el.subcontractEnd.value=w?.end||'';
  el.subcontractPlanned.value=w?.planned||6;
  el.subcontractActual.value=w?.actual??'';
  el.subcontractStatus.value=w?.status||'PLANIFICADO';
  el.subcontractNotes.value=w?.notes||'';
  el.subcontractMilestones.innerHTML=state.constructionMilestones.map(m=>`<label class="planning-check"><input type="checkbox" value="${esc(m.milestoneId)}" ${(w?.milestoneIds||[]).includes(m.milestoneId)?'checked':''}><span>${esc(m.date)} · ${esc(m.title)}</span></label>`).join('')||'<span class="muted">Sin hitos constructivos.</span>';
  el.deleteSubcontractBtn.classList.toggle('hidden',!w);
  el.subcontractModal.classList.remove('hidden');
}
function closeSubcontractModal() { el.subcontractModal.classList.add('hidden'); state.selectedSubcontractWork=null; }
function saveSubcontract(event) {
  event.preventDefault();
  if (!state.currentProject || state.deliverySubmitting) return;
  setDeliverySubmitting(true);
  postToBackend('subcontractWorkSave',{id:el.subcontractId.value,projectId:state.currentProject.id,supplier:el.subcontractSupplier.value,activity:el.subcontractActivity.value,start:el.subcontractStart.value,end:el.subcontractEnd.value,planned:el.subcontractPlanned.value,actual:el.subcontractActual.value,status:el.subcontractStatus.value,notes:el.subcontractNotes.value,milestoneIds:selectedPlanningIds(el.subcontractMilestones)});
}
function deleteSubcontract() {
  if (!state.selectedSubcontractWork || !window.confirm('¿Desactivar esta planificación?')) return;
  setDeliverySubmitting(true);
  postToBackend('subcontractWorkDelete',{projectId:state.currentProject.id,id:state.selectedSubcontractWork.id});
}
el.newSubcontractBtn.addEventListener('click',()=>openSubcontractModal());
el.closeSubcontractBtn.addEventListener('click',closeSubcontractModal);
el.cancelSubcontractBtn.addEventListener('click',closeSubcontractModal);
el.subcontractModal.querySelector('.modal-backdrop').addEventListener('click',closeSubcontractModal);
el.subcontractForm.addEventListener('submit',saveSubcontract);
el.deleteSubcontractBtn.addEventListener('click',deleteSubcontract);
document.querySelectorAll('[data-planning-filter]').forEach(b=>b.addEventListener('click',()=>{
  state.planningCalendarFilter=b.dataset.planningFilter;
  document.querySelectorAll('[data-planning-filter]').forEach(x=>x.classList.toggle('active',x===b));
  renderDeliveryCalendar();
}));

el.newMilestoneBtn.addEventListener('click', () => openConstructionMilestoneModal());
el.closeMilestoneDetailBtn.addEventListener('click', closeMilestoneDetail);
el.milestoneDetailModal.querySelector('.modal-backdrop').addEventListener('click', closeMilestoneDetail);
el.editMilestoneFromDetailBtn.addEventListener('click', () => {
  const milestone = state.constructionMilestones.find(m => m.milestoneId === state.selectedMilestoneDetailId);
  closeMilestoneDetail();
  if (milestone) openConstructionMilestoneModal(milestone);
});
el.closeConstructionMilestoneModalBtn.addEventListener('click', closeConstructionMilestoneModal);
el.cancelConstructionMilestoneBtn.addEventListener('click', closeConstructionMilestoneModal);
el.constructionMilestoneModal.querySelector('.modal-backdrop').addEventListener('click', closeConstructionMilestoneModal);
el.constructionMilestoneForm.addEventListener('submit', saveConstructionMilestone);
el.deleteConstructionMilestoneBtn.addEventListener('click', deleteConstructionMilestone);

el.closeDeliveryModalBtn.addEventListener('click', closeDeliveryModal);
el.deliveryModal.querySelector('.modal-backdrop').addEventListener('click', closeDeliveryModal);
document.getElementById('warehouseReceiptCheckBtn').addEventListener('click', consultWarehouseReceiptsFromDelivery);
const WAREHOUSE_RECEIPT_URL = 'https://davidferrandoescart.github.io/levitec-almacen-obra/';
function receiptDialogRC11(){
  let d=document.getElementById('receiptDestinationRC11');if(d)return d;
  d=document.createElement('dialog');d.id='receiptDestinationRC11';
  d.className='receipt-destination-dialog';d.setAttribute('aria-labelledby','receiptDestinationTitleRC12');
  d.innerHTML="<div class=\"receipt-dialog-heading\"><span class=\"receipt-dialog-eyebrow\">RECIBIR PEDIDO</span><h2 id=\"receiptDestinationTitleRC12\">Destino de la recepción</h2><p>Selecciona dónde llega el material.</p></div><div class=\"receipt-dialog-body\"><p id=\"receiptDestinationStatusRC11\" role=\"status\" class=\"receipt-dialog-status\"></p><label class=\"receipt-dialog-field\"><span>Almacén</span><select id=\"receiptWarehouseRC11\"></select></label><label class=\"receipt-dialog-field\"><span>Zona de recepción</span><select id=\"receiptZoneRC11\"></select></label><p class=\"receipt-dialog-note\">Podrás revisar las unidades recibidas y las incidencias en Warehouse.</p></div><div class=\"receipt-dialog-footer\"><button type=\"button\" class=\"btn btn-secondary\" id=\"receiptCancelRC11\">Cancelar</button><button type=\"button\" class=\"btn btn-secondary\" id=\"receiptRetryRC11\">Actualizar</button><button type=\"button\" class=\"btn btn-primary\" id=\"receiptContinueRC11\">Continuar a Warehouse →</button></div>";
  document.body.appendChild(d);
  document.getElementById('receiptWarehouseRC11').addEventListener('change',receiptZonesRC11);
  document.getElementById('receiptCancelRC11').onclick=()=>d.close();
  document.getElementById('receiptRetryRC11').onclick=()=>{const p=state.selectedDelivery?.projectId;if(p){document.getElementById('receiptDestinationStatusRC11').textContent='Actualizando destinos…';loadReceiptDestinationsRC13(p,true);}};
  document.getElementById('receiptContinueRC11').onclick=()=>{
    const item=state.selectedDelivery,c=state.receiptDestinations;
    const warehouseId=document.getElementById('receiptWarehouseRC11').value,zone=document.getElementById('receiptZoneRC11').value;
    if(!item||item.requestId!==d.dataset.orderId||item.projectId!==c?.projectId||!c.warehouses.some(w=>w.id===warehouseId)||!c.zones.some(z=>z.warehouseId===warehouseId&&z.zoneId===zone&&z.type==='ALMACEN'))return;
    const url=new URL(WAREHOUSE_RECEIPT_URL);Object.entries({view:'receipt',orderId:item.requestId,projectId:item.projectId,warehouseId,zone}).forEach(([k,v])=>url.searchParams.set(k,v));
    window.open(url.toString(),'_blank','noopener,noreferrer');d.close();
  };
  return d;
}
const receiptDestinationCacheRC13=new Map(),receiptDestinationPendingRC13=new Map();
const RECEIPT_DESTINATION_TTL_RC13=60000;
function resetReceiptDestinationsRC13(){
  receiptDestinationPendingRC13.forEach(p=>{clearTimeout(p.timer);p.frame.remove();p.form.remove();});
  receiptDestinationPendingRC13.clear();receiptDestinationCacheRC13.clear();state.receiptDestinations=null;
}
function receiptDestinationCachedRC13(projectId){
  const entry=receiptDestinationCacheRC13.get(projectId);
  if(entry&&Date.now()-entry.at<RECEIPT_DESTINATION_TTL_RC13)return entry.data;
  const module=wm.bootstrapCache.get(projectId);
  if(module&&Date.now()-module.at<30000&&Array.isArray(module.payload.warehouses)&&Array.isArray(module.payload.zones)){
    const data={projectId,warehouses:module.payload.warehouses,zones:module.payload.zones};
    receiptDestinationCacheRC13.set(projectId,{at:module.at,data});return data;
  }
  return null;
}
function loadReceiptDestinationsRC13(projectId,force=false){
  if(!projectId||checkSessionExpiry_())return;
  const cached=!force&&receiptDestinationCachedRC13(projectId);
  if(cached){state.receiptDestinations=cached;renderReceiptDestinationRC11();return;}
  if(receiptDestinationPendingRC13.has(projectId))return;
  const queryId='dest-'+crypto.randomUUID(),frame=document.createElement('iframe'),form=document.createElement('form');
  frame.name='frame-'+queryId;frame.hidden=true;form.hidden=true;form.method='POST';form.action=el.backendForm.getAttribute('action');form.target=frame.name;
  Object.entries({action:'warehouseReceiptDestinations',credential:state.credential||'',payload:JSON.stringify({projectId,queryId,force})}).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input);});
  const pending={queryId,frame,form,timer:null};
  pending.timer=setTimeout(()=>{
    if(receiptDestinationPendingRC13.get(projectId)!==pending)return;
    receiptDestinationPendingRC13.delete(projectId);frame.remove();form.remove();
    const d=document.getElementById('receiptDestinationRC11');
    if(d?.open&&state.selectedDelivery?.projectId===projectId)document.getElementById('receiptDestinationStatusRC11').textContent='No se ha recibido respuesta. Pulsa Actualizar para reintentar.';
  },30000);
  receiptDestinationPendingRC13.set(projectId,pending);document.body.append(frame,form);form.submit();
}
function handleReceiptDestinationsRC13(payload){
  const projectId=payload?.projectId,pending=receiptDestinationPendingRC13.get(projectId);
  if(!pending||pending.queryId!==payload.queryId)return;
  clearTimeout(pending.timer);pending.frame.remove();pending.form.remove();receiptDestinationPendingRC13.delete(projectId);
  if(!payload.ok||!Array.isArray(payload.warehouses)||!Array.isArray(payload.zones)){
    const d=document.getElementById('receiptDestinationRC11');
    if(d?.open&&state.selectedDelivery?.projectId===projectId)document.getElementById('receiptDestinationStatusRC11').textContent=payload.message||'No se han podido cargar los destinos.';
    return;
  }
  const data={projectId,warehouses:payload.warehouses,zones:payload.zones};
  receiptDestinationCacheRC13.set(projectId,{at:Date.now(),data});
  if(state.selectedDelivery?.projectId===projectId){state.receiptDestinations=data;renderReceiptDestinationRC11();}
}
function receiptZonesRC11(keepZone=''){
  const c=state.receiptDestinations,w=document.getElementById('receiptWarehouseRC11').value,z=document.getElementById('receiptZoneRC11');
  z.replaceChildren(new Option('Selecciona zona',''));
  (c?.zones||[]).filter(x=>x.warehouseId===w&&x.type==='ALMACEN').forEach(x=>z.add(new Option(x.name+' · '+x.zoneId,x.zoneId)));
  if([...z.options].some(x=>x.value===keepZone))z.value=keepZone;
  z.onchange=()=>document.getElementById('receiptContinueRC11').disabled=!z.value;
  document.getElementById('receiptContinueRC11').disabled=!z.value;
}
function renderReceiptDestinationRC11(){
  const d=document.getElementById('receiptDestinationRC11');if(!d?.open)return;
  const c=state.receiptDestinations,item=state.selectedDelivery;
  if(!item||d.dataset.orderId!==item.requestId||c?.projectId!==item.projectId)return;
  const select=document.getElementById('receiptWarehouseRC11'),previous=select.value,zone=document.getElementById('receiptZoneRC11').value;
  select.replaceChildren(new Option('Selecciona almacén',''));
  c.warehouses.forEach(w=>select.add(new Option((w.name||w.id)+' · '+w.id,w.id)));
  select.value=c.warehouses.some(w=>w.id===previous)?previous:c.warehouses.some(w=>w.id==='HUE-MEC-N15')?'HUE-MEC-N15':'';
  document.getElementById('receiptDestinationStatusRC11').textContent=c.warehouses.length?'Elige el almacén y la zona de recepción.':'No hay almacenes activos vinculados al proyecto.';
  receiptZonesRC11(previous===select.value?zone:'');
}
function openDeliveryReceiptInWarehouse(){
  const item=state.selectedDelivery;if(!item?.requestId||!item.projectId||checkSessionExpiry_())return;
  const d=receiptDialogRC11();d.dataset.orderId=item.requestId;
  state.receiptDestinations=receiptDestinationCachedRC13(item.projectId);
  document.getElementById('receiptWarehouseRC11').replaceChildren(new Option('Cargando almacenes…',''));
  document.getElementById('receiptZoneRC11').replaceChildren(new Option('Selecciona almacén primero',''));
  document.getElementById('receiptContinueRC11').disabled=true;
  document.getElementById('receiptDestinationStatusRC11').textContent='Cargando almacenes y zonas…';
  d.showModal();
  if(state.receiptDestinations)renderReceiptDestinationRC11();else loadReceiptDestinationsRC13(item.projectId);
}

document.getElementById('warehouseOpenReceiptBtn').addEventListener('click',openDeliveryReceiptInWarehouse);

el.deliveryMilestoneSelect.addEventListener('change', updateDeliveryMilestoneOffset);
el.saveDeliveryMilestoneBtn.addEventListener('click', saveDeliveryMilestone);
el.saveDeliveryDateBtn.addEventListener('click', saveDeliveryDate);
el.confirmDeliveryReceiptBtn.addEventListener('click', confirmDeliveryReceipt);
el.saveDeliveryCommentBtn.addEventListener('click', saveDeliveryComment);


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

el.newMaterialRequestBtn.addEventListener('click',()=>openMaterialRequestModal());
document.getElementById('warehouseStockSearch').addEventListener('input',renderWarehouseStock);
document.getElementById('warehouseStockZone').addEventListener('change',renderWarehouseStock);
document.getElementById('warehouseStockState').addEventListener('change',renderWarehouseStock);
document.getElementById('warehouseRequestState').addEventListener('change',renderWarehouseRequests);
document.getElementById('warehouseRefreshBtn').addEventListener('click',()=>{
  if(el.warehouseSelect.disabled){wm.bootstrapCache.delete(wmProject());openWarehouse();}
  else if(wm.tab==='zones'){wm.bootstrapCache.delete(wmProject());setStatus(el.warehouseStatus,'Actualizando almacenes y zonas…');wmRead('warehouseBootstrap',{projectId:wmProject()});}
  else if(wm.tab==='requests')wmLoadRequests(true);
  else if(state.selectedWarehouseId)loadWarehouseData(true);
  else{wm.bootstrapCache.delete(wmProject());openWarehouse();}
});
document.getElementById('warehouseRetryRequest').addEventListener('click',wmSendPending);
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
  el.materialRequestResults.innerHTML='<div class="material-search-empty">Consultando existencias…</div>';
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
    project:'ALL'
  });
});
el.workPrevMonthBtn.addEventListener('click', () => {
  const wc = state.workControl;
  wc.currentMonth = new Date(wc.currentMonth.getFullYear(), wc.currentMonth.getMonth()-1, 1);
  postToBackend('workControlMonth', {
    project:'ALL',
    month:workMonthKey(wc.currentMonth)
  });
});
el.workNextMonthBtn.addEventListener('click', () => {
  const wc = state.workControl;
  wc.currentMonth = new Date(wc.currentMonth.getFullYear(), wc.currentMonth.getMonth()+1, 1);
  postToBackend('workControlMonth', {
    project:'ALL',
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
el.refreshEquipmentGlobalBtn.addEventListener('click', refreshEquipmentPositions);
el.equipmentGlobalSearch.addEventListener('input', renderEquipmentGlobal);
el.equipmentGlobalProjectFilter.addEventListener('change', renderEquipmentGlobal);
el.equipmentTypeFilter.addEventListener('change', renderEquipmentGlobal);
el.equipmentCleanMap.addEventListener('click', toggleEquipmentCleanMap);
el.equipmentFullscreen.addEventListener('click', toggleEquipmentFullscreen);


/* MECHANICAL EVENTS */
el.backFromMechanicalBtn.addEventListener('click', () => show(el.projectView));

el.newMechanicalSubmittalBtn.addEventListener('click', () => openMechanicalSubmittalModal());
el.mechanicalSubmittalSearch.addEventListener('input', renderMechanicalSubmittals);
el.mechanicalSubpackageFilter.addEventListener('change', renderMechanicalSubmittals);
el.mechanicalSubmittalStatusFilter.addEventListener('change', renderMechanicalSubmittals);

el.closeMechanicalSubmittalModalBtn.addEventListener('click', closeMechanicalSubmittalModal);
el.cancelMechanicalSubmittalBtn.addEventListener('click', closeMechanicalSubmittalModal);
el.mechanicalSubmittalModal.querySelector('.modal-backdrop').addEventListener('click', closeMechanicalSubmittalModal);
el.mechanicalSubmittalForm.addEventListener('submit', submitMechanicalSubmittal);
el.mechanicalSubmittalSubpackage.addEventListener('change', toggleNewSubpackage);
el.deleteMechanicalSubmittalBtn.addEventListener('click', deleteMechanicalSubmittal);

el.closeMilestoneSubmittalModalBtn.addEventListener('click', closeMilestoneSubmittalModal);
el.cancelMilestoneSubmittalBtn.addEventListener('click', closeMilestoneSubmittalModal);
el.milestoneSubmittalModal.querySelector('.modal-backdrop').addEventListener('click', closeMilestoneSubmittalModal);
el.milestoneSubmittalSearch.addEventListener('input', renderMilestoneSubmittalSelector);
el.milestoneSelectAllVisibleBtn.addEventListener('click', () => selectVisibleMilestoneSubmittals(true));
el.milestoneClearVisibleBtn.addEventListener('click', () => selectVisibleMilestoneSubmittals(false));
el.saveMilestoneSubmittalLinksBtn.addEventListener('click', saveMilestoneSubmittalLinks);


el.fokSearch.addEventListener('input', renderFokTracker);
el.fokCategoryFilter.addEventListener('change', renderFokTracker);
el.fokExecutionFilter.addEventListener('change', renderFokTracker);

el.closeFokEditModalBtn.addEventListener('click', closeFokEditModal);
el.cancelFokEditBtn.addEventListener('click', closeFokEditModal);
el.fokEditModal.querySelector('.modal-backdrop').addEventListener('click', closeFokEditModal);
el.fokEditForm.addEventListener('submit', submitFokEdit);

el.closeMilestoneFokModalBtn.addEventListener('click', closeMilestoneFokModal);
el.cancelMilestoneFokBtn.addEventListener('click', closeMilestoneFokModal);
el.milestoneFokModal.querySelector('.modal-backdrop').addEventListener('click', closeMilestoneFokModal);
el.milestoneFokSearch.addEventListener('input', renderMilestoneFokSelector);
el.milestoneFokSelectAllBtn.addEventListener('click', () => selectVisibleFoks(true));
el.milestoneFokClearBtn.addEventListener('click', () => selectVisibleFoks(false));
el.saveMilestoneFokBtn.addEventListener('click', saveMilestoneFokLinks);

/* EVENTS */
el.logoutBtn.addEventListener('click', logout);
el.backProjectsBtn.addEventListener('click', () => show(el.projectsView));
el.globalAdminBtn.addEventListener('click', openGlobalAdmin);
el.globalPurchaseSearchForm.addEventListener('submit', submitGlobalPurchaseSearch);
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


/* MECHANICAL / PLANOS */
const DRAWING_STATUS_LABELS = {
 PENDIENTE:'Pendiente',EN_DESARROLLO:'En desarrollo',BORRADOR_ENTREGADO:'Borrador entregado',
 REVISION_INTERNA:'Revisión interna',VALIDADO_INTERNAMENTE:'Validado internamente',
 SUBMITTADO:'Submittado / revisión ARUP',APROBADO_ARUP:'Aprobado ARUP',
 RECHAZADO_ARUP:'Rechazado ARUP',BLOQUEADO:'Bloqueado'
};
function setMechanicalTab(tab) {
  state.mechanical.drawingTab = tab;
  document.querySelectorAll('[data-mech-tab]').forEach(x=>x.classList.toggle('active',x.dataset.mechTab===tab));
  document.querySelectorAll('[data-mech-panel]').forEach(x=>x.classList.toggle('hidden',x.dataset.mechPanel!==tab));
  // La información general pertenece ahora a Hitos constructivos.
  el.newMechanicalSubmittalBtn.classList.toggle('hidden',tab!=='submittals'||!state.mechanical.canEdit);
  if((tab==='drawings'||tab==='milestones'||tab==='pending') && !state.mechanical.drawingsLoaded && state.currentProject && !state.mechanical.drawingsLoading)
    { state.mechanical.drawingsLoading=true; postToBackend('mechanicalDrawingList',{projectId:state.currentProject.id}); }
  if(tab==='pending') renderMyDrawingPending();
}
function drawingMe() {return (state.bootstrap?.user?.email||'').toLowerCase();}
function handleDrawingList(payload) {
  if(payload?.projectId!==state.currentProject?.id) return;
  state.mechanical.drawingsLoading=false;
  if(!payload?.ok) {setStatus(el.mechanicalStatus,payload?.message||'Error al cargar planos.','error');return;}
  const m=state.mechanical;
  m.drawings=payload.drawings||[];m.drawingLinks=payload.links||[];m.drawingHistory=[];
  m.drawingCanEdit=!!payload.canEdit;m.drawingCanValidate=!!payload.canValidate;m.drawingsLoaded=true;
  document.getElementById('mechNewDrawing').classList.toggle('hidden',!m.drawingCanEdit);
  renderDrawingOverview();renderDrawings();renderMyDrawingPending();
  if(state.mechanical.milestones.length) renderMechanicalReadiness();
}
function handleDrawingHistory(payload) {
  if(!payload?.ok || payload.projectId!==state.currentProject?.id || !state.mechanical.drawingEditing || payload.drawingId!==state.mechanical.drawingEditing.id) return;
  const events=payload.history||[];
  document.getElementById('mechDrawingHistory').innerHTML=events.length?events.slice(-40).reverse().map(x=>
    `<div class="mech-history-item">${esc(x.at)} · ${esc(x.actor)} · ${esc(x.event)}<br>${esc(x.from||'—')} → ${esc(x.to||'—')} · Rev. ${esc(x.revision||'—')} · ${esc(x.detail||'')}</div>`
  ).join(''):'Sin historial registrado.';
}
function renderMilestoneDrawingGate(milestone) {
 const links=state.mechanical.drawingLinks.filter(x=>x.milestoneId===milestone.milestoneId);
 const items=links.map(l=>state.mechanical.drawings.find(x=>x.id===l.drawingId)).filter(Boolean);
 const isReady=x=>(x.type==='ARUP_REFERENCIA'||x.submittalRequired==='SI') ? x.status==='APROBADO_ARUP' : x.status==='VALIDADO_INTERNAMENTE';
 const requiredItems=items;
 const approved=requiredItems.filter(isReady).length;
 return `<div class="readiness-associated-head"><div><strong>Planos requeridos para el hito</strong><span>${items.length?`${approved}/${requiredItems.length} con condición documental cumplida`:'Sin planos asociados (no configurado)'}</span></div>${state.mechanical.drawingCanEdit?`<button type="button" class="btn btn-secondary btn-sm" data-link-drawings="${esc(milestone.milestoneId)}">Seleccionar planos</button>`:''}</div>
 ${items.length?`<div class="readiness-packages-list">${items.map(x=>`<div class="readiness-package-row ${isReady(x)?'met':'blocking'}"><div><strong>${esc(x.code)}</strong><span>Rev. ${esc(x.revision||'—')} · ${esc(x.title)}</span></div><small>${esc(DRAWING_STATUS_LABELS[x.status]||x.status)}</small></div>`).join('')}</div>`:''}`;
}
function drawingStats() {
  const ds=state.mechanical.drawings;
  return {total:ds.length,approved:ds.filter(x=>x.status==='APROBADO_ARUP').length,
    internal:ds.filter(x=>x.status==='VALIDADO_INTERNAMENTE').length,
    blocked:ds.filter(x=>['BLOQUEADO','RECHAZADO_ARUP'].includes(x.status)).length,
    pending:ds.filter(x=>x.status!=='APROBADO_ARUP').length};
}
function renderDrawingOverview() {
  const stats=drawingStats();
  document.getElementById('mechDrawingOverview').textContent=state.mechanical.drawingsLoaded
    ? `Planos del proyecto: ${stats.total} · Aprobados por ARUP: ${stats.approved} · Bloqueados/rechazados: ${stats.blocked}. El estado de planos se controla independientemente de Submittals y FOK; ningún plano sin asociación equivale a aprobado.`
    : 'Cargando registro de planos…';
  document.getElementById('mechDrawingKpis').innerHTML=[
    ['Planos',stats.total],['Aprobados ARUP',stats.approved],['Validados internamente',stats.internal],['Bloqueados / rechazados',stats.blocked]
  ].map(([label,n])=>`<div class="mechanical-top-kpi mech-drawing-kpi"><span>${esc(label)}</span><strong>${n}</strong></div>`).join('');
}
function drawingPriorityMap() {
  const milestones = [...(state.mechanical.milestones||[])].sort((a,b)=>
    (a.date||'9999-12-31').localeCompare(b.date||'9999-12-31'));
  const byMilestone = new Map(milestones.map((m,i)=>[m.milestoneId,{...m,rank:i}]));
  const priority = new Map();
  for (const link of state.mechanical.drawingLinks) {
    const m=byMilestone.get(link.milestoneId);
    if(m && (!priority.has(link.drawingId) || m.rank<priority.get(link.drawingId).rank)) priority.set(link.drawingId,m);
  }
  return priority;
}
function drawingDone(x) {
  return (x.type==='ARUP_REFERENCIA'||x.submittalRequired==='SI') ? x.status==='APROBADO_ARUP' : x.status==='VALIDADO_INTERNAMENTE';
}
function renderDrawings() {
  const m=state.mechanical,search=document.getElementById('mechDrawingSearch').value.toLowerCase().trim();
  const status=document.getElementById('mechDrawingStatus').value;
  const options=document.getElementById('mechDrawingStatus');
  if(options.options.length===1) Object.entries(DRAWING_STATUS_LABELS).forEach(([k,v])=>options.add(new Option(v,k)));
  const priority=drawingPriorityMap();
  const linkedCounts=new Map();
  for(const l of m.drawingLinks) linkedCounts.set(l.drawingId,(linkedCounts.get(l.drawingId)||0)+1);
  const filtered=m.drawings.filter(x=>(!status||x.status===status)&&
    (!search||[x.code,x.title,x.zone,x.draughtsman,x.engineer].join(' ').toLowerCase().includes(search)))
    .sort((a,b)=>{
      const pa=priority.get(a.id),pb=priority.get(b.id);
      if(!!pa!==!!pb) return pa?-1:1;
      if(pa&&pb&&pa.rank!==pb.rank) return pa.rank-pb.rank;
      if(drawingDone(a)!==drawingDone(b)) return drawingDone(a)?1:-1;
      return (a.deadline||'9999-12-31').localeCompare(b.deadline||'9999-12-31') || (a.code||'').localeCompare(b.code||'');
    });
  document.getElementById('mechDrawingRows').innerHTML=filtered.map(x=>{
    const milestone=priority.get(x.id),linked=linkedCounts.get(x.id)||0;
    const type=x.type==='ARUP_REFERENCIA'?'ARUP · Original XX':x.submittalRequired==='SI'?'Levitec CM · Submittal':'Levitec CM · Instalación';
    return `<tr><td><strong>${esc(x.code)}</strong><br><small>${esc(x.title)}</small><br><small>${esc(type)}</small></td>
    <td>${esc(x.revision||'—')}</td><td>${esc(DRAWING_STATUS_LABELS[x.status]||x.status||'—')}</td>
    <td>${esc(x.draughtsman||'—')}</td><td>${esc(x.engineer||'—')}</td>
    <td>${esc(x.deadline||'—')}</td><td>${milestone?`<strong>${esc(milestone.title)}</strong><br><small>${esc(milestone.date||'Sin fecha')} · ${linked} hito(s)</small>`:'<span class="muted">Sin hito asociado</span>'}</td>
    <td><button type="button" class="btn btn-secondary btn-sm mech-drawing-action" data-drawing-id="${esc(x.id)}">Ver / editar</button></td></tr>`;
  }).join('');
  document.getElementById('mechDrawingEmpty').textContent=filtered.length?'':m.drawingsLoaded?(m.drawings.length?'No hay planos que coincidan con los filtros.':'No hay planos importados para este proyecto. ZAZ091 está pendiente de recibir el tracker verificado; puedes crear planos nuevos manualmente.'):'Cargando…';
  document.querySelectorAll('[data-drawing-id]').forEach(btn=>btn.addEventListener('click',()=>openDrawingModal(m.drawings.find(x=>x.id===btn.dataset.drawingId))));
}
function renderMyDrawingPending() {
  const m=state.mechanical,me=drawingMe();
  const pending=m.drawings.filter(x=>!drawingDone(x) &&
    [x.draughtsman,x.engineer,x.unblockOwner].some(v=>(v||'').toLowerCase().trim()===me));
  const priority=drawingPriorityMap();pending.sort((a,b)=>(priority.get(a.id)?.rank??99999)-(priority.get(b.id)?.rank??99999));
  document.getElementById('mechMyPending').innerHTML=pending.length?pending.map(x=>
    `<div class="mech-pending-item"><strong>${esc(x.code)}</strong> · ${esc(x.title)}<br><small>${esc(DRAWING_STATUS_LABELS[x.status]||x.status)} · ${esc(x.deadline||'Sin fecha límite')}</small></div>`
  ).join(''):'No tienes planos pendientes asignados por correo electrónico en este proyecto.';
}
function drawingForm() {return document.getElementById('mechDrawingForm');}
function closeDrawingModal() {
  document.getElementById('mechDrawingModal').classList.add('hidden');
}
function openDrawingModal(item=null) {
  const m=state.mechanical,form=drawingForm();form.reset();m.drawingEditing=item||null;
  document.getElementById('mechDrawingSave').disabled=false;
  document.getElementById('mechDrawingSave').textContent='Guardar plano';
  document.getElementById('mechDrawingModalTitle').textContent=item?'Plano · '+item.code:'Nuevo plano';
  document.getElementById('mechDrawingFormStatus').classList.add('hidden');
  const select=document.getElementById('mechDrawingEditStatus');select.innerHTML='';
  Object.entries(DRAWING_STATUS_LABELS).forEach(([k,v])=>{
    if(k==='VALIDADO_INTERNAMENTE'&&!m.drawingCanValidate&&item?.status!==k) return;
    select.add(new Option(v,k));
  });
  if(item) ['code','title','zone','revision','status','cdeStatus','deadline','draughtsman','engineer','unblockOwner','submittalRef','path','evidence','notes','submittalRequired'].forEach(k=>{
    if(form.elements[k])form.elements[k].value=item[k]||'';
  });
  drawingUpdateClassification();
  const milestones=m.milestones||[];
  const linked=new Set(m.drawingLinks.filter(x=>x.drawingId===item?.id).map(x=>x.milestoneId));
  document.getElementById('mechDrawingMilestoneChecks').innerHTML=milestones.length?milestones.map(x=>
    `<label class="mech-milestone-option"><input type="checkbox" name="drawingMilestone" value="${esc(x.milestoneId)}" ${linked.has(x.milestoneId)?'checked':''}><span><strong>${esc(x.title)}</strong><small>${esc(x.date||'Sin fecha')}</small></span></label>`
  ).join(''):'No hay hitos Mechanical configurados para este proyecto.';
  const events=m.drawingHistory.filter(x=>x.drawingId===item?.id).slice(-40).reverse();
  document.getElementById('mechDrawingHistory').innerHTML=events.length?events.map(x=>
    `<div class="mech-history-item">${esc(x.at)} · ${esc(x.actor)} · ${esc(x.event)}<br>${esc(x.from||'—')} → ${esc(x.to||'—')} · Rev. ${esc(x.revision||'—')} · ${esc(x.detail||'')}</div>`
  ).join(''):(item?'Cargando historial…':'Sin historial registrado.');
  if(item) postToBackend('mechanicalDrawingHistory',{projectId:state.currentProject.id,drawingId:item.id});
  form.querySelectorAll('input,select,textarea').forEach(x=>{x.disabled=!m.drawingCanEdit;});
  document.getElementById('mechDrawingSave').classList.toggle('hidden',!m.drawingCanEdit);
  document.getElementById('mechDrawingModal').classList.remove('hidden');
}
function drawingUpdateClassification() {
  const f=drawingForm(),code=(f.elements.code.value||'').toUpperCase().split('-');
  const isXX=code.includes('XX'),isCM=code.includes('CM');
  const required=f.elements.submittalRequired;
  required.disabled=isXX || !state.mechanical.drawingCanEdit;
  if(isXX)required.value='SI';
  document.getElementById('mechDrawingClassification').value=isXX?'ARUP · Plano original de proyecto (XX)':isCM?'Levitec · Plano elaborado por nosotros (CM)':'Código sin segmento XX/CM';
}
function submitDrawing(event) {
  event.preventDefault();
  const m=state.mechanical,form=drawingForm();
  const save=document.getElementById('mechDrawingSave');
  // Impedir doble guardado mientras se espera la confirmación del backend.
  if(save.disabled || m.drawingSaveInFlight) return;
  const data=Object.fromEntries(new FormData(form).entries());
  delete data.drawingMilestone;
  if(form.elements.submittalRequired.disabled) data.submittalRequired='SI';
  const selected=[...form.querySelectorAll('input[name="drawingMilestone"]:checked')].map(x=>x.value);
  data.projectId=state.currentProject.id;data.id=m.drawingEditing?.id||'';
  data.expectedUpdatedAt=m.drawingEditing?.updatedAt||'';
  m.drawingSaveInFlight=true;
  m.drawingSaveContext={projectId:data.projectId,milestoneIds:selected};
  save.disabled=true;save.textContent='Guardando…';
  document.getElementById('mechDrawingFormStatus').classList.add('hidden');
  postToBackend('mechanicalDrawingSave',data);
}
function handleDrawingSave(payload) {
  const m=state.mechanical,context=m.drawingSaveContext;
  m.drawingSaveInFlight=false;
  const save=document.getElementById('mechDrawingSave');
  save.disabled=false;save.textContent='Guardar plano';
  if(!context || context.projectId!==state.currentProject?.id) return;
  if(!payload?.ok) {
    setStatus(document.getElementById('mechDrawingFormStatus'),payload?.message||'Error al guardar plano.','error');
    return;
  }
  // El registro YA se ha guardado: cerrar de inmediato, sin esperar a asociar hitos.
  closeDrawingModal();
  m.drawingSaveContext=null;
  m.drawingLinksSaveContext={projectId:context.projectId,drawingId:payload.drawingId};
  setStatus(el.mechanicalStatus,'Plano guardado. Actualizando hitos asociados…','info');
  postToBackend('mechanicalDrawingMilestonesSave',{
    projectId:context.projectId,drawingId:payload.drawingId,milestoneIds:context.milestoneIds
  });
}
function handleDrawingMilestonesSave(payload) {
  const m=state.mechanical,context=m.drawingLinksSaveContext;
  m.drawingLinksSaveContext=null;
  if(!context || context.projectId!==state.currentProject?.id) return;
  if(!payload?.ok) {
    setStatus(el.mechanicalStatus,
      'El plano se guardó, pero NO se pudieron actualizar sus hitos: '+(payload?.message||'Error')+'. Comprueba las asociaciones antes de volver a editar.','error');
  } else {
    setStatus(el.mechanicalStatus,'Plano e hitos asociados guardados correctamente.','success');
  }
  // Recuperar versión y asociaciones vigentes; nunca reutilizar la versión anterior.
  m.drawingsLoading=true;
  postToBackend('mechanicalDrawingList',{projectId:context.projectId});
}

el.mechanicalReadinessGrid.addEventListener('click',e=>{
  const button=e.target.closest('[data-link-drawings]');
  if(button) {openMilestoneDrawingSelector(button.dataset.linkDrawings);return;}
  if(e.target.closest('[data-goto-drawings]'))setMechanicalTab('drawings');
});
function openMilestoneDrawingSelector(milestoneId) {
  const m=state.mechanical, milestone=m.milestones.find(x=>x.milestoneId===milestoneId);
  if(!milestone) return;
  if(!m.drawingsLoaded) {setStatus(el.mechanicalStatus,'Espera a que termine de cargar el listado de planos.');return;}
  const modal=document.getElementById('mechMilestoneDrawingModal');
  modal.dataset.milestoneId=milestoneId;
  document.getElementById('mechMilestoneDrawingTitle').textContent='Planos · '+milestone.title;
  document.getElementById('mechMilestoneDrawingSearch').value='';
  modal._selected=new Set(m.drawingLinks.filter(x=>x.milestoneId===milestoneId).map(x=>x.drawingId));
  renderMilestoneDrawingSelector();modal.classList.remove('hidden');
}
function renderMilestoneDrawingSelector() {
  const modal=document.getElementById('mechMilestoneDrawingModal'),m=state.mechanical;
  const id=modal.dataset.milestoneId,search=document.getElementById('mechMilestoneDrawingSearch').value.toLowerCase().trim();
  const linked=modal._selected||new Set();
  const drawings=[...m.drawings].sort((a,b)=>Number(linked.has(b.id))-Number(linked.has(a.id)) || (a.code||'').localeCompare(b.code||''));
  document.getElementById('mechMilestoneDrawingOptions').innerHTML=drawings.filter(x=>!search||[x.code,x.title].join(' ').toLowerCase().includes(search)).map(x=>
    `<label class="mech-milestone-option"><input type="checkbox" value="${esc(x.id)}" ${linked.has(x.id)?'checked':''}><span><strong>${esc(x.code)}</strong><small>${esc(x.title)}</small></span></label>`).join('')||'No hay planos coincidentes.';
}
document.getElementById('mechMilestoneDrawingOptions').addEventListener('change',e=>{
  if(e.target.matches('input[type=checkbox]')) {
    const modal=document.getElementById('mechMilestoneDrawingModal');
    if(e.target.checked) modal._selected.add(e.target.value);else modal._selected.delete(e.target.value);
  }
});
document.getElementById('mechMilestoneDrawingSearch').addEventListener('input',renderMilestoneDrawingSelector);
document.getElementById('mechMilestoneDrawingClose').addEventListener('click',()=>document.getElementById('mechMilestoneDrawingModal').classList.add('hidden'));
document.getElementById('mechMilestoneDrawingSave').addEventListener('click',()=>{
  const modal=document.getElementById('mechMilestoneDrawingModal');
  if(!state.mechanical.drawingCanEdit) return;
  const id=modal.dataset.milestoneId;
  document.getElementById('mechMilestoneDrawingSave').disabled=true;
  postToBackend('mechanicalMilestoneDrawingsSaveBatch',{
    projectId:state.currentProject.id,milestoneId:id,drawingIds:[...modal._selected]
  });
});
function handleMilestoneDrawingsBatch(payload) {
  document.getElementById('mechMilestoneDrawingSave').disabled=false;
  if(!payload?.ok) {setStatus(el.mechanicalStatus,payload?.message||'Error al asociar planos.','error');return;}
  if(payload.projectId!==state.currentProject?.id) return;
  const m=state.mechanical,id=payload.milestoneId;
  m.drawingLinks=m.drawingLinks.filter(x=>x.milestoneId!==id);
  m.drawingLinks.push(...(payload.drawingIds||[]).map(drawingId=>({milestoneId:id,drawingId})));
  document.getElementById('mechMilestoneDrawingModal').classList.add('hidden');
  renderMechanicalReadiness();renderDrawings();renderMyDrawingPending();
}
drawingForm().elements.code.addEventListener('input',drawingUpdateClassification);
drawingForm().elements.submittalRequired.addEventListener('change',drawingUpdateClassification);
document.querySelectorAll('[data-mech-tab]').forEach(btn=>btn.addEventListener('click',()=>setMechanicalTab(btn.dataset.mechTab)));
document.getElementById('mechNewDrawing').addEventListener('click',()=>openDrawingModal());
document.getElementById('mechDrawingSearch').addEventListener('input',renderDrawings);
document.getElementById('mechDrawingStatus').addEventListener('change',renderDrawings);
document.getElementById('mechDrawingClose').addEventListener('click',closeDrawingModal);
document.getElementById('mechDrawingCancel').addEventListener('click',closeDrawingModal);
document.getElementById('mechDrawingBackdrop').addEventListener('click',closeDrawingModal);
document.getElementById('mechDrawingForm').addEventListener('submit',submitDrawing);
function warehouseDeliveryProgressText_(item){
  if(item.purchaseStatus!=='CONFIRMADO_PROVEEDOR')return 'Pendiente de confirmación';
  const order=state.warehouseOrderProgress?.[item.requestId];
  if(!order)return 'Warehouse: estado sin consultar';
  const lines=order.lines||[];
  const pending=lines.filter(l=>Number(l.pending)>0).length;
  return order.receiptStatus==='COMPLETA'?'Warehouse: recibido completo':
    order.receiptStatus==='PARCIAL'?'Warehouse: parcial · '+pending+' líneas pendientes':
    'Warehouse: pendiente · '+pending+' líneas';
}
function handleWarehouseOrderProgress(payload){
  const consulted=state.warehouseReceiptConsultPending;
  const project=state.warehouseReceiptConsultProject;
  if(!consulted)return;
  if(payload?.projectId&&payload.projectId!==project)return;
  finishWarehouseReceiptConsult_();
  if(project!==state.currentProject?.id)return;
  if(!payload?.ok){
    if(state.selectedDelivery?.requestId===consulted){
      const target=document.getElementById('warehouseReceiptPreviewContent');
      if(target)target.textContent='No se puede consultar Warehouse: '+(payload?.message||'Error de comunicación');
    }
    return;
  }
  if(!Array.isArray(payload.orders)){
    handleWarehouseReceiptContext({ok:false,message:'Warehouse devolvió una respuesta sin lista de pedidos.'});return;
  }
  state.warehouseOrderProgress=Object.fromEntries(payload.orders.map(o=>[o.requestId,o]));
  if(state.selectedDelivery?.requestId===consulted){
    const order=state.warehouseOrderProgress[consulted];
    handleWarehouseReceiptContext({ok:true,requestId:consulted,found:!!order,order:order||null,
      message:'La consulta no devolvió este pedido. Comprueba el proyecto y la sincronización en Warehouse.'});
  }
  renderDeliveryList();
}

function handleWarehouseSyncConfirmedOrders(payload){
  const btn=$('warehouseSyncOrdersBtn'),info=$('warehouseSyncOrdersInfo');
  if(btn)btn.disabled=false;
  if(!info)return;
  if(!payload?.ok){info.textContent='Error de sincronización: '+(payload?.message||'Error');return;}
  info.textContent=payload.message+' '+(payload.failed?'Revisa las incidencias en el resumen que aparece a continuación.':'');
  if(payload.failed){
    const errors=(payload.results||[]).filter(r=>r.ok===false).map(r=>r.requestId+': '+r.error).slice(0,12);
    info.textContent+=' '+errors.join(' | ');
  }
  // Sin consulta remota automática después de sincronizar.
}
$('warehouseSyncOrdersBtn')?.addEventListener('click',()=>{
  if(!state.currentProject)return;
  const btn=$('warehouseSyncOrdersBtn');
  if(btn.disabled)return;
  btn.disabled=true;
  $('warehouseSyncOrdersInfo').textContent='Sincronizando pedidos confirmados…';
  postToBackend('warehouseSyncConfirmedOrders',{projectId:state.currentProject.id});
});
})();
