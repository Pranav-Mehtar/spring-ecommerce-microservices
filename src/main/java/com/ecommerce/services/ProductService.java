package com.ecommerce.services;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entities.Product;
import com.ecommerce.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // ── Get all products ──
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ── Get product by ID ──
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // ── Get products by category ──
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // ── Search products by name ──
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // ── Add product (ADMIN only) ──
    public Product addProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();
        return productRepository.save(product);
    }

    // ── Update product (ADMIN only) ──
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        return productRepository.save(product);
    }

    // ── Delete product (ADMIN only) ──
    public void deleteProduct(Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.deleteById(id);
    }
}
