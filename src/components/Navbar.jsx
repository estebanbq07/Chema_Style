import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user, profile, signOut } = useAuth()

  return (
    <header>
      <Link to="/" className="logo">
        <div className="logo-num">C</div>
        <div className="logo-text">CHEMA STYLE</div>
      </Link>
      <nav>
        <ul>
          <li><Link to="/">Catálogo</Link></li>
          <li><a href="#">Selecciones</a></li>
          <li><a href="#">Personalizar</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>
      <div>
        <Link to="/carrito">
          <button className="cart-btn">CARRITO ({count})</button>
        </Link>
        {user ? (
          <div className="nav-user">
            <span className="mono">{profile?.full_name || user.email}</span>
            <button className="cart-btn" onClick={() => signOut()}>Cerrar sesión</button>
          </div>
        ) : (
          <Link to="/login">
            <button className="cart-btn">Iniciar sesión</button>
          </Link>
        )}
      </div>
    </header>
  )
}
