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

// --- CALCULO AUTOMÁTICO CALCULADORA ---
function calcular(){
  const capital = parseFloat(prestamoInput.value)||0;
  const interes = (parseFloat(interesInput.value)/100)/12||0;
  const anos = parseFloat(anosInput.value)||0;
  const n = anos*12;

  if(capital <= 0 || interes <= 0 || anos <= 0){
    resultadosDiv.style.display = "none";
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

  resultadosDiv.style.display = "grid";
  verTablaBtn.style.display = "block";
  tablaContainer.style.display = "none"; // ocultar tabla al recalcular
}

// --- TABLA DE AMORTIZACIÓN ---
verTablaBtn.addEventListener("click", () => {
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
  tbody.innerHTML = "";
  const capital = parseFloat(prestamoInput.value)||0;
  const interes = (parseFloat(interesInput.value)/100)/12||0;
  const anos = parseFloat(anosInput.value)||0;
  const n = anos*12;
  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  for(let i=1; i<=n; i++){
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
const titular2Div = document.getElementById("titular2Div");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPlazo = document.getElementById("perfilPlazo");
const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilGastosOut = document.getElementById("perfilGastos");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");

// --- FORMATO MONEDA PERFIL ---
function formatMoneyPerfil(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// --- SEGUNDO TITULAR OPCIONAL ---
perfilTitulares.addEventListener("change", ()=>{
  if(perfilTitulares.value==="2"){
    titular2Div.style.display="block";
  } else {
    titular2Div.style.display="none";
  }
  calcularPerfil();
});

// --- VIVIENDA ---
yaTieneVivienda.addEventListener("change", ()=>{
  viviendaInfo.style.display = yaTieneVivienda.checked?"block":"none";
  calcularPerfil();
});
perfilTipoVivienda.addEventListener("change", calcularPerfil);

// --- CALCULO PERFIL FINANCIERO ---
function calcularPerfil(){
  const nTitulares = parseInt(perfilTitulares.value)||1;
  const edad1 = parseInt(perfilEdad1.value)||0;
  const edad2 = nTitulares===2?parseInt(perfilEdad2.value)||0:0;
  const maxEdad = Math.max(edad1,edad2);
  const plazoMax = Math.min(30,75-maxEdad);
  perfilPlazo.value = plazoMax>0?plazoMax:0;

  const ingresos = (parseFloat(perfilSalario1.value)||0) + (nTitulares===2?(parseFloat(perfilSalario2.value)||0):0) + (parseFloat(perfilOtroIngreso.value)||0);
  const pagas = parseInt(perfilPagas.value)||12;
  const ingresosAnuales = ingresos*pagas;
  const deudas = parseFloat(perfilDeuda.value)||0;

  const euribor = parseFloat(document.getElementById("euriborValor").innerText.replace(',','.')) || 0;
  const tipoRef = (euribor+2.0)/100/12; // referencia Euribor + 2%
  const n = plazoMax*12;
  const cuotaMax = ingresosAnuales*0.35/12 - deudas;
  let capitalPosible = cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*(Math.pow(1+tipoRef,n)));

  // SI YA TIENE VIVIENDA
  let gastos = 0;
  if(yaTieneVivienda.checked){
    const precio = parseFloat(perfilPrecio.value)||0;
    let impuestos = 0;
    if(perfilTipoVivienda.value==="primera"){ impuestos = precio*0.10; }
    else if(perfilTipoVivienda.value==="segunda" || perfilTipoVivienda.value==="local"){ impuestos = precio*0.30; } 
    gastos = impuestos+2500;
    const ahorro = parseFloat(perfilAhorros.value)||0;
    capitalPosible = precio+gastos-ahorro;
  }

  const cuota = capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  const ltv = yaTieneVivienda.checked?(capitalPosible/parseFloat(perfilPrecio.value)*100):0;
  const lti = (cuota+deudas)*12/ingresosAnuales;

  perfilCapitalOut.innerText = formatMoneyPerfil(capitalPosible);
  perfilCuotaOut.innerText = formatMoneyPerfil(cuota);
  perfilLTVOut.innerText = ltv>0?ltv.toFixed(1)+"%":"-";
  perfilGastosOut.innerText = formatMoneyPerfil(gastos);
  perfilLTIOut.innerText = (lti*100).toFixed(1) + "%";

  if(lti<=0.35){ perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green"; }
  else if(lti<=0.40){ perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange"; }
  else { perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red"; }
}

// --- EVENTOS AUTOMÁTICOS PERFIL ---
[
perfilTitulares, perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
perfilPagas, perfilAhorros, perfilDeuda, perfilOtroIngreso,
yaTieneVivienda, perfilPrecio, perfilTipoVivienda, perfilComunidad, perfilPlazo
].forEach(el => el.addEventListener("input", calcularPerfil));

// --- INICIALIZAR ---
calcular();
calcularPerfil();
