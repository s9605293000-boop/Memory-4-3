const cardsImages = [
  "anchor.svg", "barrel.svg", "bomb.svg", "coin.svg",
  "compass.svg", "map.svg", "parrot.svg", "ship.svg",
  "skull.svg", "spyglass.svg", "sword.svg", "wheel.svg"
];

let firstCard, secondCard;
let lockBoard = false;
let totalPairs = 0;

function startGame(cardCount) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // очистить старое поле
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  const selectedImages = cardsImages.slice(0, cardCount / 2);
  const gameCards = [...selectedImages, ...selectedImages]
    .sort(() => Math.random() - 0.5);

  totalPairs = cardCount / 2;

  gameCards.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img class="front" src="${img}" alt="pirate">
      <div class="back"></div>
    `;
    card.addEventListener("click", () => flipCard(card, img));
    gameBoard.appendChild(card);
  });
}

function flipCard(card, img) {
  if (lockBoard || card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkForMatch();
}

function checkForMatch() {
  const firstImg = firstCard.querySelector(".front").src;
  const secondImg = secondCard.querySelector(".front").src;

  if (firstImg === secondImg) {
    resetBoard();
    totalPairs--;
    if (totalPairs === 0) setTimeout(() => alert("🎉 Победа!"), 300);
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}