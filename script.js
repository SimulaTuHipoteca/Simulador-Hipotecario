let chart1
let chart2
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Simulador Hipotecario</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>

body{
font-family:Arial;
background:#f4f6f9;
padding:40px;
}

.container{
max-width:900px;
margin:auto;
background:white;
padding:30px;
border-radius:12px;
box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

h1{
text-align:center;
margin-bottom:30px;
}

.grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
}

input{
width:100%;
padding:10px;
font-size:16px;
}

.cards{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:15px;
margin-top:20px;
}

.card{
background:#f8f9fa;
padding:15px;
border-radius:8px;
text-align:center;
}

.extra{
margin-top:20px;
background:#f1f3f5;
padding:15px;
border-radius:8px;
}

button{
margin-top:20px;
padding:12px;
width:100%;
background:#2c7be5;
color:white;
border:none;
border-radius:6px;
font-size:16px;
cursor:pointer;
}

button:hover{
background:#1a68d1;
}

canvas{
margin-top:30px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:30px;
}

th,td{
padding:8px;
border-bottom:1px solid #ddd;
text-align:center;
}

th{
background:#f1f1f1;
}

#tablaContainer{
display:none;
}

</style>
</head>

<body>

<div class="container">

<h1>Simulador Hipotecario</h1>

<div class="grid">

<div>
<label>Precio vivienda (€)</label>
<input id="precio" type="number" value="€">
</div>

<div>
<label>Ahorros disponibles (€)</label>
<input id="entrada" type="number" value="€">
</div>

<div>
<label>Interés anual (%)</label>
<input id="interes" type="number" step="0.1" value="2.5">
</div>

<div>
<label>Plazo (años)</label>
<input id="años" type="number" value="30">
</div>

</div>

<div class="cards">

<div class="card">
<p>Hipoteca necesaria</p>
<h3 id="capital"></h3>
</div>

<div class="card">
<p>Cuota mensual</p>
<h3 id="cuota"></h3>
</div>

<div class="card">
<p>Total intereses</p>
<h3 id="intereses"></h3>
</div>

<div class="card">
<p>Sueldo recomendado</p>
<h3 id="sueldo"></h3>
</div>

</div>

<div class="extra">

<p><strong>Gastos estimados compra:</strong> <span id="gastos"></span></p>
<p><strong>Entrada usada para gastos:</strong> <span id="entradaGastos"></span></p>
<p><strong>Entrada usada para vivienda:</strong> <span id="entradaCasa"></span></p>

<p><strong>Porcentaje financiado (LTV):</strong> <span id="ltv"></span></p>

</div>

<canvas id="grafico1"></canvas>

<button onclick="toggleTabla()">Ver tabla de amortización</button>

<div id="tablaContainer">

<h2>Tabla de amortización</h2>

<table id="tabla">

<thead>
<tr>
<th>Mes</th>
<th>Cuota</th>
<th>Interés</th>
<th>Capital</th>
<th>Restante</th>
</tr>
</thead>

<tbody></tbody>

</table>

</div>

</div>

<script>

const inputs=document.querySelectorAll("input");
inputs.forEach(i=>i.addEventListener("input",calcular));

let chart1;

function formatMoney(n){
return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

function toggleTabla(){

const tabla=document.getElementById("tablaContainer");

tabla.style.display = tabla.style.display==="none" ? "block" : "none";

}

function calcular(){

let precio=parseFloat(precioInput.value);
let ahorro=parseFloat(entradaInput.value);
let interes=parseFloat(interesInput.value)/100/12;
let años=parseFloat(añosInput.value);

let gastos=precio*0.10;

let entradaGastos=Math.min(ahorro,gastos);
let entradaCasa=Math.max(0,ahorro-gastos);

let capital=precio-entradaCasa;

let n=años*12;

let cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);

let saldo=capital;

let meses=[];
let saldoData=[];

let totalIntereses=0;

let tbody=document.querySelector("#tabla tbody").innerHTML=filas.join("")
tbody.innerHTML="";

for(let i=1;i<=n;i++){

let interesMes=saldo*interes;

let capitalMes=cuota-interesMes;

saldo-=capitalMes;

totalIntereses+=interesMes;

meses.push(i);
saldoData.push(saldo);

let row=`
<tr>
<td>${i}</td>
<td>${formatMoney(cuota)}</td>
<td>${formatMoney(interesMes)}</td>
<td>${formatMoney(capitalMes)}</td>
<td>${formatMoney(Math.max(saldo,0))}</td>
</tr>
`;

tbody.innerHTML+=row;

}

document.getElementById("capital").innerText=formatMoney(capital);
document.getElementById("cuota").innerText=formatMoney(cuota);
document.getElementById("intereses").innerText=formatMoney(totalIntereses);

let sueldo=cuota/0.35;

document.getElementById("sueldo").innerText=formatMoney(sueldo);

let ltv=(capital/precio)*100;

document.getElementById("ltv").innerText=ltv.toFixed(1)+"%";

document.getElementById("gastos").innerText=formatMoney(gastos);
document.getElementById("entradaGastos").innerText=formatMoney(entradaGastos);
document.getElementById("entradaCasa").innerText=formatMoney(entradaCasa);

if(chart1) chart1.destroy();

chart1=new Chart(document.getElementById("grafico1"),{
type:"line",
data:{
labels:meses,
datasets:[{
label:"Capital pendiente",
data:saldoData
}]
}
});

}

const precioInput=document.getElementById("precio");
const entradaInput=document.getElementById("entrada");
const interesInput=document.getElementById("interes");
const añosInput=document.getElementById("años");

calcular();

</script>

</body>
</html>
