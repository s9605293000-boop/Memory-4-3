// Показ страниц
function showRegister() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "block";
}

function showLogin() {
  document.getElementById("register-page").style.display = "none";
  document.getElementById("login-page").style.display = "block";
}

// Фейковая регистрация/логин
function register() {
  alert("Регистрация прошла успешно! Теперь войдите.");
  showLogin();
}

function login() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}

// Создание стола
function createRoom() {
  const level = document.getElementById("level-select").value;
  startGame(level);
}

// Запуск игры
function startGame(level) {
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "block";

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  const cardsCount = parseInt(level, 10);

  // Определение сетки
  if (cardsCount === 12) {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
    gameBoard.style.gridTemplateRows = "repeat(3, 1fr)";
  } else if (cardsCount === 16) {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
    gameBoard.style.gridTemplateRows = "repeat(4, 1fr)";
  } else if (cardsCount === 24) {
    gameBoard.style.gridTemplateColumns = "repeat(6, 1fr)";
    gameBoard.style.gridTemplateRows = "repeat(4, 1fr)";
  }

  // Создание массива карточек
  const cards = [];
  for (let i = 1; i <= cardsCount / 2; i++) {
    cards.push(i, i);
  }

  // Перемешивание
  cards.sort(() => Math.random() - 0.5);

  // Отрисовка карточек
  cards.forEach(num => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.value = num;
    card.textContent = "?";
    card.onclick = () => flipCard(card);
    gameBoard.appendChild(card);
  });
}

// Переворот карт
let firstCard = null;
function flipCard(card) {
  if (card.classList.contains("flipped")) return;

  card.textContent = card.dataset.value;
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    if (firstCard.dataset.value === card.dataset.value) {
      firstCard = null;
    } else {
      setTimeout(() => {
        card.textContent = "?";
        card.classList.remove("flipped");
        firstCard.textContent = "?";
        firstCard.classList.remove("flipped");
        firstCard = null;
      }, 800);
    }
  }
}

// Выход в лобби
function exitGame() {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}