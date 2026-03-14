// ----------------------
// SELECCIÓN DE SECCIONES
// ----------------------

const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");

const calculadoraDiv = document.getElementById("calculadora");
const perfilDiv = document.getElementById("perfil");

btnCalculadora.addEventListener("click", () => {
  calculadoraDiv.style.display = "block";
  perfilDiv.style.display = "none";
});

btnPerfil.addEventListener("click", () => {
  calculadoraDiv.style.display = "none";
  perfilDiv.style.display = "block";
});


// ----------------------
// FORMATO MONEDA
// ----------------------

function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{
    style:'currency',
    currency:'EUR'
  }).format(n);
}


// ----------------------
// CALCULADORA HIPOTECA
// ----------------------

const prestamoInput = document.getElementById("prestamo");
const interesInput = document.getElementById("interes");
const anosInput = document.getElementById("anos");

const cuotaOut = document.getElementById("cuota");
const interesesTotalesOut = document.getElementById("interesesTotales");
const totalPagadoOut = document.getElementById("totalPagado");

const resultadosDiv = document.getElementById("resultados");
const verTablaBtn = document.getElementById("verTabla");

const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");


function calcular(){

const capital = parseFloat(prestamoInput.value);
const interes = (parseFloat(interesInput.value)/100)/12;
const anos = parseFloat(anosInput.value);

if(!capital || !interes || !anos){
resultadosDiv.style.display="none";
verTablaBtn.style.display="none";
tablaContainer.style.display="none";
return;
}

const n = anos*12;

const cuota =
capital*(interes*Math.pow(1+interes,n)) /
(Math.pow(1+interes,n)-1);

const totalPagado = cuota*n;
const interesesTotales = totalPagado-capital;

cuotaOut.innerText=formatMoney(cuota);
interesesTotalesOut.innerText=formatMoney(interesesTotales);
totalPagadoOut.innerText=formatMoney(totalPagado);

resultadosDiv.style.display="grid";
verTablaBtn.style.display="block";

}


verTablaBtn.addEventListener("click",()=>{

if(tablaContainer.style.display==="none"){

generarTabla();
tablaContainer.style.display="block";
verTablaBtn.innerText="Ocultar tabla de amortización";

}else{

tablaContainer.style.display="none";
verTablaBtn.innerText="Ver tabla de amortización";

}

});


function generarTabla(){

tbody.innerHTML="";

const capital = parseFloat(prestamoInput.value);
const interes = (parseFloat(interesInput.value)/100)/12;
const anos = parseFloat(anosInput.value);
const n = anos*12;

const cuota =
capital*(interes*Math.pow(1+interes,n)) /
(Math.pow(1+interes,n)-1);

let saldo = capital;

for(let i=1;i<=n;i++){

const interesMes = saldo*interes;
const capitalMes = cuota-interesMes;

saldo -= capitalMes;

tbody.innerHTML +=
`<tr>
<td>${i}</td>
<td>${formatMoney(cuota)}</td>
<td>${formatMoney(interesMes)}</td>
<td>${formatMoney(capitalMes)}</td>
<td>${formatMoney(Math.max(saldo,0))}</td>
</tr>`;

}

}


[prestamoInput,interesInput,anosInput].forEach(el=>{
el.addEventListener("input",calcular);
});


// ----------------------
// PERFIL FINANCIERO
// ----------------------

const perfilTitulares = document.getElementById("perfilTitulares");
const titular2Div = document.getElementById("titular2Div");

const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2 = document.getElementById("perfilEdad2");

const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2 = document.getElementById("perfilSalario2");

const perfilPagas = document.getElementById("perfilPagas");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");

const perfilAhorros = document.getElementById("perfilAhorros");

const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");

const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");

const perfilTipoOperacion = document.getElementById("perfilTipoOperacion");

const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPlazo = document.getElementById("perfilPlazo");

const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilGastosOut = document.getElementById("perfilGastos");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");

const perfilMensaje = document.getElementById("perfilMensaje");


// ----------------------
// SEGUNDO TITULAR
// ----------------------

perfilTitulares.addEventListener("change",()=>{

if(perfilTitulares.value==="2"){
titular2Div.style.display="block";
}else{
titular2Div.style.display="none";
}

calcularPerfil();

});


// ----------------------
// MOSTRAR VIVIENDA
// ----------------------

yaTieneVivienda.addEventListener("change",()=>{

viviendaInfo.style.display =
yaTieneVivienda.checked ? "block":"none";

calcularPerfil();

});


// ----------------------
// CALCULO PERFIL
// ----------------------

function calcularPerfil(){

const titulares = parseInt(perfilTitulares.value)||1;

const edad1 = parseInt(perfilEdad1.value)||0;
const edad2 = titulares===2 ? parseInt(perfilEdad2.value)||0 : 0;

const salario1 = parseFloat(perfilSalario1.value)||0;
const salario2 = titulares===2 ? parseFloat(perfilSalario2.value)||0 : 0;

const otros = parseFloat(perfilOtroIngreso.value)||0;

const pagas = parseInt(perfilPagas.value)||12;

const deudas = parseFloat(perfilDeuda.value)||0;

const ingresosMensuales = salario1+salario2+otros;
const ingresosAnuales = ingresosMensuales*pagas;


// ----------------------
// CALCULO CAPACIDAD
// ----------------------

const tipo = 0.028/12;
const plazo = 30;
const n = plazo*12;

const cuotaMax =
ingresosAnuales*0.35/12 - deudas;

const capitalMax =
cuotaMax*(Math.pow(1+tipo,n)-1) /
(tipo*Math.pow(1+tipo,n));

perfilCapitalOut.innerText=formatMoney(capitalMax);

const cuota =
capitalMax*(tipo*Math.pow(1+tipo,n)) /
(Math.pow(1+tipo,n)-1);

perfilCuotaOut.innerText=formatMoney(cuota);


// ----------------------
// LTI
// ----------------------

const lti =
(cuota+deudas)*12 / ingresosAnuales;

perfilLTIOut.innerText=(lti*100).toFixed(1)+"%";

if(lti<=0.35){

perfilCompatibleOut.innerText="Viable";
perfilCompatibleOut.style.color="green";

}
else if(lti<=0.40){

perfilCompatibleOut.innerText="Riesgo";
perfilCompatibleOut.style.color="orange";

}
else{

perfilCompatibleOut.innerText="No viable";
perfilCompatibleOut.style.color="red";

}


// ----------------------
// SI HAY VIVIENDA
// ----------------------

if(!yaTieneVivienda.checked) return;

const precio = parseFloat(perfilPrecio.value)||0;
const ahorro = parseFloat(perfilAhorros.value)||0;

if(precio<=0) return;


// ----------------------
// GASTOS
// ----------------------

let gastos=0;

if(perfilTipoOperacion.value==="obraNueva"){

gastos = precio*0.10;

}else{

gastos = precio*parseFloat(perfilComunidad.value);

}

perfilGastosOut.innerText=formatMoney(gastos);


// ----------------------
// CAPITAL SOLICITADO
// ----------------------

const capitalSolicitado =
precio + gastos - ahorro;

const ltv =
(capitalSolicitado/precio)*100;

perfilLTVOut.innerText=ltv.toFixed(1)+"%";


// ----------------------
// MENSAJES
// ----------------------

perfilMensaje.innerText="";

if(perfilTipoVivienda.value==="primera" && ltv>100){

perfilMensaje.innerText =
"⚠ La financiación supera el 100% del valor de la vivienda.";

}

if(
(perfilTipoVivienda.value==="segunda" ||
perfilTipoVivienda.value==="local")
&& ltv>70
){

perfilMensaje.innerText =
"⚠ Habitualmente los bancos financian hasta el 70% en segundas residencias o locales.";

}


// ----------------------
// ENTRADA MINIMA
// ----------------------

const entradaNecesaria =
precio + gastos - ahorro;

if(entradaNecesaria>0){

perfilMensaje.innerText +=
"\nAportación mínima aproximada necesaria: " +
formatMoney(entradaNecesaria);

}

}


// ----------------------
// EVENTOS
// ----------------------

document.querySelectorAll("#perfil input,#perfil select")
.forEach(el=>{
el.addEventListener("input",calcularPerfil);
});


// ----------------------
// INICIO
// ----------------------

calcular();
calcularPerfil();
