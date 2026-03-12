// ===== ELEMENTOS =====
const btnCalculadora = document.getElementById("btnCalculadora");
const btnAnalizarPerfil = document.getElementById("btnAnalizarPerfil");

const seccionCalculadora = document.getElementById("seccionCalculadora");
const seccionPerfil = document.getElementById("seccionPerfil");

// --- Calculadora ---
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const tipoVivienda = document.getElementById("tipoVivienda");
const comunidadSelect = document.getElementById("comunidad");
const interesInput = document.getElementById("interes");
const plazoInput = document.getElementById("plazo");

const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const ltvOut = document.getElementById("ltv");

const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// --- Perfil ---
const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2Div = document.getElementById("perfilEdad2Div");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2Div = document.getElementById("perfilSalario2Div");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const perfilVivienda = document.getElementById("perfilVivienda");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidadDiv = document.getElementById("perfilComunidadDiv");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPrimeraSegunda = document.getElementById("perfilPrimeraSegunda");
const perfilInteres = document.getElementById("perfilInteres");
const perfilPlazo = document.getElementById("perfilPlazo");

const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilInteresesOut = document.getElementById("perfilIntereses");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");
const perfilGastosOut = document.getElementById("perfilGastos");

const perfilVerTablaBtn = document.getElementById("perfilVerTabla");
const perfilTablaContainer = document.getElementById("perfilTablaContainer");
const perfilTbody = document.querySelector("#perfilTabla tbody");

// ===== UTILIDADES =====
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// ===== SELECCIÓN DE SECCIÓN =====
btnCalculadora.addEventListener("click", ()=>{
  seccionCalculadora.style.display = "block";
  seccionPerfil.style.display = "none";
});
btnAnalizarPerfil.addEventListener("click", ()=>{
  seccionCalculadora.style.display = "none";
  seccionPerfil.style.display = "block";
});

// ===== CALCULADORA =====
function calcularGastos(precio,tipo,comunidad){
  let impuestos = tipo==="obraNueva" ? precio*0.10 : precio*parseFloat(comunidad);
  let gastosFijos = 2500; // notario + gestor + registro
  return gastosFijos + impuestos;
}

function calcularCapital(precio,ahorro,gastosTotales){
  return precio + gastosTotales - ahorro;
}

function calcularCuota(capital,interes,plazo){
  if(plazo===0) return 0;
  let n = plazo*12;
  let i = interes/100/12;
  if(i===0) return capital/n;
  return capital*(i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);
}

function calcularCalculadora(){
  let precio = parseFloat(precioInput.value)||0;
  let ahorro = parseFloat(entradaInput.value)||0;
  let tipo = tipoVivienda.value;
  let comunidad = comunidadSelect.value;
  let interes = parseFloat(interesInput.value)||0;
  let plazo = parseInt(plazoInput.value)||30;

  // ocultar comunidad si obra nueva
  document.getElementById("comunidadDiv").style.display = tipo==="obraNueva"?"none":"block";

  let gastosTotales = calcularGastos(precio,tipo,comunidad);
  let capital = calcularCapital(precio,ahorro,gastosTotales);
  let cuota = calcularCuota(capital,interes,plazo);

  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(cuota*plazo*12 - capital);
  entradaTotalOut.innerText = formatMoney(gastosTotales); // SOLO gastos
  ltvOut.innerText = ((capital/precio)*100).toFixed(1)+"%";
}

// Eventos Calculadora
[precioInput, entradaInput, tipoVivienda, comunidadSelect, interesInput, plazoInput].forEach(el=>{
  el.addEventListener("input", calcularCalculadora);
});
verTablaBtn.addEventListener("click", ()=>{
  tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
  if(tablaContainer.style.display==="block") generarTabla(tbody,precioInput,entradaInput,tipoVivienda,comunidadSelect,interesInput,plazoInput);
});

function generarTabla(tbodyEl,precioI,entradaI,tipoI,comunidadI,interesI,plazoI){
  tbodyEl.innerHTML = "";
  let precio = parseFloat(precioI.value)||0;
  let ahorro = parseFloat(entradaI.value)||0;
  let tipo = tipoI.value;
  let comunidad = comunidadI.value;
  let interes = parseFloat(interesI.value)||0;
  let plazo = parseInt(plazoI.value)||30;

  let gastosTotales = calcularGastos(precio,tipo,comunidad);
  let capital = calcularCapital(precio,ahorro,gastosTotales);
  let n = plazo*12;
  let i = interes/100/12;
  let cuota = calcularCuota(capital,interes,plazo);
  let saldo = capital;

  for(let m=1;m<=n;m++){
    let interesMes = saldo*i;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbodyEl.innerHTML += `<tr>
      <td>${m}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
}

// Inicial Calculadora
calcularCalculadora();

// ===== PERFIL =====
perfilTitulares.addEventListener("change", ()=>{
  if(perfilTitulares.value==="2"){
    perfilEdad2Div.style.display="block";
    perfilSalario2Div.style.display="block";
  } else {
    perfilEdad2Div.style.display="none";
    perfilSalario2Div.style.display="none";
  }
});

yaTieneVivienda.addEventListener("change", ()=>{
  perfilVivienda.style.display = yaTieneVivienda.checked?"grid":"none";
  if(perfilTipoVivienda.value==="obraNueva"){
    perfilComunidadDiv.style.display="none";
  } else {
    perfilComunidadDiv.style.display="block";
  }
});

perfilTipoVivienda.addEventListener("change", ()=>{
  perfilComunidadDiv.style.display = perfilTipoVivienda.value==="obraNueva"?"none":"block";
});

function calcularPerfil(){
  let nTitulares = parseInt(perfilTitulares.value);
  let edad1 = parseInt(perfilEdad1.value)||0;
  let edad2 = nTitulares===2?parseInt(perfilEdad2.value)||0:0;
  let mayorEdad = Math.max(edad1,edad2);
  let plazoMax = Math.min(30,75-mayorEdad);
  if(plazoMax<0) plazoMax=0;
  perfilPlazo.value = plazoMax;

  let ingresos = (parseFloat(perfilSalario1.value)||0) + (nTitulares===2?parseFloat(perfilSalario2.value)||0:0) + (parseFloat(perfilOtroIngreso.value)||0);
  let pagas = parseInt(perfilPagas.value)||12;
  let ingresosAnuales = ingresos*pagas;
  let deudas = parseFloat(perfilDeuda.value)||0;
  let ahorro = parseFloat(perfilAhorros.value)||0;

  let capitalPosible = ingresosAnuales*0.35/12*plazoMax*12 - deudas*12;
  if(capitalPosible<0) capitalPosible=0;

  if(yaTieneVivienda.checked){
    let precio = parseFloat(perfilPrecio.value)||0;
    let tipo = perfilTipoVivienda.value;
    let comunidad = perfilComunidad.value;
    let interes = parseFloat(perfilInteres.value)||0;
    let plazo = parseInt(perfilPlazo.value)||plazoMax;
    let gastosTotales = calcularGastos(precio,tipo,comunidad);
    capitalPosible = calcularCapital(precio,ahorro,gastosTotales);
    let cuota = calcularCuota(capitalPosible,interes,plazo);

    perfilCapitalOut.innerText = formatMoney(capitalPosible);
    perfilCuotaOut.innerText = formatMoney(cuota);
    perfilInteresesOut.innerText = formatMoney(cuota*plazo*12 - capitalPosible);
    perfilLTVOut.innerText = ((capitalPosible/precio)*100).toFixed(1)+"%";
    perfilGastosOut.innerText = formatMoney(gastosTotales); // SOLO gastos

    let lti = (cuota+deudas)*12/ingresosAnuales;
    perfilLTIOut.innerText = (lti*100).toFixed(1)+"%";
    if(lti<=0.35){perfilCompatibleOut.innerText="Compatible";perfilCompatibleOut.style.color="green";}
    else if(lti<=0.4){perfilCompatibleOut.innerText="Aceptable";perfilCompatibleOut.style.color="orange";}
    else{perfilCompatibleOut.innerText="No viable";perfilCompatibleOut.style.color="red";}
  } else {
    perfilCapitalOut.innerText = formatMoney(capitalPosible);
    perfilCuotaOut.innerText = "-";
    perfilInteresesOut.innerText = "-";
    perfilLTVOut.innerText = "-";
    perfilGastosOut.innerText = "-";
    perfilLTIOut.innerText = "-";
    perfilCompatibleOut.innerText = "-";
  }
}

// Eventos perfil
[
  perfilTitulares, perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
  perfilPagas, perfilAhorros, perfilDeuda, perfilOtroIngreso,
  yaTieneVivienda, perfilPrecio, perfilTipoVivienda, perfilComunidad,
  perfilInteres, perfilPlazo
].forEach(el=>el.addEventListener("input",calcularPerfil));

// Inicial Perfil
calcularPerfil();
