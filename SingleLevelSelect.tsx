
import React from 'react'
import { Link } from 'react-router-dom'

const sizes = [12,16,24]

export default function SingleLevelSelect(){
  return (
    <div className="page">
      <div className="topbar">
        <Link to="/" className="linkBack">← В лобби</Link>
      </div>
      <h2>Выберите уровень (одиночная игра)</h2>
      <div className="cards">
        {sizes.map(s => (<Link key={s} className="bigBtn" to={`/single/play/${s}`}>{s} карт</Link>))}
      </div>
    </div>
  )
}
