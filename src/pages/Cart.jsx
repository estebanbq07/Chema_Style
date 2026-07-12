import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h2>Tu carrito está vacío</h2>
        <p>Todavía no agregaste ninguna camisola.</p>
        <Link to="/"><button className="btn-primary"><span>Ver catálogo</span></button></Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <h2>Tu carrito</h2>
      <div className="cart-list">
        {items.map(item => (
          <div className="cart-row" key={item.lineId}>
            <div className="cart-row-info">
              <h4>{item.name}</h4>
              <span className="mono">{item.variant ? `${item.variant.charAt(0).toUpperCase()}${item.variant.slice(1)}` : 'Local'} · Talla {item.size}</span>
              {(item.playerName || item.playerNumber) && (
                <span className="mono cart-custom">
                  {item.playerName || '—'} {item.playerNumber ? `#${item.playerNumber}` : ''}
                </span>
              )}
              {item.patches?.length > 0 && (
                <span className="mono cart-custom">{item.patches.length} parche(s)</span>
              )}
            </div>
            <div className="cart-row-qty">
              <button onClick={() => updateQty(item.lineId, item.qty - 1)}>−</button>
              <span className="mono">{item.qty}</span>
              <button onClick={() => updateQty(item.lineId, item.qty + 1)}>+</button>
            </div>
            <div className="cart-row-price mono">₡{(item.price * item.qty).toLocaleString('es-CR')}</div>
            <button className="remove-btn" onClick={() => removeItem(item.lineId)} aria-label={`Quitar ${item.name}`}>×</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <span>Total</span>
        <span className="mono total">₡{total.toLocaleString('es-CR')}</span>
      </div>
      <button className="btn-primary" onClick={() => navigate('/checkout')}>
        <span>Ir a pagar</span>
      </button>
    </section>
  )
}