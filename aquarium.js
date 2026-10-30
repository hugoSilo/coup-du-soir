/* ================= Onglet Aquarium (3D) ================= */
/* Formes et couleurs des poissons. h : hauteur / longueur, w : largeur / longueur, hp : position du point le plus haut (0 = museau, 1 = queue) */
const FISH3D={
 brochet:{h:.16,w:.12,hp:.6,ped:.28,tail:"fork",ts:1.5,dors:[[.72,.88,.5]],anal:[[.72,.88,.45]],c:["#3d5628","#7a9440","#ece8c6"],fin:"#8d6a3a",pat:["spots","#e2dd9a",70],snout:1,eye:1,cm:70,zone:"mid"},
 sandre:{h:.19,w:.14,hp:.4,ped:.26,tail:"fork",ts:1.3,dors:[[.27,.47,.6,1],[.5,.72,.45]],anal:[[.62,.76,.4]],c:["#4c5a50","#a0aa9c","#f0f0ec"],fin:"#7c8270",pat:["bars","#2f3a30",8],eye:1.4,iris:"#d8e0c0",cm:55,zone:"bottom"},
 silure:{h:.19,w:.22,hp:.2,ped:.35,tail:"round",ts:1,dors:[[.28,.33,.18]],anal:[[.42,.98,.3]],c:["#2d3128","#5d6148","#ddd8c6"],fin:"#3a3c30",pat:["marble","#1c1f18",40],barb:[2,.32,4,.08],flat:1,eye:.5,cm:130,zone:"bottom"},
 perche:{h:.3,w:.14,hp:.38,ped:.3,tail:"fork",ts:1.1,dors:[[.24,.5,.6,1],[.52,.72,.45]],anal:[[.64,.76,.4]],c:["#33521f","#a0b14a","#f2e8c8"],fin:"#e0642a",dfin:"#5a6a3a",pat:["bars","#22351a",6],cm:25,zone:"mid"},
 blackbass:{h:.3,w:.15,hp:.45,ped:.3,tail:"square",ts:1.1,dors:[[.3,.48,.5,1],[.5,.72,.55]],anal:[[.62,.76,.45]],c:["#3c5a2a","#8fa65c","#f0efdc"],fin:"#7b8a50",pat:["blotch","#2c3a20",9],mouthBig:1,cm:35,zone:"mid"},
 aspe:{h:.24,w:.12,hp:.4,ped:.25,tail:"fork",ts:1.3,dors:[[.42,.55,.6]],anal:[[.62,.78,.45]],c:["#46566a","#c2cad0","#f6f6f6"],fin:"#8a9098",pat:["none"],metal:.5,cm:55,zone:"top"},
 truite:{h:.24,w:.13,hp:.42,ped:.3,tail:"square",ts:1.1,dors:[[.4,.55,.55]],anal:[[.68,.8,.4]],adip:1,c:["#5a4a28","#b89c5a","#f2e8c8"],fin:"#a08850",pat:["trout","#1a1408",50],cm:30,zone:"mid"},
 arcenciel:{h:.25,w:.13,hp:.42,ped:.3,tail:"square",ts:1.1,dors:[[.4,.55,.55]],anal:[[.68,.8,.4]],adip:1,c:["#4a5a48","#c8ccbf","#f4f2ee"],fin:"#9aa08a",pat:["rainbow","#d0607a",60],metal:.3,cm:35,zone:"mid"},
 chevesne:{h:.23,w:.15,hp:.35,ped:.3,tail:"fork",ts:1.2,dors:[[.42,.55,.5]],anal:[[.64,.76,.45]],c:["#3c4848","#c2c2b0","#f2f0ea"],fin:"#d26a3a",dfin:"#4a5050",pat:["net","#2a3030",0],metal:.3,cm:40,zone:"top"},
 barbeau:{h:.2,w:.14,hp:.4,ped:.28,tail:"fork",ts:1.3,dors:[[.4,.52,.6]],anal:[[.64,.76,.45]],c:["#6a5a38","#c4aa72","#ece0c0"],fin:"#c08a5a",pat:["spots","#5a4a2a",30],barb:[4,.07],under:1,cm:50,zone:"bottom"},
 vandoise:{h:.2,w:.11,hp:.4,ped:.25,tail:"fork",ts:1.3,dors:[[.42,.54,.5]],anal:[[.62,.74,.4]],c:["#4a5a60","#cfd4d4","#f8f8f8"],fin:"#c0b8a0",pat:["none"],metal:.5,cm:20,zone:"top"},
 hotu:{h:.21,w:.12,hp:.4,ped:.25,tail:"fork",ts:1.3,dors:[[.42,.54,.55]],anal:[[.64,.76,.4]],c:["#4c5550","#c8cac4","#f4f4f0"],fin:"#d08850",pat:["none"],metal:.4,under:1,cm:35,zone:"bottom"},
 ide:{h:.28,w:.13,hp:.42,ped:.28,tail:"fork",ts:1.2,dors:[[.44,.56,.5]],anal:[[.64,.78,.45]],c:["#4a4a38","#ccc09a","#f2eedc"],fin:"#c86a4a",pat:["none"],metal:.4,cm:40,zone:"mid"},
 carpe:{h:.32,w:.18,hp:.42,ped:.3,tail:"fork",ts:1.2,dors:[[.3,.68,.38]],anal:[[.66,.78,.4]],c:["#5a4a1e","#b28c3c","#ead8a0"],fin:"#8a6a30",pat:["net","#4a3a14",0],barb:[4,.05],cm:60,zone:"bottom"},
 tanche:{h:.3,w:.18,hp:.45,ped:.38,tail:"round",ts:1.1,dors:[[.4,.55,.45]],anal:[[.62,.74,.4]],c:["#2c461e","#5c7a30","#c8b860"],fin:"#2e401e",pat:["none"],barb:[2,.03],eye:.7,iris:"#d04030",cm:35,zone:"bottom"},
 breme:{h:.38,w:.1,hp:.45,ped:.25,tail:"fork",ts:1.3,dors:[[.42,.52,.6]],anal:[[.55,.86,.35]],c:["#4a4a3a","#a89a70","#e2ddd0"],fin:"#5a5446",pat:["none"],metal:.3,cm:45,zone:"bottom"},
 gardon:{h:.3,w:.12,hp:.42,ped:.25,tail:"fork",ts:1.2,dors:[[.42,.54,.5]],anal:[[.64,.76,.45]],c:["#3c4c58","#c8ced2","#f6f6f6"],fin:"#d24e2c",pat:["none"],metal:.5,iris:"#d03020",cm:18,zone:"mid"},
 rotengle:{h:.3,w:.12,hp:.45,ped:.25,tail:"fork",ts:1.2,dors:[[.52,.62,.5]],anal:[[.64,.76,.45]],c:["#4a4a2c","#d0bc7a","#f4ecd0"],fin:"#e0302a",pat:["none"],metal:.4,iris:"#e0a020",cm:20,zone:"top"},
 ablette:{h:.18,w:.08,hp:.4,ped:.22,tail:"fork",ts:1.3,dors:[[.5,.6,.45]],anal:[[.6,.8,.35]],c:["#3e5a6a","#d8e0e4","#ffffff"],fin:"#c8ccd0",pat:["none"],metal:.6,cm:12,zone:"top"},
 carassin:{h:.38,w:.15,hp:.45,ped:.3,tail:"fork",ts:1.1,dors:[[.34,.68,.42]],anal:[[.66,.76,.4]],c:["#5a4a20","#c09a48","#eedcac"],fin:"#8a6a30",pat:["net","#5a4418",0],metal:.3,cm:25,zone:"mid"},
 anguille:{h:.065,w:.065,hp:.3,ped:.3,tail:"eel",ts:0,dors:[[.42,1,.18]],anal:[[.52,1,.18]],c:["#38381e","#6a6a3a","#dcd2a0"],fin:"#4a4a28",pat:["none"],eye:.8,cm:60,zone:"bottom",eel:1},
 poissonchat:{h:.2,w:.16,hp:.3,ped:.38,tail:"square",ts:1,dors:[[.3,.4,.45]],anal:[[.62,.86,.3]],adip:1,c:["#36301e","#6a5a40","#d8ccae"],fin:"#3a3424",pat:["none"],barb:[8,.12],flat:.6,eye:.6,cm:25,zone:"bottom"},
 perchesoleil:{h:.5,w:.12,hp:.45,ped:.3,tail:"square",ts:1,dors:[[.3,.64,.45,1]],anal:[[.6,.78,.4]],c:["#4a6a48","#d49040","#f4b030"],fin:"#6a8060",pat:["sun","#3a8ac0",0],cm:12,zone:"mid"},
 mulet:{h:.2,w:.15,hp:.4,ped:.3,tail:"fork",ts:1.2,dors:[[.36,.44,.4,1],[.56,.66,.4]],anal:[[.62,.74,.4]],c:["#4a5458","#b8c0c2","#f0f2f2"],fin:"#7a8488","pat":["lines","#5a6468",6],metal:.4,cm:40,zone:"top"},
 bar:{h:.25,w:.12,hp:.42,ped:.25,tail:"fork",ts:1.2,dors:[[.3,.48,.5,1],[.52,.7,.45]],anal:[[.64,.76,.4]],c:["#56666e","#c8d0d4","#f6f8f8"],fin:"#8a9498",pat:["none"],metal:.6,cm:50,zone:"mid"},
 maquereau:{h:.2,w:.14,hp:.45,ped:.16,tail:"lunate",ts:1.4,dors:[[.3,.42,.45,1],[.55,.64,.35]],anal:[[.6,.68,.3]],c:["#1f6a6c","#9fc4c0","#f6f8f8"],fin:"#4a7a7a",pat:["wavy","#0e2a2a",14],metal:.5,cm:30,zone:"top"},
 lieu:{h:.22,w:.13,hp:.4,ped:.25,tail:"square",ts:1.2,dors:[[.28,.42,.4],[.46,.64,.35]],anal:[[.5,.7,.35]],c:["#5a5a3c","#c8b870","#f2ecd2"],fin:"#7a7048",pat:["lline","#2a2a18",0],cm:50,zone:"mid"},
 dorade:{h:.4,w:.12,hp:.42,ped:.22,tail:"fork",ts:1.2,dors:[[.32,.76,.32,1]],anal:[[.64,.8,.35]],c:["#5a6670","#c8cfd4","#f6f6f6"],fin:"#7a848a",pat:["gold","#e0b030",0],metal:.6,cm:35,zone:"mid"},
};
const FISH_DEF={h:.25,w:.13,hp:.42,ped:.27,tail:"fork",ts:1.2,dors:[[.42,.56,.5]],anal:[[.64,.76,.4]],c:["#4a5a5a","#b8c0b8","#f2f2ee"],fin:"#8a9088",pat:["none"],cm:30,zone:"mid"};
const fishSpec=id=>FISH3D[id]||FISH_DEF;
const fishCm=k=>{const v=parseFloat(String(k.taille||"").replace(",","."));return isFinite(v)&&v>0?v:fishSpec(k.espece).cm};
const spName=id=>{const s=SPECIES.find(x=>x.id===id);return s?s.nom:(id||"Poisson")};

const AQ={three:null,loading:false,eng:null,sig:"",fish:[],sel:null,mode:"orbit",follow:false,running:false};
let TW=6,TH=3.2,TD=3.2,WTOP=TH*.94;

function loadThree(){
  if(window.THREE)return Promise.resolve();
  if(AQ.loading)return AQ.loading;
  AQ.loading=new Promise((res,rej)=>{const s=document.createElement("script");s.src="vendor/three.min.js";s.onload=res;s.onerror=()=>{AQ.loading=false;rej()};document.head.appendChild(s)});
  return AQ.loading;
}

/* ---------- Textures ---------- */
const TEXC={};
function fishTex(id){
  if(TEXC[id])return TEXC[id];
  const sp=fishSpec(id),c=document.createElement("canvas");c.width=512;c.height=256;const g=c.getContext("2d");
  let rs=7;for(const ch of id)rs=(rs*31+ch.charCodeAt(0))%9973;const rnd=()=>{rs=(rs*9301+49297)%233280;return rs/233280};
  const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,sp.c[0]);gr.addColorStop(.38,sp.c[1]);gr.addColorStop(.62,sp.c[1]);gr.addColorStop(.85,sp.c[2]);gr.addColorStop(1,sp.c[2]);
  g.fillStyle=gr;g.fillRect(0,0,512,256);
  const [pt,pc,pn]=sp.pat;g.fillStyle=pc;g.strokeStyle=pc;
  if(pt==="spots"){for(let i=0;i<pn;i++){const x=40+rnd()*440,y=20+rnd()*120;g.globalAlpha=.75;g.beginPath();g.ellipse(x,y,5+rnd()*7,3+rnd()*4,rnd()*3,0,7);g.fill()}}
  if(pt==="bars"){g.globalAlpha=.55;for(let i=0;i<pn;i++){const x=110+i*(330/pn),w=16+rnd()*10;const lg=g.createLinearGradient(0,0,0,170);lg.addColorStop(0,pc);lg.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=lg;g.beginPath();g.moveTo(x,0);g.lineTo(x+w,0);g.lineTo(x+w*.6+6,170);g.lineTo(x-4,170);g.fill()}}
  if(pt==="blotch"){g.globalAlpha=.6;for(let i=0;i<pn;i++){const x=90+i*(360/pn);g.beginPath();g.ellipse(x,115,16+rnd()*8,12,0,0,7);g.fill()}}
  if(pt==="marble"){for(let i=0;i<pn;i++){g.globalAlpha=.35+rnd()*.3;g.beginPath();g.ellipse(rnd()*512,rnd()*170,10+rnd()*30,6+rnd()*14,rnd()*3,0,7);g.fill()}}
  if(pt==="trout"){for(let i=0;i<pn;i++){g.globalAlpha=.85;g.fillStyle=pc;g.beginPath();g.arc(30+rnd()*460,15+rnd()*120,2+rnd()*3.5,0,7);g.fill()}for(let i=0;i<14;i++){const x=120+rnd()*330,y=95+rnd()*35;g.globalAlpha=1;g.fillStyle="#f4ecd8";g.beginPath();g.arc(x,y,6,0,7);g.fill();g.fillStyle="#c8302a";g.beginPath();g.arc(x,y,3.6,0,7);g.fill()}}
  if(pt==="rainbow"){g.globalAlpha=.7;const lg=g.createLinearGradient(0,85,0,140);lg.addColorStop(0,"rgba(208,96,122,0)");lg.addColorStop(.5,pc);lg.addColorStop(1,"rgba(208,96,122,0)");g.fillStyle=lg;g.fillRect(30,85,470,55);g.fillStyle="#1a1a14";for(let i=0;i<pn;i++){g.globalAlpha=.8;g.beginPath();g.arc(20+rnd()*480,8+rnd()*110,1.6+rnd()*2,0,7);g.fill()}}
  if(pt==="net"){g.globalAlpha=.28;g.lineWidth=2;for(let y=0;y<230;y+=16)for(let x=60+(y/16%2)*9;x<500;x+=18){g.beginPath();g.arc(x,y,10,.2,PI-.2);g.stroke()}}
  if(pt==="sun"){g.globalAlpha=.65;g.lineWidth=3;for(let i=0;i<pn+9;i++){g.beginPath();const y=30+i*16;g.moveTo(0,y);for(let x=0;x<=512;x+=32)g.quadraticCurveTo(x+8,y+(rnd()-.5)*10,x+16,y);g.stroke()}g.globalAlpha=1;g.fillStyle="#141414";g.beginPath();g.ellipse(95,90,14,10,0,0,7);g.fill();g.fillStyle="#d03020";g.beginPath();g.ellipse(106,92,5,5,0,0,7);g.fill()}
  if(pt==="lines"){g.globalAlpha=.45;g.lineWidth=3;for(let i=0;i<pn;i++){const y=30+i*18;g.beginPath();g.moveTo(40,y);g.lineTo(500,y+4);g.stroke()}}
  if(pt==="wavy"){g.globalAlpha=.85;g.lineWidth=4;for(let i=0;i<pn;i++){const x=60+i*30;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+18,30,x-14,60,x+8,100);g.stroke()}}
  if(pt==="lline"){g.globalAlpha=.7;g.lineWidth=4;g.beginPath();g.moveTo(70,70);g.quadraticCurveTo(200,40,500,110);g.stroke()}
  if(pt==="gold"){g.globalAlpha=.9;g.fillStyle=pc;g.fillRect(28,40,16,60)}
  // ligne latérale, opercule, tête plus sombre, petites écailles
  g.globalAlpha=.25;g.strokeStyle="#1a1a1a";g.lineWidth=1.5;g.beginPath();g.moveTo(80,100);g.quadraticCurveTo(250,95,500,118);g.stroke();
  g.globalAlpha=.35;g.lineWidth=3;g.beginPath();g.moveTo(sp.eel?50:100,10);g.quadraticCurveTo(sp.eel?62:122,90,sp.eel?50:96,190);g.stroke();
  const hg=g.createLinearGradient(0,0,110,0);hg.addColorStop(0,"rgba(0,0,0,.28)");hg.addColorStop(1,"rgba(0,0,0,0)");g.globalAlpha=1;g.fillStyle=hg;g.fillRect(0,0,110,256);
  for(let i=0;i<900;i++){g.globalAlpha=.06;g.fillStyle=rnd()>.5?"#fff":"#000";g.fillRect(rnd()*512,rnd()*256,2,2)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;TEXC[id]=t;return t;
}

/* ---------- Modèle 3D d'un poisson (longueur 1, museau en +x) ---------- */
function bendMat(m,U){m.onBeforeCompile=sh=>{sh.uniforms.uT=U.uT;sh.uniforms.uA=U.uA;
  sh.vertexShader="uniform float uT;uniform float uA;\n"+sh.vertexShader.replace("#include <begin_vertex>","#include <begin_vertex>\nfloat sB=clamp(.5-position.x,0.,1.3);transformed.z+=uA*sB*sB*sin(uT-sB*5.5);")};return m}
function buildFish(id){
  const sp=fishSpec(id),H=sp.h,W=sp.w,a=Math.log(.5)/Math.log(sp.hp),ped=sp.ped;
  const prof=t=>{const b=Math.sin(PI*Math.min(1,Math.pow(Math.max(t,1e-4),a)));const e=t<sp.hp?(sp.snout?.5:.55):(sp.eel?.7:1.25);const f=Math.pow(b,e)*(1-ped)+ped*Math.pow(t,1.5);return {b,f}};
  const hh=t=>{const {f}=prof(t);let h=H*f;if(sp.flat&&t<.3)h*=1-sp.flat*.25*(1-t/.3);if(sp.snout&&t<.2)h*=.75+t*1.25;return h};
  const ww=t=>{const {f}=prof(t);let w=W*Math.pow(f,.9);if(sp.flat&&t<.3)w*=1+sp.flat*.2*(1-t/.3);return Math.max(w,.004)};
  const cy=t=>-H*.06*prof(t).b,X=t=>.5-t,top=t=>cy(t)+hh(t)/2,bot=t=>cy(t)-hh(t)/2;
  const U={uT:{value:Math.random()*10},uA:{value:sp.eel?.09:.045}};
  const grp=new THREE.Group();
  // Corps
  const nx=56,nr=22,pos=[],uv=[],idx=[];
  for(let i=0;i<=nx;i++){const t=i/nx;for(let j=0;j<=nr;j++){const th=j/nr*2*PI;pos.push(X(t),cy(t)+hh(t)/2*Math.cos(th),ww(t)/2*Math.sin(th));uv.push(t,(1-Math.cos(th))/2)}}
  for(let i=0;i<nx;i++)for(let j=0;j<nr;j++){const p=i*(nr+1)+j,q=p+nr+1;idx.push(p,q,p+1,q,q+1,p+1)}
  const bg=new THREE.BufferGeometry();bg.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));bg.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));bg.setIndex(idx);bg.computeVertexNormals();
  const bm=bendMat(new THREE.MeshStandardMaterial({map:fishTex(id),roughness:.42,metalness:sp.metal||.12}),U);
  grp.add(new THREE.Mesh(bg,bm));
  const finM=c=>bendMat(new THREE.MeshStandardMaterial({color:c,roughness:.6,transparent:true,opacity:.82,side:THREE.DoubleSide,depthWrite:false}),U);
  const fm=finM(sp.fin),dm=sp.dfin?finM(sp.dfin):fm;
  const shapeGeo=pts=>{const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));const g=new THREE.ShapeGeometry(s);return g};
  const finAlong=(s,e,hgt,spiny,up)=>{const pts=[],n=10,edge=up?top:bot,sg=up?1:-1;
    for(let i=0;i<=n;i++){const t=s+(e-s)*i/n;pts.push([X(t),edge(t)-sg*.008])}
    for(let i=n;i>=0;i--){const t=s+(e-s)*i/n,u=i/n;let k=sp.eel?.6+.4*Math.sin(u*PI)*(t>.9?(1-t)*10:1):(u<.3?u/.3:1-(u-.3)/.7*.75);if(spiny)k*=.75+.25*Math.abs(Math.sin(u*PI*6));pts.push([X(t)-(sp.eel?0:.02*u),edge(t)+sg*H*hgt*Math.max(.05,k)])}
    return shapeGeo(pts)};
  (sp.dors||[]).forEach(d=>grp.add(new THREE.Mesh(finAlong(d[0],d[1],d[2],d[3],true),dm)));
  (sp.anal||[]).forEach(d=>grp.add(new THREE.Mesh(finAlong(d[0],d[1],d[2],d[3],false),fm)));
  if(sp.adip){const t=.82,g=shapeGeo([[X(t-.03),top(t-.03)-.005],[X(t),top(t)+H*.18],[X(t+.04),top(t+.04)-.005]]);grp.add(new THREE.Mesh(g,dm))}
  // Queue
  if(sp.tail!=="eel"){const p=Math.max(hh(1),H*.12)/2,T=H*sp.ts,x0=X(1)+.015;let pts;
    if(sp.tail==="fork")pts=[[0,p],[-T*.32,T*.55],[-T*.5,T*.72],[-T*.32,T*.2],[-T*.24,0],[-T*.32,-T*.2],[-T*.5,-T*.72],[-T*.32,-T*.55],[0,-p]];
    else if(sp.tail==="lunate")pts=[[0,p],[-T*.2,T*.4],[-T*.42,T*.85],[-T*.3,T*.3],[-T*.22,0],[-T*.3,-T*.3],[-T*.42,-T*.85],[-T*.2,-T*.4],[0,-p]];
    else if(sp.tail==="square")pts=[[0,p],[-T*.28,T*.48],[-T*.42,T*.52],[-T*.4,0],[-T*.42,-T*.52],[-T*.28,-T*.48],[0,-p]];
    else {pts=[[0,p]];for(let i=0;i<=10;i++){const an=PI/2-i/10*PI;pts.push([-T*.12-Math.cos(an)*T*.3,Math.sin(an)*T*.42])}pts.push([0,-p])}
    const g=shapeGeo(pts.map(q=>[q[0]+x0,q[1]+cy(1)]));grp.add(new THREE.Mesh(g,fm))}
  // Nageoires pectorales et pelviennes
  const sideFin=(t,yf,len,ang)=>[1,-1].forEach(sd=>{const g=shapeGeo([[0,0],[-len*.9,len*.25],[-len,-len*.1],[-len*.3,-len*.18]]);g.rotateX(sd*ang);g.translate(X(t),cy(t)+hh(t)*yf,sd*ww(t)*.42);grp.add(new THREE.Mesh(g,fm))});
  if(!sp.eel){sideFin(.24,-.2,H*.42,.55);sideFin(.46,-.4,H*.3,.9)}else sideFin(.12,0,H*.7,.6);
  // Yeux
  const et=sp.eel?.05:.1,er=Math.max(.012,H*.075*(sp.eye||1)),eyM=bendMat(new THREE.MeshStandardMaterial({color:sp.iris||"#e8e2c8",roughness:.25}),U),puM=bendMat(new THREE.MeshStandardMaterial({color:"#050505",roughness:.1,metalness:.3}),U);
  [1,-1].forEach(sd=>{const g=new THREE.SphereGeometry(er,12,10);g.translate(X(et),cy(et)+hh(et)*.17,sd*ww(et)*.42);grp.add(new THREE.Mesh(g,eyM));
    const pg=new THREE.SphereGeometry(er*.62,10,8);pg.translate(X(et)+er*.12,cy(et)+hh(et)*.17,sd*(ww(et)*.42+er*.5));grp.add(new THREE.Mesh(pg,puM))});
  // Bouche
  {const mt=.015,mg=new THREE.TorusGeometry(Math.max(.008,hh(.03)*.35*(sp.mouthBig?1.4:1)),.004,6,12,PI);mg.rotateY(PI/2);mg.translate(X(mt)-.004,cy(mt)-(sp.under?hh(.05)*.35:0),0);grp.add(new THREE.Mesh(mg,bendMat(new THREE.MeshStandardMaterial({color:"#2a1a14"}),U)))}
  // Barbillons
  if(sp.barb){const bm2=bendMat(new THREE.MeshStandardMaterial({color:sp.c[0]}),U);
    const put=(n,len,y0)=>{for(let i=0;i<n;i++){const sd=i%2?1:-1,g=new THREE.CylinderGeometry(.0025,.005,len,5);g.translate(0,-len/2,0);g.rotateZ(-.9-(i>>1)*.35);g.rotateX(sd*(.5+(i>>1)*.25));g.translate(X(.03),cy(.03)+y0,sd*.012);grp.add(new THREE.Mesh(g,bm2))}};
    put(sp.barb[0],sp.barb[1],hh(.03)*.1);if(sp.barb[2])put(sp.barb[2],sp.barb[3],-hh(.05)*.3)}
  grp.traverse(o=>{if(o.isMesh){o.castShadow=false;o.frustumCulled=false}});
  return {grp,U};
}

/* ---------- Scène ---------- */
function noiseTex(w,h,base,dots,amt){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.fillStyle=base;g.fillRect(0,0,w,h);for(let i=0;i<amt;i++){g.fillStyle=dots[i%dots.length];g.globalAlpha=.25+Math.random()*.5;g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2.5,1+Math.random()*2.5)}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function causticTex(){const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d");g.fillStyle="#000";g.fillRect(0,0,256,256);g.strokeStyle="#fff";
  for(let i=0;i<70;i++){g.globalAlpha=.15+Math.random()*.35;g.lineWidth=1+Math.random()*2.5;const x=Math.random()*256,y=Math.random()*256,r=10+Math.random()*28;g.beginPath();for(let a=0;a<=7;a++){const an=a/7*2*PI,rr=r*(.7+Math.random()*.5);const px=x+Math.cos(an)*rr,py=y+Math.sin(an)*rr;a?g.lineTo(px,py):g.moveTo(px,py)}g.stroke()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}

/* ---------- Aquariums, fonds et décorations ---------- */
const TANKS={petit:{d:[6,3.2,3.2],cap:25},grand:{d:[8,3.6,3.6],cap:50},bassin:{d:[11,4,4.5],cap:80},lagon:{d:[15,4.6,6],cap:120}};
const FONDS={
 riviere:{w:["#2d7f96","#13546a","#0a2c3a"],hills:["#0f4152","#0c3644","#082a36"],rays:"#bff0ff",fog:"#0b2430",hemi:["#cdeeff","#3a2c1c",1.1],sun:1.6,tint:"#3aa7c6",sand:"#c9b089",caus:"#9fe8ff"},
 etang:{w:["#5d7a3c","#34502a","#1a2a14"],hills:["#2e4220","#243618","#1a2a10"],rays:"#e8f0a0",fog:"#1a2a14",hemi:["#e0f0b0","#3a3018",1],sun:1.3,tint:"#6a8a3a",sand:"#8a7a52",caus:"#d8f0a0",reeds:1},
 lac:{w:["#4a90c8","#1d5a8e","#0a2a48"],hills:["#6d8aa8","#3f6386","#1c3a58"],rays:"#d8f0ff",fog:"#0a2440",hemi:["#d8ecff","#2a3040",1.15],sun:1.7,tint:"#3a7ac0",sand:"#b8b0a0",caus:"#bfe4ff",mount:1},
 mer:{w:["#3fd0e0","#138aa8","#06456a"],hills:["#0c6a88","#0a5876","#073f5a"],rays:"#e8ffff",fog:"#06364f",hemi:["#e0ffff","#305060",1.25],sun:1.9,tint:"#2ac0d8",sand:"#eadbb0",caus:"#c8ffff",coral:1},
 coucher:{w:["#f2994a","#9a4a5a","#20304a"],hills:["#5a2a3a","#3a2034","#1c1a2c"],rays:"#ffd8a0",fog:"#2a1c2a",hemi:["#ffd8b0","#3a2020",1.05],sun:1.5,tint:"#e08a5a",sand:"#d2a878",caus:"#ffd0a0",sky:1},
 nuit:{w:["#14285a","#0a1838","#02060f"],hills:["#0a1430","#081026","#050a1a"],rays:"#a0c0ff",fog:"#020612",hemi:["#7f9cff","#101018",.55],sun:.45,tint:"#3050a0",sand:"#7a7468",caus:"#7fa8ff",stars:1}};
function paintFond(f){
  const F=FONDS[f]||FONDS.riviere,c=document.createElement("canvas");c.width=1024;c.height=512;const g=c.getContext("2d");
  const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,F.w[0]);gr.addColorStop(.55,F.w[1]);gr.addColorStop(1,F.w[2]);g.fillStyle=gr;g.fillRect(0,0,1024,512);
  if(F.sky){const sg=g.createLinearGradient(0,0,0,130);sg.addColorStop(0,"#5a3a6a");sg.addColorStop(.6,"#f07a3a");sg.addColorStop(1,"#ffc070");g.fillStyle=sg;g.fillRect(0,0,1024,130);g.fillStyle="#fff2c0";g.beginPath();g.arc(512,128,46,PI,0);g.fill();
    g.globalAlpha=.5;for(let i=0;i<14;i++){g.fillStyle="#ffe0a0";g.fillRect(512-80+Math.random()*160,135+i*10,40+Math.random()*60,3)}g.globalAlpha=1}
  if(F.stars){g.fillStyle="#fff";for(let i=0;i<160;i++){g.globalAlpha=Math.random();g.fillRect(Math.random()*1024,Math.random()*120,1.5,1.5)}g.globalAlpha=.9;g.fillStyle="#eef2ff";g.beginPath();g.arc(780,60,26,0,7);g.fill();g.globalAlpha=1}
  if(F.mount){g.fillStyle="#9fb4c8";g.globalAlpha=.55;g.beginPath();g.moveTo(0,300);[[120,170],[220,250],[340,140],[470,260],[600,160],[720,240],[860,130],[1024,250]].forEach(p=>g.lineTo(p[0],p[1]));g.lineTo(1024,512);g.lineTo(0,512);g.fill();g.globalAlpha=1}
  for(let l=0;l<3;l++){g.fillStyle=F.hills[l];g.beginPath();g.moveTo(0,512);for(let x=0;x<=1024;x+=16)g.lineTo(x,300+l*55+Math.sin(x/90+l*2)*30+Math.sin(x/33+l)*12);g.lineTo(1024,512);g.fill()}
  if(F.reeds){g.strokeStyle="#1a2a0c";for(let i=0;i<90;i++){const x=Math.random()*1024,h=120+Math.random()*220;g.globalAlpha=.5+Math.random()*.4;g.lineWidth=2+Math.random()*3;g.beginPath();g.moveTo(x,512);g.quadraticCurveTo(x+(Math.random()-.5)*40,512-h/2,x+(Math.random()-.5)*60,512-h);g.stroke()}g.globalAlpha=1}
  if(F.coral){const cs=["#e8607a","#f0a040","#c070d0","#f07050","#60c0a0"];for(let i=0;i<26;i++){const x=Math.random()*1024,y=420+Math.random()*90,s=20+Math.random()*40;g.fillStyle=cs[i%5];g.globalAlpha=.75;g.beginPath();g.ellipse(x,y,s,s*.7,0,0,7);g.fill();for(let k=0;k<5;k++){g.fillRect(x-s*.6+k*s*.3,y-s*1.4,5,s)}}g.globalAlpha=1}
  if(F.stars){for(let i=0;i<70;i++){g.fillStyle=["#60f0ff","#a0ff90","#ff90f0"][i%3];g.globalAlpha=.6;g.beginPath();g.arc(Math.random()*1024,200+Math.random()*300,1.5+Math.random()*2,0,7);g.fill()}g.globalAlpha=1}
  g.globalAlpha=.16;g.fillStyle=F.rays;for(let i=0;i<9;i++){g.beginPath();const x=80+i*110;g.moveTo(x,0);g.lineTo(x+60,0);g.lineTo(x+140,512);g.lineTo(x+40,512);g.fill()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
/* Décorations (taille réelle, indépendante de l'aquarium) */
const DECO_EMO={rocher:"🪨",herbier:"🌿",souche:"🪵",nenuphars:"🪷",amphore:"🏺",corail:"🪸",coffre:"💰",ancre:"⚓",lanterne:"🏮",floattube:"🛟",arche:"⛰️",pont:"🌉",epave:"🚢"};
const SHOP_EMO={petit:"🫙",grand:"🐠",bassin:"🏞️",lagon:"🌊",riviere:"🏞️",etang:"🐸",lac:"🏔️",mer:"🏝️",coucher:"🌅",nuit:"🌙"};
function plantMatF(c,U){const m=new THREE.MeshStandardMaterial({color:c,roughness:.7,side:THREE.DoubleSide});m.onBeforeCompile=sh=>{sh.uniforms.uT=U.uT;sh.vertexShader="uniform float uT;\n"+sh.vertexShader.replace("#include <begin_vertex>","#include <begin_vertex>\nfloat hP=max(position.y,0.);transformed.x+=sin(uT*1.3+position.y*1.7+modelMatrix[3].x)*.08*hP*hP;transformed.z+=cos(uT*1.1+position.y*1.3+modelMatrix[3].z)*.05*hP*hP;")};return m}
function ribbon(h,w){const g=new THREE.PlaneGeometry(w,h,1,8);g.translate(0,h/2,0);const p=g.attributes.position;for(let j=0;j<p.count;j++){const y=p.getY(j);p.setX(j,p.getX(j)*(1-y/h*.6))}return g}
function rockGeo(s,det){const g=new THREE.IcosahedronGeometry(s,det||1),p=g.attributes.position;for(let i=0;i<p.count;i++){const k=.75+Math.random()*.4;p.setXYZ(i,p.getX(i)*k,p.getY(i)*k*.7,p.getZ(i)*k)}g.computeVertexNormals();return g}
function makeDeco(it,E,lights){
  const G=new THREE.Group(),M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o||{})),add=(geo,mat,x,y,z,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);G.add(m);return m};
  const pm=E.plantMats;
  switch(it){
  case "rocher":add(rockGeo(.42),M("#6d6a62",{flatShading:true,roughness:.95}),0,.2,0);add(rockGeo(.22),M("#7a766c",{flatShading:true}),.38,.1,.15);break;
  case "herbier":for(let i=0;i<9;i++){const m=new THREE.Mesh(ribbon(.9+Math.random()*1.2,.07+Math.random()*.05),pm[i%3]);m.position.set((Math.random()-.5)*.5,.05,(Math.random()-.5)*.4);m.rotation.y=Math.random()*3;G.add(m)}break;
  case "souche":{const w=M("#4a3422",{roughness:.95});add(new THREE.CylinderGeometry(.16,.24,1.1,9),w,0,.5,0,.15,0,.12);for(let i=0;i<5;i++){const a=i/5*2*PI;add(new THREE.CylinderGeometry(.03,.08,.6,6),w,Math.cos(a)*.25,.12,Math.sin(a)*.25,Math.sin(a)*1.2,0,-Math.cos(a)*1.2)}add(new THREE.CylinderGeometry(.04,.06,.5,6),w,.1,.95,0,0,0,-.9);break}
  case "nenuphars":{const lf=M("#3f8a3a",{side:THREE.DoubleSide,roughness:.6}),st=M("#4a7a30");[[0,0],[.45,.2],[-.3,.35],[.15,-.4]].forEach(([x,z],i)=>{const g=new THREE.CircleGeometry(.26-i*.03,20,.3,2*PI-.4);g.rotateX(-PI/2);add(g,lf,x,WTOP-.02,z);add(new THREE.CylinderGeometry(.012,.012,WTOP-.1,5),st,x,(WTOP-.1)/2+.05,z,.05,0,.06)});
    const fl=M("#f4a6c8",{emissive:"#40182a"});for(let k=0;k<8;k++){const p=new THREE.Mesh(new THREE.ConeGeometry(.045,.16,6),fl);const a=k/8*2*PI;p.position.set(.45+Math.cos(a)*.06,WTOP+.04,.2+Math.sin(a)*.06);p.rotation.set(Math.sin(a)*.8,0,-Math.cos(a)*.8);G.add(p)}add(new THREE.SphereGeometry(.04,8,6),M("#f0d040",{emissive:"#403000"}),.45,WTOP+.05,.2);break}
  case "amphore":{const pts=[[0,0],[.12,.02],[.2,.15],[.24,.35],[.2,.55],[.1,.68],[.08,.8],[.12,.84],[.1,.86]].map(p=>new THREE.Vector2(p[0],p[1]));const m=add(new THREE.LatheGeometry(pts,18),M("#b8643a",{side:THREE.DoubleSide}),0,.22,0,0,0,PI/2.4);m.position.set(-.2,.22,0);
    add(new THREE.TorusGeometry(.06,.015,6,12,PI),M("#a8582f"),.15,.48,0,0,0,-.5);break}
  case "corail":{const cols=["#e8607a","#f0904a","#c070d0"],c=M(cols[Math.floor(Math.random()*3)],{roughness:.6});const br=(x,y,z,l,r,ax,az,d)=>{const m=add(new THREE.CylinderGeometry(r*.6,r,l,6),c,x,y+l/2,z,ax,0,az);if(d>0)for(let k=0;k<3;k++){const a2=ax+(Math.random()-.5)*1.1,b2=az+(Math.random()-.5)*1.1;br(x-Math.sin(az)*l*.9,y+Math.cos(ax)*l*.9,z+Math.sin(ax)*l*.9,l*.7,r*.7,a2,b2,d-1)}};
    br(0,.05,0,.4,.07,0,0,3);break}
  case "coffre":{const wd=M("#6a4022"),gd=M("#d8b040",{metalness:.7,roughness:.3});add(new THREE.BoxGeometry(.6,.32,.4),wd,0,.2,0);add(new THREE.BoxGeometry(.62,.05,.42),gd,0,.08,0);add(new THREE.BoxGeometry(.62,.05,.42),gd,0,.33,0);
    const lid=new THREE.CylinderGeometry(.2,.2,.6,12,1,false,0,PI);lid.rotateZ(PI/2);lid.translate(0,0,.2);const l=add(lid,wd,0,.36,-.2,-1.1,0,0);
    const coin=M("#ffd34a",{metalness:.8,roughness:.25,emissive:"#5a4000"});for(let i=0;i<14;i++)add(new THREE.CylinderGeometry(.045,.045,.012,10),coin,(Math.random()-.5)*.45,.37+Math.random()*.04,(Math.random()-.5)*.28,Math.random(),0,Math.random());
    for(let i=0;i<6;i++)add(new THREE.CylinderGeometry(.045,.045,.012,10),coin,.35+Math.random()*.3,.14,(Math.random()-.5)*.4,Math.random()*.5,0,0);break}
  case "ancre":{const mt=M("#3a3e42",{metalness:.6,roughness:.5});const A=new THREE.Group();const am=(g,x,y,z,rz)=>{const m=new THREE.Mesh(g,mt);m.position.set(x,y,z);m.rotation.z=rz||0;A.add(m)};
    am(new THREE.CylinderGeometry(.04,.04,1,8),0,.5,0);am(new THREE.TorusGeometry(.09,.025,8,16),0,1.08,0);am(new THREE.CylinderGeometry(.03,.03,.5,8),0,.85,0,PI/2);
    const arc=new THREE.TorusGeometry(.32,.04,8,20,PI);arc.rotateZ(PI);am(arc,0,.32,0);am(new THREE.ConeGeometry(.08,.18,4),-.32,.38,0,.4);am(new THREE.ConeGeometry(.08,.18,4),.32,.38,0,-.4);
    A.rotation.set(0,0,1.25);A.position.set(.45,.1,0);G.add(A);break}
  case "lanterne":{add(new THREE.CylinderGeometry(.03,.04,.9,8),M("#2a2a2a",{metalness:.5}),0,.45,0);add(new THREE.BoxGeometry(.2,.26,.2),M("#ffcf70",{emissive:"#ff9a30",emissiveIntensity:1.6,transparent:true,opacity:.9}),0,1.02,0);add(new THREE.ConeGeometry(.17,.14,4),M("#2a2a2a",{metalness:.5}),0,1.22,0,0,PI/4,0);
    if(lights.n<4){lights.n++;const L=new THREE.PointLight("#ffb050",1.6,3.2,1.5);L.position.set(0,1,0);G.add(L)}break}
  case "floattube":{const bk=M("#1c1c1e",{roughness:.6}),or=M("#e8641e",{roughness:.5});const t=add(new THREE.TorusGeometry(.32,.11,10,24,PI*1.55),bk,0,.14,0,PI/2,0,PI*.72);
    add(new THREE.BoxGeometry(.3,.06,.3),or,0,.16,.08);add(new THREE.BoxGeometry(.06,.2,.3),or,-.17,.24,.08);add(new THREE.BoxGeometry(.12,.1,.18),M("#3a5a2a"),.32,.24,-.1);add(new THREE.BoxGeometry(.12,.1,.18),M("#3a5a2a"),-.32,.24,-.1);
    add(new THREE.CylinderGeometry(.008,.008,.9,5),M("#222"),.25,.6,-.2,0,0,-.5);G.rotation.z=.08;break}
  case "arche":{const g=new THREE.TorusGeometry(.7,.2,7,14,PI),p=g.attributes.position;for(let i=0;i<p.count;i++){const k=.85+Math.random()*.3;p.setXYZ(i,p.getX(i)*(.95+Math.random()*.1),p.getY(i)*(.95+Math.random()*.1),p.getZ(i)*k)}g.computeVertexNormals();add(g,M("#7a7062",{flatShading:true,roughness:.95}),0,0,0);add(rockGeo(.3),M("#6d6a62",{flatShading:true}),-.75,.12,0);add(rockGeo(.28),M("#6d6a62",{flatShading:true}),.75,.12,0);break}
  case "pont":{const st=M("#8a8070",{roughness:.9}),wd=M("#6a4a2a");add(new THREE.BoxGeometry(1.6,.08,.45),wd,0,.72,0);[-1,1].forEach(s=>{const a=new THREE.TorusGeometry(.75,.06,6,16,PI);a.translate(0,-.05,0);add(a,st,0,0,s*.2);for(let i=0;i<7;i++)add(new THREE.CylinderGeometry(.015,.015,.22,5),wd,-.7+i*.233,.86,s*.2)});add(new THREE.BoxGeometry(1.6,.03,.03),wd,0,.97,.2);add(new THREE.BoxGeometry(1.6,.03,.03),wd,0,.97,-.2);break}
  case "epave":{const sh=new THREE.Shape();sh.moveTo(-.9,.15);sh.quadraticCurveTo(-.85,-.25,-.3,-.32);sh.lineTo(.5,-.32);sh.quadraticCurveTo(.95,-.2,1,.2);sh.lineTo(-.9,.15);
    const hull=new THREE.ExtrudeGeometry(sh,{depth:.6,bevelEnabled:false,steps:1});hull.translate(0,0,-.3);const wd=M("#5a3e26",{roughness:.95});const h=add(hull,wd,0,.3,0,0,0,.18);
    add(new THREE.BoxGeometry(1.7,.04,.56),M("#4a3220"),0,.42,0,0,0,.18);add(new THREE.CylinderGeometry(.04,.05,1,8),wd,.1,.9,0,.2,0,-.35);add(new THREE.CylinderGeometry(.03,.03,.5,8),wd,.4,1.15,0,0,0,1.1);
    for(let i=0;i<4;i++)add(new THREE.BoxGeometry(.5,.03,.08),wd,-.6+Math.random()*1.2,.05,(Math.random()-.5)*.8,0,Math.random()*3,0);G.scale.setScalar(1.15);break}
  }
  G.userData.deco=it;return G;
}
const STARTER=[{i:"rocher",x:-.36,z:-.28,r:0},{i:"rocher",x:.34,z:-.25,r:2},{i:"rocher",x:.24,z:.28,r:1},{i:"souche",x:-.1,z:-.22,r:.5},{i:"herbier",x:-.42,z:-.35,r:0},{i:"herbier",x:.42,z:-.36,r:0},{i:"herbier",x:-.3,z:.1,r:0}];

function makeEngine(){
  const R=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
  R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
  const cam=new THREE.PerspectiveCamera(50,1,.02,120);
  const E={R,cam,plantU:{uT:{value:0}},clock:new THREE.Clock(),ray:new THREE.Raycaster(),ptrs:new Map(),cfgSig:"",decoSig:"",
    walk:{pos:new THREE.Vector3(0,1.6,1.2),yaw:0,pitch:0,mv:{x:0,y:0},up:0}};
  E.plantMats=["#3f7a2e","#5a9a38","#2f5e2a"].map(c=>plantMatF(c,E.plantU));
  bindControls(E);
  return E;
}
function aqCfg(owner){const a=(S.aqData||{})[owner]||{};return {tank:TANKS[a.tank]?a.tank:"petit",fond:FONDS[a.fond]?a.fond:"riviere",decor:Array.isArray(a.decor)?a.decor:STARTER}}
function buildScene(E,cfg){
  if(E.scene&&E.fishLayer)E.scene.remove(E.fishLayer);
  if(E.scene){E.scene.traverse(o=>{if(o.isMesh||o.isPoints){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!E.plantMats.includes(m)){if(m.map&&!Object.values(TEXC).includes(m.map))m.map.dispose();m.dispose()}})}})}
  [TW,TH,TD]=TANKS[cfg.tank].d;WTOP=TH*.94;const F=FONDS[cfg.fond];
  const scene=new THREE.Scene();scene.background=new THREE.Color("#0b1a22");scene.fog=new THREE.Fog(F.fog,TW*2.2,TW*5.5);
  scene.add(new THREE.HemisphereLight(F.hemi[0],F.hemi[1],F.hemi[2]));
  const sun=new THREE.DirectionalLight(cfg.fond==="coucher"?"#ffc890":cfg.fond==="nuit"?"#9fb8ff":"#fff4e0",F.sun);sun.position.set(2,8,4);scene.add(sun);
  const back=new THREE.DirectionalLight("#7fc8ff",.5);back.position.set(-4,3,-5);scene.add(back);
  const wood=new THREE.MeshStandardMaterial({color:"#3a2618",roughness:.7});
  const cab=new THREE.Mesh(new THREE.BoxGeometry(TW+.4,1.6,TD+.4),wood);cab.position.y=-.86;scene.add(cab);
  const floorRoom=new THREE.Mesh(new THREE.PlaneGeometry(TW*12,TW*12),new THREE.MeshStandardMaterial({color:"#1b1410",roughness:.9}));floorRoom.rotation.x=-PI/2;floorRoom.position.y=-1.66;scene.add(floorRoom);
  const sg=new THREE.PlaneGeometry(TW,TD,Math.round(TW*10),Math.round(TD*9));sg.rotateX(-PI/2);const sp=sg.attributes.position;for(let i=0;i<sp.count;i++){const x=sp.getX(i),z=sp.getZ(i);sp.setY(i,.12+.06*Math.sin(x*1.7)*Math.cos(z*2.1)+.05*Math.sin(x*4.3+z*3.1)+(z<-TD/2+1?(-TD/2+1-z)*.25:0))}sg.computeVertexNormals();
  const sandTex=noiseTex(512,256,F.sand,["#a88e64","#e2cfa4","#8a7350","#f0e2c0"],9000);sandTex.repeat.set(TW/2,TD/2);
  const sand=new THREE.Mesh(sg,new THREE.MeshStandardMaterial({map:sandTex,roughness:.95}));scene.add(sand);
  E.cTex=causticTex();E.cTex2=causticTex();E.cTex.repeat.set(TW/2.7,TD/2.7);E.cTex2.repeat.set(TW/3.7,TD/3.6);
  const cMat=new THREE.MeshBasicMaterial({map:E.cTex,color:F.caus,transparent:true,opacity:cfg.fond==="nuit"?.1:.22,blending:THREE.AdditiveBlending,depthWrite:false});
  const cMat2=cMat.clone();cMat2.map=E.cTex2;cMat2.opacity*=.7;
  [cMat,cMat2].forEach(m=>{const c=new THREE.Mesh(sg.clone(),m);c.position.y=.012;scene.add(c)});
  const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(TW,TH),new THREE.MeshBasicMaterial({map:paintFond(cfg.fond),fog:false}));backdrop.position.set(0,TH/2,-TD/2+.01);scene.add(backdrop);
  const water=new THREE.Mesh(new THREE.BoxGeometry(TW-.02,WTOP,TD-.02),new THREE.MeshBasicMaterial({color:F.tint,transparent:true,opacity:.07,side:THREE.BackSide,depthWrite:false}));water.position.y=WTOP/2;scene.add(water);
  E.surf=new THREE.Mesh(new THREE.PlaneGeometry(TW,TD,30,16),new THREE.MeshStandardMaterial({color:"#9adff0",transparent:true,opacity:.3,roughness:.1,metalness:.2,side:THREE.DoubleSide,depthWrite:false}));E.surf.rotation.x=-PI/2;E.surf.position.y=WTOP;scene.add(E.surf);
  const glass=new THREE.Mesh(new THREE.BoxGeometry(TW,TH,TD),new THREE.MeshStandardMaterial({color:"#cfefff",transparent:true,opacity:.07,roughness:.05,metalness:.1,side:THREE.DoubleSide,depthWrite:false}));glass.position.y=TH/2;scene.add(glass);
  const frameM=new THREE.MeshStandardMaterial({color:"#111417",roughness:.4,metalness:.6});
  [[TW+.08,.08,.08,0,TH,TD/2],[TW+.08,.08,.08,0,TH,-TD/2],[TW+.08,.08,.08,0,0,TD/2],[TW+.08,.08,.08,0,0,-TD/2],[.08,.08,TD,TW/2,TH,0],[.08,.08,TD,-TW/2,TH,0],[.08,.08,TD,TW/2,0,0],[.08,.08,TD,-TW/2,0,0],[.08,TH,.08,TW/2,TH/2,TD/2],[.08,TH,.08,-TW/2,TH/2,TD/2],[.08,TH,.08,TW/2,TH/2,-TD/2],[.08,TH,.08,-TW/2,TH/2,-TD/2]]
    .forEach(b=>{const m=new THREE.Mesh(new THREE.BoxGeometry(b[0],b[1],b[2]),frameM);m.position.set(b[3],b[4],b[5]);scene.add(m)});
  // Plantes de fond (toujours présentes)
  for(let i=0;i<Math.round(TW*2);i++){const h=.8+Math.random()*1.6,m=new THREE.Mesh(ribbon(h,.07+Math.random()*.06),E.plantMats[i%3]);m.position.set(-TW/2+.2+Math.random()*(TW-.4),.1,-TD/2+.15+Math.random()*.35);m.rotation.y=Math.random()*3;scene.add(m)}
  const NB=140,bp=new Float32Array(NB*3);E.bs=[];for(let i=0;i<NB;i++){const src=i%2?TW/2-.6:-TW/2+.4;bp[i*3]=src+(Math.random()-.5)*.15;bp[i*3+1]=Math.random()*WTOP;bp[i*3+2]=-TD/2+.5+(Math.random()-.5)*.15;E.bs.push(.3+Math.random()*.5)}
  const bgeo=new THREE.BufferGeometry();bgeo.setAttribute("position",new THREE.BufferAttribute(bp,3));
  E.bubbles=new THREE.Points(bgeo,new THREE.PointsMaterial({color:"#e8fbff",size:.05,transparent:true,opacity:.7,depthWrite:false}));scene.add(E.bubbles);
  E.decoLayer=new THREE.Group();scene.add(E.decoLayer);
  if(!E.fishLayer)E.fishLayer=new THREE.Group();scene.add(E.fishLayer);
  E.marker=new THREE.Mesh(new THREE.ConeGeometry(.07,.16,12),new THREE.MeshBasicMaterial({color:"#ffd34a",fog:false}));E.marker.rotation.x=PI;E.marker.visible=false;scene.add(E.marker);
  E.dmark=new THREE.Mesh(new THREE.RingGeometry(.55,.65,32),new THREE.MeshBasicMaterial({color:"#ffd34a",transparent:true,opacity:.85,side:THREE.DoubleSide,depthTest:false}));E.dmark.rotation.x=-PI/2;E.dmark.visible=false;scene.add(E.dmark);
  E.scene=scene;E.decoSig="";
  E.orb=aqHome();E.walk.pos.set(0,TH*.5,TD/2-.3);
}
function buildDecor(E,decor){
  const sig=JSON.stringify(decor);if(sig===E.decoSig)return;E.decoSig=sig;
  E.decoLayer.children.slice().forEach(g=>{E.decoLayer.remove(g);g.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(!E.plantMats.includes(o.material))o.material.dispose()}})});
  const lights={n:0};
  decor.forEach((d,i)=>{const g=makeDeco(d.i,E,lights);g.position.set(d.x*TW,0,d.z*TD);g.rotation.y=(g.rotation.y||0)+(d.r||0);g.userData.di=i;g.traverse(o=>{o.userData.di=i});E.decoLayer.add(g)});
}

function aqHome(){const h=document.getElementById("aq-3d"),asp=h&&h.clientHeight?h.clientWidth/h.clientHeight:1.3;return {th:0,ph:1.3,r:(asp<1?6.3+asp*1.5:8.2)*Math.max(1,TW/6*(asp<1?1.05:.9)),tgt:new THREE.Vector3(0,TH*.48,0)}}
/* ---------- Commandes (doigts / souris) ---------- */
function bindControls(E){
  const el=E.R.domElement;el.style.touchAction="none";el.tabIndex=0;
  let down=null,pinch=null,drag=null;
  const P=e=>({x:e.clientX,y:e.clientY});
  el.addEventListener("pointerdown",e=>{el.setPointerCapture(e.pointerId);E.ptrs.set(e.pointerId,P(e));
    if(E.ptrs.size===1){down={...P(e),t:Date.now(),moved:false,btn:e.button};if(AQ.edit){const di=hitDeco(E,e);if(di!=null){drag={di};AQ.dsel=di;aqUI()}}}
    if(E.ptrs.size===2){const [a,b]=[...E.ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),m:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}};if(down)down.moved=true}});
  el.addEventListener("pointermove",e=>{if(!E.ptrs.has(e.pointerId))return;const prev=E.ptrs.get(e.pointerId),cur=P(e);E.ptrs.set(e.pointerId,cur);
    const dx=cur.x-prev.x,dy=cur.y-prev.y;
    if(down&&Math.hypot(cur.x-down.x,cur.y-down.y)>6)down.moved=true;
    if(drag&&E.ptrs.size===1){if(down&&down.moved){const pt=floorPt(E,e),D=myDecor()[drag.di];if(pt&&D){D.x=Math.max(-.47,Math.min(.47,pt.x/TW));D.z=Math.max(-.45,Math.min(.45,pt.z/TD));const g=E.decoLayer.children.find(o=>o.userData.di===drag.di);if(g)g.position.set(D.x*TW,0,D.z*TD);drag.moved=true}}return}
    if(E.ptrs.size===1&&down&&down.moved){
      if(AQ.mode==="walk"){E.walk.yaw-=dx*.005;E.walk.pitch=Math.max(-1.2,Math.min(1.2,E.walk.pitch-dy*.004))}
      else if(down.btn===2||e.shiftKey)pan(E,dx,dy);
      else{E.orb.th-=dx*.006;E.orb.ph=Math.max(.12,Math.min(1.62,E.orb.ph-dy*.005))}
      if(AQ.follow&&AQ.mode!=="walk"&&down.btn!==2)return;
    }
    if(E.ptrs.size===2&&pinch){const [a,b]=[...E.ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y),m={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      if(AQ.mode==="walk"){const f=(d-pinch.d)*.01;moveWalk(E,f,0,0)}
      else{E.orb.r=Math.max(.6,Math.min(TW*2.7,E.orb.r*pinch.d/Math.max(d,1)));pan(E,m.x-pinch.m.x,m.y-pinch.m.y)}
      pinch={d,m}}});
  const up=e=>{E.ptrs.delete(e.pointerId);if(E.ptrs.size<2)pinch=null;
    if(drag){if(drag.moved){E.decoSig=JSON.stringify(myDecor());aqSaveSoon()}drag=null;if(E.ptrs.size===0)down=null;return}
    if(down&&!down.moved&&E.ptrs.size===0&&Date.now()-down.t<400){if(AQ.edit)editTap(E,e);else pick(E,e)}if(E.ptrs.size===0)down=null};
  el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
  el.addEventListener("contextmenu",e=>e.preventDefault());
  el.addEventListener("wheel",e=>{e.preventDefault();if(AQ.mode==="walk")moveWalk(E,-e.deltaY*.004,0,0);else E.orb.r=Math.max(.6,Math.min(TW*2.7,E.orb.r*(1+e.deltaY*.0012)))},{passive:false});
  el.addEventListener("keydown",e=>{if(AQ.mode!=="walk")return;const k=e.key.toLowerCase(),s=.18;if(k==="z"||k==="arrowup")moveWalk(E,s,0,0);if(k==="s"||k==="arrowdown")moveWalk(E,-s,0,0);if(k==="q"||k==="arrowleft")moveWalk(E,0,-s,0);if(k==="d"||k==="arrowright")moveWalk(E,0,s,0)});
}

function ndc(E,e){const rc=E.R.domElement.getBoundingClientRect();return new THREE.Vector2((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1)}
function hitDeco(E,e){E.ray.setFromCamera(ndc(E,e),E.cam);const h=E.ray.intersectObjects(E.decoLayer.children,true)[0];return h&&h.object.userData.di!=null?h.object.userData.di:null}
function floorPt(E,e){E.ray.setFromCamera(ndc(E,e),E.cam);const pt=new THREE.Vector3();return E.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.15),pt)?pt:null}
function editTap(E,e){
  if(AQ.placing){const pt=floorPt(E,e);if(pt&&Math.abs(pt.x)<TW/2&&Math.abs(pt.z)<TD/2){const D=myDecor();D.push({i:AQ.placing,x:+(pt.x/TW).toFixed(3),z:+(pt.z/TD).toFixed(3),r:+(Math.random()*6.28).toFixed(2)});AQ.dsel=D.length-1;if(invLeft(AQ.placing)<=0)AQ.placing=null;buildDecor(E,D);aqSaveSoon();aqEditUI()}return}
  AQ.dsel=null;aqEditUI()}
function pan(E,dx,dy){AQ.follow=false;const k=E.orb.r*.0016,th=E.orb.th;E.orb.tgt.x-=(Math.cos(th)*dx)*k;E.orb.tgt.z-=(-Math.sin(th)*dx)*k;E.orb.tgt.y+=dy*k;
  E.orb.tgt.x=Math.max(-TW/2,Math.min(TW/2,E.orb.tgt.x));E.orb.tgt.y=Math.max(.1,Math.min(TH,E.orb.tgt.y));E.orb.tgt.z=Math.max(-TD/2,Math.min(TD/2,E.orb.tgt.z))}
function moveWalk(E,fw,st,upd){const w=E.walk,f=new THREE.Vector3(-Math.sin(w.yaw)*Math.cos(w.pitch),Math.sin(w.pitch),-Math.cos(w.yaw)*Math.cos(w.pitch)),r=new THREE.Vector3(Math.cos(w.yaw),0,-Math.sin(w.yaw));
  w.pos.addScaledVector(f,fw).addScaledVector(r,st);w.pos.y+=upd;
  w.pos.x=Math.max(-TW/2+.15,Math.min(TW/2-.15,w.pos.x));w.pos.y=Math.max(.3,Math.min(WTOP-.1,w.pos.y));w.pos.z=Math.max(-TD/2+.15,Math.min(TD/2+3,w.pos.z))}
function pick(E,e){const rc=E.R.domElement.getBoundingClientRect(),v=new THREE.Vector2((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1);
  E.ray.setFromCamera(v,E.cam);const hit=E.ray.intersectObjects(AQ.fish.map(f=>f.grp),true)[0];
  if(hit){let o=hit.object;while(o&&o.userData.fid==null)o=o.parent;if(o)aqSelect(o.userData.fid,true)}else aqSelect(null)}

/* ---------- Poissons de l'aquarium ---------- */
function aqCatches(owner){return S.catches.filter(k=>k.owner===owner).sort((a,b)=>fishCm(b)-fishCm(a))}
function fishLen(cm){return Math.max(.28,Math.min(2.2,.24+cm/100*.85))}
function zoneY(z,len){const lo=.35+len*.12,hi=WTOP-.25-len*.1;return z==="bottom"?lo+Math.random()*(hi-lo)*.3:z==="top"?hi-Math.random()*(hi-lo)*.3:lo+(hi-lo)*(.25+Math.random()*.5)}
function newTarget(f){const m=f.len*.55+.2;f.tgt.set(-TW/2+m+Math.random()*(TW-2*m),zoneY(f.zone,f.len),-TD/2+m+.25+Math.random()*(TD-2*m-.25))}
function syncFish(E,owner){
  const cap=TANKS[aqCfg(owner).tank].cap,list=aqCatches(owner).slice(0,cap),sig=owner+"|"+TW+"|"+list.map(k=>k.id+":"+fishCm(k)+":"+k.espece).join(",");
  if(sig===AQ.sig)return;AQ.sig=sig;
  AQ.fish.forEach(f=>{E.fishLayer.remove(f.grp);f.grp.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose()}})});
  AQ.fish=list.map(k=>{const {grp,U}=buildFish(k.espece),sp=fishSpec(k.espece),cm=fishCm(k),len=fishLen(cm);
    grp.scale.setScalar(len);grp.userData.fid=k.id;grp.rotation.order="YZX";
    const f={id:k.id,k,grp,U,len,zone:sp.zone,eel:sp.eel,pos:new THREE.Vector3(),dir:new THREE.Vector3(Math.random()-.5,0,Math.random()-.5).normalize(),tgt:new THREE.Vector3(),
      speed:(.22+Math.random()*.12)*(.7+len*.35)*(sp.eel?.7:1),turn:1.2/(.6+len)};
    newTarget(f);f.pos.copy(f.tgt);newTarget(f);E.fishLayer.add(grp);return f});
  if(AQ.sel&&!AQ.fish.find(f=>f.id===AQ.sel))AQ.sel=null;
}
function stepFish(E,dt){
  const tmp=new THREE.Vector3();
  AQ.fish.forEach(f=>{tmp.subVectors(f.tgt,f.pos);const d=tmp.length();if(d<.3||Math.random()<dt*.04)newTarget(f);
    tmp.normalize();tmp.y*=.6;f.dir.lerp(tmp,Math.min(1,f.turn*dt)).normalize();
    const sp=f.speed*(d<.8?.6:1);f.pos.addScaledVector(f.dir,sp*dt);
    const m=f.len*.5;f.pos.x=Math.max(-TW/2+m,Math.min(TW/2-m,f.pos.x));f.pos.y=Math.max(.25,Math.min(WTOP-.15,f.pos.y));f.pos.z=Math.max(-TD/2+m*.6,Math.min(TD/2-m*.6,f.pos.z));
    f.grp.position.copy(f.pos);f.grp.rotation.y=Math.atan2(-f.dir.z,f.dir.x);f.grp.rotation.z=Math.asin(Math.max(-.35,Math.min(.35,f.dir.y)));
    f.U.uT.value+=dt*(5+sp*14/f.len)});
}

/* ---------- Boucle ---------- */
function aqLoop(){
  const E=AQ.eng;if(!AQ.running||!E)return;requestAnimationFrame(aqLoop);
  if(document.hidden)return;
  const dt=Math.min(.05,E.clock.getDelta()),t=E.clock.elapsedTime;
  stepFish(E,dt);
  E.cTex.offset.set(t*.02,t*.013);E.cTex2.offset.set(-t*.015,t*.02);E.plantU.uT.value=t;
  const bp=E.bubbles.geometry.attributes.position;for(let i=0;i<bp.count;i++){let y=bp.getY(i)+E.bs[i]*dt;if(y>WTOP){y=.15}bp.setY(i,y);bp.setX(i,bp.getX(i)+Math.sin(t*3+i)*.0015)}bp.needsUpdate=true;
  const sp=E.surf.geometry.attributes.position;for(let i=0;i<sp.count;i++){const x=sp.getX(i),y=sp.getY(i);sp.setZ(i,.025*Math.sin(x*2+t*1.6)+.02*Math.cos(y*2.6+t*1.2))}sp.needsUpdate=true;
  const sel=AQ.fish.find(f=>f.id===AQ.sel);
  {const dg=AQ.edit&&AQ.dsel!=null&&E.decoLayer.children.find(o=>o.userData.di===AQ.dsel);E.dmark.visible=!!dg;if(dg){E.dmark.position.set(dg.position.x,.2,dg.position.z);E.dmark.scale.setScalar(1+Math.sin(t*5)*.06)}}
  E.marker.visible=!!sel;if(sel){E.marker.position.set(sel.pos.x,sel.pos.y+sel.len*.32+.14+Math.sin(t*4)*.03,sel.pos.z)}
  if(AQ.mode==="walk"){const w=E.walk;if(w.mv.x||w.mv.y)moveWalk(E,-w.mv.y*dt*1.4,w.mv.x*dt*1.4,0);if(w.up)moveWalk(E,0,0,w.up*dt*1.1);
    E.cam.position.copy(w.pos);E.cam.rotation.set(w.pitch,w.yaw,0,"YXZ")}
  else{const o=E.orb;if(AQ.follow&&sel){o.tgt.lerp(sel.pos,Math.min(1,dt*3));o.r+=(Math.max(1,sel.len*2.6)-o.r)*Math.min(1,dt*1.5)}
    E.cam.position.set(o.tgt.x+o.r*Math.sin(o.ph)*Math.sin(o.th),o.tgt.y+o.r*Math.cos(o.ph),o.tgt.z+o.r*Math.sin(o.ph)*Math.cos(o.th));E.cam.lookAt(o.tgt)}
  E.R.render(E.scene,E.cam);
}
function aqResize(){const E=AQ.eng,h=document.getElementById("aq-3d");if(!E||!h)return;const w=h.clientWidth,hh=h.clientHeight;if(!w||!hh)return;E.R.setSize(w,hh,false);E.R.domElement.style.width="100%";E.R.domElement.style.height="100%";E.cam.aspect=w/hh;E.cam.updateProjectionMatrix()}
let aqRO=null;
async function aqMount(){
  const host=document.getElementById("aq-3d");if(!host)return;
  if(!AQ.eng){
    try{await loadThree()}catch(e){host.innerHTML=`<div class="aq-msg">Impossible de charger la 3D (pas de réseau ?)</div>`;return}
    try{AQ.eng=makeEngine()}catch(e){host.innerHTML=`<div class="aq-msg">Ton appareil ne permet pas d'afficher la 3D.</div>`;return}
  }
  const h2=document.getElementById("aq-3d");if(!h2)return;
  if(AQ.eng.R.domElement.parentNode!==h2)h2.prepend(AQ.eng.R.domElement);
  const own=aqOwner();aqLoad(own);const cfg=aqCfg(own),cs=cfg.tank+"|"+cfg.fond;
  if(AQ.eng.cfgSig!==cs){AQ.eng.cfgSig=cs;buildScene(AQ.eng,cfg);AQ.sig=""}
  buildDecor(AQ.eng,own===S.user.id&&AQ.edit?myDecor():cfg.decor);
  syncFish(AQ.eng,own);
  if(!aqRO){aqRO=new ResizeObserver(aqResize)}aqRO.disconnect();aqRO.observe(h2);aqResize();
  if(!AQ.running){AQ.running=true;AQ.eng.clock.getDelta();aqLoop()}
}
function aqPause(){AQ.running=false}


/* ---------- Données : aquarium, pièces, achats ---------- */
S.aqData=S.aqData||{};const AQL={};
function aqLoad(owner,force){if(!owner||(AQL[owner]&&!force))return;AQL[owner]=1;
  sb.from("peche_aquariums").select("*").eq("owner",owner).maybeSingle().then(({data})=>{const cur=S.aqData[owner];S.aqData[owner]=data||{};if(JSON.stringify(cur)!==JSON.stringify(S.aqData[owner]))scheduleRender()});
  if(owner===S.user.id)aqWallet()}
async function aqWallet(){const [w,a,b]=await Promise.all([sb.rpc("peche_solde"),sb.from("peche_achats").select("item"),S.shop?null:sb.from("peche_boutique").select("*").order("ordre")]);
  if(w.data)S.aqWallet=w.data;const o={};(a.data||[]).forEach(r=>o[r.item]=(o[r.item]||0)+1);S.aqOwned=o;if(b&&b.data)S.shop=b.data;scheduleRender()}
function myDecor(){const me=S.user.id,d=S.aqData[me]=S.aqData[me]||{};if(!Array.isArray(d.decor))d.decor=STARTER.map(x=>({...x}));return d.decor}
const starterN=it=>({rocher:3,souche:1,herbier:3})[it]||0;
const invLeft=it=>starterN(it)+((S.aqOwned||{})[it]||0)-myDecor().filter(d=>d.i===it).length;
let aqSaveT=null;
function aqSaveSoon(){clearTimeout(aqSaveT);aqSaveT=setTimeout(aqSave,700)}
async function aqSave(){const c=aqCfg(S.user.id),d=S.aqData[S.user.id]||{};const {error}=await sb.rpc("peche_save_aquarium",{p_tank:d.tank||"petit",p_fond:d.fond||"riviere",p_decor:myDecor()});if(error)toast("Enregistrement impossible : "+error.message)}
const owns=it=>it==="petit"||it==="riviere"||!!(S.aqOwned||{})[it];
// Pièces gagnées par prise (mêmes règles que le serveur)
function coinRows(owner){const list=S.catches.filter(k=>k.owner===owner&&k.photo_path).slice().sort((a,b)=>new Date(a.caught_at)-new Date(b.caught_at)||(a.id<b.id?-1:1));
  const best={};return list.map(k=>{const t=Math.min(+k.taille||0,300),sp=spotById(k.spot_id),first=!(k.espece in best),rec=!first&&best[k.espece]!=null&&t>best[k.espece];
    const parts=[["Prise avec photo",10]];if(Math.floor(t/5))parts.push([`Taille ${Math.round(t)} cm`,Math.floor(t/5)]);if(sp&&sp.parcours)parts.push(["Sur un parcours float tube",5]);if(first)parts.push(["Nouvelle espèce",50]);if(rec)parts.push(["Record perso battu",25]);
    best[k.espece]=Math.max(best[k.espece]??-1,t);return {k,parts,tot:parts.reduce((a,p)=>a+p[1],0)}}).reverse()}
function shopView(){
  const w=S.aqWallet||{solde:0},cat=S.shop||[],tab=S.shopTab||"tank",me=S.aqData[S.user.id]||{};
  const cur={tank:me.tank||"petit",fond:me.fond||"riviere"};
  const items=cat.filter(x=>x.type===tab).map(x=>{const own=owns(x.item),inUse=cur[x.type]===x.item,n=(S.aqOwned||{})[x.item]||0;
    let act;if(x.type==="deco")act=`<button class="btn sm${w.solde>=x.prix?" primary":""}" data-aq="buy" data-item="${x.item}" ${w.solde<x.prix?"disabled":""}>🪙 ${x.prix}</button>`;
    else if(inUse)act=`<span class="chip ok">En place</span>`;else if(own)act=`<button class="btn sm" data-aq="use" data-item="${x.item}">Installer</button>`;
    else act=`<button class="btn sm${w.solde>=x.prix?" primary":""}" data-aq="buy" data-item="${x.item}" ${w.solde<x.prix?"disabled":""}>🪙 ${x.prix}</button>`;
    const sub=x.type==="tank"?`Jusqu'à ${TANKS[x.item].cap} poissons, ${Math.round(TANKS[x.item].d[0]/6*100)} % de la largeur de départ`:x.type==="deco"?`Tu en as ${starterN(x.item)+n}${starterN(x.item)?" (dont "+starterN(x.item)+" offerts)":""}`:"Décor peint au fond de l'aquarium";
    return `<div class="shop-it"><span class="shop-emo">${x.type==="deco"?DECO_EMO[x.item]:SHOP_EMO[x.item]||"✨"}</span><span class="shop-tx"><b>${esc(x.nom)}</b><span class="small muted">${sub}</span></span>${act}</div>`}).join("");
  const rows=coinRows(S.user.id);
  return `<div class="aq-shop" role="dialog" aria-label="Boutique"><div class="shop-in">
    <div class="shop-hd"><b>🛒 Boutique</b><span class="coins">🪙 ${w.solde}</span><button class="btn sm" data-aq="shop" aria-label="Fermer">✕</button></div>
    <div class="seg" role="group"><button data-aq="stab" data-t="tank" aria-pressed="${tab==="tank"}">Agrandir</button><button data-aq="stab" data-t="fond" aria-pressed="${tab==="fond"}">Fonds</button><button data-aq="stab" data-t="deco" aria-pressed="${tab==="deco"}">Déco</button><button data-aq="stab" data-t="gains" aria-pressed="${tab==="gains"}">Gains</button></div>
    <div class="shop-list">${tab==="gains"?`<div class="small" style="line-height:1.6;padding:4px 2px 10px"><b>Comment gagner des pièces</b><br>Prise avec photo +10 · +1 tous les 5 cm · nouvelle espèce +50 · record perso battu +25 · prise sur un parcours float tube +5.<br><span class="muted">Seules les prises avec photo rapportent. Le solde est calculé par le serveur : ${w.gains||0} gagnées, ${w.depenses||0} dépensées.</span></div>
      ${rows.map(r=>`<div class="shop-it"><span class="shop-emo">🐟</span><span class="shop-tx"><b>${esc(spName(r.k.espece))}${r.k.taille?" "+esc(r.k.taille)+" cm":""}</b><span class="small muted">${r.parts.map(p=>p[0]+" +"+p[1]).join(" · ")}</span></span><b class="coins">+${r.tot}</b></div>`).join("")||`<p class="small muted">Ajoute une prise avec photo pour gagner tes premières pièces.</p>`}`
      :items||`<p class="small muted">Chargement…</p>`}</div></div></div>`;
}
function aqEditBar(){
  const cat=(S.shop||[]).filter(x=>x.type==="deco"),D=myDecor(),sel=AQ.dsel!=null?D[AQ.dsel]:null;
  const inv=cat.map(x=>{const n=invLeft(x.item);return n>0?`<button class="inv${AQ.placing===x.item?" on":""}" data-aq="place" data-item="${x.item}"><span>${DECO_EMO[x.item]}</span>${esc(x.nom)} <b>×${n}</b></button>`:""}).join("");
  return `<div class="aq-edit">${sel?`<div class="row" style="gap:6px;justify-content:center"><b class="small">${DECO_EMO[sel.i]} ${esc((cat.find(x=>x.item===sel.i)||{}).nom||sel.i)}</b><button class="btn sm" data-aq="drot" data-d="-1">⟲</button><button class="btn sm" data-aq="drot" data-d="1">⟳</button><button class="btn sm" data-aq="ddel">📦 Ranger</button></div>`:""}
    <div class="small edit-help">${AQ.placing?"Touche le sable pour poser l'objet":sel?"Fais glisser l'objet pour le déplacer":"Touche un objet pour le déplacer, ou choisis-en un à poser"}</div>
    <div class="inv-row">${inv||`<span class="small muted" style="padding:6px">Tout est posé. Achète des décorations dans la boutique.</span>`}</div></div>`;
}
function aqEditUI(){const w=document.getElementById("aq-editwrap");if(w)w.innerHTML=AQ.edit?aqEditBar():""}

/* ---------- Interface ---------- */
const aqOwner=()=>S.aqOwner||(S.user&&S.user.id);
function aqSelect(id,fromTap){AQ.sel=id;if(id){AQ.follow=true;if(AQ.mode==="walk")setMode("orbit")}else AQ.follow=false;aqUI()}
function setMode(m){AQ.mode=m;const E=AQ.eng;if(E&&m==="walk"){E.walk.pos.set(0,TH*.5,TD/2-.3);E.walk.yaw=0;E.walk.pitch=-.05;AQ.follow=false}aqUI()}
function aqCard(){
  const f=AQ.fish.find(x=>x.id===AQ.sel);if(!f)return "";const k=f.k,sp=spotById(k.spot_id);
  return `<div class="aq-card">${img(k.photo_path,"aq-cph",spName(k.espece))}<div class="aq-cb"><b>${esc(spName(k.espece))}${k.taille?` · ${esc(k.taille)} cm`:""}</b>
    <div class="small muted">${dateFr(k.caught_at)}${sp?" · "+esc(sp.nom):""}</div>${k.leurre?`<div class="small">🎣 ${esc(k.leurre)}</div>`:""}
    <div class="row" style="gap:6px;margin-top:6px"><button class="btn sm" data-aq="follow">${AQ.follow?"📌 Lâcher":"🎥 Suivre"}</button><button class="btn sm" data-aq="unsel" aria-label="Fermer">✕</button></div></div></div>`;
}
function aqUI(){aqEditUI();
  const c=document.getElementById("aq-cardwrap");if(c)c.innerHTML=aqCard();const hp=document.querySelector(".aq-help");if(hp)hp.hidden=!!AQ.sel||!!AQ.edit;
  document.querySelectorAll("#aq-list [data-id]").forEach(b=>b.setAttribute("aria-current",b.dataset.id===String(AQ.sel)?"true":"false"));
  const cur=document.querySelector(`#aq-list [data-id="${AQ.sel}"]`);if(cur)cur.scrollIntoView({block:"nearest",behavior:"smooth"});
  document.querySelectorAll("[data-aq=mode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===AQ.mode));
  const j=document.getElementById("aq-joy");if(j)j.hidden=AQ.mode!=="walk";
}
function viewAquarium(){
  const owner=aqOwner(),mine=owner===S.user.id,p=S.profiles[owner]||{},sort=S.aqSort||"taille";
  let list=aqCatches(owner);
  if(sort==="date")list=list.slice().sort((a,b)=>new Date(b.caught_at)-new Date(a.caught_at));
  if(sort==="espece")list=list.slice().sort((a,b)=>spName(a.espece).localeCompare(spName(b.espece),"fr")||fishCm(b)-fishCm(a));
  const top=aqCatches(owner).slice(0,3),nsp=new Set(list.map(k=>k.espece)).size;
  const podium=top.length?`<h3 style="margin:16px 0 8px">🏆 Podium des plus grosses prises</h3><div class="aq-podium">${[1,0,2].map(i=>{const k=top[i];if(!k)return `<div class="pd pd${i+1} empty"></div>`;
    return `<button class="pd pd${i+1}" data-aq="sel" data-id="${k.id}"><div class="pd-ph">${img(k.photo_path,"pd-img",spName(k.espece))}</div><b>${esc(spName(k.espece))}</b><span class="num">${Math.round(fishCm(k))} cm</span><span class="small muted">${new Date(k.caught_at).toLocaleDateString("fr-FR")}</span><div class="pd-step">${["🥇","🥈","🥉"][i]}</div></button>`}).join("")}</div>`:"";
  const cfg=aqCfg(owner),cap=TANKS[cfg.tank].cap,w=S.aqWallet;
  return `<div class="ttl"><h2>${mine?"Mon aquarium":"Aquarium de "+esc(p.pseudo||"Pêcheur")}</h2>${mine?`<button class="coins-btn" data-aq="shop" aria-label="Ouvrir la boutique">🪙 ${w?w.solde:"…"}</button>`:`<button class="btn sm" data-aq="mine">← Mon aquarium</button>`}</div>
  ${mine?`<div class="row" style="gap:8px;margin-bottom:10px"><button class="btn sm" style="flex:1" data-aq="shop">🛒 Boutique</button><button class="btn sm${AQ.edit?" primary":""}" style="flex:1" data-aq="edit">${AQ.edit?"✔ Terminer":"🛠️ Aménager"}</button></div>`:""}
  <p class="small muted" style="margin:-4px 0 10px">${list.length} poisson${list.length>1?"s":""} · ${nsp} espèce${nsp>1?"s":""} · ${esc((S.shop||[]).find(x=>x.item===cfg.tank)?.nom||"Petit aquarium")} (${cap} places)${list.length>cap?` · les ${cap} plus gros nagent${mine?", agrandis-le dans la boutique":""}`:""}</p>
  <div id="aq-wrap" class="${S.aqFull?"full":""}${S.aqList===false?" nolist":""}${S.aqList===true?" showlist":""}">
    <div id="aq-3d" class="${AQ.edit?"editing":""}"><div id="aq-cardwrap">${AQ.edit?"":aqCard()}</div><div id="aq-editwrap">${AQ.edit&&mine?aqEditBar():""}</div>
      <div class="aq-tools"><button class="btn sm" data-aq="mode" data-m="orbit" aria-pressed="${AQ.mode==="orbit"}">🔄 Tourner</button><button class="btn sm" data-aq="mode" data-m="walk" aria-pressed="${AQ.mode==="walk"}">🤿 Balade</button><button class="btn sm" data-aq="reset" aria-label="Recentrer">🎯</button><button class="btn sm" data-aq="full" aria-label="Plein écran">${S.aqFull?"✕":"⛶"}</button><button class="btn sm aq-lt" data-aq="list">🐟 ${list.length}</button></div>
      <div id="aq-joy" ${AQ.mode==="walk"?"":"hidden"}><div class="joy" id="aq-stick"><i></i></div><div class="joy-ud"><button class="btn sm" data-aq-up="1" aria-label="Monter">▲</button><button class="btn sm" data-aq-up="-1" aria-label="Descendre">▼</button></div></div>
      ${list.length?"":`<div class="aq-msg">${mine?"Ton aquarium est vide : chaque prise enregistrée y ajoute un poisson.":"Pas encore de poisson ici."}</div>`}
      <div class="aq-help small"${AQ.sel||AQ.edit?" hidden":""}>${AQ.mode==="walk"?"Joystick pour avancer, glisse pour regarder, ▲▼ pour monter/descendre":"1 doigt : tourner · 2 doigts : zoomer et déplacer · touche un poisson"}</div>
    </div>
    <aside id="aq-list"><div class="aq-lh"><b>${mine?"Mes poissons":"Ses poissons"}</b><select id="aq-sort" aria-label="Trier"><option value="taille"${sort==="taille"?" selected":""}>Par taille</option><option value="date"${sort==="date"?" selected":""}>Par date</option><option value="espece"${sort==="espece"?" selected":""}>Par espèce</option></select></div>
      <div class="aq-items">${list.map(k=>`<button data-aq="sel" data-id="${k.id}" aria-current="${String(AQ.sel)===String(k.id)}">${img(k.photo_path,"aq-th",spName(k.espece))}<span><b>${esc(spName(k.espece))}</b><span class="small muted">${Math.round(fishCm(k))} cm${k.taille?"":" (taille moyenne)"} · ${new Date(k.caught_at).toLocaleDateString("fr-FR")}</span></span></button>`).join("")||`<p class="small muted" style="padding:10px">Aucun poisson.</p>`}</div></aside>
  </div>${podium}${mine&&S.aqShop?shopView():""}`;
}

/* Joystick du mode balade */
(function(){let id=null,c=null;
  document.addEventListener("pointerdown",e=>{const s=e.target.closest&&e.target.closest("#aq-stick");if(!s)return;e.preventDefault();id=e.pointerId;const r=s.getBoundingClientRect();c={x:r.left+r.width/2,y:r.top+r.height/2,R:r.width/2};s.setPointerCapture(id);mv(e)});
  const mv=e=>{if(e.pointerId!==id||!AQ.eng)return;let dx=(e.clientX-c.x)/c.R,dy=(e.clientY-c.y)/c.R;const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}AQ.eng.walk.mv={x:dx,y:dy};const k=document.querySelector("#aq-stick i");if(k)k.style.transform=`translate(${dx*c.R*.6}px,${dy*c.R*.6}px)`};
  document.addEventListener("pointermove",mv);
  const end=e=>{if(e.pointerId!==id)return;id=null;if(AQ.eng)AQ.eng.walk.mv={x:0,y:0};const k=document.querySelector("#aq-stick i");if(k)k.style.transform=""};
  document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end);
  document.addEventListener("pointerdown",e=>{const b=e.target.closest&&e.target.closest("[data-aq-up]");if(b&&AQ.eng){AQ.eng.walk.up=+b.dataset.aqUp}});
  const stopUp=()=>{if(AQ.eng)AQ.eng.walk.up=0};document.addEventListener("pointerup",stopUp);document.addEventListener("pointercancel",stopUp);
})();
document.addEventListener("change",e=>{if(e.target.id==="aq-sort"){S.aqSort=e.target.value;e.target.blur();render()}});
document.addEventListener("click",e=>{
  const b=e.target.closest&&e.target.closest("[data-aq]");if(!b)return;const a=b.dataset.aq,E=AQ.eng;
  if(a==="sel"){aqSelect(b.dataset.id);if(b.closest(".aq-podium"))document.getElementById("aq-3d").scrollIntoView({behavior:"smooth",block:"center"});if(innerWidth<600&&S.aqList){S.aqList=false;const w=document.getElementById("aq-wrap");w.classList.remove("showlist");w.classList.add("nolist")}}
  else if(a==="shop"){S.aqShop=!S.aqShop;if(S.aqShop)aqWallet();render()}
  else if(a==="stab"){S.shopTab=b.dataset.t;render()}
  else if(a==="buy"){const it=(S.shop||[]).find(x=>x.item===b.dataset.item);if(!it)return;b.disabled=true;
    sb.rpc("peche_acheter",{p_item:it.item}).then(async({data,error})=>{if(error){toast(error.message.includes("pièces")?"Pas assez de pièces":error.message);b.disabled=false;return}
      S.aqWallet=data;await aqWallet();toast(`${it.nom} acheté !`);
      if(it.type!=="deco"){const d=S.aqData[S.user.id]=S.aqData[S.user.id]||{};d[it.type]=it.item;await aqSave()}
      else{AQ.edit=true;AQ.placing=it.item;S.aqShop=false;toast("Touche le sable pour poser : "+it.nom)}
      render()})}
  else if(a==="use"){const it=(S.shop||[]).find(x=>x.item===b.dataset.item),d=S.aqData[S.user.id]=S.aqData[S.user.id]||{};d[it.type]=it.item;aqSave();render()}
  else if(a==="edit"){AQ.edit=!AQ.edit;AQ.placing=null;AQ.dsel=null;if(AQ.edit){AQ.sel=null;AQ.follow=false;if(AQ.mode==="walk")AQ.mode="orbit";if(!S.shop)aqWallet()}else aqSave();render()}
  else if(a==="place"){AQ.placing=AQ.placing===b.dataset.item?null:b.dataset.item;AQ.dsel=null;aqEditUI()}
  else if(a==="drot"&&AQ.dsel!=null&&E){const D=myDecor()[AQ.dsel];D.r=+((D.r||0)+b.dataset.d*PI/6).toFixed(2);const g=E.decoLayer.children.find(o=>o.userData.di===AQ.dsel);if(g)g.rotation.y+=b.dataset.d*PI/6;E.decoSig=JSON.stringify(myDecor());aqSaveSoon()}
  else if(a==="ddel"&&AQ.dsel!=null&&E){myDecor().splice(AQ.dsel,1);AQ.dsel=null;buildDecor(E,myDecor());aqSaveSoon();aqEditUI()}
  else if(a==="unsel")aqSelect(null);
  else if(a==="follow"){AQ.follow=!AQ.follow;aqUI()}
  else if(a==="mode")setMode(b.dataset.m);
  else if(a==="reset"&&E){AQ.follow=false;AQ.sel=null;E.orb=aqHome();if(AQ.mode==="walk")setMode("walk");aqUI()}
  else if(a==="full"){S.aqFull=!S.aqFull;document.getElementById("aq-wrap").classList.toggle("full",S.aqFull);document.body.classList.toggle("aq-full",S.aqFull);b.textContent=S.aqFull?"✕":"⛶";setTimeout(aqResize,50)}
  else if(a==="list"){const vis=innerWidth<600?S.aqList===true:S.aqList!==false;S.aqList=!vis;const w=document.getElementById("aq-wrap");w.classList.toggle("nolist",S.aqList===false);w.classList.toggle("showlist",S.aqList===true);setTimeout(aqResize,50)}
  else if(a==="mine"){S.aqOwner=null;AQ.sel=null;if(b.dataset.go)S.tab="aquarium";render();scrollTo(0,0)}
  else if(a==="visit"){S.aqOwner=b.dataset.uid;AQ.sel=null;AQ.follow=false;S.tab="aquarium";S.viewProfile=null;render();scrollTo(0,0)}
});
