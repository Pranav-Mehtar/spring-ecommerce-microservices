package com.ecommerce.services;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.entities.Cart;
import com.ecommerce.entities.CartItem;
import com.ecommerce.entities.Product;
import com.ecommerce.entities.User;
import com.ecommerce.repositories.CartItemRepository;
import com.ecommerce.repositories.CartRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    // ==========================================
    // GET CART
    // ==========================================

    @Transactional
    public CartResponse getCart(String userEmail) {

        User user = getUser(userEmail);

        Cart cart = getOrCreateCart(user);

        return mapToResponse(cart);
    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    @Transactional
    public CartResponse addToCart(
            String userEmail,
            AddToCartRequest request
    ) {

        User user = getUser(userEmail);

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: "
                                        + request.getProductId()
                        )
                );

        // Check stock
        if (product.getStock() < request.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient stock for product: "
                            + product.getName()
            );
        }

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository
                        .findByCartAndProduct(
                                cart,
                                product
                        )
                        .orElse(null);

        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity()
                            + request.getQuantity();

            if (newQuantity > product.getStock()) {

                throw new RuntimeException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem.setQuantity(newQuantity);

            cartItemRepository.save(cartItem);

        } else {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();

            cartItemRepository.save(cartItem);
        }

        return mapToResponse(cart);
    }


    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    @Transactional
    public CartResponse updateQuantity(
            String userEmail,
            Long cartItemId,
            UpdateCartItemRequest request
    ) {

        User user = getUser(userEmail);

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository
                        .findByIdAndCart(
                                cartItemId,
                                cart
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        Product product = cartItem.getProduct();

        if (request.getQuantity() > product.getStock()) {

            throw new RuntimeException(
                    "Requested quantity exceeds available stock"
            );
        }

        cartItem.setQuantity(
                request.getQuantity()
        );

        cartItemRepository.save(cartItem);

        return mapToResponse(cart);
    }


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    @Transactional
    public CartResponse removeFromCart(
            String userEmail,
            Long cartItemId
    ) {

        User user = getUser(userEmail);

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository
                        .findByIdAndCart(
                                cartItemId,
                                cart
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        // Remove from the cart collection FIRST
        cart.getItems().remove(cartItem);

        // Delete from database
        cartItemRepository.delete(cartItem);

        // Save cart
        cartRepository.save(cart);

        // Return the UPDATED cart
        return mapToResponse(cart);
    }


    // ==========================================
    // CLEAR CART
    // ==========================================

    @Transactional
    public void clearCart(String userEmail) {

        User user = getUser(userEmail);

        Cart cart = getOrCreateCart(user);

        // Remove all items from the collection
        cart.getItems().clear();

        // Delete all cart items from database
        cartItemRepository.deleteAll(
                cartItemRepository.findByCart(cart)
        );

        cartRepository.save(cart);
    }


    // ==========================================
    // GET OR CREATE CART
    // ==========================================

    private Cart getOrCreateCart(User user) {

        return cartRepository
                .findByUser(user)
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(cart);
                });
    }


    // ==========================================
    // GET USER
    // ==========================================

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private CartResponse mapToResponse(Cart cart) {

        List<CartItemResponse> items =
                cart.getItems()
                        .stream()
                        .map(item -> {

                            double subtotal =
                                    item.getProduct().getPrice()
                                            * item.getQuantity();

                            return CartItemResponse.builder()
                                    .id(item.getId())
                                    .productId(
                                            item.getProduct().getId()
                                    )
                                    .productName(
                                            item.getProduct().getName()
                                    )
                                    .price(
                                            item.getProduct().getPrice()
                                    )
                                    .quantity(
                                            item.getQuantity()
                                    )
                                    .subtotal(subtotal)
                                    .build();
                        })
                        .collect(Collectors.toList());

        double totalAmount =
                items.stream()
                        .mapToDouble(
                                CartItemResponse::getSubtotal
                        )
                        .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }
}