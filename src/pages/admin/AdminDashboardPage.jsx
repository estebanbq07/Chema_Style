import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      setError('')

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      if (productsRes.error || ordersRes.error || usersRes.error) {
        setError('No se pudo cargar el panel. Intentá de nuevo.')
      } else {
        setStats({
          products: productsRes.count || 0,
          orders: ordersRes.count || 0,
          users: usersRes.count || 0,
        })
      }

      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <section className="empty-state">
        <h2>Cargando panel...</h2>
      </section>
    )
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-hero">
        <div>
          <h2>Panel de administración</h2>
          <p>Bienvenido al panel de Chema Style. Controla productos, pedidos y usuarios desde aquí.</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-grid">
        <article className="admin-card">
          <p>Total de productos</p>
          <strong>{stats.products}</strong>
        </article>
        <article className="admin-card">
          <p>Pedidos</p>
          <strong>{stats.orders}</strong>
        </article>
        <article className="admin-card">
          <p>Usuarios</p>
          <strong>{stats.users}</strong>
        </article>
      </div>

      <div className="admin-actions">
        <Link to="productos" className="btn-primary">Administrar productos</Link>
        <Link to="pedidos" className="btn-primary">Administrar pedidos</Link>
        <Link to="usuarios" className="btn-primary">Administrar usuarios</Link>
      </div>
    </section>
  )
}
