const cards = [
  "pirate1.png", "pirate1.png",
  "pirate2.png", "pirate2.png",
  "pirate3.png", "pirate3.png",
  "pirate4.png", "pirate4.png"
];

let firstCard, secondCard;
let lockBoard = false;

const board = document.getElementById("game-board");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  shuffle(cards).forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.img = img;

    card.innerHTML = `<img src="assets/back.png" width="80">`;

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.innerHTML = `<img src="assets/${this.dataset.img}" width="80">`;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  let isMatch = firstCard.dataset.img === secondCard.dataset.img;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.innerHTML = `<img src="assets/back.png" width="80">`;
    secondCard.innerHTML = `<img src="assets/back.png" width="80">`;
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

createBoard();
