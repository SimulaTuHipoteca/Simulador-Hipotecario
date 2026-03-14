// -----------------------------
// UTILIDADES
// -----------------------------
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

function calcularCuota(capital, tipo, plazo) {
  return capital * (tipo * Math.pow(1 + tipo, plazo)) / (Math.pow(1 + tipo, plazo) - 1);
}

// -----------------------------
// SECCIONES PRINCIPALES
// -----------------------------
const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");
const calculadora = document.getElementById("calculadora");
const perfil = document.getElementById("perfil");

btnCalculadora.addEventListener("click", () => {
  calculadora.classList.remove("hidden");
  perfil.classList.add("hidden");
});

btnPerfil.addEventListener("click", () => {
  calculadora.classList.add("hidden");
  perfil.classList.remove("hidden");
});

// -----------------------------
// CALCULADORA HIPOTECA
// -----------------------------
const prestamo = document.getElementById("prestamo");
const interes = document.getElementById("interes");
const anos = document.getElementById("anos");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("interesesTotales");
const totalOut = document.getElementById("totalPagado");
const resultados = document.getElementById("resultados");
const btnCalcular = document.getElementById("btnCalcular");
const tablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

btnCalcular.addEventListener("click", () => {
  const capital = parseFloat(prestamo.value);
  const tipo = parseFloat(interes.value)/100/12;
  const plazo = parseFloat(anos.value)*12;

  if (isNaN(capital) || capital <= 0 || isNaN(tipo) || tipo <= 0 || isNaN(plazo) || plazo <= 0) {
    resultados.classList.add("hidden");
    resultados.classList.remove("show");
    tablaBtn.classList.add("hidden");
    return;
  }

  const cuota = calcularCuota(capital, tipo, plazo);
  const total = cuota * plazo;
  const intereses = total - capital;

  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(intereses);
  totalOut.innerText = formatMoney(total);

  resultados.classList.remove("hidden");
  resultados.classList.add("show");
  tablaBtn.classList.remove("hidden");
});

// -----------------------------
// TABLA AMORTIZACION
// -----------------------------
tablaBtn.addEventListener("click", () => {
  if (!tablaContainer.classList.contains("hidden")) {
    tablaContainer.classList.add("hidden");
    tablaBtn.innerText = "Ver cuadro de amortización";
    return;
  }

  tablaContainer.classList.remove("hidden");
  tablaBtn.innerText = "Ocultar cuadro de amortización";
  generarTabla();
});

function generarTabla() {
  tbody.innerHTML = "";
  const capital = parseFloat(prestamo.value);
  const tipo = parseFloat(interes.value)/100/12;
  const plazo = parseFloat(anos.value)*12;
  const cuota = calcularCuota(capital, tipo, plazo);
  let saldo = capital;
  let html = "";

  for (let i = 1; i <= plazo; i++) {
    const interesMes = saldo * tipo;
    const capitalMes = cuota - interesMes;
    saldo -= capitalMes;

    html += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
  tbody.innerHTML = html;
}

// -----------------------------
// PERFIL FINANCIERO
// -----------------------------
const perfilTitulares = document.getElementById("perfilTitulares");
const titular2Div = document.getElementById("titular2Div");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");
const comunidadDiv = document.getElementById("comunidadDiv");

perfilTitulares.addEventListener("change", () => {
  titular2Div.classList.toggle("hidden", perfilTitulares.value !== "2");
  calcularPerfil();
});

yaTieneVivienda.addEventListener("change", () => {
  viviendaInfo.classList.toggle("hidden", !yaTieneVivienda.checked);
  calcularPerfil();
});

document.querySelectorAll("#perfil input,#perfil select").forEach(el => {
  el.addEventListener("input", calcularPerfil);
});

function calcularPerfil() {
  // --- DATOS DEL PERFIL ---
  const edad1 = parseFloat(document.getElementById("perfilEdad1").value) || 0;
  const edad2 = parseFloat(document.getElementById("perfilEdad2").value) || 0;
  const salario1 = parseFloat(document.getElementById("perfilSalario1").value) || 0;
  const salario2 = parseFloat(document.getElementById("perfilSalario2").value) || 0;
  const pagas = parseFloat(document.getElementById("perfilPagas").value) || 12;
  const deudas = parseFloat(document.getElementById("perfilDeuda").value) || 0;
  const otros = parseFloat(document.getElementById("perfilOtroIngreso").value) || 0;
  const ahorro = parseFloat(document.getElementById("perfilAhorros").value) || 0;

  const ingresosAnuales = (salario1 + salario2) * pagas + (otros*12);
  if (ingresosAnuales <= 0) return;

  // --- CÁLCULO DE CAPITAL MÁXIMO (TIPO 2.8%) ---
  const tipo = 0.028/12;
  const plazo = 30*12;
  const cuotaMax = ingresosAnuales*0.35/12 - deudas;
  const capitalMax = cuotaMax*(Math.pow(1+tipo,plazo)-1)/(tipo*Math.pow(1+tipo,plazo));
  const cuotaEstimada = calcularCuota(capitalMax, tipo, plazo);

  document.getElementById("perfilCapital").innerText = formatMoney(capitalMax);
  document.getElementById("perfilCuota").innerText = formatMoney(cuotaEstimada);

  // LTI
  const lti = ((cuotaEstimada + deudas)*12)/ingresosAnuales;
  const compatibilidad = document.getElementById("perfilCompatible");

  document.getElementById("perfilLTI").innerText = (lti*100).toFixed(1) + "%";

  compatibilidad.classList.remove("viable","riesgo","no-viable");
  if(lti <= 0.35){
    compatibilidad.innerText = "Viable";
    compatibilidad.classList.add("viable");
  } else if(lti <= 0.40){
    compatibilidad.innerText = "Riesgo";
    compatibilidad.classList.add("riesgo");
  } else {
    compatibilidad.innerText = "No viable";
    compatibilidad.classList.add("no-viable");
  }

  // --- DATOS DE VIVIENDA ---
  if(!yaTieneVivienda.checked) return;

  const precio = parseFloat(document.getElementById("perfilPrecio").value) || 0;
  if(precio <= 0) return;

  const tipoOperacion = document.getElementById("perfilTipoOperacion").value;
  const tipoVivienda = document.getElementById("perfilTipoVivienda").value;
  let comunidad = parseFloat(document.getElementById("perfilComunidad").value) || 0;

  comunidadDiv.classList.toggle("hidden", tipoOperacion === "obraNueva");
  if(tipoOperacion === "obraNueva") comunidad = 0;

  let gastos = 2500;
  if(tipoOperacion === "obraNueva") gastos += precio * 0.10;
  else gastos += precio * comunidad;

  const restanteAhorro = ahorro - gastos;
  const capitalSolicitado = precio - (restanteAhorro > 0 ? restanteAhorro : 0);
  const ltv = (capitalSolicitado / precio) * 100;
  const cuotaVivienda = calcularCuota(capitalSolicitado, tipo, plazo);
  const ltiVivienda = ((cuotaVivienda + deudas)*12)/ingresosAnuales;

  document.getElementById("perfilGastos").innerText = formatMoney(gastos);
  document.getElementById("perfilPrestamo").innerText = formatMoney(capitalSolicitado);
  document.getElementById("perfilLTV").innerText = ltv.toFixed(1) + "%";
  document.getElementById("perfilLTIvivienda").innerText = (ltiVivienda*100).toFixed(1) + "%";

  // advertencias
  let mensaje = "";
  if(tipoVivienda === "habitual" && ltv > 100) mensaje = "⚠ La financiación supera el valor de la vivienda.";
  if((tipoVivienda === "segunda" || tipoVivienda === "local") && ltv > 70) mensaje = "⚠ Habitualmente los bancos financian hasta el 70% en este tipo de operación.";
  const entradaNecesaria = precio + gastos - ahorro;
  if(entradaNecesaria > 0) mensaje += " Entrada mínima aproximada: " + formatMoney(entradaNecesaria);

  document.getElementById("perfilMensaje").innerText = mensaje;

  document.getElementById("resultadosVivienda").classList.remove("hidden");
  document.getElementById("resultadosVivienda").classList.add("show");
}
