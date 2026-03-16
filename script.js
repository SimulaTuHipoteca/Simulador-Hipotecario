// --- SELECCIÓN DE SECCIÓN ---
const btnCalculadora = document.getElementById("btnCalculadora");
const calculadoraDiv = document.getElementById("calculadora");
const perfilDiv = document.getElementById("perfil");

btnCalculadora.addEventListener("click", () => {
  calculadoraDiv.style.display = "block";
  perfilDiv.style.display = "none";
  calculadoraDiv.scrollIntoView({ behavior: "smooth" });
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
function formatMoney(n) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

// --- CALCULO HIPOTECA ---
function calcular() {
  const capital = parseFloat(prestamoInput.value) || 0;
  const interes = (parseFloat(interesInput.value) / 100) / 12 || 0;
  const anos = parseFloat(anosInput.value) || 0;
  const n = anos * 12;

  if (capital <= 0 || interes <= 0 || anos <= 0) {
    resultadosDiv.style.display = "flex";
    verTablaBtn.style.display = "none";
    tablaContainer.style.display = "none";
    return;
  }

  const cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
  const totalPagado = cuota * n;
  const interesesTotales = totalPagado - capital;

  cuotaOut.innerText = formatMoney(cuota);
  interesesTotalesOut.innerText = formatMoney(interesesTotales);
  totalPagadoOut.innerText = formatMoney(totalPagado);

  resultadosDiv.style.display = "flex";
  verTablaBtn.style.display = "block";
  tablaContainer.style.display = "none";
}

// --- TABLA AMORTIZACIÓN ---
verTablaBtn.addEventListener("click", () => {
  if (tablaContainer.style.display === "none") {
    generarTabla();
    tablaContainer.style.display = "block";
    verTablaBtn.innerText = "Ocultar tabla de amortización";
  } else {
    tablaContainer.style.display = "none";
    verTablaBtn.innerText = "Ver cuadro de amortización";
  }
});

function generarTabla() {
  tbody.innerHTML = "";
  const capital = parseFloat(prestamoInput.value) || 0;
  const interes = (parseFloat(interesInput.value) / 100) / 12 || 0;
  const anos = parseFloat(anosInput.value) || 0;
  const n = anos * 12;
  const cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
  let saldo = capital;

  for (let i = 1; i <= n; i++) {
    const interesMes = saldo * interes;
    const capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo, 0))}</td>
    </tr>`;
  }
}

// Eventos automáticos calculadora
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

// Formato moneda perfil
function formatMoneyPerfil(n) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

// --- CALCULO PERFIL ---
let plazoEditadoPorUsuario = false;

function calcularPerfil() {
  const nTitulares = parseInt(perfilTitulares.value) || 1;
  const edad1 = parseInt(perfilEdad1.value) || 0;
  const edad2 = nTitulares === 2 ? parseInt(perfilEdad2.value) || 0 : 0;
  const maxEdad = Math.max(edad1, edad2);
  const plazoMax = Math.min(30, 75 - maxEdad);

  perfilPlazo.max = plazoMax > 0 ? plazoMax : 0;
  if (!plazoEditadoPorUsuario) perfilPlazo.value = plazoMax > 0 ? plazoMax : 0;
  if (plazoMax <= 0) return;

  const ingresos = (parseFloat(perfilSalario1.value) || 0) + (nTitulares === 2 ? (parseFloat(perfilSalario2.value) || 0) : 0) + (parseFloat(perfilOtroIngreso.value) || 0);
  const pagas = parseInt(perfilPagas.value) || 12;
  const ingresosAnuales = ingresos * pagas;
  const deudas = parseFloat(perfilDeuda.value) || 0;

  const tipoRef = 0.028 / 12;
  const plazo = parseInt(perfilPlazo.value) || plazoMax;
  const n = plazo * 12;
  const cuotaMax = ingresosAnuales * 0.35 / 12 - deudas;
  let capitalPosible = cuotaMax * (Math.pow(1 + tipoRef, n) - 1) / (tipoRef * Math.pow(1 + tipoRef, n));

  const precio = parseFloat(perfilPrecio.value) || 0;
  const impuestos = perfilTipoVivienda.value === "obraNueva" ? precio * 0.10 : precio * parseFloat(perfilComunidad.value);
  const gastos = impuestos + 2500;
  const ahorros = parseFloat(perfilAhorros.value) || 0;
  const entrada = perfilPrimeraSegunda.value === "segunda" ? precio * 0.30 : precio * 0.20;
  const faltanteEntrada = Math.max(entrada - ahorros, 0);

  if (yaTieneVivienda.checked) capitalPosible = precio + gastos - ahorros;

  const cuota = capitalPosible * (tipoRef * Math.pow(1 + tipoRef, n)) / (Math.pow(1 + tipoRef, n) - 1);
  const ltv = precio > 0 ? (capitalPosible / precio * 100) : 0;

  if (perfilPrimeraSegunda.value === "segunda" && ltv > 70) {
    avisoSegunda.style.display = "block";
    avisoSegunda.innerHTML = `<strong>¡Atención! Segunda residencia con alta financiación:</strong>
      <p>Necesario aportar ${formatMoneyPerfil(faltanteEntrada)}, más gastos aproximados ${formatMoneyPerfil(gastos)}</p>`;
  } else {
    avisoSegunda.style.display = "none";
  }

  const lti = ingresosAnuales > 0 ? (cuota + deudas) * 12 / ingresosAnuales : 0;

  perfilCapitalOut.innerText = formatMoneyPerfil(capitalPosible);
  perfilCuotaOut.innerText = formatMoneyPerfil(cuota);
  perfilLTVOut.innerText = ltv > 0 ? ltv.toFixed(1) + "%" : "-";
  perfilGastosOut.innerText = formatMoneyPerfil(gastos);
  perfilLTIOut.innerText = (lti * 100).toFixed(1) + "%";

  if (lti <= 0.35) {
    perfilCompatibleOut.innerText = "Compatible";
    perfilCompatibleOut.style.color = "green";
  } else if (lti <= 0.40) {
    perfilCompatibleOut.innerText = "Aceptable";
    perfilCompatibleOut.style.color = "orange";
  } else {
    perfilCompatibleOut.innerText = "No viable";
    perfilCompatibleOut.style.color = "red";
  }
}

// Eventos perfil
perfilPlazo.addEventListener("input", () => { plazoEditadoPorUsuario = true; });
perfilPlazo.addEventListener("change", () => { plazoEditadoPorUsuario = true; calcularPerfil(); });

[
  perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
  perfilPagas, perfilAhorros, perfilDeuda, perfilOtroIngreso,
  perfilPrecio
].forEach(el => { el.addEventListener("input", calcularPerfil); el.addEventListener("change", calcularPerfil); });

[
  perfilTitulares, perfilTipoVivienda, perfilComunidad, perfilPrimeraSegunda
].forEach(el => el.addEventListener("change", calcularPerfil));

perfilTitulares.addEventListener("change", () => {
  titular2Div.style.display = perfilTitulares.value === "2" ? "block" : "none";
  calcularPerfil();
});

// Mostrar información de vivienda si el usuario marca el checkbox
yaTieneVivienda.addEventListener("change", () => {
  viviendaInfo.style.display = yaTieneVivienda.checked ? "block" : "none";
  calcularPerfil();
});

// Inicializar perfil
calcularPerfil();

// --- ENVIO SIMULACION PDF ---
const leadForm = document.getElementById("leadForm");
const leadNombre = document.getElementById("leadNombre");
const leadEmail = document.getElementById("leadEmail");
const leadConsent = document.getElementById("leadConsentimiento");
const leadEnviar = document.getElementById("enviarLead");

leadEnviar.addEventListener("click", () => {
  if (!leadNombre.value || !leadEmail.value || !leadConsent.checked) {
    alert("Por favor, completa todos los campos y acepta la política de privacidad.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Simulación Hipotecaria", 20, 20);
  doc.setFontSize(12);
  doc.text(`Nombre: ${leadNombre.value}`, 20, 40);
  doc.text(`Correo: ${leadEmail.value}`, 20, 50);
  doc.text("Resultados del perfil financiero:", 20, 70);
  doc.text(`Capital posible: ${perfilCapitalOut.innerText}`, 20, 80);
  doc.text(`Cuota mensual: ${perfilCuotaOut.innerText}`, 20, 90);
  doc.text(`% Financiación (LTV): ${perfilLTVOut.innerText}`, 20, 100);
  doc.text(`Gastos estimados: ${perfilGastosOut.innerText}`, 20, 110);
  doc.text(`LTI: ${perfilLTIOut.innerText}`, 20, 120);
  doc.text(`Compatibilidad: ${perfilCompatibleOut.innerText}`, 20, 130);

  doc.save("Simulacion_Hipoteca.pdf");
  alert(`Simulación generada y enviada a: ${leadEmail.value}\nGracias ${leadNombre.value}!`);
  leadForm.reset();
});

// --- BANNER DE COOKIES ---
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const btnAceptar = document.getElementById("btnAceptarCookies");
  const btnRechazar = document.getElementById("btnRechazarCookies");

  if (!banner || !btnAceptar || !btnRechazar) return;

  const cookiesAceptadas = localStorage.getItem("cookiesAceptadas");
  if (cookiesAceptadas === "true" || cookiesAceptadas === "false") {
    banner.style.display = "none";
  } else {
    banner.style.display = "flex";
  }

  function ocultarBanner(valor) {
    localStorage.setItem("cookiesAceptadas", valor);
    banner.style.display = "none";
    console.log(valor === "true" ? "Cookies aceptadas ✅" : "Cookies rechazadas ❌");
  }

  btnAceptar.addEventListener("click", () => ocultarBanner("true"));
  btnRechazar.addEventListener("click", () => ocultarBanner("false"));
});

// --- FUNCIONES TIPO DE OPERACION ---
function abrirOperacion(id) {
  const todas = document.querySelectorAll('.card-content');

  todas.forEach(cc => {
    if (cc.id === id) {
      cc.classList.toggle('open');
    } else {
      cc.classList.remove('open');
    }
  });
}

function irAnalisis(event, tipo) {
  event.stopPropagation(); // evitar que se cierre la tarjeta

  // Mostrar sección perfil y ocultar calculadora
  perfilDiv.style.display = "block";
  calculadoraDiv.style.display = "none";

  // Badge de operación seleccionada
  const badge = document.getElementById("operacionSeleccionada");
  badge.style.display = "block";
  badge.innerText = `Operación seleccionada: ${tipo}`;

  // Ajustar campos según tipo de operación
  switch(tipo) {
    case 'Compra Primera Vivienda':
      perfilPrimeraSegunda.value = 'primera';
      yaTieneVivienda.checked = false;
      break;
    case 'Cambio de Hipoteca':
      perfilPrimeraSegunda.value = 'segunda';
      yaTieneVivienda.checked = true;
      break;
    case 'Inversión':
      perfilPrimeraSegunda.value = 'segunda';
      yaTieneVivienda.checked = false;
      break;
  }

  // Mostrar u ocultar info vivienda
  viviendaInfo.style.display = yaTieneVivienda.checked ? "block" : "none";

  // Recalcular perfil financiero
  calcularPerfil();

  // Scroll suave al perfil
  perfilDiv.scrollIntoView({ behavior: 'smooth' });
}
