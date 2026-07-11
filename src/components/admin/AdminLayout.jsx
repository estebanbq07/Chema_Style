import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="logo-num">A</div>
          <div>
            <h3>Admin</h3>
            <p>Chema Style</p>
          </div>
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/admin">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/productos">Productos</Link>
            </li>
            <li>
              <Link to="/admin/pedidos">Pedidos</Link>
            </li>
            <li>
              <Link to="/admin/usuarios">Usuarios</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  )
}
