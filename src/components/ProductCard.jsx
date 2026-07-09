import { useState } from 'react'
import JerseySVG from './JerseySVG.jsx'
import Tag from './Tag.jsx'
import CustomizeModal from './CustomizeModal.jsx'

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false)

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
          aria-label={`Personalizar y añadir ${product.name} al carrito`}
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>

      {showModal && <CustomizeModal product={product} onClose={() => setShowModal(false)} />}
    </div>
  )
}