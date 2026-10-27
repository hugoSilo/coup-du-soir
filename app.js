"use strict";
/* Coup du Soir — application de pêche entre amis */
const SB_URL="https://vmkfeokazkdpfnwbwesj.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta2Zlb2themtkcGZud2J3ZXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTg2MTMsImV4cCI6MjEwNzYzNDYxM30.WMqAoSacNLAkkCJ9sPdnM2EoqBNJl8oNJWVwJnsqOwI";
const sb=supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

/* ================= Référentiel ================= */
const STATUT={ok:{t:"Pêche autorisée",c:"ok",col:"#2E7D4F"},warn:{t:"Restrictions",c:"warn",col:"#C07A00"},ban:{t:"Pêche interdite",c:"ban",col:"#C2362B"}};
const FLOAT={ok:{t:"Float tube autorisé",c:"ok",col:"#2E7D4F"},cond:{t:"Float tube sous conditions",c:"warn",col:"#C07A00"},ban:{t:"Float tube interdit",c:"ban",col:"#C2362B"},unk:{t:"Float tube : à vérifier",c:"ghost",col:"#8A968E"}};
// hab : adaptation au milieu [grande rivière, petite rivière, canal, étang, lac, mer] ; micro : zones préférées
const M_ALL=[1,1,1,1,1,1,1,1,1,1,1,1];
const SPECIES=[
 {id:"brochet",nom:"Brochet",cat:"Carnassier",mois:[.6,.1,.1,.2,.6,.6,.4,.4,.7,1,1,.8],t:[6,18],moment:{aube:1,jour:.8,crep:1,nuit:.1},nuage:1.2,
  hab:[.9,.45,.9,.9,1,0],micro:["bordure","herbier","obstacle","entree","confluence"],
  leurres:["Swimbait 12-15 cm","Spinnerbait","Jerkbait","Cuillère n°4"],prof:{froid:"2 à 4 m, près des tombants",doux:"1 à 3 m, bordures et herbiers",chaud:"1 à 2 m le matin, plus profond l'après-midi"},
  legal:60,legalT:"60 cm (2e cat.)",ferm:"Fermé du dernier dimanche de janvier au dernier samedi d'avril (2e cat.)",closed:m=>m>=1&&m<=3},
 {id:"sandre",nom:"Sandre",cat:"Carnassier",mois:[.5,.1,.1,.2,.5,.6,.6,.6,.8,1,.9,.7],t:[8,22],moment:{aube:.9,jour:.3,crep:1,nuit:.8},nuage:1.3,
  hab:[1,.15,1,.55,1,0],micro:["fond","obstacle","digue","confluence"],
  leurres:["Shad 8-10 cm sur tête plombée","Finesse en drop shot","Lame vibrante"],prof:{froid:"4 à 6 m, sur le fond",doux:"3 à 5 m, cassures et fosses",chaud:"2 à 4 m au crépuscule"},
  legal:50,legalT:"50 cm (2e cat.)",ferm:"Souvent fermé avec le brochet en 2e cat. (dates par département)",closed:m=>m>=1&&m<=3},
 {id:"silure",nom:"Silure",cat:"Carnassier",mois:[.2,.15,.25,.45,.75,.9,1,1,.85,.6,.35,.2],t:[14,28],moment:{aube:.8,jour:.45,crep:1,nuit:.9},nuage:1.15,
  hab:[1,.1,.9,.35,.8,0],micro:["fond","obstacle","confluence","digue"],
  leurres:["Gros shad 15-25 cm","Leurre souple sur tête lourde","Fireball en verticale","Clonk (verticale en bateau)","Gros poisson nageur"],prof:{froid:"Fosses profondes, 5 à 10 m, pêche très lente",doux:"Cassures et fosses, 3 à 6 m",chaud:"Bordures la nuit, 1 à 4 m ; fosses en plein jour"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année en 2e cat. ; de nuit seulement sur parcours autorisés",closed:()=>false},
 {id:"perche",nom:"Perche",cat:"Carnassier",mois:[.4,.3,.4,.5,.7,.9,.9,.9,1,.9,.7,.5],t:[10,24],moment:{aube:.8,jour:1,crep:.8,nuit:.1},nuage:1,
  hab:[.9,.6,.9,1,1,0],micro:["obstacle","herbier","bordure","digue"],
  leurres:["Micro-leurre 5 cm","Cuillère n°2","Drop shot","Crankbait"],prof:{froid:"3 à 6 m, en banc",doux:"2 à 4 m",chaud:"1 à 3 m, près des obstacles"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouverte toute l'année en 2e cat. (sauf arrêté local)",closed:()=>false},
 {id:"blackbass",nom:"Black-bass",cat:"Carnassier",mois:[.1,.1,.2,.4,.6,.9,1,1,.8,.5,.2,.1],t:[16,28],moment:{aube:1,jour:.6,crep:.9,nuit:.2},nuage:.9,
  hab:[.45,.15,.6,1,.9,0],micro:["herbier","obstacle","bordure","surface"],
  leurres:["Leurre de surface","Texas rig","Chatterbait","Écrevisse souple"],prof:{froid:"3 à 5 m, très lent",doux:"1 à 3 m",chaud:"Surface à 2 m"},
  legal:40,legalT:"40 cm",ferm:"Dates de fermeture par arrêté (souvent au printemps)",closed:()=>false},
 {id:"aspe",nom:"Aspe",cat:"Carnassier",mois:[.2,.2,.4,.6,.8,.9,1,1,.9,.7,.4,.2],t:[12,24],moment:{aube:.9,jour:1,crep:.8,nuit:.1},nuage:.9,
  hab:[.9,.15,.7,.1,.4,0],micro:["courant","surface","confluence"],
  leurres:["Cuillère ondulante lancée loin","Jig métallique 15-25 g","Minnow rapide"],prof:{froid:"Mi-eau dans les veines de courant",doux:"Surface, chasses en veine de courant",chaud:"Surface, chasses visibles"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année en 2e cat.",closed:()=>false},
 {id:"truite",nom:"Truite fario",cat:"Salmonidé",mois:[0,0,.7,.9,1,.9,.7,.6,.8,0,0,0],t:[6,16],moment:{aube:1,jour:.7,crep:1,nuit:0},nuage:1.1,
  hab:[.4,1,0,.1,.35,0],micro:["courant","obstacle","entree"],
  leurres:["Cuillère tournante n°1-2","Petit poisson nageur 5 cm","Nymphe ou sèche (mouche)"],prof:{froid:"Fond des courants lents",doux:"Têtes de courant",chaud:"Zones oxygénées, tôt le matin"},
  legal:23,legalT:"23 cm (souvent plus selon département)",ferm:"1re cat. : ouverte du 2e samedi de mars au 3e dimanche de septembre",closed:m=>m<2||m>8},
 {id:"arcenciel",nom:"Truite arc-en-ciel",cat:"Salmonidé",mois:[.7,.7,.9,1,.9,.6,.4,.4,.6,.8,.9,.8],t:[6,18],moment:{aube:1,jour:.8,crep:.9,nuit:.1},nuage:1.1,
  hab:[.3,.5,.1,.8,.6,0],micro:["entree","courant","bordure","pleineeau"],
  leurres:["Cuillère tournante n°2","Petit leurre souple 5 cm","Asticot, teigne ou pâte"],prof:{froid:"Mi-eau à 2 m",doux:"Près des arrivées d'eau",chaud:"Profond, zones fraîches"},
  legal:23,legalT:"Selon le parcours (souvent 23 cm)",ferm:"Étangs : selon le règlement ; rivières : comme la fario",closed:()=>false},
 {id:"chevesne",nom:"Chevesne",cat:"Poisson blanc",mois:[.3,.3,.4,.6,.8,1,1,1,.9,.7,.5,.3],t:[10,24],moment:{aube:.7,jour:1,crep:.7,nuit:.1},nuage:.9,
  hab:[.9,1,.6,.25,.35,0],micro:["courant","surface","obstacle","bordure"],
  leurres:["Insecte en surface","Micro-cuillère","Petit poisson nageur"],prof:{froid:"Courant lent, 1 à 2 m",doux:"Sous les arbres, surface",chaud:"Surface, sous les branches"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année en 2e cat.",closed:()=>false},
 {id:"barbeau",nom:"Barbeau",cat:"Poisson blanc",mois:[.2,.2,.3,.5,.7,.9,1,1,.9,.6,.3,.2],t:[10,24],moment:{aube:.8,jour:.5,crep:1,nuit:.8},nuage:1.1,
  hab:[1,.6,.4,0,.1,0],micro:["courant","fond","obstacle"],
  leurres:["Ver ou asticot au feeder","Fromage","Petit leurre souple au fond"],prof:{froid:"Fond des courants modérés",doux:"Graviers, courant, 1 à 3 m",chaud:"Courants oxygénés, radiers"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année en 2e cat.",closed:()=>false},
 {id:"vandoise",nom:"Vandoise",cat:"Poisson blanc",mois:[.4,.4,.5,.7,.9,1,1,1,.9,.8,.6,.4],t:[8,22],moment:{aube:.8,jour:1,crep:.8,nuit:.1},nuage:1,
  hab:[.7,1,.3,0,.1,0],micro:["courant","surface"],
  leurres:["Asticot au toc ou au flotteur","Mouche sèche","Micro-cuillère"],prof:{froid:"Veines de courant lentes",doux:"Courant, surface à 1 m",chaud:"Radiers et courants"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouverte toute l'année",closed:()=>false},
 {id:"hotu",nom:"Hotu",cat:"Poisson blanc",mois:[.4,.4,.6,.8,.9,.9,.9,.9,.8,.7,.5,.4],t:[8,22],moment:{aube:.8,jour:1,crep:.8,nuit:.1},nuage:1,
  hab:[.9,.4,.4,0,.1,0],micro:["courant","fond"],
  leurres:["Asticot au toc","Petite nymphe","Pain"],prof:{froid:"Fond, courant modéré",doux:"Graviers, 0,5 à 2 m",chaud:"Courants rapides"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année",closed:()=>false},
 {id:"ide",nom:"Ide mélanote",cat:"Poisson blanc",mois:[.3,.3,.5,.7,.8,.9,.9,.9,.9,.7,.5,.3],t:[10,22],moment:{aube:.8,jour:1,crep:.9,nuit:.2},nuage:1,
  hab:[.8,.3,.8,.3,.5,0],micro:["courant","pleineeau","obstacle"],
  leurres:["Micro-leurre","Insecte","Asticot"],prof:{froid:"Mi-eau, courant lent",doux:"Mi-eau à surface",chaud:"Surface"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année",closed:()=>false},
 {id:"carpe",nom:"Carpe",cat:"Poisson blanc",mois:[.2,.2,.4,.6,.8,.9,1,1,.9,.7,.4,.2],t:[14,26],moment:{aube:.8,jour:.5,crep:.8,nuit:1},nuage:1,
  hab:[.8,.2,.9,1,1,0],micro:["bordure","herbier","fond","entree"],
  leurres:["Bouillette","Maïs","Pellets"],prof:{froid:"Zones profondes, 3 m et plus",doux:"1,5 à 3 m",chaud:"Bordures et herbiers"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouverte toute l'année ; de nuit seulement sur parcours autorisés",closed:()=>false},
 {id:"tanche",nom:"Tanche",cat:"Poisson blanc",mois:[.1,.1,.2,.5,.9,1,1,.9,.6,.3,.1,.1],t:[16,26],moment:{aube:1,jour:.5,crep:.9,nuit:.5},nuage:1.1,
  hab:[.3,.1,.6,1,.8,0],micro:["herbier","bordure","fond"],
  leurres:["Ver de terreau","Maïs doux","Asticot (coup ou feeder)"],prof:{froid:"Envasée, peu active",doux:"Herbiers, 1 à 2 m",chaud:"Bordures herbeuses à l'aube"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouverte toute l'année en 2e cat.",closed:()=>false},
 {id:"breme",nom:"Brème",cat:"Poisson blanc",mois:[.4,.4,.5,.7,.8,.9,.9,.9,.9,.8,.6,.4],t:[10,24],moment:{aube:.9,jour:.7,crep:1,nuit:.8},nuage:1.1,
  hab:[.9,.2,1,.9,1,0],micro:["fond","pleineeau"],
  leurres:["Feeder avec asticot ou ver","Pâte","Maïs"],prof:{froid:"Fosses, 3 à 6 m",doux:"Fond, 2 à 4 m",chaud:"Fond, 2 à 3 m"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouverte toute l'année",closed:()=>false},
 {id:"gardon",nom:"Gardon",cat:"Poisson blanc",mois:[.5,.5,.6,.8,.9,.9,.8,.8,.9,.8,.7,.6],t:[8,22],moment:{aube:.8,jour:1,crep:.8,nuit:.2},nuage:1,
  hab:[.9,.6,1,1,1,0],micro:["pleineeau","bordure","herbier","courant"],
  leurres:["Asticot","Pain","Pâte (coup / feeder)"],prof:{froid:"2 à 4 m",doux:"1 à 3 m",chaud:"Mi-eau"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année en 2e cat.",closed:()=>false},
 {id:"rotengle",nom:"Rotengle",cat:"Poisson blanc",mois:[.2,.2,.4,.6,.9,1,1,1,.8,.5,.3,.2],t:[14,26],moment:{aube:.8,jour:1,crep:.8,nuit:.2},nuage:.9,
  hab:[.4,.2,.8,1,.8,0],micro:["herbier","surface","bordure"],
  leurres:["Pain en surface","Asticot","Mouche sèche"],prof:{froid:"Herbiers profonds",doux:"Surface à 1 m, herbiers",chaud:"Surface près des nénuphars"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année",closed:()=>false},
 {id:"ablette",nom:"Ablette",cat:"Poisson blanc",mois:[.3,.3,.5,.7,.9,1,1,1,.9,.7,.5,.3],t:[12,24],moment:{aube:.8,jour:1,crep:.8,nuit:.1},nuage:.9,
  hab:[.9,.4,1,.7,.9,0],micro:["surface","pleineeau","courant"],
  leurres:["Asticot en surface (coup léger)","Mouche","Micro-leurre"],prof:{froid:"Mi-eau",doux:"Surface",chaud:"Surface"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouverte toute l'année",closed:()=>false},
 {id:"carassin",nom:"Carassin",cat:"Poisson blanc",mois:[.2,.2,.4,.6,.8,.9,.9,.9,.8,.6,.3,.2],t:[14,26],moment:{aube:.9,jour:.8,crep:.9,nuit:.5},nuage:1,
  hab:[.4,.1,.7,1,.7,0],micro:["bordure","herbier","fond"],
  leurres:["Asticot","Maïs","Ver"],prof:{froid:"Fond",doux:"Bordures, 1 à 2 m",chaud:"Bordures"},
  legal:0,legalT:"Pas de taille nationale",ferm:"Ouvert toute l'année",closed:()=>false},
 {id:"anguille",nom:"Anguille",cat:"Autre",mois:[0,0,0,.5,.8,1,1,1,.6,0,0,0],t:[14,26],moment:{aube:.4,jour:.15,crep:.9,nuit:1},nuage:1.2,
  hab:[.9,.6,.8,.7,.6,0],micro:["fond","obstacle","digue"],
  leurres:["Ver","Petit poisson mort","Nuit, eau trouble"],prof:{froid:"Envasée, inactive",doux:"Fond, près des obstacles",chaud:"Fond la nuit"},
  legal:0,legalT:"Fixée par arrêté",ferm:"Très encadrée : période courte (souvent printemps-été), anguille argentée interdite, déclaration possible. À vérifier avant",closed:m=>m<3||m>7},
 {id:"poissonchat",nom:"Poisson-chat",cat:"Autre",mois:[.1,.1,.2,.5,.8,1,1,1,.8,.5,.2,.1],t:[16,28],moment:{aube:.6,jour:.3,crep:.9,nuit:1},nuage:1.1,
  hab:[.4,.2,.7,1,.7,0],micro:["fond","bordure"],
  leurres:["Ver","Asticot"],prof:{froid:"Envasé",doux:"Fond",chaud:"Fond et bordures la nuit"},
  legal:0,legalT:"Pas de taille",ferm:"Espèce invasive : interdite au transport vivant, ne pas relâcher ailleurs",closed:()=>false},
 {id:"perchesoleil",nom:"Perche-soleil",cat:"Autre",mois:[.1,.1,.2,.5,.8,1,1,1,.8,.4,.2,.1],t:[16,28],moment:{aube:.8,jour:1,crep:.7,nuit:.1},nuage:.9,
  hab:[.3,.2,.6,1,.8,0],micro:["herbier","bordure","obstacle"],
  leurres:["Micro-leurre 2-3 cm","Ver","Asticot"],prof:{froid:"Herbiers profonds",doux:"Bordures, 0,5 à 1,5 m",chaud:"Bordures"},
  legal:0,legalT:"Pas de taille",ferm:"Espèce invasive : interdite au transport vivant",closed:()=>false},
 {id:"mulet",nom:"Mulet",cat:"Mer / estuaire",mois:[.3,.3,.4,.6,.8,.9,1,1,.9,.7,.5,.3],t:[10,26],moment:{aube:.8,jour:1,crep:.8,nuit:.2},nuage:1,
  hab:[.2,0,.3,0,0,1],micro:["surface","courant","digue"],
  leurres:["Pain","Petite mouche","Ver"],prof:{froid:"Ports et estuaires",doux:"Surface, ports, estuaires",chaud:"Surface"},
  legal:20,legalT:"20 cm (à vérifier)",ferm:"Ouvert toute l'année",closed:()=>false},
 {id:"bar",nom:"Bar",cat:"Mer / estuaire",mois:[.2,.2,.3,.5,.8,.9,.9,.9,1,.9,.6,.3],t:[10,20],moment:{aube:1,jour:.6,crep:1,nuit:.6},nuage:1.1,
  hab:[.1,0,0,0,0,1],micro:["courant","obstacle","digue","surface"],
  leurres:["Stickbait de surface","Shad 10-12 cm","Jig"],prof:{froid:"Estuaires, 3 à 8 m",doux:"Roches et courants, 1 à 4 m",chaud:"Surface à l'aube"},
  legal:42,legalT:"42 cm, marquage obligatoire",ferm:"Quotas et périodes fixés chaque année",closed:()=>false},
 {id:"maquereau",nom:"Maquereau",cat:"Mer / estuaire",mois:[0,0,0,.3,.7,1,1,1,.8,.4,0,0],t:[12,20],moment:{aube:1,jour:.8,crep:.9,nuit:.1},nuage:1,
  hab:[0,0,0,0,0,1],micro:["pleineeau","courant","digue"],
  leurres:["Mitraillette à plumes","Petit jig 10-20 g","Cuillère"],prof:{froid:"Absent",doux:"Pleine eau, depuis les digues",chaud:"Surface à mi-eau, chasses"},
  legal:20,legalT:"20 cm (Manche/Atlantique), marquage",ferm:"Ouvert",closed:()=>false},
 {id:"lieu",nom:"Lieu jaune",cat:"Mer / estuaire",mois:[.3,.3,.4,.6,.8,.9,.9,.9,.9,.8,.6,.4],t:[8,18],moment:{aube:1,jour:.7,crep:1,nuit:.4},nuage:1.1,
  hab:[0,0,0,0,0,1],micro:["fond","obstacle"],
  leurres:["Shad 10-15 cm","Jig","Leurre souple sur tête plombée"],prof:{froid:"Roches profondes",doux:"Roches et épaves, 5 à 20 m",chaud:"Roches"},
  legal:30,legalT:"30 cm, marquage",ferm:"Ouvert",closed:()=>false},
 {id:"dorade",nom:"Dorade royale",cat:"Mer / estuaire",mois:[0,0,0,.2,.5,.8,1,1,1,.8,.3,0],t:[14,24],moment:{aube:.9,jour:.8,crep:.9,nuit:.4},nuage:1,
  hab:[0,0,0,0,0,1],micro:["fond","obstacle","digue"],
  leurres:["Crabe ou ver (surfcasting)","Petit leurre crabe","Couteau"],prof:{froid:"Absente",doux:"Fonds rocheux et parcs, 2 à 10 m",chaud:"Estuaires et parcs"},
  legal:23,legalT:"23 cm, marquage",ferm:"Ouvert",closed:()=>false},
];
const SP=Object.fromEntries(SPECIES.map(s=>[s.id,s]));
const ZONE_TYPES={herbier:"Herbier",fosse:"Fosse",tombant:"Tombant / cassure",bordure:"Bordure",obstacle:"Obstacle (bois, rochers)",courant:"Veine de courant",pont:"Pont / ouvrage",plage:"Haut-fond / plage",autre:"Autre"};
function parseRange(t){const n=(String(t).match(/\d+(?:[.,]\d+)?/g)||[]).map(x=>+x.replace(",","."));if(/surface/i.test(t))n.unshift(0);if(!n.length)return null;return [Math.min(...n),Math.max(...n)]}
function zoneScore(z,spot,c,now){
  if(!c)return null;
  const sp=speciesFor(spot,now,c).filter(x=>!x.closed);let best=null;
  const zs=z.especes&&z.especes.length?z.especes:sp.map(x=>x.s.id);
  for(const id of zs){const x=sp.find(y=>y.s.id===id);if(!x)continue;
    let match=.6;const r=parseRange(x.prof);
    if(r&&z.prof_min!=null){const lo=+z.prof_min,hi=z.prof_max!=null?+z.prof_max:+z.prof_min;const ov=Math.max(0,Math.min(hi,r[1])-Math.max(lo,r[0]));match=ov>0||(lo<=r[1]&&hi>=r[0])?1:Math.max(.2,1-Math.min(Math.abs(lo-r[1]),Math.abs(hi-r[0]))/4)}
    const sc=x.a*(.45+.55*match);if(!best||sc>best.sc)best={sc,sp:x};}
  if(!best)return null;
  const ctx=condCtx(now,c),nearC=catchesInZone(z,spot),near=nearC.length,w=nearC.reduce((t,k)=>t+simCatch(k,ctx),0);
  return {score:Math.min(10,Math.round((best.sc*10*(1+Math.min(near,5)*.04+Math.min(w,4)*.1))*10)/10),sp:best.sp,catches:near,similar:nearC.filter(k=>simCatch(k,ctx)>=.5).length};
}
const WATER_T=[6,6,8,11,15,19,21,21,18,14,10,7];

/* ================= Astronomie ================= */
const PI=Math.PI,rad=PI/180,dayMs=864e5,J1970=2440588,J2000=2451545,ecl=rad*23.4397;
const toJ=d=>d.valueOf()/dayMs-.5+J1970, fromJ=j=>new Date((j+.5-J1970)*dayMs), toDays=d=>toJ(d)-J2000;
function sunTimes(date,lat,lng){
  const lw=rad*-lng,phi=rad*lat,d=toDays(date),n=Math.round(d-.0009-lw/(2*PI));
  const ds=.0009+lw/(2*PI)+n,M=rad*(357.5291+.98560028*ds);
  const C=rad*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M)),L=M+C+rad*102.9372+PI;
  const dec=Math.asin(Math.sin(ecl)*Math.sin(L));
  const tr=ds2=>J2000+ds2+.0053*Math.sin(M)-.0069*Math.sin(2*L);
  const noon=tr(ds);
  const w=Math.acos((Math.sin(-.833*rad)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)));
  const set=tr(.0009+(w+lw)/(2*PI)+n);
  return {rise:fromJ(noon-(set-noon)),set:fromJ(set),noon:fromJ(noon)};
}
function moon(date){
  const P=29.530588853,age=(((toJ(date)-2451550.1)%P)+P)%P;
  const names=["Nouvelle lune","Premier croissant","Premier quartier","Lune gibbeuse croissante","Pleine lune","Lune gibbeuse décroissante","Dernier quartier","Dernier croissant"];
  return {age,illum:(1-Math.cos(2*PI*age/P))/2,name:names[Math.floor((age/P)*8+.5)%8]};
}
function solunar(date,lat,lng){
  const s=sunTimes(date,lat,lng),m=moon(date),transit=s.noon.getTime()+m.age/29.53*dayMs;
  const d0=new Date(date);d0.setHours(0,0,0,0);
  const norm=t=>{while(t<d0.getTime())t+=dayMs;while(t>=d0.getTime()+dayMs)t-=dayMs;return new Date(t)};
  return {majors:[norm(transit),norm(transit+12*36e5)].sort((a,b)=>a-b),minors:[norm(transit+6.2*36e5),norm(transit-6.2*36e5)].sort((a,b)=>a-b)};
}

/* ================= Météo et eau (données réelles) ================= */
const WX={};
async function fetchJSON(url,ms=9000,body){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);
  try{const r=await fetch(url,body?{method:"POST",body,headers:{"Content-Type":"application/x-www-form-urlencoded"},signal:c.signal}:{signal:c.signal});if(!r.ok)throw new Error(r.status);return await r.json()}finally{clearTimeout(t)}
}
const wxKey=(lat,lng)=>lat.toFixed(2)+","+lng.toFixed(2);
function getWx(lat,lng){
  const k=wxKey(lat,lng),c=WX[k];
  if(c&&(c.loading||Date.now()-c.at<15*60e3))return c;
  WX[k]={loading:true,at:Date.now(),hours:c&&c.hours,water:c&&c.water};
  (async()=>{
    try{
      const j=await fetchJSON(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&hourly=temperature_2m,pressure_msl,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover,precipitation&timezone=GMT&past_days=1&forecast_days=2`);
      const h=j.hourly;
      WX[k].hours=h.time.map((t,i)=>({t:new Date(t+"Z").getTime(),temp:h.temperature_2m[i],press:h.pressure_msl[i],wind:h.wind_speed_10m[i],gust:h.wind_gusts_10m[i],dir:h.wind_direction_10m[i],cloud:h.cloud_cover[i],rain:h.precipitation[i]}));
      WX[k].error=null;
      try{localStorage.setItem("wx:"+k,JSON.stringify({at:Date.now(),hours:WX[k].hours}))}catch(e){}
    }catch(e){
      WX[k].error="Météo indisponible (pas de réseau ?)";
      try{const s=JSON.parse(localStorage.getItem("wx:"+k));if(s&&s.hours){WX[k].hours=s.hours;WX[k].stale=s.at}}catch(e2){}
    }
    WX[k].loading=false;WX[k].at=Date.now();scheduleRender();
  })();
  return WX[k];
}
const WATER={};
function getWater(lat,lng){
  const k=lat.toFixed(2)+","+lng.toFixed(2);
  if(WATER[k])return WATER[k];
  WATER[k]={loading:true};
  (async()=>{
    const bbox=`${(lng-.25).toFixed(3)},${(lat-.18).toFixed(3)},${(lng+.25).toFixed(3)},${(lat+.18).toFixed(3)}`;
    const dist=(a,b,c,d)=>Math.hypot((a-c)*111,(b-d)*74);
    const out={};
    try{
      const st=await fetchJSON(`https://hubeau.eaufrance.fr/api/v1/temperature/station?bbox=${bbox}&size=100&format=json`);
      const near=(st.data||[]).map(s=>({s,d:dist(s.latitude,s.longitude,lat,lng)})).filter(n=>n.d<25).sort((a,b)=>a.d-b.d);
      for(const n of near.slice(0,3)){
        const ch=await fetchJSON(`https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=${encodeURIComponent(n.s.code_station)}&size=1&sort=desc&format=json`);
        const m=ch.data&&ch.data[0];
        if(m&&m.resultat!=null){const when=new Date(m.date_mesure_temp+"T"+(m.heure_mesure_temp||"00:00:00"));
          if(Date.now()-when<20*dayMs){out.temp={v:m.resultat,when,station:n.s.libelle_station||n.s.libelle_cours_eau||"",km:n.d};break}}
      }
    }catch(e){}
    try{
      const st=await fetchJSON(`https://hubeau.eaufrance.fr/api/v2/hydrometrie/referentiel/stations?bbox=${bbox}&size=100&format=json`);
      const near=(st.data||[]).filter(s=>s.en_service!==false&&(s.latitude_station??s.latitude)!=null).map(s=>({s,d:dist(s.latitude_station??s.latitude,s.longitude_station??s.longitude,lat,lng)})).filter(n=>n.d<25).sort((a,b)=>a.d-b.d);
      for(const n of near.slice(0,5)){
        const code=n.s.code_station;
        const [H,Q]=await Promise.all(["H","Q"].map(g=>fetchJSON(`https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=${encodeURIComponent(code)}&grandeur_hydro=${g}&size=1&format=json`).catch(()=>null)));
        const h=H&&H.data&&H.data[0],q=Q&&Q.data&&Q.data[0];
        if(h||q){out.hydro={h:h?h.resultat_obs/1000:null,q:q?q.resultat_obs/1000:null,when:new Date((h||q).date_obs),station:n.s.libelle_station||code,km:n.d};break}
      }
    }catch(e){}
    WATER[k]=out;scheduleRender();
  })();
  return WATER[k];
}
const WB={};
const OVERPASS=["https://overpass-api.de/api/interpreter","https://overpass.kumi.systems/api/interpreter","https://maps.mail.ru/osm/tools/overpass/api/interpreter"];
async function overpass(q,ms){
  let last;for(const url of OVERPASS){try{return await fetchJSON(url,ms||9000,"data="+encodeURIComponent(q))}catch(e){last=e}}
  throw last||new Error("overpass");
}
function getWaterBody(lat,lng){
  const k=lat.toFixed(4)+","+lng.toFixed(4);
  const cur=WB[k];
  if(cur&&!(cur.error&&Date.now()-cur.at>20000))return cur;
  if(!cur){try{const c=JSON.parse(localStorage.getItem("wb2:"+k));if(c){WB[k]=c;return c}}catch(e){}}
  WB[k]={loading:true};
  (async()=>{
    const q=`[out:json][timeout:20];is_in(${lat},${lng})->.a;(way(pivot.a)["natural"="water"];rel(pivot.a)["natural"="water"];)->.l1;.l1 out tags;`+
      `way(around:400,${lat},${lng})["natural"="water"];out geom;`+
      `way(around:90,${lat},${lng})["waterway"~"^(river|stream|canal|brook|ditch|drain)$"];out geom;`+
      `way(around:200,${lat},${lng})["natural"="coastline"];out geom;`;
    let res={k:null};
    try{
      const j=await overpass(q),els=j.elements||[];
      const kx=111320*Math.cos(lat*rad),ky=110540,P=p=>({x:(p.lon-lng)*kx,y:(p.lat-lat)*ky}),O={x:0,y:0};
      const segD=g=>{let m=1e9;for(let i=0;i<g.length-1;i++){const a=g[i],b=g[i+1],dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1;let t=(-a.x*dx-a.y*dy)/L;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(a.x+t*dx,a.y+t*dy))}return m};
      const lakeOf=tags=>{const w=tags.water||"",n=tags.name||"";
        if(w==="river"||w==="oxbow")return {k:"grande_riviere",name:n};
        if(w==="stream")return {k:"petite_riviere",name:n};
        if(w==="canal")return {k:"canal",name:n};
        if(w==="lagoon")return {k:"mer",name:n};
        if(w==="pond"||/^(étang|etang|mare)/i.test(n))return {k:"etang",name:n};
        return {k:/étang|etang/i.test(n)?"etang":"lac",name:n}};
      const area=els.find(e=>e.type==="area"&&e.tags&&e.tags.natural==="water");
      const polys=els.filter(e=>e.type==="way"&&e.tags&&e.tags.natural==="water"&&e.geometry&&e.geometry.length>3);
      const inPoly=polys.find(e=>pip(e.geometry.map(P),O));
      const lines=els.filter(e=>e.type==="way"&&e.tags&&e.tags.waterway&&e.geometry).map(e=>{
        const w=e.tags.waterway,width=parseFloat(e.tags.width);
        const tol=w==="river"?(width||20)/2+15:w==="canal"?(width||15)/2+12:w==="stream"||w==="brook"?12:8;
        return {e,d:segD(e.geometry.map(P)),tol}}).filter(x=>x.d<=x.tol).sort((x,y)=>x.d-y.d);
      const coast=els.filter(e=>e.type==="way"&&e.tags&&e.tags.natural==="coastline"&&e.geometry).some(e=>segD(e.geometry.map(P))<150);
      if(area)res=lakeOf(area.tags);
      else if(inPoly)res=lakeOf(inPoly.tags);
      else if(lines.length){const l=lines[0].e,w=l.tags.waterway,n=l.tags.name||"",width=parseFloat(l.tags.width);
        res={k:w==="river"?(width&&width<6?"petite_riviere":"grande_riviere"):w==="canal"?"canal":"petite_riviere",name:n};}
      else if(coast)res={k:"mer",name:""};
      res.at=Date.now();
      try{localStorage.setItem("wb2:"+k,JSON.stringify(res))}catch(e){}
    }catch(e){res={k:null,error:true,at:Date.now()}}
    WB[k]=res;scheduleRender();
    if(S.sheet&&S.sheet.type==="spotForm"&&!S.formTouched)renderSheet(true);
  })();
  return WB[k];
}
/* Zones suggérées à partir de la forme du plan d'eau (OpenStreetMap) */
const MICRO={bordure:"bordure",herbier:"herbiers",fond:"fond / zone profonde",courant:"veine de courant",obstacle:"obstacles",confluence:"confluence",entree:"arrivée d'eau",digue:"digue",surface:"surface",pleineeau:"pleine eau"};
const AUTOZ={
 bordure:{t:"Bordure",micro:["bordure","herbier"],r:20},
 centre:{t:"Zone centrale, plus profonde",micro:["fond","pleineeau"],r:60},
 large:{t:"Pleine eau, au large",micro:["pleineeau","fond"],r:50},
 entree:{t:"Arrivée d'eau",micro:["entree","courant","confluence"],r:20},
 digue:{t:"Digue / barrage",micro:["digue","fond","obstacle"],r:25},
 ext:{t:"Extérieur du virage : fosse probable",micro:["fond","obstacle"],r:18},
 int:{t:"Intérieur du virage : haut-fond",micro:["bordure","herbier"],r:18},
 pont:{t:"Pont : piles et ombre",micro:["obstacle","fond"],r:15},
 confluence:{t:"Confluence",micro:["confluence","courant"],r:20},
 veine:{t:"Veine de courant",micro:["courant","pleineeau","surface"],r:15},
 ouvrage:{t:"Ouvrage hydraulique : pêche interdite à proximité",micro:[],r:30,ban:true},
 pointe:{t:"Pointe / avancée de terre : tombant probable",micro:["obstacle","fond","bordure","digue"],r:20},
 anse:{t:"Anse abritée : herbiers et eau calme",micro:["herbier","bordure","entree","surface"],r:20}};
const AZ={};
function getOsmZones(spot){
  const k=spot.lat.toFixed(4)+","+spot.lng.toFixed(4);
  if(AZ[k])return AZ[k];
  try{const c=JSON.parse(localStorage.getItem("az:"+k));if(c&&Date.now()-c.at<30*dayMs){AZ[k]=c;return c}}catch(e){}
  AZ[k]={loading:true,zones:[]};
  (async()=>{
    const {lat,lng}=spot,R=350;
    const q=`[out:json][timeout:25];is_in(${lat},${lng})->.a;(way(pivot.a)["natural"="water"];rel(pivot.a)["natural"="water"];)->.l1;.l1 out geom;`+
      `way(around:${R},${lat},${lng})["natural"="water"];out geom;`+
      `way(around:${R},${lat},${lng})["waterway"~"^(river|canal|stream|brook)$"];out geom;`+
      `(way(around:${R},${lat},${lng})["bridge"]["highway"];way(around:${R},${lat},${lng})["bridge"]["railway"];);out geom;`+
      `(node(around:${R},${lat},${lng})["waterway"~"^(weir|dam|lock_gate)$"];way(around:${R},${lat},${lng})["waterway"~"^(weir|dam)$"];node(around:${R},${lat},${lng})["lock"="yes"];);out geom;`;
    let res={zones:[],at:Date.now()};
    try{
      const j=await overpass(q,25000);
      res.zones=buildAutoZones(spot,j.elements||[]);
      try{localStorage.setItem("az:"+k,JSON.stringify(res))}catch(e){}
    }catch(e){res.error=true}
    AZ[k]=res;scheduleRender();if(zoneMap)refreshZoneMap(true);
  })();
  return AZ[k];
}
function buildAutoZones(spot,els){
  const lat0=spot.lat,lng0=spot.lng,kx=111320*Math.cos(lat0*rad),ky=110540;
  const P=p=>({x:(p.lon-lng0)*kx,y:(p.lat-lat0)*ky}),G=q=>({lat:+(lat0+q.y/ky).toFixed(6),lng:+(lng0+q.x/kx).toFixed(6)});
  const d2=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const geomOf=e=>e.geometry?e.geometry.map(P):e.members?[].concat(...e.members.filter(m=>m.geometry&&m.role!=="inner").map(m=>m.geometry.map(P))):e.lat!=null?[P(e)]:[];
  const lakes=els.filter(e=>e.tags&&e.tags.natural==="water"&&!["river","canal","oxbow"].includes(e.tags.water));
  const rivers=els.filter(e=>e.tags&&e.tags.waterway&&["river","canal","stream","brook"].includes(e.tags.waterway));
  const bridges=els.filter(e=>e.tags&&e.tags.bridge);
  const works=els.filter(e=>e.tags&&(["weir","dam","lock_gate"].includes(e.tags.waterway)||e.tags.lock==="yes"));
  const Z=[],add=(type,pt,extra,minD=25)=>{if(Z.some(z=>d2(z.p,pt)<minD))return;Z.push(Object.assign({type,p:pt},extra||{}))};
  const O={x:0,y:0};
  const nearSeg=(pts,q)=>{let best={d:1e9};for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1;let t=((q.x-a.x)*dx+(q.y-a.y)*dy)/L;t=Math.max(0,Math.min(1,t));const pt={x:a.x+t*dx,y:a.y+t*dy},d=d2(pt,q);if(d<best.d)best={d,pt,i}}return best};
  // Plan d'eau : le plus proche du point touché
  let lake=null,lakeD=1e9;
  lakes.forEach(e=>{const g=geomOf(e);if(g.length<4)return;const n=nearSeg(g,O);const inside=pip(g,O);const d=inside?0:n.d;if(d<lakeD){lakeD=d;lake={e,g}}});
  let river=null,rivD=1e9;
  const rank={river:3,canal:2,stream:1,brook:0};
  rivers.forEach(e=>{const g=geomOf(e);if(g.length<2)return;const n=nearSeg(g,O);const d=n.d-(rank[e.tags.waterway]||0)*5;if(d<rivD){rivD=d;river={e,g}}});
  if(lake&&(lakeD<=Math.max(30,rivD))){
    const g=lake.g,per=g.reduce((a,p,i)=>i?a+d2(p,g[i-1]):0,0);
    const big=per>4000,cen=g.reduce((a,p)=>({x:a.x+p.x/g.length,y:a.y+p.y/g.length}),{x:0,y:0});
    const pts=big?g.filter(p=>d2(p,O)<600):g;
    rivers.forEach(e=>{const rg=geomOf(e);for(const q of rg){const n=nearSeg(g,q);if(n.d<20){const v={x:cen.x-n.pt.x,y:cen.y-n.pt.y},L=Math.hypot(v.x,v.y)||1;add("entree",{x:n.pt.x+v.x/L*12,y:n.pt.y+v.y/L*12});break}}});
    works.forEach(e=>{const wg=geomOf(e);if(!wg.length)return;const m=wg[Math.floor(wg.length/2)];if(nearSeg(g,m).d<40)add(e.tags.waterway==="dam"?"digue":"ouvrage",m)});
    // bordures régulièrement espacées, légèrement vers l'intérieur
    const step=Math.max(60,(big?1200:per)/7);let acc=step;
    for(let i=1;i<pts.length;i++){acc+=d2(pts[i],pts[i-1]);if(acc>=step){acc=0;const p=pts[i],v={x:cen.x-p.x,y:cen.y-p.y},L=Math.hypot(v.x,v.y)||1;add("bordure",{x:p.x+v.x/L*12,y:p.y+v.y/L*12})}}
    if(!big)add("centre",cen,{r:Math.min(120,Math.max(25,per/14))});
    else{const n=nearSeg(g,O),v={x:cen.x-n.pt.x,y:cen.y-n.pt.y},L=Math.hypot(v.x,v.y)||1;add("large",{x:n.pt.x+v.x/L*150,y:n.pt.y+v.y/L*150})}
  }else if(river&&rivD<120){
    const all=river.g,ni=nearSeg(all,O).i;
    // garder la portion à moins de 400 m du point
    let a=ni,b=ni+1;while(a>0&&d2(all[a-1],O)<400)a--;while(b<all.length-1&&d2(all[b+1],O)<400)b++;
    const g=all.slice(a,b+1),wt=river.e.tags.waterway,w=parseFloat(river.e.tags.width)||(wt==="river"?18:wt==="canal"?14:4),off=Math.max(2,w*.35);
    bridges.forEach(e=>{const bg=geomOf(e);for(const q of bg){const n=nearSeg(g,q);if(n.d<w+15){add("pont",n.pt);break}}});
    rivers.filter(e=>e!==river.e&&(e.tags.name||"")!==(river.e.tags.name||"#")).forEach(e=>{const rg=geomOf(e);for(const q of rg){const n=nearSeg(g,q);if(n.d<w/2+10){add("confluence",n.pt);break}}});
    // virages
    const bends=[];
    for(let i=1;i<g.length-1;i++){
      let j=i-1;while(j>0&&d2(g[j],g[i])<45)j--;let k=i+1;while(k<g.length-1&&d2(g[k],g[i])<45)k++;
      const u={x:g[i].x-g[j].x,y:g[i].y-g[j].y},v={x:g[k].x-g[i].x,y:g[k].y-g[i].y};
      const ang=Math.atan2(u.x*v.y-u.y*v.x,u.x*v.x+u.y*v.y)/rad;
      if(Math.abs(ang)>20)bends.push({i,ang,u,v});
    }
    bends.sort((x,y)=>Math.abs(y.ang)-Math.abs(x.ang));const chosen=[];
    for(const bd of bends){if(chosen.length>=3)break;if(chosen.some(c=>d2(g[c.i],g[bd.i])<80))continue;chosen.push(bd)}
    chosen.forEach(bd=>{const dx=bd.u.x+bd.v.x,dy=bd.u.y+bd.v.y,L=Math.hypot(dx,dy)||1,n={x:-dy/L,y:dx/L},sgn=bd.ang>0?-1:1;
      add("ext",{x:g[bd.i].x+n.x*off*sgn,y:g[bd.i].y+n.y*off*sgn},{r:Math.max(8,w*.5)},15);add("int",{x:g[bd.i].x-n.x*off*sgn,y:g[bd.i].y-n.y*off*sgn},{r:Math.max(8,w*.5)},8)});
    // veine de courant sur les parties droites
    let acc=0;for(let i=1;i<g.length;i++){acc+=d2(g[i],g[i-1]);if(acc>150&&!chosen.some(c=>d2(g[c.i],g[i])<60)){acc=0;add("veine",g[i],{r:Math.max(8,w*.4)})}}
    works.forEach(e=>{const wg=geomOf(e);if(!wg.length)return;const m=wg[Math.floor(wg.length/2)];if(nearSeg(g,m).d<40)add("ouvrage",m)});
  }
  return Z.map((z,i)=>{const def=AUTOZ[z.type],ll=G(z.p);return {id:"auto"+i,auto:true,type:z.type,label:def.t,micro:def.micro,ban:!!def.ban,rayon:Math.round(z.r||def.r),lat:ll.lat,lng:ll.lng}});
}
function pip(poly,p){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a.y>p.y)!==(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/((b.y-a.y)||1e-9)+a.x))c=!c}return c}
/* Analyse du plan d'eau à partir de sa forme sur le fond OpenStreetMap (fonctionne sans service de données) */
const TA={},IMGC={};
function loadImg(url){return IMGC[url]||(IMGC[url]=new Promise((res,rej)=>{const i=new Image();i.crossOrigin="anonymous";const t=setTimeout(()=>rej(new Error("timeout")),9000);i.onload=()=>{clearTimeout(t);res(i)};i.onerror=()=>{clearTimeout(t);delete IMGC[url];rej(new Error("img"))};i.src=url}))}
function tileAnalysis(lat,lng){
  const k=lat.toFixed(4)+","+lng.toFixed(4);if(TA[k])return TA[k];
  try{const c=JSON.parse(localStorage.getItem("ta:"+k));if(c&&Date.now()-c.at<60*dayMs){TA[k]=c;return c}}catch(e){}
  TA[k]={loading:true};
  (async()=>{let r=null;try{r=await analyzeWater(lat,lng)}catch(e){console.warn("analyse",e)}
    TA[k]=r?Object.assign(r,{at:Date.now()}):{none:true,error:true,at:Date.now()};
    if(r)try{localStorage.setItem("ta:"+k,JSON.stringify(TA[k]))}catch(e){}
    scheduleRender();if(zoneMap)refreshZoneMap(true)})();
  return TA[k];
}
async function analyzeWater(lat,lng){
  let last=null;
  for(const z of [17,16,15]){const r=await analyzeAt(lat,lng,z);if(!r)return last;last=r;if(r.kind==="river"||!r.touches)break}
  return last;
}
async function analyzeAt(lat,lng,z){
  const n=2**z,xt=(lng+180)/360*n,yt=(1-Math.log(Math.tan(lat*rad)+1/Math.cos(lat*rad))/PI)/2*n,X=Math.floor(xt),Y=Math.floor(yt),W=768;
  const cv=document.createElement("canvas");cv.width=cv.height=W;const g=cv.getContext("2d",{willReadFrequently:true});
  await Promise.all([-1,0,1].flatMap(dy=>[-1,0,1].map(async dx=>{const im=await loadImg(`https://tile.openstreetmap.org/${z}/${X+dx}/${Y+dy}.png`);g.drawImage(im,(dx+1)*256,(dy+1)*256)})));
  const px=g.getImageData(0,0,W,W).data,N=W*W;
  let m=new Uint8Array(N);
  for(let p=0,i=0;p<N;p++,i+=4)m[p]=(Math.abs(px[i]-170)<=10&&Math.abs(px[i+1]-211)<=10&&Math.abs(px[i+2]-223)<=10)?1:0;
  // fermeture (bouche les trous des noms écrits sur l'eau)
  const morph=(src,dil)=>{const o=new Uint8Array(N);for(let y=0;y<W;y++)for(let x=0;x<W;x++){let v=dil?0:1;for(let dy=-2;dy<=2&&(dil?!v:v);dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=W)continue;const s=src[yy*W+xx];if(dil&&s){v=1;break}if(!dil&&!s){v=0;break}}o[y*W+x]=v}return o};
  m=morph(morph(m,true),false);
  const sx=Math.min(W-1,Math.floor((xt-X+1)*256)),sy=Math.min(W-1,Math.floor((yt-Y+1)*256));
  let start=-1;for(let r=0;r<=18&&start<0;r++)for(let dy=-r;dy<=r&&start<0;dy++)for(let dx=-r;dx<=r;dx++){const x=sx+dx,y=sy+dy;if(x>=0&&y>=0&&x<W&&y<W&&m[y*W+x]){start=y*W+x;break}}
  if(start<0)return null;
  // relier les morceaux d'eau coupés par un pont ou une route (dilatation de 6 px pour la connexité seulement)
  const R6=6,tmp=new Uint8Array(N),md=new Uint8Array(N);
  for(let y=0;y<W;y++){let run=-1e9;for(let x=0;x<W;x++){if(m[y*W+x])run=x;tmp[y*W+x]=x-run<=R6?1:0}run=1e9;for(let x=W-1;x>=0;x--){if(m[y*W+x])run=x;if(run-x<=R6)tmp[y*W+x]=1}}
  for(let x=0;x<W;x++){let run=-1e9;for(let y=0;y<W;y++){if(tmp[y*W+x])run=y;md[y*W+x]=y-run<=R6?1:0}run=1e9;for(let y=W-1;y>=0;y--){if(tmp[y*W+x])run=y;if(run-y<=R6)md[y*W+x]=1}}
  const con=new Uint8Array(N),q=new Int32Array(N);let qh=0,qt=0;con[start]=1;q[qt++]=start;
  while(qh<qt){const p=q[qh++],x=p%W,y=(p/W)|0;
    if(x>0&&md[p-1]&&!con[p-1]){con[p-1]=1;q[qt++]=p-1}if(x<W-1&&md[p+1]&&!con[p+1]){con[p+1]=1;q[qt++]=p+1}
    if(y>0&&md[p-W]&&!con[p-W]){con[p-W]=1;q[qt++]=p-W}if(y<W-1&&md[p+W]&&!con[p+W]){con[p+W]=1;q[qt++]=p+W}}
  const reg=new Uint8Array(N);let area=0,border=0;
  for(let p=0;p<N;p++)if(con[p]&&m[p]){reg[p]=1;area++;const x=p%W,y=(p/W)|0;if(x===0||y===0||x===W-1||y===W-1)border++}
  if(area<30)return null;
  // distance à la berge (chanfrein)
  const D=new Float32Array(N);for(let p=0;p<N;p++)D[p]=reg[p]?1e6:0;
  const S2=1.4142;
  for(let y=0;y<W;y++)for(let x=0;x<W;x++){const p=y*W+x;if(!reg[p])continue;let v=D[p];
    if(x>0)v=Math.min(v,D[p-1]+1);if(y>0){v=Math.min(v,D[p-W]+1);if(x>0)v=Math.min(v,D[p-W-1]+S2);if(x<W-1)v=Math.min(v,D[p-W+1]+S2)}D[p]=v}
  for(let y=W-1;y>=0;y--)for(let x=W-1;x>=0;x--){const p=y*W+x;if(!reg[p])continue;let v=D[p];
    if(x<W-1)v=Math.min(v,D[p+1]+1);if(y<W-1){v=Math.min(v,D[p+W]+1);if(x<W-1)v=Math.min(v,D[p+W+1]+S2);if(x>0)v=Math.min(v,D[p+W-1]+S2)}D[p]=v}
  for(let p=0;p<N;p++)if(D[p]>=1e5)D[p]=W; // région sans berge visible (très grand plan d'eau)
  const mpp=156543.03392*Math.cos(lat*rad)/n;
  const sxp=start%W,syp=(start/W)|0,maxR=450/mpp,near=(x,y)=>Math.hypot(x-sxp,y-syp)<=maxR;
  let maxD=0,argD=start;for(let p=0;p<N;p++)if(reg[p]&&D[p]>maxD&&near(p%W,(p/W)|0)){maxD=D[p];argD=p}
  const elong=area/(PI*maxD*maxD+1),touches=border>Math.max(10,area*.004);
  const kind=(elong>6&&maxD*mpp<60)||(touches&&elong>3.5&&maxD*mpp<40)?"river":"lake";
  const areaM2=area*mpp*mpp,widthM=2*maxD*mpp;
  const milieu=kind==="river"?(widthM<7?"petite_riviere":"grande_riviere"):(areaM2<200000&&!touches?"etang":"lac");
  // proportion d'eau autour de chaque point de berge (table intégrale)
  const I=new Uint32Array((W+1)*(W+1));for(let y=0;y<W;y++){let row=0;for(let x=0;x<W;x++){row+=reg[y*W+x];I[(y+1)*(W+1)+x+1]=I[y*(W+1)+x+1]+row}}
  const hw=Math.max(5,Math.min(40,Math.round(maxD*.9)));
  const frac=(x,y)=>{const x0=Math.max(0,x-hw),y0=Math.max(0,y-hw),x1=Math.min(W,x+hw+1),y1=Math.min(W,y+hw+1);return (I[y1*(W+1)+x1]-I[y0*(W+1)+x1]-I[y1*(W+1)+x0]+I[y0*(W+1)+x0])/((x1-x0)*(y1-y0))};
  const shore=[];
  for(let y=2;y<W-2;y+=2)for(let x=2;x<W-2;x+=2){const p=y*W+x;if(!reg[p]||!near(x,y))continue;if(reg[p-1]&&reg[p+1]&&reg[p-W]&&reg[p+W])continue;shore.push({x,y,f:frac(x,y)})}
  const inward=(x,y)=>{let p=y*W+x;const goal=Math.min(maxD*.5,Math.max(2,6/mpp));for(let i=0;i<40&&D[p]<goal;i++){let b=p;for(const o of [-1,1,-W,W,-W-1,-W+1,W-1,W+1]){const q2=p+o;if(q2>=0&&q2<N&&reg[q2]&&D[q2]>D[b])b=q2}if(b===p)break;p=b}return {x:p%W,y:(p/W)|0}};
  const toLL=(x,y)=>{const tx=X-1+x/256,ty=Y-1+y/256;return {lat:+(Math.atan(Math.sinh(PI*(1-2*ty/n)))/rad).toFixed(6),lng:+(tx/n*360-180).toFixed(6)}};
  const Z=[],minSep=px=>Z.every(z=>Math.hypot(z.x-px.x,z.y-px.y)*mpp>=55);
  const push=(type,pt,r)=>{if(!minSep(pt))return false;Z.push({type,x:pt.x,y:pt.y,r});return true};
  const zr=Math.max(10,Math.min(25,maxD*mpp*.35));
  if(kind==="lake"){
    const big=maxD*mpp>150||touches;
    push(big?"large":"centre",{x:argD%W,y:(argD/W)|0},Math.min(120,Math.max(20,maxD*mpp*.5)));
    const byHigh=shore.filter(s=>s.f>.6).sort((a,b)=>b.f-a.f),byLow=shore.filter(s=>s.f<.4).sort((a,b)=>a.f-b.f);
    let c1=0;for(const s of byHigh){if(c1>=3)break;if(push("pointe",inward(s.x,s.y),zr))c1++}
    let c2=0;for(const s of byLow){if(c2>=3)break;if(push("anse",inward(s.x,s.y),zr))c2++}
    const step=Math.max(4,Math.floor(shore.length/8));for(let i=0;i<shore.length&&Z.length<10;i+=step)push("bordure",inward(shore[i].x,shore[i].y),zr);
  }else{
    // rivière : extérieur des virages = berge creuse (peu d'eau autour), intérieur = berge en pointe
    const outer=shore.filter(s=>s.f<.42).sort((a,b)=>a.f-b.f),inner=shore.filter(s=>s.f>.58).sort((a,b)=>b.f-a.f);
    let c1=0;for(const s of outer){if(c1>=3)break;if(push("ext",inward(s.x,s.y),Math.max(8,widthM*.35)))c1++}
    let c2=0;for(const s of inner){if(c2>=2)break;if(push("int",inward(s.x,s.y),Math.max(8,widthM*.35)))c2++}
    const ridge=[];for(let y=3;y<W-3;y+=3)for(let x=3;x<W-3;x+=3){const p=y*W+x;if(!reg[p]||!near(x,y)||D[p]<maxD*.75)continue;ridge.push({x,y})}
    for(let i=0;i<ridge.length&&Z.length<9;i+=Math.max(1,Math.floor(ridge.length/5)))push("veine",ridge[i],Math.max(8,widthM*.3));
  }
  return {kind,milieu,areaM2:Math.round(areaM2),widthM:Math.round(widthM),touches,z,zones:Z.map((q2,i)=>{const d=AUTOZ[q2.type],ll=toLL(q2.x,q2.y);return {id:"t"+i,auto:true,type:q2.type,label:d.t,micro:d.micro,ban:!!d.ban,rayon:Math.round(q2.r||d.r),lat:ll.lat,lng:ll.lng}})};
}
function getAutoZones(spot){
  const T=tileAnalysis(spot.lat,spot.lng),O=getOsmZones(spot);
  if(T.loading&&O.loading)return {loading:true,zones:[]};
  const base=(T.zones||[]).slice(),extra=(O.zones||[]).filter(z=>["pont","confluence","ouvrage","digue","entree"].includes(z.type)||!base.length);
  const all=base.slice();extra.forEach(z=>{if(all.every(b=>distKm(b,z)*1000>25))all.push(z)});
  return {zones:all,loading:false,error:!all.length&&!!(T.error||T.none)&&!!O.error,analysis:T.kind?T:null,partial:T.loading||O.loading};
}

// Espèces probables dans une zone suggérée, avec le leurre adapté
function catchesInZone(z,spot){return S.catches.filter(k=>k.lat!=null&&(k.spot_id===spot.id||spot.temp)&&distKm(k,z)*1000<=Math.max(30,(z.rayon||25)*1.5))}
function autoZoneSpecies(z,spot,c,now){
  if(z.ban||!c)return [];
  const ctx=condCtx(now,c),inz=catchesInZone(z,spot);
  return speciesFor(spot,now,c).filter(x=>!x.closed).map(x=>{const hit=x.micro.filter(m=>z.micro.includes(m)).length;
    const w=inz.filter(k=>k.espece===x.s.id).reduce((t,k)=>t+simCatch(k,ctx),0);
    return {x,sc:Math.min(1,x.a*(hit?Math.min(1,.75+.15*hit):.3)*(1+Math.min(w,4)*.15)),here:inz.filter(k=>k.espece===x.s.id).length}}).sort((a,b)=>b.sc-a.sc).slice(0,3);
}
// Zone la plus proche d'une position (zones suggérées et zones du groupe)
function zoneAt(spot,pt){
  const A=getAutoZones(spot),list=[...(A.zones||[]).map((z,i)=>({z,label:z.label.split(" :")[0],num:i+1})),...S.zones.filter(z=>z.spot_id===spot.id).map(z=>({z,label:ZONE_TYPES[z.type]||"Zone du groupe"}))];
  let best=null;list.forEach(o=>{const d=distKm(o.z,pt)*1000;if(d<=Math.max(40,(o.z.rayon||25)*2)&&(!best||d<best.d))best={...o,d}});return best;
}
const WPX={};
function waterPixel(lat,lng){
  const k=lat.toFixed(5)+","+lng.toFixed(5);if(WPX[k]!==undefined)return Promise.resolve(WPX[k]);
  return new Promise(res=>{
    const z=17,n=2**z,xt=(lng+180)/360*n,yt=(1-Math.log(Math.tan(lat*rad)+1/Math.cos(lat*rad))/PI)/2*n;
    const X=Math.floor(xt),Y=Math.floor(yt),px=Math.floor((xt-X)*256),py=Math.floor((yt-Y)*256);
    const i=new Image();i.crossOrigin="anonymous";
    const done=v=>{clearTimeout(t);WPX[k]=v;res(v)},t=setTimeout(()=>done(null),6000);
    i.onerror=()=>done(null);
    i.onload=()=>{try{const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d");g.drawImage(i,0,0);
      const R=14,x0=Math.max(0,px-R),y0=Math.max(0,py-R),w=Math.min(256,px+R+1)-x0,h=Math.min(256,py+R+1)-y0,d=g.getImageData(x0,y0,w,h).data;
      let hit=0;for(let j=0;j<d.length;j+=4){if(Math.abs(d[j]-170)<=8&&Math.abs(d[j+1]-211)<=8&&Math.abs(d[j+2]-223)<=8)hit++}
      done(hit>=6)}catch(e){done(null)}};
    i.src=`https://tile.openstreetmap.org/${z}/${X}/${Y}.png`;
  });
}
// Décision : true = eau, false = terre, null = impossible à vérifier
async function isWater(lat,lng){
  const pxv=await waterPixel(lat,lng);
  if(pxv===true)return true;
  // carte : terre -> on attend peu la confirmation ; carte indisponible -> on attend la base de données
  const w=pxv===false?await Promise.race([waitWater(lat,lng),new Promise(r=>setTimeout(()=>r({k:null}),3500))]):await waitWater(lat,lng);
  if(w.k)return true;
  if(pxv===false&&!w.error)return false;
  if(pxv===false&&w.error)return false;
  return w.error?null:false;
}
function waitWater(lat,lng){return new Promise(res=>{const t0=Date.now();(function chk(){const w=getWaterBody(lat,lng);if(!w.loading||Date.now()-t0>16000)return res(w);setTimeout(chk,250)})()})}
function weatherAt(spot,d){
  const W=getWx(spot.lat,spot.lng);
  if(!W.hours)return null;
  const t=d.getTime();let i=W.hours.findIndex(h=>h.t>t)-1;if(i<0)i=W.hours.length-1;
  const h=W.hours[i],h3=W.hours[Math.max(0,i-3)];
  const wa=getWater(spot.lat,spot.lng);
  let water,waterSrc="estimée";
  if(wa.temp){water=wa.temp.v;waterSrc="mesurée"}
  else{const day=W.hours.filter(x=>Math.abs(x.t-t)<36*36e5);const avg=day.reduce((a,b)=>a+b.temp,0)/day.length;water=(WATER_T[d.getMonth()]*2+avg)/3}
  return {temp:h.temp,press:h.press,trend:h.press-h3.press,wind:h.wind,gust:h.gust,dir:h.dir,cloud:h.cloud,rain:h.rain>.2,rainmm:h.rain,water,waterSrc};
}
function momentOf(d,st){
  const t=d.getTime(),r=st.rise.getTime(),s=st.set.getTime(),H=36e5;
  if(Math.abs(t-r)<=1.5*H)return "aube"; if(Math.abs(t-s)<=1.5*H)return "crep";
  return t>r&&t<s?"jour":"nuit";
}
function conditions(spot,d){
  const w=weatherAt(spot,d);if(!w)return null;
  const st=sunTimes(d,spot.lat,spot.lng),sol=solunar(d,spot.lat,spot.lng),mo=moon(d),mom=momentOf(d,st);
  const near=(arr,h)=>arr.some(x=>Math.abs(x-d)<=h*36e5);
  const major=near(sol.majors,1),minor=near(sol.minors,.5);
  let s=5;const why=[];
  if(w.trend<=-.6&&w.trend>=-3){s+=1.5;why.push("pression en légère baisse")}else if(w.trend<-3){s-=.5;why.push("pression qui chute vite")}else if(w.trend>2){s-=1;why.push("pression qui monte vite")}else{s+=.5;why.push("pression stable")}
  if(w.wind>=5&&w.wind<=20){s+=1;why.push("vent léger")}else if(w.wind>30){s-=1.5;why.push("vent fort")}
  if(w.cloud>60){s+=.8;why.push("ciel couvert")}else if(w.cloud<20&&mom==="jour"){s-=.6;why.push("grand soleil")}
  if(w.rain){s-=.3;why.push("pluie")}
  if(mom==="aube"||mom==="crep"){s+=1.5;why.push(mom==="aube"?"lever du soleil":"coucher du soleil")}else if(mom==="nuit")s-=.8;
  if(major){s+=1;why.push("période solunaire majeure")}else if(minor){s+=.5;why.push("période solunaire mineure")}
  if(w.water<7||w.water>23){s-=1;why.push("eau "+(w.water<7?"froide":"chaude"))}
  return {w,st,sol,mo,mom,major,minor,score:Math.max(0,Math.min(10,Math.round(s*10)/10)),why};
}
const MILIEU={grande_riviere:"Grande rivière",petite_riviere:"Petite rivière / ruisseau",canal:"Canal",etang:"Étang",lac:"Lac / retenue",mer:"Mer / côte"};
// Adaptation de chaque espèce à chaque milieu (0 à 1)
const HABITAT=Object.fromEntries(SPECIES.map(x=>[x.id,{grande_riviere:x.hab[0],petite_riviere:x.hab[1],canal:x.hab[2],etang:x.hab[3],lac:x.hab[4],mer:x.hab[5]}]));
function milieuOf(spot){
  if(spot.milieu)return {k:spot.milieu,src:"fiche"};
  const det=spot.lat!=null&&getWaterBody(spot.lat,spot.lng);
  if(det&&det.k)return {k:det.k,src:"auto",name:det.name};
  const ta=spot.lat!=null&&(det&&(det.error||!det.loading)?tileAnalysis(spot.lat,spot.lng):TA[spot.lat.toFixed(4)+","+spot.lng.toFixed(4)]);
  if(ta&&ta.milieu)return {k:ta.milieu,src:"forme"};
  if(spot.type==="mer")return {k:"mer",src:"type"};
  if(spot.type==="etang")return {k:"etang",src:"type"};
  return {k:null,src:"inconnu"};
}
function spotMaxDepth(spot){
  let mx=null;const r=spot.prof&&parseRange(spot.prof);if(r)mx=r[1];
  S.zones.filter(z=>z.spot_id===spot.id).forEach(z=>{const v=z.prof_max!=null?+z.prof_max:z.prof_min!=null?+z.prof_min:null;if(v!=null&&(mx==null||v>mx))mx=v});
  S.depths.filter(d=>d.spot_id===spot.id).forEach(d=>{if(mx==null||+d.m>mx)mx=+d.m});
  return mx;
}
// Ressemblance entre les conditions d'une prise et celles du moment (0 à 1)
function condCtx(d,c){return {m:d.getMonth(),h:d.getHours()+d.getMinutes()/60,water:c?c.w.water:null,trend:c?c.w.trend:null,cloud:c?c.w.cloud:null,mom:c?c.mom:null}}
function simCatch(k,ctx){
  const t=new Date(k.caught_at),mt=k.meteo||{};
  let dm=Math.abs(t.getMonth()-ctx.m);dm=Math.min(dm,12-dm);
  let dh=Math.abs((mt.hour!=null?mt.hour:t.getHours()+t.getMinutes()/60)-ctx.h);dh=Math.min(dh,24-dh);
  let s=Math.exp(-((dm/1.5)**2))*Math.exp(-((dh/3)**2));
  if(mt.water!=null&&ctx.water!=null)s*=Math.exp(-(((mt.water-ctx.water)/4)**2));else s*=.85;
  if(mt.trend!=null&&ctx.trend!=null)s*=Math.sign(Math.round(mt.trend))===Math.sign(Math.round(ctx.trend))?1:.8;
  if(mt.cloud!=null&&ctx.cloud!=null)s*=(mt.cloud>60)===(ctx.cloud>60)?1:.85;
  return s;
}
function localCatches(spot){
  return spot.temp?S.catches.filter(k=>{const sp=spotById(k.spot_id),pt=k.lat!=null?k:sp;return pt&&distKm(pt,spot)<1}):S.catches.filter(k=>k.spot_id===spot.id);
}
function speciesFor(spot,d,c){
  const m=d.getMonth(),mil=milieuOf(spot),mer=mil.k==="mer"||spot.type==="mer";
  const mx=spotMaxDepth(spot),local=localCatches(spot),ctx=condCtx(d,c);
  const byEsp={};local.forEach(k=>{k._sim=simCatch(k,ctx);(byEsp[k.espece]=byEsp[k.espece]||[]).push(k)});
  return SPECIES.filter(s=>{const h=mil.k?HABITAT[s.id][mil.k]:mer?s.hab[5]:Math.max(...s.hab.slice(0,5));return h>=.15||byEsp[s.id]}).filter(s=>s.id!=="truite"||spot.cat==="1"||mil.k==="petite_riviere"||byEsp.truite).map(s=>{
    const why=[];let a=s.mois[m];
    why.push(a>=.8?"pleine saison":a>=.5?"saison correcte":"hors saison");
    a*=s.moment[c.mom];if(s.moment[c.mom]>=.9)why.push(c.mom==="nuit"?"actif la nuit":c.mom==="jour"?"actif en journée":"heure idéale");else if(s.moment[c.mom]<.4)why.push("peu actif à cette heure");
    const wt=c.w.water;
    if(wt<s.t[0]){a*=Math.max(.25,1-(s.t[0]-wt)*.12);why.push("eau trop froide pour lui")}else if(wt>s.t[1]){a*=Math.max(.25,1-(wt-s.t[1])*.12);why.push("eau trop chaude pour lui")}else why.push(`eau à ${wt.toFixed(0)} °C idéale`);
    if(c.w.cloud>60&&s.nuage>1.05){a*=s.nuage;why.push("aime le ciel couvert")}else if(c.w.cloud>60)a*=s.nuage;
    if(c.major)a*=1.15;
    let hab=mer&&!mil.k?s.hab[5]:.7;
    if(mil.k){hab=HABITAT[s.id][mil.k];why.push(hab>=.85?`milieu idéal (${MILIEU[mil.k].toLowerCase()})`:hab<=.3?`rare en ${MILIEU[mil.k].toLowerCase()}`:`présent en ${MILIEU[mil.k].toLowerCase()}`)}
    const caught=byEsp[s.id]||[];
    const simSum=caught.reduce((t,k)=>t+k._sim,0),similar=caught.filter(k=>k._sim>=.5).length;
    if(caught.length){hab=Math.max(hab,.85);why.push(`${caught.length} prise${caught.length>1?"s":""} ${spot.temp?"dans le secteur":"ici"}${similar?`, dont ${similar} dans des conditions proches`:""}`)}
    a*=hab*(1+Math.min(caught.length,10)*.03+Math.min(simSum,6)*.12);
    if(s.id==="truite"&&spot.cat!=="1")why.push("seulement si le cours d'eau est en 1re catégorie");
    let prof=s.prof[wt<10?"froid":wt<18?"doux":"chaud"];
    if(mil.k==="petite_riviere")prof="0,3 à 1,5 m : trous, sous-berges, aval des radiers";
    const r=parseRange(prof);
    if(mx!=null&&r&&r[0]>mx)prof=`Le plus profond du spot (environ ${mx} m), conseillé ${r[0]} m et plus`;
    let leurres=s.leurres.slice();
    if(mil.k==="petite_riviere"&&!["carpe","gardon"].includes(s.id))leurres=leurres.map(l=>l.replace(/\d+-?\d* cm/,"plus petit (3-7 cm)"));
    const lc={};caught.forEach(k=>{if(k.leurre)lc[k.leurre]=(lc[k.leurre]||0)+.3+k._sim});
    const topLure=Object.entries(lc).sort((x,y)=>y[1]-x[1])[0];
    if(topLure)leurres.unshift("★ "+topLure[0]+(caught.some(k=>k.leurre===topLure[0]&&k._sim>=.5)?" (a marché ici dans des conditions proches)":" (a marché ici)"));
    return {s,a:Math.min(1,a),closed:s.closed(m),prof,why,leurres,caught:caught.length,micro:s.micro};
  }).sort((x,y)=>y.a-x.a);
}
const lureColor=c=>c.mom==="nuit"||c.mom==="crep"?"foncé (noir, violet) ou très contrasté":c.w.cloud>60||c.w.rain?"vif (chartreuse, firetiger, blanc)":"naturel (gardon, perche, ablette)";
const windDir=d=>["N","NE","E","SE","S","SO","O","NO"][Math.round(d/45)%8];

/* ================= État ================= */
const S={zl:{auto:true,mine:true},zones:[],spotPhotos:[],zoneAdd:false,user:null,me:null,profiles:{},spots:[],catches:[],messages:[],depths:[],gear:{},licence:null,tab:"carte",
  catchFilter:"tous",viewProfile:null,addMode:false,layers:{base:"sat",routes:true,float:false},pos:null,sheet:null,pending:0,recovery:false};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hhmm=d=>new Date(d).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const dateFr=t=>new Date(t).toLocaleString("fr-FR",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
const pseudo=u=>(S.profiles[u]&&S.profiles[u].pseudo)||"Pêcheur";
const spotById=id=>S.spots.find(s=>s.id===id)||(S.tempSpot&&S.tempSpot.id===id?S.tempSpot:null);
const waze=s=>`https://waze.com/ul?ll=${s.lat},${s.lng}&navigate=yes`;
const gmaps=s=>`https://www.google.com/maps/@?api=1&map_action=map&center=${s.lat},${s.lng}&zoom=17&basemap=satellite`;
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>el.hidden=true,2600)}
const distKm=(a,b)=>Math.hypot((a.lat-b.lat)*111,(a.lng-b.lng)*111*Math.cos(a.lat*rad));

/* Photos (URL signées) */
const URLS={},URLQ=new Set();let urlTimer=null;
function photo(path,bucket="peche-photos"){
  if(!path)return "";
  const k=bucket+"|"+path,c=URLS[k];
  if(c&&c.exp>Date.now())return c.url;
  if(!URLQ.has(k)){URLQ.add(k);clearTimeout(urlTimer);urlTimer=setTimeout(flushUrls,30)}
  return "";
}
async function flushUrls(){
  const by={};URLQ.forEach(k=>{const [b,p]=k.split("|");(by[b]=by[b]||[]).push(p)});URLQ.clear();
  for(const b in by){
    const {data}=await sb.storage.from(b).createSignedUrls(by[b],3600);
    (data||[]).forEach(d=>{if(d.signedUrl)URLS[b+"|"+d.path]={url:d.signedUrl,exp:Date.now()+50*60e3}});
  }
  scheduleRender();
}
const img=(path,cls,alt,bucket)=>{const u=photo(path,bucket);return u?`<img class="${cls}" src="${esc(u)}" alt="${esc(alt||"")}" loading="lazy">`:`<div class="${cls} ph">${path?"…":esc(alt||"Pas de photo")}</div>`};
const avatar=(u,lg)=>{const p=S.profiles[u],url=p&&photo(p.photo_path);return url?`<img class="avatar${lg?" lg":""}" src="${esc(url)}" alt="">`:`<div class="avatar${lg?" lg":""}">${esc((pseudo(u)[0]||"?").toUpperCase())}</div>`};

async function readExif(file){
  try{const buf=await file.slice(0,512*1024).arrayBuffer(),v=new DataView(buf);if(v.getUint16(0)!==0xFFD8)return null;let o=2;
    while(o<v.byteLength-10){const mk=v.getUint16(o),len=v.getUint16(o+2);if(mk===0xFFE1&&v.getUint32(o+4)===0x45786966)return parseTiff(v,o+10);if((mk&0xFF00)!==0xFF00)break;o+=2+len}
  }catch(e){}return null;
}
function parseTiff(v,t){
  const le=v.getUint16(t)===0x4949,u16=a=>v.getUint16(a,le),u32=a=>v.getUint32(a,le);
  const ifd=off=>{const n=u16(t+off),e={};for(let i=0;i<n;i++){const p=t+off+2+i*12;e[u16(p)]={count:u32(p+4),voff:p+8}}return e};
  const rat=a=>{const d=u32(t+a+4);return d?u32(t+a)/d:0};
  const str=en=>{const off=en.count>4?t+u32(en.voff):en.voff;let r="";for(let i=0;i<en.count-1;i++)r+=String.fromCharCode(v.getUint8(off+i));return r};
  const out={},i0=ifd(u32(t+4));
  const dEnt=i0[0x8769]?(()=>{const ex=ifd(u32(i0[0x8769].voff));return ex[0x9003]||ex[0x9004]})():null;
  const dt=dEnt||i0[0x0132];if(dt){const m=str(dt).match(/(\d{4}):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/);if(m)out.date=new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5],+m[6])}
  if(i0[0x8825]){const gp=ifd(u32(i0[0x8825].voff)),tri=en=>{const a=u32(en.voff);return rat(a)+rat(a+8)/60+rat(a+16)/3600};
    if(gp[2]&&gp[4]){let la=tri(gp[2]),ln=tri(gp[4]);if(gp[1]&&String.fromCharCode(v.getUint8(gp[1].voff))==="S")la=-la;if(gp[3]&&String.fromCharCode(v.getUint8(gp[3].voff))==="W")ln=-ln;
      if(isFinite(la)&&isFinite(ln)&&(la||ln)){out.lat=+la.toFixed(6);out.lng=+ln.toFixed(6)}}}
  return out;
}
const localISO=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,16)};
async function histWeather(spot,when){
  const day=x=>x.toISOString().slice(0,10),prev=new Date(when.getTime()-dayMs);
  const j=await fetchJSON(`https://api.open-meteo.com/v1/forecast?latitude=${spot.lat.toFixed(3)}&longitude=${spot.lng.toFixed(3)}&hourly=temperature_2m,pressure_msl,wind_speed_10m,cloud_cover,precipitation&timezone=GMT&start_date=${day(prev)}&end_date=${day(when)}`);
  const h=j.hourly,ts=h.time.map(x=>new Date(x+"Z").getTime());let i=ts.findIndex(x=>x>when.getTime())-1;if(i<0)i=ts.length-1;const i3=Math.max(0,i-3);
  const avg=h.temperature_2m.slice(Math.max(0,i-24),i+1).reduce((a,b)=>a+b,0)/Math.min(25,i+1);
  return {temp:h.temperature_2m[i],press:h.pressure_msl[i],trend:h.pressure_msl[i]-h.pressure_msl[i3],wind:h.wind_speed_10m[i],cloud:h.cloud_cover[i],rainmm:h.precipitation[i],water:(WATER_T[when.getMonth()]*2+avg)/3};
}
async function compress(file,max=1280,q=.78){
  let src;
  try{src=await createImageBitmap(file)}catch(e){
    src=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=r.result};r.readAsDataURL(file)});
  }
  const k=Math.min(1,max/Math.max(src.width,src.height)),c=document.createElement("canvas");
  c.width=Math.round(src.width*k);c.height=Math.round(src.height*k);
  c.getContext("2d").drawImage(src,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(r,"image/jpeg",q)); // redessiner supprime les données GPS cachées
}
async function upload(blob,bucket="peche-photos",prefix=""){
  const path=`${S.user.id}/${prefix}${crypto.randomUUID()}.jpg`;
  const {error}=await sb.storage.from(bucket).upload(path,blob,{contentType:"image/jpeg"});
  if(error)throw error;return path;
}

/* File d'attente hors réseau (IndexedDB) */
const idb={
  open(){return this.p||(this.p=new Promise((res,rej)=>{const r=indexedDB.open("coupdusoir",1);r.onupgradeneeded=()=>r.result.createObjectStore("queue",{keyPath:"k",autoIncrement:true});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}))},
  async tx(mode,fn){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction("queue",mode),st=t.objectStore("queue"),r=fn(st);t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)})},
  add(v){return this.tx("readwrite",s=>s.add(v))},all(){return this.tx("readonly",s=>s.getAll())},del(k){return this.tx("readwrite",s=>s.delete(k))}
};
async function countPending(){try{S.pending=(await idb.all()).filter(x=>x.uid===S.user?.id).length}catch(e){S.pending=0}updateNet()}
let syncing=false;
async function syncQueue(){
  if(syncing||!navigator.onLine||!S.user)return;syncing=true;
  try{
    const items=(await idb.all()).filter(x=>x.uid===S.user.id);
    for(const it of items){
      try{
        const row={...it.row};
        if(it.blob)row.photo_path=await upload(it.blob);
        const {error}=await sb.from("peche_catches").insert(row);if(error)throw error;
        await idb.del(it.k);
      }catch(e){console.warn("sync",e);break}
    }
    if(items.length){await loadCatches();toast("Prises hors réseau envoyées")}
  }finally{syncing=false;countPending()}
}
function updateNet(){const n=document.getElementById("net");if(!n)return;
  const off=!navigator.onLine;n.className="net"+(off?" off":"");
  n.textContent=off?"Hors réseau":S.pending?S.pending+" prise(s) en attente":"";}
addEventListener("online",()=>{updateNet();syncQueue()});addEventListener("offline",updateNet);

/* ================= Données ================= */
async function loadAll(){
  await Promise.all([loadProfiles(),loadSpots(),loadCatches(),loadMessages(),loadDepths(),loadGear(S.user.id),loadLicence(),loadZones(),loadSpotPhotos()]);
}
async function loadProfiles(){const {data}=await sb.from("peche_profiles").select("*");S.profiles=Object.fromEntries((data||[]).map(p=>[p.id,p]));S.me=S.profiles[S.user.id]||null;scheduleRender()}
async function loadSpots(){const {data}=await sb.from("peche_spots").select("*").order("created_at");if(data){S.spots=data;drawSpots()}scheduleRender()}
async function loadCatches(){const {data}=await sb.from("peche_catches").select("*").order("caught_at",{ascending:false}).limit(400);if(data)S.catches=data;scheduleRender()}
async function loadMessages(){const {data}=await sb.from("peche_messages").select("*").order("created_at",{ascending:false}).limit(200);if(data)S.messages=data.reverse();scheduleRender()}
async function loadDepths(){const {data}=await sb.from("peche_depths").select("*").order("created_at");if(data)S.depths=data;scheduleRender()}
async function loadGear(u){const {data}=await sb.from("peche_gear").select("*").eq("owner",u).order("created_at");if(data)S.gear[u]=data;scheduleRender()}
async function loadZones(){const {data}=await sb.from("peche_zones").select("*").order("created_at");if(data)S.zones=data;scheduleRender()}
async function loadSpotPhotos(){const {data}=await sb.from("peche_spot_photos").select("*").order("created_at",{ascending:false});if(data)S.spotPhotos=data;scheduleRender()}
const COMMONS={};
function getCommons(spot){
  const k=spot.lat.toFixed(3)+","+spot.lng.toFixed(3);if(COMMONS[k])return COMMONS[k];
  COMMONS[k]={loading:true,items:[]};
  (async()=>{try{
    const j=await fetchJSON(`https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${spot.lat}|${spot.lng}&ggsradius=2500&ggsnamespace=6&ggslimit=15&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&format=json&origin=*`);
    const strip=h=>String(h||"").replace(/<[^>]*>/g,"").trim();
    COMMONS[k].items=Object.values((j.query&&j.query.pages)||{}).map(p=>{const i=p.imageinfo&&p.imageinfo[0];if(!i||!i.thumburl)return null;const m=i.extmetadata||{};
      if(!/\.(jpe?g|png|webp)$/i.test(p.title))return null;
      return {thumb:i.thumburl,page:i.descriptionurl,title:strip(p.title).replace(/^File:|^Fichier:/,"").replace(/\.[a-z]+$/i,""),author:strip(m.Artist&&m.Artist.value),lic:strip(m.LicenseShortName&&m.LicenseShortName.value)}}).filter(Boolean);
  }catch(e){COMMONS[k].error=true}COMMONS[k].loading=false;scheduleRender()})();
  return COMMONS[k];
}
async function loadLicence(){const {data}=await sb.from("peche_licences").select("*").eq("owner",S.user.id).maybeSingle();S.licence=data||null;scheduleRender()}
let channel=null;
function subscribe(){
  if(channel)sb.removeChannel(channel);
  channel=sb.channel("peche")
    .on("postgres_changes",{event:"*",schema:"public",table:"peche_messages"},()=>loadMessages())
    .on("postgres_changes",{event:"*",schema:"public",table:"peche_catches"},()=>loadCatches())
    .subscribe();
}

/* ================= Carte (Leaflet + IGN) ================= */
let map,baseLayers,roadLayer,spotLayer,meMarker,tempMarker;
const ign=(layer,fmt)=>`https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=normal&TILEMATRIXSET=PM&FORMAT=${fmt}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;
function initMap(){
  if(map)return;
  map=L.map("map",{zoomControl:true,attributionControl:true}).setView([47.93,-1.86],11);
  baseLayers={
    sat:L.tileLayer(ign("ORTHOIMAGERY.ORTHOPHOTOS","image/jpeg"),{maxZoom:20,maxNativeZoom:19,attribution:"© IGN Géoplateforme"}),
    plan:L.tileLayer(ign("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2","image/png"),{maxZoom:20,maxNativeZoom:18,attribution:"© IGN Géoplateforme"}),
    osm:L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"})
  };
  roadLayer=L.tileLayer(ign("TRANSPORTNETWORKS.ROADS","image/png"),{maxZoom:20,maxNativeZoom:18,opacity:.95});
  baseLayers[S.layers.base].addTo(map); if(S.layers.routes&&S.layers.base==="sat")roadLayer.addTo(map);
  spotLayer=L.layerGroup().addTo(map);
  map.on("click",e=>{
    const {lat,lng}=e.latlng;
    if(S.addMode){S.addMode=false;document.getElementById("map").classList.remove("adding");openSheet("spotForm",{lat:+lat.toFixed(5),lng:+lng.toFixed(5)});render();
      isWater(+lat.toFixed(5),+lng.toFixed(5)).then(ok=>{if(ok===false)toast("Attention : ce point n'est pas sur l'eau. Place le spot au bord ou sur l'eau.")});return}
    const la=+lat.toFixed(5),ln=+lng.toFixed(5),req=Symbol();map._waterReq=req;
    if(tempMarker)tempMarker.remove();
    tempMarker=L.circleMarker([lat,lng],{radius:9,color:"#fff",weight:3,fillColor:"#8A968E",fillOpacity:1}).addTo(map);
    getWaterBody(la,ln);
    isWater(la,ln).then(ok=>{
      if(map._waterReq!==req)return;
      if(ok===false){toast("Pas de point d'eau ici : touche directement la rivière ou l'étang");if(tempMarker){tempMarker.remove();tempMarker=null}return}
      if(ok===null)toast("Vérification impossible pour l'instant : choisis le type de point d'eau dans la fiche");
      tempMarker.setStyle({fillColor:"#16231C"});
      const w=getWaterBody(la,ln);
      S.tempSpot={id:"temp",nom:w.name||"Point d'eau sélectionné",type:w.k==="mer"?"mer":["etang","lac"].includes(w.k)?"etang":"riviere",lat:la,lng:ln,statut:"ok",float:"unk",cat:"2",temp:true};
      openSheet("spot",{id:"temp"});
    });
  });
  drawSpots();
}
function setBase(b){S.layers.base=b;Object.values(baseLayers).forEach(l=>map.removeLayer(l));baseLayers[b].addTo(map);
  if(roadLayer){map.removeLayer(roadLayer);if(S.layers.routes&&b==="sat")roadLayer.addTo(map)}}
function drawSpots(){
  if(!spotLayer)return;spotLayer.clearLayers();
  S.spots.forEach(s=>{
    const st=STATUT[s.statut]||STATUT.ok;
    if(S.layers.float){const f=FLOAT[s.float]||FLOAT.unk;L.circleMarker([s.lat,s.lng],{radius:15,color:f.col,weight:4,fill:false,dashArray:s.float==="unk"?"4 4":null,interactive:false}).addTo(spotLayer)}
    const m=L.circleMarker([s.lat,s.lng],{radius:10,color:"#fff",weight:3,fillColor:st.col,fillOpacity:1}).addTo(spotLayer);
    m.bindTooltip(esc(s.nom)+(s.prive?" (privé)":""),{direction:"top",offset:[0,-8]});
    m.on("click",ev=>{L.DomEvent.stopPropagation(ev);openSheet("spot",{id:s.id})});
  });
}
function locate(center=true){
  if(!navigator.geolocation){toast("La localisation n'est pas disponible sur cet appareil");return}
  navigator.geolocation.getCurrentPosition(p=>{
    S.pos={lat:p.coords.latitude,lng:p.coords.longitude};
    if(map){if(meMarker)meMarker.remove();meMarker=L.circleMarker([S.pos.lat,S.pos.lng],{radius:8,color:"#fff",weight:3,fillColor:"#2F7FD0",fillOpacity:1}).addTo(map).bindTooltip("Moi");
      if(center)map.setView([S.pos.lat,S.pos.lng],14)}
    scheduleRender();
  },()=>toast("Autorise la localisation pour te situer sur la carte"),{enableHighAccuracy:true,timeout:10000});
}

/* ================= Rendu ================= */
let rq=null;
function scheduleRender(){if(rq)return;rq=requestAnimationFrame(()=>{rq=null;render()})}
function render(){
  const v=document.getElementById("view"),ae=document.activeElement;
  if(!S.user){renderAuth();return}
  if(S.recovery){renderRecovery();return}
  if(!S.me){renderOnboarding();return}
  document.getElementById("tabs").hidden=false;
  document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===S.tab?"page":"false"));
  document.getElementById("mapwrap").hidden=S.tab!=="carte";
  if(S.tab==="carte"){initMap();setTimeout(()=>map.invalidateSize(),0)}
  const busy=ae&&v.contains(ae)&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName);
  if(!busy)v.innerHTML=({carte:viewCarte,prises:viewPrises,chat:viewChat,licence:viewLicence,profils:viewProfils})[S.tab]();
  const comp=document.getElementById("composer");
  if(S.tab!=="chat")comp.innerHTML="";
  else if(!document.getElementById("msg-in"))comp.innerHTML=`<div class="composer"><div class="in"><input id="msg-in" placeholder="Écris un message" aria-label="Message" autocomplete="off" enterkeyhint="send"><button class="btn primary" data-act="send">Envoyer</button></div></div>`;
  if(S.tab==="chat"&&S.messages.length!==render.lastN){render.lastN=S.messages.length;requestAnimationFrame(()=>scrollTo(0,document.body.scrollHeight))}
  renderSheet();updateNet();
}

/* ---- Connexion ---- */
function renderAuth(){
  document.getElementById("tabs").hidden=true;document.getElementById("mapwrap").hidden=true;
  const m=S.authMode||"login";
  document.getElementById("view").innerHTML=`<div class="auth stack">
    <p class="muted" style="text-align:center;margin:0">Spots, conditions, prises et discussion entre amis pêcheurs.</p>
    <div class="seg" role="group"><button data-auth="login" aria-pressed="${m==="login"}">Se connecter</button><button data-auth="signup" aria-pressed="${m==="signup"}">Créer un compte</button></div>
    <form class="panel stack" id="auth-form">
      <label class="f">E-mail<input id="a-mail" type="email" autocomplete="email" required></label>
      ${m!=="forgot"?`<label class="f">Mot de passe<input id="a-pass" type="password" autocomplete="${m==="signup"?"new-password":"current-password"}" minlength="8" required></label>`:""}
      <button class="btn primary" type="submit">${m==="signup"?"Créer mon compte":m==="forgot"?"Recevoir un lien":"Se connecter"}</button>
      ${m==="login"?`<button class="btn sm" type="button" data-auth="forgot">Mot de passe oublié</button>`:""}
      ${m==="forgot"?`<button class="btn sm" type="button" data-auth="login">Retour</button>`:""}
      ${m==="signup"?`<p class="small muted" style="margin:0">Au moins 8 caractères. Tu recevras un e-mail pour confirmer ton adresse, puis tu pourras te connecter.</p>`:""}
    </form></div>`;
}
function renderRecovery(){
  document.getElementById("tabs").hidden=true;document.getElementById("mapwrap").hidden=true;
  document.getElementById("view").innerHTML=`<form class="auth panel stack" id="recovery-form"><h2 style="margin:0">Nouveau mot de passe</h2>
    <label class="f">Mot de passe<input id="r-pass" type="password" minlength="8" autocomplete="new-password" required></label>
    <button class="btn primary" type="submit">Enregistrer</button></form>`;
}
function renderOnboarding(){
  document.getElementById("tabs").hidden=true;document.getElementById("mapwrap").hidden=true;
  document.getElementById("view").innerHTML=`<form class="auth panel stack" id="onboard-form"><h2 style="margin:0">Bienvenue !</h2>
    <p class="muted" style="margin:0">Choisis ton pseudo. Il sera visible par les autres pêcheurs.</p>
    <label class="f">Pseudo<input id="o-pseudo" maxlength="40" required placeholder="ex. Hugo_Carnas"></label>
    <label class="f">Région<input id="o-region" placeholder="ex. Ille-et-Vilaine"></label>
    <button class="btn primary" type="submit">C'est parti</button>
    <button class="btn sm" type="button" data-act="logout">Se déconnecter</button></form>`;
}

/* ---- Carte ---- */
function scoreFor(s){const c=conditions(s,new Date());return c}
function viewCarte(){
  const lic=licenceStatus(S.licence);
  const spots=S.spots.slice().sort((a,b)=>S.pos?distKm(S.pos,a)-distKm(S.pos,b):0);
  const list=spots.map(s=>{const c=scoreFor(s),st=STATUT[s.statut]||STATUT.ok,top=c&&speciesFor(s,new Date(),c).filter(x=>!x.closed)[0];
    return `<button class="panel spot-card" data-spot="${s.id}">
      <span class="stripe" style="background:${st.col}"></span>
      <span style="min-width:0"><b>${esc(s.nom)}</b><br><span class="small muted">${st.t}${s.statut!=="ban"&&top?" · "+top.s.nom+" actif":""}${S.pos?` · <span class="num">${distKm(S.pos,s).toFixed(1)} km</span>`:""}${s.prive?" · privé":""}${s.exemple?" · exemple":""}${S.layers.float?" · "+(FLOAT[s.float]||FLOAT.unk).t:""}</span></span>
      <span class="score num">${s.statut==="ban"?"—":c?c.score.toFixed(1):"…"}<small>${s.statut==="ban"||!c?"":"/10"}</small></span></button>`}).join("");
  return `
  ${lic.k==="exp"||lic.k==="soon"?`<div class="alert ${lic.k==="exp"?"ban":"warn"}" style="margin-top:12px">Carte de pêche : ${esc(lic.t)}. <button class="btn sm" data-tab="licence">Voir</button></div>`:""}
  ${S.addMode?`<div class="alert info" style="margin-top:10px"><b>Touche la carte</b> à l'endroit du nouveau spot. <button class="btn sm" data-act="cancel-add">Annuler</button></div>`:""}
  <div class="seg" role="group" aria-label="Fond de carte" style="margin-top:10px">
    <button data-base="sat" aria-pressed="${S.layers.base==="sat"}">Satellite</button>
    <button data-base="plan" aria-pressed="${S.layers.base==="plan"}">Plan IGN</button>
    <button data-layer="routes" aria-pressed="${S.layers.routes}" ${S.layers.base!=="sat"?"disabled":""}>Routes</button>
    <button data-layer="float" aria-pressed="${S.layers.float}">Float tube</button>
  </div>
  <div class="row small" style="margin-top:10px;gap:6px">
    ${S.layers.float?Object.values(FLOAT).map(f=>`<span class="chip ${f.c}"><span class="dot" style="background:${f.col}"></span>${f.t.replace("Float tube ","").replace(": ","")}</span>`).join(""):Object.values(STATUT).map(f=>`<span class="chip ${f.c}"><span class="dot" style="background:${f.col}"></span>${f.t}</span>`).join("")}
  </div>
  <p class="small muted" style="margin:8px 0 0">Touche n'importe quel point d'eau sur la carte pour voir ses conditions et l'itinéraire Waze.</p>
  <div class="grid2" style="margin-top:12px"><button class="btn primary" data-act="add-spot">+ Ajouter un spot</button><button class="btn" data-act="new-catch">+ Nouvelle prise</button></div>
  <h3>Indice de pêche maintenant · <span class="num">${hhmm(new Date())}</span></h3>
  <div class="stack">${list||`<div class="empty"><b>Aucun spot pour l'instant</b>Touche « Ajouter un spot » puis l'endroit sur la carte, ou touche directement un point d'eau pour voir ses conditions.</div>`}</div>
  <p class="small muted" style="margin-top:16px">Météo Open-Meteo, niveaux et températures d'eau Hub'Eau, fonds de carte IGN. Les statuts des spots sont renseignés par le groupe : vérifie toujours la réglementation de ta fédération.</p>`;
}

function spotSheet(id){
  const s=spotById(id);if(!s)return "";
  const sub=S.spotTab||"cond",now=new Date(),c=conditions(s,now),st=STATUT[s.statut]||STATUT.ok,wa=getWater(s.lat,s.lng),W=getWx(s.lat,s.lng);
  const catches=S.catches.filter(x=>x.spot_id===id),depths=S.depths.filter(x=>x.spot_id===id);
  const zones=S.zones.filter(z=>z.spot_id===id),sphotos=S.spotPhotos.filter(x=>x.spot_id===id);
  const tabs=[["cond","Conditions"],["conseils","Conseils"],["zones","Zones et poissons"]].concat(s.temp?[]:[["photos","Photos"]]).concat([["regle","Réglementation"]]).concat(s.temp?[]:[["prises","Prises ("+catches.length+")"]]);
  let body="";
  if(sub==="zones"){
    const ranked=zones.map(z=>({z,r:zoneScore(z,s,c,now)})).sort((a,b)=>(b.r?b.r.score:-1)-(a.r?a.r.score:-1));
    const ptsCatch=catches.filter(k=>k.lat!=null).length,AZs=getAutoZones(s),auto=AZs.zones||[];
    const spp=c?speciesFor(s,now,c):[];
    const autoSp=auto.map(z=>autoZoneSpecies(z,s,c,now));
    // pour chaque espèce, la meilleure zone suggérée
    const whereFor=x=>{let best=null;auto.forEach((z,i)=>{if(z.ban)return;const hit=x.micro.filter(m=>z.micro.includes(m)).length;if(hit&&(!best||hit>best.hit))best={i,hit,z}});return best};
    body=`${S.zoneAdd?`<div class="alert info" style="margin-bottom:10px"><b>Touche la carte</b> à l'endroit de la zone. <button class="btn sm" data-act="zone-cancel">Annuler</button></div>`:""}
    <div class="seg" role="group" style="margin-bottom:10px"><button data-zl="auto" aria-pressed="${S.zl.auto}">Zones suggérées${auto.length?" ("+auto.length+")":""}</button><button data-zl="mine" aria-pressed="${S.zl.mine}">Nos zones (${zones.length})</button></div>
    <div id="zonemap" style="height:min(52vh,380px);border-radius:12px;border:1px solid var(--line)"></div>
    <div class="row small" style="margin-top:8px;gap:6px"><span class="chip ok"><span class="dot" style="background:#2E7D4F"></span>Fort potentiel</span><span class="chip warn"><span class="dot" style="background:#C07A00"></span>Moyen</span><span class="chip ghost"><span class="dot" style="background:#8A968E"></span>Faible</span><span class="chip ban"><span class="dot" style="background:#C2362B"></span>Interdit</span><span class="chip ghost"><span class="dot" style="background:#2F7FD0"></span>Prises (${ptsCatch})</span></div>
    ${s.temp?`<p class="small muted">Crée un spot ici pour ajouter vos propres zones.</p>`:`<button class="btn primary wide" style="margin-top:12px" data-act="zone-add">+ Ajouter une zone</button>`}
    ${(()=>{if(!c)return "";const cands=[];auto.forEach((z,i)=>{if(z.ban)return;const t=autoZoneSpecies(z,s,c,now)[0];if(t)cands.push({sc:t.sc,txt:`zone ${i+1} (${esc(z.label.split(" :")[0].toLowerCase())})`,t})});
      ranked.forEach(({z,r})=>{if(r)cands.push({sc:r.score/10,txt:`votre zone « ${esc(ZONE_TYPES[z.type]||"zone")} »`,t:{x:r.sp,here:r.catches}})});
      const b=cands.sort((x,y)=>y.sc-x.sc)[0];if(!b)return "";
      const an=AZs.analysis;
      return `<div class="panel" style="margin-top:12px;border-color:var(--accent)"><div class="lbl">Le meilleur endroit maintenant</div>
        <p style="margin:6px 0 0"><b>${b.txt}</b> : ${esc(b.t.x.s.nom)} avec ${esc(b.t.x.leurres[0])}, ${esc(b.t.x.prof)}.${b.t.here?` <b>${b.t.here}</b> prise${b.t.here>1?"s":""} déjà faite${b.t.here>1?"s":""} ici.`:""}</p>
        ${an?`<p class="small muted" style="margin:6px 0 0">Analyse du plan d'eau : ${an.kind==="river"?"cours d'eau d'environ "+an.widthM+" m de large":(an.touches?"grand plan d'eau":"plan d'eau d'environ "+(an.areaM2>=10000?(an.areaM2/10000).toFixed(1)+" ha":Math.round(an.areaM2)+" m²"))}, ${auto.length} zones repérées.</p>`:""}</div>`})()}
    ${AZs.loading?`<div class="alert info" style="margin-top:12px">Analyse de la forme du plan d'eau…</div>`:AZs.error?`<div class="alert warn" style="margin-top:12px">Analyse impossible pour l'instant (réseau ou service OpenStreetMap occupé). Réessaie dans un moment.</div>`:!auto.length?`<div class="alert warn" style="margin-top:12px">Aucune forme d'eau trouvée ici dans OpenStreetMap : touche plus près de l'eau, ou placez vos zones vous-mêmes.</div>`:""}
    ${c?`<h3>Où chercher chaque poisson maintenant</h3>
    <div class="stack" style="gap:8px">${spp.map(x=>{const wz=whereFor(x);return `<div class="panel sp" style="padding:12px${x.closed?";opacity:.55":""}">
      <b>${esc(x.s.nom)} <span class="muted small" style="font-weight:400">${esc(x.s.cat)}</span>${x.closed?' <span class="chip ban">Fermé</span>':""}</b><span class="num small">${Math.round(x.a*100)} %</span>
      <div class="meter"><i style="width:${Math.round(x.a*100)}%"></i></div>
      <div style="grid-column:1/-1" class="small"><span class="lbl">Où</span> ${wz?`<b>zone ${wz.i+1}</b> (${esc(wz.z.label.split(" :")[0].toLowerCase())}) · `:""}${esc(x.micro.slice(0,3).map(m=>MICRO[m]).join(", "))}</div>
      <div style="grid-column:1/-1" class="small"><span class="lbl">Leurre</span> ${esc(x.leurres.slice(0,2).join(" ou "))}</div>
      <div style="grid-column:1/-1" class="small"><span class="lbl">Profondeur</span> ${esc(x.prof)}</div></div>`}).join("")}</div>
    <p class="small muted">${spp.length} espèces possibles dans ce milieu. L'activité est une estimation (saison, heure, météo, température de l'eau, milieu, vos prises), pas une garantie de touche.</p>`:""}
    ${auto.length?`<h3>Zones suggérées</h3><div class="stack">${auto.map((z,i)=>{const top=autoSp[i];return `<div class="panel" style="${z.ban?"border-color:var(--ban)":""}">
      <div class="ttl"><b><span class="chip ${z.ban?"ban":"ghost"} num">${i+1}</span> ${esc(z.label)}</b>${top[0]?`<span class="num small">${Math.round(top[0].sc*100)} %</span>`:""}</div>
      ${z.ban?`<p class="small" style="margin:6px 0 0">Ne pêche pas à proximité immédiate de l'ouvrage (distance fixée par arrêté).</p>`:`<div class="stack small" style="margin-top:8px;gap:6px">${top.map(t=>`<div><b>${esc(t.x.s.nom)}</b> <span class="num muted">${Math.round(t.sc*100)} %</span> · ${esc(t.x.leurres[0])} · <span class="muted">${esc(t.x.prof)}</span></div>`).join("")||'<span class="muted">Peu d\'activité en ce moment</span>'}</div>`}</div>`}).join("")}</div>
    <p class="small muted">Zones déduites de la forme du plan d'eau (OpenStreetMap) : bordures, centre, virages, ponts, confluences, arrivées d'eau, digues. La profondeur réelle n'est pas connue : confirme sur place et ajoute vos propres zones.</p>`:""}
    <h3>Nos zones</h3>
    <div class="stack">${ranked.length?ranked.map(({z,r})=>`<div class="panel sp">
      <b>${esc(ZONE_TYPES[z.type]||"Zone")}${z.prof_min!=null?` · <span class="num">${esc(z.prof_min)}${z.prof_max!=null&&+z.prof_max!==+z.prof_min?"–"+esc(z.prof_max):""} m</span>`:""}</b>
      <span class="score num" style="font-size:1.3rem">${r?r.score.toFixed(1):"…"}<small>/10</small></span>
      <div class="meter"><i style="width:${r?r.score*10:0}%"></i></div>
      <div style="grid-column:1/-1" class="small">${(z.especes||[]).length?z.especes.map(e=>`<span class="lure">${esc(SP[e]?SP[e].nom:e)}</span>`).join(" "):'<span class="muted">Toutes espèces</span>'}
        ${r?` · le plus probable maintenant : <b>${esc(r.sp.s.nom)}</b> avec ${esc(r.sp.leurres[0])} (${esc(r.sp.prof)})`:""}${r&&r.catches?` · <b>${r.catches}</b> prise${r.catches>1?"s":""} ici`:""}</div>
      ${z.note?`<div style="grid-column:1/-1" class="small muted">${esc(z.note)}</div>`:""}
      <div style="grid-column:1/-1" class="row small muted">Ajoutée par ${esc(pseudo(z.owner))}${z.owner===S.user.id?` <button class="btn sm" data-act="zone-del" data-id="${z.id}">Supprimer</button>`:""}</div></div>`).join(""):`<div class="empty"><b>Aucune zone ajoutée par le groupe</b>${s.temp?"Crée un spot ici pour en ajouter.":"Touche « Ajouter une zone » puis la carte : herbier, fosse, tombant… avec les espèces et la profondeur."}</div>`}</div>`;
  }else if(sub==="photos"){
    const cm=getCommons(s);
    body=`<div class="ttl"><h3 style="margin:0">Photos du groupe</h3><label class="btn sm primary" style="cursor:pointer">+ Ajouter<input type="file" id="sp-photos" data-spot="${s.id}" accept="image/*" multiple hidden></label></div>
    ${sphotos.length?`<div class="gal" style="margin-top:10px">${sphotos.map(x=>`<div style="position:relative">${img(x.path,"ph",x.legende||"Photo du spot")}${x.owner===S.user.id?`<button class="btn sm" style="position:absolute;top:4px;right:4px;min-height:32px;padding:0 8px" data-act="sphoto-del" data-id="${x.id}" aria-label="Supprimer">✕</button>`:""}<div class="small muted" style="margin-top:2px">${esc(pseudo(x.owner))}</div></div>`).join("")}</div>`:`<div class="empty"><b>Pas encore de photo</b>Ajoutez vos photos du plan d'eau : accès, mise à l'eau, niveau d'eau…</div>`}
    <h3>Photos libres autour du spot</h3>
    ${cm.loading?`<p class="muted">Recherche sur Wikimedia Commons…</p>`:cm.items.length?`<div class="stack">${cm.items.map(x=>`<a class="panel" href="${esc(x.page)}" target="_blank" rel="noopener" style="display:block;color:inherit;text-decoration:none;padding:0;overflow:hidden"><img src="${esc(x.thumb)}" alt="${esc(x.title)}" loading="lazy" style="display:block;width:100%"><div class="small" style="padding:8px 12px"><b>${esc(x.title)}</b><br><span class="muted">${esc(x.author||"Auteur inconnu")} · ${esc(x.lic||"Licence libre")} · Wikimedia Commons</span></div></a>`).join("")}</div>`:`<p class="muted">${cm.error?"Impossible de joindre Wikimedia Commons.":"Aucune photo libre trouvée à moins de 2,5 km."}</p>`}
    <p class="small muted">Photos sous licence libre trouvées à moins de 2,5 km. Elles peuvent montrer les environs plutôt que l'eau elle-même.</p>`;
  }
  else if(!c){body=`<div class="empty"><b>${W.error?esc(W.error):"Chargement de la météo…"}</b></div>`}
  else if(sub==="cond"){
    const hours=[...Array(12)].map((_,i)=>{const d=new Date(now);d.setMinutes(0,0,0);d.setHours(d.getHours()+i);return {d,c:conditions(s,d)}}).filter(h=>h.c);
    const best=hours.reduce((a,b)=>b.c.score>a.c.score?b:a,hours[0]);
    body=`
    ${W.error?`<div class="alert warn">${esc(W.error)}${W.stale?" Dernières données du "+dateFr(W.stale)+".":""}</div>`:""}
    <div class="panel"><div class="ttl"><div><div class="lbl">Indice de pêche</div><div class="score num" style="font-size:2.6rem">${s.statut==="ban"?"—":c.score.toFixed(1)}<small>/10</small></div></div>
      <div class="small" style="flex:1;min-width:150px">${esc(c.why.join(", "))}.</div></div>
      <div class="hours">${hours.map(h=>`<div class="h"><div class="b${h===best?" top":""}" style="height:${Math.max(6,h.c.score*9)}px"></div><span>${h.d.getHours()}h</span></div>`).join("")}</div>
      <p class="small muted" style="margin:6px 0 0">Meilleur moment : <b class="num">${best.d.getHours()}h</b> (${best.c.score.toFixed(1)}/10)</p></div>
    <div class="lbl" style="margin:16px 0 8px">Météo</div>
    <div class="kv">
      <div><span class="small muted">Air</span><b>${c.w.temp.toFixed(0)} °C</b></div>
      <div><span class="small muted">Pression</span><b>${c.w.press.toFixed(0)} hPa</b><span class="small muted">${c.w.trend>0?"+":""}${c.w.trend.toFixed(1)} en 3 h</span></div>
      <div><span class="small muted">Vent</span><b>${c.w.wind.toFixed(0)} km/h ${windDir(c.w.dir)}</b><span class="small muted">rafales ${c.w.gust.toFixed(0)}</span></div>
      <div><span class="small muted">Nuages</span><b>${Math.round(c.w.cloud)} %</b><span class="small muted">${c.w.rainmm>0?c.w.rainmm.toFixed(1)+" mm":"Sec"}</span></div>
    </div>
    <div class="lbl" style="margin:16px 0 8px">Eau</div>
    <div class="kv">
      <div><span class="small muted">Température (${c.w.waterSrc})</span><b>${c.w.water.toFixed(1)} °C</b>${wa.temp?`<span class="small muted">${esc(wa.temp.station)} · ${wa.temp.km.toFixed(0)} km · ${dateFr(wa.temp.when)}</span>`:""}</div>
      ${wa.hydro?`<div><span class="small muted">Hauteur d'eau</span><b>${wa.hydro.h!=null?wa.hydro.h.toFixed(2)+" m":"—"}</b><span class="small muted">${esc(wa.hydro.station)} · ${wa.hydro.km.toFixed(0)} km</span></div>
      <div><span class="small muted">Débit</span><b>${wa.hydro.q!=null?wa.hydro.q.toFixed(1)+" m³/s":"—"}</b><span class="small muted">${dateFr(wa.hydro.when)}</span></div>`:`<div><span class="small muted">Niveau et débit</span><b class="t">${wa.loading?"Recherche…":"Pas de station proche"}</b></div>`}
    </div>
    <div class="lbl" style="margin:16px 0 8px">Soleil et lune</div>
    <div class="kv">
      <div><span class="small muted">Lever</span><b>${hhmm(c.st.rise)}</b></div>
      <div><span class="small muted">Coucher</span><b>${hhmm(c.st.set)}</b></div>
      <div><span class="small muted">Lune</span><b class="t">${c.mo.name}</b><span class="small muted num">${Math.round(c.mo.illum*100)} % éclairée</span></div>
      <div><span class="small muted">Solunaire majeur</span><b>${c.sol.majors.map(hhmm).join(" · ")}</b></div>
      <div><span class="small muted">Solunaire mineur</span><b>${c.sol.minors.map(hhmm).join(" · ")}</b></div>
    </div>`;
  }else if(sub==="conseils"){
    const spp=speciesFor(s,now,c);
    body=`${s.statut==="ban"?`<div class="alert ban" style="margin-bottom:12px"><b>Pêche interdite ici.</b> Conseils donnés pour le secteur.</div>`:""}
    <div class="alert info">Couleur conseillée maintenant : <b>${lureColor(c)}</b>. ${c.w.water<10?"Eau froide : anime lentement, près du fond.":c.w.water>20?"Eau chaude : pêche tôt le matin et tard le soir.":"Eau tempérée : varie les vitesses d'animation."}</div>
    ${(()=>{const loc=localCatches(s);if(!loc.length)return `<div class="alert info" style="margin-top:10px">Pas encore de prise ${s.temp?"dans ce secteur":"sur ce spot"}. Chaque prise enregistrée ici rendra les conseils plus précis.</div>`;
      const cnt=f=>{const o={};loc.forEach(k=>{const v=f(k);if(v)o[v]=(o[v]||0)+1});return Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,3)};
      return `<div class="panel" style="margin-top:12px"><div class="lbl">Ce qui a marché ${s.temp?"dans le secteur":"ici"} (${loc.length} prise${loc.length>1?"s":""})</div>
        <div class="kv" style="margin-top:8px"><div><span class="small muted">Espèces</span><b class="t">${cnt(k=>SP[k.espece]?SP[k.espece].nom:k.espece).map(x=>esc(x[0])+" ("+x[1]+")").join(", ")}</b></div>
        <div><span class="small muted">Leurres</span><b class="t">${cnt(k=>k.leurre).map(x=>esc(x[0])+" ("+x[1]+")").join(", ")||"—"}</b></div>
        <div><span class="small muted">Heures</span><b class="t">${cnt(k=>new Date(k.caught_at).getHours()+"h").map(x=>x[0]+" ("+x[1]+")").join(", ")}</b></div></div></div>`})()}
    <div class="ttl"><h3>Poissons les plus actifs</h3><button class="btn sm" data-spottab="zones">Tous les poissons et où les chercher</button></div>
    <div class="stack">${spp.slice(0,6).map(x=>`<div class="panel sp"><b>${x.s.nom} ${x.closed?'<span class="chip ban">Fermé</span>':""}</b><span class="num small">${Math.round(x.a*100)} %</span>
      <div class="meter"><i style="width:${Math.round(x.a*100)}%;${x.closed?"background:var(--ban)":""}"></i></div>
      <div style="grid-column:1/-1" class="small muted">${esc(x.why.join(" · "))}</div>
      <div style="grid-column:1/-1" class="small"><span class="lbl">Profondeur</span> ${esc(x.prof)}</div>
      <div style="grid-column:1/-1" class="lures">${x.leurres.map(l=>`<span class="lure"${l.startsWith("★")?' style="border-color:var(--accent);font-weight:700"':""}>${esc(l)}</span>`).join("")}</div></div>`).join("")}</div>
    ${s.temp?"":`<h3>Profondeurs du spot</h3>
    <div class="panel stack"><div><b>${esc(s.prof||"Pas encore de description")}</b><div class="small muted">${esc(s.fond||"")}</div></div>
      ${depths.length?`<div class="stack small">${depths.map(d=>`<div>📏 <b class="num">${esc(d.m)} m</b> · ${esc(d.note||"")} <span class="muted">· ${esc(pseudo(d.owner))}</span>${d.owner===S.user.id?` <button class="btn sm" data-act="del-depth" data-id="${d.id}">✕</button>`:""}</div>`).join("")}</div>`:""}
      <div class="row"><input id="dep-m" type="number" step="0.1" min="0" inputmode="decimal" placeholder="Profondeur (m)" style="flex:1 1 120px"><input id="dep-n" placeholder="Où ? (ex. pied du pont)" style="flex:2 1 160px"></div>
      <button class="btn" data-act="add-depth" data-spot="${s.id}">Ajouter un relevé</button></div>`}`;
  }else if(sub==="regle"){
    const m=now.getMonth(),f=FLOAT[s.float]||FLOAT.unk,lic=licenceStatus(S.licence);
    body=`${s.temp?`<div class="alert warn">Point non référencé : statut de pêche inconnu. Vérifie la réglementation de ta fédération avant de pêcher.</div>`:`<div class="alert ${st.c==="ok"?"info":st.c}"><b>${st.t}</b>${s.raison?"<br>"+esc(s.raison):""}</div>`}
    <div class="kv" style="margin-top:12px"><div><span class="small muted">Catégorie</span><b>${s.cat==="1"?"1re":"2e"} catégorie</b></div><div><span class="small muted">Autorisation</span><b class="t">${esc(s.carte||"Carte de pêche AAPPMA (à vérifier)")}</b></div></div>
    <div class="panel" style="margin-top:12px"><div class="ttl"><span class="lbl">Float tube</span><span class="chip ${f.c}">${f.t}</span></div>
      <p class="small" style="margin:8px 0 4px">${esc(s.float_note||"Non renseigné")}</p>
      <p class="small muted" style="margin:0 0 8px"><b>Mise à l'eau :</b> ${esc(s.mise_eau||"À vérifier")}</p>
      ${!s.temp&&s.owner===S.user.id?`<button class="btn sm" style="margin-bottom:8px" data-act="edit-spot" data-spot="${s.id}">Indiquer si le float tube est autorisé</button>`:!s.temp?`<p class="small muted" style="margin:0 0 8px">Seul l'auteur du spot peut le modifier. Une erreur ? Utilise « Signaler » en bas de la fiche.</p>`:""}
      <p class="small muted" style="margin:0">Règles habituelles : gilet de sauvetage obligatoire, pas de float tube dans les écluses ni dans le chenal de navigation. Chaque fédération ou gestionnaire peut l'interdire sur certains parcours.</p></div>
    <div class="panel" style="margin-top:12px"><div class="ttl"><span class="lbl">Carte de pêche</span><span class="chip ${lic.c}">${esc(lic.t)}</span></div>
      <p class="small" style="margin:8px 0 10px">En eau douce, une carte AAPPMA est obligatoire. En étang privé, il faut l'accord du propriétaire. En mer, pas de carte pour la pêche de loisir, mais tailles minimales et marquage des prises obligatoires.</p>
      <a class="btn wide" href="https://www.cartedepeche.fr" target="_blank" rel="noopener">cartedepeche.fr</a></div>
    <h3>Tailles et périodes par espèce</h3>
    <div style="overflow-x:auto"><table class="reg small"><thead><tr><th>Espèce</th><th>Taille mini</th><th>Période</th></tr></thead>
      <tbody>${SPECIES.map(x=>`<tr><td><b>${x.nom}</b> ${x.closed(m)?'<span class="chip ban">Fermé</span>':""}</td><td class="num">${esc(x.legalT)}</td><td>${esc(x.ferm)}</td></tr>`).join("")}</tbody></table></div>
    <p class="small muted">Quota national en 2e catégorie : 3 carnassiers par jour et par pêcheur, dont 2 brochets maximum. Règles nationales générales ; ta fédération peut être plus stricte. Vérifie toujours la réglementation officielle.</p>`;
  }else{
    body=catches.length?`<div class="stack">${catches.map(catchCard).join("")}</div>`:`<div class="empty"><b>Aucune prise ici pour l'instant</b>Enregistre la première avec le bouton « + Prise ici ».</div>`;
  }
  return `<div class="sheet" role="dialog" aria-label="${esc(s.nom)}">
    <div class="bar"><button class="btn sm" data-act="close" aria-label="Fermer">←</button><span class="t">${esc(s.nom)}</span>${s.temp?"":`<span class="chip ${st.c}">${st.t}</span>`}</div>
    <div class="wrap" style="padding-top:14px">
      ${(()=>{const mi=milieuOf(s),wb=getWaterBody(s.lat,s.lng);const nm=s.nom_eau||(wb&&wb.name)||"";
        return `<div class="row" style="margin-bottom:8px;gap:6px">${mi.k?`<span class="chip ok">${MILIEU[mi.k]}${nm?" · "+esc(nm):""}</span><span class="small muted">${mi.src==="auto"?"reconnu automatiquement":mi.src==="forme"?"déduit de la forme du plan d'eau":mi.src==="fiche"?"d'après la fiche":"d'après le type"}</span>`:wb&&wb.loading?`<span class="chip ghost">Reconnaissance du point d'eau…</span>`:s.temp?`<span class="chip warn">Type de point d'eau inconnu</span></div><div class="row" style="gap:6px;margin-bottom:8px"><span class="small muted">C'est :</span>${Object.entries(MILIEU).map(([v,t])=>`<button class="chip ghost" style="cursor:pointer" data-milieu="${v}">${t}</button>`).join("")}${wb&&wb.error?`<button class="chip ghost" style="cursor:pointer" data-act="wb-retry" data-spot="${s.id}">↻ Réessayer</button>`:""}`:wb&&wb.error?`<span class="chip warn">Reconnaissance impossible pour l'instant</span><button class="btn sm" data-act="wb-retry" data-spot="${s.id}">Réessayer</button>`:`<span class="chip warn">Milieu non reconnu</span><span class="small muted">${s.temp?"touche plus près de l'eau":s.owner===S.user.id?"précise-le avec « Modifier le spot »":"l'auteur du spot peut le préciser"}</span>`}</div>`})()}
      <div class="small muted" style="margin-bottom:10px">${s.type==="etang"?"Plan d'eau":s.type==="mer"?"Côte":"Cours d'eau"} · <span class="num">${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}</span>${S.pos?` · <span class="num">${distKm(S.pos,s).toFixed(1)} km</span>`:""}${s.exemple?" · exemple":""}${s.prive?" · privé":""}${s.owner&&!s.exemple?" · ajouté par "+esc(pseudo(s.owner)):""}</div>
      <div class="grid2">
        <button class="btn primary" data-act="waze" data-spot="${s.id}">Y aller avec Waze</button>
        ${s.temp?`<button class="btn" data-act="spot-here">+ Créer un spot ici</button>`:`<button class="btn" data-act="new-catch" data-spot="${s.id}" ${s.statut==="ban"?"disabled":""}>+ Prise ici</button>`}
        <a class="btn" href="${gmaps(s)}" target="_blank" rel="noopener">Google Maps satellite</a>
      </div>
      <div class="seg" style="margin:16px 0" role="group">${tabs.map(([k,t])=>`<button data-spottab="${k}" aria-pressed="${k===sub}">${t}</button>`).join("")}</div>
      ${body}
      ${!s.temp&&s.owner===S.user.id?`<button class="btn primary wide" style="margin-top:20px" data-act="edit-spot" data-spot="${s.id}">Modifier le spot (float tube, statut, profondeurs…)</button><button class="btn wide" style="margin-top:12px" data-act="del-spot" data-spot="${s.id}">Supprimer ce spot</button>`:""}
      ${s.temp?"":`<button class="btn wide" style="margin-top:12px" data-act="report" data-spot="${s.id}">Signaler une erreur ou une interdiction</button>`}
    </div></div>`;
}
function wazeConfirm(id){
  const s=spotById(id);
  return `<div class="sheet" role="dialog"><div class="bar"><button class="btn sm" data-act="back-spot" data-spot="${s.id}">←</button><span class="t">Attention</span></div>
    <div class="wrap stack" style="padding-top:20px"><div class="alert ban"><b>${esc(s.nom)} : pêche interdite.</b><br>${esc(s.raison||"")}</div>
    <p style="margin:0">Tu peux y aller pour repérer ou te promener, mais ne pêche pas sur cette zone.</p>
    <a class="btn danger wide" href="${waze(s)}" target="_blank" rel="noopener">Ouvrir Waze quand même</a>
    <button class="btn wide" data-act="back-spot" data-spot="${s.id}">Retour</button></div></div>`;
}
function reportForm(id){
  const s=spotById(id);
  return `<div class="sheet" role="dialog"><div class="bar"><button class="btn sm" data-act="back-spot" data-spot="${s.id}">←</button><span class="t">Signaler</span></div>
    <form class="wrap stack" id="report-form" data-spot="${s.id}" style="padding-top:16px"><p class="muted" style="margin:0">${esc(s.nom)}</p>
    <label class="f">Qu'est-ce qui est faux ou nouveau ?<textarea id="rp-text" required placeholder="ex. Nouvel arrêté : pêche interdite jusqu'au 30 novembre"></textarea></label>
    <button class="btn primary" type="submit">Envoyer le signalement</button></form></div>`;
}

/* ---- Prises ---- */
function catchCard(x){
  const s=spotById(x.spot_id),sp=SP[x.espece],me=x.owner===S.user.id;
  return `<div class="panel catch">${img(x.photo_path,"ph",sp?sp.nom:x.espece)}
    <div class="meta"><div class="big">${esc(sp?sp.nom:x.espece)} <span class="num">${x.taille?esc(x.taille)+" cm":""}</span></div>
      <div class="small">${x.poids?`<span class="num">${esc(x.poids)} kg</span> · `:""}${esc(x.leurre||"Leurre non précisé")}${x.technique?" · "+esc(x.technique):""}</div>
      <div class="small muted">${esc(s?s.nom:"Spot supprimé")} · ${dateFr(x.caught_at)}</div>
      <div class="row small" style="margin-top:6px;gap:6px"><span class="chip ${x.relache?"ok":"ghost"}">${x.relache?"Relâché":"Gardé"}</span>
        ${x.meteo&&x.meteo.mom?`<span class="chip ghost">${{aube:"Aube",jour:"Journée",crep:"Crépuscule",nuit:"Nuit"}[x.meteo.mom]||""}</span>`:""}
        ${x.meteo&&x.meteo.temp!=null?`<span class="chip ghost num">${Math.round(x.meteo.temp)}°C · ${Math.round(x.meteo.press)} hPa${x.meteo.trend!=null?(x.meteo.trend<-.6?" ↘":x.meteo.trend>.6?" ↗":" →"):""}${x.meteo.water!=null?" · eau "+Math.round(x.meteo.water)+"°C":""}</span>`:""}
        ${x.meteo&&x.meteo.moon?`<span class="chip ghost">${esc(x.meteo.moon)}</span>`:""}
        ${x.meteo&&x.meteo.zone?`<span class="chip ok">📍 ${esc(x.meteo.zone)}</span>`:x.lat!=null?`<span class="chip ok">📍 Endroit exact</span>`:""}
        <button class="chip ghost" style="cursor:pointer" data-act="open-profile" data-uid="${x.owner}">${esc(pseudo(x.owner))}</button></div>
      ${me?`<div class="row" style="margin-top:8px"><button class="btn sm" data-act="share-catch" data-id="${x.id}">Partager</button><button class="btn sm" data-act="del-catch" data-id="${x.id}">Supprimer</button></div>`:""}
    </div></div>`;
}
function updateCatchZone(){
  const sel=document.getElementById("c-spot");if(!sel)return;const spot=spotById(sel.value),pos=S.catchPos||S.pos,box=document.getElementById("c-exif");
  if(!spot||!pos||distKm(spot,pos)>3)return;const z=zoneAt(spot,pos);
  if(z){box.hidden=false;const t=box.dataset.base||box.textContent;box.dataset.base=t;box.textContent=(t?t+" · ":"")+"Zone : "+z.label+(z.num?" (n° "+z.num+")":"")}
}
function catchForm(spotId){
  let spots=S.spots.filter(s=>s.statut!=="ban");
  if(S.pos)spots=spots.sort((a,b)=>distKm(S.pos,a)-distKm(S.pos,b));
  const sel=spotId||(spots[0]&&spots[0].id);
  const lures=(S.gear[S.user.id]||[]).filter(g=>g.type==="Leurre");
  const lic=licenceStatus(S.licence);
  return `<div class="sheet" role="dialog"><div class="bar"><button class="btn sm" data-act="close">←</button><span class="t">Nouvelle prise</span></div>
  <form class="wrap stack" id="catch-form" style="padding-top:16px">
    ${lic.k!=="ok"&&lic.k!=="soon"?`<div class="alert ${lic.k==="none"?"warn":"ban"}">${lic.k==="none"?"Tu n'as pas encore enregistré ta carte de pêche.":esc(lic.t)+"."} <button type="button" class="btn sm" data-tab="licence">Ma carte</button></div>`:""}
    <label class="f">Photo de la prise<input type="file" id="c-photo" accept="image/*" capture="environment"></label>
    <img id="c-prev" alt="" hidden style="border-radius:12px">
    <div id="c-exif" class="alert info small" hidden></div>
    <label class="f">Date et heure de la prise<input type="datetime-local" id="c-when" value="${localISO(new Date())}" max="${localISO(new Date())}"></label>
    <label class="f">Spot<select id="c-spot">${spots.map(s=>`<option value="${s.id}" ${s.id===sel?"selected":""}>${esc(s.nom)}${S.pos?" ("+distKm(S.pos,s).toFixed(1)+" km)":""}</option>`).join("")}</select></label>
    ${spots.length?"":`<div class="alert warn">Crée d'abord un spot depuis la carte.</div>`}
    <label class="row small" style="gap:8px;font-weight:700"><input type="checkbox" id="c-gps" ${S.pos?"checked":""} style="width:auto;min-height:0"><span id="c-gps-l">Enregistrer l'endroit exact de la prise (${S.pos?"position du téléphone":"en attente du GPS ou de la photo"})</span></label>
    <label class="f">Espèce<select id="c-esp">${SPECIES.map(s=>`<option value="${s.id}">${s.nom}</option>`).join("")}<option value="autre">Autre</option></select></label>
    <div class="grid2"><label class="f">Taille (cm)<input id="c-taille" type="number" inputmode="decimal" min="0" step="0.5" required></label><label class="f">Poids (kg)<input id="c-poids" type="number" inputmode="decimal" min="0" step="0.05" placeholder="Optionnel"></label></div>
    <label class="f">Leurre utilisé<input id="c-leurre" list="c-lures" placeholder="ex. Shad 10 cm chartreuse"><datalist id="c-lures">${lures.map(g=>`<option value="${esc(g.nom)}">`).join("")}</datalist></label>
    <label class="f">Technique<select id="c-tech"><option>Lancer-ramener</option><option>Verticale</option><option>Drop shot</option><option>Surface</option><option>Float tube</option><option>Pêche au coup</option><option>Carpe (posé)</option><option>Mouche</option></select></label>
    <div class="seg" role="group" aria-label="Relâché ou gardé"><button type="button" data-rel="1" aria-pressed="true">Relâché</button><button type="button" data-rel="0" aria-pressed="false">Gardé</button></div>
    <p class="small" id="c-size-warn" style="margin:0;color:var(--ban);font-weight:700"></p>
    <p class="small muted" style="margin:0">L'endroit exact, la zone, l'heure, la météo, la lune et la température de l'eau du moment de la prise sont ajoutés automatiquement : l'app s'en sert pour affiner ses conseils. Les données GPS cachées de la photo sont supprimées. Sans réseau, la prise est gardée sur le téléphone et envoyée plus tard.</p>
    <button class="btn primary wide" type="submit" id="c-save" ${spots.length?"":"disabled"}>Enregistrer la prise</button>
  </form></div>`;
}
function spotForm(lat,lng,ed){
  const e=ed||{},wb=getWaterBody(lat,lng),k=e.milieu||(wb&&wb.k),opt=(v,cur)=>v===cur?"selected":"";
  return `<div class="sheet" role="dialog"><div class="bar"><button class="btn sm" data-act="${ed?"back-spot":"close"}" ${ed?`data-spot="${ed.id}"`:""}>←</button><span class="t">${ed?"Modifier le spot":"Nouveau spot"}</span></div>
  <form class="wrap stack" id="spot-form" style="padding-top:16px" data-lat="${lat}" data-lng="${lng}" ${ed?`data-id="${ed.id}"`:""}>
    <p class="small muted num" style="margin:0">Position : ${lat}, ${lng}</p>
    <label class="f">Nom du spot<input id="s-nom" required maxlength="80" placeholder="ex. Le coin des nénuphars" value="${esc(e.nom||(wb&&wb.name)||"")}"></label>
    <fieldset class="panel stack" style="margin:0;border-color:var(--accent)"><legend class="lbl">Float tube</legend>
      <div class="seg" role="group" aria-label="Float tube">${[["ok","Autorisé"],["cond","Sous conditions"],["ban","Interdit"],["unk","À vérifier"]].map(([v,t])=>`<button type="button" data-float="${v}" aria-pressed="${(e.float||"unk")===v}">${t}</button>`).join("")}</div>
      <input type="hidden" id="s-float" value="${esc(e.float||"unk")}">
      <label class="f">Conditions<input id="s-fnote" value="${esc(e.float_note||"")}" placeholder="ex. Gilet obligatoire, hors chenal, de jour"></label>
      <label class="f">Mise à l'eau / accès<input id="s-mise" value="${esc(e.mise_eau||"")}" placeholder="ex. Cale près du parking"></label>
    </fieldset>
    <div class="grid2"><label class="f">Type<select id="s-type"><option value="riviere" ${opt("riviere",e.type)}>Cours d'eau</option><option value="etang" ${opt("etang",e.type)}>Plan d'eau / étang</option><option value="mer" ${opt("mer",e.type)}>Côte / mer</option></select></label>
    <label class="f">Catégorie<select id="s-cat"><option value="2" ${opt("2",e.cat)}>2e catégorie</option><option value="1" ${opt("1",e.cat)}>1re catégorie</option></select></label></div>
    <label class="f">Milieu${!ed&&wb&&wb.k?" (reconnu : "+MILIEU[wb.k].toLowerCase()+(wb.name?", "+esc(wb.name):"")+")":""}<select id="s-milieu"><option value="">Je ne sais pas</option>${Object.entries(MILIEU).map(([v,t])=>`<option value="${v}" ${v===k?"selected":""}>${t}</option>`).join("")}</select></label><input type="hidden" id="s-nomeau" value="${esc(e.nom_eau||(wb&&wb.name)||"")}">
    <label class="f">Statut de pêche<select id="s-statut"><option value="ok" ${opt("ok",e.statut)}>Autorisé</option><option value="warn" ${opt("warn",e.statut)}>Restrictions</option><option value="ban" ${opt("ban",e.statut)}>Interdit</option></select></label>
    <label class="f">Raison (restriction ou interdiction)<input id="s-raison" value="${esc(e.raison||"")}" placeholder="ex. Réserve de pêche, frayère, no-kill"></label>
    <label class="f">Autorisation nécessaire<input id="s-carte" value="${esc(e.carte||"")}" placeholder="ex. Carte AAPPMA, accord du propriétaire"></label>
    <label class="f">Profondeurs connues<input id="s-prof" value="${esc(e.prof||"")}" placeholder="ex. 1 à 3 m, fosse à 5 m"></label>
    <label class="f">Fond<input id="s-fond" value="${esc(e.fond||"")}" placeholder="ex. Vase, herbiers"></label>
    <label class="f">Visibilité<select id="s-vis"><option value="public">Visible par le groupe</option><option value="prive" ${e.prive?"selected":""}>Privé (moi seul)</option></select></label>
    <button class="btn primary wide" type="submit">${ed?"Enregistrer les modifications":"Créer le spot"}</button>
  </form></div>`;
}
function stats(list){
  if(!list.length)return "";
  const rec={};list.forEach(x=>{const t=+x.taille||0;if(!rec[x.espece]||t>rec[x.espece])rec[x.espece]=t});
  const top=f=>{const m={};list.forEach(x=>{const k=f(x);if(k)m[k]=(m[k]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]};
  const lure=top(x=>x.leurre),hour=top(x=>new Date(x.caught_at).getHours()+"h");
  return `<div class="kv"><div><span class="small muted">Prises</span><b>${list.length}</b></div><div><span class="small muted">Meilleur leurre</span><b class="t">${lure?esc(lure[0]):"—"}</b></div><div><span class="small muted">Meilleure heure</span><b>${hour?hour[0]:"—"}</b></div></div>
  <div class="lbl" style="margin:14px 0 6px">Records</div>
  <div class="row">${Object.entries(rec).map(([k,v])=>`<span class="chip ghost"><b>${esc(SP[k]?SP[k].nom:k)}</b>&nbsp;<span class="num">${v} cm</span></span>`).join("")}</div>`;
}
function viewPrises(){
  const mine=S.catches.filter(x=>x.owner===S.user.id),list=S.catchFilter==="moi"?mine:S.catches;
  return `<div class="ttl"><h2>Carnet de prises</h2><button class="btn primary" data-act="new-catch">+ Nouvelle prise</button></div>
  ${S.pending?`<div class="alert warn" style="margin-bottom:10px">${S.pending} prise(s) enregistrée(s) sans réseau, envoi automatique au retour du réseau.</div>`:""}
  <div class="seg" role="group"><button data-filter="tous" aria-pressed="${S.catchFilter==="tous"}">Tout le groupe</button><button data-filter="moi" aria-pressed="${S.catchFilter==="moi"}">Mes prises</button></div>
  ${S.catchFilter==="moi"&&mine.length?`<div class="panel" style="margin-top:12px">${stats(mine)}</div>`:""}
  <div class="stack" style="margin-top:12px">${list.length?list.map(catchCard).join(""):`<div class="empty"><b>Pas encore de prise</b>Appuie sur « Nouvelle prise » et prends la photo : l'espèce, la taille, le leurre, l'heure, la météo et le spot sont enregistrés.</div>`}</div>`;
}

/* ---- Discussion ---- */
function viewChat(){
  return `<h2>Le groupe</h2><div class="msgs">${S.messages.length?S.messages.map(m=>{
    const c=m.catch_id&&S.catches.find(x=>x.id===m.catch_id),sp=m.spot_id&&spotById(m.spot_id);
    return `<div class="msg${m.owner===S.user.id?" me":""}"><div class="who">${esc(pseudo(m.owner))} · ${dateFr(m.created_at)}</div>${m.text?esc(m.text):""}
      ${c?`<div style="margin-top:6px">${c.photo_path?img(c.photo_path,"ph","").replace('class="ph','style="border-radius:10px;width:100%" class="ph'):""}<div><b>${esc(SP[c.espece]?SP[c.espece].nom:c.espece)} ${esc(c.taille||"")} cm</b> · ${esc(c.leurre||"")}</div></div>`:""}
      ${sp?`<button class="btn sm" style="margin-top:6px" data-spot="${sp.id}">📍 ${esc(sp.nom)}</button>`:""}</div>`}).join(""):`<div class="empty"><b>Aucun message</b>Lance la discussion, ou partage une prise depuis le carnet.</div>`}</div>`;
}

/* ---- Carte de pêche ---- */
function licenceStatus(c){
  if(!c||!c.fin)return {k:"none",t:"Aucune carte enregistrée",c:"ghost"};
  const end=new Date(c.fin+"T23:59:59"),start=c.debut?new Date(c.debut+"T00:00:00"):null,now=new Date(),days=Math.ceil((end-now)/dayMs);
  if(start&&now<start)return {k:"future",t:"Valable à partir du "+start.toLocaleDateString("fr-FR"),c:"warn"};
  if(days<0)return {k:"exp",t:"Expirée depuis le "+end.toLocaleDateString("fr-FR"),c:"ban"};
  if(days<=30)return {k:"soon",t:"Valide, expire dans "+days+" jour"+(days>1?"s":""),c:"warn"};
  return {k:"ok",t:"Valide jusqu'au "+end.toLocaleDateString("fr-FR"),c:"ok"};
}
function viewLicence(){
  const c=S.licence||{},st=licenceStatus(S.licence),fd=d=>d?new Date(d).toLocaleDateString("fr-FR"):"—";
  const types=["Carte personne majeure (annuelle)","Carte découverte femme","Carte personne mineure (12-18 ans)","Carte découverte (moins de 12 ans)","Carte hebdomadaire","Carte journalière","Carte d'étang privé","Autre"];
  const recips=["Aucune","EHGO","CHI","URNE","Réciprocité départementale"];
  return `<h2>Ma carte de pêche</h2>
  <div class="panel stack"><div class="ttl"><span class="lbl">Statut</span><span class="chip ${st.c}">${esc(st.t)}</span></div>
    ${c.photo_path?img(c.photo_path,"ph","Photo de ma carte","peche-licences").replace('class="ph','style="width:100%;border-radius:12px;min-height:120px" class="ph'):`<div class="empty" style="background:var(--sunk);border-radius:12px"><b>Pas encore de photo</b>Ajoute une photo ou une capture d'écran de ta carte.</div>`}
    ${S.licence?`<div class="kv">
      <div><span class="small muted">Titulaire</span><b class="t">${esc(c.nom||"—")}</b></div><div><span class="small muted">Type</span><b class="t">${esc(c.type||"—")}</b></div>
      <div><span class="small muted">N° de carte</span><b>${esc(c.numero||"—")}</b></div><div><span class="small muted">AAPPMA</span><b class="t">${esc(c.aappma||"—")}</b></div>
      <div><span class="small muted">Fédération</span><b class="t">${esc(c.fede||"—")}</b></div><div><span class="small muted">Validité</span><b>${fd(c.debut)} → ${fd(c.fin)}</b></div>
      <div><span class="small muted">Réciprocité</span><b class="t">${esc(c.recip||"—")}</b></div><div><span class="small muted">Options</span><b class="t">${esc(c.options||"—")}</b></div></div>`:""}
    <p class="small muted" style="margin:0">Ta carte est privée : toi seul la vois.</p></div>
  <h3>${S.licence?"Modifier ma carte":"Enregistrer ma carte"}</h3>
  <form class="panel stack" id="licence-form">
    <label class="f">Photo de la carte<input type="file" id="k-photo" accept="image/*"></label>
    <label class="f">Nom du titulaire<input id="k-nom" value="${esc(c.nom||"")}"></label>
    <label class="f">Type de carte<select id="k-type">${types.map(t=>`<option ${t===c.type?"selected":""}>${t}</option>`).join("")}</select></label>
    <label class="f">Numéro de carte<input id="k-num" value="${esc(c.numero||"")}"></label>
    <div class="grid2"><label class="f">AAPPMA<input id="k-aappma" value="${esc(c.aappma||"")}"></label><label class="f">Fédération<input id="k-fede" value="${esc(c.fede||"")}" placeholder="ex. Ille-et-Vilaine (35)"></label></div>
    <div class="grid2"><label class="f">Valable du<input type="date" id="k-debut" value="${esc(c.debut||"")}"></label><label class="f">Valable jusqu'au<input type="date" id="k-fin" value="${esc(c.fin||"")}" required></label></div>
    <label class="f">Réciprocité<select id="k-recip">${recips.map(t=>`<option ${t===c.recip?"selected":""}>${t}</option>`).join("")}</select></label>
    <label class="f">Options<input id="k-opt" value="${esc(c.options||"")}" placeholder="ex. Carpe de nuit"></label>
    <button class="btn primary" type="submit">Enregistrer ma carte</button>
    ${S.licence?`<button class="btn" type="button" data-act="del-licence">Supprimer ma carte</button>`:""}
  </form>
  <div class="alert info" style="margin-top:12px">En cas de contrôle, c'est ta carte officielle (numérique ou imprimée depuis cartedepeche.fr) qui fait foi.</div>
  <a class="btn wide" style="margin-top:12px" href="https://www.cartedepeche.fr" target="_blank" rel="noopener">${st.k==="exp"||st.k==="none"?"Acheter":"Renouveler ou retrouver"} ma carte sur cartedepeche.fr</a>`;
}

/* ---- Profils ---- */
function gearRow(g,mine){
  return `<div class="panel gear">${img(g.photo_path,"ph",g.type)}<div style="min-width:0"><span class="lbl">${esc(g.type)}</span><br><b>${esc(g.nom)}</b><div class="small muted">${esc(g.det||"")}</div></div>
  ${mine?`<button class="btn sm" data-act="del-gear" data-id="${g.id}" aria-label="Supprimer">✕</button>`:"<span></span>"}</div>`;
}
function viewProfils(){
  if(S.viewProfile&&S.viewProfile!==S.user.id)return profileView(S.viewProfile);
  const p=S.me,gear=S.gear[S.user.id]||[],others=Object.keys(S.profiles).filter(u=>u!==S.user.id);
  return `<h2>Mon profil</h2>
  <form class="panel stack" id="prof-form">
    <div class="row">${avatar(S.user.id,true)}<label class="f" style="flex:1">Photo de profil<input type="file" id="p-photo" accept="image/*"></label></div>
    <label class="f">Pseudo<input id="p-pseudo" value="${esc(p.pseudo)}" maxlength="40" required></label>
    <label class="f">Région<input id="p-region" value="${esc(p.region||"")}"></label>
    <label class="f">Techniques préférées<input id="p-tech" value="${esc(p.tech||"")}" placeholder="ex. Leurres, verticale, float tube"></label>
    <label class="f">Espèces favorites<input id="p-esp" value="${esc(p.esp||"")}" placeholder="ex. Brochet, sandre"></label>
    <label class="f">Présentation<textarea id="p-bio">${esc(p.bio||"")}</textarea></label>
    <button class="btn primary" type="submit">Enregistrer mon profil</button>
    <p class="small muted" style="margin:0">Ton profil, tes prises et ton matos sont visibles par les membres. Ta carte de pêche et tes spots privés restent visibles par toi seul.</p>
  </form>
  <h2>Mon matos</h2>
  <div class="stack">${gear.length?gear.map(g=>gearRow(g,true)).join(""):`<div class="empty"><b>Aucun matériel</b>Ajoute tes cannes, moulinets, fils et leurres.</div>`}</div>
  <form class="panel stack" id="gear-form" style="margin-top:12px"><div class="lbl">Ajouter du matériel</div>
    <div class="grid2"><label class="f">Type<select id="g-type"><option>Canne</option><option>Moulinet</option><option>Fil / tresse</option><option>Leurre</option><option>Float tube</option><option>Autre</option></select></label>
    <label class="f">Nom<input id="g-nom" required placeholder="ex. Shad 10 cm chartreuse"></label></div>
    <label class="f">Détails<input id="g-det" placeholder="ex. 2,40 m, 10-35 g"></label>
    <label class="f">Photo<input type="file" id="g-photo" accept="image/*"></label>
    <button class="btn" type="submit">Ajouter au matos</button></form>
  <h2>Les pêcheurs</h2>
  <div class="stack">${others.length?others.map(u=>{const q=S.profiles[u],n=S.catches.filter(x=>x.owner===u).length;
    return `<button class="panel row" style="width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer" data-act="open-profile" data-uid="${u}">${avatar(u)}<span style="flex:1;min-width:0"><b>${esc(q.pseudo)}</b><br><span class="small muted">${esc(q.region||"")}${q.region?" · ":""}${n} prise${n>1?"s":""}</span></span></button>`}).join(""):`<div class="empty"><b>Personne d'autre pour l'instant</b>Envoie l'adresse de l'app à tes amis : leur profil apparaîtra ici dès leur inscription.</div>`}</div>
  <button class="btn wide" style="margin-top:20px" data-act="share-app">Inviter des amis</button>
  <button class="btn wide" style="margin-top:12px" data-act="logout">Se déconnecter</button>`;
}
function profileView(u){
  if(!S.gear[u]&&!profileView.loading[u]){profileView.loading[u]=1;loadGear(u)}
  const p=S.profiles[u]||{},list=S.catches.filter(x=>x.owner===u),gear=S.gear[u]||[];
  return `<div class="row" style="margin-top:14px"><button class="btn sm" data-act="back-profiles">← Pêcheurs</button></div>
  <div class="row" style="margin-top:14px">${avatar(u,true)}<div style="min-width:0"><h2 style="margin:0">${esc(p.pseudo||"Pêcheur")}</h2><div class="muted">${esc(p.region||"")}</div></div></div>
  ${p.bio?`<p>${esc(p.bio)}</p>`:""}
  <div class="kv" style="margin-top:12px"><div><span class="small muted">Techniques</span><b class="t">${esc(p.tech||"—")}</b></div><div><span class="small muted">Espèces favorites</span><b class="t">${esc(p.esp||"—")}</b></div></div>
  ${list.length?`<div class="panel" style="margin-top:12px">${stats(list)}</div>`:""}
  <h3>Galerie de prises</h3>${list.length?`<div class="gal">${list.map(x=>img(x.photo_path,"ph",SP[x.espece]?SP[x.espece].nom:x.espece)).join("")}</div>`:`<p class="muted">Pas encore de prise.</p>`}
  <h3>Son matos</h3><div class="stack">${gear.length?gear.map(g=>gearRow(g,false)).join(""):`<p class="muted">Pas de matériel affiché.</p>`}</div>`;
}
profileView.loading={};

/* ================= Fiches ================= */
function openSheet(type,arg){S.formTouched=false;if(zoneMap){zoneMap.remove();zoneMap=null}S.sheet={type,arg};if(type==="spot")S.spotTab=S.spotTab&&S.sheetPrevId===arg.id?S.spotTab:"cond";if(type==="spot")S.sheetPrevId=arg.id;S.sheetHTML=null;renderSheet(true);document.body.style.overflow="hidden"}
let zoneMap=null,zoneLayer=null,zoneSpot=null;
function initZoneMap(s){
  const el=document.getElementById("zonemap");if(!el||!s)return;
  zoneSpot=s;zoneMap=L.map(el,{zoomControl:true}).setView([s.lat,s.lng],17);
  L.tileLayer(ign("ORTHOIMAGERY.ORTHOPHOTOS","image/jpeg"),{maxZoom:20,maxNativeZoom:19,attribution:"© IGN"}).addTo(zoneMap);
  zoneLayer=L.layerGroup().addTo(zoneMap);
  L.circleMarker([s.lat,s.lng],{radius:7,color:"#fff",weight:3,fillColor:(STATUT[s.statut]||STATUT.ok).col,fillOpacity:1}).addTo(zoneMap).bindTooltip(esc(s.nom));
  zoneMap.on("click",e=>{if(!S.zoneAdd||s.temp)return;S.zoneAdd=false;openSheet("zoneForm",{id:s.id,lat:+e.latlng.lat.toFixed(6),lng:+e.latlng.lng.toFixed(6)})});
  refreshZoneMap(true);setTimeout(()=>zoneMap&&zoneMap.invalidateSize(),50);
}
function refreshZoneMap(fit){
  if(!zoneMap||!zoneSpot)return;zoneLayer.clearLayers();const now=new Date(),c=conditions(zoneSpot,now),b=[[zoneSpot.lat,zoneSpot.lng]];
  if(S.zl.auto){const A=getAutoZones(zoneSpot);(A.zones||[]).forEach((z,i)=>{const top=autoZoneSpecies(z,zoneSpot,c,now),sc=top[0]?top[0].sc*10:0,col=z.ban?"#C2362B":sc>=6.5?"#2E7D4F":sc>=4?"#C07A00":"#8A968E";
    L.circle([z.lat,z.lng],{radius:z.rayon,color:col,weight:2,dashArray:"5 4",fillColor:col,fillOpacity:.25}).addTo(zoneLayer);
    L.marker([z.lat,z.lng],{icon:L.divIcon({className:"",html:`<div style="background:${col};color:#fff;border:2px solid #fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font:700 12px/1 sans-serif">${i+1}</div>`,iconSize:[24,24],iconAnchor:[12,12]})}).addTo(zoneLayer)
     .bindTooltip(`${i+1}. ${esc(z.label)}${top[0]?" · "+esc(top[0].x.s.nom)+" ("+esc(top[0].x.leurres[0])+")":""}`);b.push([z.lat,z.lng])})}
  if(S.zl.mine)S.zones.filter(z=>z.spot_id===zoneSpot.id).forEach(z=>{const r=zoneScore(z,zoneSpot,c,now),col=!r?"#8A968E":r.score>=6.5?"#2E7D4F":r.score>=4?"#C07A00":"#8A968E";
    L.circle([z.lat,z.lng],{radius:z.rayon||25,color:col,weight:2,fillColor:col,fillOpacity:.35}).addTo(zoneLayer)
     .bindTooltip(`${esc(ZONE_TYPES[z.type]||"Zone")}${z.prof_min!=null?" · "+esc(z.prof_min)+(z.prof_max!=null&&+z.prof_max!==+z.prof_min?"–"+esc(z.prof_max):"")+" m":""}${r?" · "+esc(r.sp.s.nom)+" "+r.score.toFixed(1):""}`,{permanent:true,direction:"top",className:"zone-tip"});b.push([z.lat,z.lng])});
  S.catches.filter(k=>k.spot_id===zoneSpot.id&&k.lat!=null).forEach(k=>{L.circleMarker([k.lat,k.lng],{radius:6,color:"#fff",weight:2,fillColor:"#2F7FD0",fillOpacity:1}).addTo(zoneLayer)
     .bindTooltip(`${esc(SP[k.espece]?SP[k.espece].nom:k.espece)} ${k.taille?esc(k.taille)+" cm":""} · ${esc(k.leurre||"")}`);b.push([k.lat,k.lng])});
  if(fit&&b.length>1)zoneMap.fitBounds(b,{padding:[40,40],maxZoom:18});
}
function zoneForm(a){
  const s=spotById(a.id),mk=milieuOf(s).k,sp=SPECIES.filter(x=>mk?HABITAT[x.id][mk]>=.15:(s.type==="mer"?x.hab[5]>0:Math.max(...x.hab.slice(0,5))>0));
  return `<div class="sheet" role="dialog"><div class="bar"><button class="btn sm" data-act="zone-back" data-spot="${a.id}">←</button><span class="t">Nouvelle zone</span></div>
  <form class="wrap stack" id="zone-form" style="padding-top:16px" data-spot="${a.id}" data-lat="${a.lat}" data-lng="${a.lng}">
    <p class="small muted" style="margin:0">${esc(s.nom)} · <span class="num">${a.lat}, ${a.lng}</span></p>
    <label class="f">Type de zone<select id="z-type">${Object.entries(ZONE_TYPES).map(([k,t])=>`<option value="${k}">${t}</option>`).join("")}</select></label>
    <fieldset class="panel" style="margin:0"><legend class="lbl">Espèces présentes</legend><div class="row" style="gap:8px">${sp.map(x=>`<label class="chip ghost" style="cursor:pointer;min-height:40px"><input type="checkbox" name="z-esp" value="${x.id}" style="width:auto;min-height:0">${x.nom}</label>`).join("")}</div></fieldset>
    <div class="grid2"><label class="f">Profondeur mini (m)<input id="z-min" type="number" step="0.1" min="0" inputmode="decimal"></label><label class="f">Profondeur maxi (m)<input id="z-max" type="number" step="0.1" min="0" inputmode="decimal"></label></div>
    <label class="f">Taille de la zone<select id="z-ray"><option value="10">Petite (10 m)</option><option value="25" selected>Moyenne (25 m)</option><option value="60">Grande (60 m)</option><option value="150">Très grande (150 m)</option></select></label>
    <label class="f">Note<textarea id="z-note" maxlength="500" placeholder="ex. Brochets posés sur la bordure d'herbier, meilleur au coucher du soleil"></textarea></label>
    <button class="btn primary wide" type="submit">Enregistrer la zone</button>
  </form></div>`;
}
function closeSheet(){if(zoneMap){zoneMap.remove();zoneMap=null}S.zoneAdd=false;S.sheet=null;S.sheetHTML=null;document.getElementById("sheet").innerHTML="";document.body.style.overflow="";if(tempMarker){tempMarker.remove();tempMarker=null}}
function renderSheet(force){
  const el=document.getElementById("sheet");if(!S.sheet){el.innerHTML="";return}
  const {type,arg}=S.sheet;
  if(type==="zoneForm"){if(!force)return;el.innerHTML=zoneForm(arg);return}
  if(type==="catchForm"||type==="spotForm"||type==="report"){if(!force)return;
    el.innerHTML=type==="catchForm"?catchForm(arg&&arg.id):type==="spotForm"?spotForm(arg.lat,arg.lng,arg.edit?spotById(arg.edit):null):reportForm(arg.id);relache=true;return}
  const ae=document.activeElement;if(ae&&el.contains(ae)&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName))return;
  let key=type+"|"+(arg&&arg.id)+"|"+S.spotTab+"|"+S.zoneAdd;
  if(type==="spot"&&S.spotTab==="zones"){const sp=spotById(arg.id);if(sp){const A=getAutoZones(sp);key+="|"+(A.loading?"L":A.error?"E":A.zones.length)+"|"+(conditions(sp,new Date())?1:0)+"|"+S.zones.length}}
  if(!force&&type==="spot"&&S.spotTab==="zones"&&S.sheetKey===key&&zoneMap){refreshZoneMap();return}
  const sc=el.firstElementChild?el.firstElementChild.scrollTop:0;
  if(zoneMap){zoneMap.remove();zoneMap=null}
  el.innerHTML=type==="spot"?spotSheet(arg.id):type==="waze"?wazeConfirm(arg.id):type==="zoneForm"?zoneForm(arg):"";
  S.sheetKey=key;
  if(el.firstElementChild)el.firstElementChild.scrollTop=sc;
  if(type==="spot"&&S.spotTab==="zones")initZoneMap(spotById(arg.id));
}

/* ================= Actions ================= */
let relache=true;
document.addEventListener("click",async e=>{
  const t=e.target.closest("[data-milieu],[data-float],[data-zl],[data-tab],[data-act],[data-spot],[data-spottab],[data-filter],[data-rel],[data-auth],[data-base],[data-layer]");
  if(!t||t.disabled)return;
  const d=t.dataset;
  if(d.auth){S.authMode=d.auth;render();return}
  if(d.tab){S.tab=d.tab;S.viewProfile=null;closeSheet();render();scrollTo(0,0);return}
  if(d.base){setBase(d.base);render();return}
  if(d.layer){S.layers[d.layer]=!S.layers[d.layer];if(d.layer==="routes")setBase(S.layers.base);drawSpots();render();return}
  if(d.filter){S.catchFilter=d.filter;render();return}
  if(d.rel){relache=d.rel==="1";document.querySelectorAll("[data-rel]").forEach(b=>b.setAttribute("aria-pressed",b===t));return}
  if(d.spottab){S.spotTab=d.spottab;renderSheet();return}
  if(d.milieu&&S.tempSpot){S.tempSpot.milieu=d.milieu;S.tempSpot.type=d.milieu==="mer"?"mer":["etang","lac"].includes(d.milieu)?"etang":"riviere";renderSheet(true);return}
  if(d.float){document.getElementById("s-float").value=d.float;document.querySelectorAll("[data-float]").forEach(b=>b.setAttribute("aria-pressed",b===t));S.formTouched=true;return}
  if(d.zl){S.zl[d.zl]=!S.zl[d.zl];renderSheet(true);return}
  if(!d.act&&d.spot){openSheet("spot",{id:d.spot});return}
  try{switch(d.act){
    case "close":closeSheet();break;
    case "back-spot":openSheet("spot",{id:d.spot});break;
    case "locate":locate(true);break;
    case "waze":{const s=spotById(d.spot);if(s.statut==="ban")openSheet("waze",{id:s.id});else window.open(waze(s),"_blank","noopener");break}
    case "spot-here":{const s=S.tempSpot;closeSheet();openSheet("spotForm",{lat:s.lat,lng:s.lng});break}
    case "new-catch":S.catchPos=null;locate(false);openSheet("catchForm",{id:d.spot});break;
    case "add-spot":S.addMode=true;document.getElementById("map").classList.add("adding");render();window.scrollTo(0,0);toast("Touche la carte pour placer le spot");break;
    case "cancel-add":S.addMode=false;document.getElementById("map").classList.remove("adding");render();break;
    case "add-depth":{const m=document.getElementById("dep-m").value,n=document.getElementById("dep-n").value.trim();if(!m){toast("Indique la profondeur en mètres");break}
      const {error}=await sb.from("peche_depths").insert({spot_id:d.spot,m:+m,note:n||null,owner:S.user.id});if(error)throw error;await loadDepths();renderSheet();toast("Relevé ajouté");break}
    case "del-depth":await sb.from("peche_depths").delete().eq("id",d.id);await loadDepths();renderSheet();break;
    case "del-catch":{const x=S.catches.find(c=>c.id===d.id);const {error}=await sb.from("peche_catches").delete().eq("id",d.id);if(error)throw error;if(x&&x.photo_path)sb.storage.from("peche-photos").remove([x.photo_path]);await loadCatches();toast("Prise supprimée");break}
    case "share-catch":{const {error}=await sb.from("peche_messages").insert({owner:S.user.id,text:"Regardez ma prise !",catch_id:d.id});if(error)throw error;toast("Partagée dans la discussion");break}
    case "send":sendMsg();break;
    case "open-profile":closeSheet();S.tab="profils";S.viewProfile=d.uid;render();scrollTo(0,0);break;
    case "back-profiles":S.viewProfile=null;render();break;
    case "del-gear":{const g=(S.gear[S.user.id]||[]).find(x=>x.id===d.id);await sb.from("peche_gear").delete().eq("id",d.id);if(g&&g.photo_path)sb.storage.from("peche-photos").remove([g.photo_path]);await loadGear(S.user.id);toast("Matériel supprimé");break}
    case "del-spot":{const {error}=await sb.from("peche_spots").delete().eq("id",d.spot);if(error)throw error;closeSheet();await loadSpots();toast("Spot supprimé");break}
    case "report":openSheet("report",{id:d.spot});break;
    case "wb-retry":{const sp=spotById(d.spot);delete WB[sp.lat.toFixed(4)+","+sp.lng.toFixed(4)];getWaterBody(sp.lat,sp.lng);renderSheet(true);break}
    case "edit-spot":{const sp=spotById(d.spot);openSheet("spotForm",{lat:sp.lat,lng:sp.lng,edit:sp.id});break}
    case "zone-add":S.zoneAdd=true;renderSheet(true);toast("Touche la carte à l'endroit de la zone");break;
    case "zone-cancel":S.zoneAdd=false;renderSheet(true);break;
    case "zone-back":S.spotTab="zones";S.sheet={type:"spot",arg:{id:d.spot}};renderSheet(true);break;
    case "zone-del":{const {error}=await sb.from("peche_zones").delete().eq("id",d.id);if(error)throw error;await loadZones();renderSheet(true);toast("Zone supprimée");break}
    case "sphoto-del":{const x=S.spotPhotos.find(p=>p.id===d.id);const {error}=await sb.from("peche_spot_photos").delete().eq("id",d.id);if(error)throw error;if(x)sb.storage.from("peche-photos").remove([x.path]);await loadSpotPhotos();renderSheet(true);break}
    case "del-licence":{if(S.licence&&S.licence.photo_path)await sb.storage.from("peche-licences").remove([S.licence.photo_path]);await sb.from("peche_licences").delete().eq("owner",S.user.id);await loadLicence();toast("Carte supprimée");break}
    case "share-app":{const url=location.origin+location.pathname;try{if(navigator.share){await navigator.share({title:"Coup du Soir",text:"Rejoins-moi sur Coup du Soir, l'appli de pêche du groupe :",url})}else{await navigator.clipboard.writeText(url);toast("Adresse copiée : "+url)}}catch(e2){}break}
    case "logout":await sb.auth.signOut();location.reload();break;
  }}catch(err){console.warn(err);toast(navigator.onLine?"Action impossible : "+(err.message||"erreur"):"Pas de réseau : réessaie plus tard")}
});
document.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&e.target.id==="msg-in"){e.preventDefault();sendMsg()}
  if(e.key==="Escape"&&S.sheet)closeSheet();
});
async function sendMsg(){const i=document.getElementById("msg-in");const v=i.value.trim();if(!v)return;i.value="";
  const {error}=await sb.from("peche_messages").insert({owner:S.user.id,text:v});if(error){toast("Message non envoyé : réessaie");i.value=v}else loadMessages()}

document.addEventListener("change",async e=>{
  if(e.target.id==="c-photo"&&e.target.files[0]){const file=e.target.files[0];const ex=await readExif(file);const b=await compress(file);S.catchBlob=b;const p=document.getElementById("c-prev");p.src=URL.createObjectURL(b);p.hidden=false;
    const info=[],box=document.getElementById("c-exif");
    if(ex&&ex.date&&Date.now()-ex.date<60*dayMs&&ex.date<=new Date()){document.getElementById("c-when").value=localISO(ex.date);info.push("Heure de la photo : "+dateFr(ex.date))}
    if(ex&&ex.lat!=null){S.catchPos={lat:ex.lat,lng:ex.lng,src:"photo"};const near=S.spots.filter(sp=>sp.statut!=="ban").map(sp=>({sp,d:distKm(sp,S.catchPos)})).sort((a,b)=>a.d-b.d)[0];
      if(near&&near.d<3){document.getElementById("c-spot").value=near.sp.id;info.push(`Position de la photo : à ${Math.round(near.d*1000)} m de « ${near.sp.nom} »`)}else info.push("Position lue dans la photo (aucun spot du groupe à moins de 3 km)");
      document.getElementById("c-gps").checked=true;document.getElementById("c-gps-l").textContent="Enregistrer l'endroit exact de la prise (position de la photo)";}
    updateCatchZone();
    if(info.length){box.textContent=info.join(" · ");box.hidden=false}}
  if(e.target.id==="c-spot")updateCatchZone();
  if(e.target.id==="c-esp")sizeWarn();
  if(e.target.id==="sp-photos"&&e.target.files.length){const files=[...e.target.files].slice(0,10),spot=e.target.dataset.spot;toast("Envoi de "+files.length+" photo(s)…");
    try{for(const f of files){const path=await upload(await compress(f,1600,.8));const {error}=await sb.from("peche_spot_photos").insert({spot_id:spot,owner:S.user.id,path});if(error)throw error}
      await loadSpotPhotos();renderSheet(true);toast("Photos ajoutées")}catch(err){toast("Envoi impossible : "+(err.message||"erreur"))}}
});
document.addEventListener("input",e=>{if(e.target.closest&&e.target.closest("#spot-form"))S.formTouched=true;if(e.target.id==="c-taille")sizeWarn()});
function sizeWarn(){const sp=SP[document.getElementById("c-esp").value],t=+document.getElementById("c-taille").value,w=document.getElementById("c-size-warn");
  const under=sp&&sp.legal&&t&&t<sp.legal;w.textContent=under?`${sp.nom} sous la taille légale (${sp.legal} cm) : il doit être relâché.`:"";
  if(under){relache=true;document.querySelectorAll("[data-rel]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.rel==="1"))}}

document.addEventListener("submit",async e=>{
  e.preventDefault();const f=e.target,v=id=>{const el=document.getElementById(id);return el?el.value.trim():""};
  const btn=f.querySelector('[type="submit"]');if(btn)btn.disabled=true;
  try{
    if(f.id==="auth-form"){
      const m=S.authMode||"login",email=v("a-mail");
      if(m==="signup"){const {data,error}=await sb.auth.signUp({email,password:document.getElementById("a-pass").value,options:{data:{app:"peche"},emailRedirectTo:location.origin+location.pathname}});if(error)throw new Error(authMsg(error));
        if(!data.session){S.authMode="login";render();toast("Compte créé : confirme ton adresse avec l'e-mail reçu")}}
      else if(m==="forgot"){const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(error)throw error;toast("E-mail envoyé si un compte existe");S.authMode="login";render()}
      else{const {error}=await sb.auth.signInWithPassword({email,password:document.getElementById("a-pass").value});if(error)throw new Error(authMsg(error))}
    }
    if(f.id==="recovery-form"){const {error}=await sb.auth.updateUser({password:document.getElementById("r-pass").value});if(error)throw error;S.recovery=false;toast("Mot de passe changé");render()}
    if(f.id==="onboard-form"){const {error}=await sb.from("peche_profiles").insert({id:S.user.id,pseudo:v("o-pseudo"),region:v("o-region")||null});if(error)throw error;await startApp()}
    if(f.id==="catch-form"){
      const spot=spotById(v("c-spot")),now=new Date();let when=v("c-when")?new Date(v("c-when")):now;if(!(when<=now))when=now;
      let w=null;
      if(now-when<20*36e5){const c=conditions(spot,when);if(c)w=c.w}else{try{w=await histWeather(spot,when)}catch(e){}}
      const st=sunTimes(when,spot.lat,spot.lng),mo=moon(when);
      const row={owner:S.user.id,spot_id:spot.id,espece:v("c-esp"),taille:+v("c-taille")||null,poids:+v("c-poids")||null,leurre:v("c-leurre")||null,technique:v("c-tech"),relache,caught_at:when.toISOString(),
        meteo:Object.assign(w?{temp:w.temp,press:w.press,trend:w.trend,wind:w.wind,cloud:w.cloud,water:w.water,rain:w.rainmm}:{},{moon:mo.name,illum:Math.round(mo.illum*100),mom:momentOf(when,st),hour:when.getHours()+when.getMinutes()/60})};
      const g=document.getElementById("c-gps"),pos=S.catchPos||S.pos;
      if(g&&g.checked&&pos&&distKm(pos,spot)<5){row.lat=+pos.lat.toFixed(6);row.lng=+pos.lng.toFixed(6);row.meteo.pos_src=pos.src||"gps";const z=zoneAt(spot,pos);if(z)row.meteo.zone=z.label+(z.num?" (n° "+z.num+")":"")}
      S.catchPos=null;
      const blob=S.catchBlob;S.catchBlob=null;
      try{
        if(!navigator.onLine)throw new TypeError("offline");
        if(blob)row.photo_path=await upload(blob);
        const {error}=await sb.from("peche_catches").insert(row);if(error)throw error;
        await loadCatches();toast("Prise enregistrée");
      }catch(err){
        if(err instanceof TypeError||!navigator.onLine){await idb.add({uid:S.user.id,row,blob});await countPending();toast("Pas de réseau : prise gardée, envoi automatique plus tard")}else throw err;
      }
      closeSheet();S.tab="prises";render();
    }
    if(f.id==="spot-form"){
      const row={nom:v("s-nom"),type:(["etang","lac"].includes(v("s-milieu"))&&v("s-type")==="riviere")?"etang":(v("s-milieu")==="mer"?"mer":v("s-type")),cat:v("s-cat"),statut:v("s-statut"),raison:v("s-raison")||null,carte:v("s-carte")||null,
        float:v("s-float"),milieu:v("s-milieu")||null,nom_eau:v("s-nomeau")||null,mise_eau:v("s-mise")||null,float_note:v("s-fnote")||null,prof:v("s-prof")||null,fond:v("s-fond")||null,lat:+f.dataset.lat,lng:+f.dataset.lng,prive:v("s-vis")==="prive"};
      if(f.dataset.id){const {error}=await sb.from("peche_spots").update(row).eq("id",f.dataset.id);if(error)throw error;await loadSpots();S.spotTab="regle";openSheet("spot",{id:f.dataset.id});toast("Spot modifié")}
      else{const {error}=await sb.from("peche_spots").insert({...row,owner:S.user.id});if(error)throw error;closeSheet();await loadSpots();toast("Spot créé")}
    }
    if(f.id==="zone-form"){
      const esp=[...f.querySelectorAll('input[name="z-esp"]:checked')].map(x=>x.value),mn=v("z-min"),mx=v("z-max");
      const {error}=await sb.from("peche_zones").insert({spot_id:f.dataset.spot,owner:S.user.id,lat:+f.dataset.lat,lng:+f.dataset.lng,type:v("z-type"),especes:esp,
        prof_min:mn!==""?+mn:(mx!==""?+mx:null),prof_max:mx!==""?+mx:(mn!==""?+mn:null),rayon:+v("z-ray"),note:v("z-note")||null});
      if(error)throw error;await loadZones();S.spotTab="zones";S.sheet={type:"spot",arg:{id:f.dataset.spot}};renderSheet(true);toast("Zone enregistrée");
    }
    if(f.id==="report-form"){const {error}=await sb.from("peche_reports").insert({owner:S.user.id,spot_id:f.dataset.spot,text:v("rp-text")});if(error)throw error;
      await sb.from("peche_messages").insert({owner:S.user.id,text:"⚠️ Signalement : "+v("rp-text"),spot_id:f.dataset.spot});openSheet("spot",{id:f.dataset.spot});toast("Signalement envoyé au groupe")}
    if(f.id==="prof-form"){
      const file=document.getElementById("p-photo").files[0],p={pseudo:v("p-pseudo"),region:v("p-region")||null,tech:v("p-tech")||null,esp:v("p-esp")||null,bio:v("p-bio")||null};
      if(file){p.photo_path=await upload(await compress(file,400,.8),"peche-photos","avatar-");if(S.me.photo_path)sb.storage.from("peche-photos").remove([S.me.photo_path])}
      const {error}=await sb.from("peche_profiles").update(p).eq("id",S.user.id);if(error)throw error;await loadProfiles();toast("Profil enregistré");
    }
    if(f.id==="gear-form"){
      const file=document.getElementById("g-photo").files[0],g={owner:S.user.id,type:v("g-type"),nom:v("g-nom"),det:v("g-det")||null};
      if(file)g.photo_path=await upload(await compress(file,800,.78));
      const {error}=await sb.from("peche_gear").insert(g);if(error)throw error;await loadGear(S.user.id);toast("Ajouté au matos");
    }
    if(f.id==="licence-form"){
      const file=document.getElementById("k-photo").files[0];
      const c={owner:S.user.id,nom:v("k-nom")||null,type:v("k-type"),numero:v("k-num")||null,aappma:v("k-aappma")||null,fede:v("k-fede")||null,debut:v("k-debut")||null,fin:v("k-fin"),recip:v("k-recip"),options:v("k-opt")||null,updated_at:new Date().toISOString()};
      if(file){c.photo_path=await upload(await compress(file,1600,.85),"peche-licences","carte-");if(S.licence&&S.licence.photo_path)sb.storage.from("peche-licences").remove([S.licence.photo_path])}
      const {error}=await sb.from("peche_licences").upsert(c);if(error)throw error;await loadLicence();toast("Carte enregistrée");
    }
  }catch(err){console.warn(err);toast(err.message||"Enregistrement impossible")}
  finally{if(btn&&document.body.contains(btn))btn.disabled=false}
});

function authMsg(e){const c=e.code||"",m=(e.message||"").toLowerCase();
  if(c==="signup_disabled"||m.includes("signups not allowed"))return "Les inscriptions sont fermées pour le moment : demande à l'administrateur de l'app de les ouvrir.";
  if(c==="email_not_confirmed"||m.includes("not confirmed"))return "Confirme d'abord ton adresse avec l'e-mail reçu (pense aux spams).";
  if(c==="invalid_credentials"||m.includes("invalid login"))return "E-mail ou mot de passe incorrect. Pas encore de compte ? Touche « Créer un compte ».";
  if(c==="user_already_exists"||m.includes("already registered"))return "Un compte existe déjà avec cet e-mail : connecte-toi.";
  if(c==="over_email_send_rate_limit"||m.includes("rate limit"))return "Trop d'e-mails envoyés : réessaie dans une heure.";
  if(c==="weak_password"||m.includes("password"))return "Mot de passe trop faible : au moins 8 caractères.";
  return e.message||"Connexion impossible";}
/* ================= Démarrage ================= */
async function startApp(){
  await loadProfiles();
  if(!S.me){render();return}
  render();
  await loadAll();subscribe();countPending();syncQueue();
  if(navigator.permissions&&navigator.permissions.query){try{const p=await navigator.permissions.query({name:"geolocation"});if(p.state==="granted")locate(false)}catch(e){}}
}
sb.auth.onAuthStateChange((ev,session)=>{
  if(ev==="PASSWORD_RECOVERY")S.recovery=true;
  const u=session?session.user:null,changed=(u&&u.id)!==(S.user&&S.user.id);
  S.user=u;
  if(changed){if(u)setTimeout(startApp,0);else render()}
  else if(ev==="INITIAL_SESSION"&&!u)render();
  else if(ev==="PASSWORD_RECOVERY")render();
});
setInterval(()=>{if(S.user&&S.me&&S.tab==="carte")scheduleRender()},60000);
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
updateNet();
