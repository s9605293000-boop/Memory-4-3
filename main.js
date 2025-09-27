// ===== ГЛАВНЫЕ СТРАНИЦЫ =====
const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const lobbyPage = document.getElementById("lobby-page");
const gamePage = document.getElementById("game-page");
const gameBoard = document.getElementById("game-board");
const roomsList = document.createElement("div");
lobbyPage.appendChild(roomsList);

// ===== ХРАНИЛИЩЕ =====
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = null;
let rooms = [];

// ===== ПОКАЗ/СКРЫТИЕ СТРАНИЦ =====
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
  renderRooms();
}

function showGame() {
  loginPage.style.display = "none";
  registerPage.style.display = "none";
  lobbyPage.style.display = "none";
  gamePage.style.display = "block";
}

// ===== ЛОГИН/РЕГИСТРАЦИЯ =====
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (users[email] && users[email] === password) {
    currentUser = email;
    console.log("Вход успешный:", email);
    showLobby();
  } else {
    alert("Неверный email или пароль!");
  }
}

function register() {
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!email || !password) {
    alert("Введите email и пароль!");
    return;
  }

  if (users[email]) {
    alert("Такой пользователь уже существует!");
  } else {
    users[email] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Регистрация успешна! Теперь войдите.");
    showLogin();
  }
}

// ===== ЛОББИ / СТОЛЫ =====
function createRoom() {
  const roomId = "Стол #" + (rooms.length + 1);
  rooms.push(roomId);
  renderRooms();
}

function renderRooms() {
  roomsList.innerHTML = "";
  if (rooms.length === 0) {
    roomsList.innerHTML = "<p>Столов пока нет</p>";
  } else {
    rooms.forEach((room, index) => {
      const div = document.createElement("div");
      div.textContent = room;
      const btn = document.createElement("button");
      btn.textContent = "Присоединиться";
      btn.onclick = () => joinRoom(index);
      div.appendChild(btn);
      roomsList.appendChild(div);
    });
  }
}

function joinRoom(index) {
  console.log("Присоединение к", rooms[index]);
  showGame();
  startGame();
}

function exitGame() {
  showLobby();
}

// ===== ИГРА =====
function startGame() {
  gameBoard.innerHTML = "";
  const values = ["🐱", "🐶", "🦜", "⚓", "💎", "🏴‍☠️"];
  const cards = [...values, ...values];
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

window.onload = () => {
  showLogin();
};