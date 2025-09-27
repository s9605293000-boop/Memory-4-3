// --- Простая «сессия» ---
let currentUser = null;
let rooms = [];
let currentRoom = null;

// выбранная сетка (по умолчанию 4×3)
let grid = { rows: 3, cols: 4 };

// набор картинок (лежат у тебя в репозитории)
const SPRITES = [
  "anchor.svg","barrel.svg","bomb.svg","coin.svg",
  "compass.svg","map.svg","parrot.svg","ship.svg",
  "skull.svg","spyglass.svg","sword.svg","wheel.svg"
];
const BACK = "back.svg";

// ---------- Навигация страниц ----------
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display = "block";
}

// ---------- Аутентификация (демо) ----------
function login(){
  const email = document.getElementById("login-email").value.trim();
  const pwd   = document.getElementById("login-password").value.trim();
  if(!email || !pwd){ alert("Введите email и пароль"); return; }
  currentUser = { email, rating: 0 };
  showPage("lobby-page");
  renderLobby();
}
function register(){
  const email = document.getElementById("register-email").value.trim();
  const pwd   = document.getElementById("register-password").value.trim();
  if(!email || !pwd){ alert("Введите email и пароль"); return; }
  alert("Регистрация успешна!");
  showLogin();
}
function showRegister(){ showPage("register-page"); }
function showLogin(){ showPage("login-page"); }

// ---------- Выбор уровня ----------
function setActiveChip(container, rows, cols){
  container.querySelectorAll(".chip").forEach(c=>{
    const r = +c.dataset.rows, cl = +c.dataset.cols;
    c.classList.toggle("active", r===rows && cl===cols);
  });
}
function selectLevel(btn){
  grid = { rows:+btn.dataset.rows, cols:+btn.dataset.cols };
  setActiveChip(btn.parentElement, grid.rows, grid.cols);
}
function rebuildFromChip(btn){
  selectLevel(btn);
  startGame(); // перестроить поле в игре
}

// ---------- Лобби ----------
function renderLobby(){
  // выставим активный чип (визуально)
  const lobbyLevels = document.querySelector("#lobby-page .levels");
  setActiveChip(lobbyLevels, grid.rows, grid.cols);

  const list = document.getElementById("rooms-list");
  list.innerHTML = "";
  rooms.forEach((room, i)=>{
    const b = document.createElement("button");
    b.textContent = `Стол #${i+1} (${room.rows}×${room.cols}) — игроков: ${room.players.length}/2`;
    b.onclick = ()=>joinRoom(i);
    list.appendChild(b);
  });
}
function createRoom(){
  const room = {
    rows: grid.rows,
    cols: grid.cols,
    players: [currentUser],
    deck: []
  };
  rooms.push(room);
  renderLobby();
}
function joinRoom(i){
  const room = rooms[i];
  if(!room) return;
  if(room.players.length >= 2){ alert("Стол уже полон"); return; }
  room.players.push(currentUser);
  currentRoom = room;
  // сетку берём из стола
  grid = { rows: room.rows, cols: room.cols };
  startGame();
}

// ---------- Игра ----------
let lock = false;
let opened = []; // открытые (2 макс)

function startGame(){
  showPage("game-page");

  // активный чип в шапке игры
  const gameLevels = document.querySelector("#game-page .levels");
  setActiveChip(gameLevels, grid.rows, grid.cols);

  const board = document.getElementById("game-board");
  board.style.setProperty("--cols", grid.cols);
  board.innerHTML = "";

  const pairCount = (grid.rows * grid.cols) / 2;
  const sprites = SPRITES.slice(0, pairCount);
  const deck = shuffle([...sprites, ...sprites]).map(src => ({
    id: cryptoRandom(),
    src,
    matched: false
  }));

  // сохраним в текущем столе (если есть)
  if(currentRoom){ currentRoom.deck = deck; }

  deck.forEach(cardData=>{
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.src = cardData.src;     // лицевая сторона
    el.style.backgroundImage = `url('${BACK}')`; // рубашка
    el.onclick = () => onCardClick(el);
    board.appendChild(el);
  });

  lock = false;
  opened = [];
}

function onCardClick(el){
  if(lock || el.classList.contains("matched")) return;

  // если уже открыта — игнор
  if(el.classList.contains("flipped")) return;

  flipUp(el);

  opened.push(el);
  if(opened.length === 2){
    lock = true;
    const [a,b] = opened;
    const match = a.dataset.src === b.dataset.src;

    if(match){
      a.classList.add("matched");
      b.classList.add("matched");
      opened = [];
      lock = false;
    }else{
      setTimeout(()=>{
        flipDown(a);
        flipDown(b);
        opened = [];
        lock = false;
      }, 650);
    }
  }
}

function flipUp(el){
  el.classList.add("flipped");
  el.style.backgroundImage = `url('${el.dataset.src}')`;
}
function flipDown(el){
  el.classList.remove("flipped");
  el.style.backgroundImage = `url('${BACK}')`;
}

function exitGame(){
  currentRoom = null;
  showPage("lobby-page");
  renderLobby();
}

// ---------- Утилиты ----------
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}
function cryptoRandom(){
  // короткий id
  return (Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)).slice(0,12);
}

// стартовая страница
showLogin();