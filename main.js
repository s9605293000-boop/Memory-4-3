let currentBackClass = "back-blue"; // по умолчанию

function startGame(level) {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  let rows, cols;

  if (level === "4x3") {
    rows = 3; cols = 4;
    currentBackClass = "back-blue";
  } else if (level === "4x4") {
    rows = 4; cols = 4;
    currentBackClass = "back-green";
  } else if (level === "4x6") {
    rows = 6; cols = 4;
    currentBackClass = "back-red";
  }

  board.style.gridTemplateColumns = `repeat(${cols}, 70px)`;
  board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

  const totalCards = rows * cols;
  const cards = generateCards(totalCards);

  cards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card", currentBackClass);
    div.dataset.value = card;

    div.addEventListener("click", () => flipCard(div));

    board.appendChild(div);
  });
}

function generateCards(total) {
  let arr = [];
  for (let i = 1; i <= total / 2; i++) {
    arr.push(i, i);
  }
  return arr.sort(() => Math.random() - 0.5);
}

function flipCard(card) {
  if (card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  card.style.backgroundImage = `url('assets/${card.dataset.value}.png')`;
}

/* Заглушки для кнопок */
function login() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}
function showRegister() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "block";
}
function showLogin() {
  document.getElementById("register-page").style.display = "none";
  document.getElementById("login-page").style.display = "block";
}
function register() {
  document.getElementById("register-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}
function createRoom() {
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "block";
}
function exitGame() {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}