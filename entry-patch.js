/* Ajuste de acceso inicial — MPL Misión 3
   Desde la entrada solo se puede comenzar por B5, B7 o B8.
   A1 y A3 no son accesos iniciales. */
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
