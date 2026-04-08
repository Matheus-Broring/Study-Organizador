// ========== WHITEBOARD ==========
const canvas = document.getElementById('board');
let ctx = canvas.getContext('2d');
let desenhando = false;

function ajustarCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
}

function limparCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
    desenhando = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function draw(e) {
    if (!desenhando) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function stopDrawing() {
    desenhando = false;
    ctx.beginPath();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;
    x = Math.min(Math.max(0, x), canvas.width);
    y = Math.min(Math.max(0, y), canvas.height);
    return { x, y };
}

if (canvas) {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    window.addEventListener('resize', () => {
        ajustarCanvas();
        limparCanvas();
    });
    ajustarCanvas();
}

// ========== ADICIONAR TEXTO NO WHITEBOARD (DUPLO CLIQUE) ==========
let textoAtivo = false;
let inputTexto = null;
let textoPosX = 0, textoPosY = 0;

canvas.addEventListener('dblclick', (e) => {
    if (textoAtivo) return;
    textoPosX = e.offsetX;
    textoPosY = e.offsetY;
    criarInputTexto(e.clientX, e.clientY);
});

function criarInputTexto(clientX, clientY) {
    textoAtivo = true;
    inputTexto = document.createElement('input');
    inputTexto.type = 'text';
    inputTexto.placeholder = 'Digite...';
    inputTexto.style.position = 'fixed';
    inputTexto.style.left = clientX + 'px';
    inputTexto.style.top = clientY + 'px';
    inputTexto.style.fontSize = '18px';
    inputTexto.style.padding = '6px';
    inputTexto.style.border = '2px solid #ffbd59';
    inputTexto.style.borderRadius = '6px';
    inputTexto.style.zIndex = '10000';
    inputTexto.style.fontFamily = 'Oswald, sans-serif';
    document.body.appendChild(inputTexto);
    inputTexto.focus();

    inputTexto.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const texto = inputTexto.value.trim();
            if (texto) {
                ctx.font = '20px Oswald, sans-serif';
                ctx.fillStyle = '#000';
                ctx.fillText(texto, textoPosX, textoPosY);
            }
            inputTexto.remove();
            textoAtivo = false;
        } else if (e.key === 'Escape') {
            inputTexto.remove();
            textoAtivo = false;
        }
    });
}

// ========== LISTA DE TAREFAS ==========
function addTarefa() {
    const input = document.getElementById('novaTarefa');
    const tarefa = input.value.trim();
    if (tarefa === '') return;
    const li = document.createElement('li');
    li.textContent = '✔ ' + tarefa;
    li.onclick = () => remover(li);
    document.getElementById('listaTarefas').appendChild(li);
    input.value = '';
}

function remover(elemento) {
    elemento.remove();
}

// ========== DRAG & DROP APENAS PELO HANDLE (linhas contínuas) ==========
let draggedCard = null;
let dragOffsetX = 0, dragOffsetY = 0;
let isDragging = false;

function onDragStart(e) {
    const handle = e.target.closest('.drag-handle');
    if (!handle) {
        e.preventDefault();
        return false;
    }
    const card = handle.closest('.card');
    if (!card) return false;
    const pinBtn = card.querySelector('.pin-btn');
    if (pinBtn && pinBtn.getAttribute('data-pinned') === 'true') {
        e.preventDefault();
        return false;
    }
    e.preventDefault();
    draggedCard = card;
    const rect = card.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    card.style.position = 'absolute';
    card.style.zIndex = '1000';
    card.style.cursor = 'grabbing';
    card.style.width = `${rect.width}px`;
    document.body.appendChild(card);
    card.style.left = `${e.clientX - dragOffsetX}px`;
    card.style.top = `${e.clientY - dragOffsetY}px`;
    isDragging = true;
}

function onDragMove(e) {
    if (!draggedCard || !isDragging) return;
    let left = e.clientX - dragOffsetX;
    let top = e.clientY - dragOffsetY;
    left = Math.min(Math.max(0, left), window.innerWidth - draggedCard.offsetWidth);
    top = Math.min(Math.max(0, top), window.innerHeight - draggedCard.offsetHeight);
    draggedCard.style.left = `${left}px`;
    draggedCard.style.top = `${top}px`;
}

function onDragEnd() {
    if (!draggedCard) return;
    draggedCard.style.position = '';
    draggedCard.style.zIndex = '';
    draggedCard.style.cursor = '';
    draggedCard.style.width = '';
    draggedCard.style.left = '';
    draggedCard.style.top = '';
    const container = document.querySelector('.container');
    if (container) container.appendChild(draggedCard);
    draggedCard = null;
    isDragging = false;
    saveCardPositions();
}

function saveCardPositions() {
    const cards = document.querySelectorAll('.card');
    const positions = [];
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        positions.push({
            index: idx,
            left: rect.left - containerRect.left,
            top: rect.top - containerRect.top
        });
    });
    localStorage.setItem('cardPositions', JSON.stringify(positions));
}

function loadCardPositions() {
    const positions = localStorage.getItem('cardPositions');
    if (!positions) return;
    const cards = document.querySelectorAll('.card');
    const container = document.querySelector('.container');
    if (!container) return;
    const posArray = JSON.parse(positions);
    container.style.position = 'relative';
    cards.forEach((card, idx) => {
        const pos = posArray.find(p => p.index === idx);
        if (pos) {
            card.style.position = 'relative';
            card.style.left = `${pos.left}px`;
            card.style.top = `${pos.top}px`;
        }
    });
}

document.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.drag-handle');
    if (handle) {
        onDragStart(e);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', () => {
            onDragEnd();
            document.removeEventListener('mousemove', onDragMove);
        }, { once: true });
    }
});

// ========== BOTÃO PIN (TRAVAR/DESTRAVAR CARD) ==========
function initPins() {
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.card');
            const isPinned = btn.getAttribute('data-pinned') === 'true';
            const newPinned = !isPinned;
            btn.setAttribute('data-pinned', newPinned);
            btn.textContent = newPinned ? '📍' : '📌';
            if (newPinned) {
                card.classList.add('pinned');
            } else {
                card.classList.remove('pinned');
            }
        });
    });
}

window.addEventListener('load', () => {
    initPins();
    loadCardPositions();
});