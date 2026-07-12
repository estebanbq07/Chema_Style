import { createContext, useContext, useEffect, useState } from 'react'

const FavoritesContext = createContext(null)
const STORAGE_KEY = 'chema-wishlist'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function addFavorite(item) {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id)
      if (exists) {
        return prev.map(fav => (fav.id === item.id ? { ...fav, ...item } : fav))
      }
      return [...prev, item]
    })
  }

  function removeFavorite(id) {
    setFavorites(prev => prev.filter(item => item.id !== id))
  }

  function isFavorite(id) {
    return favorites.some(item => item.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>')
  return ctx
}
