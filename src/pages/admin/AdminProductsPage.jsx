import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient.js'

const initialForm = {
  name: '',
  category: '',
  price: '',
  image_url: '',
  color: '#000000',
  jersey_num: '',
  stock: '',
  active: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (error) {
      setMessage('No se pudieron cargar los productos.')
      return
    }
    setProducts(data || [])
  }

  function openNew() {
    setShowForm(true)
    setEditingId(null)
    setForm(initialForm)
    setImageFile(null)
    setImagePreview(null)
    setMessage('')
  }

  function openEdit(product) {
    setShowForm(true)
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      color: product.color || '#000000',
      jersey_num: product.jersey_num,
      stock: product.stock,
      active: product.active,
    })
    setImageFile(null)
    setImagePreview(product.image_url || null)
    setMessage('')
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadProductImage(file) {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: publicData, error: publicError } = await supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    if (publicError) {
      throw publicError
    }

    return publicData.publicUrl
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    let imageUrl = form.image_url

    if (imageFile) {
      try {
        setImageUploading(true)
        imageUrl = await uploadProductImage(imageFile)
      } catch (uploadError) {
        setSaving(false)
        setImageUploading(false)
        setMessage('No se pudo subir la imagen.')
        return
      } finally {
        setImageUploading(false)
      }
    }

    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      image_url: imageUrl,
      color: form.color,
      jersey_num: form.jersey_num,
      stock: Number(form.stock),
      active: form.active,
    }

    let error = null
    if (editingId) {
      const res = await supabase.from('products').update(payload).eq('id', editingId)
      error = res.error
    } else {
      const res = await supabase.from('products').insert(payload)
      error = res.error
    }

    setSaving(false)
    if (error) {
      setMessage('No se pudo guardar el producto.')
      return
    }

    setImageFile(null)
    setImagePreview(null)
    setMessage(`Producto ${editingId ? 'actualizado' : 'creado'} con éxito.`)
    setShowForm(false)
    loadProducts()
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`¿Eliminar el producto ${product.name}?`)
    if (!confirmed) return

    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      setMessage('No se pudo eliminar el producto.')
      return
    }

    setMessage('Producto eliminado.')
    loadProducts()
  }

  async function toggleActive(product) {
    const { error } = await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    if (error) {
      setMessage('No se pudo cambiar el estado del producto.')
      return
    }

    loadProducts()
  }

  return (
    <section className="admin-products">
      <div className="admin-page-header">
        <div>
          <h2>Productos</h2>
          <p>Administra el catálogo de camisolas, activa o inactiva artículos y gestiona stock.</p>
        </div>
        <button className="btn-primary" onClick={openNew}>Agregar producto</button>
      </div>

      {message && <p className="form-error">{message}</p>}

      {showForm && (
        <form onSubmit={handleSave} className="admin-form">
          <div className="checkout-form">
            <label>
              Nombre
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Categoría
              <input name="category" value={form.category} onChange={handleChange} required />
            </label>
            <label>
              Precio
              <input name="price" type="number" value={form.price} onChange={handleChange} min="0" step="0.01" required />
            </label>
            {imagePreview && (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Vista previa" className="image-preview" />
              </div>
            )}
            <label>
              Imagen del producto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </label>
            <label>
              Color
              <input name="color" type="color" value={form.color} onChange={handleChange} />
            </label>
            <label>
              Número de camiseta
              <input name="jersey_num" value={form.jersey_num} onChange={handleChange} />
            </label>
            <label>
              Stock
              <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" required />
            </label>
            <label className="admin-checkbox">
              <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
              Activo
            </label>
          </div>

          <div className="admin-form-actions">
            <button className="btn-primary" type="submit" disabled={saving}>
              {imageUploading
                ? 'Subiendo imagen...'
                : saving
                ? 'Guardando...'
                : editingId
                ? 'Actualizar producto'
                : 'Crear producto'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setShowForm(false)
                setImageFile(null)
                setImagePreview(null)
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <section className="empty-state">
          <h2>Cargando productos...</h2>
        </section>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td className="mono">₡{product.price?.toLocaleString('es-CR')}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="admin-actions-row">
                    <button className="method-btn" type="button" onClick={() => openEdit(product)}>Editar</button>
                    <button className="method-btn" type="button" onClick={() => toggleActive(product)}>
                      {product.active ? 'Inactivar' : 'Activar'}
                    </button>
                    <button className="method-btn" type="button" onClick={() => handleDelete(product)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
