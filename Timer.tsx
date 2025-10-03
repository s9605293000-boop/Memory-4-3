
import React, { useEffect, useRef, useState } from 'react'

export default function Timer({ seconds, running=true, onTimeout }:{seconds:number; running?:boolean; onTimeout?:()=>void}){
  const [left, setLeft] = useState(seconds)
  const raf = useRef<number|undefined>()

  useEffect(()=> setLeft(seconds), [seconds])

  useEffect(()=>{
    if (!running) { if (raf.current) cancelAnimationFrame(raf.current); return }
    let prev = performance.now()
    const tick = (t:number)=>{
      const dt = (t - prev)/1000
      prev = t
      setLeft(v=>{
        const nv = Math.max(0, v - dt)
        if (nv === 0){ onTimeout && onTimeout(); return 0 }
        return nv
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return ()=> raf.current && cancelAnimationFrame(raf.current)
  }, [running, onTimeout])

  return <b>⏱ {Math.ceil(left)}s</b>
}
