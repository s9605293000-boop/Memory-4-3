
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp, writeBatch, doc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { buildDeck } from '../engine/memoryEngine'

export default function DuelLobby(){
  const nav = useNavigate()
  const [size, setSize] = useState(12)
  const [bank, setBank] = useState(0)

  const createTable = async ()=>{
    const user = auth.currentUser
    const roomRef = await addDoc(collection(db, 'rooms'), {
      level: size,
      bank,
      status: 'waiting',
      turn: 1,
      createdAt: serverTimestamp(),
      players: [
        { uid: user?.uid || null, name: user?.displayName || 'Игрок 1', score: 0 },
        { uid: null, name: null, score: 0 }
      ]
    })
    const deck = buildDeck(size)
    const batch = writeBatch(db)
    deck.forEach(c => {
      const cRef = doc(collection(roomRef, 'cards'))
      batch.set(cRef, { id:c.id, pairId:c.pairId, revealed:false, matched:false, face:c.face })
    })
    await batch.commit()
    nav(`/duel/table/${roomRef.id}`)
  }

  return (
    <div className="page">
      <div className="topbar">
        <Link to="/" className="linkBack">← В лобби</Link>
      </div>
      <h2>Игра дуэль</h2>
      <div className="panel">
        <label>Уровень:&nbsp;
          <select value={size} onChange={e=> setSize(Number(e.target.value))}>
            <option value={12}>12 карт</option>
            <option value={16}>16 карт</option>
            <option value={24}>24 карты</option>
          </select>
        </label>
      </div>
      <div className="panel">
        <label>Банк (демо $):&nbsp;
          <input type="number" min="0" step="1" value={bank} onChange={e=> setBank(Number(e.target.value)||0)} />
        </label>
      </div>
      <div className="cards">
        <button className="bigBtn primary" onClick={createTable}>Создать стол</button>
      </div>
    </div>
  )
}
