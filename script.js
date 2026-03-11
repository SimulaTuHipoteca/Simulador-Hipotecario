// Debounce
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

// Inputs
const precioInput=document.getElementById("precio");
const entradaInput=document.getElementById("entrada");
const interesInput=document.getElementById("interes");
const añosInput=document.getElementById("años");
const comunidadInput=document.getElementById("comunidad");
const salarioInput=document.getElementById("salario");
const titularesInput=document.getElementById("titulares");
const edad1Input=document.getElementById("edad1");
const edad2Input=document.getElementById("edad2");
const edad2Container=document.getElementById("edadTitular2");
const plazoEdadMax=document.getElementById("plazoEdadMax");

const capitalOut=document.getElementById("capital");
const cuotaOut=document.getElementById("cuota");
const interesesOut=document.getElementById("intereses");
const entradaTotalOut=document.getElementById("entradaTotal");
const sueldoOut=document.getElementById("sueldo");
const ltiOut=document.getElementById("lti");
const compatibleOut=document.getElementById("compatible");
const tablaContainer=document.getElementById("tablaContainer");
const tbody=document.querySelector("#tabla tbody");

const inputs=[precioInput, entradaInput, interesInput, añosInput, comunidadInput, salarioInput, titularesInput, edad1Input, edad2Input];
inputs.forEach(i=>i.addEventListener("input",debounce(calcular,300)));

document.getElementById("verTabla").addEventListener("click", toggleTabla);

// Formateo de dinero
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Mostrar/ocultar segundo titular
titularesInput.addEventListener("change",()=>{
  if(titularesInput.value=="2"){
    edad2Container.style.display="block";
  } else {
    edad2Container.style.display="none";
    edad2Input.value="";
  }
  limitarPlazoEdad();
});

// Limitar plazo según edad
function limitarPlazoEdad(){
  let edad1=parseFloat(edad1Input.value)||0;
  let edad2=parseFloat(edad2Input.value)||0;
  let edadMayor=Math.max(edad1,edad2);
  if(edadMayor===0){
    plazoEdadMax.innerText="";
    return;
  }
  let plazoEdad=75-edadMayor;
  let plazoMaximo=Math.min(30,plazoEdad);
  añosInput.max=plazoMaximo;
  if(añosInput.value>plazoMaximo) añosInput.value=plazoMaximo;
  plazoEdadMax.innerText="Plazo máximo permitido según edad: "+plazoMaximo+" años";
}

edad1Input.addEventListener("input",limitarPlazoEdad);
edad2Input.addEventListener("input",limitarPlazoEdad);

// Función principal de cálculo
function calcular(){
  limitarPlazoEdad();
  let precio=parseFloat(precioInput.value)||0;
  let ahorro=parseFloat(entradaInput.value)||0;
  let interes=parseFloat(interesInput.value)/100/12||0;
  let años=parseFloat(añosInput.value)||0;
  let comunidad=parseFloat(comunidadInput.value)||0;
  let salario=parseFloat(salarioInput.value)||0;

  let gastos=precio*comunidad+2500;
  let entradaCasa=Math.max(0,ahorro-gastos);
  let capital=precio-entradaCasa;
  let n=años*12;
  let cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let totalIntereses=cuota*n-capital;

  capitalOut.innerText=formatMoney(capital);
  cuotaOut.innerText=formatMoney(cuota);
  interesesOut.innerText=formatMoney(totalIntereses);
  entradaTotalOut.innerText=formatMoney(entradaCasa+gastos);

  let sueldo=cuota/0.35*12;
  sueldoOut.innerText=formatMoney(sueldo);

  let lti=cuota*12/salario;
  ltiOut.innerText=(lti*100).toFixed(1)+'%';
  if(lti>0.4) ltiOut.style.color="red";
  else if(lti>0.35) ltiOut.style.color="orange";
  else ltiOut.style.color="green";

  if(lti<=0.35){
    compatibleOut.innerText="Compatible";
    compatibleOut.style.color="green";
  } else if(lti<=0.40){
    compatibleOut.innerText="Aceptable";
    compatibleOut.style.color="orange";
  } else {
    compatibleOut.innerText="No viable";
    compatibleOut.style.color="red";
  }

  let maxCapital=salario*0.35/12*n;
  let maxPrecio=maxCapital+entradaCasa;
  document.getElementById("resumen").innerText=`Con tu salario neto anual de ${formatMoney(salario)}, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;
}

function toggleTabla(){
  tablaContainer.style.display=tablaContainer.style.display==="none"?"block":"none";
  if(tablaContainer.style.display==="block") generarTabla();
}

function generarTabla(){
  tbody.innerHTML="";
  let precio=parseFloat(precioInput.value)||0;
  let ahorro=parseFloat(entradaInput.value)||0;
  let interes=parseFloat(interesInput.value)/100/12||0;
  let años=parseFloat(añosInput.value)||0;
  let comunidad=parseFloat(comunidadInput.value)||0;

  let gastos=precio*comunidad+2500;
  let entradaCasa=Math.max(0,ahorro-gastos);
  let capital=precio-entradaCasa;
  let n=años*12;
  let cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo=capital;

  for(let i=1;i<=n;i++){
    let interesMes=saldo*interes;
    let capitalMes=cuota-interesMes;
    saldo-=capitalMes;
    tbody.innerHTML+=`<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
}

// Inicial
calcular();
