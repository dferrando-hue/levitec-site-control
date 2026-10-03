(() => {
'use strict';
const CONFIG=window.LEVITEC_CONFIG;
const state={credential:null,bootstrap:null,currentProject:null};
const $=id=>document.getElementById(id);
const el={loginView:$('loginView'),projectsView:$('projectsView'),projectView:$('projectView'),googleButton:$('googleButton'),loginStatus:$('loginStatus'),topUser:$('topUser'),topUserName:$('topUserName'),topUserMeta:$('topUserMeta'),logoutBtn:$('logoutBtn'),welcomeText:$('welcomeText'),projectsGrid:$('projectsGrid'),noProjects:$('noProjects'),backProjectsBtn:$('backProjectsBtn'),currentProjectName:$('currentProjectName'),currentProjectMeta:$('currentProjectMeta'),heroProjectName:$('heroProjectName'),heroProjectSubtitle:$('heroProjectSubtitle'),heroProjectRole:$('heroProjectRole'),modulesGrid:$('modulesGrid'),backendForm:$('backendForm'),backendAction:$('backendAction'),backendCredential:$('backendCredential')};

const ROLE_LABELS={ADMIN:'Administrador',PROJECT_MANAGER:'Project Manager',SITE_MANAGER:'Jefe de obra',FOREMAN:'Encargado',ENGINEER:'Ingeniero',WAREHOUSE:'Almacenero',VIEWER:'Consulta'};
const DISCIPLINE_LABELS={MECHANICAL:'Mechanical',ELECTRICAL:'Electrical',ALL:'Todas las disciplinas'};
const MODULES=[
{key:'site',title:'Site',icon:'S',description:'Presencia, control de trabajos e incidencias operativas.',tags:['Presencia','Trabajos','Incidencias']},
{key:'equipment',title:'Equipment',icon:'E',description:'Localización, disponibilidad y solicitudes de maquinaria.',tags:['Tracking','Requests','Reservas']},
{key:'warehouse',title:'Warehouse',icon:'W',description:'Stock, solicitudes de material, recepciones y movimientos.',tags:['Stock','Solicitudes','Multi-almacén']},
{key:'deliveries',title:'Deliveries',icon:'D',description:'Entregas previstas, calendario operativo y confirmaciones.',tags:['Calendario','Pedidos','Recepciones']},
{key:'documents',title:'Documentación / Permisos',icon:'P',description:'Preparación interna de RFI, RAMS y E-Permits.',tags:['RFI','RAMS','E-Permits']},
{key:'mechanical',title:'Mechanical',icon:'M',description:'Vista operativa y herramientas específicas de mecánica.',tags:['Mechanical']},
{key:'electrical',title:'Electrical',icon:'⚡',description:'Vista operativa y herramientas específicas de eléctrica.',tags:['Electrical']},
{key:'admin',title:'Administración',icon:'A',description:'Usuarios, proyectos, roles y permisos de la plataforma.',tags:['Usuarios','Proyectos','Permisos']}
];

function show(v){[el.loginView,el.projectsView,el.projectView].forEach(x=>x.classList.add('hidden'));v.classList.remove('hidden')}
function setStatus(m,k='info'){el.loginStatus.textContent=m;el.loginStatus.className='status '+k;el.loginStatus.classList.remove('hidden')}
function clearStatus(){el.loginStatus.classList.add('hidden');el.loginStatus.textContent=''}

function initGoogleIdentity(){
 if(!window.google||!google.accounts||!google.accounts.id){setTimeout(initGoogleIdentity,150);return}
 google.accounts.id.initialize({client_id:CONFIG.GOOGLE_CLIENT_ID,callback:handleGoogleCredential,auto_select:false,cancel_on_tap_outside:false});
 google.accounts.id.renderButton(el.googleButton,{theme:'outline',size:'large',shape:'rectangular',text:'signin_with',width:360,logo_alignment:'left'});
}

function handleGoogleCredential(r){
 if(!r||!r.credential){setStatus('Google no devolvió una credencial válida.','error');return}
 state.credential=r.credential;
 setStatus('Validando usuario y permisos…','info');
 el.backendAction.value='bootstrap';
 el.backendCredential.value=state.credential;
 el.backendForm.submit();
}

window.addEventListener('message',event=>{
 const valid=event.origin==='https://script.google.com'||event.origin.endsWith('.googleusercontent.com');
 if(!valid)return;
 const msg=event.data;
 if(!msg||msg.source!==CONFIG.MESSAGE_SOURCE)return;
 if(msg.type==='bootstrap')return handleBootstrap(msg.payload);
 if(msg.type==='error')setStatus(msg.payload?.message||'Error de servidor.','error');
});

function handleBootstrap(p){
 if(!p||p.ok!==true){setStatus(p?.message||'No se ha podido iniciar sesión.','error');return}
 state.bootstrap=p;clearStatus();renderUser();renderProjects();show(el.projectsView)
}

function renderUser(){
 const u=state.bootstrap.user;
 const role=ROLE_LABELS[u.role]||u.role;
 const disc=DISCIPLINE_LABELS[u.discipline]||u.discipline;
 el.topUserName.textContent=u.name||u.email;
 el.topUserMeta.textContent=[role,disc].filter(Boolean).join(' · ');
 el.topUser.classList.remove('hidden');
 el.welcomeText.textContent=`${u.name||u.email} · ${role} · ${disc}`;
}

function renderProjects(){
 const projects=Array.isArray(state.bootstrap.projects)?state.bootstrap.projects:[];
 el.projectsGrid.innerHTML='';
 if(!projects.length){el.noProjects.classList.remove('hidden');return}
 el.noProjects.classList.add('hidden');
 projects.forEach(project=>{
   const c=document.createElement('article');c.className='project-card';
   const role=ROLE_LABELS[project.projectRole]||project.projectRole||'';
   c.innerHTML=`<div class="project-card-top"><div><h2>${esc(project.name||project.id)}</h2><div class="project-campus">${esc(project.campus||'')}</div></div><div class="project-chip">ACTIVO</div></div><div class="project-role">${esc(role)}</div><button class="btn btn-primary" type="button">Abrir proyecto →</button>`;
   c.querySelector('button').addEventListener('click',()=>openProject(project));
   el.projectsGrid.appendChild(c);
 });
}

function openProject(project){
 state.currentProject=project;
 const role=ROLE_LABELS[project.projectRole]||project.projectRole||'';
 el.currentProjectName.textContent=project.name||project.id;
 el.currentProjectMeta.textContent=[project.campus,role].filter(Boolean).join(' · ');
 el.heroProjectName.textContent=project.name||project.id;
 el.heroProjectSubtitle.textContent=`${project.campus||''}${project.campus?' · ':''}Gestión operativa de proyecto`;
 el.heroProjectRole.textContent=role||'Proyecto';
 renderModules();show(el.projectView);
}

function renderModules(){
 el.modulesGrid.innerHTML='';
 const access=state.bootstrap.modules||{};
 MODULES.filter(m=>access[m.key]===true).forEach(m=>{
  const c=document.createElement('article');c.className='module-card';
  c.innerHTML=`<div class="module-icon">${esc(m.icon)}</div><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><div class="module-actions">${m.tags.map(t=>`<span class="module-tag">${esc(t)}</span>`).join('')}</div>`;
  el.modulesGrid.appendChild(c);
 });
}

function logout(){
 state.credential=null;state.bootstrap=null;state.currentProject=null;
 if(window.google?.accounts?.id)google.accounts.id.disableAutoSelect();
 el.topUser.classList.add('hidden');el.projectsGrid.innerHTML='';el.modulesGrid.innerHTML='';clearStatus();show(el.loginView)
}
function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
el.logoutBtn.addEventListener('click',logout);
el.backProjectsBtn.addEventListener('click',()=>show(el.projectsView));
show(el.loginView);initGoogleIdentity();
})();