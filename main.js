// ======= Регистрация и вход =======
function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!email || !password) {
    alert("Введите email и пароль!");
    return;
  }

  localStorage.setItem(email, password);
  alert("Регистрация успешна!");
  showLogin();
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Введите email и пароль!");
    return;
  }

  const storedPassword = localStorage.getItem(email);

  if (storedPassword === password) {
    alert("Добро пожаловать, " + email + "!");
    showPage("lobby-page");
  } else {
    alert("Неверный email или пароль!");
  }
}

function showLogin() {
  showPage("login-page");
}

function showRegister() {
  showPage("register-page");
}

// ======= Управление страницами =======
function showPage(pageId) {
  const pages = ["login-page", "register-page", "lobby-page", "game-page"];
  pages.forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";
}

// ======= Лобби =======
function createRoom() {
  alert("Стол создан!");
  showPage("game-page");
  startGame();
}

function exitGame() {
  showPage("lobby-page");
}

// ======= Игра =======
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score1 = 0;
let score2 = 0;
let currentPlayer = 1;

function startGame() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const icons = ["⚓", "🚢", "🦜", "💣", "🗺️", "🏴‍☠️"];
  let cards = [...icons, ...icons]; // 12 карт

  // перемешивание
  cards = cards.sort(() => Math.random() - 0.5);

  cards.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = "?";
    card.dataset.icon = icon;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.textContent = this.dataset.icon;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.icon === secondCard.dataset.icon) {
    updateScore();
    resetBoard();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      resetBoard();
      switchPlayer();
    }, 1000);
  }
}

function updateScore() {
  if (currentPlayer === 1) {
    score1++;
  } else {
    score2++;
  }
  alert("Игрок 1: " + score1 + " | Игрок 2: " + score2);
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  alert("Ход игрока " + currentPlayer);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}