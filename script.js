// --- SECCIÓN ---
const btnCalculadora=document.getElementById("btnCalculadora");
const btnPerfil=document.getElementById("btnPerfil");
const calculadoraDiv=document.getElementById("calculadora");
const perfilDiv=document.getElementById("perfil");

btnCalculadora.addEventListener("click",()=>{calculadoraDiv.style.display="block"; perfilDiv.style.display="none"; calculadoraDiv.scrollIntoView({behavior:"smooth"});});
btnPerfil.addEventListener("click",()=>{calculadoraDiv.style.display="none"; perfilDiv.style.display="block"; perfilDiv.scrollIntoView({behavior:"smooth"});});

// --- CALCULADORA ---
const prestamoInput=document.getElementById("prestamo");
const interesInput=document.getElementById("interes");
const anosInput=document.getElementById("anos");
const cuotaOut=document.getElementById("cuota");
const interesesTotalesOut=document.getElementById("interesesTotales");
const totalPagadoOut=document.getElementById("totalPagado");
const resultadosDiv=document.getElementById("resultados");
const verTablaBtn=document.getElementById("verTabla");
const tablaContainer=document.getElementById("tablaContainer");
const tbody=document.querySelector("#tabla tbody");

function formatMoney(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}
function calcular(){
  const capital=parseFloat(prestamoInput.value)||0;
  const interes=(parseFloat(interesInput.value)/100)/12||0;
  const anos=parseFloat(anosInput.value)||0;
  const n=anos*12;
  if(capital<=0||interes<=0||anos<=0){resultadosDiv.style.display="none"; verTablaBtn.style.display="none"; tablaContainer.style.display="none"; return;}
  const cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalPagado=cuota*n;
  const interesesTotales=totalPagado-capital;
  cuotaOut.innerText=formatMoney(cuota);
  interesesTotalesOut.innerText=formatMoney(interesesTotales);
  totalPagadoOut.innerText=formatMoney(totalPagado);
  resultadosDiv.style.display="grid"; verTablaBtn.style.display="block"; tablaContainer.style.display="none";
}
[prestamoInput,interesInput,anosInput].forEach(el=>el.addEventListener("input",calcular));
verTablaBtn.addEventListener("click",()=>{if(tablaContainer.style.display==="none"){generarTabla(); tablaContainer.style.display="block"; verTablaBtn.innerText="Ocultar tabla de amortización";} else{tablaContainer.style.display="none"; verTablaBtn.innerText="Ver tabla de amortización";}});
function generarTabla(){tbody.innerHTML=""; const capital=parseFloat(prestamoInput.value)||0; const interes=(parseFloat(interesInput.value)/100)/12||0; const anos=parseFloat(anosInput.value)||0; const n=anos*12; const cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1); let saldo=capital; for(let i=1;i<=n;i++){const interesMes=saldo*interes; const capitalMes=cuota-interesMes; saldo-=capitalMes; tbody.innerHTML+=`<tr><td>${i}</td><td>${formatMoney(cuota)}</td><td>${formatMoney(interesMes)}</td><td>${formatMoney(capitalMes)}</td><td>${formatMoney(Math.max(saldo,0))}</td></tr>`;}}

// --- PERFIL ---
const perfilTitulares=document.getElementById("perfilTitulares");
const titular2Div=document.getElementById("titular2Div");
const perfilEdad1=document.getElementById("perfilEdad1");
const perfilEdad2=document.getElementById("perfilEdad2");
const salario2Div=document.getElementById("salario2Div");
const perfilSalario1=document.getElementById("perfilSalario1");
const perfilSalario2=document.getElementById("perfilSalario2");
const perfilPagas=document.getElementById("perfilPagas");
const perfilPagas2=document.getElementById("perfilPagas2");
const perfilDeuda=document.getElementById("perfilDeuda");
const perfilDeuda2=document.getElementById("perfilDeuda2");
const perfilOtroIngreso=document.getElementById("perfilOtroIngreso");
const perfilOtroIngreso2=document.getElementById("perfilOtroIngreso2");
const yaTieneVivienda=document.getElementById("yaTieneVivienda");
const viviendaInfo=document.getElementById("viviendaInfo");
const perfilPrecio=document.getElementById("perfilPrecio");
const perfilTipoVivienda=document.getElementById("perfilTipoVivienda");
const perfilComunidad=document.getElementById("perfilComunidad");
const perfilPlazo=document.getElementById("perfilPlazo");
const perfilAhorros=document.getElementById("perfilAhorros");
const perfilCapitalOut=document.getElementById("perfilCapital");
const perfilCuotaOut=document.getElementById("perfilCuota");
const perfilLTVOut=document.getElementById("perfilLTV");
const perfilGastosOut=document.getElementById("perfilGastos");
const perfilLTIOut=document.getElementById("perfilLTI");
const perfilCompatibleOut=document.getElementById("perfilCompatible");
const perfilAviso=document.getElementById("perfilAviso");

function formatMoneyPerfil(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}

// Mostrar titular 2 opcional
perfilTitulares.addEventListener("change",()=>{if(perfilTitulares.value==="2"){titular2Div.style.display="block"; salario2Div.style.display="block";} else{titular2Div.style.display="none"; salario2Div.style.display="none";} calcularPerfil();});
yaTieneVivienda.addEventListener("change",()=>{viviendaInfo.style.display=yaTieneVivienda.checked?"block":"none"; calcularPerfil();});
perfilTipoVivienda.addEventListener("change",()=>{viviendaInfo.style.display=yaTieneVivienda.checked? "block":"none"; if(perfilTipoVivienda.value==="primera"){perfilComunidad.parentElement.style.display="block";} else{perfilComunidad.parentElement.style.display="none";} calcularPerfil();});

// --- CALCULO PERFIL ---
function calcularPerfil(){
let nTitulares=parseInt(perfilTitulares.value)||1;
let edad1=parseInt(perfilEdad1.value)||0;
let edad2=nTitulares===2?parseInt(perfilEdad2.value)||0:0;
let maxEdad=Math.max(edad1,edad2);
let plazoMax=Math.min(perfilPlazo.value||30,75-maxEdad);
perfilPlazo.value=plazoMax>0?plazoMax:0;

let ingresos=(parseFloat(perfilSalario1.value)||0)+(nTitulares===2?(parseFloat(perfilSalario2.value)||0):0)+(parseFloat(perfilOtroIngreso.value)||0)+(nTitulares===2?(parseFloat(perfilOtroIngreso2.value)||0):0);
let pagas=parseInt(perfilPagas.value)||12;
let pagas2=parseInt(perfilPagas2.value)||12;
let ingresosAnuales=(parseFloat(perfilSalario1.value)||0)*pagas+(nTitulares===2? (parseFloat(perfilSalario2.value)||0)*pagas2:0)+(parseFloat(perfilOtroIngreso.value)||0)*12+(nTitulares===2?(parseFloat(perfilOtroIngreso2.value)||0)*12:0);
let deudas=(parseFloat(perfilDeuda.value)||0)+(nTitulares===2?(parseFloat(perfilDeuda2.value)||0):0);

let tipoRef=0.028/12; // tipo fijo 2.8%
let n=plazoMax*12;
let cuotaMax=ingresosAnuales*0.35/12 - deudas;
let capitalPosible=cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*Math.pow(1+tipoRef,n));

// vivienda
let gastos=0;
let aviso="";
if(yaTieneVivienda.checked){
  let precio=parseFloat(perfilPrecio.value)||0;
  let ahorro=parseFloat(perfilAhorros.value)||0;
  let porcentajeMax=perfilTipoVivienda.value==="primera"?1:0.7;
  capitalPosible=Math.min(capitalPosible,precio*porcentajeMax);
  if(ahorro+capitalPosible<precio){
    let necesario=precio-capitalPosible-ahorro;
    aviso=`<br>Entrada mínima adicional necesaria: ${formatMoneyPerfil(necesario)}`;
  }
  if(perfilTipoVivienda.value==="primera"){
    gastos=precio*0.10+2500; // ejemplo IVA
  } else if(perfilTipoVivienda.value==="segunda"||perfilTipoVivienda.value==="local"){
    gastos=precio*0.07+2500; // ITP ejemplo o gastos
  }
}

let cuota=capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
let ltv=yaTieneVivienda.checked?(capitalPosible/precio*100):0;
let lti=(cuota+deudas)*12/ingresosAnuales;

perfilCapitalOut.innerText=formatMoneyPerfil(capitalPosible);
perfilCuotaOut.innerText=formatMoneyPerfil(cuota);
perfilLTVOut.innerText=ltv>0?ltv.toFixed(1)+"%":"-";
perfilGastosOut.innerText=formatMoneyPerfil(gastos);
perfilLTIOut.innerText=(lti*100).toFixed(1)+"%";

if(lti<=0.35){perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green";}
else if(lti<=0.40){perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange";}
else{perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red";}

perfilAviso.innerHTML=aviso;
}

// Eventos automáticos
[
perfilTitulares, perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
perfilPagas, perfilPagas2, perfilAhorros, perfilDeuda, perfilDeuda2,
perfilOtroIngreso, perfilOtroIngreso2, yaTieneVivienda, perfilPrecio,
perfilTipoVivienda, perfilComunidad, perfilPlazo
].forEach(el=>el.addEventListener("input",calcularPerfil));

// EURIBOR
document.getElementById("euriborValor").innerText="4.15";

// Inicializar
calcular();
calcularPerfil();
