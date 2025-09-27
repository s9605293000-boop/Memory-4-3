// main.js

let currentUser = null;
let rooms = [];
let currentRoom = null;

function showPage(pageId) {
  document.querySelectorAll("div[id$='-page']").forEach(div => {
    div.style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";
}

// ----- Логин / Регистрация -----
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (email && password) {
    currentUser = { email, rating: 0 };
    alert("Успешный вход!");
    showPage("lobby-page");
    renderLobby();
  } else {
    alert("Введите email и пароль");
  }
}

function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (email && password) {
    alert("Регистрация успешна!");
    showLogin();
  } else {
    alert("Введите email и пароль");
  }
}

function showRegister() {
  showPage("register-page");
}

function showLogin() {
  showPage("login-page");
}

// ----- Лобби -----
function renderLobby() {
  const list = document.getElementById("rooms-list");
  list.innerHTML = "";

  rooms.forEach((room, index) => {
    const btn = document.createElement("button");
    btn.textContent = `Стол #${index + 1}`;
    btn.onclick = () => joinRoom(index);
    list.appendChild(btn);
  });
}

function createRoom() {
  rooms.push({ players: [currentUser], cards: [] });
  renderLobby();
}

function joinRoom(index) {
  if (rooms[index].players.length < 2) {
    rooms[index].players.push(currentUser);
    currentRoom = rooms[index];
    alert("Вы присоединились к столу!");
    startGame();
  } else {
    alert("Стол уже полон!");
  }
}

// ----- Игра -----
function startGame() {
  showPage("game-page");
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  // Определяем размер сетки (пока по умолчанию 4x3)
  const rows = 3;
  const cols = 4;
  const totalCards = rows * cols;

  // Список картинок-заглушек
  let images = [];
  for (let i = 0; i < totalCards / 2; i++) {
    images.push(`https://picsum.photos/200/200?random=${i}`);
  }
  images = [...images, ...images]; // дублируем пары
  images.sort(() => Math.random() - 0.5);

  // Создаём карточки
  images.forEach((src, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = idx;

    const img = document.createElement("img");
    img.src = src;
    img.className = "hidden";

    card.appendChild(img);
    card.onclick = () => flipCard(card);
    board.appendChild(card);
  });
}

let flippedCards = [];
function flipCard(card) {
  const img = card.querySelector("img");
  if (img.classList.contains("hidden")) {
    img.classList.remove("hidden");
    flippedCards.push(card);
  }

  if (flippedCards.length === 2) {
    const [c1, c2] = flippedCards;
    const i1 = c1.querySelector("img").src;
    const i2 = c2.querySelector("img").src;

    if (i1 === i2) {
      flippedCards = [];
    } else {
      setTimeout(() => {
        c1.querySelector("img").classList.add("hidden");
        c2.querySelector("img").classList.add("hidden");
        flippedCards = [];
      }, 1000);
    }
  }
}

function exitGame() {
  showPage("lobby-page");
  renderLobby();
}