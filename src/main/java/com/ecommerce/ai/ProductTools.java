package com.ecommerce.ai;

import com.ecommerce.entities.Product;
import com.ecommerce.repositories.ProductRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductTools {

    private final ProductRepository productRepository;

    public ProductTools(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    @Tool(
            name = "getAllProducts",
            description = """
                    Get all products currently available in the
                    e-commerce store.

                    Use this when the customer asks:
                    - Show me all products
                    - What products do you have?
                    - Show all products
                    - List all products
                    - What do you sell?
                    - Show me everything
                    - Give me all products

                    Do NOT use a category for this request.
                    """
    )
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    // =====================================================
    // SEARCH PRODUCTS BY NAME
    // =====================================================

    @Tool(
            name = "searchProducts",
            description = """
                    Search for products by their name.

                    Use this when the customer asks for a
                    specific product or product name.

                    Examples:
                    - Find me a mouse
                    - Search for laptop
                    - Do you have headphones?
                    - Show me wireless mouse
                    """
    )
    public List<Product> searchProducts(String name) {

        return productRepository
                .findByNameContainingIgnoreCase(name);
    }

    // =====================================================
    // GET PRODUCTS BY CATEGORY
    // =====================================================

    @Tool(
            name = "getProductsByCategory",
            description = """
                    Get products belonging to a SPECIFIC product
                    category.

                    Only use this tool when the customer provides
                    an actual category such as:
                    - Electronics
                    - Clothing
                    - Books
                    - Shoes

                    Do NOT use this tool for:
                    - all products
                    - everything
                    - all
                    - what do you have
                    - show me everything
                    """
    )
    public List<Product> getProductsByCategory(String category) {

        return productRepository
                .findByCategory(category);
    }

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    @Tool(
            name = "getProductById",
            description = """
                    Get a specific product using its product ID.

                    Use this when the customer provides or refers
                    to a product ID.
                    """
    )
    public Product getProductById(Long id) {

        return productRepository
                .findById(id)
                .orElse(null);
    }
}