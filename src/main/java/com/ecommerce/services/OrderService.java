package com.ecommerce.services;

import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entities.*;
import com.ecommerce.repositories.OrderRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ── Place a new order ──
    @Transactional
    public Order placeOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        // Build order items and calculate total
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            // Check stock
            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            orderItems.add(item);
            totalAmount += product.getPrice() * itemReq.getQuantity();
        }

        // Build and save order
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .build();

        order = orderRepository.save(order);

        // Link items to order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);

        return orderRepository.save(order);
    }

    // ── Get orders for a specific user ──
    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    // ── Get single order ──
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    // ── Get all orders (ADMIN only) ──
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ── Update order status (ADMIN only) ──
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // ── Cancel order ──
    public Order cancelOrder(Long orderId, String userEmail) {
        Order order = getOrderById(orderId);

        // Verify the order belongs to this user
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        if (order.getStatus().equals("SHIPPED") || order.getStatus().equals("DELIVERED")) {
            throw new RuntimeException("Cannot cancel order that is already " + order.getStatus());
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
