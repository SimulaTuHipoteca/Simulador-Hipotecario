document.addEventListener("DOMContentLoaded", () => {

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
    btnCalculadoraFlotante.addEventListener("click", () => modal.style.display = "block");
    cerrar.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
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

    const cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
    const totalPagado = cuota * n;
    const interesesTotales = totalPagado - capital;

    cuotaOut && (cuotaOut.innerText = formatMoney(cuota));
    interesesTotalesOut && (interesesTotalesOut.innerText = formatMoney(interesesTotales));
    totalPagadoOut && (totalPagadoOut.innerText = formatMoney(totalPagado));

    resultadosDiv && (resultadosDiv.style.display = "block");
    verTablaBtn && (verTablaBtn.style.display = "block");
    tablaContainer && (tablaContainer.style.display = "none");
    resultadosDiv?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const generarTabla = () => {
    if (!tbody) return;
    tbody.innerHTML = "";
    const capital = parseFloat(prestamoInput?.value) || 0;
    const interes = (parseFloat(interesInput?.value) / 100) / 12 || 0;
    const anos = parseFloat(anosInput?.value) || 0;
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
        <td>${formatMoney(Math.max(saldo,0))}</td>
      </tr>`;
    }
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
  let plazoEditadoPorUsuario = false;
  const perfilFields = {
    titulares: document.getElementById("perfilTitulares"),
    edad1: document.getElementById("perfilEdad1"),
    edad2: document.getElementById("perfilEdad2"),
    titular2Div: document.getElementById("titular2Div"),
    salario1: document.getElementById("perfilSalario1"),
    salario2: document.getElementById("perfilSalario2"),
    pagas: document.getElementById("perfilPagas"),
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

  // Mostrar / ocultar info de vivienda al marcar checkbox
  const actualizarViviendaInfo = () => {
  perfilFields.viviendaInfo.style.display = perfilFields.viviendaCheck.checked ? "block" : "none";
  calcularPerfil();
};

if (perfilFields.viviendaCheck && perfilFields.viviendaInfo) {
  perfilFields.viviendaCheck.addEventListener("change", actualizarViviendaInfo);
  // Ejecutar una vez al inicio para sincronizar el estado
  actualizarViviendaInfo();
}

  const calcularPerfil = () => {
    const nTitulares = parseInt(perfilFields.titulares.value) || 1;
    const edad1 = parseInt(perfilFields.edad1.value) || 0;
    const edad2 = nTitulares === 2 ? parseInt(perfilFields.edad2.value) || 0 : 0;
    const maxEdad = Math.max(edad1, edad2);
    const plazoMax = Math.min(30, 75 - maxEdad);

    if (perfilFields.plazo) {
      perfilFields.plazo.max = plazoMax > 0 ? plazoMax : 0;
      if (!plazoEditadoPorUsuario) perfilFields.plazo.value = plazoMax > 0 ? plazoMax : 0;
    }
    if (plazoMax <= 0) return;

    const ingresos =
      (parseFloat(perfilFields.salario1.value) || 0) +
      (nTitulares === 2 ? parseFloat(perfilFields.salario2.value) || 0 : 0) +
      (parseFloat(perfilFields.otroIngreso.value) || 0);
    const pagas = parseInt(perfilFields.pagas.value) || 12;
    const ingresosAnuales = ingresos * pagas;
    const deudas = parseFloat(perfilFields.deuda.value) || 0;
    const tipoRef = 0.028 / 12; // tipo de referencia mensual
    const plazo = parseInt(perfilFields.plazo.value) || plazoMax;
    const n = plazo * 12;

    // -----------------------------
    // 1. CAPACIDAD POR INGRESOS
    // -----------------------------
    const cuotaMax = ingresosAnuales * 0.35 / 12 - deudas;
    let capacidadPorIngresos = cuotaMax * (Math.pow(1 + tipoRef, n) - 1) / (tipoRef * Math.pow(1 + tipoRef, n));

    // -----------------------------
    // 2. DATOS VIVIENDA
    // -----------------------------
    const agregarVivienda = perfilFields.viviendaCheck.checked;
    const precio = agregarVivienda ? parseFloat(perfilFields.precio.value) || 0 : 0;
    const ahorros = parseFloat(perfilFields.ahorros.value) || 0;
    const impuestos = agregarVivienda ? 
      (perfilFields.tipoVivienda.value === "obraNueva" ? precio * 0.10 : precio * parseFloat(perfilFields.comunidad.value || 0))
      : 0;
    const gastos = impuestos + (agregarVivienda ? 2500 : 0);

    // -----------------------------
    // 3. LÓGICA BANCARIA
    // -----------------------------
    const esSegunda = perfilFields.primeraSegunda.value === "segunda";
    const maxFinanciacion = esSegunda ? 0.7 : 0.8;
    const maxPrestamoBanco = agregarVivienda ? precio * maxFinanciacion : 0;
    const prestamoNecesario = agregarVivienda ? precio - ahorros : 0;

    // -----------------------------
    // 4. PRÉSTAMO FINAL
    // -----------------------------
    let capitalPosible = agregarVivienda ? Math.min(capacidadPorIngresos, maxPrestamoBanco, prestamoNecesario) : capacidadPorIngresos;
    if (capitalPosible < 0) capitalPosible = 0;
    const cuota = capitalPosible > 0 ? capitalPosible * (tipoRef * Math.pow(1 + tipoRef, n)) / (Math.pow(1 + tipoRef, n) - 1) : 0;
    const ltv = agregarVivienda && precio > 0 ? (capitalPosible / precio) * 100 : 0;
    const lti = ingresosAnuales > 0 ? ((cuota + deudas) * 12) / ingresosAnuales : 0;

    // -----------------------------
    // MENSAJE Y RESULTADOS
    // -----------------------------
    const mensajePerfil = document.getElementById("mensajePerfil");
    if (mensajePerfil) {
      mensajePerfil.className = "mensaje-perfil";
      if (ingresos <= 0 || plazo <= 0 || cuota <= 0) {
        mensajePerfil.style.display = "none";
      } else {
        let viable = false;
        if (lti <= 0.35) viable = true;
        else if (lti <= 0.40 && ltv <= 90) viable = true;
        else if (lti <= 0.45 && ltv <= 95) viable = true;

        mensajePerfil.style.display = "block";
        if (viable) {
          mensajePerfil.innerText = "¡Buen perfil financiero! Puedes optar a condiciones favorables.";
          mensajePerfil.classList.add("mensaje-ok");
        } else if (lti <= 0.40) {
          mensajePerfil.innerText = "Perfil aceptable. Podrías obtener financiación con algunas condiciones.";
          mensajePerfil.classList.add("mensaje-warning");
        } else {
          mensajePerfil.innerText = "Perfil con limitaciones financieras.";
          mensajePerfil.classList.add("mensaje-warning");
        }
      }
    }

    perfilFields.capitalOut && (perfilFields.capitalOut.innerText = formatMoney(capitalPosible));
    perfilFields.cuotaOut && (perfilFields.cuotaOut.innerText = formatMoney(cuota));
    perfilFields.ltvOut && (perfilFields.ltvOut.innerText = ltv > 0 ? ltv.toFixed(1) + "%" : "-");
    perfilFields.gastosOut && (perfilFields.gastosOut.innerText = formatMoney(gastos));
    perfilFields.ltiOut && (perfilFields.ltiOut.innerText = (lti * 100).toFixed(1) + "%");

    if (perfilFields.compatibleOut) {
      perfilFields.compatibleOut.className = "";
      if (lti <= 0.35) { perfilFields.compatibleOut.innerText = "Compatible"; perfilFields.compatibleOut.classList.add("green"); }
      else if (lti <= 0.40) { perfilFields.compatibleOut.innerText = "Aceptable"; perfilFields.compatibleOut.classList.add("orange"); }
      else { perfilFields.compatibleOut.innerText = "No viable"; perfilFields.compatibleOut.classList.add("red"); }
    }

    // -----------------------------
    // AVISOS SEGUNDA RESIDENCIA
    // -----------------------------
    if (perfilFields.avisoSegunda) {
      const dineroNecesario = gastos + (precio - maxPrestamoBanco);
      const faltanteEntrada = Math.max(dineroNecesario - ahorros, 0);

      if (agregarVivienda && esSegunda && ltv > 70) {
        perfilFields.avisoSegunda.style.display = "block";
        perfilFields.avisoSegunda.innerHTML = `
          <strong>¡Atención! Segunda residencia con alta financiación:</strong>
          <p>Necesario aportar ${formatMoney(faltanteEntrada)}, más gastos aproximados ${formatMoney(gastos)}</p>
        `;
      } else if (agregarVivienda && ahorros < dineroNecesario) {
        perfilFields.avisoSegunda.style.display = "block";
        perfilFields.avisoSegunda.innerHTML = `
          <strong>Ahorro insuficiente:</strong>
          <p>Necesitarías aproximadamente ${formatMoney(dineroNecesario)}</p>
          <p>Te faltan ${formatMoney(faltanteEntrada)}</p>
        `;
      } else {
        perfilFields.avisoSegunda.style.display = "none";
      }
    }
  };

  // -----------------------------
  // EVENTOS PERFIL
  // -----------------------------
  perfilFields.plazo && perfilFields.plazo.addEventListener("input", () => plazoEditadoPorUsuario = true);
  [perfilFields.edad1, perfilFields.edad2, perfilFields.salario1, perfilFields.salario2, perfilFields.pagas, perfilFields.ahorros, perfilFields.deuda, perfilFields.otroIngreso, perfilFields.precio]
    .forEach(el => el && (el.addEventListener("input", calcularPerfil), el.addEventListener("change", calcularPerfil)));
  [perfilFields.titulares, perfilFields.tipoVivienda, perfilFields.comunidad, perfilFields.primeraSegunda]
    .forEach(el => el && el.addEventListener("change", calcularPerfil));

  perfilFields.titulares && perfilFields.titular2Div && perfilFields.titulares.addEventListener("change", () => {
    perfilFields.titular2Div.style.display = perfilFields.titulares.value === "2" ? "block" : "none";
    calcularPerfil();
  });

  // -----------------------------
  // LLAMAR PERFIL AL INICIO
  // -----------------------------
  calcularPerfil();

  // -----------------------------
  // ACORDEONES / OPERACIONES
  // -----------------------------
  window.abrirOperacion = function(id){
    document.querySelectorAll('.card-content').forEach(cc => {
      cc.classList.toggle('open', cc.id === id ? !cc.classList.contains('open') : false);
    });
  };

  // -----------------------------
  // IR A ANALISIS
  // -----------------------------
  window.irAnalisis = function(event, tipoOperacion){
    event.stopPropagation();
    if(!perfilFields.operacionBadge || !perfilDiv) return;

    perfilDiv.style.display = "block";
    perfilFields.operacionBadge.style.display = "block";
    perfilFields.operacionBadge.innerText = `Operación seleccionada: ${tipoOperacion}`;

    // Solo pre-seleccionar tipo de vivienda
    if (perfilFields.primeraSegunda) {
      switch(tipoOperacion){
        case 'Compra Primera Vivienda':
          perfilFields.primeraSegunda.value = 'primera';
          break;
        case 'Inversión':
          perfilFields.primeraSegunda.value = 'segunda';
          break;
      }
    }

    // Actualizar visibilidad vivienda según checkbox
    // Reemplaza la línea anterior dentro de irAnalisis por:
actualizarViviendaInfo();

    calcularPerfil();
    perfilDiv.scrollIntoView({behavior:'smooth'});
  };


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
          const { jsPDF } = window.jspdf.jsPDF ? window.jspdf : window.jspdf;
          doc = new jsPDF();

          // CABECERA
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

          // CLIENTE
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Datos del cliente", 20, 45);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(`Nombre: ${nombre}`, 20, 53);
          doc.text(`Email: ${email}`, 20, 59);

          // RESUMEN FINANCIERO
          doc.setDrawColor(200);
          doc.rect(20, 70, 170, 50);
          doc.setFont("helvetica", "bold");
          doc.text("Resumen de la simulación", 25, 78);
          doc.setFont("helvetica", "normal");
          const resumen = [
            ["Importe préstamo", capital],
            ["Cuota mensual", cuota],
            ["Financiación (LTV)", ltv],
            ["Gastos aproximados", gastos],
            ["Ratio endeudamiento", lti],
            ["Compatibilidad", compatibilidad]
          ];
          let y = 86;
          resumen.forEach(row => {
            doc.setFont("helvetica", "bold");
            doc.text(row[0], 25, y);
            doc.setFont("helvetica", "normal");
            doc.text(row[1], 120, y);
            y += 6;
          });

          // ANÁLISIS
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Análisis del perfil financiero", 20, 135);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          let analisis = "";
          if (compatibilidad === "Compatible") {
            analisis = "Tu perfil presenta una alta probabilidad de aprobación según criterios bancarios actuales.";
          } else if (compatibilidad === "Aceptable") {
            analisis = "Tu perfil es viable, aunque algunas entidades podrían requerir condiciones adicionales o garantías.";
          } else {
            analisis = "Actualmente tu perfil no cumple con los criterios habituales de riesgo bancario.";
          }
          doc.text(analisis, 20, 143, { maxWidth: 170 });

          // RECOMENDACIONES
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
            "Este documento es una simulación orientativa basada en criterios financieros estándar. No constituye una oferta vinculante ni garantiza la concesión del préstamo. La aprobación final dependerá de cada entidad bancaria tras el estudio de riesgo correspondiente.",
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
  }

  // -----------------------------
  // EURIBOR AUTOMÁTICO
  // -----------------------------
  async function actualizarEuribor() {
    try {
      const res = await fetch("https://api.api-ninjas.com/v1/interest_rate?name=euribor", {
        headers: { 'X-Api-Key': 'TU_API_KEY' } // necesitarás clave gratuita
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const valor = data[0].rate.toFixed(2);
        document.getElementById("euribor-value").innerText = valor + "%";
      }
    } catch (error) {
      console.error("Error Euríbor:", error);
      document.getElementById("euribor-value").innerText = "2,86%"; // fallback
    }
  }
  actualizarEuribor();

});
