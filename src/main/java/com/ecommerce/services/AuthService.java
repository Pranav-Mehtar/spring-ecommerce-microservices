package com.ecommerce.services;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.ForgotPasswordRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.ResetPasswordRequest;
import com.ecommerce.entities.PasswordResetToken;
import com.ecommerce.entities.Role;
import com.ecommerce.entities.User;
import com.ecommerce.repositories.PasswordResetTokenRepository;
import com.ecommerce.repositories.UserRepository;
import com.ecommerce.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository
            passwordResetTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;


    // =====================================================
    // REGISTER USER
    // =====================================================

    public AuthResponse register(
            RegisterRequest request
    ) {

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.USER)
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        userRepository.save(user);

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        String accessToken =
                jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(accessToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .message("Registration successful")
                .build();
    }


    // =====================================================
    // REGISTER ADMIN
    // =====================================================

    public AuthResponse registerAdmin(
            RegisterRequest request
    ) {

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.ADMIN)
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        userRepository.save(user);

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        String accessToken =
                jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(accessToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .message("Admin registered successfully")
                .build();
    }


    // =====================================================
    // LOGIN
    // =====================================================

    public AuthResponse login(
            LoginRequest request
    ) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails)
                        authentication.getPrincipal();

        String accessToken =
                jwtService.generateToken(
                        userDetails
                );

        String refreshToken =
                jwtService.generateRefreshToken(
                        userDetails
                );

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .message("Login successful")
                .build();
    }


    // =====================================================
    // REFRESH ACCESS TOKEN
    // =====================================================

    public AuthResponse refreshAccessToken(
            String refreshToken
    ) {

        if (refreshToken == null
                || refreshToken.isBlank()) {

            throw new RuntimeException(
                    "Refresh token is missing"
            );
        }

        String email;

        try {

            email =
                    jwtService.extractUsername(
                            refreshToken
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid refresh token"
            );
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        if (!jwtService.isRefreshTokenValid(
                refreshToken,
                userDetails
        )) {

            throw new RuntimeException(
                    "Refresh token expired or invalid"
            );
        }

        String newAccessToken =
                jwtService.generateToken(
                        userDetails
                );

        return AuthResponse.builder()
                .token(newAccessToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .message("Access token refreshed")
                .build();
    }


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    @Transactional
    public String forgotPassword(
            ForgotPasswordRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "No account found with this email"
                                )
                        );

        // Delete old reset tokens
        passwordResetTokenRepository
                .deleteByUser(user);

        String token =
                UUID.randomUUID()
                        .toString();

        PasswordResetToken resetToken =
                PasswordResetToken.builder()
                        .token(token)
                        .user(user)
                        .expiryDate(
                                LocalDateTime.now()
                                        .plusMinutes(15)
                        )
                        .used(false)
                        .build();

        passwordResetTokenRepository.save(
                resetToken
        );

        // For development/testing only.
        // Later send this token through email.
        return token;
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @Transactional
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(
                                request.getToken()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Invalid reset token"
                                )
                        );

        if (resetToken.isUsed()) {

            throw new RuntimeException(
                    "Reset token has already been used"
            );
        }

        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Reset token has expired"
            );
        }

        User user =
                resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        resetToken.setUsed(true);

        passwordResetTokenRepository.save(
                resetToken
        );
    }
}