import JerseySVG from './JerseySVG.jsx'
import Tag from './Tag.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="card">
      <div className="card-jersey">
        {product.image ? (
          <img src={product.image} alt={product.name} className="card-photo" />
        ) : (
          <JerseySVG color={product.color} num={product.num} stroke={product.stroke} dark={product.dark} />
        )}
      </div>

      <h3>{product.name}</h3>
      <div className="cat">{product.cat}</div>

      <div className="card-foot">
        <Tag>
          <span className="price">₡{product.price.toLocaleString('es-CR')}</span>
          <span className="divider">|</span>
          <span>S–XXL</span>
        </Tag>
        <button
          className="add-btn"
          aria-label={`Agregar ${product.name} al carrito`}
          onClick={() => addItem(product)}
        >
          +
        </button>
      </div>
    </div>
  )
}