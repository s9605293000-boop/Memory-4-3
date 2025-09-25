const cards = [
  "anchor.svg", "anchor.svg",
  "ship.svg", "ship.svg",
  "skull.svg", "skull.svg",
  "sword.svg", "sword.svg",
  "map.svg", "map.svg",
  "compass.svg", "compass.svg"
];

let firstCard = null;
let lockBoard = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  const shuffled = shuffle(cards);

  shuffled.forEach(cardName => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = cardName;
    img.alt = cardName;

    card.appendChild(img);

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    const secondCard = card;
    checkMatch(firstCard, secondCard);
    firstCard = null;
  }
}

function checkMatch(card1, card2) {
  const img1 = card1.querySelector("img").src;
  const img2 = card2.querySelector("img").src;

  if (img1 === img2) {
    // оставляем открытыми
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      lockBoard = false;
    }, 1000);
  }
}

createBoard();