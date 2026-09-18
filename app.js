const talents = [
  {id:1,name:"Maria Eduarda",handle:"@mariaeduarda",category:"Canto",views:"2.3k",image:"assets/maria-eduarda.png",description:"Sonhos também se cantam!"},
  {id:2,name:"João Pedro",handle:"@joaopedro",category:"Música",views:"1.8k",image:"assets/joao-pedro.png",description:"Meu som, minha história."},
  {id:3,name:"Ana Clara",handle:"@anaclara",category:"Dança",views:"3.1k",image:"assets/ana-clara.png",description:"Dançar é contar histórias."},
  {id:4,name:"Lucas Silva",handle:"@lucassilva",category:"Comédia",views:"1.2k",image:"assets/lucas-silva.png",description:"Tentando fazer você rir."},
  {id:5,name:"Beatriz Lima",handle:"@beatrizlima",category:"Arte",views:"980",image:"assets/beatriz-lima.png",description:"Criatividade sem limites."},
  {id:6,name:"Rafael Souza",handle:"@rafaelsouza",category:"Música",views:"1.6k",image:"assets/rafael-souza.png",description:"Novas versões, novos sons."}
];

let currentView = "home";
let activeFilter = "Todos";
let favorites = JSON.parse(localStorage.getItem("brilhaFavorites") || "[1,3,4]");

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200);
}

function enterApp(){
  $("#authScreen").classList.add("hidden");
  $("#appScreen").classList.remove("hidden");
  renderAll();
}

$("#enterBtn").addEventListener("click", enterApp);

function logout(){
  $("#appScreen").classList.add("hidden"); $("#authScreen").classList.remove("hidden");
}
$("#logoutBtn").addEventListener("click",logout);
$("#logoutSettings").addEventListener("click",logout);

function navigate(view){
  currentView=view;
  $$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));
  $$(".side-link[data-view],.nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  window.scrollTo({top:0,behavior:"smooth"});
  if(view==="explore") renderExplore();
  if(view==="favorites") renderFavorites();
  if(view==="profile") renderProfile();
}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));

$$(".back-view").forEach(b=>b.addEventListener("click",()=>navigate("home")));

function card(t){
  return `<article class="talent-card" data-id="${t.id}">
    <img src="${t.image}" alt="${t.name}">
    <div class="card-body"><b>${t.name}</b><small>${t.category} · ${t.views} visualizações</small></div>
  </article>`;
}
function renderHome(){
  $("#featuredGrid").innerHTML=talents.slice(0,3).map(card).join("");
  bindCards();
}
function renderExplore(){
  const q=($("#exploreSearch")?.value||"").toLowerCase();
  const filtered=talents.filter(t=>(activeFilter==="Todos"||t.category===activeFilter) && (`${t.name} ${t.category} ${t.handle}`.toLowerCase().includes(q)));
  $("#talentList").innerHTML=filtered.map(t=>`<article class="talent-row" data-id="${t.id}">
    <img src="${t.image}" alt="${t.name}">
    <div><b>${t.name}</b><small>${t.category} · ${t.views} visualizações</small><small>${t.description}</small></div>
    <button class="heart" data-fav="${t.id}">${favorites.includes(t.id)?"♥":"♡"}</button>
  </article>`).join("") || `<p style="color:#8792a9;font-size:12px">Nenhum talento encontrado.</p>`;
  $$(".talent-row").forEach(r=>r.addEventListener("click",e=>{if(!e.target.closest("[data-fav]")) openTalent(+r.dataset.id)}));
  $$("[data-fav]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();toggleFavorite(+b.dataset.fav)}));
}
function renderProfile(){
  $("#profileGrid").innerHTML=talents.filter(t=>[1,2,3,4].includes(t.id)).map(card).join("");
  bindCards();
}
function renderFavorites(){
  const list=talents.filter(t=>favorites.includes(t.id));
  $("#favoriteList").innerHTML=list.map(t=>`<article class="favorite-item" data-id="${t.id}">
    <img src="${t.image}" alt="${t.name}"><div><b>${t.name}</b><small>${t.category} · ${t.views} visualizações</small></div>
    <button data-fav="${t.id}">♥</button>
  </article>`).join("") || `<p style="color:#8792a9;font-size:12px">Você ainda não tem favoritos.</p>`;
  $$(".favorite-item").forEach(r=>r.addEventListener("click",e=>{if(!e.target.closest("[data-fav]"))openTalent(+r.dataset.id)}));
  $$("[data-fav]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();toggleFavorite(+b.dataset.fav)}));
}
function bindCards(){
  $$(".talent-card").forEach(c=>c.addEventListener("click",()=>openTalent(+c.dataset.id)));
}
function openTalent(id){
  const t=talents.find(x=>x.id===id); if(!t)return;
  $("#videoTalentImage").src=t.image; $("#videoTalentName").textContent=t.name; $("#videoTalentHandle").textContent=t.handle;
  $("#videoDescription").textContent=t.description;
  navigate("video");
}
function toggleFavorite(id){
  favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
  localStorage.setItem("brilhaFavorites",JSON.stringify(favorites));
  renderExplore(); renderFavorites(); renderProfile();
  toast(favorites.includes(id)?"Adicionado aos favoritos":"Removido dos favoritos");
}

$$(".chip").forEach(c=>c.addEventListener("click",()=>{
  activeFilter=c.dataset.filter;
  $$(".chip").forEach(x=>x.classList.toggle("active",x===c)); renderExplore();
}));
$("#exploreSearch").addEventListener("input",renderExplore);
$("#homeSearch").addEventListener("input",()=>{
  if($("#homeSearch").value.trim()){navigate("explore");$("#exploreSearch").value=$("#homeSearch").value;renderExplore();}
});
$$(".category").forEach(c=>c.addEventListener("click",()=>{
  activeFilter=c.dataset.category;
  navigate("explore");
  $$(".chip").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));
  renderExplore();
}));

$("#likeVideo").addEventListener("click",e=>{
  const b=e.currentTarget; b.classList.toggle("liked"); b.firstChild.textContent=b.classList.contains("liked")?"♥":"♡"; toast(b.classList.contains("liked")?"Vídeo curtido":"Curtida removida");
});
$("#followBtn").addEventListener("click",e=>{
  e.currentTarget.textContent=e.currentTarget.textContent==="Seguir"?"Seguindo":"Seguir";
});
$("#playButton").addEventListener("click",()=>toast("Prévia do vídeo — substitua pelo seu arquivo de vídeo."));
$("#editProfile").addEventListener("click",()=>toast("Área de edição de perfil pronta para conectar ao backend."));

$("#videoFile").addEventListener("change",e=>{
  $("#fileName").textContent=e.target.files[0]?.name||"";
});
$("#uploadForm").addEventListener("submit",e=>{
  e.preventDefault();
  const title=$("#talentTitle").value;
  toast(`"${title}" foi publicado com sucesso!`);
  e.target.reset(); $("#fileName").textContent="";
  setTimeout(()=>navigate("profile"),600);
});

$$(".favorite-tabs .tab").forEach(b=>b.addEventListener("click",()=>{
  $$(".favorite-tabs .tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  toast(b.textContent+" selecionados");
}));

function renderAll(){renderHome();renderExplore();renderProfile();renderFavorites();}
