// Inputs
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const tipoVivienda = document.getElementById("tipoVivienda");
const titularesSelect = document.getElementById("titulares");
const edad1Input = document.getElementById("edad1");
const edad2Input = document.getElementById("edad2");
const edadTitular2Div = document.getElementById("edadTitular2");
const deuda1Input = document.getElementById("deuda1");
const deuda2Input = document.getElementById("deuda2");
const deudaTitular2Div = document.getElementById("deudaTitular2");
const añosInput = document.getElementById("años");
const salarioInput = document.getElementById("salario");
const comunidadInput = document.getElementById("comunidad");
const interesInput = document.getElementById("interes");

// Outputs
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const plazoEdadMaxOut = document.getElementById("plazoEdadMax");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

let amortizacionGenerada = false;

// Función para formatear dinero
function formatMoney(n){
    return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Mostrar/ocultar segundo titular
titularesSelect.addEventListener("change",()=>{
    if(titularesSelect.value=="2"){
        edadTitular2Div.style.display="block";
        deudaTitular2Div.style.display="block";
    } else {
        edadTitular2Div.style.display="none";
        deudaTitular2Div.style.display="none";
        edad2Input.value="";
        deuda2Input.value="0";
    }
    calcular();
});

// Calcular el plazo máximo según edad del titular mayor
function calcularPlazoMax(){
    let edadMayor = parseInt(edad1Input.value)||0;
    if(titularesSelect.value=="2"){
        edadMayor = Math.max(edadMayor, parseInt(edad2Input.value)||0);
    }
    let maxPlazo = Math.max(0, 75 - edadMayor);
    if(añosInput.value > maxPlazo) añosInput.value = maxPlazo;
    plazoEdadMaxOut.innerText = maxPlazo>0 ? `Plazo máximo según edad: ${maxPlazo} años` : "Edad máxima superada";
}

// Función principal de cálculo
function calcular(){
    calcularPlazoMax();

    let precio = parseFloat(precioInput.value)||0;
    let entrada = parseFloat(entradaInput.value)||0;
    let interes = parseFloat(interesInput.value)/100/12||0;
    let años = parseFloat(añosInput.value)||0;
    let salario = parseFloat(salarioInput.value)||0;
    let comunidad = parseFloat(comunidadInput.value)||0;

    // IVA o ITP
    let impuestos = 0;
    if(tipoVivienda.value=="obraNueva"){
        impuestos = precio * 0.10; // IVA 10%
    } else {
        impuestos = precio * comunidad; // ITP
    }
    let gastosTotales = impuestos + 2500; // gastos fijos de escrituras
    let entradaCasa = Math.max(0, entrada - gastosTotales);
    let capital = precio - entradaCasa;

    let n = años*12;
    let cuota = capital>0 ? capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1) : 0;
    let totalIntereses = cuota*n - capital;

    // LTI incluyendo deudas
    let deudaTotal = parseFloat(deuda1Input.value)||0;
    if(titularesSelect.value=="2") deudaTotal += parseFloat(deuda2Input.value)||0;
    let ltiVal = (cuota*12 + deudaTotal*12)/salario;

    // Mostrar resultados
    capitalOut.innerText = formatMoney(capital);
    cuotaOut.innerText = formatMoney(cuota);
    interesesOut.innerText = formatMoney(totalIntereses);
    entradaTotalOut.innerText = formatMoney(entradaCasa + gastosTotales);
    sueldoOut.innerText = formatMoney(cuota/0.35);

    ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";
    if(ltiVal <= 0.35) ltiOut.style.color="green";
    else if(ltiVal <= 0.40) ltiOut.style.color="orange";
    else ltiOut.style.color="red";

    if(ltiVal <= 0.35){
        compatibleOut.innerText = "Compatible";
        compatibleOut.style.color="green";
    } else if(ltiVal <=0.40){
        compatibleOut.innerText = "Aceptable";
        compatibleOut.style.color="orange";
    } else {
        compatibleOut.innerText = "No viable";
        compatibleOut.style.color="red";
    }

    amortizacionGenerada = false;
}

// Tabla de amortización
function generarTabla(){
    if(amortizacionGenerada) return;
    tbody.innerHTML="";
    let precio = parseFloat(precioInput.value)||0;
    let entrada = parseFloat(entradaInput.value)||0;
    let interes = parseFloat(interesInput.value)/100/12||0;
    let años = parseFloat(añosInput.value)||0;

    let impuestos = tipoVivienda.value=="obraNueva" ? precio*0.10 : precio*parseFloat(comunidadInput.value);
    let gastosTotales = impuestos + 2500;
    let entradaCasa = Math.max(0, entrada - gastosTotales);
    let capital = precio - entradaCasa;

    let n = años*12;
    let cuota = capital>0 ? capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1) : 0;
    let saldo = capital;

    for(let i=1;i<=n;i++){
        let interesMes = saldo*interes;
        let capitalMes = cuota - interesMes;
        saldo -= capitalMes;
        tbody.innerHTML += `<tr>
            <td>${i}</td>
            <td>${formatMoney(cuota)}</td>
            <td>${formatMoney(interesMes)}</td>
            <td>${formatMoney(capitalMes)}</td>
            <td>${formatMoney(Math.max(saldo,0))}</td>
        </tr>`;
    }
    amortizacionGenerada = true;
}

// Mostrar / ocultar tabla
document.getElementById("verTabla").addEventListener("click",()=>{
    tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
    if(tablaContainer.style.display==="block") generarTabla();
});

// Escuchar cambios en inputs
const inputs = [precioInput, entradaInput, tipoVivienda, titularesSelect, edad1Input, edad2Input, deuda1Input, deuda2Input, añosInput, salarioInput, comunidadInput, interesInput];
inputs.forEach(input => input.addEventListener("input",()=>calcular()));

// Inicial
calcular();
