import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../services/supabaseClient.js'

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError('')

    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) {
          setError('No se pudieron cargar los pedidos.')
          return
        }
        setOrders(data || [])
      })
  }, [user])

  async function fetchOrderItems(orderId) {
    const { data, error } = await supabase.from('order_items').select('*').eq('order_id', orderId)
    if (error) {
      setError('No se pudo cargar el detalle del pedido.')
      return
    }
    setItems(data || [])
  }

  async function openOrder(order) {
    setSelectedOrder(order)
    await fetchOrderItems(order.id)
  }

  if (authLoading || loading) {
    return (
      <section className="empty-state">
        <h2>Cargando perfil y pedidos...</h2>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div className="profile-info card">
          <h3>{profile?.full_name || user.email}</h3>
          <p className="mono">{user.email}</p>
          <p className="tag">Rol: {profile?.role || 'cliente'}</p>
          <div style={{ marginTop: 12 }}>
            <Link to="/" className="btn-ghost">Ir al catálogo</Link>
          </div>
        </div>
      </div>

      <div className="order-history">
        <h3>Historial de pedidos</h3>
        {error && <p className="form-error">{error}</p>}

        {orders.length === 0 ? (
          <section className="empty-state">
            <h2>No tenés pedidos aún</h2>
            <p>Cuando realices una compra aparecerá aquí tu historial.</p>
            <Link to="/" className="btn-primary">Ir al catálogo</Link>
          </section>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <article className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <div className="mono">{new Date(order.created_at).toLocaleString('es-CR')}</div>
                    <div className="mono">₡{order.total?.toLocaleString('es-CR')}</div>
                    <div>{order.payment_method}</div>
                  </div>
                  <div>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                    <div style={{ marginTop: 8 }}>
                      <button className="btn-ghost" onClick={() => openOrder(order)}>Ver detalle</button>
                    </div>
                  </div>
                </div>

                {selectedOrder && selectedOrder.id === order.id && (
                  <section className="order-detail-items">
                    <h4>Items</h4>
                    {items.length === 0 ? (
                      <p>No hay items en este pedido.</p>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Talle</th>
                            <th>Jugador</th>
                            <th>#</th>
                            <th>Parche</th>
                            <th>Precio</th>
                            <th>Cant.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(item => (
                            <tr key={item.id}>
                              <td>{item.product_name}</td>
                              <td>{item.size}</td>
                              <td>{item.player_name || '—'}</td>
                              <td>{item.player_number || '—'}</td>
                              <td>{item.patches?.join(', ') || '—'}</td>
                              <td className="mono">₡{item.unit_price?.toLocaleString('es-CR')}</td>
                              <td>{item.qty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <div style={{ marginTop: 12 }}>
                      <button className="btn-ghost" onClick={() => setSelectedOrder(null)}>Cerrar</button>
                    </div>
                  </section>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
