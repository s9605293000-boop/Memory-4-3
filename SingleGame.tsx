
import React, { useCallback, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { buildDeck, Card } from '../engine/memoryEngine'
import Timer from '../components/Timer'

export default function SingleGame(){
  const { size } = useParams()
  const total = Math.max(12, Math.min(24, Number(size) || 12))
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(total))
  const [turnRunning, setTurnRunning] = useState(true)
  const [revealed, setRevealed] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const pairs = total / 2
  const matched = deck.filter(c=>c.matched).length / 2

  const resetTurn = useCallback(()=>{
    setDeck(d => d.map(c => c.matched ? c : ({...c, revealed:false})))
    setRevealed([])
    setTurnRunning(true)
  }, [])

  const onTimeout = useCallback(()=>{
    setTurnRunning(false)
    setTimeout(resetTurn, 500)
  }, [resetTurn])

  const clickCard = (cid:number)=>{
    setDeck(prev => {
      const idx = prev.findIndex(c=>c.id===cid); if (idx<0) return prev
      const card = prev[idx]; if (card.matched || card.revealed || revealed.length===2) return prev
      const copy = prev.slice()
      copy[idx] = {...card, revealed:true}
      const newRevealed = [...revealed, cid]

      if (newRevealed.length===2){
        setMoves(m=>m+1)
        const [aId,bId] = newRevealed
        const a = copy.find(c=>c.id===aId)!; const b = copy.find(c=>c.id===bId)!
        if (a.pairId===b.pairId){
          copy[copy.findIndex(c=>c.id===aId)] = {...a, matched:true}
          copy[copy.findIndex(c=>c.id===bId)] = {...b, matched:true}
          setRevealed([])
        } else {
          setTimeout(()=>{
            setDeck(d => d.map(c => (c.id===aId||c.id===bId) && !c.matched ? {...c, revealed:false} : c))
            setRevealed([])
          }, 650)
        }
      } else setRevealed(newRevealed)

      return copy
    })
  }

  const finished = useMemo(()=> matched===pairs, [matched, pairs])

  return (
    <div className="page">
      <div className="topbar">
        <Link to="/single" className="linkBack">← Уровни</Link>
        <div style={{flex:1}}/>
        <Timer seconds={5} running={!finished && turnRunning} onTimeout={onTimeout} />
      </div>

      <h2>Одиночная игра · {total} карт</h2>
      <div className={`grid grid-${total}`}>
        {deck.map(card => (
          <button key={card.id}
            className={`tile ${card.revealed || card.matched ? 'face':''}`}
            onClick={()=>clickCard(card.id)} disabled={finished}>
            {card.revealed || card.matched ? card.face : '❓'}
          </button>
        ))}
      </div>

      <div className="hud">
        <div>Ходы: <b>{moves}</b></div>
        <div>Пары: <b>{matched}/{pairs}</b></div>
        <button className="smallBtn" onClick={()=>{ setDeck(buildDeck(total)); setMoves(0); setRevealed([]); }}>Перезапустить</button>
      </div>
    </div>
  )
}
