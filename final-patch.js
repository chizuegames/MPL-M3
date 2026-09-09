/* =========================================================
   MPL — MISIÓN 3
   Epílogo FF.png antes del letrero final de MISIÓN CUMPLIDA.
   ========================================================= */

const missionEpilogueOverlay=document.getElementById("missionEpilogueOverlay");
const missionEpilogueContinue=document.getElementById("missionEpilogueContinue");

function showMissionCompleteSign(){
  missionEpilogueOverlay.classList.remove("show");
  missionSound();
  endOverlay.className="show mission";
  endTitle.textContent="MISIÓN CUMPLIDA";
  endSubtitle.textContent="Has escoltado a la enfermera jefe hasta el laboratorio.";
}

/* Sustituye el cierre inmediato de la misión por la escena FF. */
missionComplete=function(){
  if(state.ended)return;

  state.ended=true;
  state.gameLocked=true;
  turnOffScanner();
  encounter.classList.remove("show");

  if(typeof nursePassOverlay!=="undefined")nursePassOverlay.classList.remove("show");

  missionEpilogueOverlay.classList.add("show");
};

missionEpilogueContinue.addEventListener("click",showMissionCompleteSign);
