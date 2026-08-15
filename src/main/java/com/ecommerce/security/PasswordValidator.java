package com.ecommerce.security;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator
        implements ConstraintValidator<ValidPassword, String> {

    @Override
    public boolean isValid(
            String password,
            ConstraintValidatorContext context
    ) {

        if (password == null || password.isBlank()) {
            return false;
        }

        // Minimum 8 characters
        if (password.length() < 8) {
            return false;
        }

        // At least one uppercase
        if (!password.matches(".*[A-Z].*")) {
            return false;
        }

        // At least one lowercase
        if (!password.matches(".*[a-z].*")) {
            return false;
        }

        // At least one number
        if (!password.matches(".*[0-9].*")) {
            return false;
        }

        // At least one special character
        if (!password.matches(".*[^a-zA-Z0-9].*")) {
            return false;
        }

        // No consecutive numbers
        for (int i = 0; i < password.length() - 1; i++) {

            char current = password.charAt(i);
            char next = password.charAt(i + 1);

            if (Character.isDigit(current)
                    && Character.isDigit(next)) {

                return false;
            }
        }

        return true;
    }
}