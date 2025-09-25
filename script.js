const cardsArray = [
  'anchor.svg',
  'barrel.svg',
  'bomb.svg',
  'coin.svg',
  'compass.svg',
  'map.svg',
  'parrot.svg',
  'ship.svg',
  'skull.svg',
  'spyglass.svg',
  'sword.svg',
  'wheel.svg'
];

let gameGrid = cardsArray.concat(cardsArray); // удвоение карт
gameGrid.sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById('game-board');
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function createBoard() {
  gameBoard.innerHTML = '';
  gameGrid.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.card = card;

    cardElement.innerHTML = `
      <img src="back.svg" class="back">
      <img src="${card}" class="front">
    `;

    cardElement.addEventListener('click', flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.card === secondCard.dataset.card;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

createBoard();