const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
let desenhando = false;
let expandido = false;

function ajustarCanvasAltura() {
  // Pega a altura real do canvas (300px via CSS)
  const style = getComputedStyle(canvas);
  const height = parseInt(style.height);
  canvas.height = height;
}
ajustarCanvasAltura();

canvas.addEventListener("mousedown", (e) => {
  desenhando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener("mouseup", () => {
  desenhando = false;
  ctx.beginPath();
});
canvas.addEventListener("mouseleave", () => {
  desenhando = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", (e) => {
  if (!desenhando) return;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

const inputTarefa = document.getElementById("novaTarefa");
const listaTarefas = document.getElementById("listaTarefas");

function addTarefa() {
  const valor = inputTarefa.value.trim();
  if (!valor) return;
  const li = document.createElement("li");
  li.textContent = "✔ " + valor;
  li.onclick = () => remover(li);
  listaTarefas.appendChild(li);
  inputTarefa.value = "";
}

function remover(el) {
  el.remove();
}

function limpar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// Caixa de texto no duplo clique
let textoAtivo = false;
let inputTexto = null;
let textoPosX = 0;
let textoPosY = 0;

canvas.addEventListener("dblclick", (e) => {
  if (textoAtivo) return;
  textoPosX = e.offsetX;
  textoPosY = e.offsetY;
  criarInputTexto(e.clientX, e.clientY);
});

function criarInputTexto(clientX, clientY) {
  textoAtivo = true;
  inputTexto = document.createElement("input");
  inputTexto.type = "text";
  inputTexto.placeholder = "Digite aqui...";
  inputTexto.style.position = "fixed";
  inputTexto.style.left = clientX + "px";
  inputTexto.style.top = clientY + "px";
  inputTexto.style.fontSize = "18px";
  inputTexto.style.padding = "6px";
  inputTexto.style.border = "2px solid #333";
  inputTexto.style.borderRadius = "6px";
  inputTexto.style.zIndex = "10000";
  inputTexto.style.minWidth = "150px";
  inputTexto.style.outline = "none";

  document.body.appendChild(inputTexto);
  inputTexto.focus();

  inputTexto.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const texto = inputTexto.value.trim();
      if (texto) {
        ctx.font = "20px Oswald, sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText(texto, textoPosX, textoPosY);
      }
      inputTexto.remove();
      textoAtivo = false;
      inputTexto = null;
    } else if (event.key === "Escape") {
      inputTexto.remove();
      textoAtivo = false;
      inputTexto = null;
    }
  });
}
// Drag & Drop funcional
const container = document.querySelector('.container');

container.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('card')) {
        e.target.classList.add('dragging');
    }
});

container.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('card')) {
        e.target.classList.remove('dragging');
    }
});

container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (afterElement == null) {
        container.appendChild(dragging);
    } else {
        container.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Botão sair
document.querySelector('.sair').addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.toggle('clicado');
});

// Suas outras funções (addTarefa, remover, limpar)...
function addTarefa() {
    const input = document.getElementById('novaTarefa');
    const li = document.createElement('li');
    li.textContent = '✔ ' + input.value;
    li.onclick = function() { remover(this); };
    document.getElementById('listaTarefas').appendChild(li);
    input.value = '';
}

function remover(li) {
    li.remove();
}

function limpar() {
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
