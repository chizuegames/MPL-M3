/* =========================================================
   MPL — MISIÓN 3
   Ajustes de entrada, A1 y comportamiento de enfermeras.
   ========================================================= */

/* Corrección del evento B9: usa sus imágenes propias. */
const b9Event=B_EVENT_POOL.find(d=>d.sourceId==="B9");
if(b9Event){
  b9Event.card="B9E.png";
  b9Event.finalCard="B9F.png";
}
Object.values(DEFINITIONS).forEach(d=>{
  if(d&&d.sourceId==="B9"){
    d.card="B9E.png";
    d.finalCard="B9F.png";
  }
});

/*
  Corrección del evento aleatorio B8 (Enfermera de soporte).
  B8 usa exclusivamente B8E/B8F. Como los eventos B son aleatorios,
  este evento puede aparecer físicamente en cualquier habitación B.
*/
const b8Event=B_EVENT_POOL.find(d=>d.sourceId==="B8");
if(b8Event){
  b8Event.card="B8E.png";
  b8Event.finalCard="B8F.png";
}
Object.values(DEFINITIONS).forEach(d=>{
  if(d&&d.sourceId==="B8"){
    d.card="B8E.png";
    d.finalCard="B8F.png";
  }
});

/* Desde la entrada solo se puede comenzar por B5, B7 o B8. */
GRAPH.ENTRADA=["B5","B7","B8"];

/* Orientación de los indicadores del escáner desde la entrada. */
const directionBetweenM3Base=directionBetween;
directionBetween=function(from,to){
  if(from==="ENTRADA"){
    if(to==="B5")return "left";
    if(to==="B7")return "right";
    if(to==="B8")return "up";
  }
  return directionBetweenM3Base(from,to);
};

/*
  Si un encuentro se abandona sin resolver, Nova vuelve al mapa en la
  habitación desde la que intentó entrar. La habitación del encuentro
  queda revelada, pero NO visitada ni completada.
*/
closeUnresolvedToMap=function(messageText=""){
  const room=state.pendingRoom;
  if(!room)return;

  state.rooms[room].revealed=true;
  encounter.classList.remove("show");
  state.pendingRoom=null;
  state.encounterMode=null;
  resetEncounterUI();
  turnOffScanner();
  refreshRoomMarkers();

  if(messageText)setTimeout(()=>showMessage(messageText),100);
};

/*
  No se marca una habitación como visitada al abrir su encuentro.
  Solo se considera visitada cuando Nova realmente entra mediante
  completeCurrentRoom()/moveToRoom().

  En las dos enfermeras se reutilizan las zonas de combate:
  - zona de pistola (izquierda) = cruz médica = activar evento final.
  - zona de puño (derecha) = manos = salir sin resolver el evento.
*/
openEncounter=function(room){
  const d=definitionFor(room);
  turnOffScanner();
  state.pendingRoom=room;
  resetEncounterUI();
  setEncounterImage(d.card);
  encounterImage.alt=d.label;
  encounter.classList.add("show");
  state.encounterMode=d.type;

  if(d.type==="combat"){
    encounterCard.classList.add("combat");
    enemyHp.style.display="flex";
    gunButton.style.display="block";
    fistButton.style.display="block";
    const hp=currentEnemyHp(d);
    state.combat={room,sourceId:d.sourceId||room,hp,lastHit:null,fists:0,guns:0};
    enemyHp.textContent=hp;
    return;
  }

  if(d.type==="healerHealth"||d.type==="healerEnergy"){
    encounterCard.classList.add("nurse-choice");
    gunButton.style.display="block";
    fistButton.style.display="block";
    specialActionButton.style.display="none";
    encounterBackButton.style.display="none";
    return;
  }

  if(d.type==="nurseChief"){
    encounterCard.style.cursor="pointer";
    return;
  }

  if(d.type==="lab"){
    encounterCard.style.cursor="pointer";
    return;
  }

  encounterCard.style.cursor="pointer";
};

/*
  Cruz de la enfermera: ocupa la misma zona donde normalmente está la pistola.
  Activa la imagen final del evento. Al cerrar ese final la habitación queda
  completada, por lo que esa enfermera ya no vuelve a aparecer.
*/
gunButton.addEventListener("click",function(event){
  if(!["healerHealth","healerEnergy"].includes(state.encounterMode))return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const d=definitionFor(state.pendingRoom);
  state.encounterMode="specialFinal";
  encounterCard.classList.remove("nurse-choice");
  gunButton.style.display="none";
  fistButton.style.display="none";
  specialActionButton.style.display="none";
  encounterBackButton.style.display="none";
  setEncounterImage(d.finalCard);
  encounterCard.style.cursor="pointer";
  itemSound();
  if(d.reward)showMessage(d.reward);
},true);

/*
  Manos de la enfermera: sale al mapa sin entrar ni completar el encuentro.
  Además se recuerda que el jugador decidió dejar a esa enfermera para después.
  Desde ese momento podrá atravesar su estancia sin que el evento sea obligatorio.
*/
fistButton.addEventListener("click",function(event){
  if(!["healerHealth","healerEnergy"].includes(state.encounterMode))return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const room=state.pendingRoom;
  if(room&&state.rooms[room])state.rooms[room].nurseSkipped=true;
  closeUnresolvedToMap();
},true);

/* El botón especial anterior queda fuera de uso para las enfermeras. */
specialActionButton.style.display="none";

/* =========================================================
   ENFERMERA DEJADA PARA DESPUÉS
   Si el jugador ya rechazó a una enfermera con el icono de manos,
   al volver a su estancia aparece un letrero con dos opciones:
   ENTRAR AL ENCUENTRO o CONTINUAR por la habitación.
   ========================================================= */
function isSupportNurse(room){
  const d=definitionFor(room);
  return !!d&&(d.type==="healerHealth"||d.type==="healerEnergy");
}

const nursePassOverlay=document.createElement("div");
nursePassOverlay.id="nursePassOverlay";
nursePassOverlay.innerHTML=`
  <div id="nursePassPanel">
    <div id="nursePassTitle">ENFERMERA DE SOPORTE</div>
    <div id="nursePassText">La enfermera sigue aquí. ¿Quieres entrar al encuentro o continuar por la estancia?</div>
    <div id="nursePassActions">
      <button id="nurseEnterButton" type="button">ENTRAR AL ENCUENTRO</button>
      <button id="nurseContinueButton" type="button">CONTINUAR</button>
    </div>
  </div>`;
document.body.appendChild(nursePassOverlay);

const nurseEnterButton=document.getElementById("nurseEnterButton");
const nurseContinueButton=document.getElementById("nurseContinueButton");
let nursePassRoom=null;
let nursePassNeedsMovement=false;

function hideNursePassChoice(){
  nursePassOverlay.classList.remove("show");
  nursePassRoom=null;
  nursePassNeedsMovement=false;
}

function showNursePassChoice(room,needsMovement=true){
  nursePassRoom=room;
  nursePassNeedsMovement=needsMovement;
  nursePassOverlay.classList.add("show");
}

function payNurseRoomMovement(room){
  if(!nursePassNeedsMovement)return true;
  const cost=getMovementOxygenCost(room);
  return cost<=0||consumeOxygen(cost);
}

nurseEnterButton.addEventListener("click",()=>{
  const room=nursePassRoom;
  if(!room)return;
  if(!payNurseRoomMovement(room)){hideNursePassChoice();return}
  hideNursePassChoice();
  openEncounter(room);
});

nurseContinueButton.addEventListener("click",()=>{
  const room=nursePassRoom;
  if(!room)return;

  if(nursePassNeedsMovement){
    if(!payNurseRoomMovement(room)){hideNursePassChoice();return}
    turnOffScanner();
    moveToRoom(room);
  }

  hideNursePassChoice();
});

/*
  Reemplaza el manejo de clic en habitaciones para incorporar la elección
  de atravesar una enfermera previamente rechazada.
*/
handleRoomClick=function(room){
  if(state.gameLocked||state.ended||encounter.classList.contains("show")||nursePassOverlay.classList.contains("show"))return;

  /* Si Nova ya está sobre una enfermera pendiente, puede tocar la estancia
     y decidir si quiere entrar al encuentro sin pagar oxígeno adicional. */
  if(room===state.currentRoom){
    if(isSupportNurse(room)&&!state.rooms[room].completed&&state.rooms[room].nurseSkipped){
      showNursePassChoice(room,false);
      return;
    }
    showMessage("ESTÁS EN ESTA SALA");
    return;
  }

  if(!isAdjacent(room)){
    showMessage("SOLO PUEDES IR A UNA SALA ALEDAÑA");
    return;
  }

  if(state.scannerActive&&!state.rooms[room].revealed){
    revealRoom(room);
    return;
  }

  /* Una enfermera que ya fue rechazada deja de bloquear el camino. */
  if(isSupportNurse(room)&&!state.rooms[room].completed&&state.rooms[room].nurseSkipped){
    showNursePassChoice(room,true);
    return;
  }

  const cost=getMovementOxygenCost(room);
  if(cost>0&&!consumeOxygen(cost))return;

  if(state.rooms[room].completed){
    turnOffScanner();
    moveToRoom(room);
    return;
  }

  openEncounter(room);
};
