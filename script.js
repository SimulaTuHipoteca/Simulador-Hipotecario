// ------------------------------
// UTILIDADES COMUNES
// ------------------------------
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

function calcularGastos(precio, tipoVivienda, comunidad){
  let impuestos = tipoVivienda === "obraNueva" ? precio*0.10 : precio*parseFloat(comunidad);
  let notaria = precio*0.005;
  let registro = precio*0.0025;
  let gestor = precio*0.003;
  return impuestos + notaria + registro + gestor;
}

function calcularCuota(capital, interes, años){
  let n = años*12;
  if(interes === 0) return capital/n;
  let i = interes/100/12;
  return capital*(i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);
}

// ------------------------------
// SELECCIONAR SECCIÓN
// ------------------------------
const btnCalculadora = document.getElementById("btnCalculadora");
const btnAnalizarPerfil = document.getElementById("btnAnalizarPerfil");
const seccionCalculadora = document.getElementById("seccionCalculadora");
const seccionPerfil = document.getElementById("seccionPerfil");

btnCalculadora.addEventListener("click", ()=> {
  seccionCalculadora.style.display = "block";
  seccionPerfil.style.display = "none";
});
btnAnalizarPerfil.addEventListener("click", ()=> {
  seccionCalculadora.style.display = "none";
  seccionPerfil.style.display = "block";
});

// ------------------------------
// CALCULADORA DE HIPOTECA
// ------------------------------
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const tipoVivienda = document.getElementById("tipoVivienda");
const titularesSelect = document.getElementById("titulares");
const edad1Input = document.getElementById("edad1");
const edad2Input = document.getElementById("edad2");
const deuda1Input = document.getElementById("deuda1");
const deuda2Input = document.getElementById("deuda2");
const añosInput = document.getElementById("años");
const salarioInput = document.getElementById("salario");
const comunidadSelect = document.getElementById("comunidad");
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const ltvOut = document.getElementById("ltv");
const compatibleOut = document.getElementById("compatible");
const resumenOut = document.getElementById("resumen");
const plazoEdadMax = document.getElementById("plazoEdadMax");
const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");
const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");

let amortizacionGenerada = false;

titularesSelect.addEventListener("change", () => {
  if(titularesSelect.value === "2"){
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
  }
  calcularCalculadora();
});

tipoVivienda.addEventListener("change", () => {
  if(tipoVivienda.value === "obraNueva"){
    comunidadSelect.parentElement.style.display = "none";
  } else {
    comunidadSelect.parentElement.style.display = "block";
  }
  calcularCalculadora();
});

function ajustarPlazoMax(){
  let edad1 = parseInt(edad1Input.value) || 0;
  let edad2 = titularesSelect.value === "2" ? parseInt(edad2Input.value) || 0 : 0;
  let maxEdad = Math.max(edad1, edad2);
  let maxPlazo = Math.min(30, 75 - maxEdad);
  if(maxPlazo < 0) maxPlazo = 0;
  plazoEdadMax.innerText = `Plazo máximo permitido según edad: ${maxPlazo} años`;
  if(parseInt(añosInput.value) > maxPlazo) añosInput.value = maxPlazo;
}

[precioInput, entradaInput, tipoVivienda, titularesSelect, edad1Input, edad2Input, deuda1Input, deuda2Input, añosInput, salarioInput, comunidadSelect]
.forEach(input => input.addEventListener("input", ()=>{
  ajustarPlazoMax();
  calcularCalculadora();
}));

function calcularCalculadora(){
  let precio = parseFloat(precioInput.value)||0;
  let entrada = parseFloat(entradaInput.value)||0;
  let años = parseFloat(añosInput.value)||0;
  let interes = parseFloat(document.getElementById("interes").value)||0;
  let salario = parseFloat(salarioInput.value)||0;
  let deuda1 = parseFloat(deuda1Input.value)||0;
  let deuda2 = titularesSelect.value==="2"?parseFloat(deuda2Input.value)||0:0;

  let gastos = calcularGastos(precio,tipoVivienda.value,comunidadSelect.value);
  let capital = Math.max(precio+gastos-entrada,0);

  let cuota = calcularCuota(capital,interes,años);
  let totalIntereses = cuota*años*12 - capital;
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(gastos+entrada);

  let ltiVal = (cuota + deuda1 + deuda2)*12 / salario;
  ltiOut.innerText = (ltiVal*100).toFixed(1)+"%";
  if(ltiVal<=0.35) ltiOut.style.color="green";
  else if(ltiVal<=0.4) ltiOut.style.color="orange";
  else ltiOut.style.color="red";

  let salarioMin = ((cuota + deuda1 + deuda2)*12)/0.35;
  sueldoOut.innerText = formatMoney(salarioMin);

  if(ltiVal<=0.35){ compatibleOut.innerText="Compatible"; compatibleOut.style.color="green";}
  else if(ltiVal<=0.4){ compatibleOut.innerText="Aceptable"; compatibleOut.style.color="orange";}
  else { compatibleOut.innerText="No viable"; compatibleOut.style.color="red";}

  let maxCapital = salario*0.35/12*años*12 - (deuda1+deuda2)*12;
  let maxPrecio = maxCapital + entrada + gastos;
  resumenOut.innerText = `Con tu salario neto anual y deudas, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;

  amortizacionGenerada=false;
}

verTablaBtn.addEventListener("click", ()=>{
  tablaContainer.style.display = tablaContainer.style.display==="none"?"block":"none";
  if(tablaContainer.style.display==="block") generarTablaCalculadora();
});

function generarTablaCalculadora(){
  if(amortizacionGenerada) return;
  tbody.innerHTML="";
  let precio = parseFloat(precioInput.value)||0;
  let entrada = parseFloat(entradaInput.value)||0;
  let años = parseFloat(añosInput.value)||0;
  let interes = parseFloat(document.getElementById("interes").value)||0;

  let gastos = calcularGastos(precio,tipoVivienda.value,comunidadSelect.value);
  let capital = Math.max(precio+gastos-entrada,0);

  let n = años*12;
  let cuota = calcularCuota(capital,interes,años);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes/100/12;
    let capitalMes = cuota-interesMes;
    saldo -= capitalMes;
    tbody.innerHTML+=`<tr>
      <td>${i}</td><td>${formatMoney(cuota)}</td><td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td><td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
  amortizacionGenerada=true;
}

// Inicial
ajustarPlazoMax();
calcularCalculadora();

// ------------------------------
// ANALIZAR PERFIL
// ------------------------------
const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2Div = document.getElementById("perfilEdad2Div");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2Div = document.getElementById("perfilSalario2Div");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const perfilVivienda = document.getElementById("perfilVivienda");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidadDiv = document.getElementById("perfilComunidadDiv");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPrimeraSegunda = document.getElementById("perfilPrimeraSegunda");
const perfilInteres = document.getElementById("perfilInteres");
const perfilPlazo = document.getElementById("perfilPlazo");
const perfilPlazoEdadMax = document.getElementById("perfilPlazoEdadMax");
const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilInteresesOut = document.getElementById("perfilIntereses");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");
const perfilVerTabla = document.getElementById("perfilVerTabla");
const perfilTablaContainer = document.getElementById("perfilTablaContainer");
const perfilTbody = document.querySelector("#perfilTabla tbody");

let perfilAmortizacionGenerada=false;

// Mostrar/ocultar titular 2
perfilTitulares.addEventListener("change",()=>{
  if(perfilTitulares.value==="2"){
    perfilEdad2Div.style.display="block";
    perfilSalario2Div.style.display="block";
  } else {
    perfilEdad2Div.style.display="none";
    perfilSalario2Div.style.display="none";
  }
  calcularPerfil();
});

// Mostrar/ocultar vivienda
yaTieneVivienda.addEventListener("change",()=>{
  perfilVivienda.style.display=yaTieneVivienda.checked?"block":"none";
  calcularPerfil();
});

perfilTipoVivienda.addEventListener("change",()=>{
  if(perfilTipoVivienda.value==="obraNueva") perfilComunidadDiv.style.display="none";
  else perfilComunidadDiv.style.display="block";
  calcularPerfil();
});

[perfilEdad1,perfilEdad2,perfilSalario1,perfilSalario2,perfilPagas,perfilAhorros,perfilDeuda,perfilOtroIngreso,perfilPrecio,perfilPlazo,perfilInteres,perfilTipoVivienda,perfilComunidad,perfilPrimeraSegunda]
.forEach(el => el.addEventListener("input",()=>{calcularPerfil()}));

function calcularPerfil(){
  // -----------------
  // Datos del perfil
  // -----------------
  let edad1 = parseInt(perfilEdad1.value)||0;
  let edad2 = perfilTitulares.value==="2"?parseInt(perfilEdad2.value)||0:0;
  let ingresos = parseFloat(perfilSalario1.value)||0;
  if(perfilTitulares.value==="2") ingresos += parseFloat(perfilSalario2.value)||0;
  let pagas = parseInt(perfilPagas.value)||12;
  ingresos *= pagas;

  let deudas = parseFloat(perfilDeuda.value)||0;
  let otroIngreso = parseFloat(perfilOtroIngreso.value)||0;
  let ahorro = parseFloat(perfilAhorros.value)||0;

  // Límite máximo por LTI 35%
  let cuotaMax = ingresos*0.35 - deudas*12;
  let añosMax = Math.min(30,75 - Math.max(edad1,edad2));
  let capitalMax = cuotaMax*añosMax*12;

  let importePrestamo = capitalMax;

  if(yaTieneVivienda.checked){
    let precio = parseFloat(perfilPrecio.value)||0;
    let interes = parseFloat(perfilInteres.value)||0;
    let años = parseFloat(perfilPlazo.value)||añosMax;
    let tipoV = perfilTipoVivienda.value;
    let comunidad = perfilComunidad.value;

    let gastos = calcularGastos(precio,tipoV,comunidad);
    let capital = Math.max(precio+gastos - ahorro,0);
    importePrestamo = capital;

    let cuota = calcularCuota(capital,interes,años);
    perfilCuotaOut.innerText = formatMoney(cuota);
    perfilInteresesOut.innerText = formatMoney(cuota*años*12-capital);
    perfilLTVOut.innerText = ((capital/precio)*100).toFixed(1)+"%";
    let ltiVal = (cuota + deudas)*12/ingresos;
    perfilLTIOut.innerText = (ltiVal*100).toFixed(1)+"%";
    if(ltiVal<=0.35){ perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green";}
    else if(ltiVal<=0.4){ perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange";}
    else{ perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red";}
  }

  perfilCapitalOut.innerText = formatMoney(importePrestamo);
  if(!yaTieneVivienda.checked){
    perfilCuotaOut.innerText="-";
    perfilInteresesOut.innerText="-";
    perfilLTVOut.innerText="-";
    perfilLTIOut.innerText="-";
    perfilCompatibleOut.innerText="-";
  }

  perfilAmortizacionGenerada=false;
}

// Tabla de amortización perfil
perfilVerTabla.addEventListener("click",()=>{
  perfilTablaContainer.style.display=perfilTablaContainer.style.display==="none"?"block":"none";
  if(perfilTablaContainer.style.display==="block") generarTablaPerfil();
});

function generarTablaPerfil(){
  if(perfilAmortizacionGenerada) return;
  perfilTbody.innerHTML="";
  if(!yaTieneVivienda.checked) return;

  let precio = parseFloat(perfilPrecio.value)||0;
  let interes = parseFloat(perfilInteres.value)||0;
  let años = parseFloat(perfilPlazo.value)||1;
  let capital = Math.max(precio+calcularGastos(precio,perfilTipoVivienda.value,perfilComunidad.value) - parseFloat(perfilAhorros.value)||0,0);

  let n = años*12;
  let cuota = calcularCuota(capital,interes,años);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes/100/12;
    let capitalMes = cuota-interesMes;
    saldo -= capitalMes;
    perfilTbody.innerHTML+=`<tr>
      <td>${i}</td><td>${formatMoney(cuota)}</td><td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td><td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
  perfilAmortizacionGenerada=true;
}

// Inicial
calcularPerfil();
