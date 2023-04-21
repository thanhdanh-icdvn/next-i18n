import { useState, useEffect } from 'react'
import { throttle } from 'throttle-debounce'

type Direction = 'up' | 'down' | undefined

interface Position {
  x: number
  y: number
}

const getPosition = (): Position => {
  if (typeof window === 'undefined') return { x: 0, y: 0 }

  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
  }
}

export const useScroll = (): [Direction, Position] => {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>()
  const [scrollPos, setScrollPos] = useState(() => getPosition())

  useEffect(() => {
    const handleScroll = throttle(100, () => {
      const currScrollPos = getPosition()

      setScrollDir(currScrollPos.y > scrollPos.y ? 'down' : 'up')
      setScrollPos(currScrollPos)
    })

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollPos])

  return [scrollDir, scrollPos]
}
