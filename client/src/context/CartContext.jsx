'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateTieredPrice } from '@/data/products';

const CartContext = createContext(null);

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist to localStorage with migration from old "Precious Play" keys
  useEffect(() => {
    try {
      let saved = localStorage.getItem('pepta_wholesale_cart');
      
      // If not found, check for old "Precious Play" key and migrate
      if (!saved) {
        const oldKey = localStorage.getItem('precious_wholesale_cart');
        if (oldKey) {
          // Migrate old key to new key
          localStorage.setItem('pepta_wholesale_cart', oldKey);
          localStorage.removeItem('precious_wholesale_cart');
          saved = oldKey;
        }
      }

      if (saved) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      }
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pepta_wholesale_cart', JSON.stringify(state.items));
    } catch (e) { /* ignore */ }
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  
  // B2B Wholesale Calculations - Use tiered pricing for bulk discounts
  const totalPrice = state.items.reduce((sum, i) => {
    // For products with tieredPricing, calculate price based on quantity
    const unitPrice = i.tieredPricing 
      ? calculateTieredPrice(i, i.quantity) 
      : i.price;
    return sum + (unitPrice * i.quantity);
  }, 0);

  // Calculate subtotal (original prices)
  const subtotal = state.items.reduce((sum, i) => sum + (i.originalPrice * i.quantity), 0);
  
  // Bulk savings from tiered pricing
  const savings = subtotal - totalPrice;
  
  // Check MOQ compliance for B2B
  const moqViolations = state.items.filter(i => i.moq && i.quantity < i.moq);
  const isValidOrder = moqViolations.length === 0;

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      subtotal,
      savings,
      moqViolations,
      isValidOrder,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
