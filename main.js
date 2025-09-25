// src/main.js
import { app, auth, db,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged,
  signInAnonymously, signOut, ref, onValue, set, get, update, remove, serverTimestamp, push, onDisconnect
} from './firebase.js';

// ----- PASTE YOUR CONFIG HERE if empty (temporary) -----
if (!window.FIREBASE_CONFIG) {
  // >>>> ВСТАВЬ СВОИ КЛЮЧИ Firebase здесь (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId)
  // Пример:
  // window.FIREBASE_CONFIG = { apiKey:"...", authDomain:"...", databaseURL:"https://<db>.firebasedatabase.app", projectId:"...", storageBucket:"...", messagingSenderId:"...", appId:"..." };
  console.warn("⚠ Не найден window.FIREBASE_CONFIG. Вставь свои ключи Firebase в src/main.js.");
}
// --------------------------------------------------------

const $ = s=>document.querySelector(s);
const Auth = {email:$('#email'), pass:$('#pass'), in:$('#doSignIn'), anon:$('#anon'), err:$('#authErr')};
const UI = {
  auth:$('#auth'), lobby:$('#lobby'), game:$('#game'),
  online:$('#online'), userBox:$('#userBox'), userName:$('#userName'), signOut:$('#signOut'),
  quick:$('#quickPlay'), level:$('#level'),
  board:$('#board'), leave:$('#leave'),
  p1Name:$('#p1Name'), p2Name:$('#p2Name'), p1Score:$('#p1Score'), p2Score:$('#p2Score'),
  p1Badge:$('#p1Badge'), p2Badge:$('#p2Badge'), turnBadge:$('#turnBadge'), timer:$('#timer'),
  install:$('#install')
};

// PWA install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{ deferredPrompt=e; UI.install.onclick=async()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); deferredPrompt=null; }; });

// Auth handlers
Auth.in.onclick = async()=>{
  try{
    await signInWithEmailAndPassword(auth, Auth.email.value, Auth.pass.value);
  }catch(e){
    if (e.code?.includes('user-not-found')) {
      await createUserWithEmailAndPassword(auth, Auth.email.value, Auth.pass.value);
    } else {
      Auth.err.textContent = e.message;
    }
  }
};
Auth.anon.onclick = ()=>signInAnonymously(auth);
UI.signOut.onclick = ()=>signOut(auth);

let me=null, uid=null, myPresenceRef=null, roomId=null, turnTimer=null;

onAuthStateChanged(auth, async(user)=>{
  me = user;
  if(user){
    uid = user.uid;
    UI.userName.textContent = user.isAnonymous ? 'Гость' : (user.email || 'Игрок');
    UI.userBox.classList.remove('hidden');
    UI.auth.classList.add('hidden');
    UI.lobby.classList.remove('hidden');
    await setupPresence();
    loadOnlineList();
  }else{
    UI.userBox.classList.add('hidden');
    UI.auth.classList.remove('hidden');
    UI.lobby.classList.add('hidden');
    UI.game.classList.add('hidden');
    if (myPresenceRef) { remove(myPresenceRef); myPresenceRef=null; }
  }
});

async function setupPresence(){
  const presRef = ref(db, 'presence/'+uid);
  myPresenceRef = presRef;
  const infoRef = ref(db, '.info/connected');
  onValue(infoRef, async(snap)=>{
    if (snap.val() === true) {
      await set(presRef, {uid, email: me.email||'guest', ts: serverTimestamp(), inRoom: null});
      onDisconnect(presRef).remove();
    }
  });
}

function loadOnlineList(){
  const listRef = ref(db,'presence');
  onValue(listRef, (snap)=>{
    const people = [];
    snap.forEach(ch=>{
      const v=ch.val();
      if (v && v.uid !== uid) people.push(v);
    });
    UI.online.innerHTML = people.length? '': '<i>Онлайн игроков нет</i>';
    people.forEach(p=>{
      const a = document.createElement('button');
      a.className='btn'; a.textContent = (p.email||'Игрок')+' · Дуэль';
      a.onclick = ()=>challenge(p.uid);
      UI.online.appendChild(a);
    });
  });
}

async function challenge(opponentUid){
  const level = UI.level.value;
  // Create room request under /invites/{opponentUid}
  const invRef = push(ref(db, 'invites/'+opponentUid));
  await set(invRef, {from: uid, level, ts: serverTimestamp()});
  alert('Приглашение отправлено. Ждём согласие соперника.');
}


// Listen own invites
onValue(ref(db, 'invites/'+(auth.currentUser?.uid||'_')), ()=>{}); // placeholder
onAuthStateChanged(auth, (u)=>{
  if(!u) return;
  onValue(ref(db,'invites/'+u.uid), async(snap)=>{
    snap.forEach(async(ch)=>{
      const inv = ch.val(); const key = ch.key;
      if (!inv) return;
      // Ask user
      const ok = confirm(`Вызов на дуэль! Принять? Уровень ${inv.level}`);
      if (ok) {
        await createRoomWith(inv.from, inv.level, /*opponent invited*/ true);
      }
      await remove(ref(db, 'invites/'+u.uid+'/'+key));
    });
  });
});

UI.quick.onclick = async()=>{
  const level = UI.level.value;
  // Try to find open room
  const openSnap = await get(ref(db, 'roomsIndex/'+level));
  let joined = false;
  openSnap.forEach(s=>{
    const rid = s.key;
    const v = s.val();
    if(!joined && v && v.open && v.host !== uid){
      joined=true; joinRoom(rid);
    }
  });
  if(!joined) await createRoomWith(null, level, false);
};

async function createRoomWith(opponentUid, level, acceptInvite){
  // Create room object
  const rid = push(ref(db,'rooms')).key;
  const deck = buildDeck(level);
  // Shuffle
  for(let i=deck.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }
  const room = {
    id: rid,
    level, deck,
    players: {
      [uid]: {score:0, name: me.email||'Игрок', joinedAt: serverTimestamp()}
    },
    turn: uid,
    flips: [],
    open: true,
    createdAt: serverTimestamp(),
    expiresAt: Date.now()+60*60*1000
  };
  await set(ref(db,'rooms/'+rid), room);
  await update(ref(db,'roomsIndex/'+level+'/'+rid), {open:true, host:uid});
  await joinRoom(rid);
  if (opponentUid && acceptInvite) {
    // inviter is opponent: ensure both join
    await update(ref(db,'presence/'+uid), {inRoom: rid});
    await update(ref(db,'presence/'+opponentUid), {inRoom: rid});
  }
}

async function joinRoom(rid){
  roomId = rid;
  // join as p2 if not present
  const rref = ref(db, 'rooms/'+rid);
  const snap = await get(rref);
  if(!snap.exists()) { alert('Комната недоступна'); return; }
  const data = snap.val();
  if (!data.players[uid]) {
    await update(rref+'/players', { [uid]: {score:0, name: me.email||'Игрок', joinedAt: serverTimestamp()} });
  }
  await update(ref(db,'presence/'+uid), {inRoom: rid});
  UI.lobby.classList.add('hidden');
  UI.game.classList.remove('hidden');
  listenRoom(rid);
}

function levelToSize(level){
  if(level==='4x3') return [4,3];
  if(level==='4x6') return [4,6];
  return [4,4];
}
function buildDeck(level){
  const [cols, rows] = levelToSize(level);
  const pairs = (cols*rows)/2;
  const names = ["anchor","skull","compass","coin","map","ship","barrel","bomb","parrot","sword","wheel","spyglass"];
  const chosen = names.slice(0, pairs);
  const deck = [];
  chosen.forEach((n,i)=>{
    deck.push({id:n+'-A', name:n, img:`assets/cards/${n}.svg`, open:false, found:false, owner:null});
    deck.push({id:n+'-B', name:n, img:`assets/cards/${n}.svg`, open:false, found:false, owner:null});
  });
  return deck;
}

function renderBoard(level, deck, flips, turn){
  const [cols, rows] = levelToSize(level);
  UI.board.style.gridTemplateColumns = `repeat(${cols}, var(--cardW))`;
  UI.board.innerHTML = '';
  deck.forEach((card, idx)=>{
    const el = document.createElement('div');
    el.className = 'card'+(card.open||card.found?' flipped':'');
    el.dataset.idx = idx;
    el.innerHTML = `<div>
      <div class="face front"><img src="${card.img}" alt=""></div>
      <div class="face back"><img src="assets/cards/back.svg" alt=""></div>
    </div>`;
    el.onclick = ()=>flipCard(idx);
    UI.board.appendChild(el);
  });
}

function setScores(players){
  const ids = Object.keys(players);
  const p1 = ids[0]||'-', p2 = ids[1]||'-';
  UI.p1Name.textContent = players[p1]?.name||'—';
  UI.p2Name.textContent = players[p2]?.name||'—';
  UI.p1Score.textContent = players[p1]?.score||0;
  UI.p2Score.textContent = players[p2]?.score||0;
}

function listenRoom(rid){
  const rref = ref(db,'rooms/'+rid);
  onValue(rref, (snap)=>{
    if(!snap.exists()) return;
    const r = snap.val();
    if(!r) return;
    setScores(r.players||{});
    UI.turnBadge.textContent = r.turn===uid ? 'Ваш' : 'Соперника';
    renderBoard(r.level, r.deck, r.flips||[], r.turn);
    startTurnTimer(r.turn);
    if (r.deck.every(c=>c.found)) {
      const ids = Object.keys(r.players);
      const s1 = r.players[ids[0]]?.score||0, s2 = r.players[ids[1]]?.score||0;
      alert(`Игра окончена! Счёт ${s1} : ${s2}`);
    }
  });
}

async function flipCard(idx){
  const rref = ref(db,'rooms/'+roomId);
  const snap = await get(rref);
  const r = snap.val();
  if (r.turn !== uid) return; // not your turn
  const card = r.deck[idx];
  if (card.open || card.found) return;
  // open card
  r.deck[idx].open = true;
  r.flips = (r.flips||[]).concat([idx]);
  await update(rref, { deck: r.deck, flips: r.flips });
  if (r.flips.length === 2) {
    const [a,b] = r.flips.map(i=>r.deck[i]);
    if (a.name === b.name) {
      // pair found
      r.deck[r.flips[0]].found = true; r.deck[r.flips[0]].owner = uid;
      r.deck[r.flips[1]].found = true; r.deck[r.flips[1]].owner = uid;
      r.players[uid].score = (r.players[uid].score||0)+1;
      r.flips = [];
      await update(rref, { deck:r.deck, players:r.players, flips:r.flips });
    } else {
      // mismatch, close after short delay and pass turn
      setTimeout(async()=>{
        const snap2 = await get(rref); const r2 = snap2.val();
        r2.deck[r2.flips[0]].open=false;
        r2.deck[r2.flips[1]].open=false;
        r2.flips=[];
        // switch turn
        const ids = Object.keys(r2.players);
        const next = ids.find(x=>x!==r2.turn) || r2.turn;
        await update(rref, { deck:r2.deck, flips:r2.flips, turn: next });
      }, 600);
    }
  }
}

function startTurnTimer(currentTurnUid){
  clearInterval(turnTimer);
  let left = 5;
  UI.timer.textContent = left;
  if (currentTurnUid !== uid) {
    UI.timer.textContent = '—';
    return;
  }
  turnTimer = setInterval(async()=>{
    left -= 1;
    UI.timer.textContent = left;
    if (left <= 0) {
      clearInterval(turnTimer);
      // force turn switch
      const rref = ref(db,'rooms/'+roomId);
      const snap = await get(rref); const r = snap.val();
      const ids = Object.keys(r.players);
      const next = ids.find(x=>x!==r.turn) || r.turn;
      await update(rref, { turn: next });
    }
  }, 1000);
}

UI.leave.onclick = async()=>{
  if(!roomId) return;
  const rref = ref(db,'rooms/'+roomId);
  const snap = await get(rref);
  if (snap.exists()) {
    const r = snap.val();
    // close index
    await remove(ref(db,'roomsIndex/'+r.level+'/'+roomId));
    // delete room if both left
    await remove(rref);
  }
  roomId=null;
  UI.game.classList.add('hidden');
  UI.lobby.classList.remove('hidden');
};

// register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>navigator.serviceWorker.register('src/pwa/sw.js'));
}
