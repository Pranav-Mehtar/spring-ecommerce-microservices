package com.ecommerce.security;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({
        ElementType.FIELD,
        ElementType.PARAMETER,
        ElementType.ANNOTATION_TYPE
})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default
            "Password must contain at least 8 characters, " +
                    "one uppercase letter, one lowercase letter, " +
                    "one number, one special character, " +
                    "and must not contain consecutive numbers";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}