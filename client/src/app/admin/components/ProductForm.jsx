'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import styles from '../products/Products.module.css';

export default function ProductForm({ product, onSubmit, onCancel, categories }) {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      category: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      rating: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'rating'
        ? parseFloat(value) || ''
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className={styles.formContainer}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 className={styles.formTitle}>
            {product ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Product Name *</label>
              <input
                type="text"
                name="name"
                className={styles.formInput}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Wireless Headphones"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category *</label>
              <select
                name="category"
                className={styles.formSelect}
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price ($) *</label>
              <input
                type="number"
                name="price"
                className={styles.formInput}
                value={formData.price}
                onChange={handleChange}
                placeholder="9999"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Original Price ($)</label>
              <input
                type="number"
                name="originalPrice"
                className={styles.formInput}
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="12999"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stock *</label>
              <input
                type="number"
                name="stock"
                className={styles.formInput}
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                className={styles.formInput}
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                name="description"
                className={styles.formTextarea}
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
              />
            </div>
          </div>

          <div className={styles.formButtons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
