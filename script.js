document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const buttons = document.querySelectorAll("#menu button");

  // Имена SVG лежат в корне репозитория: anchor.svg, barrel.svg, ...
  const ICONS = [
    "anchor", "barrel", "bomb", "coin", "compass", "map",
    "parrot", "ship", "skull", "spyglass", "sword", "wheel"
  ];

  let lock = false;
  let first = null;
  let second = null;
  let matched = 0;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const count = parseInt(btn.dataset.count, 10);
      startGame(count);
    });
  });

  function startGame(cardCount = 12) {
    // Сброс
    board.innerHTML = "";
    board.className = "";
    board.classList.add(`level-${cardCount}`);
    matched = 0;
    lock = false;
    first = null;
    second = null;

    // Колода
    const needPairs = cardCount / 2;
    const chosen = ICONS.slice(0, needPairs);
    const deck = shuffle([...chosen, ...chosen]);

    // Рендер
    deck.forEach(name => board.appendChild(createCard(name)));
  }

  function createCard(name) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = name;

    const front = document.createElement("img");
    front.className = "front";
    front.src = `${name}.svg`;
    front.alt = name;

    const back = document.createElement("img");
    back.className = "back";
    back.src = "back.svg";
    back.alt = "back";

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener("click", () => onFlip(card));
    return card;
  }

  function onFlip(card) {
    if (lock || card.classList.contains("done") || card === first) return;

    card.classList.add("flipped");

    if (!first) { first = card; return; }

    second = card;
    lock = true;

    const isMatch = first.dataset.name === second.dataset.name;
    if (isMatch) {
      first.classList.add("done");
      second.classList.add("done");
      resetTurn();
      matched += 2;

      if (matched === board.querySelectorAll(".card").length) {
        setTimeout(() => alert("Готово! Все пары найдены."), 300);
      }
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        resetTurn();
      }, 700);
    }
  }

  function resetTurn() {
    [first, second] = [null, null];
    lock = false;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Автозапуск по первой кнопке
  const defBtn = document.querySelector('#menu [data-count]');
  startGame(defBtn ? parseInt(defBtn.dataset.count, 10) : 12);
});