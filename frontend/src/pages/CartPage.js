import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId) => {
    try {
      const response = await api.put(`/cart/add/${productId}`);
      setCart(response.data.data || response.data);
      toast.success('Quantity increased');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCart(response.data.data || response.data);
      toast.success('Quantity decreased');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const items = cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Shopping Cart</span>
        </h1>
        <p className="page-subtitle">{totalItems} items in your cart</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p className="empty-state-title">Your cart is empty</p>
          <p style={{ marginBottom: 24 }}>Start shopping to add items to your cart.</p>
          <Link to="/" className="btn btn-primary">
            <FiShoppingBag /> Browse Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          <div>
            {items.map((item, index) => (
              <div
                key={item._id || index}
                className="glass-card cart-item slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <div style={{ fontSize: '2rem', opacity: 0.3 }}>📷</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">${item.price?.toFixed(2)}</div>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      removeItem(item.product?.id || item.productId || item.product);
                    }}
                    title="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: 24, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => addItem(item.product?.id || item.productId || item.product)}
                    title="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div style={{ fontWeight: 700, minWidth: 80, textAlign: 'right', color: 'var(--success)' }}>
                  ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card cart-summary" style={{ position: 'sticky', top: 100 }}>
            <h3 style={{ marginBottom: 20, fontWeight: 700, fontSize: '1.1rem' }}>Order Summary</h3>

            <div className="cart-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Items ({totalItems})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="cart-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>

            <div className="cart-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Tax (est.)</span>
              <span>${(totalPrice * 0.08).toFixed(2)}</span>
            </div>

            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span className="gradient-text">${(totalPrice + totalPrice * 0.08).toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 20, padding: '14px 24px' }}
              onClick={() => toast.success('Checkout feature coming soon!')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;