const gameBoard = document.getElementById("game-board");
const levelSelect = document.getElementById("level");

const cardsSet = [
  "anchor.svg", "barrel.svg", "bomb.svg", "coin.svg",
  "compass.svg", "map.svg", "parrot.svg", "ship.svg",
  "skull.svg", "spyglass.svg", "sword.svg", "wheel.svg"
];

function startGame() {
  gameBoard.innerHTML = ""; // очищаем поле
  let numCards = parseInt(levelSelect.value); // выбранное количество
  let selectedCards = cardsSet.slice(0, numCards / 2); // нужное кол-во пар
  let cards = [...selectedCards, ...selectedCards]; // удвоение пар

  // перемешиваем карты
  cards.sort(() => 0.5 - Math.random());

  // создаём карточки
  cards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.image = card;
    cardElement.innerHTML = `<img src="back.svg" alt="back">`;

    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

let firstCard = null;
let lockBoard = false;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.innerHTML = `<img src="${this.dataset.image}" alt="card">`;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  if (firstCard.dataset.image === this.dataset.image) {
    firstCard = null; // совпало
  } else {
    lockBoard = true;
    setTimeout(() => {
      this.innerHTML = `<img src="back.svg" alt="back">`;
      firstCard.innerHTML = `<img src="back.svg" alt="back">`;
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}