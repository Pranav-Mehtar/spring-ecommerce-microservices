package com.ecommerce.controllers;

import com.ecommerce.dto.*;
import com.ecommerce.entities.User;
import com.ecommerce.repositories.UserRepository;
import com.ecommerce.services.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final UserRepository userRepository;


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        AuthResponse response =
                authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Registered successfully",
                        response
                )
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthResponse response =
                authService.login(request);

        ResponseCookie accessCookie =
                ResponseCookie
                        .from(
                                "jwt",
                                response.getToken()
                        )
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(15 * 60)
                        .sameSite("Lax")
                        .build();

        ResponseCookie refreshCookie =
                ResponseCookie
                        .from(
                                "refreshToken",
                                response.getRefreshToken()
                        )
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(7 * 24 * 60 * 60)
                        .sameSite("Lax")
                        .build();

        response.setToken(null);
        response.setRefreshToken(null);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        accessCookie.toString()
                )
                .header(
                        HttpHeaders.SET_COOKIE,
                        refreshCookie.toString()
                )
                .body(
                        ApiResponse.success(
                                "Login successful",
                                response
                        )
                );
    }


    // =====================================================
    // REFRESH TOKEN
    // =====================================================

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refreshToken(
            @CookieValue(
                    name = "refreshToken",
                    required = false
            )
            String refreshToken
    ) {

        AuthResponse response =
                authService.refreshAccessToken(
                        refreshToken
                );

        ResponseCookie accessCookie =
                ResponseCookie
                        .from(
                                "jwt",
                                response.getToken()
                        )
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(15 * 60)
                        .sameSite("Lax")
                        .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        accessCookie.toString()
                )
                .body(
                        ApiResponse.success(
                                "Access token refreshed",
                                "Token refreshed successfully"
                        )
                );
    }


    // =====================================================
    // CURRENT USER
    // =====================================================

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>>
    getCurrentUser(
            @AuthenticationPrincipal
            UserDetails userDetails
    ) {

        if (userDetails == null) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        User user =
                userRepository
                        .findByEmail(
                                userDetails.getUsername()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        UserResponse response =
                UserResponse.builder()
                        .id(user.getId())
                        .name(user.getFullName())
                        .email(user.getEmail())
                        .build();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Current user",
                        response
                )
        );
    }


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>>
    forgotPassword(
            @Valid
            @RequestBody
            ForgotPasswordRequest request
    ) {

        String resetToken =
                authService.forgotPassword(request);

        // DEVELOPMENT ONLY
        // In production send this through email.
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Password reset token generated",
                        resetToken
                )
        );
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>>
    resetPassword(
            @Valid
            @RequestBody
            ResetPasswordRequest request
    ) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Password reset successful",
                        "You can now login with your new password"
                )
        );
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>>
    logout(
            HttpServletResponse response
    ) {

        ResponseCookie accessCookie =
                ResponseCookie
                        .from("jwt", "")
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(0)
                        .sameSite("Lax")
                        .build();

        ResponseCookie refreshCookie =
                ResponseCookie
                        .from("refreshToken", "")
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(0)
                        .sameSite("Lax")
                        .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                accessCookie.toString()
        );

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                refreshCookie.toString()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Logout successful",
                        "User logged out"
                )
        );
    }


    // =====================================================
    // REGISTER ADMIN
    // =====================================================

    @PostMapping("/register-admin")
    public ResponseEntity<ApiResponse<AuthResponse>>
    registerAdmin(
            @Valid
            @RequestBody
            RegisterRequest request
    ) {

        AuthResponse response =
                authService.registerAdmin(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Admin registered successfully",
                        response
                )
        );
    }
}