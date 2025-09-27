// ===== helper: показ страниц =====
function showSection(idToShow) {
  ["login-page","register-page","lobby-page","game-page"].forEach(id=>{
    document.getElementById(id).style.display = (id===idToShow ? "block" : "none");
  });
}

function showRegister(){ showSection("register-page"); }
function showLogin(){ showSection("login-page"); }

function register(){
  alert("Регистрация выполнена. Войдите под своими данными.");
  showLogin();
}
function login(){
  // демо-версия: просто пускаем в лобби
  showSection("lobby-page");
}

// ===== создание стола и запуск =====
function createRoom(){
  const level = parseInt(document.getElementById("level-select").value,10);
  startGame(level);
}

function exitGame(){
  showSection("lobby-page");
  // очистка поля
  document.getElementById("game-board").innerHTML = "";
}

// ===== логика игры =====
let firstCard = null;
let lock = false;

function startGame(cardsCount){
  showSection("game-page");

  const board = document.getElementById("game-board");
  board.classList.add("grid-4cols"); // всегда 4 колонки
  board.innerHTML = "";

  // набор пар
  const deck = [];
  for(let i=1;i<=cardsCount/2;i++){ deck.push(i,i); }
  // перемешиваем
  deck.sort(()=>Math.random() - 0.5);

  // создаём карточки
  deck.forEach(value=>{
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.value = value;
    el.textContent = "?" ;             // рубашка
    el.addEventListener("click", ()=> flipCard(el));
    board.appendChild(el);
  });
}

function flipCard(card){
  if(lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.value;

  if(!firstCard){
    firstCard = card;
    return;
  }

  // вторая карта
  if(firstCard.dataset.value === card.dataset.value){
    firstCard.classList.add("matched");
    card.classList.add("matched");
    firstCard = null;
  }else{
    lock = true;
    setTimeout(()=>{
      firstCard.classList.remove("flipped");
      card.classList.remove("flipped");
      firstCard.textContent = "?";
      card.textContent = "?";
      firstCard = null;
      lock = false;
    }, 700);
  }
}