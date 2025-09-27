// ===== ГЛАВНЫЕ СТРАНИЦЫ =====
const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const lobbyPage = document.getElementById("lobby-page");
const gamePage = document.getElementById("game-page");
const gameBoard = document.getElementById("game-board");

// ===== ФУНКЦИИ ПОКАЗА / СКРЫТИЯ =====
function showLogin() {
  loginPage.style.display = "block";
  registerPage.style.display = "none";
  lobbyPage.style.display = "none";
  gamePage.style.display = "none";
}

function showRegister() {
  loginPage.style.display = "none";
  registerPage.style.display = "block";
  lobbyPage.style.display = "none";
  gamePage.style.display = "none";
}

function showLobby() {
  loginPage.style.display = "none";
  registerPage.style.display = "none";
  lobbyPage.style.display = "block";
  gamePage.style.display = "none";
}

function showGame() {
  loginPage.style.display = "none";
  registerPage.style.display = "none";
  lobbyPage.style.display = "none";
  gamePage.style.display = "block";
}

// ===== ЛОГИН / РЕГИСТРАЦИЯ =====
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (email && password) {
    console.log("Вход выполнен:", email);
    showLobby();
  } else {
    alert("Введите email и пароль!");
  }
}

function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (email && password) {
    console.log("Регистрация выполнена:", email);
    showLobby();
  } else {
    alert("Введите email и пароль!");
  }
}

// ===== СОЗДАНИЕ / ВХОД В СТОЛ =====
function createRoom() {
  console.log("Стол создан!");
  showGame();
  startGame();
}

function exitGame() {
  console.log("Выход в лобби");
  showLobby();
}

// ===== ЛОГИКА ИГРЫ =====
function startGame() {
  gameBoard.innerHTML = "";
  const values = ["🐱", "🐶", "🦜", "⚓", "💎", "🏴‍☠️"];
  const cards = [...values, ...values]; // пары
  shuffle(cards);

  cards.forEach(val => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = "?";
    card.dataset.value = val;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

let firstCard = null;
let lockBoard = false;

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.textContent = card.dataset.value;
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    if (firstCard.dataset.value === card.dataset.value) {
      firstCard = null;
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.textContent = "?";
        firstCard.classList.remove("flipped");
        card.textContent = "?";
        card.classList.remove("flipped");
        firstCard = null;
        lockBoard = false;
      }, 1000);
    }
  }
}

// Перемешивание массива
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== СТАРТ ПРИ ЗАГРУЗКЕ =====
window.onload = () => {
  showLogin();
};