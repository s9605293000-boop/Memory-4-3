let users = [];
let currentUser = null;
let records = [];

function showRegister() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "block";
}

function showLogin() {
  document.getElementById("register-page").style.display = "none";
  document.getElementById("login-page").style.display = "block";
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    document.getElementById("login-page").style.display = "none";
    document.getElementById("lobby-page").style.display = "block";
  } else {
    alert("Неверные данные или пользователь не зарегистрирован.");
  }
}

function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!users.find(u => u.email === email)) {
    users.push({ email, password });
    alert("Регистрация успешна! Теперь войдите.");
    showLogin();
  } else {
    alert("Пользователь с таким email уже существует.");
  }
}

function createRoom() {
  const level = document.getElementById("level-select").value;
  startGame(level);
}

function startGame(level) {
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "block";

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  let rows, cols;
  if (level == 12) { rows = 3; cols = 4; }
  if (level == 16) { rows = 4; cols = 4; }
  if (level == 24) { rows = 4; cols = 6; }

  const totalCards = rows * cols;
  const images = [];
  for (let i = 1; i <= totalCards / 2; i++) {
    images.push(`https://placekitten.com/200/200?image=${i}`);
    images.push(`https://placekitten.com/200/200?image=${i}`);
  }
  images.sort(() => Math.random() - 0.5);

  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  images.forEach(img => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back"><img src="${img}" alt="card"></div>
      </div>
    `;
    gameBoard.appendChild(card);
  });
}

function exitGame() {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}

function showRecords() {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("records-page").style.display = "block";

  const list = document.getElementById("records-list");
  list.innerHTML = "";
  records.forEach(r => {
    let li = document.createElement("li");
    li.textContent = `${r.user} — Очки: ${r.score}, Время: ${r.time} сек (${r.date})`;
    list.appendChild(li);
  });
}

function backToLobby() {
  document.getElementById("records-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}