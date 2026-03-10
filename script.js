const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let desenhando = false;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas.addEventListener("mousedown", () => {
desenhando = true;
});

canvas.addEventListener("mouseup", () => {
desenhando = false;
ctx.beginPath();
});

canvas.addEventListener("mousemove", desenhar);

function desenhar(e){

if(!desenhando) return;

ctx.lineWidth = 3;
ctx.lineCap = "round";

ctx.lineTo(e.offsetX, e.offsetY);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(e.offsetX, e.offsetY);

}

function limpar(){
ctx.clearRect(0,0,canvas.width,canvas.height);
}

/* Expandir Whiteboard */

function expandir(){

const card = document.querySelector(".whiteboardCard");

card.classList.toggle("fullscreen");

setTimeout(() => {

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

},200);

}

/* Adicionar tarefas */

function addTarefa(){

const input = document.getElementById("novaTarefa");
const lista = document.getElementById("listaTarefas");

if(input.value === "") return;

const li = document.createElement("li");

li.textContent = "⬜ " + input.value;

li.onclick = function(){
remover(li);
}

lista.appendChild(li);

input.value = "";

}

/* Remover tarefa */

function remover(elemento){

elemento.remove();

}