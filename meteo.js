/* ================= Onglet Météo : indice de pêche sur 7 jours ================= */
const WK={};
const WMO=c=>c==null?"":c===0?"☀️":c<=2?"🌤️":c===3?"☁️":c<=48?"🌫️":c<=57?"🌦️":c<=67?"🌧️":c<=77?"🌨️":c<=82?"🌦️":c<=86?"🌨️":"⛈️";
const WMO_T=c=>c==null?"":c===0?"Grand soleil":c<=2?"Éclaircies":c===3?"Couvert":c<=48?"Brouillard":c<=57?"Bruine":c<=67?"Pluie":c<=77?"Neige":c<=82?"Averses":c<=86?"Averses de neige":"Orages";
const MODELS=[["ecmwf_ifs025","européen (ECMWF)"],["gfs_seamless","américain (GFS)"],["icon_seamless","allemand (ICON)"],["meteofrance_seamless","Météo-France"]];
const LEAD_MAX=[97,94,90,85,80,74,68,62];
const VARS=["temperature_2m","pressure_msl","wind_speed_10m","cloud_cover","precipitation"];
const VK={temperature_2m:"temp",pressure_msl:"press",wind_speed_10m:"wind",cloud_cover:"cloud",precipitation:"rain"};

function getWeek(lat,lng){
  const k=lat.toFixed(2)+","+lng.toFixed(2),c=WK[k];
  if(c&&(c.loading||Date.now()-c.at<30*60e3))return c;
  const old=c&&c.main?c:null;
  WK[k]={loading:true,at:Date.now(),main:old&&old.main,models:old&&old.models,ens:old&&old.ens};
  if(!old){try{const s=JSON.parse(localStorage.getItem("wk:"+k));if(s&&Date.now()-s.at<6*36e5){Object.assign(WK[k],{main:s.main,models:s.models,ens:s.ens,stale:s.at})}}catch(e){}}
  (async()=>{
    const ll=`latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}`,o=WK[k];
    const [m,mm,en]=await Promise.allSettled([
      fetchJSON(`https://api.open-meteo.com/v1/forecast?${ll}&hourly=temperature_2m,pressure_msl,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover,precipitation,weather_code&timezone=GMT&past_days=3&forecast_days=8`,15000),
      fetchJSON(`https://api.open-meteo.com/v1/forecast?${ll}&hourly=pressure_msl,wind_speed_10m,cloud_cover,precipitation,temperature_2m&models=${MODELS.map(x=>x[0]).join(",")}&timezone=GMT&past_days=1&forecast_days=8`,15000),
      fetchJSON(`https://ensemble-api.open-meteo.com/v1/ensemble?${ll}&hourly=${VARS.join(",")}&models=ecmwf_ifs025&timezone=GMT&past_days=1&forecast_days=8`,20000)]);
    if(m.status==="fulfilled"){const h=m.value.hourly;
      o.main={t:h.time.map(x=>new Date(x+"Z").getTime()),temp:h.temperature_2m,press:h.pressure_msl,wind:h.wind_speed_10m,gust:h.wind_gusts_10m,dir:h.wind_direction_10m,cloud:h.cloud_cover,rain:h.precipitation,code:h.weather_code};o.error=null;o.stale=null}
    else if(!o.main)o.error="Météo indisponible (pas de réseau ?)";
    if(mm.status==="fulfilled"){const h=mm.value.hourly,t=h.time.map(x=>new Date(x+"Z").getTime());o.models={};
      MODELS.forEach(([id])=>{const s={t};let ok=false;VARS.forEach(v=>{const a=h[v+"_"+id];if(a){s[VK[v]]=a;if(a.some(x=>x!=null))ok=true}});if(ok)o.models[id]=s})}
    if(en.status==="fulfilled"){const h=en.value.hourly,t=h.time.map(x=>new Date(x+"Z").getTime()),mem={};
      Object.keys(h).forEach(key=>{const v=VARS.find(x=>key===x||key.startsWith(x+"_member"));if(!v)return;const id=key===v?"00":key.slice(v.length+7);(mem[id]=mem[id]||{t})[VK[v]]=h[key]});
      o.ens=Object.values(mem).filter(s=>s.press&&s.wind&&s.cloud)}
    o.loading=false;o.at=Date.now();
    try{localStorage.setItem("wk:"+k,JSON.stringify({at:Date.now(),main:o.main,models:o.models,ens:o.ens}))}catch(e){try{localStorage.setItem("wk:"+k,JSON.stringify({at:Date.now(),main:o.main}))}catch(e2){}}
    scheduleRender();checkAlerts();
  })();
  return WK[k];
}

/* Tendance du niveau de l'eau (Hub'Eau, dernières 24 h) */
const HY={};
function getHydroTrend(lat,lng){
  const k=lat.toFixed(2)+","+lng.toFixed(2);if(HY[k])return HY[k];HY[k]={loading:true};
  (async()=>{
    const out={};
    try{
      const bbox=`${(lng-.2).toFixed(3)},${(lat-.15).toFixed(3)},${(lng+.2).toFixed(3)},${(lat+.15).toFixed(3)}`;
      const st=await fetchJSON(`https://hubeau.eaufrance.fr/api/v2/hydrometrie/referentiel/stations?bbox=${bbox}&size=50&format=json`);
      const near=(st.data||[]).filter(s=>s.en_service!==false&&(s.latitude_station??s.latitude)!=null).map(s=>({s,d:Math.hypot(((s.latitude_station??s.latitude)-lat)*111,((s.longitude_station??s.longitude)-lng)*74)})).filter(n=>n.d<15).sort((a,b)=>a.d-b.d);
      const since=new Date(Date.now()-30*36e5).toISOString().slice(0,19);
      for(const n of near.slice(0,4)){
        const j=await fetchJSON(`https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=${encodeURIComponent(n.s.code_station)}&grandeur_hydro=H&date_debut_obs=${since}&size=1000&format=json`).catch(()=>null);
        const d=(j&&j.data||[]).map(x=>({t:new Date(x.date_obs).getTime(),v:x.resultat_obs/1000})).filter(x=>isFinite(x.v)).sort((a,b)=>a.t-b.t);
        if(d.length>=4){const last=d[d.length-1],ref=d.find(x=>x.t>=last.t-24*36e5)||d[0];
          Object.assign(out,{h:last.v,dh:last.v-ref.v,hours:(last.t-ref.t)/36e5,station:n.s.libelle_station||n.s.code_station,km:n.d,when:last.t});break}
      }
    }catch(e){}
    HY[k]=out;scheduleRender();
  })();
  return HY[k];
}

/* Ce que vos prises nous apprennent */
const REF={trend:{baisse:.3,stable:.45,hausse:.25},ciel:{couvert:.5,clair:.5},vent:{calme:.15,leger:.6,fort:.25}};
const CLS={trend:t=>t==null?null:t<=-.6?"baisse":t>=.6?"hausse":"stable",ciel:c=>c==null?null:c>60?"couvert":"clair",vent:w=>w==null?null:w<5?"calme":w<=20?"leger":"fort"};
const CLS_T={trend:{baisse:"pression en baisse",stable:"pression stable",hausse:"pression en hausse"},ciel:{couvert:"ciel couvert",clair:"ciel dégagé"},vent:{calme:"sans vent",leger:"vent léger",fort:"vent fort"}};
function learnFrom(spot){
  const near=spot&&!spot.isPos?S.catches.filter(k=>{const sp=spotById(k.spot_id),p=k.lat!=null?k:sp;return p&&distKm(p,spot)<2}):[];
  const all=S.catches.filter(k=>k.meteo&&(k.meteo.press!=null||k.meteo.cloud!=null));
  const N=all.length;if(N<3)return {N,lift:null,facts:[]};
  const lift={},facts=[],K=6;
  for(const f in REF){const cnt={},raw={};let n=0,nr=0;
    all.forEach(k=>{const c=CLS[f](f==="trend"?k.meteo.trend:f==="ciel"?k.meteo.cloud:k.meteo.wind);if(!c)return;const w=near.includes(k)?2:1;cnt[c]=(cnt[c]||0)+w;n+=w;raw[c]=(raw[c]||0)+1;nr++});
    if(n<3)continue;lift[f]={};
    for(const c in REF[f]){const sh=((cnt[c]||0)+K*REF[f][c])/(n+K);lift[f][c]=Math.max(.75,Math.min(1.35,sh/REF[f][c]));
      if(lift[f][c]>=1.12&&(raw[c]||0)>=2)facts.push({f,c,txt:`Vous prenez plus de poissons par ${CLS_T[f][c]}`,n:raw[c],of:nr})}
  }
  return {N,lift,facts,near:near.length};
}

/* Note de pêche d'une heure (0 à 100) */
function hourIdx(s,i,ctx,full){
  const g=(a,j)=>a&&a[j]!=null?a[j]:null;
  const p=g(s.press,i),w=g(s.wind,i),c=g(s.cloud,i),r=g(s.rain,i)||0,t0=s.t[i];
  if(p==null||w==null||c==null)return null;
  const p3=g(s.press,i-3),p24=g(s.press,i-24),why=[];let v=50;
  const add=(x,txt)=>{v+=x;if(full&&txt)why.push({x,txt})};
  if(p3!=null){const tr=p-p3;
    if(tr<=-.6&&tr>=-3)add(9,"pression en légère baisse");else if(tr<-3)add(-5,"pression qui chute vite (orage ?)");else if(tr>2)add(-10,"pression qui remonte vite");else if(Math.abs(tr)<.6)add(4,"pression stable")}
  if(p24!=null&&p-p24>8)add(-6,"forte hausse de pression depuis la veille");
  if(w<5)add(-2,"pas de vent, eau lisse");else if(w<=20)add(5,"vent léger");else if(w>30)add(-12,"vent fort");
  const gu=g(s.gust,i);if(gu!=null&&gu>50)add(-8,"fortes rafales");
  const d=new Date(t0),st=sunTimes(d,ctx.lat,ctx.lng),mom=momentOf(d,st);
  if(c>60)add(5,"ciel couvert");else if(c<20&&mom==="jour")add(-5,"grand soleil");
  if(r>=.2&&r<=2)add(2,"petite pluie");else if(r>4)add(-8,"grosse pluie");
  if(mom==="aube")add(10,"lever du soleil");else if(mom==="crep")add(10,"coucher du soleil");else if(mom==="nuit")add(-10,null);
  if(ctx.solunar){const sl=solunar(d,ctx.lat,ctx.lng),near=(a,h)=>a.some(x=>Math.abs(x-d)<=h*36e5);if(near(sl.majors,1))add(3,"période solunaire majeure");else if(near(sl.minors,.5))add(2,null)}
  const wt=ctx.waterAt?ctx.waterAt(t0):null;
  if(wt!=null){if(wt<6||wt>24)add(-10,`eau ${wt<6?"froide":"chaude"} (≈ ${Math.round(wt)} °C)`);else if(wt>=10&&wt<=20)add(3,null)}
  if(ctx.river){const r48=sumBack(s.rain,i,48);if(r48>25)add(-10,`risque de montée des eaux (${Math.round(r48)} mm en 48 h)`)}
  if(ctx.hydroUp&&t0-Date.now()<36*36e5)add(-8,"la rivière monte en ce moment");
  const tday=avgAround(s.temp,i,12),tprev=avgAround(s.temp,i-24,12);
  if(tday!=null&&tprev!=null&&tday-tprev<-6)add(-8,"chute de température");
  if(ctx.learn&&ctx.learn.lift){const L=ctx.learn.lift;let f=1;
    const tc=p3!=null?CLS.trend(p-p3):null,cc=CLS.ciel(c),wc=CLS.vent(w);
    if(L.trend&&tc)f*=L.trend[tc];if(L.ciel&&cc)f*=L.ciel[cc];if(L.vent&&wc)f*=L.vent[wc];
    f=Math.max(.75,Math.min(1.3,f));const before=v;v=50+(v-50)*f;
    if(full&&Math.abs(v-before)>=3)why.push({x:v-before,txt:v>before?"ressemble aux conditions de vos prises":"ne ressemble pas aux conditions de vos prises"})}
  v=Math.max(0,Math.min(100,Math.round(v)));
  return full?{v,why,mom,t:t0,temp:g(s.temp,i),press:p,wind:w,cloud:c,rain:r,code:g(s.code,i),gust:gu}:v;
}
function sumBack(a,i,n){let s=0;for(let j=Math.max(0,i-n);j<=i;j++)s+=a[j]||0;return s}
function avgAround(a,i,n){if(!a||i<0)return null;let s=0,c=0;for(let j=Math.max(0,i-n);j<=Math.min(a.length-1,i+n);j++)if(a[j]!=null){s+=a[j];c++}return c?s/c:null}

/* Découpe en jours locaux et meilleur créneau */
function dayKeys(){const out=[],d=new Date();d.setHours(0,0,0,0);for(let j=0;j<7;j++){out.push(new Date(d.getTime()+j*dayMs))}return out}
function bestWindow(series,ctx,day){
  const a=day.getTime(),b=a+dayMs,idx=[];
  series.t.forEach((t,i)=>{if(t>=a&&t<b){const h=new Date(t).getHours();if(h>=5&&h<=22)idx.push(i)}});
  const now=Date.now(),vals=idx.map(i=>({i,v:series.t[i]+36e5<now?null:hourIdx(series,i,ctx)})).filter(x=>x.v!=null);
  if(!vals.length)return null;
  let best=null;for(let j=0;j<vals.length;j++){const w=vals.slice(j,j+2),m=w.reduce((s,x)=>s+x.v,0)/w.length;if(!best||m>best.m)best={m,j}}
  const mean=vals.reduce((s,x)=>s+x.v,0)/vals.length,score=Math.round(.75*best.m+.25*mean);
  let s0=best.j,s1=Math.min(vals.length-1,best.j+1);const thr=best.m-5;
  while(s0>0&&s1-s0<3&&vals[s0-1].v>=thr&&series.t[vals[s0-1].i]===series.t[vals[s0].i]-36e5)s0--;
  while(s1<vals.length-1&&s1-s0<3&&vals[s1+1].v>=thr&&series.t[vals[s1+1].i]===series.t[vals[s1].i]+36e5)s1++;
  return {score,from:series.t[vals[s0].i],to:series.t[vals[s1].i]+36e5,peak:vals[best.j].i,hours:vals};
}
const sd=a=>{const n=a.length;if(n<2)return 0;const m=a.reduce((s,x)=>s+x,0)/n;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(n-1))};

const WF={};
function weekFor(place){
  const W0=getWeek(place.lat,place.lng),wa0=getWater(place.lat,place.lng),hy0=getHydroTrend(place.lat,place.lng);
  const key=place.id+"|"+place.lat+","+place.lng,sig=[W0.at,W0.loading,S.catches.length,!!(wa0&&wa0.temp),hy0&&hy0.h,new Date().getHours(),place.milieu||""].join("|");
  if(WF[key]&&WF[key].sig===sig)return WF[key].r;
  const r=weekCompute(place);if(r.days.length)WF[key]={sig,r};return r;
}
function weekCompute(place){
  const W=getWeek(place.lat,place.lng);if(!W.main)return {W,days:[]};
  const wa=getWater(place.lat,place.lng),hy=getHydroTrend(place.lat,place.lng);
  const mil=place.isPos?null:milieuOf(place),river=mil&&["grande_riviere","petite_riviere","canal"].includes(mil.k)||!!(hy&&hy.h!=null);
  const lake=mil&&["etang","lac"].includes(mil.k);
  // Température de l'eau prévue : part de la mesure (ou de l'estimation) et suit l'air
  const M=W.main,now=Date.now(),airDay={};
  M.t.forEach((t,i)=>{const k=new Date(t).toDateString();if(M.temp[i]!=null)(airDay[k]=airDay[k]||[]).push(M.temp[i])});
  let w0=wa&&wa.temp?wa.temp.v:null;
  if(w0==null){const a=avgAround(M.temp,M.t.findIndex(t=>t>=now),36);w0=(WATER_T[new Date().getMonth()]*2+(a??WATER_T[new Date().getMonth()]))/3}
  const wtDay={},kk=lake?.08:.18;let cur=w0;
  dayKeys().forEach(d=>{const a=airDay[d.toDateString()];wtDay[d.toDateString()]=cur;if(a){const m=a.reduce((s,x)=>s+x,0)/a.length;cur+=kk*(m-cur)}});
  const learn=learnFrom(place);
  const ctx={lat:place.lat,lng:place.lng,solunar:true,river,hydroUp:hy&&hy.dh!=null&&hy.dh>.15,learn,waterAt:t=>wtDay[new Date(t).toDateString()]??w0};
  const lite={...ctx,solunar:false,waterAt:ctx.waterAt};
  const days=dayKeys().map((d,j)=>{
    const bw=bestWindow(M,ctx,d);if(!bw)return null;
    // Fiabilité : on recalcule la note avec chaque scénario et chaque modèle, et on regarde s'ils sont d'accord
    const base=bestWindow(M,lite,d);
    const ens=(W.ens||[]).map(s=>bestWindow(s,lite,d)).filter(Boolean).map(x=>x.score);
    const mod=Object.entries(W.models||{}).map(([id,s])=>({id,b:bestWindow(s,lite,d)})).filter(x=>x.b);
    const sEns=ens.length>=10?sd(ens):null,sMod=mod.length>=2?sd(mod.map(x=>x.b.score)):null;
    let spread=sEns!=null&&sMod!=null?Math.max(sEns,sMod*.8):sEns??(sMod!=null?sMod*1.1:null);
    let rel=spread!=null?Math.round(100-spread*3.2):LEAD_MAX[j]-6;
    rel=Math.max(20,Math.min(LEAD_MAX[j],rel));
    // Pourquoi c'est incertain
    const a=d.getTime(),b=a+dayMs,inDay=s=>s.t.map((t,i)=>t>=a&&t<b&&new Date(t).getHours()>=6&&new Date(t).getHours()<=21?i:-1).filter(i=>i>=0);
    const pool=(W.ens&&W.ens.length?W.ens:Object.values(W.models||{}));
    const stat=key=>{const per=pool.map(s=>{const ix=inDay(s).filter(i=>s[key]&&s[key][i]!=null);return ix.length?ix.reduce((t,i)=>t+s[key][i],0)/(key==="rain"?1:ix.length):null}).filter(x=>x!=null);return per};
    const pr=stat("press"),wi=stat("wind"),cl=stat("cloud"),ra=stat("rain");
    const rainP=ra.length?Math.round(ra.filter(x=>x>=1).length/ra.length*100):null;
    const reasons=[];
    if(pr.length>2&&sd(pr)>3)reasons.push("la pression prévue varie selon les scénarios");
    if(rainP!=null&&rainP>=25&&rainP<=75)reasons.push(`pluie incertaine (${rainP} % des scénarios)`);
    if(wi.length>2&&sd(wi)>7)reasons.push("la force du vent est incertaine");
    if(cl.length>2&&sd(cl)>28)reasons.push("la couverture nuageuse est incertaine");
    if(mod.length>=2&&sMod>8){const lo=mod.reduce((x,y)=>x.b.score<y.b.score?x:y),hi=mod.reduce((x,y)=>x.b.score>y.b.score?x:y);reasons.push(`les modèles divergent (${MODELS.find(m=>m[0]===lo.id)[1]} ${lo.b.score} – ${MODELS.find(m=>m[0]===hi.id)[1]} ${hi.b.score})`)}
    if(!reasons.length)reasons.push(spread==null?"estimation selon l'échéance (scénarios indisponibles)":rel>=80?"les prévisions sont d'accord":"prévision lointaine, elle peut encore bouger");
    // Résumé météo du jour
    const ix=M.t.map((t,i)=>t>=a&&t<b?i:-1).filter(i=>i>=0),ixd=ix.filter(i=>{const h=new Date(M.t[i]).getHours();return h>=8&&h<=20});
    const tmin=Math.min(...ix.map(i=>M.temp[i]).filter(x=>x!=null)),tmax=Math.max(...ix.map(i=>M.temp[i]).filter(x=>x!=null));
    const wmax=Math.max(...ixd.map(i=>M.wind[i]).filter(x=>x!=null)),rain=ix.reduce((s,i)=>s+(M.rain[i]||0),0);
    const code=Math.max(...ixd.map(i=>M.code&&M.code[i]).filter(x=>x!=null));
    const pm=ixd.map(i=>M.press[i]).filter(x=>x!=null),pTr=pm.length>1?pm[pm.length-1]-pm[0]:0;
    const peak=hourIdx(M,bw.peak,ctx,true);
    if(rain>10){const pen=Math.min(10,Math.round((rain-10)/2)+3);bw.score=Math.max(0,bw.score-pen);peak.why.push({x:-pen,txt:`journée très pluvieuse (${Math.round(rain)} mm)`})}
    return {d,j,score:bw.score,from:bw.from,to:bw.to,peak,rel,reasons,rainP,ensN:ens.length,modN:mod.length,tmin,tmax,wmax,rain,code:isFinite(code)?code:null,press:pm.length?Math.round(pm.reduce((s,x)=>s+x,0)/pm.length):null,pTr,water:ctx.waterAt(a+12*36e5),hours:bw.hours.map(h=>({t:M.t[h.i],v:h.v}))};
  }).filter(Boolean);
  return {W,days,learn,wa,hy,mil,ctx,river};
}

/* Lieu choisi */
function meteoPlaces(){
  const L=[];if(S.pos)L.push({id:"pos",nom:"📍 Ma position",lat:S.pos.lat,lng:S.pos.lng,isPos:true,temp:true});
  S.spots.filter(s=>s.lat!=null).forEach(s=>{const p=isRoute(s)&&s.trace&&s.trace[0]?{lat:s.trace[0][0]??s.trace[0].lat,lng:s.trace[0][1]??s.trace[0].lng}:{};L.push(Object.assign({},s,isFinite(p.lat)?p:{},{nom:(isRoute(s)?"🛶 ":"🎣 ")+s.nom}))});
  if(!L.length)L.push({id:"def",nom:"Rennes (par défaut)",lat:48.111,lng:-1.68,isPos:true,temp:true});
  return L;
}
function curPlace(){const L=meteoPlaces();let id=S.wxPlace;if(!id){try{id=localStorage.getItem("cds-wxplace")}catch(e){}}return L.find(p=>String(p.id)===String(id))||L[0]}
const alertsOn=()=>{try{return JSON.parse(localStorage.getItem("cds-alerts")||"[]")}catch(e){return []}};
const scoreCol=v=>v>=75?"var(--ok)":v>=55?"var(--lure-ink,#7a8f00)":v>=40?"var(--warn)":"var(--ban)";
const scoreTxt=v=>v>=80?"Excellent":v>=65?"Bon":v>=50?"Moyen":v>=35?"Faible":"Mauvais";
const dayName=(d,j)=>j===0?"Aujourd'hui":j===1?"Demain":d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric"}).replace(/^./,c=>c.toUpperCase());
const hh=t=>{const d=new Date(t);return d.getHours()+"h"+(d.getMinutes()?String(d.getMinutes()).padStart(2,"0"):"")};

function viewMeteo(){
  if(!S.pos&&!viewMeteo.asked){viewMeteo.asked=true;if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>{S.pos={lat:p.coords.latitude,lng:p.coords.longitude};scheduleRender()},()=>{},{timeout:8000})}
  const P=meteoPlaces(),pl=curPlace(),R=weekFor(pl),W=R.W,al=alertsOn(),hasAl=!pl.isPos&&al.includes(pl.id);
  const head=`<div class="ttl"><h2>Météo et indice de pêche</h2></div>
  <div class="row" style="margin-bottom:12px"><label class="f" style="flex:1;min-width:200px">Lieu<select id="wx-place">${P.map(p=>`<option value="${esc(p.id)}"${p.id===pl.id?" selected":""}>${esc(p.nom)}</option>`).join("")}</select></label>
  ${pl.isPos?"":`<button class="btn sm${hasAl?" primary":""}" data-wx="alert" aria-pressed="${hasAl}" style="align-self:flex-end">${hasAl?"🔔 Alerte activée":"🔕 M'alerter"}</button>`}</div>`;
  if(!R.days.length)return head+(W.error?`<div class="alert warn">${esc(W.error)}</div>`:`<div class="empty"><b>Chargement des prévisions…</b>Comparaison de plusieurs modèles météo et de 51 scénarios.</div>`);
  const best=R.days.reduce((a,b)=>b.score*(.6+b.rel/250)>a.score*(.6+a.rel/250)?b:a);
  const alertList=(S.wxAlerts||[]).filter(x=>x.t>Date.now());
  let h=head;
  if(alertList.length)h+=`<div class="alert ok" style="margin-bottom:12px">🔔 ${alertList.map(x=>`<b>${esc(x.nom)}</b> : ${esc(dayName(new Date(x.t),x.j))} ${hh(x.from)}–${hh(x.to)}, ${x.score}/100`).join("<br>")}</div>`;
  if(W.stale)h+=`<p class="small muted">Prévisions enregistrées à ${hhmm(W.stale)} (pas de réseau).</p>`;
  h+=`<div class="panel wx-best"><div class="small muted">Meilleur créneau de la semaine</div>
    <div class="row" style="justify-content:space-between;align-items:center;margin-top:4px;flex-wrap:nowrap"><div style="flex:1;min-width:0"><div class="wx-bt">${esc(dayName(best.d,best.j))}, ${hh(best.from)} – ${hh(best.to)}</div>
    <div class="small muted">${esc(best.peak.why.filter(w=>w.x>0).sort((a,b)=>b.x-a.x).slice(0,3).map(w=>w.txt).join(" · "))}</div></div>
    ${ring(best.score)}</div><div class="small" style="margin-top:6px">Fiable à <b>${best.rel} %</b></div></div>`;
  h+=`<div class="stack" style="margin-top:12px">${R.days.map(d=>dayCard(d,R,pl)).join("")}</div>`;
  h+=waterPanel(R)+learnPanel(R)+`<details class="panel" style="margin-top:12px"><summary><b>Comment la note est calculée</b></summary><div class="small" style="margin-top:8px;line-height:1.55">
    La note sur 100 combine la pression (une légère baisse est idéale), le vent, les nuages, la pluie, l'heure (aube et crépuscule), la période solunaire (faible poids), la température de l'eau prévue et le risque de montée des eaux. Elle s'ajuste ensuite selon les conditions de vos prises.<br><br>
    <b>La fiabilité</b> vient du calcul de la même note avec ${W.ens&&W.ens.length?W.ens.length:"les"} scénarios du modèle européen et ${Object.keys(W.models||{}).length||"plusieurs"} modèles (européen, américain, allemand, Météo-France). S'ils donnent tous la même note, la fiabilité est haute ; s'ils divergent, elle baisse. Elle est aussi plafonnée selon l'échéance (${LEAD_MAX[0]} % aujourd'hui, ${LEAD_MAX[6]} % à J+6).</div></details>`;
  return h;
}
function ring(v,sz=58){const r=sz/2-5,c=2*PI*r;return `<div class="wx-ring" style="width:${sz}px;height:${sz}px" aria-label="Note ${v} sur 100"><svg viewBox="0 0 ${sz} ${sz}"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="6"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${scoreCol(v)}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(c*v/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${sz/2} ${sz/2})"/></svg><b class="num">${v}</b></div>`}
function dayCard(d,R,pl){
  const open=S.wxOpen===d.j;
  let h=`<div class="panel wx-day${open?" open":""}"><button class="wx-head" data-wx="day" data-j="${d.j}" aria-expanded="${open}">
    ${ring(d.score,50)}
    <div class="wx-mid"><div class="wx-dn">${esc(dayName(d.d,d.j))} <span class="wx-ic" title="${esc(WMO_T(d.code))}">${WMO(d.code)}</span></div>
      <div class="small muted">${Math.round(d.tmin)}° / ${Math.round(d.tmax)}° · vent ${Math.round(d.wmax)} km/h${d.rain>=.5?` · ${d.rain.toFixed(0)} mm`:""}</div>
      <div class="small">🎣 <b>${hh(d.from)} – ${hh(d.to)}</b> · ${scoreTxt(d.score)}</div></div>
    <div class="wx-rel"><span class="small muted">Fiable</span><b>${d.rel} %</b><span class="wx-relbar"><i style="width:${d.rel}%"></i></span></div></button>`;
  if(open){
    const pos=d.peak.why.filter(w=>w.x>0).sort((a,b)=>b.x-a.x),neg=d.peak.why.filter(w=>w.x<0).sort((a,b)=>a.x-b.x);
    h+=`<div class="wx-body">${hourChart(d)}
      <div class="small" style="margin-top:8px"><b>Au meilleur moment (${hh(d.peak.t)})</b> : ${Math.round(d.peak.temp)} °C, ${Math.round(d.peak.press)} hPa, vent ${Math.round(d.peak.wind)} km/h, nuages ${Math.round(d.peak.cloud)} %, eau ≈ ${Math.round(d.water)} °C</div>
      ${pos.length?`<div class="row" style="margin-top:8px;gap:6px">${pos.map(w=>`<span class="chip ok">+ ${esc(w.txt)}</span>`).join("")}</div>`:""}
      ${neg.length?`<div class="row" style="margin-top:6px;gap:6px">${neg.map(w=>`<span class="chip ban">− ${esc(w.txt)}</span>`).join("")}</div>`:""}
      <div class="small muted" style="margin-top:8px">Fiabilité ${d.rel} % : ${esc(d.reasons.join(" ; "))}.${d.rainP!=null?` Risque de pluie : ${d.rainP} %.`:""}</div>
      ${speciesBlock(d,R,pl)}</div>`;
  }
  return h+`</div>`;
}
function hourChart(d){
  const H=d.hours,n=H.length;if(!n)return "";
  const W=Math.max(n*16,200),Hh=70,bw=W/n;
  return `<svg class="wx-chart" viewBox="0 0 ${W} ${Hh+16}" preserveAspectRatio="none" role="img" aria-label="Note heure par heure">
    ${H.map((x,i)=>{const y=Hh-x.v/100*Hh,inB=x.t>=d.from&&x.t<d.to;return `<rect x="${(i*bw+1.5).toFixed(1)}" y="${y.toFixed(1)}" width="${(bw-3).toFixed(1)}" height="${(Hh-y).toFixed(1)}" rx="2" fill="${scoreCol(x.v)}" opacity="${inB?1:.45}"><title>${hh(x.t)} : ${x.v}/100</title></rect>${new Date(x.t).getHours()%3===0?`<text x="${(i*bw+bw/2).toFixed(1)}" y="${Hh+12}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".6">${new Date(x.t).getHours()}h</text>`:""}`}).join("")}</svg>`;
}
function speciesBlock(d,R,pl){
  const p=d.peak,st=sunTimes(new Date(p.t),pl.lat,pl.lng),sl=solunar(new Date(p.t),pl.lat,pl.lng);
  const c={w:{water:d.water,cloud:p.cloud,trend:null,rain:p.rain>.2,wind:p.wind,temp:p.temp,press:p.press},mom:p.mom,major:sl.majors.some(x=>Math.abs(x-p.t)<=36e5)};
  const spot=pl.isPos?{lat:pl.lat,lng:pl.lng,temp:true}:pl;
  let list=[];try{list=speciesFor(spot,new Date(p.t),c).filter(x=>!x.closed).slice(0,5)}catch(e){}
  if(!list.length)return "";
  const mx=list[0].a||1;
  return `<h3 style="margin:14px 0 6px">Poissons les plus actifs</h3><div class="stack" style="gap:8px">${list.map(x=>{const pc=Math.round(x.a/mx*Math.min(100,d.score+15));
    return `<div><div class="row" style="justify-content:space-between"><b>${esc(x.s.nom)}</b><span class="num small">${pc} %</span></div><div class="meter"><i style="width:${pc}%"></i></div>
    <div class="small muted" style="margin-top:3px">${esc(x.leurres.slice(0,2).join(" · "))} · ${esc(x.prof)}</div></div>`}).join("")}</div>`;
}
function waterPanel(R){
  const wa=R.wa||{},hy=R.hy||{};const L=[];
  if(wa.temp)L.push(`Eau mesurée : <b>${wa.temp.v.toFixed(1)} °C</b> (${esc(wa.temp.station)}, ${Math.round(wa.temp.km)} km)`);
  else L.push(`Eau estimée : <b>${Math.round(R.days[0]?R.days[0].water:0)} °C</b> (pas de sonde proche)`);
  if(hy.h!=null){const up=hy.dh>.15,dn=hy.dh<-.15;L.push(`Niveau ${esc(hy.station)} : <b>${hy.h.toFixed(2)} m</b>, ${up?"<b style='color:var(--ban)'>en hausse</b>":dn?"en baisse":"stable"} (${hy.dh>=0?"+":""}${Math.round(hy.dh*100)} cm en ${Math.round(hy.hours)} h)`)}
  else if(hy.loading&&R.river)L.push("Niveau de la rivière : recherche d'une station…");
  return `<div class="panel" style="margin-top:12px"><b>💧 L'eau</b><div class="small" style="margin-top:6px;line-height:1.6">${L.join("<br>")}<br><span class="muted">La température de l'eau est prolongée jour par jour selon l'air prévu. Une pluie de plus de 25 mm en 48 h ou une rivière qui monte font baisser la note.</span></div></div>`;
}
function learnPanel(R){
  const l=R.learn;
  if(!l||l.N<3)return `<div class="panel" style="margin-top:12px"><b>🧠 Apprentissage</b><p class="small muted" style="margin:6px 0 0">Encore ${3-(l?l.N:0)} prise(s) avec la météo avant que la note s'adapte à vos habitudes. Chaque prise enregistrée la rend plus juste.</p></div>`;
  return `<div class="panel" style="margin-top:12px"><b>🧠 Ce que vos prises nous apprennent</b><div class="small" style="margin-top:6px;line-height:1.6">
    Basé sur <b>${l.N} prises</b> du groupe${l.near?`, dont ${l.near} près de ce lieu (elles comptent double)`:""}.<br>
    ${l.facts.length?l.facts.map(f=>`✔ ${esc(f.txt)} (${f.n} sur ${f.of})`).join("<br>"):"Pas encore de tendance nette : la note reste surtout basée sur la météo."}
    <br><span class="muted">L'effet est limité (±25 % maximum) pour éviter qu'un hasard ne fausse la note.</span></div></div>`;
}

/* Alertes : créneau ≥ 80/100 dans les 3 prochains jours */
let alertTimer=null;
function checkAlerts(){
  clearTimeout(alertTimer);alertTimer=setTimeout(()=>{
    const ids=alertsOn();if(!ids.length||!S.spots.length){S.wxAlerts=[];return}
    const out=[];let seen={};try{seen=JSON.parse(localStorage.getItem("cds-alert-seen")||"{}")}catch(e){}
    ids.slice(0,5).forEach(id=>{const sp=meteoPlaces().find(p=>p.id===id);if(!sp)return;const R=weekFor(sp);
      R.days.filter(d=>d.j<=3&&d.score>=80&&d.rel>=60).forEach(d=>{out.push({nom:sp.nom.replace(/^\S+ /,""),t:d.to,from:d.from,to:d.to,score:d.score,j:d.j});
        const key=id+"|"+d.d.toDateString();
        if(!seen[key]){seen[key]=1;try{if("Notification" in window&&Notification.permission==="granted"){const body=`${dayName(d.d,d.j)} ${hh(d.from)}–${hh(d.to)} : ${d.score}/100 (fiable à ${d.rel} %)`;
          navigator.serviceWorker&&navigator.serviceWorker.ready?navigator.serviceWorker.ready.then(r=>r.showNotification("🎣 Bon créneau : "+sp.nom.replace(/^\S+ /,""),{body,icon:"icon-192.png",tag:key})).catch(()=>new Notification("Bon créneau",{body})):new Notification("Bon créneau",{body})}}catch(e){}}})});
    try{localStorage.setItem("cds-alert-seen",JSON.stringify(seen))}catch(e){}
    const before=JSON.stringify(S.wxAlerts||[]);S.wxAlerts=out;
    const tb=document.querySelector('nav [data-tab="meteo"]');if(tb){let bd=tb.querySelector(".nb");if(out.length&&!bd){bd=document.createElement("span");bd.className="nb";tb.style.position="relative";tb.appendChild(bd)}if(bd){bd.hidden=!out.length;bd.textContent=out.length}}
    if(before!==JSON.stringify(out))scheduleRender();
  },400);
}
setInterval(()=>{if(S.user&&alertsOn().length)checkAlerts()},60*60e3);

document.addEventListener("change",e=>{if(e.target.id==="wx-place"){S.wxPlace=e.target.value;S.wxOpen=0;try{localStorage.setItem("cds-wxplace",e.target.value)}catch(x){}e.target.blur();render()}});
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("[data-wx]");if(!b)return;
  if(b.dataset.wx==="day"){const j=+b.dataset.j;S.wxOpen=S.wxOpen===j?null:j;render();return}
  if(b.dataset.wx==="alert"){const pl=curPlace();let a=alertsOn();
    if(a.includes(pl.id)){a=a.filter(x=>x!==pl.id);toast("Alerte désactivée")}
    else{a.push(pl.id);
      if("Notification" in window&&Notification.permission==="default"){try{await Notification.requestPermission()}catch(x){}}
      toast(("Notification" in window&&Notification.permission==="granted")?"Alerte activée : tu seras prévenu quand un créneau dépasse 80/100":"Alerte activée : elle s'affichera dans l'onglet Météo")}
    try{localStorage.setItem("cds-alerts",JSON.stringify(a))}catch(x){}checkAlerts();render()}
});
