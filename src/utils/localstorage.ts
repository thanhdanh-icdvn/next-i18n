import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): readonly [T, (value: T) => void] => {
  // Inspired by https://usehooks-ts.com/react-hook/use-local-storage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue = (value: T): void => {
    try {
      // Allow value to be a function so we have same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value

      setStoredValue(newValue)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          key,
          typeof newValue === 'string' ? newValue : JSON.stringify(newValue)
        )
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key !== key) return
      setStoredValue((e.newValue as unknown as T) || readValue())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, readValue])

  return [storedValue, setValue] as const
}
