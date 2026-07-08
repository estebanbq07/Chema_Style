import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const PAYMENT_INFO = {
  transferencia: {
    banco: 'Banco Nacional de Costa Rica',
    cuentaIBAN: 'CR00 0000 0000 0000 0000 00',
    titular: 'Chema Style S.A.',
  },
  sinpe: {
    numero: '8888-8888',
    titular: 'Chema Style',
  },
}

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [method, setMethod] = useState('sinpe')
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '' })
  const [confirmed, setConfirmed] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleConfirm(e) {
    e.preventDefault()
    // Acá luego se conecta con el backend (crear el pedido, guardar comprobante, etc.)
    setConfirmed(true)
    clearCart()
  }

  if (items.length === 0 && !confirmed) {
    navigate('/')
    return null
  }

  if (confirmed) {
    return (
      <section className="empty-state">
        <h2>¡Pedido recibido!</h2>
        <p>
          Te vamos a escribir al {form.telefono || 'número que dejaste'} para confirmar el pago
          {method === 'sinpe' ? ' por SINPE Móvil' : ' por transferencia bancaria'} y coordinar la entrega.
        </p>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <h2>Finalizar pedido</h2>

      <form onSubmit={handleConfirm} className="checkout-grid">
        <div className="checkout-form">
          <label>
            Nombre completo
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>
            Teléfono
            <input name="telefono" value={form.telefono} onChange={handleChange} required />
          </label>
          <label>
            Dirección de entrega
            <input name="direccion" value={form.direccion} onChange={handleChange} required />
          </label>

          <div className="payment-methods">
            <button
              type="button"
              className={`method-btn ${method === 'sinpe' ? 'active' : ''}`}
              onClick={() => setMethod('sinpe')}
            >
              SINPE Móvil
            </button>
            <button
              type="button"
              className={`method-btn ${method === 'transferencia' ? 'active' : ''}`}
              onClick={() => setMethod('transferencia')}
            >
              Transferencia bancaria
            </button>
          </div>

          <div className="payment-instructions tag-block">
            {method === 'sinpe' ? (
              <>
                <p>Enviá el monto exacto a este número de SINPE Móvil:</p>
                <p className="mono highlight">{PAYMENT_INFO.sinpe.numero}</p>
                <p className="mono">A nombre de: {PAYMENT_INFO.sinpe.titular}</p>
              </>
            ) : (
              <>
                <p>Transferí el monto exacto a esta cuenta:</p>
                <p className="mono">{PAYMENT_INFO.transferencia.banco}</p>
                <p className="mono highlight">{PAYMENT_INFO.transferencia.cuentaIBAN}</p>
                <p className="mono">A nombre de: {PAYMENT_INFO.transferencia.titular}</p>
              </>
            )}
            <p className="hint">Después de pagar, confirmá el pedido aquí abajo y envianos el comprobante por WhatsApp.</p>
          </div>

          <button type="submit" className="btn-primary"><span>Ya pagué, confirmar pedido</span></button>
        </div>

        <aside className="order-summary">
          <h3>Resumen del pedido</h3>
          {items.map(item => (
            <div className="summary-row" key={`${item.id}-${item.size}`}>
              <span>{item.name} × {item.qty} ({item.size})</span>
              <span className="mono">₡{(item.price * item.qty).toLocaleString('es-CR')}</span>
            </div>
          ))}
          <div className="summary-row total-row">
            <span>Total</span>
            <span className="mono">₡{total.toLocaleString('es-CR')}</span>
          </div>
        </aside>
      </form>
    </section>
  )
}
