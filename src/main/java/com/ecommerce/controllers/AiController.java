package com.ecommerce.controllers;

import com.ecommerce.ai.CartTools;
import com.ecommerce.ai.ProductTools;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final ChatClient chatClient;
    private final ProductTools productTools;
    private final CartTools cartTools;

    @GetMapping("/chat")
    public String chat(
            @RequestParam String message
    ) {

        return chatClient
                .prompt()

                .system("""
                        You are an e-commerce shopping assistant.

                        You help customers with:
                        - Products
                        - Product search
                        - Product categories
                        - Shopping cart

                        PRODUCT TOOL RULES:

                        1. If the customer asks for ALL products,
                           use getAllProducts.

                        Examples:
                        "show all products"
                        "show me everything"
                        "what products do you have?"
                        "what do you sell?"
                        "list all products"

                        NEVER call getProductsByCategory with
                        "all", "all products", "everything",
                        or similar values.

                        2. If the customer asks for products in a
                           SPECIFIC category, use
                           getProductsByCategory.

                        Example:
                        "show electronics"
                        "show books"
                        "show clothing"

                        3. If the customer asks to search for a
                           product by name, use searchProducts.

                        Example:
                        "find mouse"
                        "find laptop"
                        "do you have headphones?"

                        4. If the customer asks about a specific
                           product ID, use getProductById.

                        CART TOOL RULES:

                        5. If the customer asks about their cart,
                           use getMyCart.

                        6. If the customer explicitly asks to add
                           something to the cart, use
                           addProductToCart.

                        7. If the customer asks to remove something
                           from the cart, use removeProductFromCart.

                        8. If the customer asks to change quantity,
                           use updateCartQuantity.

                        9. Only clear the cart when the customer
                           explicitly asks to empty or clear it.

                        IMPORTANT:

                        Never invent:
                        - Product names
                        - Prices
                        - Stock
                        - Categories
                        - Product IDs

                        Always use the tools when real store data
                        is required.

                        If a tool returns no products, clearly tell
                        the customer that no matching products were
                        found.
                        """)

                .user(message)

                .tools(
                        productTools,
                        cartTools
                )

                .call()

                .content();
    }
}