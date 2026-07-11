import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient.js'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (error) {
      setError('No se pudo cargar la lista de pedidos.')
      return
    }
    setOrders(data || [])
  }

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

  async function changeStatus(orderId, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) {
      setError('No se pudo actualizar el estado del pedido.')
      return
    }
    fetchOrders()
  }

  return (
    <section className="admin-orders">
      <div className="admin-page-header">
        <div>
          <h2>Pedidos</h2>
          <p>Revisa los pedidos recientes y actualiza su estado según corresponda.</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <section className="empty-state">
          <h2>Cargando pedidos...</h2>
        </section>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>
                  <td className="mono">₡{order.total?.toLocaleString('es-CR')}</td>
                  <td>{order.payment_method}</td>
                  <td>
                    <select value={order.status} onChange={e => changeStatus(order.id, e.target.value)}>
                      <option value="pendiente">pendiente</option>
                      <option value="pagado">pagado</option>
                      <option value="enviado">enviado</option>
                      <option value="cancelado">cancelado</option>
                    </select>
                  </td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleString('es-CR') : '—'}</td>
                  <td>
                    <button className="method-btn" type="button" onClick={() => openOrder(order)}>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <section className="admin-detail-panel">
          <div className="admin-detail-header">
            <h3>Detalle del pedido {selectedOrder.id}</h3>
            <button className="btn-ghost" type="button" onClick={() => setSelectedOrder(null)}>
              Cerrar
            </button>
          </div>

          <div className="admin-detail-grid">
            <div>
              <p><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Teléfono:</strong> {selectedOrder.phone}</p>
              <p><strong>Dirección:</strong> {selectedOrder.address}</p>
              <p><strong>Pago:</strong> {selectedOrder.payment_method}</p>
              <p><strong>Estado:</strong> {selectedOrder.status}</p>
              {selectedOrder.receipt_url && (
                <p>
                  <strong>Comprobante:</strong>{' '}
                  <a href={selectedOrder.receipt_url} target="_blank" rel="noreferrer">
                    Ver comprobante
                  </a>
                </p>
              )}
            </div>

            <div>
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
            </div>
          </div>
        </section>
      )}
    </section>
  )
}
