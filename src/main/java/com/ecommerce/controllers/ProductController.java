package com.ecommerce.controllers;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entities.Product;
import com.ecommerce.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ── GET /api/products/all ── PUBLIC
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.success("Products fetched", productService.getAllProducts()));
    }

    // ── GET /api/products/{id} ── PUBLIC
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product fetched", productService.getProductById(id)));
    }

    // ── GET /api/products/search?name=shoes ── PUBLIC
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Product>>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success("Search results", productService.searchProducts(name)));
    }

    // ── GET /api/products/category/{category} ── PUBLIC
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Product>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success("Products by category", productService.getProductsByCategory(category)));
    }

    // ── POST /api/products/add ── ADMIN ONLY
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> addProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product added", productService.addProduct(request)));
    }

    // ── PUT /api/products/update/{id} ── ADMIN ONLY
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", productService.updateProduct(id, request)));
    }

    // ── DELETE /api/products/delete/{id} ── ADMIN ONLY
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", "Product with id " + id + " deleted"));
    }
}
