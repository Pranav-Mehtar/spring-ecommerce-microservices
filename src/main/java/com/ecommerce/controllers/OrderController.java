package com.ecommerce.controllers;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entities.Order;
import com.ecommerce.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ── POST /api/orders/place ── USER
    // Place a new order (JWT required)
    @PostMapping("/place")
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.placeOrder(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    // ── GET /api/orders/my-orders ── USER
    // Get current user's orders
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Order> orders = orderService.getUserOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Your orders", orders));
    }

    // ── GET /api/orders/{id} ── USER/ADMIN
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order details", orderService.getOrderById(id)));
    }

    // ── PUT /api/orders/cancel/{id} ── USER
    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.cancelOrder(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", order));
    }

    // ── GET /api/orders/admin/all ── ADMIN ONLY
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("All orders", orderService.getAllOrders()));
    }

    // ── PUT /api/orders/admin/status/{id} ── ADMIN ONLY
    @PutMapping("/admin/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }
}
