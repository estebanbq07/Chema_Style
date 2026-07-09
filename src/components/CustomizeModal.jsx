import { useState } from 'react'
import { useCart, CUSTOMIZATION_PRICES } from '../context/CartContext.jsx'
import JerseySVG from './JerseySVG.jsx'
import { createPortal } from 'react-dom'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const AVAILABLE_PATCHES = [
  { id: 'liga', label: 'Parche de Liga' },
  { id: 'campeon', label: 'Parche de Campeón' },
  { id: 'torneo', label: 'Parche de Torneo' },
]

export default function CustomizeModal({ product, onClose }) {
  const { addItem } = useCart()
  const [size, setSize] = useState('M')
  const [playerName, setPlayerName] = useState('')
  const [playerNumber, setPlayerNumber] = useState('')
  const [patches, setPatches] = useState([])

  function togglePatch(id) {
    setPatches(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]))
  }

  const extra =
    (playerName ? CUSTOMIZATION_PRICES.name : 0) +
    (playerNumber ? CUSTOMIZATION_PRICES.number : 0) +
    patches.length * CUSTOMIZATION_PRICES.patch

  const finalPrice = product.price + extra

  function handleAdd() {
    addItem(product, { size, playerName, playerNumber: playerNumber.slice(0, 2), patches })
    onClose()
  }

return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>

        <div className="modal-preview">
          {product.image ? (
            <img src={product.image} alt={product.name} className="card-photo" />
          ) : (
            <JerseySVG color={product.color} num={playerNumber || product.num} stroke={product.stroke} dark={product.dark} />
          )}
        </div>

        <h3>{product.name}</h3>
        <p className="modal-cat">{product.cat}</p>

        <div className="modal-field">
          <label className="modal-label">Talla</label>
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

        <div className="modal-field">
          <label className="modal-label" htmlFor="playerName">
            Nombre en la espalda <span className="mono extra">+₡{CUSTOMIZATION_PRICES.name.toLocaleString('es-CR')}</span>
          </label>
          <input
            id="playerName"
            type="text"
            maxLength={12}
            placeholder="Ej: RODRÍGUEZ"
            value={playerName}
            onChange={e => setPlayerName(e.target.value.toUpperCase())}
          />
        </div>

        <div className="modal-field">
          <label className="modal-label" htmlFor="playerNumber">
            Número <span className="mono extra">+₡{CUSTOMIZATION_PRICES.number.toLocaleString('es-CR')}</span>
          </label>
          <input
            id="playerNumber"
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="Ej: 10"
            value={playerNumber}
            onChange={e => setPlayerNumber(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">
            Parches <span className="mono extra">+₡{CUSTOMIZATION_PRICES.patch.toLocaleString('es-CR')} c/u</span>
          </label>
          <div className="patch-options">
            {AVAILABLE_PATCHES.map(p => (
              <button
                key={p.id}
                type="button"
                className={`patch-btn ${patches.includes(p.id) ? 'active' : ''}`}
                onClick={() => togglePatch(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-total">
            <span>Total</span>
            <span className="mono">₡{finalPrice.toLocaleString('es-CR')}</span>
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            <span>Añadir al carrito</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}