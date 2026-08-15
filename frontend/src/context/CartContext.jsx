import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // UPDATE CART STATE
  // ==========================================

  const updateCartState = (cartData) => {

    setCart(cartData?.items || []);

    setCartTotal(cartData?.totalAmount || 0);
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {

    try {

      setLoading(true);

      const response = await api.get("/api/cart");

      console.log(
        "Cart response:",
        response.data
      );

      const cartData = response.data.data;

      updateCartState(cartData);

    } catch (error) {

      console.error(
        "Failed to load cart:",
        error
      );

      setCart([]);
      setCartTotal(0);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (
    productId,
    quantity = 1
  ) => {

    try {

      const response = await api.post(
        "/api/cart/add",
        {
          productId,
          quantity,
        }
      );

      console.log(
        "Add cart response:",
        response.data
      );

      const cartData = response.data.data;

      updateCartState(cartData);

      return response.data;

    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );

      throw error;
    }
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = async (
    cartItemId,
    quantity
  ) => {

    try {

      const response = await api.put(
        `/api/cart/item/${cartItemId}`,
        {
          quantity,
        }
      );

      console.log(
        "Update cart response:",
        response.data
      );

      const cartData = response.data.data;

      updateCartState(cartData);

      return response.data;

    } catch (error) {

      console.error(
        "Update cart error:",
        error
      );

      throw error;
    }
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

const removeFromCart = async (cartItemId) => {
  try {
    console.log("Removing cart item:", cartItemId);

    const response = await api.delete(
      `/api/cart/item/${cartItemId}`
    );

    console.log("Remove response:", response.data);

    const updatedCart = response.data.data;

    console.log("Updated cart:", updatedCart);

    // IMPORTANT
    setCart(updatedCart.items || []);

    setCartTotal(updatedCart.totalAmount || 0);

    return response.data;

  } catch (error) {
    console.error("Remove from cart error:", error);
    throw error;
  }
};

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {

    try {

      const response = await api.delete(
        "/api/cart/clear"
      );

      console.log(
        "Clear cart response:",
        response.data
      );

      setCart([]);
      setCartTotal(0);

      return response.data;

    } catch (error) {

      console.error(
        "Clear cart error:",
        error
      );

      throw error;
    }
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = async (
    cartItemId,
    currentQuantity
  ) => {

    await updateQuantity(
      cartItemId,
      currentQuantity + 1
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = async (
    cartItemId,
    currentQuantity
  ) => {

    if (currentQuantity <= 1) {

      await removeFromCart(
        cartItemId
      );

      return;
    }

    await updateQuantity(
      cartItemId,
      currentQuantity - 1
    );
  };

  // ==========================================
  // LOAD CART ONCE
  // ==========================================

  useEffect(() => {

    loadCart();

  }, []);

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        loading,

        loadCart,

        addToCart,

        updateQuantity,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useCart = () =>
  useContext(CartContext);