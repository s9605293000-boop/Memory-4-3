
import React from 'react'
import { Link } from 'react-router-dom'

export default function Lobby(){
  return (
    <div className="page">
      <h1>⚔️ Memory Duel v4.3</h1>
      <div className="cards">
        <Link className="bigBtn primary" to="/single">Играть одному</Link>
        <Link className="bigBtn" to="/duel">Игра дуэль</Link>
      </div>
    </div>
  )
}
