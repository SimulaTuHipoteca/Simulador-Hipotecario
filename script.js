// --- SELECCIÓN DE SECCIÓN ---
const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");
const calculadoraDiv = document.getElementById("calculadora");
const perfilDiv = document.getElementById("perfil");

btnCalculadora.addEventListener("click", () => {
  calculadoraDiv.style.display = "block";
  perfilDiv.style.display = "none";
  calculadoraDiv.scrollIntoView({behavior:"smooth"});
});

btnPerfil.addEventListener("click", () => {
  calculadoraDiv.style.display = "none";
  perfilDiv.style.display = "block";
  perfilDiv.scrollIntoView({behavior:"smooth"});
});

// --- ELEMENTOS CALCULADORA ---
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

// --- FORMATO MONEDA ---
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// --- FUNCIÓN CALCULO HIPOTECA ---
function calcular() {
  const capital = parseFloat(prestamoInput.value) || 0;
  const interes = (parseFloat(interesInput.value)/100)/12 || 0;
  const anos = parseFloat(anosInput.value) || 0;
  const n = anos*12;

  if(capital <= 0 || interes <= 0 || anos <= 0){
    resultadosDiv.style.display = "flex";
    verTablaBtn.style.display = "none";
    tablaContainer.style.display = "none";
    return;
  }

  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalPagado = cuota*n;
  const interesesTotales = totalPagado - capital;

  cuotaOut.innerText = formatMoney(cuota);
  interesesTotalesOut.innerText = formatMoney(interesesTotales);
  totalPagadoOut.innerText = formatMoney(totalPagado);

  resultadosDiv.style.display = "flex";
  verTablaBtn.style.display = "block";
  tablaContainer.style.display = "none"; // tabla oculta al recalcular
}

// --- TABLA AMORTIZACIÓN OPCIONAL ---
verTablaBtn.addEventListener("click", ()=>{
  if(tablaContainer.style.display === "none"){
    generarTabla();
    tablaContainer.style.display = "block";
    verTablaBtn.innerText = "Ocultar tabla de amortización";
  } else {
    tablaContainer.style.display = "none";
    verTablaBtn.innerText = "Ver tabla de amortización";
  }
});

function generarTabla(){
  tbody.innerHTML="";
  const capital = parseFloat(prestamoInput.value) || 0;
  const interes = (parseFloat(interesInput.value)/100)/12 || 0;
  const anos = parseFloat(anosInput.value) || 0;
  const n = anos*12;
  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    const interesMes = saldo*interes;
    const capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
}

// --- EVENTOS AUTOMÁTICOS CALCULADORA ---
[prestamoInput, interesInput, anosInput].forEach(el => el.addEventListener("input", calcular));

// --- ELEMENTOS PERFIL ---
const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2 = document.getElementById("perfilSalario2");
const titular2Div = document.getElementById("titular2Div");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPrimeraSegunda = document.getElementById("perfilPrimeraSegunda");
const perfilPlazo = document.getElementById("perfilPlazo");

const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilGastosOut = document.getElementById("perfilGastos");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");
const avisoSegunda = document.getElementById("avisoSegunda");

// --- FORMATO MONEDA ---
function formatMoneyPerfil(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// --- PERFIL ---
perfilTitulares.addEventListener("change", ()=>{
  if(perfilTitulares.value==="2"){
    titular2Div.style.display="block";
  } else {
    titular2Div.style.display="none";
  }
  calcularPerfil();
});

perfilTipoVivienda.addEventListener("change", ()=>{
  perfilComunidad.parentElement.style.display = perfilTipoVivienda.value==="obraNueva"?"none":"block";
  calcularPerfil();
});

yaTieneVivienda.addEventListener("change", ()=>{
  viviendaInfo.style.display = yaTieneVivienda.checked?"block":"none";
  calcularPerfil();
});

let plazoAutoCalculado = false;

// --- PERFIL ---
function calcularPerfil(){
  let nTitulares = parseInt(perfilTitulares.value)||1;
  let edad1 = parseInt(perfilEdad1.value)||0;
  let edad2 = nTitulares===2?parseInt(perfilEdad2.value)||0:0;
  let maxEdad = Math.max(edad1,edad2);
let plazoMax = Math.min(30,75-maxEdad);

// establecer límite máximo
perfilPlazo.max = plazoMax>0?plazoMax:0;

// solo autocalcular la primera vez
if(!plazoAutoCalculado){
  perfilPlazo.value = plazoMax>0?plazoMax:0;
  plazoAutoCalculado = true;
}
  if(plazoMax <= 0) return;

  let ingresos = (parseFloat(perfilSalario1.value)||0) + (nTitulares===2?(parseFloat(perfilSalario2.value)||0):0) + (parseFloat(perfilOtroIngreso.value)||0);
  let pagas = parseInt(perfilPagas.value)||12;
  let ingresosAnuales = ingresos*pagas;
  let deudas = parseFloat(perfilDeuda.value)||0;

  let tipoRef = 0.028/12;
  let plazo = parseInt(perfilPlazo.value) || plazoMax;
let n = plazo*12;
  let cuotaMax = ingresosAnuales*0.35/12 - deudas;
  let capitalPosible = cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*(Math.pow(1+tipoRef,n)));

  // Precio, impuestos y gastos
  let precio = parseFloat(perfilPrecio.value)||0;
  let impuestos = perfilTipoVivienda.value==="obraNueva"?precio*0.10:precio*parseFloat(perfilComunidad.value);
  let gastos = impuestos + 2500;

  // Entrada editable
  let entradaManual = parseFloat(document.getElementById("perfilEntrada")?.value) || null;
  let entrada = (entradaManual !== null && !isNaN(entradaManual)) ? entradaManual
                : (perfilPrimeraSegunda.value === "segunda" ? precio*0.30 : precio*0.20);

  let ahorros = parseFloat(perfilAhorros.value)||0;
  let faltanteEntrada = Math.max(entrada - ahorros, 0);
  let totalAporte = faltanteEntrada + gastos;

  // Si ya tiene vivienda
  if(yaTieneVivienda.checked){
    capitalPosible = precio + gastos - ahorros;
  }

  let cuota = capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  let ltv = precio > 0 ? (capitalPosible / precio * 100) : 0;

// --- ALERTA SEGUNDA RESIDENCIA ULTRACOMPACTA ---
if(perfilPrimeraSegunda.value === "segunda" && ltv > 70){
    avisoSegunda.style.display = "block";
    avisoSegunda.innerHTML = `
      <strong>¡Atención! Segunda residencia con alta financiación:</strong>
      <p>Necesario aportar ${formatMoneyPerfil(faltanteEntrada)}, más gastos aproximados ${formatMoneyPerfil(gastos)}</p>
    `;
} else {
    avisoSegunda.style.display = "none";
}

  // LTI y compatibilidad
  let lti = ingresosAnuales > 0 ? (cuota + deudas)*12 / ingresosAnuales : 0;

  perfilCapitalOut.innerText = formatMoneyPerfil(capitalPosible);
  perfilCuotaOut.innerText = formatMoneyPerfil(cuota);
  perfilLTVOut.innerText = ltv>0?ltv.toFixed(1)+"%":"-";
  perfilGastosOut.innerText = formatMoneyPerfil(gastos);
  perfilLTIOut.innerText = (lti*100).toFixed(1) + "%";

  if(lti <= 0.35){
    perfilCompatibleOut.innerText = "Compatible";
    perfilCompatibleOut.style.color = "green";
  } else if(lti <= 0.40){
    perfilCompatibleOut.innerText = "Aceptable";
    perfilCompatibleOut.style.color = "orange";
  } else {
    perfilCompatibleOut.innerText = "No viable";
    perfilCompatibleOut.style.color = "red";
  }
}

// Evento para actualizar alerta si se cambia la entrada manual
document.getElementById("perfilEntrada")?.addEventListener("input", calcularPerfil);

// --- EVENTOS AUTOMÁTICOS PERFIL ---
[
  perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
  perfilPagas, perfilAhorros, perfilDeuda, perfilOtroIngreso,
  perfilPrecio, perfilPlazo
].forEach(el => el.addEventListener("input", calcularPerfil));

[
  perfilTitulares, perfilTipoVivienda, perfilComunidad, perfilPrimeraSegunda
].forEach(el => el.addEventListener("change", calcularPerfil));

// --- Mostrar/ocultar segundo titular ---
perfilTitulares.addEventListener("change", ()=>{
  titular2Div.style.display = perfilTitulares.value==="2" ? "block" : "none";
  calcularPerfil();
});

// --- Inicializar ---
calcularPerfil();
