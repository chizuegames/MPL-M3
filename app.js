/* =========================================================
   MPL — MISIÓN 3
   Base recuperada de MPL-M2 y adaptada al Excel de Misión 3.
   ========================================================= */

const ASSETS={
  introIncoming:"M01a.png",
  introMission:"M01b.png",
  stationOnly:"MIa.png",
  dockedStation:"MIb.png",
  playerShip:"NVNova.png",
  playerIcon:"ICONOVA.png",
  nurseIcon:"ICOEMF.png",
  checkIcon:"icocheck.png",
  scanIcon:"Esc1.png",
  map100:"MIc100.png",
  map60:"MIc60.png",
  map20:"MIc20.png"
};

/*
  Centros de las 23 habitaciones sobre MIc100.png.
  La disposición corresponde al diagrama entregado para MPL3.
*/
const ROOM_LAYOUT={
  A11:{x:13.6,y:20.3}, A12:{x:29.2,y:20.3}, A13:{x:70.8,y:20.3}, A14:{x:86.4,y:20.3},
  B1:{x:13.6,y:29.5},  B3:{x:29.2,y:29.5},  A10:{x:50.0,y:29.5}, B4:{x:70.8,y:29.5}, B2:{x:86.4,y:29.5},
  A9:{x:50.0,y:39.7},
  A7:{x:29.2,y:49.5},  B8:{x:50.0,y:49.5},  A8:{x:70.8,y:49.5},
  A5:{x:13.6,y:59.2},  B5:{x:29.2,y:59.2},  B7:{x:70.8,y:59.2}, A6:{x:86.4,y:59.2},
  B6:{x:13.6,y:69.5},  A1:{x:29.2,y:69.5},  A2:{x:70.8,y:69.5}, B9:{x:86.4,y:69.5},
  A3:{x:13.6,y:79.4},  A4:{x:86.4,y:79.4}
};

/* Puertas rojas del esquema. El acceso inicial entra por el corredor central a B8. */
const GRAPH={
  ENTRADA:["B8"],
  A11:["A12","B1"], A12:["A11"],
  A13:["A14"], A14:["A13","B2"],
  B1:["A11","B3"], B3:["B1","A10"], A10:["B3","B4","A9"], B4:["A10","B2"], B2:["B4","A14"],
  A9:["A10","B8"],
  A7:["B8","B5"], B8:["A9","A7","A8"], A8:["B8","B7"],
  A5:["B5","B6"], B5:["A7","A5"], B7:["A8","A6"], A6:["B7","B9"],
  B6:["A5","A1","A3"], A1:["B6"], A2:["B9"], B9:["A6","A2","A4"],
  A3:["B6"], A4:["B9"]
};

const FIXED_DEFINITIONS={
  A1:{type:"lab",label:"LABORATORIO",card:"A1E.png",finalCard:"A1F.png",icon:"ICOBT.png"},
  A2:{type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  A3:{type:"healerHealth",label:"ENFERMERA",card:"A3E.png",finalCard:"A3F.png",icon:"ICOEMF.png",reward:"+3 VIDA<br>−2 ENERGÍA"},
  A4:{type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"},
  A5:{type:"combat",label:"MARCIANO ROJO",card:"A5E.png",finalCard:"A5F.png",icon:"ICOMR.png",hp:{100:2,60:3,20:4},condition:"fistsAtLeastGuns"},
  A6:{type:"simple",label:"SALA VACÍA",card:"SLV.png",icon:null,isEmpty:true},
  A7:{type:"combat",label:"MARCIANO VERDE E",card:"A7E.png",finalCard:"A7F.png",icon:"ICOMV.png",hp:{100:2,60:3,20:3},condition:"lastFist"},
  A8:{type:"combat",label:"MARCIANO MORADO",card:"A4E.png",finalCard:"A4F.png",icon:"ICOMM.png",hp:{100:1,60:2,20:2},condition:"lastGun"},
  A9:{type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png",reward:"PIERDE 1 DE VIDA"},
  A10:{type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  A11:{type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"},
  A12:{type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  A13:{type:"nurseChief",label:"ENFERMERA JEFE",card:"A13E.png",finalCard:"A13F.png",icon:"ICOEMF.png"},
  A14:{type:"simple",label:"SALA VACÍA",card:"SLV.png",icon:null,isEmpty:true}
};

/* Las nueve fichas B se sortean una sola vez, sin repetir ninguna ficha. */
const B_EVENT_POOL=[
  {sourceId:"B1",type:"simple",label:"VIDA",card:"SDV.png",icon:"ICOV.png",reward:"+1 VIDA"},
  {sourceId:"B2",type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  {sourceId:"B3",type:"combat",label:"MARCIANO MORADO",card:"A4E.png",finalCard:"A4F.png",icon:"ICOMM.png",hp:{100:1,60:2,20:2},condition:"lastGun"},
  {sourceId:"B4",type:"combat",label:"MARCIANO VERDE E",card:"A7E.png",finalCard:"A7F.png",icon:"ICOMV.png",hp:{100:2,60:3,20:3},condition:"lastFist"},
  {sourceId:"B5",type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"},
  {sourceId:"B6",type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  {sourceId:"B7",type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png",reward:"PIERDE 1 DE VIDA"},
  {sourceId:"B8",type:"healerEnergy",label:"ENFERMERA",card:"A13E.png",finalCard:"A13F.png",icon:"ICOEMF.png",reward:"+4 ENERGÍA<br>DESCARTA 1 OBJETO"},
  {sourceId:"B9",type:"combat",label:"MARCIANO ROJO",card:"A9E.png",finalCard:"A9F.png",icon:"ICOMR.png",hp:{100:2,60:3,20:4},condition:"fistsAtLeastGuns"}
];

const DEFINITIONS={...FIXED_DEFINITIONS};
function randomIndex(max){
  if(window.crypto&&window.crypto.getRandomValues){const d=new Uint32Array(1);window.crypto.getRandomValues(d);return d[0]%max}
  return Math.floor(Math.random()*max);
}
function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=randomIndex(i+1);[r[i],r[j]]=[r[j],r[i]]}return r}
function randomizeB(){
  const rooms=["B1","B2","B3","B4","B5","B6","B7","B8","B9"];
  const draw=shuffle(B_EVENT_POOL).map(d=>({...d,hp:d.hp?{...d.hp}:undefined}));
  rooms.forEach((room,i)=>DEFINITIONS[room]=draw[i]);
}
randomizeB();
function definitionFor(room){return DEFINITIONS[room]||{type:"simple",label:"SALA VACÍA",card:"SLV.png",icon:null,isEmpty:true}}

const state={
  currentRoom:"ENTRADA",
  oxygen:100,
  scannerActive:false,
  pendingRoom:null,
  encounterMode:null,
  combat:null,
  gameLocked:true,
  ended:false,
  nurseActive:false,
  nurseRoom:null,
  rooms:{}
};
Object.keys(ROOM_LAYOUT).forEach(r=>state.rooms[r]={revealed:false,completed:false,visited:false});

const $=id=>document.getElementById(id);
const introOverlay=$("introOverlay"),introPage1=$("introPage1"),introPage2=$("introPage2"),dockPage=$("dockPage"),
acceptMissionButton=$("acceptMissionButton"),dockBaseImage=$("dockBaseImage"),dockShip=$("dockShip"),dockFlash=$("dockFlash"),
game=$("game"),mapImage=$("mapImage"),roomsLayer=$("roomsLayer"),iconsLayer=$("iconsLayer"),scannerButton=$("scannerButton"),
useObjectButton=$("useObjectButton"),musicButton=$("musicButton"),oxygenCounter=$("oxygenCounter"),tutorialOverlay=$("tutorialOverlay"),
tutorialText=$("tutorialText"),tutorialNext=$("tutorialNext"),encounter=$("encounter"),encounterCard=$("encounterCard"),
encounterImage=$("encounterImage"),enemyHp=$("enemyHp"),gunButton=$("gunButton"),fistButton=$("fistButton"),
specialActionButton=$("specialActionButton"),encounterBackButton=$("encounterBackButton"),message=$("message"),
endOverlay=$("endOverlay"),endTitle=$("endTitle"),endSubtitle=$("endSubtitle"),introMusic=$("introMusic"),bgMusic=$("bgMusic");

let messageTimer=null,musicPlaying=false,combatLocked=false,introLocked=false,audioCtx=null,tutorialIndex=0;
introMusic.volume=.34; bgMusic.volume=.32;

function buildRooms(){
  Object.entries(ROOM_LAYOUT).forEach(([room,p])=>{
    const b=document.createElement("button");
    b.type="button"; b.className="room"; b.id=`room-${room}`; b.setAttribute("aria-label",`Habitación ${room}`);
    b.style.left=`${p.x}%`; b.style.top=`${p.y}%`;
    b.addEventListener("click",()=>handleRoomClick(room));
    roomsLayer.appendChild(b);
  });
}
buildRooms();

const preload=[...Object.values(ASSETS)];
Object.values(DEFINITIONS).forEach(d=>[d.card,d.finalCard,d.icon].filter(Boolean).forEach(x=>preload.push(x)));
preload.filter(Boolean).forEach(src=>{const i=new Image();i.src=src});

function getAudioContext(){
  try{if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;audioCtx=new C()}if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx}catch(e){return null}
}
function toneSweep(a,b,d,v=.1,t="sine"){
  try{const c=getAudioContext();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=t;o.frequency.setValueAtTime(a,c.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(20,b),c.currentTime+d);g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d+.02)}catch(e){}
}
function scannerSound(){toneSweep(380,1240,.48,.085,"sine")}
function punchSound(){toneSweep(165,48,.17,.32,"triangle")}
function lifeLossSound(){[270,195,128].forEach((f,i)=>setTimeout(()=>toneSweep(f,f*.92,.11,.07,"square"),i*60))}
function gunSound(){toneSweep(1250,170,.15,.2,"sawtooth")}
function energyLossSound(){toneSweep(720,180,.33,.11,"sine")}
function itemSound(){toneSweep(520,900,.24,.08,"triangle")}
function deathSound(){[430,300,180,95].forEach((f,i)=>setTimeout(()=>toneSweep(f,Math.max(45,f*.55),.2,.11,i<2?"square":"sawtooth"),i*85))}
function gameOverSound(){toneSweep(240,45,1.1,.18,"sawtooth")}
function missionSound(){[520,690,880,1180].forEach((f,i)=>setTimeout(()=>toneSweep(f,f*1.02,.22,.08,"sine"),i*120))}
function dockingTravelSound(){toneSweep(58,98,2.25,.09,"sawtooth")}
function dockingImpactSound(){toneSweep(115,42,.25,.24,"square");setTimeout(()=>toneSweep(610,610,.11,.08,"sine"),170);setTimeout(()=>toneSweep(830,830,.11,.08,"sine"),270)}

function showIntroPage(page){[introPage1,introPage2,dockPage].forEach(x=>x.classList.remove("active"));page.classList.add("active")}
introPage1.addEventListener("click",async()=>{
  if(introLocked)return;
  getAudioContext(); showIntroPage(introPage2);
  try{introMusic.currentTime=0;await introMusic.play()}catch(e){}
});
function crossfadeToGameMusic(){
  bgMusic.volume=.03;
  bgMusic.play().then(()=>{musicPlaying=true;musicButton.classList.add("music-on")}).catch(()=>{});
  let current=0;const steps=18,start=introMusic.volume;
  const timer=setInterval(()=>{current++;const p=current/steps;introMusic.volume=Math.max(0,start*(1-p));bgMusic.volume=.03+(.32-.03)*p;if(current>=steps){clearInterval(timer);introMusic.pause();introMusic.currentTime=0;introMusic.volume=.34;bgMusic.volume=.32}},65);
}
acceptMissionButton.addEventListener("click",e=>{
  e.stopPropagation();if(introLocked)return;introLocked=true;getAudioContext();crossfadeToGameMusic();dockingTravelSound();startDockingSequence();
});
function startDockingSequence(){
  showIntroPage(dockPage);dockBaseImage.src=ASSETS.stationOnly;dockShip.src=ASSETS.playerShip;dockShip.style.display="block";dockShip.classList.remove("docking");void dockShip.offsetWidth;
  setTimeout(()=>dockShip.classList.add("docking"),180);
  setTimeout(()=>{dockingImpactSound();dockFlash.classList.remove("flash");void dockFlash.offsetWidth;dockFlash.classList.add("flash");dockBaseImage.src=ASSETS.dockedStation;dockShip.style.display="none"},2450);
  setTimeout(startGame,3150);
}
function startGame(){mapImage.src=ASSETS.map100;state.oxygen=100;updateOxygenUI();introOverlay.style.display="none";game.style.display="block";window.scrollTo(0,0);refreshRoomMarkers();showTutorial()}

async function toggleMusic(){
  if(!musicPlaying){try{await bgMusic.play();musicPlaying=true;musicButton.classList.add("music-on")}catch(e){showMessage("NO SE PUDO ACTIVAR LA MÚSICA")}return}
  bgMusic.pause();musicPlaying=false;musicButton.classList.remove("music-on");
}
musicButton.addEventListener("click",e=>{e.stopPropagation();toggleMusic()});

/* En MPL3 se elimina el recordatorio inicial sobre el oxígeno. */
const TUTORIAL_MESSAGES=[
  "Durante esta misión, el Intergalactic Purée recupera x2 puntos de vida. No olvides llevar una batería de emergencia.",
  "Si necesitas usar un objeto, da clic en USAR OBJETO."
];
function showTutorial(){state.gameLocked=true;tutorialIndex=0;tutorialText.textContent=TUTORIAL_MESSAGES[0];tutorialNext.textContent="SIGUIENTE";tutorialOverlay.classList.add("show")}
tutorialNext.addEventListener("click",()=>{
  tutorialIndex++;
  if(tutorialIndex>=TUTORIAL_MESSAGES.length){tutorialOverlay.classList.remove("show");state.gameLocked=false;return}
  tutorialText.textContent=TUTORIAL_MESSAGES[tutorialIndex];tutorialNext.textContent="ENTENDIDO";
});

function showMessage(html){clearTimeout(messageTimer);message.classList.remove("show");void message.offsetWidth;message.innerHTML=html;message.classList.add("show");messageTimer=setTimeout(()=>message.classList.remove("show"),1400)}
function oxygenPhase(){if(state.oxygen<20)return 20;if(state.oxygen<60)return 60;return 100}
function formatOxygen(v){return `${Number.isInteger(v)?v:v.toFixed(1).replace(".",",")}%`}
function updateOxygenUI(){
  const p=oxygenPhase();oxygenCounter.textContent=formatOxygen(state.oxygen);oxygenCounter.classList.remove("phase60","phase20");
  mapImage.src=p===100?ASSETS.map100:p===60?ASSETS.map60:ASSETS.map20;
  if(p===60)oxygenCounter.classList.add("phase60");if(p===20)oxygenCounter.classList.add("phase20");
}
function consumeOxygen(amount){
  if(state.ended)return false;state.oxygen=Math.max(0,Math.round((state.oxygen-amount)*10)/10);updateOxygenUI();
  if(state.oxygen<=0){triggerGameOver();return false}return true;
}
function getMovementOxygenCost(target){if(state.currentRoom==="ENTRADA")return 0;if(state.rooms[target]&&state.rooms[target].visited)return 2.5;return 5}
useObjectButton.addEventListener("click",()=>{
  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  itemSound();if(consumeOxygen(5))showMessage("OBJETO UTILIZADO<br>−5% O₂");
});

function removeMarker(id){const e=$(id);if(e)e.remove()}
function imageAt(id,room,src,cls){removeMarker(id);const p=ROOM_LAYOUT[room];if(!p||!src)return null;const el=document.createElement("img");el.id=id;el.draggable=false;el.src=src;el.className=cls;el.style.left=`${p.x}%`;el.style.top=`${p.y}%`;iconsLayer.appendChild(el);return el}
function eventMarker(room,src){return imageAt(`event-${room}`,room,src,"map-icon event-icon")}
function clearMarkers(){
  removeMarker("player-marker");removeMarker("nurse-marker");
  Object.keys(ROOM_LAYOUT).forEach(r=>{removeMarker(`check-${r}`);removeMarker(`event-${r}`);removeMarker(`scan-${r}`)});
}
function refreshRoomMarkers(){
  const scannerWasOn=state.scannerActive;
  clearMarkers();
  if(state.currentRoom!=="ENTRADA")imageAt("player-marker",state.currentRoom,ASSETS.playerIcon,"player-image");
  Object.keys(ROOM_LAYOUT).forEach(r=>{
    const s=state.rooms[r],d=definitionFor(r);if(r===state.currentRoom)return;
    if(s.completed){imageAt(`check-${r}`,r,ASSETS.checkIcon,"check-image");return}
    if(s.revealed&&d.icon)eventMarker(r,d.icon);
  });
  if(state.nurseActive&&state.nurseRoom&&state.nurseRoom!==state.currentRoom)imageAt("nurse-marker",state.nurseRoom,ASSETS.nurseIcon,"nurse-image");
  if(scannerWasOn){adjacentRooms().forEach(r=>{const s=state.rooms[r];if(!s.completed&&!s.revealed)scanMarker(r)})}
}
function moveToRoom(room,moveFollower=true){
  const previous=state.currentRoom;
  state.currentRoom=room;state.rooms[room].visited=true;
  if(state.nurseActive&&moveFollower&&previous!=="ENTRADA"&&previous!==room)state.nurseRoom=previous;
  refreshRoomMarkers();
}
function adjacentRooms(){return GRAPH[state.currentRoom]||[]}
function isAdjacent(room){return adjacentRooms().includes(room)}
function directionBetween(from,to){
  if(from==="ENTRADA")return"up";
  const a=ROOM_LAYOUT[from],b=ROOM_LAYOUT[to];if(!a||!b)return"up";
  const dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up");
}
function scanMarker(room){return imageAt(`scan-${room}`,room,ASSETS.scanIcon,`scan-image dir-${directionBetween(state.currentRoom,room)}`)}
function turnOffScanner(){state.scannerActive=false;scannerButton.classList.remove("scanner-on");Object.keys(ROOM_LAYOUT).forEach(r=>removeMarker(`scan-${r}`))}
function scanNearbyRooms(){
  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  if(state.scannerActive){turnOffScanner();return}
  let count=0;adjacentRooms().forEach(r=>{const s=state.rooms[r];if(!s.completed&&!s.revealed){if(scanMarker(r))count++}});
  if(!count){showMessage("SIN NUEVAS SEÑALES");return}
  state.scannerActive=true;scannerButton.classList.add("scanner-on");scannerSound();
}
scannerButton.addEventListener("click",scanNearbyRooms);
function revealRoom(room){
  const s=state.rooms[room],d=definitionFor(room);if(!s)return;s.revealed=true;removeMarker(`scan-${room}`);if(d.icon)eventMarker(room,d.icon);energyLossSound();showMessage(`${d.label}<br>−2 ENERGÍAS`);
}

function setEncounterImage(src){encounterImage.onerror=null;encounterImage.src=src||""}
function resetEncounterUI(){
  encounterCard.className="";encounterCard.style.cursor="default";enemyHp.style.display="none";gunButton.style.display="none";fistButton.style.display="none";specialActionButton.style.display="none";encounterBackButton.style.display="none";combatLocked=false;state.combat=null;
}
function currentEnemyHp(d){return d.hp?d.hp[oxygenPhase()]:0}
function openEncounter(room){
  const d=definitionFor(room);turnOffScanner();state.pendingRoom=room;state.rooms[room].visited=true;resetEncounterUI();setEncounterImage(d.card);encounterImage.alt=d.label;encounter.classList.add("show");state.encounterMode=d.type;
  if(d.type==="combat"){
    encounterCard.classList.add("combat");enemyHp.style.display="flex";gunButton.style.display="block";fistButton.style.display="block";
    const hp=currentEnemyHp(d);state.combat={room,sourceId:d.sourceId||room,hp,lastHit:null,fists:0,guns:0};enemyHp.textContent=hp;return;
  }
  if(d.type==="healerHealth"||d.type==="healerEnergy"){
    encounterCard.classList.add("special");specialActionButton.style.display="block";encounterBackButton.style.display="block";return;
  }
  if(d.type==="nurseChief"){encounterCard.style.cursor="pointer";return}
  if(d.type==="lab"){encounterCard.style.cursor="pointer";return}
  encounterCard.style.cursor="pointer";
}

function completeCurrentRoom(options={}){
  const room=state.pendingRoom;if(!room)return;
  const d=definitionFor(room);state.rooms[room].completed=true;state.rooms[room].revealed=true;
  encounter.classList.remove("show");state.pendingRoom=null;state.encounterMode=null;resetEncounterUI();
  if(options.activateNurse){state.nurseActive=true;state.nurseRoom=room;moveToRoom(room,false)}else moveToRoom(room);
  const reward=options.reward??d.reward;if(reward)setTimeout(()=>showMessage(reward),120);
}
function closeUnresolvedToMap(messageText=""){
  const room=state.pendingRoom;if(!room)return;state.rooms[room].revealed=true;encounter.classList.remove("show");state.pendingRoom=null;state.encounterMode=null;resetEncounterUI();moveToRoom(room);if(messageText)setTimeout(()=>showMessage(messageText),100);
}
function animateHit(){encounterCard.classList.remove("hit");void encounterCard.offsetWidth;encounterCard.classList.add("hit")}
function combatConditionMet(d,c){
  if(!d.finalCard)return false;
  if(d.condition==="lastFist")return c.lastHit==="fist";
  if(d.condition==="lastGun")return c.lastHit==="gun";
  if(d.condition==="fistsAtLeastGuns")return c.fists>=c.guns;
  return true;
}
function attack(kind){
  if(state.encounterMode!=="combat"||combatLocked||!state.combat||state.ended)return;
  combatLocked=true;const c=state.combat;c.lastHit=kind;
  if(kind==="fist"){c.fists++;punchSound();setTimeout(lifeLossSound,65);showMessage("−1 VIDA")}else{c.guns++;gunSound();setTimeout(energyLossSound,65);showMessage("−1 ENERGÍA")}
  c.hp=Math.max(0,c.hp-1);enemyHp.textContent=c.hp;animateHit();
  setTimeout(()=>{
    if(c.hp>0){combatLocked=false;return}
    const d=definitionFor(c.room);
    if(combatConditionMet(d,c)){
      state.encounterMode="final";encounterCard.classList.remove("combat");enemyHp.style.display="none";gunButton.style.display="none";fistButton.style.display="none";setEncounterImage(d.finalCard);encounterCard.style.cursor="pointer";combatLocked=false;return;
    }
    deathSound();setTimeout(()=>completeCurrentRoom(),430);
  },320);
}
gunButton.addEventListener("click",e=>{e.stopPropagation();attack("gun")});
fistButton.addEventListener("click",e=>{e.stopPropagation();attack("fist")});

specialActionButton.addEventListener("click",e=>{
  e.stopPropagation();
  if(!["healerHealth","healerEnergy"].includes(state.encounterMode))return;
  const d=definitionFor(state.pendingRoom);state.encounterMode="specialFinal";encounterCard.classList.remove("special");specialActionButton.style.display="none";encounterBackButton.style.display="none";setEncounterImage(d.finalCard);encounterCard.style.cursor="pointer";itemSound();showMessage(d.reward);
});
encounterBackButton.addEventListener("click",e=>{
  e.stopPropagation();if(["healerHealth","healerEnergy"].includes(state.encounterMode))closeUnresolvedToMap();
});

encounterCard.addEventListener("click",e=>{
  if(e.target===gunButton||e.target===fistButton||e.target===specialActionButton||e.target===encounterBackButton)return;
  const mode=state.encounterMode;if(!mode)return;
  if(mode==="simple"){completeCurrentRoom();return}
  if(mode==="final"){completeCurrentRoom();return}
  if(mode==="specialFinal"){completeCurrentRoom({reward:null});return}
  if(mode==="nurseChief"){
    const d=definitionFor(state.pendingRoom);state.encounterMode="nurseChiefFinal";setEncounterImage(d.finalCard);itemSound();return;
  }
  if(mode==="nurseChiefFinal"){completeCurrentRoom({activateNurse:true,reward:"LA ENFERMERA JEFE TE SIGUE"});return}
  if(mode==="lab"){
    if(!state.nurseActive){closeUnresolvedToMap("NECESITAS A LA ENFERMERA JEFE");return}
    const d=definitionFor(state.pendingRoom);state.encounterMode="missionFinal";setEncounterImage(d.finalCard);dockingImpactSound();return;
  }
  if(mode==="missionFinal"){
    const room=state.pendingRoom;if(room){state.rooms[room].completed=true;state.rooms[room].revealed=true}missionComplete();
  }
});

function handleRoomClick(room){
  if(state.gameLocked||state.ended||encounter.classList.contains("show"))return;
  if(room===state.currentRoom){showMessage("ESTÁS EN ESTA SALA");return}
  if(!isAdjacent(room)){showMessage("SOLO PUEDES IR A UNA SALA ALEDAÑA");return}
  if(state.scannerActive&&!state.rooms[room].revealed){revealRoom(room);return}
  const cost=getMovementOxygenCost(room);if(cost>0&&!consumeOxygen(cost))return;
  if(state.rooms[room].completed){turnOffScanner();moveToRoom(room);return}
  openEncounter(room);
}

function triggerGameOver(){
  if(state.ended)return;state.ended=true;state.gameLocked=true;turnOffScanner();encounter.classList.remove("show");gameOverSound();endOverlay.className="show gameover";endTitle.textContent="GAME OVER";endSubtitle.textContent="Te has quedado sin oxígeno.";
}
function missionComplete(){
  if(state.ended)return;state.ended=true;state.gameLocked=true;turnOffScanner();encounter.classList.remove("show");missionSound();endOverlay.className="show mission";endTitle.textContent="MISIÓN CUMPLIDA";endSubtitle.textContent="Has escoltado a la enfermera jefe hasta el laboratorio.";
}

let lastTouchEnd=0;
document.addEventListener("touchend",e=>{const now=Date.now();if(now-lastTouchEnd<=300)e.preventDefault();lastTouchEnd=now},{passive:false});
