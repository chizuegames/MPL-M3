/* =========================================================
   MPL — MISIÓN 3
   Ajustes de acceso A1 y comportamiento de las dos enfermeras.
   ========================================================= */

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
  No marcamos una habitación como visitada al abrir su encuentro.
  Solo se considera visitada cuando Nova realmente entra mediante
  completeCurrentRoom()/moveToRoom().

  En las enfermeras reutilizamos exactamente las dos zonas de combate:
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
    /* Cruz: misma zona física de la pistola. */
    gunButton.style.display="block";
    /* Manos: misma zona física del puño. */
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
  Capturamos primero los clics de las zonas de pistola/puño solo cuando
  el encuentro actual es una enfermera. En combates normales se conserva
  exactamente el comportamiento original.
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

fistButton.addEventListener("click",function(event){
  if(!["healerHealth","healerEnergy"].includes(state.encounterMode))return;

  event.preventDefault();
  event.stopImmediatePropagation();

  /* Sale al mapa sin entrar en la habitación ni completar a la enfermera. */
  closeUnresolvedToMap();
},true);

/*
  Seguridad adicional: el antiguo botón especial y el botón VOLVER no
  intervienen en las enfermeras. Las decisiones se hacen exclusivamente
  sobre la cruz y las manos dibujadas en la carta.
*/
specialActionButton.style.display="none";

