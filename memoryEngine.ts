
export type Card = { id:number; pairId:number; revealed:boolean; matched:boolean; face:string }

export function buildDeck(size:number): Card[] {
  const pairs = size/2
  const faces = pickFaces(pairs)
  let id = 1
  const deck: Card[] = []
  for (let i=0;i<pairs;i++){
    const face = faces[i]
    deck.push({ id:id++, pairId:i, revealed:false, matched:false, face })
    deck.push({ id:id++, pairId:i, revealed:false, matched:false, face })
  }
  return shuffle(deck)
}

function shuffle<T>(a:T[]):T[]{
  a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a
}

const POOL = ['🍎','🍌','🍇','🍑','🍉','🥝','🍒','🍍','🥑','🌮','🍕','🍩','🍪','🍔','🍟','🍫','🥐','🧁','☕️','🍵','🎈','🎲','🎯','⚽️','🏀','🏓','🚗','✈️','🚀','🛸','⭐️','🌙','🌈','🔥','💎','🎵','🎧','🧩','🪙','🗡️','🛡️','⚓️']

function pickFaces(n:number){ return shuffle(POOL).slice(0,n) }
