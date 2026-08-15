package com.ecommerce.controllers;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;


    // ==========================================
    // GET MY CART
    // ==========================================

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        CartResponse cart =
                cartService.getCart(
                        userDetails.getUsername()
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Cart fetched successfully",
                        cart
                )
        );
    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        CartResponse cart =
                cartService.addToCart(
                        userDetails.getUsername(),
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product added to cart",
                        cart
                )
        );
    }


    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        CartResponse cart =
                cartService.updateQuantity(
                        userDetails.getUsername(),
                        cartItemId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Cart quantity updated",
                        cart
                )
        );
    }


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        CartResponse cart =
                cartService.removeFromCart(
                        userDetails.getUsername(),
                        cartItemId
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product removed from cart",
                        cart
                )
        );
    }


    // ==========================================
    // CLEAR CART
    // ==========================================

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        cartService.clearCart(
                userDetails.getUsername()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Cart cleared",
                        "Cart is now empty"
                )
        );
    }
}