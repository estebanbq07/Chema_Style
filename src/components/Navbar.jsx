import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { count } = useCart()

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
      <Link to="/carrito">
        <button className="cart-btn">CARRITO ({count})</button>
      </Link>
    </header>
  )
}
