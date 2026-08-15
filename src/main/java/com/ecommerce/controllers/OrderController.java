package com.ecommerce.controllers;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.services.OrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    // =====================================================
    // CHECKOUT
    // =====================================================

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        OrderResponse order =
                orderService.checkout(
                        userDetails.getUsername(),
                        request
                );


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order placed successfully",
                        order
                )
        );
    }


    // =====================================================
    // GET MY ORDERS
    // =====================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        List<OrderResponse> orders =
                orderService.getMyOrders(
                        userDetails.getUsername()
                );


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Orders fetched successfully",
                        orders
                )
        );
    }


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        OrderResponse order =
                orderService.getOrderById(
                        userDetails.getUsername(),
                        id
                );


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order fetched successfully",
                        order
                )
        );
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        OrderResponse order =
                orderService.cancelOrder(
                        userDetails.getUsername(),
                        id
                );


        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order cancelled successfully",
                        order
                )
        );
    }
}