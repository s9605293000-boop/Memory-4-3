
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Timer from '../components/Timer'
import { auth, db } from '../firebase'
import { collection, doc, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore'

type Card = { id:number; pairId:number; revealed:boolean; matched:boolean; face:string }
type Player = { uid:string|null; name:string|null; score:number }

export default function DuelTable(){
  const { roomId } = useParams()
  const [room, setRoom] = useState<any>(null)
  const [cards, setCards] = useState<Card[]>([])

  useEffect(()=>{
    if (!roomId) return
    const unsub = onSnapshot(doc(db,'rooms',roomId), snap => {
      setRoom({ id:snap.id, ...snap.data() })
    })
    const q = query(collection(doc(db,'rooms',roomId),'cards'))
    const unsub2 = onSnapshot(q, snap => {
      setCards(snap.docs.map(d => d.data() as Card))
    })
    return ()=>{ unsub(); unsub2() }
  }, [roomId])

  useEffect(()=>{
    const join = async ()=>{
      if (!room || !roomId) return
      const p2 = room.players?.[1]
      if (!p2 || !p2.uid){
        const updated = [...room.players]
        const u = auth.currentUser
        updated[1] = { uid: u?.uid || null, name: u?.displayName || 'Игрок 2', score: 0 }
        await updateDoc(doc(db,'rooms',roomId), { players: updated, status: 'playing' })
      }
    }
    join()
  }, [room, roomId])

  const pairs = room?.level ? room.level/2 : 0
  const matchedPairs = cards.filter(c=>c.matched).length/2
  const finished = matchedPairs === pairs && pairs>0

  const handleTimeout = async ()=>{
    if (!roomId || !room) return
    await updateDoc(doc(db,'rooms',roomId), { turn: room.turn===1 ? 2 : 1 })
  }

  return (
    <div className="page">
      <div className="topbar">
        <Link to="/duel" className="linkBack">← Дуэль</Link>
        <div className="badge">Стол: <b>{roomId}</b></div>
        <div style={{flex:1}}/>
        {room && <div className="badge">Банк: <b>${room.bank}</b></div>}
        <div style={{width:12}}/>
        {!finished && <Timer seconds={5} onTimeout={handleTimeout}/>}
      </div>

      <h2>Дуэль {room ? `· ${room.level} карт` : ''}</h2>

      {room && (
        <div className="playersRow">
          {room.players?.map((p:Player, idx:number) => (
            <div key={idx} className={`playerBox ${room.turn===idx+1 ? 'active':''}`}>
              <div>{p?.name || `Игрок ${idx+1}`}</div>
              <div>Очки: <b>{p?.score || 0}</b></div>
              {room.turn===idx+1 && <div className="turn">Ходит сейчас</div>}
            </div>
          ))}
        </div>
      )}

      <div className={`grid grid-${room?.level || 12}`}>
        {cards.map((c, i) => (
          <button key={i} className={`tile ${c.revealed || c.matched ? 'face':''}`}>{c.revealed || c.matched ? c.face : '❓'}</button>
        ))}
      </div>
    </div>
  )
}
