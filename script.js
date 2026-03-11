// Obtener elementos
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

// Función para formatear moneda
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Mostrar/ocultar edad y deuda del segundo titular
titularesSelect.addEventListener("change", () => {
  if(titularesSelect.value === "2"){
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
  }
  calcular();
});

// Mostrar/ocultar comunidad según tipo de vivienda
tipoVivienda.addEventListener("change", () => {
  if(tipoVivienda.value === "obraNueva"){
    comunidadSelect.parentElement.style.display = "none";
  } else {
    comunidadSelect.parentElement.style.display = "block";
  }
  calcular();
});

// Ajustar plazo máximo según edad
function ajustarPlazoMax(){
  let edad1 = parseInt(edad1Input.value) || 0;
  let edad2 = titularesSelect.value === "2" ? parseInt(edad2Input.value) || 0 : 0;
  let maxEdad = Math.max(edad1, edad2);
  let maxPlazo = Math.min(30, 75 - maxEdad);
  if(maxPlazo < 0) maxPlazo = 0;
  plazoEdadMax.innerText = `Plazo máximo permitido según edad: ${maxPlazo} años`;
  if(parseInt(añosInput.value) > maxPlazo) añosInput.value = maxPlazo;
}

// Escuchar cambios en inputs
[
  precioInput, entradaInput, tipoVivienda, titularesSelect, edad1Input, edad2Input,
  deuda1Input, deuda2Input, añosInput, salarioInput, comunidadSelect
].forEach(input => input.addEventListener("input", () => {
  ajustarPlazoMax();
  calcular();
}));

// Función principal de cálculo
function calcular(){
  let precio = parseFloat(precioInput.value) || 0;
  let entrada = parseFloat(entradaInput.value) || 0;
  let años = parseFloat(añosInput.value) || 0;
  let interes = parseFloat(document.getElementById("interes").value)/100/12 || 0;
  let salario = parseFloat(salarioInput.value) || 0;
  let deuda1 = parseFloat(deuda1Input.value) || 0;
  let deuda2 = titularesSelect.value === "2" ? parseFloat(deuda2Input.value) || 0 : 0;

  // Determinar impuestos según tipo de vivienda
  let impuestos = 0;
  if(tipoVivienda.value === "obraNueva"){
    impuestos = precio * 0.10; // IVA 10%
  } else {
    impuestos = precio * parseFloat(comunidadSelect.value); // ITP
  }

  let gastosAdicionales = 2500; // escrituras
  let totalGastos = impuestos + gastosAdicionales;

  // Entrada aplicada a gastos
  let entradaAplicada = Math.min(entrada, totalGastos);
  let capital = precio - (entrada - entradaAplicada);

  // LTV
  let ltv = (capital / precio) * 100;
  ltvOut.innerText = ltv.toFixed(1) + "%";

  // Calcular cuota y total intereses
  let n = años * 12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let totalIntereses = cuota*n - capital;

  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaAplicada + (entrada - entradaAplicada) + gastosAdicionales);

  // LTI considerando deudas
  let totalDeudasMensuales = deuda1 + deuda2;
  let ltiVal = (cuota + totalDeudasMensuales) * 12 / salario;
  ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";
  if(ltiVal <= 0.35) ltiOut.style.color = "green";
  else if(ltiVal <= 0.40) ltiOut.style.color = "orange";
  else ltiOut.style.color = "red";

  // Salario mínimo recomendado
  let salarioMin = ((cuota + totalDeudasMensuales)*12)/0.35;
  sueldoOut.innerText = formatMoney(salarioMin);

  // Compatibilidad
  if(ltiVal <= 0.35){
    compatibleOut.innerText = "Compatible";
    compatibleOut.style.color = "green";
  } else if(ltiVal <= 0.40){
    compatibleOut.innerText = "Aceptable";
    compatibleOut.style.color = "orange";
  } else {
    compatibleOut.innerText = "No viable";
    compatibleOut.style.color = "red";
  }

  // Resumen máximo precio según salario
  let maxCapital = salario*0.35/12 * n - totalDeudasMensuales*12;
  let maxPrecio = maxCapital + (entrada - entradaAplicada) + totalGastos;
  resumenOut.innerText = `Con tu salario neto anual y deudas, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;

  amortizacionGenerada = false;
}

// Tabla de amortización
verTablaBtn.addEventListener("click", () => {
  tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
  if(tablaContainer.style.display==="block") generarTabla();
});

function generarTabla(){
  if(amortizacionGenerada) return;
  tbody.innerHTML = "";
  let precio = parseFloat(precioInput.value) || 0;
  let entrada = parseFloat(entradaInput.value) || 0;
  let años = parseFloat(añosInput.value) || 0;
  let interes = parseFloat(document.getElementById("interes").value)/100/12 || 0;

  // Impuestos
  let impuestos = tipoVivienda.value === "obraNueva" ? precio*0.10 : precio*parseFloat(comunidadSelect.value);
  let gastosAdicionales = 2500;
  let totalGastos = impuestos + gastosAdicionales;
  let entradaAplicada = Math.min(entrada, totalGastos);
  let capital = precio - (entrada - entradaAplicada);

  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
  amortizacionGenerada = true;
}

// Inicial
ajustarPlazoMax();
calcular();
