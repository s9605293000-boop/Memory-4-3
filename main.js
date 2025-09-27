/* ===== Навигация по страницам (упрощённо, без сервера) ===== */
function showRegister(){ 
  document.getElementById('login-page').style.display='none';
  document.getElementById('register-page').style.display='block';
}
function showLogin(){ 
  document.getElementById('login-page').style.display='block';
  document.getElementById('register-page').style.display='none';
}
function login(){
  document.getElementById('login-page').style.display='none';
  document.getElementById('lobby-page').style.display='block';
}
function register(){ alert('Регистрация прошла успешно!'); showLogin(); }
function createRoom(){
  document.getElementById('lobby-page').style.display='none';
  document.getElementById('game-page').style.display='block';
}
function exitGame(){
  document.getElementById('game-page').style.display='none';
  document.getElementById('lobby-page').style.display='block';
}

/* ===== ИГРА: пиратские картинки вместо цифр ===== */

/* имена файлов в КОРНЕ репозитория */
const ICONS = [
  'anchor','barrel','bomb','coin','compass','map',
  'parrot','ship','skull','spyglass','sword','wheel'
];
const BACK_IMAGE = 'back.svg';

let first = null;
let lock = false;
let leftToMatch = 0;

function startGame(cardCount){
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.className = '';               // сбрасываем сетку
  if (cardCount === 12) board.classList.add('grid-12');
  if (cardCount === 16) board.classList.add('grid-16');
  if (cardCount === 24) board.classList.add('grid-24');

  // выбираем нужное количество пар и перемешиваем
  const pairsNeeded = cardCount / 2;
  const chosen = ICONS.slice(0, pairsNeeded);
  const deck = shuffle([...chosen, ...chosen]);

  leftToMatch = pairsNeeded;
  first = null; lock = false;

  // строим карточки с фронтом (SVG) и рубашкой
  deck.forEach(name => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.name = name;

    const inner = document.createElement('div');
    inner.className = 'inner';

    const front = document.createElement('div');
    front.className = 'card-face card-front';
    const imgFront = document.createElement('img');
    imgFront.src = `${name}.svg`;
    imgFront.alt = name;
    front.appendChild(imgFront);

    const back = document.createElement('div');
    back.className = 'card-face card-back';
    const imgBack = document.createElement('img');
    imgBack.src = BACK_IMAGE;
    imgBack.alt = '?';
    back.appendChild(imgBack);

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    card.addEventListener('click', onCardClick);
    board.appendChild(card);
  });
}

function onCardClick(e){
  if (lock) return;
  const card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!first){
    first = card;
    return;
  }

  // сравниваем
  lock = true;
  const second = card;
  const match = first.dataset.name === second.dataset.name;

  if (match){
    first.classList.add('matched');
    second.classList.add('matched');
    resetTurn();
    leftToMatch--;
    // здесь можно обновлять счёт, отправлять события в Firebase и т.д.
  }else{
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      resetTurn();
    }, 700);
  }
}

function resetTurn(){
  first = null;
  lock = false;
}

/* утилита */
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}