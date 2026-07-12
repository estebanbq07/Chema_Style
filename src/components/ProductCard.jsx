import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import JerseySVG from './JerseySVG.jsx'
import Tag from './Tag.jsx'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const VARIANTS = [
  { id: 'local', label: 'Local' },
  { id: 'visitante', label: 'Visitante' },
  { id: 'tercera', label: 'Tercera' },
]

export default function ProductCard({ product }) {
  const [size, setSize] = useState('M')
  const [variant, setVariant] = useState('local')
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const favorited = isFavorite(product.id)

  function toggleFavorite() {
    if (favorited) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
  }

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

      <div className="card-options">
        <div className="option-group">
          <span className="option-label">Talla</span>
          <div className="size-options">
            {SIZES.map(s => (
              <button
                key={s}
                type="button"
                className={`size-btn ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <span className="option-label">Tipo</span>
          <div className="variant-options">
            {VARIANTS.map(v => (
              <button
                key={v.id}
                type="button"
                className={`size-btn ${variant === v.id ? 'active' : ''}`}
                onClick={() => setVariant(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-foot">
        <Tag>
          <span className="price">₡{product.price.toLocaleString('es-CR')}</span>
          <span className="divider">|</span>
          <span>{size} · {variant === 'local' ? 'Local' : variant === 'visitante' ? 'Visitante' : 'Tercera'}</span>
        </Tag>
        <div className="card-actions">
          <button
            type="button"
            className={`favorite-btn ${favorited ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label={favorited ? `Quitar ${product.name} de la lista de deseos` : `Agregar ${product.name} a la lista de deseos`}
          >
            {favorited ? 'Guardado' : 'Favorito'}
          </button>
          <Link
            to={`/personalizar/${product.id}?size=${size}&variant=${variant}`}
            className="add-btn"
            aria-label={`Ir a personalizar ${product.name}`}
          >
            +
          </Link>
        </div>
      </div>
    </div>
  )
}