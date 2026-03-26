document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // FUNCIONES AUXILIARES
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
  // CALCULADORA
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
      if (resultadosDiv) resultadosDiv.style.display = "flex";
      if (verTablaBtn) verTablaBtn.style.display = "none";
      if (tablaContainer) tablaContainer.style.display = "none";
      return;
    }
    const cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
    const totalPagado = cuota * n;
    const interesesTotales = totalPagado - capital;
    if (cuotaOut) cuotaOut.innerText = formatMoney(cuota);
    if (interesesTotalesOut) interesesTotalesOut.innerText = formatMoney(interesesTotales);
    if (totalPagadoOut) totalPagadoOut.innerText = formatMoney(totalPagado);
    if (resultadosDiv) resultadosDiv.style.display = "flex";
    if (verTablaBtn) verTablaBtn.style.display = "block";
    if (tablaContainer) tablaContainer.style.display = "none";
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

  [prestamoInput, interesInput, anosInput].forEach(el => { if(el) el.addEventListener("input", calcular); });

  if (verTablaBtn) verTablaBtn.addEventListener("click", () => {
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

  const perfilDiv = document.getElementById("perfil");
  const calculadoraDiv = document.getElementById("calculadora");
  const perfilTitulares = document.getElementById("perfilTitulares");
  const perfilEdad1 = document.getElementById("perfilEdad1");
  const perfilEdad2 = document.getElementById("perfilEdad2");
  const titular2Div = document.getElementById("titular2Div");
  const perfilSalario1 = document.getElementById("perfilSalario1");
  const perfilSalario2 = document.getElementById("perfilSalario2");
  const perfilPagas = document.getElementById("perfilPagas");
  const perfilAhorros = document.getElementById("perfilAhorros");
  const perfilDeuda = document.getElementById("perfilDeuda");
  const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
  const yaTieneVivienda = document.getElementById("agregardatosdelavivienda");
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
  const operacionBadge = document.getElementById("operacionSeleccionada");

  const calcularPerfil = () => {
    if(!perfilTitulares || !perfilEdad1) return;
    const nTitulares = parseInt(perfilTitulares.value)||1;
    const edad1 = parseInt(perfilEdad1.value)||0;
    const edad2 = nTitulares===2? parseInt(perfilEdad2.value)||0:0;
    const maxEdad = Math.max(edad1,edad2);
    const plazoMax = Math.min(30,75-maxEdad);
    if(perfilPlazo) {
      perfilPlazo.max = plazoMax>0?plazoMax:0;
      if(!plazoEditadoPorUsuario) perfilPlazo.value = plazoMax>0?plazoMax:0;
    }
    if(plazoMax<=0) return;
    const ingresos = (parseFloat(perfilSalario1?.value)||0) + (nTitulares===2?(parseFloat(perfilSalario2?.value)||0):0) + (parseFloat(perfilOtroIngreso?.value)||0);
    const pagas = parseInt(perfilPagas?.value)||12;
    const ingresosAnuales = ingresos*pagas;
    const deudas = parseFloat(perfilDeuda?.value)||0;
    const tipoRef = 0.028/12;
    const plazo = parseInt(perfilPlazo?.value)||plazoMax;
    const n = plazo*12;
    const cuotaMax = ingresosAnuales*0.35/12 - deudas;
    let capitalPosible = cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*Math.pow(1+tipoRef,n));
    const precio = parseFloat(perfilPrecio?.value)||0;
    const impuestos = perfilTipoVivienda?.value==="obraNueva"? precio*0.10 : precio*parseFloat(perfilComunidad?.value||0);
    const gastos = impuestos + 2500;
    const ahorros = parseFloat(perfilAhorros?.value)||0;
    const entrada = perfilPrimeraSegunda?.value==="segunda"? precio*0.30 : precio*0.20;
    const faltanteEntrada = Math.max(entrada - ahorros,0);
    if(yaTieneVivienda?.checked) capitalPosible = precio+gastos - ahorros;
    const cuota = capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
    const ltv = precio>0? (capitalPosible/precio*100):0;
    if(perfilPrimeraSegunda?.value==="segunda" && ltv>70 && avisoSegunda) {
      avisoSegunda.style.display="block";
      avisoSegunda.innerHTML=`<strong>¡Atención! Segunda residencia con alta financiación:</strong>
        <p>Necesario aportar ${formatMoney(faltanteEntrada)}, más gastos aproximados ${formatMoney(gastos)}</p>`;
    } else if(avisoSegunda) { avisoSegunda.style.display="none"; }
    const lti = ingresosAnuales>0? (cuota+deudas)*12/ingresosAnuales :0;
    if(perfilCapitalOut) perfilCapitalOut.innerText=formatMoney(capitalPosible);
    if(perfilCuotaOut) perfilCuotaOut.innerText=formatMoney(cuota);
    if(perfilLTVOut) perfilLTVOut.innerText=ltv>0? ltv.toFixed(1)+"%":"-";
    if(perfilGastosOut) perfilGastosOut.innerText=formatMoney(gastos);
    if(perfilLTIOut) perfilLTIOut.innerText=(lti*100).toFixed(1)+"%";
    if(perfilCompatibleOut){
      if(lti<=0.35){ perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green"; }
      else if(lti<=0.40){ perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange"; }
      else { perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red"; }
    }
  };

  if(perfilPlazo) perfilPlazo.addEventListener("input",()=>plazoEditadoPorUsuario=true);
  [perfilEdad1,perfilEdad2,perfilSalario1,perfilSalario2,perfilPagas,perfilAhorros,perfilDeuda,perfilOtroIngreso,perfilPrecio]
    .forEach(el => { if(el){ el.addEventListener("input",calcularPerfil); el.addEventListener("change",calcularPerfil); } });
  [perfilTitulares,perfilTipoVivienda,perfilComunidad,perfilPrimeraSegunda]
    .forEach(el => { if(el) el.addEventListener("change",calcularPerfil); });
if (perfilTitulares && titular2Div) {
  perfilTitulares.addEventListener("change", () => {
    titular2Div.style.display = perfilTitulares.value === "2" ? "block" : "none";
    calcularPerfil();
  });
}
  if(yaTieneVivienda) yaTieneVivienda.addEventListener("change",()=>{ viviendaInfo.style.display=yaTieneVivienda.checked?"block":"none"; calcularPerfil(); });
  calcularPerfil();

  // -----------------------------
  // COOKIES
  // -----------------------------
  const banner=document.getElementById("cookie-banner");
  const btnAceptar=document.getElementById("btnAceptarCookies");
  const btnRechazar=document.getElementById("btnRechazarCookies");
  if(banner && btnAceptar && btnRechazar) {
    const cookiesAceptadas=localStorage.getItem("cookiesAceptadas");
    if(cookiesAceptadas==="true" || cookiesAceptadas==="false") banner.style.display="none"; 
    else banner.style.display="flex";
    btnAceptar.addEventListener("click",()=>{ localStorage.setItem("cookiesAceptadas","true"); banner.style.display="none"; });
    btnRechazar.addEventListener("click",()=>{ localStorage.setItem("cookiesAceptadas","false"); banner.style.display="none"; });
  }

  // -----------------------------
  // ACORDEONES / OPERACIONES
  // -----------------------------
  window.abrirOperacion = function(id){
    const todas = document.querySelectorAll('.card-content');
    todas.forEach(cc => { if(cc.id===id) cc.classList.toggle('open'); else cc.classList.remove('open'); });
  };

  window.irAnalisis = function(event, tipo){
    event.stopPropagation();
    if(!operacionBadge || !perfilDiv) return;
    const mismoTipo = operacionBadge.innerText.includes(tipo);
    if(perfilDiv.style.display==="block" && mismoTipo){ perfilDiv.style.display="none"; operacionBadge.style.display="none"; return; }
    perfilDiv.style.display="block";
    if(calculadoraDiv) calculadoraDiv.style.display="none";
    operacionBadge.style.display="block";
    operacionBadge.innerText = `Operación seleccionada: ${tipo}`;
    if(perfilPrimeraSegunda && yaTieneVivienda){
      switch(tipo){
        case 'Compra Primera Vivienda': perfilPrimeraSegunda.value='primera'; yaTieneVivienda.checked=false; break;
        case 'Cambio de Hipoteca': perfilPrimeraSegunda.value='segunda'; yaTieneVivienda.checked=true; break;
        case 'Inversión': perfilPrimeraSegunda.value='segunda'; yaTieneVivienda.checked=false; break;
      }
      if(viviendaInfo) viviendaInfo.style.display = yaTieneVivienda.checked?"block":"none";
    }
    calcularPerfil();
    perfilDiv.scrollIntoView({behavior:'smooth'});
  };


 // -----------------------------
// ENVÍO DE LEADS Y PDF (demo + envío opcional)
// -----------------------------
const statusSpan = document.getElementById("leadMensaje");
const enviarBtn = document.getElementById("enviarLead");
const SERVER_URL = ""; // Aquí pon tu endpoint si quieres enviar la simulación

if (enviarBtn && statusSpan) {
  enviarBtn.addEventListener("click", async () => {
    const nombre = document.getElementById("leadNombre")?.value.trim() || "";
    const email = document.getElementById("leadEmail")?.value.trim() || "";
    const consentimiento = document.getElementById("leadConsentimiento")?.checked || false;

    // Validación
    if (!nombre || !email || !consentimiento) {
      statusSpan.style.color = "red";
      statusSpan.innerText = "Por favor completa todos los campos y acepta la política.";
      return;
    }

    // Preparar PDF
    const capital = document.getElementById("perfilCapital")?.innerText || "0";
    const cuota = document.getElementById("perfilCuota")?.innerText || "0";
    const ltv = document.getElementById("perfilLTV")?.innerText || "0";
    const gastos = document.getElementById("perfilGastos")?.innerText || "0";
    const lti = document.getElementById("perfilLTI")?.innerText || "0";
    const compatibilidad = document.getElementById("perfilCompatible")?.innerText || "-";

    
    if (!window.jspdf) {
  console.error("jsPDF no cargado");
  return;
}
const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Simulación Kaoba Finance", 20, 20);
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 30);
    doc.text(`Email: ${email}`, 20, 37);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 44);

    const data = [
      ["Importe estimado de préstamo", capital],
      ["Cuota mensual estimada", cuota],
      ["% Financiación (LTV)", ltv],
      ["Gastos aproximados", gastos],
      ["Ratio endeudamiento (LTI)", lti],
      ["Compatibilidad bancaria", compatibilidad]
    ];

    let y = 55;
    data.forEach(row => {
      doc.setFont("helvetica", "bold");
      doc.text(row[0] + ":", 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(row[1], 110, y);
      y += 7;
    });

    // Descargar PDF siempre
    doc.save("Simulacion_Kaoba_Finance.pdf");

    statusSpan.style.color = "green";
    statusSpan.innerText = "Simulación generada y PDF descargado (modo demo)";

    // Si no hay servidor configurado, salimos
    if (!SERVER_URL) return;

    // Intentar enviar al servidor
    try {
      const pdfBlob = doc.output("blob");
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("email", email);
      formData.append("pdf", pdfBlob, "Simulacion_Kaoba_Finance.pdf");

      const response = await fetch(SERVER_URL, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.ok) {
        statusSpan.style.color = "green";
        statusSpan.innerText = `Simulación enviada a ${email}`;
      } else {
        statusSpan.style.color = "orange";
        statusSpan.innerText = "Simulación generada, pero error enviando al servidor.";
      }
    } catch (err) {
      console.error(err);
      statusSpan.style.color = "orange";
      statusSpan.innerText = "Simulación generada, pero no se pudo conectar con el servidor.";
    }
  });
}
