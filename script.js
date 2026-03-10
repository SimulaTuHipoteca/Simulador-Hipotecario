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


let cuota=monto*interes/(1-Math.pow(1+interes,-meses))


let porcentajeFinanciacion=monto/precio*100


let ratio=(cuota*12/ingresos)*100


let totalPagado=cuota*meses

let tae=((totalPagado+gastos)/monto-1)/años*100


let estado

if(ratio<35 && porcentajeFinanciacion<=80){

estado="🟢 Alta probabilidad aprobación"

}else if(ratio<40){

estado="🟡 Riesgo medio"

}else{

estado="🔴 Riesgo alto"

}


let mesAmortizacion=parseInt(document.getElementById("mesAmortizacion").value)

let capitalAmortizado=parseFloat(document.getElementById("capitalAmortizado").value)||0


let deuda=monto

let totalInteres=0

let tabla=""

let deudaGraf=[]


for(let i=1;i<=meses;i++){

if(i==mesAmortizacion){

deuda-=capitalAmortizado

}

let interesPago=deuda*interes

let capital=cuota-interesPago

deuda-=capital

totalInteres+=interesPago

tabla+=`<tr data-mes="${i}">
<td>${i}</td>
<td>${cuota.toFixed(2)}</td>
<td style="color:red">${interesPago.toFixed(2)}</td>
<td style="color:green">${capital.toFixed(2)}</td>
<td>${deuda.toFixed(2)}</td>
</tr>`

deudaGraf.push(deuda)

}


document.querySelector("#tabla tbody").innerHTML=tabla


let select=document.getElementById("filtroAno")

select.innerHTML='<option value="0">Todos</option>'

for(let i=1;i<=Plazo;i++){

select.innerHTML+=`<option value="${i}">Plazo ${i}</option>`

}


document.getElementById("resultado").innerHTML=

`Monto financiado: ${monto.toFixed(2)} €<br>
Cuota mensual: ${cuota.toFixed(2)} €<br>
TAE aproximada: ${tae.toFixed(2)} %<br>
% financiación: ${porcentajeFinanciacion.toFixed(2)} %<br>
Ratio endeudamiento: ${ratio.toFixed(2)} %<br>
${estado}`


new Chart(document.getElementById("grafico1"),{

type:"pie",

data:{

labels:["Capital","Intereses","Gastos"],

datasets:[{

data:[monto,totalInteres,gastos]

}]

}

})


new Chart(document.getElementById("grafico2"),{

type:"line",

data:{

labels:[...Array(meses).keys()].map(x=>x+1),

datasets:[{

label:"Deuda",

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
