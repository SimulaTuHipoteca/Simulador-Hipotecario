// Inputs
const precio = document.getElementById("precio");
const entrada = document.getElementById("entrada");
const tipoVivienda = document.getElementById("tipoVivienda");
const titulares = document.getElementById("titulares");
const edad1 = document.getElementById("edad1");
const edad2 = document.getElementById("edad2");
const deuda1 = document.getElementById("deuda1");
const deuda2 = document.getElementById("deuda2");
const años = document.getElementById("años");
const salario = document.getElementById("salario");
const comunidad = document.getElementById("comunidad");
const interes = document.getElementById("interes");

// Output
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const plazoEdadMax = document.getElementById("plazoEdadMax");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");
const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");

let amortizacionGenerada = false;

// Mostrar/ocultar segundo titular
titulares.addEventListener("change", () => {
  if(titulares.value == "2"){
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
  }
  calcular();
});

// Debounce para inputs
const allInputs = [precio, entrada, tipoVivienda, titulares, edad1, edad2, deuda1, deuda2, años, salario, comunidad, interes];
allInputs.forEach(input => input.addEventListener("input", () => setTimeout(calcular, 200)));

function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

function calcular() {
  let p = parseFloat(precio.value) || 0;
  let e = parseFloat(entrada.value) || 0;
  let i = parseFloat(interes.value)/100/12 || 0;
  let n = parseFloat(años.value) || 0;
  let s = parseFloat(salario.value) || 0;
  let com = parseFloat(comunidad.value) || 0;

  // Edad máxima
  let edades = [parseInt(edad1.value)||18];
  if(titulares.value=="2") edades.push(parseInt(edad2.value)||18);
  let edadMax = Math.max(...edades);
  let plazoMaxEdad = 75 - edadMax;
  if(n>plazoMaxEdad) {
    n = plazoMaxEdad;
    años.value = n;
  }
  plazoEdadMax.innerText = `Plazo máximo según edad del mayor: ${plazoMaxEdad} años`;

  // Gastos según tipo de vivienda
  let gastos = 0;
  if(tipoVivienda.value=="obraNueva"){
    gastos = p * 0.10 + 2500; // IVA + escrituras
  } else {
    gastos = p * com + 2500; // ITP + escrituras
  }

  let entradaCasa = Math.max(0, e - gastos);
  let capital = p - entradaCasa;
  let totalMeses = n*12;
  let cuota = capital*(i*Math.pow(1+i,totalMeses))/(Math.pow(1+i,totalMeses)-1);
  let totalIntereses = cuota*totalMeses - capital;

  // Deudas titulares
  let d1 = parseFloat(deuda1.value)||0;
  let d2 = titulares.value=="2" ? parseFloat(deuda2.value)||0 : 0;
  let totalCuotas = cuota + d1 + d2;
  let ltiVal = totalCuotas*12/s;

  // Mostrar resultados
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaCasa+gastos);
  sueldoOut.innerText = formatMoney(cuota*12/0.35);
  ltiOut.innerText = (ltiVal*100).toFixed(1)+"%";

  if(ltiVal<=0.35){
    ltiOut.style.color="green";
    compatibleOut.innerText="Compatible";
    compatibleOut.style.color="green";
  } else if(ltiVal<=0.40){
    ltiOut.style.color="orange";
    compatibleOut.innerText="Aceptable";
    compatibleOut.style.color="orange";
  } else{
    ltiOut.style.color="red";
    compatibleOut.innerText="No viable";
    compatibleOut.style.color="red";
  }

  // Resumen máximo precio según salario
  let maxCapital = s*0.35/12 * n;
  let maxPrecio = maxCapital + entradaCasa;
  document.getElementById("resumen").innerText = `Con tu salario neto anual de ${formatMoney(s)}, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;

  amortizacionGenerada = false;
}

document.getElementById("verTabla").addEventListener("click", toggleTabla);

function toggleTabla(){
  tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
  if(tablaContainer.style.display==="block") generarTabla();
}

function generarTabla(){
  if(amortizacionGenerada) return;
  tbody.innerHTML = "";
  let p = parseFloat(precio.value) || 0;
  let e = parseFloat(entrada.value) || 0;
  let i = parseFloat(interes.value)/100/12 || 0;
  let n = parseFloat(años.value) || 0;
  let com = parseFloat(comunidad.value) || 0;

  // Gastos
  let gastos = tipoVivienda.value=="obraNueva" ? p*0.10+2500 : p*com+2500;
  let entradaCasa = Math.max(0,e-gastos);
  let capital = p - entradaCasa;
  let totalMeses = n*12;
  let cuota = capital*(i*Math.pow(1+i,totalMeses))/(Math.pow(1+i,totalMeses)-1);
  let saldo = capital;

  for(let mes=1; mes<=totalMeses; mes++){
    let interesMes = saldo*i;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr>
      <td>${mes}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }

  amortizacionGenerada = true;
}

// Inicial
calcular();
