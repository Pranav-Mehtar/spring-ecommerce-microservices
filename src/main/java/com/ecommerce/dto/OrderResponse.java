package com.ecommerce.dto;

import com.ecommerce.dto.OrderItemResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;

    private Double totalAmount;

    private String status;

    private LocalDateTime createdAt;

    private String shippingAddress;

    private List<OrderItemResponse> items;
}