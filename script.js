// Inputs
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");
const comunidadInput = document.getElementById("comunidad");

const inputs = [precioInput, entradaInput, interesInput, añosInput, comunidadInput];
inputs.forEach(i => i.addEventListener("input", calcular));

let chart1;

// Formatear euros
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

// Mostrar / ocultar tabla
function toggleTabla() {
  const tabla = document.getElementById("tablaContainer");
  tabla.style.display = tabla.style.display === "none" ? "block" : "none";
}

// Cálculo principal
function calcular() {
  let precio = parseFloat(precioInput.value);
  let ahorro = parseFloat(entradaInput.value);
  let interes = parseFloat(interesInput.value) / 100 / 12;
  let años = parseFloat(añosInput.value);
  let porcentajeGastos = parseFloat(comunidadInput.value);

  if (isNaN(precio) || isNaN(ahorro) || isNaN(interes) || isNaN(años)) return;

  let gastos = precio * porcentajeGastos;
  let entradaGastos = Math.min(ahorro, gastos);
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;

  let n = años * 12;
  let cuota = capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1);
  let saldo = capital;

  let meses = [];
  let saldoData = [];
  let totalIntereses = 0;

  let tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  for (let i = 1; i <= n; i++) {
    let interesMes = saldo * interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    totalIntereses += interesMes;

    meses.push(i);
    saldoData.push(saldo);

    let row = `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
    tbody.innerHTML += row;
  }

  document.getElementById("capital").innerText = formatMoney(capital);
  document.getElementById("cuota").innerText = formatMoney(cuota);
  document.getElementById("intereses").innerText = formatMoney(totalIntereses);

  let sueldo = cuota / 0.35;
  document.getElementById("sueldo").innerText = formatMoney(sueldo);

  let ltv = (capital / precio) * 100;
  document.getElementById("ltv").innerText = ltv.toFixed(1) + "%";

  document.getElementById("gastos").innerText = formatMoney(gastos);
  document.getElementById("entradaGastos").innerText = formatMoney(entradaGastos);
  document.getElementById("entradaCasa").innerText = formatMoney(entradaCasa);

  // Gráfico capital pendiente
  if (chart1) chart1.destroy();
  chart1 = new Chart(document.getElementById("grafico1"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [{
        label: "Capital pendiente",
        data: saldoData,
        borderColor: "rgba(44, 123, 229, 1)",
        backgroundColor: "rgba(44, 123, 229, 0.1)",
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: function(value) { return formatMoney(value); } }
        }
      }
    }
  });
}

// Calcular al cargar la página
calcular();
