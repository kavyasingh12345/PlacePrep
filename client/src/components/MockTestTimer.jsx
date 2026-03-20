import { useState, useEffect, useRef } from 'react'

export default function MockTestTimer({ duration, onTimeUp }) {
  const totalSeconds = duration * 60
  const [remaining, setRemaining] = useState(totalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')
  const pct  = (remaining / totalSeconds) * 100
  const color = pct > 50 ? 'text-green-600' : pct > 20 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className={`font-mono text-2xl font-bold ${color} tabular-nums`}>
      {mins}:{secs}
    </div>
  )
}