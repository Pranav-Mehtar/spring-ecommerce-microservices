package com.ecommerce.ai;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.services.CartService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CartTools {

    private final CartService cartService;

    public CartTools(CartService cartService) {
        this.cartService = cartService;
    }

    // =====================================================
    // GET CURRENT USER
    // =====================================================

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }

    // =====================================================
    // GET MY CART
    // =====================================================

    @Tool(
            name = "getMyCart",
            description = """
                    Get the shopping cart of the currently
                    logged-in user.

                    Use this when the customer asks:
                    - What is in my cart?
                    - Show my cart
                    - What products have I added?
                    - How much is my cart total?
                    """
    )
    public CartResponse getMyCart() {

        String email =
                getCurrentUserEmail();

        return cartService.getCart(email);
    }

    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================

    @Tool(
            name = "addProductToCart",
            description = """
                    Add a product to the currently logged-in
                    user's shopping cart.

                    Use this when the customer explicitly asks
                    to add a product to their cart.

                    The product ID and quantity are required.
                    """
    )
    public CartResponse addProductToCart(
            Long productId,
            Integer quantity
    ) {

        String email =
                getCurrentUserEmail();

        AddToCartRequest request =
                new AddToCartRequest();

        request.setProductId(productId);
        request.setQuantity(quantity);

        return cartService.addToCart(
                email,
                request
        );
    }

    // =====================================================
    // UPDATE CART QUANTITY
    // =====================================================

    @Tool(
            name = "updateCartQuantity",
            description = """
                    Change the quantity of a product already
                    present in the currently logged-in user's cart.

                    Use this when the customer asks to change,
                    increase, or decrease the quantity.
                    """
    )
    public CartResponse updateCartQuantity(
            Long cartItemId,
            Integer quantity
    ) {

        String email =
                getCurrentUserEmail();

        UpdateCartItemRequest request =
                new UpdateCartItemRequest();

        request.setQuantity(quantity);

        return cartService.updateQuantity(
                email,
                cartItemId,
                request
        );
    }

    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    @Tool(
            name = "removeProductFromCart",
            description = """
                    Remove a product from the currently logged-in
                    user's shopping cart.

                    Use this when the customer explicitly asks
                    to remove an item from their cart.
                    """
    )
    public CartResponse removeProductFromCart(
            Long cartItemId
    ) {

        String email =
                getCurrentUserEmail();

        return cartService.removeFromCart(
                email,
                cartItemId
        );
    }

    // =====================================================
    // CLEAR CART
    // =====================================================

    @Tool(
            name = "clearMyCart",
            description = """
                    Remove all products from the currently
                    logged-in user's shopping cart.

                    Use this only when the customer explicitly
                    asks to empty or clear their cart.
                    """
    )
    public String clearMyCart() {

        String email =
                getCurrentUserEmail();

        cartService.clearCart(email);

        return "Cart cleared successfully.";
    }
}