const $ = id => document.getElementById(id)

let grafico1 = null
let grafico2 = null


async function cargarEuribor(){

try{

let res = await fetch(
"https://api.api-ninjas.com/v1/euribor?tenor=12m",
{headers:{'X-Api-Key':'demo'}}
)

if(!res.ok) throw new Error("API error")

let data = await res.json()

$("euribor").value = data.rate

}catch(e){

console.warn("Error cargando euribor",e)

$("euribor").value = 3.5

}

}

cargarEuribor()



function getNumber(id){

return parseFloat($(id).value) || 0

}



function calcular(){

let precio = getNumber("precio")
let entrada = getNumber("entrada")
let años = getNumber("años")
let ingresos = getNumber("ingresos")

let meses = años * 12

let euribor = getNumber("euribor") / 100
let diferencial = getNumber("diferencial") / 100
let interes = (euribor + diferencial) / 12


let impuesto = getNumber("impuesto") / 100
let notaria = getNumber("notaria")
let registro = getNumber("registro")
let tasacion = getNumber("tasacion")
let gestoria = getNumber("gestoria")


let gastos = precio * impuesto + notaria + registro + tasacion + gestoria


let entradaRestante = entrada - gastos

let monto = entradaRestante >= 0
? precio - entradaRestante
: precio + Math.abs(entradaRestante)



let cuota = monto * interes / (1 - Math.pow(1 + interes, -meses))

let porcentajeFinanciacion = monto / precio * 100

let ratio = (cuota * 12 / ingresos) * 100

let totalPagado = cuota * meses

let tae = ((totalPagado + gastos) / monto - 1) / años * 100


let estado = "🔴 Riesgo alto"

if(ratio < 35 && porcentajeFinanciacion <= 80){
estado="🟢 Alta probabilidad aprobación"
}else if(ratio < 40){
estado="🟡 Riesgo medio"
}



let mesAmortizacion = getNumber("mesAmortizacion")
let capitalAmortizado = getNumber("capitalAmortizado")

let deuda = monto
let totalInteres = 0
let tabla = ""
let deudaGraf = []


for(let i=1;i<=meses;i++){

if(i===mesAmortizacion){
deuda -= capitalAmortizado
}

let interesPago = deuda * interes
let capital = cuota - interesPago

deuda -= capital
totalInteres += interesPago

tabla += `
<tr data-mes="${i}">
<td>${i}</td>
<td>${cuota.toFixed(2)}</td>
<td style="color:red">${interesPago.toFixed(2)}</td>
<td style="color:green">${capital.toFixed(2)}</td>
<td>${Math.max(deuda,0).toFixed(2)}</td>
</tr>`

deudaGraf.push(deuda)

}


$("tabla").querySelector("tbody").innerHTML = tabla


generarFiltroAños(años)

mostrarResultado(monto,cuota,tae,porcentajeFinanciacion,ratio,estado)

dibujarGraficos(monto,totalInteres,gastos,deudaGraf,meses)

}



function generarFiltroAños(años){

let select = $("filtroAno")

select.innerHTML='<option value="0">Todos</option>'

for(let i=1;i<=años;i++){
select.innerHTML+=`<option value="${i}">Año ${i}</option>`
}

}



function mostrarResultado(monto,cuota,tae,porcentaje,ratio,estado){

$("resultado").innerHTML = `
Monto financiado: ${monto.toFixed(2)} €<br>
Cuota mensual: ${cuota.toFixed(2)} €<br>
TAE aproximada: ${tae.toFixed(2)} %<br>
% financiación: ${porcentaje.toFixed(2)} %<br>
Ratio endeudamiento: ${ratio.toFixed(2)} %<br>
${estado}`

}



function dibujarGraficos(monto,totalInteres,gastos,deudaGraf,meses){

if(grafico1) grafico1.destroy()
if(grafico2) grafico2.destroy()

grafico1 = new Chart($("grafico1"),{

type:"pie",

data:{
labels:["Capital","Intereses","Gastos"],
datasets:[{
data:[monto,totalInteres,gastos]
}]
}

})


grafico2 = new Chart($("grafico2"),{

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

let tabla = $("tabla")

tabla.style.display =
tabla.style.display === "none"
? "table"
: "none"

}



function filtrarTabla(){

let año = $("filtroAno").value

let filas = document.querySelectorAll("#tabla tbody tr")

filas.forEach(f=>{

let mes = f.dataset.mes
let añoFila = Math.ceil(mes/12)

f.style.display =
(año == 0 || añoFila == año)
? "table-row"
: "none"

})

}
