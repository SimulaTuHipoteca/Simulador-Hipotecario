let chart1
let chart2

function formatMoney(n){
return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n)
}

async function cargarEuribor(){

try{

let res=await fetch("https://api.api-ninjas.com/v1/euribor?tenor=12m",{headers:{'X-Api-Key':'demo'}})

let data=await res.json()

document.getElementById("euribor").value=data.rate

}catch{

document.getElementById("euribor").value=3.5

}

}

cargarEuribor()


function calcular(){

let precio=parseFloat(document.getElementById("precio").value)
let entrada=parseFloat(document.getElementById("entrada").value)
let años=parseFloat(document.getElementById("años").value)
let ingresos=parseFloat(document.getElementById("ingresos").value)

let meses=años*12

let euribor=parseFloat(document.getElementById("euribor").value)/100
let diferencial=parseFloat(document.getElementById("diferencial").value)/100
let interes=(euribor+diferencial)/12


let impuesto=parseFloat(document.getElementById("impuesto").value)/100
let notaria=parseFloat(document.getElementById("notaria").value)
let registro=parseFloat(document.getElementById("registro").value)
let tasacion=parseFloat(document.getElementById("tasacion").value)
let gestoria=parseFloat(document.getElementById("gestoria").value)

let gastos=precio*impuesto+notaria+registro+tasacion+gestoria


let entradaRestante=entrada-gastos

let monto

if(entradaRestante>=0){

monto=precio-entradaRestante

}else{

monto=precio+Math.abs(entradaRestante)

}


let cuota

if(interes==0){

cuota=monto/meses

}else{

cuota=monto*interes/(1-Math.pow(1+interes,-meses))

}


let porcentajeFinanciacion=monto/precio*100

let ratio=(cuota*12/ingresos)*100

let deuda=monto

let totalInteres=0

let tabla=""

let deudaGraf=[]


for(let i=1;i<=meses;i++){

let interesPago=deuda*interes

let capital=cuota-interesPago

deuda-=capital

totalInteres+=interesPago

tabla+=`<tr data-mes="${i}">
<td>${i}</td>
<td>${formatMoney(cuota)}</td>
<td style="color:red">${formatMoney(interesPago)}</td>
<td style="color:green">${formatMoney(capital)}</td>
<td>${formatMoney(Math.max(deuda,0))}</td>
</tr>`

deudaGraf.push(deuda)

}


document.querySelector("#tabla tbody").innerHTML=tabla


let estado

if(ratio<35 && porcentajeFinanciacion<=80){

estado="🟢 Alta probabilidad aprobación"

}else if(ratio<40){

estado="🟡 Riesgo medio"

}else{

estado="🔴 Riesgo alto"

}


document.getElementById("resultado").innerHTML=

`Monto financiado: ${formatMoney(monto)}<br>
Cuota mensual: ${formatMoney(cuota)}<br>
Total intereses: ${formatMoney(totalInteres)}<br>
% financiación: ${porcentajeFinanciacion.toFixed(2)} %<br>
Ratio endeudamiento: ${ratio.toFixed(2)} %<br>
${estado}`


if(chart1) chart1.destroy()

chart1=new Chart(document.getElementById("grafico1"),{

type:"bar",

data:{

labels:["Capital","Intereses","Gastos"],

datasets:[{

data:[monto,totalInteres,gastos]

}]

}

})


if(chart2) chart2.destroy()

chart2=new Chart(document.getElementById("grafico2"),{

type:"line",

data:{

labels:[...Array(meses).keys()].map(x=>x+1),

datasets:[{

label:"Deuda pendiente",

data:deudaGraf

}]

}

})

}


function toggleAmortizacion(){

let tabla=document.getElementById("tabla")

tabla.style.display=tabla.style.display=="none"?"table":"none"

}


function filtrarTabla(){

let año=document.getElementById("filtroAno").value

let filas=document.querySelectorAll("#tabla tbody tr")

filas.forEach(f=>{

let mes=f.getAttribute("data-mes")

let añoFila=Math.ceil(mes/12)

if(año==0 || añoFila==año){

f.style.display="table-row"

}else{

f.style.display="none"

}

})

}
