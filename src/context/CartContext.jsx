import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)

// Precio extra por cada personalización (ajustá estos valores si querés)
export const CUSTOMIZATION_PRICES = {
  patch: 2500,   // por cada parche agregado
  number: 3000,  // por poner número
  name: 3000,    // por poner nombre
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  // cada item: { lineId, id, name, price, qty, size, playerName, playerNumber, patches: [] }

  function addItem(product, customization) {
    const { size = 'M', playerName = '', playerNumber = '', patches = [] } = customization || {}

    const extra =
      (playerName ? CUSTOMIZATION_PRICES.name : 0) +
      (playerNumber ? CUSTOMIZATION_PRICES.number : 0) +
      patches.length * CUSTOMIZATION_PRICES.patch

    const lineId = `${product.id}-${size}-${playerName}-${playerNumber}-${patches.join(',')}-${Date.now()}`

    setItems(prev => [
      ...prev,
      {
        lineId,
        id: product.id,
        name: product.name,
        basePrice: product.price,
        price: product.price + extra,
        qty: 1,
        size,
        playerName,
        playerNumber,
        patches,
      },
    ])
  }

  function removeItem(lineId) {
    setItems(prev => prev.filter(i => i.lineId !== lineId))
  }

  function updateQty(lineId, qty) {
    if (qty < 1) return removeItem(lineId)
    setItems(prev => prev.map(i => (i.lineId === lineId ? { ...i, qty } : i)))
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