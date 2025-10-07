import { useRef, useCallback } from 'react'

export default function useDebouncedCallback(fn, delay) {
  const timer = useRef()
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}
