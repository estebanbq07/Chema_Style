import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { supabase } from '../services/supabaseClient.js'

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
  const { user, profile } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [method, setMethod] = useState('sinpe')
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '' })
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    if (profile?.full_name) {
      setForm(current => ({ ...current, nombre: profile.full_name }))
    }
  }, [profile])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 const [submitting, setSubmitting] = useState(false)
const [submitError, setSubmitError] = useState('')
async function handleConfirm(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    const orderItems = items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      variant: item.variant || 'local',
      size: item.size,
      player_name: item.playerName || null,
      player_number: item.playerNumber || null,
      patches: item.patches || [],
      unit_price: item.price,
      qty: item.qty,
    }))

    const { error } = await supabase.rpc('create_order', {
      p_user_id: user?.id,
      p_customer_name: form.nombre,
      p_phone: form.telefono,
      p_address: form.direccion,
      p_payment_method: method,
      p_total: total,
      p_items: orderItems,
    })

    if (error) {
      console.error('Error creando el pedido:', error)
      setSubmitError('No pudimos guardar tu pedido. Intentá de nuevo.')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
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
          {submitError && <p className="checkout-error">{submitError}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            <span>{submitting ? 'Guardando pedido...' : 'Ya pagué, confirmar pedido'}</span>
          </button>
        </div>

        <aside className="order-summary">
          <h3>Resumen del pedido</h3>
          {items.map(item => (
            <div className="summary-row" key={item.lineId}>
              <span>
                {item.name} × {item.qty} ({item.variant ? `${item.variant.charAt(0).toUpperCase()}${item.variant.slice(1)}` : 'Local'} / {item.size})
                {(item.playerName || item.playerNumber) && (
                  <> — {item.playerName || '—'} {item.playerNumber ? `#${item.playerNumber}` : ''}</>
                )}
              </span>
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
