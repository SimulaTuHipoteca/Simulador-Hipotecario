// -----------------------------
// FUNCIONES GLOBALES (FUERA)
// -----------------------------
window.abrirOperacion = function(id){
  let abierta = false;

  document.querySelectorAll('.card-content').forEach(cc => {
    if(cc.id === id){
      cc.classList.toggle('open'); 
      abierta = cc.classList.contains('open');
    } else {
      cc.classList.remove('open'); 
    }
  });
  
  if (abierta) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
};
  
window.cerrarCalculadora = function () {
  document.querySelectorAll('.card-content').forEach(cc => {
    cc.classList.remove('open');
  });
  document.body.classList.remove("modal-open");
};

window.irAnalisis = function(event, tipoOperacion){
  event.stopPropagation();

  if(tipoOperacion === 'Cambio de Hipoteca'){ 
    window.location.href = 'consolidacion.html'; 
    return;
  }

  if(tipoOperacion === 'Consolidación'){ 
    window.location.href = 'consolidacion.html'; 
    return; 
  }

  const idMap = { 
    'Compra Primera Vivienda': 'compra', 
    'Inversión': 'inversion' 
  };
  
  const id = idMap[tipoOperacion];
  if(id) window.abrirOperacion(id);

  const perfilDiv = document.getElementById("perfil");
  const badge = document.getElementById("operacionSeleccionada");
  const primeraSegunda = document.getElementById("perfilPrimeraSegunda");

  if(!perfilDiv || !badge) return;

  perfilDiv.style.display = "block";
  badge.style.display = "block";
  badge.innerText = `Operación seleccionada: ${tipoOperacion}`;

  if (primeraSegunda) {
    if(tipoOperacion === 'Compra Primera Vivienda') primeraSegunda.value = 'primera';
    if(tipoOperacion === 'Inversión') primeraSegunda.value = 'segunda';
  }

  setTimeout(() => {
    const yOffset = -40;
    requestAnimationFrame(() => {
  const y = perfilDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: 'smooth' });
});
  }, 100);
};

document.addEventListener("DOMContentLoaded", () => {

// -----------------------------
// EURIBOR ACTUAL (SIMULADO/API)
// -----------------------------
const euriborElement = document.getElementById("euribor-value");

async function cargarEuribor() {
  try {
    // 👉 OPCIÓN REAL (API pública - ejemplo)
    const response = await fetch("https://api.api-ninjas.com/v1/interestrate?name=euribor", {
      headers: { "X-Api-Key": "TU_API_KEY_AQUI" }
    });

    if (!response.ok) throw new Error("Error API");

    const data = await response.json();
    const euribor = data.rate || 2.8;

    euriborElement.innerText = euribor.toFixed(2) + " %";

  } catch (error) {
    console.warn("Usando euríbor simulado");

    // 👉 fallback (MUY IMPORTANTE)
    const euriborSimulado = 2.8;
    euriborElement.innerText = euriborSimulado.toFixed(2) + " %";
  }
}

cargarEuribor();
  
  // -----------------------------
  // AUXILIARES
  // -----------------------------
const formatMoney = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

function corregirInput(input, min = 0, max = Infinity) {
  if (!input) return;

  let valor = parseFloat(input.value);

  if (isNaN(valor) || valor < min) valor = min;
  if (valor > max) valor = max;

  input.value = valor;
}

  // -----------------------------
  // MODAL CALCULADORA
  // -----------------------------
  const btnCalculadoraFlotante = document.getElementById("btnCalculadoraFlotante");
  const modal = document.getElementById("modalCalculadora");
  const cerrar = document.getElementById("cerrarModal");
 if (btnCalculadoraFlotante && modal && cerrar) {
   btnCalculadoraFlotante.addEventListener("click", () => {
    modal.classList.add("open");
  });

  cerrar.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  window.addEventListener("click", e => {
    if (e.target === modal) {modal.classList.remove("open");}
  });

}

  // -----------------------------
  // CALCULADORA HIPOTECARIA
  // -----------------------------
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

  const calcular = () => {
    const capital = parseFloat(prestamoInput?.value) || 0;
    const interes = (parseFloat(interesInput?.value) / 100) / 12 || 0;
    const anos = parseFloat(anosInput?.value) || 0;
    const n = anos * 12;

    if (capital <= 0 || interes <= 0 || anos <= 0) {
      if (resultadosDiv) resultadosDiv.style.display = "none";
      if (verTablaBtn) verTablaBtn.style.display = "none";
      if (tablaContainer) tablaContainer.style.display = "none";
      return;
    }

   let cuota;
if (interes === 0) {
  cuota = capital / n;
} else {
  cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
}
    const totalPagado = cuota * n;
    const interesesTotales = totalPagado - capital;

    cuotaOut && (cuotaOut.innerText = formatMoney(cuota));
    interesesTotalesOut && (interesesTotalesOut.innerText = formatMoney(interesesTotales));
    totalPagadoOut && (totalPagadoOut.innerText = formatMoney(totalPagado));

    resultadosDiv && (resultadosDiv.style.display = "block");
    verTablaBtn && (verTablaBtn.style.display = "block");
    tablaContainer && (tablaContainer.style.display = "none");
  };

const generarTabla = () => {
  if (!tbody) return;

  const capital = parseFloat(prestamoInput?.value) || 0;
  const interes = (parseFloat(interesInput?.value) / 100) / 12 || 0;
  const anos = parseFloat(anosInput?.value) || 0;
  const n = anos * 12;

const cuota = calcularCuota(capital, interes, n);

  let saldo = capital;
  let html = "";

  for (let i = 1; i <= n; i++) {
    const interesMes = saldo * interes;
    const capitalMes = cuota - interesMes;
    saldo -= capitalMes;

    html += `
      <tr>
        <td>${i}</td>
        <td>${formatMoney(cuota)}</td>
        <td>${formatMoney(interesMes)}</td>
        <td>${formatMoney(capitalMes)}</td>
        <td>${formatMoney(Math.max(saldo,0))}</td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
};

  [prestamoInput, interesInput, anosInput].forEach(el => el && el.addEventListener("input", calcular));
  verTablaBtn && verTablaBtn.addEventListener("click", () => {
    if (!tablaContainer) return;
    if (tablaContainer.style.display === "none") {
      generarTabla();
      tablaContainer.style.display = "block";
      verTablaBtn.innerText = "Ocultar tabla de amortización";
    } else {
      tablaContainer.style.display = "none";
      verTablaBtn.innerText = "Ver cuadro de amortización";
    }
  });

  // -----------------------------
  // PERFIL FINANCIERO
  // -----------------------------
 // -----------------------------

let plazoEditadoPorUsuario = false;

const perfilDiv = document.getElementById("perfil");

const perfilFields = {
  titulares: document.getElementById("perfilTitulares"),
  edad1: document.getElementById("perfilEdad1"),
  edad2: document.getElementById("perfilEdad2"),
  titular2Div: document.getElementById("titular2Div"),
  salario1: document.getElementById("perfilSalario1"),
  salario2: document.getElementById("perfilSalario2"),

  ahorros: document.getElementById("perfilAhorros"),
  deuda: document.getElementById("perfilDeuda"),
  otroIngreso: document.getElementById("perfilOtroIngreso"),
 

  viviendaCheck: document.getElementById("agregardatosdelavivienda"),
  viviendaInfo: document.getElementById("viviendaInfo"),
  precio: document.getElementById("perfilPrecio"),
  tipoVivienda: document.getElementById("perfilTipoVivienda"),
  comunidad: document.getElementById("perfilComunidad"),
  primeraSegunda: document.getElementById("perfilPrimeraSegunda"),
  plazo: document.getElementById("perfilPlazo"),
  capitalOut: document.getElementById("perfilCapital"),
  cuotaOut: document.getElementById("perfilCuota"),
  ltvOut: document.getElementById("perfilLTV"),
  gastosOut: document.getElementById("perfilGastos"),
  ltiOut: document.getElementById("perfilLTI"),
  compatibleOut: document.getElementById("perfilCompatible"),
  avisoSegunda: document.getElementById("avisoSegunda"),
  operacionBadge: document.getElementById("operacionSeleccionada"),
  contrato: document.getElementById("perfilContrato1"),
antiguedad: document.getElementById("perfilAntiguedad1"),
};

      
      function calcularScore({ ingresosAnuales, ahorros, deudas, contrato, antiguedad }) {
  let score = 0;

  // INGRESOS
  if (ingresosAnuales > 60000) score += 3;
  else if (ingresosAnuales > 30000) score += 2;
  else score += 1;

  // AHORRO
  if (ahorros > 50000) score += 2;
  else if (ahorros > 20000) score += 1;

  // DEUDA
  if (deudas === 0) score += 2;
  else if (deudas < 300) score += 1;

  // CONTRATO
  if (contrato === "indefinido") score += 2;
  if (contrato === "autonomo") score -= 1;

  // ANTIGÜEDAD
  if (antiguedad > 5) score += 2;
  else if (antiguedad > 2) score += 1;

  return score;
}

function limpiarNumero(valor, min = 0, max = Infinity) {
  let n = parseFloat(valor);

  if (isNaN(n)) return 0;

  if (n < min) n = min;
  if (n > max) n = max;

  return n;
}
  
function calcularPerfil() {
  const f = perfilFields;
  const msg = document.getElementById("mensajePerfil");
  // =====================
  // INPUTS
  // =====================
  const titulares = parseInt(f.titulares?.value) || 1;

  const edad1 = parseInt(f.edad1?.value) || 0;
  const edad2 = titulares === 2 ? (parseInt(f.edad2?.value) || 0) : 0;

  const maxEdad = Math.max(edad1, edad2);
  const plazoMax = Math.max(0, Math.min(30, 75 - maxEdad));

  if (f.plazo) {
    f.plazo.max = plazoMax;
    if (!plazoEditadoPorUsuario) f.plazo.value = plazoMax;
  }

  if (plazoMax <= 0) return;

  const n = (parseInt(f.plazo?.value) || plazoMax) * 12;
const familiaNumerosa = document.getElementById("familiaNumerosa")?.checked;
const discapacidad = document.getElementById("discapacidad")?.checked;
  // =====================
  // INGRESOS
  // =====================
const s1 = limpiarNumero(f.salario1?.value, 0, 1000000);
const s2 = titulares === 2 ? limpiarNumero(f.salario2?.value, 0, 1000000) : 0;

  const p1 = parseInt(document.getElementById("perfilPagas1")?.value) || 12;
  const p2 = titulares === 2 ? (parseInt(document.getElementById("perfilPagas2")?.value) || 12) : 12;

  const ingresosAnuales = (s1 * p1) + (s2 * p2) + (parseFloat(f.otroIngreso?.value) || 0);

const ahorros = limpiarNumero(f.ahorros?.value, 0, 10000000);
const deudas = limpiarNumero(f.deuda?.value, 0, 100000);
  // =====================
  // FACTOR HIPOTECA (OPT)
  // =====================
  const tipoRef = 0.035 / 12;
  const pow = Math.pow(1 + tipoRef, n);
  const factorHipoteca = (pow - 1) / (tipoRef * pow);

  // =====================
  // SCORE
  // =====================
  let score = 0;

  score += ingresosAnuales > 60000 ? 3 : ingresosAnuales > 30000 ? 2 : 1;
  score += ahorros > 50000 ? 2 : ahorros > 20000 ? 1 : 0;
  score += deudas === 0 ? 2 : deudas < 300 ? 1 : 0;

  const contrato1 = document.getElementById("perfilContrato1")?.value || "indefinido";
const contrato2 = titulares === 2 ? (document.getElementById("perfilContrato2")?.value || "indefinido") : "indefinido";

const antiguedad1 = parseInt(document.getElementById("perfilAntiguedad1")?.value) || 0;
const antiguedad2 = titulares === 2 ? (parseInt(document.getElementById("perfilAntiguedad2")?.value) || 0) : 0;

const contrato = contrato1 === "autonomo" || contrato2 === "autonomo"
  ? "autonomo"
  : (contrato1 === "temporal" || contrato2 === "temporal" ? "temporal" : "indefinido");

const antiguedad = Math.max(antiguedad1, antiguedad2);

  if (contrato === "indefinido") score += 2;
  if (contrato === "autonomo") score -= 1;

  score += antiguedad > 5 ? 2 : antiguedad > 2 ? 1 : 0;

  const scoreFactor =
    score >= 8 ? 1 :
    score >= 6 ? 0.9 :
    score >= 4 ? 0.8 : 0.7;

  // =====================
  // VIVIENDA
  // =====================
  const usarVivienda = f.viviendaCheck?.checked || false;

const precio = usarVivienda ? limpiarNumero(f.precio?.value, 50000, 5000000) : 0;
  const esSegunda = f.primeraSegunda?.value === "segunda";
const comunidad = f.comunidad?.value;
  
let impuestos = 0;
let tipoITP = 0;

if (usarVivienda) {

  const itpManualInput = document.getElementById("itpManual");
  const itpManualValor = parseFloat(itpManualInput?.value);

  let resultadoITP;

  const tipoVivienda = f.tipoVivienda?.value;

  // 🔥 PRIORIDAD: manual
 if (tipoVivienda === "obraNueva") {
  resultadoITP = {
    tipo: 0.10,
    cuotaITP: precio * 0.10
  };
}
else if (usarVivienda && !isNaN(itpManualValor) && itpManualValor > 0) {
    const tipoManual = itpManualValor / 100;

    resultadoITP = {
      tipo: tipoManual,
      cuotaITP: precio * tipoManual
    };

  } else {

    resultadoITP = calcularITP({
      comunidad,
      precio,
      edad: edad1,
      ingresos: ingresosAnuales,
      esViviendaHabitual: !esSegunda,
      familiaNumerosa,
      discapacidad
    });

  }

  tipoITP = resultadoITP.tipo;
  impuestos = resultadoITP.cuotaITP;
}

  // =====================
  // 🔥 FINANCIACIÓN JÓVENES (100% OK)
  // =====================
  const esJoven = edad1 < 35 || edad2 < 35;

  const baseFin =
    esSegunda ? 0.7 :
    ingresosAnuales < 50000 ? 0.9 : 0.8;

  const maxFinanciacion = esJoven
    ? Math.min(1.0, baseFin + 0.1)
    : Math.min(baseFin, scoreFactor);

  // =====================
  // PRÉSTAMO NECESARIO (AHORRO APLICADO AQUÍ)
  // =====================
  


// =====================
// SIN VIVIENDA
// =====================
  if (!usarVivienda) {

  const ratio = 0.35;
  const cuotaMax = Math.max((ingresosAnuales * ratio) / 12 - deudas, 0);
if (cuotaMax === 0) {

  if (ingresosAnuales <= 0) {
    msg.innerText = "Introduce tus ingresos para calcular tu capacidad de compra.";
    msg.className = "mensaje-perfil mensaje-neutral";

  } else if (deudas > 0) {
    msg.innerText = "⚠️ Tus deudas actuales limitan tu capacidad para asumir una hipoteca.";
    msg.className = "mensaje-perfil mensaje-warning";

  } else {
    msg.innerText = "⚠️ Con tus ingresos actuales no es posible asumir una hipoteca.";
    msg.className = "mensaje-perfil mensaje-warning";
  }

  msg.style.display = "block";
  return;
}
  let capitalBanco = cuotaMax * factorHipoteca;

  const precioMaximo = capitalBanco / 0.8; // asumimos 80% financiación estándar
  const precioIdeal = precioMaximo * 0.9;

  f.capitalOut.innerText = formatMoney(capitalBanco);
  f.cuotaOut.innerText = formatMoney(cuotaMax);
  f.ltvOut.innerText = "-";
 f.gastosOut.innerText =
  `${formatMoney(impuestos)} (${(tipoITP * 100).toFixed(2)}%)`;
  f.ltiOut.innerText = "-";

  if (msg) {
    msg.style.display = "block";
    msg.className = "mensaje-perfil mensaje-ok";
    msg.innerText = `💡 Según tus ingresos:

🏠 Precio máximo estimado: ${formatMoney(precioMaximo)}
🎯 Precio recomendable: ${formatMoney(precioIdeal)}

Puedes ver opciones sin necesidad de introducir una vivienda concreta.`;
  }

  return;
}

// =====================
// 🔥 MODELO BANCO REAL
// =====================

// 1. GASTOS
const itpManualInput = document.getElementById("itpManual");
const itpManualValor = parseFloat(itpManualInput?.value);

let tipoITP;

if (!isNaN(itpManualValor) && itpManualValor > 0) {
  tipoITP = itpManualValor / 100;
} else {
  const resultadoITP = calcularITP({
    comunidad,
    precio,
    edad: edad1,
    ingresos: ingresosAnuales,
    esViviendaHabitual: !esSegunda,
    familiaNumerosa,
    discapacidad
  });

  tipoITP = resultadoITP.tipo;
}

const impuestosCalculados = precio * tipoITP;
const gastos = impuestosCalculados + 2500;

// 2. TOTAL OPERACIÓN
const totalOperacion = precio + gastos;

// 3. LÍMITE BANCO (IMPORTANTE: antes de usarlo en entrada mínima)
const maxPrestamo = precio * maxFinanciacion;

// 4. NECESIDAD REAL
const entradaMinima = totalOperacion - maxPrestamo;
const puedeCubrirEntrada = ahorros >= entradaMinima;

if (!puedeCubrirEntrada) {
  if (msg) {
    msg.style.display = "block";
    msg.className = "mensaje-perfil mensaje-warning";
    msg.innerText = `❌ No alcanzas la entrada mínima requerida (${formatMoney(entradaMinima)}).`;
  }

  return;
}

// 5. PRÉSTAMO NECESARIO
const prestamoNecesario = totalOperacion - ahorros;

// 6. CAPACIDAD POR INGRESOS
const ratio = usarVivienda ? 0.40 : 0.35;

const cuotaMax = Math.max(
  (ingresosAnuales * ratio) / 12 - deudas,
  0
);

// 7. CAPACIDAD BANCO
let capitalBanco = cuotaMax * factorHipoteca;
capitalBanco = Math.min(capitalBanco, maxPrestamo);

// 8. PRÉSTAMO FINAL
const capital = Math.min(capitalBanco, prestamoNecesario);

const cuota = calcularCuota(capital, tipoRef, n);

// 9. DINERO FALTANTE
const aportacionNecesaria = totalOperacion - capital;
const faltaDinero = Math.max(aportacionNecesaria - ahorros, 0);
// =====================
// CUOTA
// =====================

const ltv = precio ? (capital / precio) * 100 : 0;
const lti = ingresosAnuales ? ((cuota + deudas) * 12) / ingresosAnuales : 0;

  // 🎯 PRECIO IDEAL (dinámico según riesgo)
let factorIdeal = 0.9;

if (lti <= 0.30) factorIdeal = 0.95;
else if (lti <= 0.35) factorIdeal = 0.9;
else if (lti <= 0.45) factorIdeal = 0.85;
else factorIdeal = 0.8;

  const precioMaximo = capitalBanco / maxFinanciacion;
const precioIdeal = precioMaximo * factorIdeal;
  // =====================
  // OUTPUTS
  // =====================
  f.capitalOut.innerText = formatMoney(capital);
  f.cuotaOut.innerText = formatMoney(cuota);
  f.ltvOut.innerText = precio ? ltv.toFixed(1) + "%" : "-";
f.gastosOut.innerText =
  `${formatMoney(impuestos)} (${(tipoITP * 100).toFixed(2)}%)`;
  f.ltiOut.innerText = (lti * 100).toFixed(1) + "%";

  // =====================
  // COMPATIBILIDAD
  // =====================
  if (f.compatibleOut) {
    f.compatibleOut.className = "";

    if (lti <= 0.35) {
      f.compatibleOut.innerText = "Compatible";
      f.compatibleOut.classList.add("green");
    } else if (lti <= 0.40) {
      f.compatibleOut.innerText = "Aceptable";
      f.compatibleOut.classList.add("orange");
    } else {
      f.compatibleOut.innerText = "No viable";
      f.compatibleOut.classList.add("red");
    }
  }
// =====================
// VALIDACIÓN DATOS MÍNIMOS
// =====================
const datosMinimosOK =
  ingresosAnuales > 0 &&
  n > 0 &&
  (usarVivienda ? precio > 50000 : true);
    if (!datosMinimosOK) {
  if (msg) {
    msg.style.display = "block";
    msg.className = "mensaje-perfil mensaje-neutral";
    msg.innerText = "Introduce tus datos para ver tu análisis financiero.";
  }
  return;
}
// =====================
// MENSAJE PRO+ (UX REAL)
// =====================
if (msg) {
  msg.style.display = "block";
  msg.className = "mensaje-perfil";

  let resumen = "";
  let detalle = "";
  let aviso = "";

  // =====================
  // PERFIL (1 línea potente)
  // =====================
  if (prestamoNecesario === 0) {
    resumen = "✅ Puedes comprar sin financiación";
    msg.classList.add("mensaje-ok");

  } else if (faltaDinero > 0) {
    resumen = "❌ No tienes ahorro suficiente para esta compra";
    msg.classList.add("mensaje-warning");

  } else if (lti <= 0.35) {
    resumen = "✅ Perfil sólido: alta probabilidad de aprobación";
    msg.classList.add("mensaje-ok");

  } else if (lti <= 0.45) {
    resumen = "⚠️ Perfil justo: podrían exigirte más condiciones";
    msg.classList.add("mensaje-warning");

  } else {
    resumen = "❌ Riesgo elevado: difícil aprobación";
    msg.classList.add("mensaje-warning");
  }

  // =====================
  // DETALLE ECONÓMICO (claro y directo)
  // =====================
  detalle = `🏠 Máximo banco: ${formatMoney(precioMaximo)}
🎯 Precio cómodo: ${formatMoney(precioIdeal)}`;

  // =====================
  // AVISO INTELIGENTE (clave conversión)
  // =====================
  if (precio > precioMaximo) {
    aviso = "❌ Este precio no pasaría un estudio bancario.";
  } else if (precio > precioIdeal) {
    aviso = "⚠️ Estás por encima del nivel recomendado (irías justo).";
  } else {
    aviso = "✅ Estás dentro de un rango saludable.";
  }

  // =====================
  // FALTA DINERO (solo si aplica)
  // =====================
  let extra = "";

  if (faltaDinero > 0) {
    extra = `

💸 Te faltan ${formatMoney(faltaDinero)} para cerrar la operación.`;
  }

  // =====================
  // MENSAJE FINAL (orden perfecto)
  // =====================
  msg.innerText = `${resumen}

${detalle}

${aviso}${extra}`;
}
  // =====================
  // BADGE
  // =====================
  if (f.operacionBadge) {
    f.operacionBadge.innerText =
      `Operación: ${esSegunda ? "Inversión" : "Primera vivienda"} | Score ${score}`;
  }
}
// -----------------------------
// TOGGLE CARD VIVIENDA
// -----------------------------
const toggleCard = document.getElementById("toggleVivienda");

// -----------------------------
// ACTUALIZAR VIVIENDA INFO
// -----------------------------
const actualizarViviendaInfo = () => {
  if (!perfilFields.viviendaCheck || !perfilFields.viviendaInfo) return;

  const activo = perfilFields.viviendaCheck.checked;

  perfilFields.viviendaInfo.style.display = activo ? "block" : "none";

  if (toggleCard) {
    toggleCard.classList.toggle("active", activo);
  }

  calcularPerfil();
};

  // -----------------------------
// SELECTOR TITULARES (BOTONES)
// -----------------------------
const botonesTitulares = document.querySelectorAll(".btn-selector");
const inputTitulares = document.getElementById("perfilTitulares");

botonesTitulares.forEach(btn => {
  btn.addEventListener("click", () => {
    botonesTitulares.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    inputTitulares.value = btn.dataset.value;

    // 🔥 esto hace que tu sistema actual funcione
    inputTitulares.dispatchEvent(new Event("change"));
  });
});
  
// -----------------------------
// EVENTO CHECKBOX
// -----------------------------
if (perfilFields.viviendaCheck && perfilFields.viviendaInfo) {
  perfilFields.viviendaCheck.addEventListener("change", actualizarViviendaInfo);
  actualizarViviendaInfo();
}

// -----------------------------
// SINCRONIZAR AL CARGAR
// -----------------------------
actualizarViviendaInfo();

// -----------------------------
// CLICK EN TARJETA
// -----------------------------
if (toggleCard && perfilFields.viviendaCheck) {
  toggleCard.addEventListener("click", (e) => {
    if (e.target.closest("input, select, label")) return;
    perfilFields.viviendaCheck.click();
  });
}

 // EVENTOS PERFIL// -------
perfilFields.plazo && perfilFields.plazo.addEventListener("input", () => plazoEditadoPorUsuario = true);

[
  perfilFields.edad1, perfilFields.edad2, perfilFields.salario1, perfilFields.salario2,
  perfilFields.ahorros, perfilFields.deuda, perfilFields.otroIngreso,
  perfilFields.precio
].forEach(el => el && (el.addEventListener("input", calcularPerfil), el.addEventListener("change", calcularPerfil)));

[
  perfilFields.titulares,
  perfilFields.tipoVivienda,
  perfilFields.comunidad,
  perfilFields.primeraSegunda,
  perfilFields.contrato,
  perfilFields.antiguedad
].forEach(el => el && el.addEventListener("change", calcularPerfil));

perfilFields.titulares && perfilFields.titular2Div && perfilFields.titulares.addEventListener("change", () => {
  perfilFields.titular2Div.style.display = perfilFields.titulares.value === "2" ? "block" : "none";
  calcularPerfil();
});

  document.getElementById("familiaNumerosa")?.addEventListener("change", calcularPerfil);
document.getElementById("discapacidad")?.addEventListener("change", calcularPerfil);
  document.getElementById("itpManual")?.addEventListener("input", calcularPerfil);
  // 🔒 VALIDACIÓN INPUTS (ANTI-NEGATIVOS)
perfilFields.salario1 && perfilFields.salario1.addEventListener("blur", () => corregirInput(perfilFields.salario1, 0));
perfilFields.salario2 && perfilFields.salario2.addEventListener("blur", () => corregirInput(perfilFields.salario2, 0));
perfilFields.ahorros && perfilFields.ahorros.addEventListener("blur", () => corregirInput(perfilFields.ahorros, 0));
perfilFields.deuda && perfilFields.deuda.addEventListener("blur", () => corregirInput(perfilFields.deuda, 0));
perfilFields.precio && perfilFields.precio.addEventListener("blur", () => corregirInput(perfilFields.precio, 50000));
perfilFields.comunidad && perfilFields.comunidad.addEventListener("blur", () => corregirInput(perfilFields.comunidad, 0, 0.2));
// -----------------------------
// LLAMAR PERFIL AL INICIO
// -----------------------------
calcularPerfil();


// -----------------------------
// ENVÍO DE LEADS Y PDF
// -----------------------------
const statusSpan = document.getElementById("leadMensaje");
const enviarBtn = document.getElementById("enviarLead");
const SERVER_URL = ""; // URL servidor

if (enviarBtn && statusSpan) {
  enviarBtn.addEventListener("click", async () => {
    const nombre = document.getElementById("leadNombre")?.value.trim() || "";
    const email = document.getElementById("leadEmail")?.value.trim() || "";
    const consentimiento = document.getElementById("leadConsentimiento")?.checked || false;

const precio = perfilFields.viviendaCheck?.checked
  ? perfilFields.precio?.value
  : 0;
const precioFormateado = formatMoney(parseFloat(precio) || 0);
    
    if (!nombre || !email || !consentimiento) {
      statusSpan.style.color = "red";
      statusSpan.innerText = "Por favor completa todos los campos y acepta la política.";
      return;
    }

    const capital = perfilFields.capitalOut?.innerText || "0";
    const cuota = perfilFields.cuotaOut?.innerText || "0";
    const ltv = perfilFields.ltvOut?.innerText || "0";
    const gastos = perfilFields.gastosOut?.innerText || "0";
    const lti = perfilFields.ltiOut?.innerText || "0";
    const compatibilidad = perfilFields.compatibleOut?.innerText || "-";

    // -----------------------------
    // PDF
    // -----------------------------
    let doc = null;
    try {
      if(window.jspdf){
        const { jsPDF } = window.jspdf;
        doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("KAOBA FINANCE", 20, 20);
        doc.setFontSize(12);
        doc.text("Informe de Simulación Hipotecaria", 20, 28);
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Datos del cliente", 20, 45);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Nombre: ${nombre}`, 20, 53);
        doc.text(`Email: ${email}`, 20, 59);

        doc.setDrawColor(200);
        doc.rect(20, 70, 170, 50);
        doc.setFont("helvetica", "bold");
        doc.text("Resumen de la simulación", 25, 78);
        doc.setFont("helvetica", "normal");
        const resumen = [
            ["Precio de compra", precioFormateado],
          ["Importe préstamo", capital],
          ["Cuota mensual", cuota],
          ["Financiación (LTV)", ltv],
          ["Gastos aproximados", gastos],
          ["Ratio endeudamiento", lti],
        ];
        
        let y = 86;
        resumen.forEach(row => {
          doc.setFont("helvetica", "bold");
          doc.text(row[0], 25, y);
          doc.setFont("helvetica", "normal");
          doc.text(row[1], 120, y);
          y += 6;
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Análisis del perfil financiero", 20, 135);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let analisis = "";
        if (compatibilidad === "Compatible") analisis = "Tu perfil presenta alta probabilidad de aprobación.";
        else if (compatibilidad === "Aceptable") analisis = "Perfil viable, algunas condiciones adicionales podrían aplicarse.";
        else analisis = "Perfil no cumple criterios habituales de riesgo bancario.";
        doc.text(analisis, 20, 143, { maxWidth: 170 });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Recomendaciones personalizadas", 20, 165);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let recomendaciones = [];
        if (parseFloat(lti) > 35) recomendaciones.push("- Reducir deudas para mejorar ratio de endeudamiento");
        if (ltv > 80)
        recomendaciones.push("- Mantener estabilidad laboral");
        recomendaciones.push("- Comparar ofertas entre entidades bancarias");

        recomendaciones.forEach((rec, i) => {
          doc.text(rec, 20, 173 + (i * 6));
        });

        // DISCLAIMER
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(
          "Este documento es una simulación orientativa basada en criterios financieros estándar. " +
          "No constituye una oferta vinculante ni garantiza la concesión del préstamo. " +
          "La aprobación final dependerá de cada entidad bancaria tras el estudio de riesgo correspondiente.",
          20,
          250,
          { maxWidth: 170 }
        );

        // FOOTER
        doc.setTextColor(0);
        doc.setFontSize(9);
        doc.text("Kaoba Finance © 2026", 20, 285);

        // EXPORTAR PDF
        doc.save("Informe_Hipotecario_Kaoba.pdf");
      }
    } catch (e) {
      console.error("Error generando PDF:", e);
    }

    statusSpan.style.color = "green";
    statusSpan.innerText = doc ? "Simulación generada y PDF descargado (modo demo)" : "Simulación generada (PDF no disponible)";

    // ENVÍO AL SERVIDOR
    if (!SERVER_URL) return;
    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, capital, cuota, ltv, gastos, lti, compatibilidad })
      });
      const result = await response.json();
      if (result.ok) {
        statusSpan.style.color = "green";
        statusSpan.innerText = `Simulación enviada a ${email}`;
      } else {
        statusSpan.style.color = "orange";
        statusSpan.innerText = `Simulación enviada, pero hubo un detalle en el servidor.`;
      }
    } catch (err) {
      console.error(err);
      statusSpan.style.color = "red";
      statusSpan.innerText = "Error al enviar la simulación al servidor.";
    }
  });
} // cierra el if (enviarBtn && statusSpan)

        //cookies//
  const banner = document.getElementById('cookie-banner');
  const btnAceptar = document.getElementById('btnAceptarCookies');
  const btnRechazar = document.getElementById('btnRechazarCookies');

  // Revisa consentimiento previo
  const cookieConsent = localStorage.getItem('cookiesAceptadas');
  if (cookieConsent === 'true') {
    banner.style.display = 'none';
    activarScripts();
  } else if (cookieConsent === 'false') {
    banner.style.display = 'none';
    // No se activan scripts de terceros
  } else {
    banner.style.display = 'block';
  }

  // Función para activar scripts de terceros solo si se aceptan cookies
  function activarScripts() {
    // Ejemplo: Google Analytics
    if (!window.gtag) {
      const scriptGA = document.createElement('script');
      scriptGA.src = 'https://www.googletagmanager.com/gtag/js?id=TU-ID-ANALYTICS';
      scriptGA.async = true;
      document.head.appendChild(scriptGA);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'TU-ID-ANALYTICS');
    }

    // Aquí puedes añadir otros scripts de terceros, como Pixel de Facebook
    // Por ejemplo:
    /*
    if (!window.fbq) {
      const scriptFB = document.createElement('script');
      scriptFB.src = 'https://connect.facebook.net/en_US/fbevents.js';
      scriptFB.async = true;
      document.head.appendChild(scriptFB);
      window.fbq = function(){window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments)};
      fbq('init', 'TU-ID-FACEBOOK');
      fbq('track', 'PageView');
    }
    */
  }

  // Función para eliminar cookies innecesarias si se rechazan
  function borrarCookiesInnecesarias() {
    document.cookie.split(";").forEach(cookie => {
      const nombre = cookie.split("=")[0].trim();
      if (!['cookiesAceptadas'].includes(nombre)) {
        document.cookie = nombre + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    });
  }

  // Botón Aceptar
  btnAceptar.addEventListener('click', () => {
    localStorage.setItem('cookiesAceptadas', 'true');
    banner.style.display = 'none';
    activarScripts();
  });

  // Botón Rechazar
  btnRechazar.addEventListener('click', () => {
    localStorage.setItem('cookiesAceptadas', 'false');
    banner.style.display = 'none';
    borrarCookiesInnecesarias();
  });

      function calcularCuota(capital, interes, n) {
  if (n === 0) return 0;
  if (interes === 0) return capital / n;
  return capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
}

function calcularCapacidad(ingresosAnuales, deudas, tipoRef, n) {
  const cuotaMax = ingresosAnuales * 0.35 / 12 - deudas;
  return cuotaMax * (Math.pow(1 + tipoRef, n) - 1) / (tipoRef * Math.pow(1 + tipoRef, n));
}
      
  document.addEventListener("click", function(e){
  if(e.target.classList.contains("help-icon")){
    e.target.classList.toggle("active");
  } else {
    document.querySelectorAll(".help-icon").forEach(el => el.classList.remove("active"));
  }
});
  function calcularITP({
  comunidad,
  precio,
  edad,
  ingresos,
  esViviendaHabitual,
  familiaNumerosa = false,
  discapacidad = false
}) {

  let tipo = 0;

  switch (comunidad) {

    case "madrid":
      tipo = 0.06;
      break;

    case "cataluna":
      tipo = precio > 1000000 ? 0.11 : 0.10;

      if (edad < 32 && ingresos < 30000 && esViviendaHabitual) {
        tipo = 0.05;
      }

      if (familiaNumerosa) tipo = 0.07;
      break;

    case "andalucia":
      tipo = 0.07;

      if (edad < 35 && precio < 150000 && esViviendaHabitual) {
        tipo = 0.035;
      }

      if (discapacidad) tipo = 0.035;
      break;

    case "valencia":
      tipo = 0.10;

      if (edad < 35 && esViviendaHabitual) {
        tipo = 0.06;
      }
      break;

    case "galicia":
      tipo = 0.10;

      if (edad < 36 && esViviendaHabitual) {
        tipo = 0.05;
      }
      break;

    case "pais_vasco":
      tipo = 0.04;
      break;

    default:
      tipo = 0.08;
  }

  return {
    tipo,
    cuotaITP: precio * tipo
  };
}
}); // cierra document.addEventListener("DOMContentLoaded")
