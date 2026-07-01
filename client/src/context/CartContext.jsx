import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i._id === action.product._id);
      if (existing) {
        return state.map((i) =>
          i._id === action.product._id
            ? { ...i, quantity: i.quantity + action.quantity }
            : i
        );
      }
      return [...state, { ...action.product, quantity: action.quantity }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i._id !== action.productId);
    case 'UPDATE_QUANTITY':
      return state.map((i) =>
        i._id === action.productId ? { ...i, quantity: action.quantity } : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

function loadCart() {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product, quantity = 1) {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  }

  function removeFromCart(productId) {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }

  function updateQuantity(productId, quantity) {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
