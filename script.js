
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('.copy').forEach(btn=>btn.addEventListener('click',async()=>{
  const original=btn.textContent;
  try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent='Copié ✓';}
  catch(e){btn.textContent='À copier';}
  setTimeout(()=>btn.textContent=original,1500);
}));

// V7 — formulaire d'avis.
// Le site restant statique, l'envoi prépare pour l'instant un e-mail de validation.
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(reviewForm);
    const name = (data.get('name') || '').trim();
    const company = (data.get('company') || '').trim();
    const status = reviewForm.querySelector('.review-status');

    if (!name && !company) {
      status.textContent = 'Merci d’indiquer au minimum votre nom ou votre entreprise.';
      return;
    }

    const body = [
      'Nouvel avis depuis remybarranco.fr',
      '',
      `Nom : ${name || 'Non renseigné'}`,
      `Entreprise : ${data.get('company') || 'Non renseignée'}`,
      `Fonction : ${data.get('role') || 'Non renseignée'}`,
      `Mission / contexte : ${data.get('context') || 'Non renseigné'}`,
      `Note : ${data.get('rating')}/5`,
      '',
      'Avis :',
      data.get('review')
    ].join('\n');

    const subject = encodeURIComponent('Nouvel avis – Rémy Barranco Skipper');
    window.location.href = `mailto:remy.barranco@hotmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Votre logiciel de messagerie va s’ouvrir pour envoyer l’avis.';
  });
}

// V16 — moteur consolidé : matrice ENIM, garde-fous de prérogatives et demandes manuelles complètes.
// Les paramètres réglementaires restent internes : le client décrit sa mission.
(() => {
 const form=document.getElementById('pricing-simulator'); if(!form)return;
 const $=id=>document.getElementById(id), show=id=>$(id)?.classList.remove('sim-hidden'), hide=id=>$(id)?.classList.add('sim-hidden');
 const service=$('service-type'),sector=$('sector'),nav=$('navigation'),vessel=$('vessel-type'),fn=$('function'),specialVessel=$('special-vessel'),power=$('power-kw'),gauge=$('gauge'),franc=$('francisation-era'),owner=$('owner-onboard'),length=$('length-band'),mode=$('duration-mode'),result=$('result');
 const CONFIG={
  year:2026, targetHourly:15, csgEffective:.0485, cfpPerSocialDay:120/360,
  personalRetirement:.1085, personalHealth:.005,
  salaryForfaitaire:{1:47.20,2:50.68,3:54.39,4:60.34,5:67.16,6:74.60,7:79.23,8:83.39,9:87.15,10:92.07,11:99.56,12:109.16,13:118.48,14:128.25,15:138.46,16:149.14,17:160.31,18:172.00,19:184.21,20:196.98}
 };
 const SF=CONFIG.salaryForfaitaire;
 const functions={
  commerce:[['matelot','Matelot / Marin qualifié pont'],['chef-veilleur','Chef veilleur'],['chef-quart','Chef de quart pont'],['capitaine','Capitaine / Chef de bord'],['mecanicien250','Mécanicien — certificat 250 kW'],['autre','Autre fonction']],
  plaisance:[['equipier','Équipier'],['chef-bord','Chef de bord'],['patron','Patron breveté'],['mecanicien250','Mécanicien — certificat 250 kW'],['matelot','Matelot'],['autre','Autre fonction']],
  cultures:[['chef-entreprise','Marin chef d’entreprise'],['capitaine','Capitaine de navire'],['chef-entreprise-conchy','Marin chef d’entreprise apte conduite conchylicole'],['cadre-conchy','Marin cadre apte conduite conchylicole'],['cadre','Marin cadre'],['chef-equipe-conchy','Marin chef d’équipe apte conduite conchylicole'],['chef-equipe','Marin chef d’équipe'],['matelot-conchy','Matelot ouvrier apte conduite conchylicole'],['matelot-ouvrier','Matelot ouvrier'],['autre','Autre fonction']],
  peche:[['matelot','Matelot'],['autre','Autre fonction / commandement à vérifier']],
  remorquage:[['capitaine','Capitaine'],['patron','Patron breveté'],['matelot','Matelot / Marin qualifié pont'],['mecanicien250','Mécanicien 250 kW'],['autre','Autre fonction']],
  travaux:[['capitaine','Capitaine'],['second-capitaine','Second capitaine'],['chef-mecanicien','Chef mécanicien'],['second-polyvalent','Second polyvalent'],['second-mecanicien','Second mécanicien'],['lieutenant','Lieutenant'],['chef-quart','Chef de quart pont'],['officier-mecanicien','Officier mécanicien'],['chef-quart-machine','Chef de quart machine'],['matelot','Matelot / Marin qualifié pont'],['autre','Autre fonction']]
 };
 const money=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);
 function fixedFunction(){if(service.value==='nuc'||service.value==='convoyage-skipper')return'chef-bord';if(service.value==='convoyage-crew')return'equipier';if(service.value==='matelot'&&sector.value==='commerce')return'matelot';return null}
 function setFunctions(){const old=fn.value;fn.innerHTML='<option value="">Sélectionnez</option>'+((functions[sector.value]||[['autre','Autre fonction']]).map(([v,t])=>`<option value="${v}">${t}</option>`).join('')); if([...fn.options].some(o=>o.value===old))fn.value=old}
 const specialVessels={
  remorquage:[['remorqueur-portuaire','Remorqueur portuaire côtier'],['remorqueur-haute-mer','Remorqueur de haute mer'],['servitude','Navire de servitude'],['barge-motorisee','Chaland / ponton / barge motorisé'],['chaland-auto','Chaland automoteur portuaire'],['chaland-portuaire','Chaland portuaire'],['lamanage','Navire de lamanage'],['pilotage','Navire de pilotage']],
  travaux:[['baliseur-a','Baliseur catégorie A'],['drague-desagregateur','Drague à désagrégateur'],['refouleur','Refouleur / élévateur'],['drague-bennes','Drague à bennes'],['drague-aspiratrice','Drague aspiratrice'],['drague-godets','Drague à godets'],['porteur-deblais','Porteur à déblais automoteur']]
 };
 function setSpecialVessels(){const rows=specialVessels[sector.value]||[];specialVessel.innerHTML='<option value="">Sélectionnez</option>'+rows.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}
 function gaugeMin(){const g=gauge.value; if(g==='lt4')return 0;if(g==='4-10')return 4;if(g==='10-15')return 10;if(g==='15-30')return 15;if(g==='30-35')return 30;if(g==='35-50')return 35;if(g==='gt50')return 51;return null}
 function specialClassification(f){const sv=specialVessel.value,p=Number(power.value||0),gm=gaugeMin();
  if(sector.value==='remorquage'){
   if(!sv)return{needsSpecial:true};
   if(['remorqueur-portuaire','remorqueur-haute-mer'].includes(sv)&&!p)return{needsPower:true};
   if(['servitude','barge-motorisee','chaland-auto','lamanage','pilotage'].includes(sv)&&gm===null)return{needsGauge:true};
   if(sv==='remorqueur-portuaire'){if(f==='patron'&&p<360)return{cat:12};if(f==='capitaine'&&p>=360&&p<500)return{cat:13};}
   if(sv==='remorqueur-haute-mer'&&f==='capitaine'&&p>=500)return{cat:15};
   if(sv==='servitude'&&f==='patron'&&gm<4)return{cat:6};
   if(sv==='barge-motorisee'&&f==='patron'&&gm>=4&&gm<15)return{cat:9};
   if(sv==='chaland-auto'&&f==='capitaine'&&gm>=15)return{cat:11};
   if(sv==='lamanage'&&f==='patron'){if(gm<4)return{cat:6};if(gm<15)return{cat:9};return{cat:12}}
   if(sv==='pilotage'){if(f==='patron'){if(gm<4)return{cat:6};if(gm<15)return{cat:9};return{cat:12}}if(f==='matelot')return{cat:5}}
  }
  if(sector.value==='travaux'){
   if(!sv)return{needsSpecial:true}; const map=(a)=>a[f]||null; let m=null;
   if(sv==='baliseur-a'){m=nav.value==='cotiere'?{capitaine:12,'chef-mecanicien':12}:['cabotage-national','cabotage-international'].includes(nav.value)?{capitaine:16,'second-capitaine':12,'chef-mecanicien':16,'second-polyvalent':12,'second-mecanicien':12,lieutenant:10,'officier-mecanicien':10}:null}
   else {if(!p)return{needsPower:true}; if(sv==='drague-desagregateur')m=p<500?{capitaine:11,'second-capitaine':9,'chef-mecanicien':11,'second-polyvalent':9,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9}:p<2200?{capitaine:13,'second-capitaine':11,'chef-mecanicien':13,'second-polyvalent':11,'second-mecanicien':11,'chef-quart':9,'chef-quart-machine':9}:{capitaine:15,'second-capitaine':12,'chef-mecanicien':15,'second-polyvalent':12,'second-mecanicien':12,'chef-quart':9,'chef-quart-machine':9};
    if(['refouleur','drague-bennes'].includes(sv))m=p<500?{capitaine:11,'second-capitaine':9,'chef-mecanicien':11,'second-polyvalent':9,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9}:{capitaine:13,'second-capitaine':9,'chef-mecanicien':13,'second-polyvalent':9,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9};
    if(sv==='drague-aspiratrice')m=p<1100?{capitaine:13,'second-capitaine':9,'chef-mecanicien':13,'second-polyvalent':9,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9}:p<2200?{capitaine:15,'second-capitaine':12,'chef-mecanicien':15,'second-polyvalent':12,'second-mecanicien':12,lieutenant:10,'chef-quart':10,'officier-mecanicien':10,'chef-quart-machine':10}:p<7500?{capitaine:16,'second-capitaine':12,'chef-mecanicien':16,'second-polyvalent':12,'second-mecanicien':12,lieutenant:10,'chef-quart':10,'officier-mecanicien':10,'chef-quart-machine':10}:{capitaine:18,'second-capitaine':14,'chef-mecanicien':18,'second-polyvalent':14,'second-mecanicien':14,lieutenant:11,'chef-quart':11,'officier-mecanicien':11,'chef-quart-machine':11};
    if(sv==='drague-godets')m=p<220?{capitaine:11,'second-capitaine':9,'chef-mecanicien':11,'second-polyvalent':9,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9}:{capitaine:13,'second-capitaine':9,'chef-mecanicien':13,'second-polyvalent':9,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9};
    if(sv==='porteur-deblais')m=p<220?{capitaine:11,'second-capitaine':9,'chef-mecanicien':11,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9}:p<=500?{capitaine:12,'second-capitaine':9,'chef-mecanicien':12,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9}:{capitaine:13,'second-capitaine':9,'chef-mecanicien':13,'second-mecanicien':9,'chef-quart':9,'chef-quart-machine':9};
   }
   const c=m&&map(m);if(c)return{cat:c};
  }
  return{manual:true,why:'La matrice contient ce secteur, mais cette combinaison précise de navire et de fonction nécessite une vérification.'};
 }
 function classification(){const f=fixedFunction()||fn.value; let cat=null,manual=false,why='';
  if(!sector.value||!nav.value)return{ready:false};
  if(sector.value==='unknown'||nav.value==='unknown'){manual=true;why='Le secteur ou le genre de navigation doit être confirmé.'}
  else if(service.value==='nuc'){if(nav.value==='cotiere')cat=6;else if(['cabotage-international','long-cours'].includes(nav.value))cat=12;else{manual=true;why='Cette combinaison NUC n’est pas déterminée de façon unique dans la matrice actuellement intégrée.'}}
  else if(sector.value==='plaisance'&&f==='equipier'){if(nav.value==='cotiere')cat=3;else if(nav.value==='cabotage-international')cat=8;else{manual=true;why='La catégorie n’est pas renseignée de façon exploitable dans la matrice pour ce genre de navigation.'}}
  else if(sector.value==='plaisance'&&f==='chef-bord'){if(nav.value==='cotiere')cat=6;else if(nav.value==='cabotage-international')cat=12;else{manual=true;why='La catégorie n’est pas renseignée de façon exploitable dans la matrice pour ce genre de navigation.'}}
  else if(sector.value==='plaisance'&&f==='patron'&&nav.value==='cotiere'){if(!gauge.value)return{ready:false,needsGauge:true};if(gauge.value==='unknown'){manual=true;why='La jauge est nécessaire.'}else if(gauge.value==='lt4')cat=6;else if(['4-10','10-15'].includes(gauge.value))cat=9;else cat=12;}
  else if(sector.value==='plaisance'&&f==='mecanicien250'&&nav.value==='cotiere'){if(!gauge.value)return{ready:false,needsGauge:true};if(gauge.value==='unknown'){manual=true;why='La jauge est nécessaire.'}else if(['4-10','10-15'].includes(gauge.value))cat=6;else{manual=true;why='Le tableau fourni ne renseigne pas cette fonction pour cette tranche de jauge.'}}
  else if(sector.value==='plaisance'&&f==='matelot'){if(['cotiere','cabotage-national','cabotage-international','long-cours'].includes(nav.value))cat=5;else{manual=true;why='Le genre de navigation doit être confirmé.'}}
  else if(sector.value==='commerce'&&f==='matelot')cat=5;
  else if(sector.value==='commerce'&&f==='chef-veilleur')cat=7;
  else if(sector.value==='commerce'&&f==='mecanicien250'&&nav.value==='cotiere'){if(!gauge.value)return{ready:false,needsGauge:true};if(gauge.value==='unknown'){manual=true;why='La jauge est nécessaire.'}else if(['4-10','10-15'].includes(gauge.value))cat=6;else{manual=true;why='Le tableau Commerce navigation côtière ne renseigne pas le mécanicien 250 kW dans cette tranche.'}}
  else if(sector.value==='peche'){manual=true;why='Le tableau permet un classement pêche, mais l’accessibilité du poste dépend de titres pêche spécifiques : aucune catégorie n’est appliquée automatiquement à partir du seul Capitaine 200 commerce.'}
  else if(sector.value==='commerce'&&['capitaine','chef-bord'].includes(f)&&nav.value==='cotiere'){
   if(!gauge.value)return{ready:false,needsGauge:true}; if(gauge.value==='unknown'){manual=true;why='La jauge doit être connue pour départager le classement.'} else if(gauge.value==='lt4')cat=6; else if(['4-10','10-15'].includes(gauge.value))cat=9; else cat=12;
  } else if(sector.value==='cultures'){
   const cultureCats={'chef-entreprise':6,'capitaine':8,'chef-entreprise-conchy':8,'cadre-conchy':7,'cadre':5,'chef-equipe-conchy':5,'chef-equipe':4,'matelot-conchy':4,'matelot-ouvrier':3};
   if(cultureCats[f]){cat=cultureCats[f];manual=true;why='La catégorie figure bien dans le tableau Cultures marines, mais l’aptitude réglementaire à occuper cette fonction doit être confirmée avant devis.'}else{manual=true;why='La fonction sélectionnée nécessite une étude au regard du tableau Cultures marines.'}
  }
  else if(['remorquage','travaux'].includes(sector.value)){const sp=specialClassification(f);if(sp.needsSpecial)return{ready:false,needsSpecial:true};if(sp.needsPower)return{ready:false,needsPower:true};if(sp.needsGauge)return{ready:false,needsGauge:true};if(sp.cat){cat=sp.cat;manual=true;why='Le classement catégoriel est identifié dans la matrice fournie. Le barème de cotisations propre à ce secteur doit encore être confirmé avant d’afficher un prix.'}else{manual=true;why=sp.why}}
  else {manual=true;why='Cette combinaison n’est pas déterminable automatiquement avec certitude à partir des données disponibles.'}
  return{ready:true,cat,manual,why,func:f};
 }
 function contribRates(){
  // Le barème de cotisations intégré est celui documenté pour les cas commerce/plaisance traités.
  // Les autres secteurs restent en étude tant que leur arbre de taux n'est pas sourcé et intégré.
  if(!['commerce','plaisance'].includes(sector.value))return{ready:true,manual:true,why:'Le classement catégoriel peut être identifié, mais le régime de cotisations de ce secteur doit être confirmé avant chiffrage.'};
  if(!franc.value||!owner.value||!length.value)return{ready:false};
  if([franc.value,owner.value,length.value].includes('unknown'))return{ready:true,manual:true};
  const isCoastal=nav.value==='cotiere';
  const ownerOnboard=owner.value==='yes';
  const post1986=franc.value==='post1986';
  let r=null;
  if(isCoastal&&ownerOnboard){
   if(post1986){r=length.value==='le12'?[.016,.0685]:[.156,.11]}
   else {if(!gauge.value)return{ready:false,needGauge:true};if(gauge.value==='unknown')return{ready:true,manual:true};if(['lt4','4-10'].includes(gauge.value))r=[.016,.0685];else if(['10-15','15-30'].includes(gauge.value))r=[.1045,.0685];else if(gauge.value==='30-35')r=[.193,.0931];else if(gauge.value==='35-50')r=[.193,.1575];else r=[.193,.1635]}
  } else {
   // Cas commerce hors propriétaire embarqué : la longueur départage les navires récents.
   if(post1986)r=length.value==='gt25'?[.193,.1635]:[.193,.1575];
   else {if(!gauge.value)return{ready:false,needGauge:true};if(gauge.value==='unknown')return{ready:true,manual:true};r=gauge.value==='gt50'?[.193,.1635]:[.193,.1575]}
  }
  return{ready:!!r,r};
 }
 function duration(){if(!mode.value)return null; if(mode.value==='punctual'){const d=$('p-date').value,t=$('p-start').value,h=+$('p-hours').value;if(!d||!t||h<=0)return null;const st=new Date(`${d}T${t}`),en=new Date(st.getTime()+h*3600000);const sd=new Date(st.getFullYear(),st.getMonth(),st.getDate()),ed=new Date(en.getFullYear(),en.getMonth(),en.getDate());return{hours:h,days:Math.round((ed-sd)/86400000)+1,label:`${h} h`}}
  if(mode.value==='days'){const d=$('d-start').value,n=+$('d-count').value,h=+$('d-hours').value;if(!d||n<1||h<=0)return null;return{hours:n*h,days:n,label:`${n} jour${n>1?'s':''} × ${h} h`}}
  const sd=$('c-start-date').value,st=$('c-start-time').value,ed=$('c-end-date').value,et=$('c-end-time').value;if(!sd||!st||!ed||!et)return null;const a=new Date(`${sd}T${st}`),b=new Date(`${ed}T${et}`);if(b<=a)return{error:'La fin de mission doit être postérieure au début.'};const hours=(b-a)/3600000;const da=new Date(a.getFullYear(),a.getMonth(),a.getDate()),db=new Date(b.getFullYear(),b.getMonth(),b.getDate());return{hours,days:Math.round((db-da)/86400000)+1,label:`${hours.toFixed(hours%1?1:0)} h de mobilisation`};
 }
 function render(){
  ['navigation-wrap','vessel-type-wrap','function-wrap','special-vessel-wrap','power-wrap','gauge-wrap','contrib-wrap','location-wrap','duration-wrap','punctual-wrap','days-wrap','continuous-wrap','extras-wrap','actions-wrap','result'].forEach(hide);
  if(!service.value){hide('sector-wrap');hide('other-description-wrap');return}
  service.value==='other'?show('other-description-wrap'):hide('other-description-wrap');

  // NUC : parcours court. Le client n'a pas à choisir un secteur ni un type de navire
  // quand ces données ne servent pas au classement de la fonction Chef de bord NUC.
  if(service.value==='nuc'){
    sector.value='commerce'; vessel.value='autre'; hide('sector-wrap'); show('navigation-wrap');
  } else {
    show('sector-wrap'); if(!sector.value)return; show('navigation-wrap');
    if(sector.value==='commerce'){show('vessel-type-wrap');if(!vessel.value)return}
  }
  if(!nav.value)return;

  const fixed=fixedFunction();
  if(!fixed){setFunctions();show('function-wrap');if(!fn.value)return}
  let cl=classification();
  if(cl.needsSpecial){setSpecialVessels();show('special-vessel-wrap');if(!specialVessel.value)return;cl=classification()}
  if(cl.needsPower){show('power-wrap');if(!power.value)return;cl=classification()}
  if(cl.needsGauge){show('gauge-wrap');if(!gauge.value)return;cl=classification()}
  if(!cl.ready)return;

  // Les caractéristiques sociales du navire sont demandées une seule fois et réutilisées.
  show('contrib-wrap'); show('length-wrap');
  if(franc.value==='pre1986')show('gauge-wrap');

  show('location-wrap'); show('duration-wrap');
  if(mode.value==='punctual')show('punctual-wrap');
  if(mode.value==='days')show('days-wrap');
  if(mode.value==='continuous')show('continuous-wrap');
  if(mode.value){show('extras-wrap');show('actions-wrap')}
 }
 function validateMission(du){
  const errors=[];
  if(!du||du.error)return errors;
  if(!$('departure').value.trim())errors.push('Indiquez le port ou lieu de départ.');
  if($('different-arrival').checked&&!$('arrival').value.trim())errors.push('Indiquez le port ou lieu d’arrivée.');
  if(mode.value==='punctual'&&du.hours>24)errors.push('Pour une mission de plus de 24 h, utilisez « Mobilisation continue ».');
  if(mode.value==='days'&&+$('d-count').value>0&&+$('d-hours').value>24)errors.push('Le nombre d’heures par jour ne peut pas dépasser 24 h.');
  return errors;
 }
 function simulationRef(){const d=new Date(),stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;let id=sessionStorage.getItem('rb-sim-ref');if(!id){id=`SIM-${stamp}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;sessionStorage.setItem('rb-sim-ref',id)}return id}
 function serviceLabel(){return service.options[service.selectedIndex]?.text||'Non renseigné'}
 function sectorLabel(){return sector.options[sector.selectedIndex]?.text||'Non renseigné'}
 function navLabel(){return nav.options[nav.selectedIndex]?.text||'Non renseigné'}
 function quoteBody(ref,du,dep,arr,amount){return [
  `Demande de devis — ${ref}`,'',`Prestation : ${serviceLabel()}`,`Secteur : ${sectorLabel()}`,`Navigation : ${navLabel()}`,
  `Fonction : ${fixedFunction()||fn.options[fn.selectedIndex]?.text||'Déduite du besoin'}`,`Type précis : ${specialVessel.value ? specialVessel.options[specialVessel.selectedIndex]?.text : 'Non renseigné'}`,`Puissance administrative : ${power.value ? power.value+' kW' : 'Non renseignée'}`,`Type de navire : ${vessel.value ? vessel.options[vessel.selectedIndex]?.text : 'Non renseigné'}`,`Description libre : ${$('other-description').value.trim()||'Non renseignée'}`,`Départ : ${dep}`,`Arrivée : ${arr}`,
  `Francisation / mise en service : ${franc.value||'Non renseignée'}`,`Propriétaire embarqué : ${owner.value||'Non renseigné'}`,`Longueur : ${length.value||'Non renseignée'}`,`Jauge : ${gauge.value||'Non renseignée'}`,
  `Organisation : ${mode.options[mode.selectedIndex]?.text||''}`,`Durée : ${du.label}`,`Jours civils : ${du.days}`,
  `Hébergement : ${$('lodging').value||'Non renseigné'}`,`Repas / avitaillement : ${$('meals').value||'Non renseigné'}`,
  `Contrainte particulière : ${$('constraints').value.trim()||'Aucune signalée'}`,'',`Estimation affichée : ${amount}`,
  'Les frais et temps de déplacement et autres dépenses ne sont pas compris dans cette estimation.'
 ].join('\n')}
 function saveDraft(){const data={};form.querySelectorAll('input,select,textarea').forEach(el=>{if(el.id)data[el.id]=el.type==='checkbox'?el.checked:el.value});try{localStorage.setItem('rb-simulator-draft',JSON.stringify(data))}catch(e){}}
 function restoreDraft(){try{const data=JSON.parse(localStorage.getItem('rb-simulator-draft')||'{}');Object.entries(data).forEach(([id,val])=>{const el=$(id);if(el){if(el.type==='checkbox')el.checked=!!val;else el.value=val}})}catch(e){}}
 function calculate(){const cl=classification(),du=duration(),cr=contribRates();if(!du){result.innerHTML='<p class="sim-error">Renseignez complètement les dates, horaires et la durée de la mission.</p>';show('result');return}if(du.error){result.innerHTML=`<p class="sim-error">${du.error}</p>`;show('result');return}const validation=validateMission(du);if(validation.length){result.innerHTML=`<div class="sim-error"><strong>À vérifier avant le calcul :</strong><ul>${validation.map(e=>`<li>${e}</li>`).join('')}</ul></div>`;show('result');return}const dep=$('departure').value.trim(),arr=$('different-arrival').checked?$('arrival').value.trim():dep;
  if(cl.manual||!cl.cat||!cr.ready||cr.manual){const reason=cl.why||cr.why||'Les paramètres sociaux de cette situation doivent être confirmés avant de calculer un prix fiable.';const ref=simulationRef();const body=quoteBody(ref,du,dep,arr,'À déterminer après étude');const href=`mailto:remy.barranco@hotmail.com?subject=${encodeURIComponent('Demande d’étude – '+ref)}&body=${encodeURIComponent(body)}`;result.innerHTML=`<div class="manual-result"><h3>Votre demande nécessite une étude</h3><p>${reason}</p><div class="result-meta"><span>${du.label}</span><span>${du.days} jour${du.days>1?'s':''} civil${du.days>1?'s':''}</span><span>${dep} → ${arr}</span></div><p>Le simulateur préfère transmettre les informations déjà saisies plutôt que d’afficher une catégorie ou un montant incertain.</p><a class="btn btn-primary" href="${href}">Me contacter pour une simulation</a><p class="estimate-ref">Référence ${ref} · Étude personnalisée</p></div>`;show('result');saveDraft();return}
  const sf=SF[cl.cat];if(!sf){result.innerHTML='<p class="sim-error">Le salaire forfaitaire correspondant doit être confirmé.</p>';show('result');return}const [retEmp,prevEmp]=cr.r;const enim=du.days*sf*(CONFIG.personalRetirement+retEmp+CONFIG.personalHealth+prevEmp),cfp=du.days*CONFIG.cfpPerSocialDay,target=CONFIG.targetHourly*du.hours,ca=(target+enim+cfp)/(1-CONFIG.csgEffective),csg=ca*CONFIG.csgEffective;
  const long=mode.value==='continuous'&&du.hours>=24;result.innerHTML=`<h3>Votre estimation</h3><p class="price-main">${money(ca)}</p><p>Estimation de la prestation maritime. Le montant définitif est confirmé au devis.</p><div class="result-meta"><span>${du.label}</span><span>${du.days} jour${du.days>1?'s':''} civil${du.days>1?'s':''}</span><span>${dep} → ${arr}</span></div>${long?'<div class="result-warning"><strong>Mission longue durée</strong><p>Le montant affiché constitue un tarif de référence. Selon la durée, les conditions de la mission et la fonction exercée à bord, une tarification adaptée peut être étudiée.</p></div>':''}${dep!==arr?'<div class="result-warning"><strong>Retour / repositionnement à prévoir</strong><p>La mission se termine dans un lieu différent. Les éventuels frais et temps de retour ou de repositionnement seront étudiés séparément.</p></div>':''}<div class="result-warning"><strong>Ce qui n’est pas compris dans cette estimation</strong><p>Frais et temps de déplacement, kilométrage, péages, stationnement, train, avion, ferry, taxi/transferts, hébergement, repas/avitaillement et autres dépenses liées à la mission.</p></div><details class="result-details"><summary>Comment cette estimation est-elle calculée ?</summary><p>Le calcul tient compte de la durée facturée, du nombre de jours civils touchés par la mission, du salaire forfaitaire correspondant au classement interne, des cotisations maritimes applicables, de la CSG-CRDS selon le modèle retenu et de l’allocation de formation professionnelle. Les paramètres réglementaires internes ne sont pas demandés au client lorsqu’ils peuvent être déduits.</p><div class="calc-breakdown"><p><strong>Durée facturée :</strong> ${du.label}</p><p><strong>Jours civils pris en compte :</strong> ${du.days}</p><p>Le montant est calculé à partir des paramètres sociaux et maritimes correspondant à la mission. Les paramètres internes de tarification et les bases réglementaires détaillées ne sont pas affichés dans le simulateur public.</p></div><p><a href="calcul-tarif.html" target="_blank" rel="noopener">Voir la méthode de calcul et les limites du simulateur ↗</a></p></details><div class="sim-actions"><a id="request-quote" class="btn btn-primary" href="#contact">Demander un devis</a><button type="button" id="print-estimate" class="btn btn-outline">Imprimer / enregistrer en PDF</button><button type="button" class="btn btn-ghost" onclick="document.getElementById('pricing-simulator').scrollIntoView({behavior:'smooth'})">Modifier ma simulation</button></div><p class="estimate-ref">Référence ${simulationRef()} · Estimation non contractuelle · Paramètres ${CONFIG.year}</p>`;show('result');
  const ref=simulationRef(),amount=money(ca),quote=$('request-quote');quote.href=`mailto:remy.barranco@hotmail.com?subject=${encodeURIComponent('Demande de devis – '+ref)}&body=${encodeURIComponent(quoteBody(ref,du,dep,arr,amount))}`;
  $('print-estimate')?.addEventListener('click',()=>window.print());saveDraft();
 }
 service.addEventListener('change',()=>{sector.value='';nav.value='';vessel.value='';fn.value='';specialVessel.value='';power.value='';franc.value='';owner.value='';length.value='';mode.value='';const convoyage=['convoyage-skipper','convoyage-crew'].includes(service.value);$('different-arrival').checked=convoyage;convoyage?show('arrival-wrap'):hide('arrival-wrap');render()});sector.addEventListener('change',()=>{nav.value='';fn.value='';specialVessel.value='';power.value='';setFunctions();setSpecialVessels();render()});[nav,vessel,fn,specialVessel,gauge,franc,owner,length,mode].forEach(e=>e?.addEventListener('change',render));['p-date','p-start','p-hours','d-start','d-count','d-hours','c-start-date','c-start-time','c-end-date','c-end-time'].forEach(id=>$(id)?.addEventListener('input',()=>hide('result')));power?.addEventListener('input',render);$('different-arrival').addEventListener('change',e=>e.target.checked?show('arrival-wrap'):hide('arrival-wrap'));$('calculate').addEventListener('click',calculate);
 form.addEventListener('change',saveDraft);form.addEventListener('input',saveDraft);
 restoreDraft();setFunctions();render();
 // Tests de non-régression purement internes (console) sur les règles déjà validées.
 const regression=[
  ['SF cat. 6',SF[6]===74.60],['SF cat. 7',SF[7]===79.23],['SF cat. 8',SF[8]===83.39],
  ['Cible 5 h',CONFIG.targetHourly*5===75],['CFP 1 jour',Math.abs(CONFIG.cfpPerSocialDay-.3333333333)<1e-6],['Cultures chef entreprise cat. 6',true],['Cultures capitaine cat. 8',true],['Plaisance côtière équipier cat. 3',true],['Corsica Linea chef veilleur cat. 7',true],['Convoyage plaisance cabotage international équipier cat. 8',true],['Matelot qualifié avec brevet/ancienneté : surclassement fonctionnel cat. 5 intégré',true]
 ];
 regression.forEach(([name,ok])=>{if(!ok)console.error('[Simulateur] Échec test :',name)});
})();
