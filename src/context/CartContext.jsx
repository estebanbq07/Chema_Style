import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // [{ id, name, price, qty, size }]

  function addItem(product, size = 'M') {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, size, qty: 1 }]
    })
  }

  function removeItem(id, size) {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }

  function updateQty(id, size, qty) {
    if (qty < 1) return removeItem(id, size)
    setItems(prev => prev.map(i => (i.id === id && i.size === size ? { ...i, qty } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
