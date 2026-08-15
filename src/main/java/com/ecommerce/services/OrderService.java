package com.ecommerce.services;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.OrderItemResponse;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.entities.Cart;
import com.ecommerce.entities.CartItem;
import com.ecommerce.entities.Order;
import com.ecommerce.entities.OrderItem;
import com.ecommerce.entities.User;
import com.ecommerce.repositories.CartRepository;
import com.ecommerce.repositories.OrderRepository;
import com.ecommerce.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;


    // =====================================================
    // CHECKOUT
    // =====================================================

    @Transactional
    public OrderResponse checkout(
            String userEmail,
            CheckoutRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        // -------------------------------------------------
        // Get cart
        // -------------------------------------------------

        Cart cart =
                cartRepository
                        .findByUser(user)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Cart not found"
                                )
                        );


        // -------------------------------------------------
        // Check cart
        // -------------------------------------------------

        if (cart.getItems() == null ||
                cart.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }


        // -------------------------------------------------
        // Calculate total
        // -------------------------------------------------

        double totalAmount =
                cart.getItems()
                        .stream()
                        .mapToDouble(
                                item ->
                                        item.getProduct().getPrice()
                                                * item.getQuantity()
                        )
                        .sum();


        // -------------------------------------------------
        // Create order
        // -------------------------------------------------

        Order order =
                Order.builder()
                        .user(user)
                        .totalAmount(totalAmount)
                        .status("CONFIRMED")
                        .shippingAddress(
                                request.getShippingAddress()
                        )
                        .build();


        // -------------------------------------------------
        // Create order items
        // -------------------------------------------------

        List<OrderItem> orderItems =
                cart.getItems()
                        .stream()
                        .map(cartItem -> {

                            OrderItem orderItem =
                                    OrderItem.builder()
                                            .order(order)
                                            .product(
                                                    cartItem.getProduct()
                                            )
                                            .quantity(
                                                    cartItem.getQuantity()
                                            )
                                            .priceAtPurchase(
                                                    cartItem
                                                            .getProduct()
                                                            .getPrice()
                                            )
                                            .build();

                            return orderItem;
                        })
                        .collect(Collectors.toList());


        order.setItems(orderItems);


        // -------------------------------------------------
        // Save order
        // -------------------------------------------------

        Order savedOrder =
                orderRepository.save(order);


        // -------------------------------------------------
        // Clear cart
        // -------------------------------------------------

        cart.getItems().clear();

        cartRepository.save(cart);


        // -------------------------------------------------
        // Return response
        // -------------------------------------------------

        return mapToResponse(savedOrder);
    }


    // =====================================================
    // GET MY ORDERS
    // =====================================================

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(
            String userEmail
    ) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        List<Order> orders =
                orderRepository.findByUser(user);


        return orders
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(
            String userEmail,
            Long orderId
    ) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        // Security check
        if (!order.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to view this order"
            );
        }


        return mapToResponse(order);
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @Transactional
    public OrderResponse cancelOrder(
            String userEmail,
            Long orderId
    ) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        // Security check
        if (!order.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to cancel this order"
            );
        }


        // Cannot cancel completed orders
        if ("SHIPPED".equals(order.getStatus())
                || "DELIVERED".equals(order.getStatus())
                || "CANCELLED".equals(order.getStatus())) {

            throw new RuntimeException(
                    "Order cannot be cancelled"
            );
        }


        order.setStatus("CANCELLED");


        Order savedOrder =
                orderRepository.save(order);


        return mapToResponse(savedOrder);
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private OrderResponse mapToResponse(
            Order order
    ) {

        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item -> {

                            double subtotal =
                                    item.getPriceAtPurchase()
                                            * item.getQuantity();


                            return OrderItemResponse.builder()
                                    .id(item.getId())
                                    .productId(
                                            item.getProduct().getId()
                                    )
                                    .productName(
                                            item.getProduct().getName()
                                    )
                                    .quantity(
                                            item.getQuantity()
                                    )
                                    .priceAtPurchase(
                                            item.getPriceAtPurchase()
                                    )
                                    .subtotal(subtotal)
                                    .build();
                        })
                        .collect(Collectors.toList());


        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .shippingAddress(
                        order.getShippingAddress()
                )
                .items(items)
                .build();
    }
}