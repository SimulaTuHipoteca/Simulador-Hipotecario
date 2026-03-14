// --- SELECCIÓN DE SECCIÓN ---
const btnCalculadora=document.getElementById("btnCalculadora");
const btnPerfil=document.getElementById("btnPerfil");
const calculadoraDiv=document.getElementById("calculadora");
const perfilDiv=document.getElementById("perfil");

btnCalculadora.addEventListener("click",()=>{
  calculadoraDiv.style.display="block";
  perfilDiv.style.display="none";
  calculadoraDiv.scrollIntoView({behavior:"smooth"});
});

btnPerfil.addEventListener("click",()=>{
  calculadoraDiv.style.display="none";
  perfilDiv.style.display="block";
  perfilDiv.scrollIntoView({behavior:"smooth"});
});

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
  if(capital<=0||interes<=0||anos<=0){
    resultadosDiv.style.display="none";
    verTablaBtn.style.display="none";
    tablaContainer.style.display="none";
    return;
  }
  const cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalPagado=cuota*n;
  const interesesTotales=totalPagado-capital;
  cuotaOut.innerText=formatMoney(cuota);
  interesesTotalesOut.innerText=formatMoney(interesesTotales);
  totalPagadoOut.innerText=formatMoney(totalPagado);
  resultadosDiv.style.display="grid";
  verTablaBtn.style.display="block";
  tablaContainer.style.display="none";
}
verTablaBtn.addEventListener("click",()=>{
  if(tablaContainer.style.display==="none"){generarTabla();tablaContainer.style.display="block";verTablaBtn.innerText="Ocultar tabla de amortización";}
  else{tablaContainer.style.display="none";verTablaBtn.innerText="Ver tabla de amortización";}
});
function generarTabla(){
  tbody.innerHTML="";
  const capital=parseFloat(prestamoInput.value)||0;
  const interes=(parseFloat(interesInput.value)/100)/12||0;
  const anos=parseFloat(anosInput.value)||0;
  const n=anos*12;
  const cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo=capital;
  for(let i=1;i<=n;i++){
    const interesMes=saldo*interes;
    const capitalMes=cuota-interesMes;
    saldo-=capitalMes;
    tbody.innerHTML+=`<tr><td>${i}</td><td>${formatMoney(cuota)}</td><td>${formatMoney(interesMes)}</td><td>${formatMoney(capitalMes)}</td><td>${formatMoney(Math.max(saldo,0))}</td></tr>`;
  }
}
[prestamoInput,interesInput,anosInput].forEach(el=>el.addEventListener("input",calcular));

// --- PERFIL ---
const perfilTitulares=document.getElementById("perfilTitulares");
const titular2Div=document.getElementById("titular2Div");
const perfilEdad1=document.getElementById("perfilEdad1");
const perfilEdad2=document.getElementById("perfilEdad2");
const perfilSalario1=document.getElementById("perfilSalario1");
const perfilSalario2=document.getElementById("perfilSalario2");
const perfilPagas=document.getElementById("perfilPagas");
const perfilDeuda=document.getElementById("perfilDeuda");
const perfilOtroIngreso=document.getElementById("perfilOtroIngreso");
const perfilAhorros=document.getElementById("perfilAhorros");
const perfilPrecio=document.getElementById("perfilPrecio");
const perfilTipoVivienda=document.getElementById("perfilTipoVivienda");
const perfilViviendaExtra=document.getElementById("perfilViviendaExtra");
const perfilComunidad=document.getElementById("perfilComunidad");
const perfilPlazo=document.getElementById("perfilPlazo");
const perfilCapitalOut=document.getElementById("perfilCapital");
const perfilCuotaOut=document.getElementById("perfilCuota");
const perfilLTVOut=document.getElementById("perfilLTV");
const perfilGastosOut=document.getElementById("perfilGastos");
const perfilLTIOut=document.getElementById("perfilLTI");
const perfilCompatibleOut=document.getElementById("perfilCompatible");
const perfilMensaje=document.getElementById("perfilMensaje");

function formatMoneyPerfil(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}

// Mostrar segundo titular
perfilTitulares.addEventListener("change",()=>{
  titular2Div.style.display=(perfilTitulares.value==="2")?"block":"none";
  calcularPerfil();
});
perfilTipoVivienda.addEventListener("change",calcularPerfil);
perfilViviendaExtra.addEventListener("change",()=>{
  perfilComunidad.parentElement.style.display=(perfilViviendaExtra.value==="obraNueva")?"none":"block";
  calcularPerfil();
});

// CALCULO PERFIL
function calcularPerfil(){
  const nTitulares=parseInt(perfilTitulares.value)||1;
  const edad1=parseInt(perfilEdad1.value)||0;
  const edad2=nTitulares===2?parseInt(perfilEdad2.value)||0:0;
  const ingresos=(parseFloat(perfilSalario1.value)||0)+(nTitulares===2?(parseFloat(perfilSalario2.value)||0):0)+(parseFloat(perfilOtroIngreso.value)||0);
  const pagas=parseInt(perfilPagas.value)||12;
  const ingresosAnuales=ingresos*pagas;
  const deudas=parseFloat(perfilDeuda.value)||0;
  const ahorro=parseFloat(perfilAhorros.value)||0;
  const precio=parseFloat(perfilPrecio.value)||0;

  const tipoRef=0.028/12; // 2.8%
  let plazo=parseInt(perfilPlazo.value)||30;
  if(perfilTipoVivienda.value==="local"){plazo=Math.min(plazo,15);}
  if(perfilTipoVivienda.value==="segunda"){plazo=Math.min(plazo,30);}
  const n=plazo*12;

  // CALCULO CAPITAL POSIBLE SIN VIVIENDA
  let capitalPosibleMax=ingresosAnuales*0.35/12*(Math.pow(1+tipoRef,n)-1)/(tipoRef*Math.pow(1+tipoRef,n));
  let cuotaMax=(capitalPosibleMax*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1));

  // GASTOS Y CAPITAL FINAL SEGUN VIVIENDA
  let gastos=0;
  let capitalPosible=capitalPosibleMax;
  let entradaMinima=0;

  if(precio>0){
    if(perfilTipoVivienda.value==="primera"){
      gastos=(perfilViviendaExtra.value==="obraNueva")?precio*0.10:precio*parseFloat(perfilComunidad.value||0);
      capitalPosible=precio-gastos- ahorro;
      entradaMinima=precio-capitalPosible-gastos;
    } else if(perfilTipoVivienda.value==="segunda" || perfilTipoVivienda.value==="local"){
      capitalPosible=precio*0.7;
      gastos=(precio-capitalPosible)+2500;
      entradaMinima=(precio*0.3)+2500- ahorro;
    }
  }

  let cuota=capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  let ltv=(precio>0)?(capitalPosible/precio*100):0;
  let lti=(cuota+deudas)*12/ingresosAnuales;

  perfilCapitalOut.innerText=formatMoneyPerfil(capitalPosible);
  perfilCuotaOut.innerText=formatMoneyPerfil(cuota);
  perfilLTVOut.innerText=(precio>0)?ltv.toFixed(1)+"%":"-";
  perfilGastosOut.innerText=formatMoneyPerfil(gastos);
  perfilLTIOut.innerText=(lti*100).toFixed(1)+"%";

  // Compatibilidad LTI
  if(lti<=0.35){perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green";}
  else if(lti<=0.40){perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange";}
  else{perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red";}

  // Mensaje entrada mínima
  if(entradaMinima>0){
    perfilMensaje.innerText="Necesita aportar al menos: "+formatMoneyPerfil(entradaMinima);
    perfilMensaje.style.color="red";
  } else{
    perfilMensaje.innerText="";
  }
}

// Eventos automáticos
[prestamoInput,interesInput,anosInput,
perfilTitulares,perfilEdad1,perfilEdad2,perfilSalario1,perfilSalario2,
perfilPagas,perfilDeuda,perfilOtroIngreso,perfilAhorros,perfilPrecio,
perfilTipoVivienda,perfilViviendaExtra,perfilComunidad,perfilPlazo].forEach(el=>el.addEventListener("input",calcularPerfil));

// Inicializar
calcular();
calcularPerfil();
