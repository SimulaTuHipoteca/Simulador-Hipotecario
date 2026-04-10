// -----------------------------
// FUNCIONES GLOBALES (FUERA)
// -----------------------------
window.abrirOperacion = function(id){
  document.querySelectorAll('.card-content').forEach(cc => {
    if(cc.id === id){
      cc.classList.toggle('open'); 
    } else {
      cc.classList.remove('open'); 
    }
  });
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
  if(id) abrirOperacion(id);

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
    const y = perfilDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
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

  let cuota;
  if (interes === 0) {
    cuota = capital / n;
  } else {
    cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
  }

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
  operacionBadge: document.getElementById("operacionSeleccionada")
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
      
function calcularPerfil() {
  const nTitulares = parseInt(perfilFields.titulares?.value) || 1;
  const edad1 = parseInt(perfilFields.edad1.value) || 0;
  const edad2 = nTitulares === 2 ? parseInt(perfilFields.edad2.value) || 0 : 0;
  const maxEdad = Math.max(edad1, edad2);
  const plazoMax = Math.min(30, 75 - maxEdad);

  if (perfilFields.plazo) {
    perfilFields.plazo.max = plazoMax > 0 ? plazoMax : 0;
    if (!plazoEditadoPorUsuario) perfilFields.plazo.value = plazoMax > 0 ? plazoMax : 0;
  }
  if (plazoMax <= 0) return;

  // -----------------------------
  // INGRESOS Y DATOS BASE
  // -----------------------------
  const ingresos =
    (parseFloat(perfilFields.salario1.value) || 0) +
    (nTitulares === 2 ? parseFloat(perfilFields.salario2.value) || 0 : 0) +
    (parseFloat(perfilFields.otroIngreso.value) || 0);

  const pagas1 = parseInt(document.getElementById("perfilPagas1")?.value) || 12;
const pagas2 = parseInt(document.getElementById("perfilPagas2")?.value) || 12;

const pagas = nTitulares === 2 ? Math.max(pagas1, pagas2) : pagas1;
  const ingresosAnuales = ingresos * pagas;
  const deudas = parseFloat(perfilFields.deuda.value) || 0;
  const ahorros = parseFloat(perfilFields.ahorros.value) || 0;

  const tipoRef = 0.028 / 12;
  const plazo = parseInt(perfilFields.plazo.value) || plazoMax;
  const n = plazo * 12;

  // -----------------------------
  // CAPACIDAD POR INGRESOS
  // -----------------------------
  const cuotaMax = ingresosAnuales * 0.35 / 12 - deudas;

  let capacidadPorIngresos = 0;
  if (tipoRef > 0 && cuotaMax > 0) {
    capacidadPorIngresos =
      cuotaMax *
      (Math.pow(1 + tipoRef, n) - 1) /
      (tipoRef * Math.pow(1 + tipoRef, n));
  }

  // -----------------------------
  // SCORING
  // -----------------------------
  const contrato1 = document.getElementById("perfilContrato1")?.value;
const contrato2 = document.getElementById("perfilContrato2")?.value;

const antiguedad1 = parseInt(document.getElementById("perfilAntiguedad1")?.value) || 0;
const antiguedad2 = parseInt(document.getElementById("perfilAntiguedad2")?.value) || 0;

const contrato = contrato1; // puedes mejorar esto luego
const antiguedad = Math.max(antiguedad1, antiguedad2);
  const score = calcularScore({
    ingresosAnuales,
    ahorros,
    deudas,
    contrato,
    antiguedad
  });

  let maxFinanciacionScore = 0.8;
  if (score >= 8) maxFinanciacionScore = 1.0;
  else if (score >= 6) maxFinanciacionScore = 0.9;
  else if (score >= 4) maxFinanciacionScore = 0.8;
  else maxFinanciacionScore = 0.7;

  // -----------------------------
  // VIVIENDA
  // -----------------------------
  const agregarVivienda = perfilFields.viviendaCheck?.checked || false;
  const precio = agregarVivienda ? parseFloat(perfilFields.precio.value) || 0 : 0;

  const impuestos = agregarVivienda
    ? (perfilFields.tipoVivienda.value === "obraNueva"
        ? precio * 0.10
        : precio * parseFloat(perfilFields.comunidad.value || 0))
    : 0;

  const gastos = impuestos + (agregarVivienda ? 2500 : 0);

  // -----------------------------
  // LÓGICA BANCO
  // -----------------------------
  const esSegunda = perfilFields.primeraSegunda.value === "segunda";

  function calcularMaxFinanciacion({ esSegunda, edad1, edad2, ingresosAnuales }) {
    if (esSegunda) return { porcentaje: 0.7, motivo: "Segunda residencia / Aval requerido" };
    const edadMin = Math.min(edad1 || 99, edad2 || 99);
    if (edadMin < 35) return { porcentaje: 1.0, motivo: "Menor de 35 años" };
    if (ingresosAnuales < 50000) return { porcentaje: 0.9, motivo: "Ingresos < 50.000€" };
    return { porcentaje: 0.8, motivo: "Financiación estándar" };
  }

  const resultadoFinanciacion = calcularMaxFinanciacion({
    esSegunda,
    edad1,
    edad2,
    ingresosAnuales
  });

let maxFinanciacion = resultadoFinanciacion.porcentaje;

// 🔥 EXCEPCIÓN JÓVENES (CLAVE)
if (edad1 < 35 || edad2 < 35) {
  maxFinanciacion = resultadoFinanciacion.porcentaje; // respeta 100%
} else {
  maxFinanciacion = Math.min(
    resultadoFinanciacion.porcentaje,
    maxFinanciacionScore
  );
}

  // -----------------------------
  // CÁLCULOS OPERACIÓN
  // -----------------------------
  const maxPrestamoBanco = agregarVivienda ? precio * maxFinanciacion : 0;
  const importeTotalOperacion = agregarVivienda ? precio + gastos : 0;

  const prestamoNecesario = agregarVivienda
    ? Math.max(importeTotalOperacion - ahorros, 0)
    : 0;

  let capitalPosible = agregarVivienda
    ? Math.min(capacidadPorIngresos, maxPrestamoBanco, prestamoNecesario)
    : capacidadPorIngresos;

  if (capitalPosible < 0) capitalPosible = 0;

  const cuota = capitalPosible > 0
    ? capitalPosible * (tipoRef * Math.pow(1 + tipoRef, n)) / (Math.pow(1 + tipoRef, n) - 1)
    : 0;

  const ltv = agregarVivienda && precio > 0
    ? (capitalPosible / precio) * 100
    : 0;

  const lti = ingresosAnuales > 0
    ? ((cuota + deudas) * 12) / ingresosAnuales
    : 0;

  // -----------------------------
  // MÉTRICAS AVANZADAS
  // -----------------------------
  const precioMaximo = maxFinanciacion > 0 ? capitalPosible / maxFinanciacion : 0;

  const entradaMinima = agregarVivienda
    ? (precio - maxPrestamoBanco) + gastos
    : 0;

  const faltaAhorro = Math.max(entradaMinima - ahorros, 0);

  // -----------------------------
  // MENSAJES INTELIGENTES
  // -----------------------------
  const mensajePerfil = document.getElementById("mensajePerfil");

  if (mensajePerfil) {
    mensajePerfil.className = "mensaje-perfil";

    if (ingresos <= 0 || cuota <= 0) {
      mensajePerfil.style.display = "none";
    } else {
      mensajePerfil.style.display = "block";

      const faltaDinero = prestamoNecesario - capitalPosible;

      if (prestamoNecesario === 0 && agregarVivienda) {
        mensajePerfil.innerText = "No necesitas financiación: tus ahorros cubren la operación.";
        mensajePerfil.classList.add("mensaje-ok");
        } else if ((edad1 < 35 || edad2 < 35) && faltaDinero > 0) {
 mensajePerfil.innerHTML = `
  Puedes financiar el <strong>100%</strong> de la vivienda.<br><br>
  Necesitas aportar aproximadamente <strong>${formatMoney(gastos)}</strong> para cubrir gastos.
`;
  mensajePerfil.classList.add("mensaje-warning");
      } else if (faltaDinero > 0) {
        mensajePerfil.innerText = `Te faltan ${formatMoney(faltaDinero)} para completar la operación.`;
        mensajePerfil.classList.add("mensaje-warning");
      } else if (lti <= 0.35) {
        mensajePerfil.innerText = "¡Excelente perfil financiero! Alta probabilidad de aprobación.";
        mensajePerfil.classList.add("mensaje-ok");
      } else if (lti <= 0.40) {
        mensajePerfil.innerText = "Buen perfil. Posible aprobación con condiciones normales.";
        mensajePerfil.classList.add("mensaje-ok");
      } else if (lti <= 0.45) {
        mensajePerfil.innerText = "Perfil aceptable. El banco puede exigir garantías adicionales.";
        mensajePerfil.classList.add("mensaje-warning");
      } else {
        mensajePerfil.innerText = "Perfil de riesgo elevado. Difícil aprobación sin cambios.";
        mensajePerfil.classList.add("mensaje-warning");
      }
    }
  }

  // -----------------------------
  // OUTPUTS
  // -----------------------------
  perfilFields.capitalOut.innerText = formatMoney(capitalPosible);
  perfilFields.cuotaOut.innerText = formatMoney(cuota);
  perfilFields.ltvOut.innerText = ltv > 0 ? ltv.toFixed(1) + "%" : "-";
  perfilFields.gastosOut.innerText = formatMoney(gastos);
  perfilFields.ltiOut.innerText = (lti * 100).toFixed(1) + "%";

  if (perfilFields.compatibleOut) {
    perfilFields.compatibleOut.className = "";
    if (lti <= 0.35) {
      perfilFields.compatibleOut.innerText = "Compatible";
      perfilFields.compatibleOut.classList.add("green");
    } else if (lti <= 0.40) {
      perfilFields.compatibleOut.innerText = "Aceptable";
      perfilFields.compatibleOut.classList.add("orange");
    } else {
      perfilFields.compatibleOut.innerText = "No viable";
      perfilFields.compatibleOut.classList.add("red");
    }
  }

  // -----------------------------
  // BADGE OPERACIÓN
  // -----------------------------
  if (perfilFields.operacionBadge) {
    perfilFields.operacionBadge.innerText =
      `Operación: ${esSegunda ? "Inversión" : "Primera vivienda"} | ${resultadoFinanciacion.motivo}`;
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
  perfilFields.pagas, perfilFields.ahorros, perfilFields.deuda, perfilFields.otroIngreso,
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
        if (ltv.includes("%") && parseFloat(ltv) > 80) recomendaciones.push("- Aportar mayor entrada para reducir financiación");
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
}); // cierra document.addEventListener("DOMContentLoaded")
