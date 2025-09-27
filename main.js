// Заглушки картинок (замени на свои)
const images = [
  "https://i.ibb.co/ygjV4Zt/pirate1.png",
  "https://i.ibb.co/vJWh3G9/pirate2.png",
  "https://i.ibb.co/hBBnHvL/pirate3.png",
  "https://i.ibb.co/yS4srjX/pirate4.png",
  "https://i.ibb.co/ZmS7pD7/pirate5.png",
  "https://i.ibb.co/bz07sSb/pirate6.png",
  "https://i.ibb.co/R2MJFRq/pirate7.png",
  "https://i.ibb.co/88YVf42/pirate8.png",
  "https://i.ibb.co/D9sQNjc/pirate9.png",
  "https://i.ibb.co/7X8DGrV/pirate10.png",
  "https://i.ibb.co/3dgbjV6/pirate11.png",
  "https://i.ibb.co/gTbFjSz/pirate12.png"
];

let currentUser = null;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

function showRegister() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "block";
}

function showLogin() {
  document.getElementById("register-page").style.display = "none";
  document.getElementById("login-page").style.display = "block";
}

function login() {
  currentUser = document.getElementById("login-email").value;
  if (!currentUser) {
    alert("Введите email!");
    return;
  }
  document.getElementById("login-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}

function register() {
  currentUser = document.getElementById("register-email").value;
  if (!currentUser) {
    alert("Введите email!");
    return;
  }
  document.getElementById("register-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}

function createRoom() {
  const level = parseInt(document.getElementById("level-select").value, 10);
  startGame(level);
}

function exitGame() {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("lobby-page").style.display = "block";
}

function startGame(totalCards) {
  document.getElementById("lobby-page").style.display = "none";
  document.getElementById("game-page").style.display = "block";

  score = 0;
  document.getElementById("score").innerText = "Очки: 0";

  let gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  let selectedImages = images.slice(0, totalCards / 2);
  let cards = [...selectedImages, ...selectedImages];

  cards = shuffle(cards);

  cards.forEach(image => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back"><img src="${image}" alt="pirate"></div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card, image));
    gameBoard.appendChild(card);
  });

  if (totalCards === 12) {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (totalCards === 16) {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (totalCards === 24) {
    gameBoard.style.gridTemplateColumns = "repeat(6, 1fr)";
  }
}

function flipCard(card, image) {
  if (lockBoard) return;
  if (card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  let firstImage = firstCard.querySelector(".card-back img").src;
  let secondImage = secondCard.querySelector(".card-back img").src;

  if (firstImage === secondImage) {
    score++;
    document.getElementById("score").innerText = "Очки: " + score;

    firstCard = null;
    secondCard = null;
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}