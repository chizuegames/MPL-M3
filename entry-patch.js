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
  Manos de la enfermera: ocupa la misma zona donde normalmente está el puño.
  Sale al mapa sin entrar en la habitación ni completar el encuentro.
  Como la sala sigue incompleta, se puede regresar después y la enfermera
  volverá a mostrarse.
*/
fistButton.addEventListener("click",function(event){
  if(!["healerHealth","healerEnergy"].includes(state.encounterMode))return;

  event.preventDefault();
  event.stopImmediatePropagation();
  closeUnresolvedToMap();
},true);

/* El botón especial anterior queda fuera de uso para las enfermeras. */
specialActionButton.style.display="none";
