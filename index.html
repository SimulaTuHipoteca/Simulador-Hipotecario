const inputs = document.querySelectorAll("input");
const comunidadInput = document.getElementById("comunidad");

inputs.forEach(i => i.addEventListener("input", () => debounce(calcular, 300)()));
comunidadInput.addEventListener("change", calcular);

const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");

let timer;

function debounce(func, wait) {
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), wait);
  };
}

function formatMoney(n) {
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

function toggleTabla() {
  const tabla = document.getElementById("tablaContainer");
  tabla.style.display = tabla.style.display === "none" ? "block" : "none";
}

function calcular() {
  let precio = parseFloat(precioInput.value) || 0;
  let ahorro = parseFloat(entradaInput.value) || 0;
  let interes = (parseFloat(interesInput.value)/100/12) || 0;
  let años = parseFloat(añosInput.value) || 0;

  let itp = parseFloat(comunidadInput.value) || 0.08;
  let gastos = 2500 + precio * itp; // Escrituras + ITP
  let entradaGastos = Math.min(ahorro, gastos);
  let entradaCasa = Math.max(0, ahorro - entradaGastos);

  let capital = precio - entradaCasa;
  let n = años * 12;
  let cuota = n > 0 ? capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1) : 0;
  let saldo = capital;

  let tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  let totalIntereses = 0;

  for(let i=1; i<=n; i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    totalIntereses += interesMes;

    let row = `
      <tr>
        <td>${i}</td>
        <td>${formatMoney(cuota)}</td>
        <td>${formatMoney(interesMes)}</td>
        <td>${formatMoney(capitalMes)}</td>
        <td>${formatMoney(Math.max(saldo,0))}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  }

  document.getElementById("capital").innerText = formatMoney(capital);
  document.getElementById("cuota").innerText = formatMoney(cuota);
  document.getElementById("intereses").innerText = formatMoney(totalIntereses);

  // Salario recomendado: que no supere 35% de cuota
  let sueldo = cuota / 0.35;
  document.getElementById("sueldo").innerText = formatMoney(sueldo);

  document.getElementById("ltv").innerText = precio>0 ? ((capital/precio)*100).toFixed(1) + "%" : "0%";
  document.getElementById("gastos").innerText = formatMoney(gastos);
  document.getElementById("entradaGastos").innerText = formatMoney(entradaGastos);
  document.getElementById("entradaCasa").innerText = formatMoney(entradaCasa);
}

calcular();
