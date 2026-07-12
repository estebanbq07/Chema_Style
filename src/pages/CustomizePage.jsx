import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCart, CUSTOMIZATION_PRICES } from '../context/CartContext.jsx'
import { supabase } from '../services/supabaseClient.js'
import JerseySVG from '../components/JerseySVG.jsx'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const VARIANTS = [
  { id: 'local', label: 'Local' },
  { id: 'visitante', label: 'Visitante' },
  { id: 'tercera', label: 'Tercera' },
]
const AVAILABLE_PATCHES = [
  { id: 'liga', label: 'Parche de Liga' },
  { id: 'campeon', label: 'Parche de Campeón' },
  { id: 'torneo', label: 'Parche de Torneo' },
]

const STORAGE_KEY = 'chema-personalizar'

export default function CustomizePage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedState] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    } catch {
      return null
    }
  })
  const selectedId = id || savedState?.id || null
  const [size, setSize] = useState(searchParams.get('size') || savedState?.size || 'M')
  const [variant, setVariant] = useState(searchParams.get('variant') || savedState?.variant || 'local')
  const [playerName, setPlayerName] = useState(savedState?.playerName || '')
  const [playerNumber, setPlayerNumber] = useState(savedState?.playerNumber || '')
  const [patches, setPatches] = useState(savedState?.patches || [])

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      if (!selectedId) {
        setProduct(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(selectedId))
        .single()

      if (error) {
        console.error('Error cargando producto:', error)
        setProduct(null)
      } else if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          cat: data.category,
          price: data.price,
          image: data.image_url,
          color: data.color,
          num: data.jersey_num,
        })
      }
      setLoading(false)
    }

    loadProduct()
  }, [selectedId])

  useEffect(() => {
    if (!product) return
    const payload = {
      id: product.id,
      size,
      variant,
      playerName,
      playerNumber,
      patches,
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (error) {
      console.warn('No se pudo guardar la selección en localStorage', error)
    }
  }, [product, size, variant, playerName, playerNumber, patches])

  function togglePatch(id) {
    setPatches(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]))
  }

  if (loading) {
    return (
      <section className="personalize-page">
        <p className="mono">Cargando personalización...</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="personalize-page">
        <div className="page-header">
          <div>
            <h2>Personalizar camiseta</h2>
            <p>Primero elegí un modelo desde el catálogo. Después podrás agregar nombre, número y parches.</p>
          </div>
          <Link to="/" className="btn-primary">Ir al catálogo</Link>
        </div>
      </section>
    )
  }

  const extra =
    (playerName ? CUSTOMIZATION_PRICES.name : 0) +
    (playerNumber ? CUSTOMIZATION_PRICES.number : 0) +
    patches.length * CUSTOMIZATION_PRICES.patch

  const finalPrice = product.price + extra

  function handleAdd() {
    addItem(product, {
      variant,
      size,
      playerName,
      playerNumber: playerNumber.slice(0, 2),
      patches,
    })
    navigate('/carrito')
  }

  return (
    <section className="personalize-page">
      <div className="page-header">
        <div>
          <h2>Personalizar camiseta</h2>
          <p>Elegí todos los extras y guardá tu versión favorita antes de añadir al carrito.</p>
        </div>
        <Link to="/" className="btn-ghost">Volver al catálogo</Link>
      </div>

      <div className="customize-grid">
        <div className="customize-form">
          <div className="product-summary">
            <div className="modal-preview">
              {product.image ? (
                <img src={product.image} alt={product.name} className="card-photo" />
              ) : (
                <JerseySVG color={product.color} num={playerNumber || product.num} stroke={product.stroke} dark={product.dark} />
              )}
            </div>
            <div>
              <h3>{product.name}</h3>
              <p className="modal-cat">{product.cat}</p>
            </div>
          </div>

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
            <label className="modal-label">Tipo de camiseta</label>
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

          <button className="btn-primary" onClick={handleAdd}>
            <span>Añadir al carrito</span>
          </button>
        </div>

        <aside className="customize-summary">
          <div className="summary-card">
            <h3>Resumen</h3>
            <div className="summary-row">
              <span>Producto</span>
              <strong>{product.name}</strong>
            </div>
            <div className="summary-row">
              <span>Talla</span>
              <strong>{size}</strong>
            </div>
            <div className="summary-row">
              <span>Tipo</span>
              <strong>{variant === 'local' ? 'Local' : variant === 'visitante' ? 'Visitante' : 'Tercera'}</strong>
            </div>
            {playerName && (
              <div className="summary-row">
                <span>Nombre</span>
                <strong>{playerName}</strong>
              </div>
            )}
            {playerNumber && (
              <div className="summary-row">
                <span>Número</span>
                <strong>#{playerNumber}</strong>
              </div>
            )}
            {patches.length > 0 && (
              <div className="summary-row">
                <span>Parches</span>
                <strong>{patches.length} seleccionados</strong>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <strong>₡{finalPrice.toLocaleString('es-CR')}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
