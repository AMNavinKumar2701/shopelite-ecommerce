import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiEdit, FiTrash2, FiPlus, FiSearch, FiStar } from 'react-icons/fi';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '', price: '', description: '', category: '', image: ''
  });

  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      return;
    }
    try {
      await api.put(`/cart/add/${productId}`);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, {
          ...formData,
          price: Number(formData.price)
        });
        toast.success('Product updated!');
      } else {
        await api.post('/products', {
          ...formData,
          price: Number(formData.price)
        });
        toast.success('Product created!');
      }
      setShowModal(false);
      setEditProduct(null);
      setFormData({ title: '', price: '', description: '', category: '', image: '' });
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      image: product.image || ''
    });
    setShowModal(true);
  };

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || p.category === category;
    return matchSearch && matchCategory;
  });

  const renderStars = (rate) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          style={{
            fill: i <= Math.round(rate || 0) ? '#ffd93d' : 'none',
            color: '#ffd93d',
            fontSize: '14px'
          }}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">
            <span className="gradient-text">Products</span>
          </h1>
          <p className="page-subtitle">{filtered.length} products available</p>
        </div>

        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditProduct(null);
              setFormData({ title: '', price: '', description: '', category: '', image: '' });
              setShowModal(true);
            }}
          >
            <FiPlus /> Add Product
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <select
          className="form-input"
          style={{ width: 'auto', minWidth: 160 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-title">No products found</p>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product, index) => (
            <div
              key={product._id || product.id}
              className="glass-card product-card slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="product-image-wrapper">
                {product.image ? (
                  <img src={product.image} alt={product.title} />
                ) : (
                  <div style={{ fontSize: '3rem', opacity: 0.3 }}>📷</div>
                )}
              </div>

              <div className="product-info">
                {product.category && (
                  <div className="product-category">{product.category}</div>
                )}
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">${product.price?.toFixed(2)}</div>
                {product.rating && (
                  <div className="product-rating">
                    <span className="stars">{renderStars(product.rating.rate)}</span>
                    <span>({product.rating.count || 0})</span>
                  </div>
                )}
              </div>

              <div className="product-actions">
                {!isAdmin && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => addToCart(product.id)}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => openEditModal(product)}
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-card"
            style={{ width: '100%', maxWidth: 500, padding: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 24, fontWeight: 700 }}>
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleCreateOrUpdate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  className="form-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;