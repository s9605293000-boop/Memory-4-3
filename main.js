// Переключение страниц
function showLogin() {
  document.getElementById("login-page").style.display = "block";
  document.getElementById("register-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "none";
}

function showRegister() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "block";
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "none";
}

function showLobby() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
  document.getElementById("game-page").style.display = "none";
}

function showGame() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "block";
}

// Простая «имитация» логина и регистрации
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  if (email && password) {
    alert("Вход выполнен!");
    showLobby();
  } else {
    alert("Введите email и пароль!");
  }
}

function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  if (email && password) {
    alert("Регистрация успешна!");
    showLogin();
  } else {
    alert("Введите email и пароль!");
  }
}

// Лобби и игра
function createRoom() {
  const roomDiv = document.createElement("div");
  roomDiv.innerHTML = `
    <p>Стол #${Math.floor(Math.random()*1000)}</p>
    <button onclick="joinRoom()">Присоединиться</button>
  `;
  document.getElementById("rooms-list").appendChild(roomDiv);
}

function joinRoom() {
  alert("Вы присоединились к столу!");
  showGame();
}

function exitGame() {
  alert("Вы вышли из игры");
  showLobby();
}

// Запуск со страницы логина
showLogin();