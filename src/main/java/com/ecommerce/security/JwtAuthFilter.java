package com.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // =====================================================
        // 1. GET ACCESS JWT FROM COOKIE
        // =====================================================

        String jwt = null;

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {

            for (Cookie cookie : cookies) {

                if ("jwt".equals(cookie.getName())) {

                    jwt = cookie.getValue();

                    break;
                }
            }
        }


        // =====================================================
        // 2. NO JWT COOKIE
        // =====================================================

        if (jwt == null || jwt.isBlank()) {

            System.out.println(
                    "NO JWT COOKIE FOUND: "
                            + request.getRequestURI()
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        System.out.println(
                "JWT COOKIE FOUND: "
                        + request.getRequestURI()
        );


        // =====================================================
        // 3. EXTRACT USER EMAIL
        // =====================================================

        String userEmail;

        try {

            userEmail =
                    jwtService.extractUsername(jwt);

        } catch (Exception e) {

            System.out.println(
                    "INVALID JWT: "
                            + e.getMessage()
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =====================================================
        // 4. CHECK USERNAME
        // =====================================================

        if (userEmail == null || userEmail.isBlank()) {

            System.out.println(
                    "JWT USERNAME IS NULL"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =====================================================
        // 5. CHECK WHETHER ALREADY AUTHENTICATED
        // =====================================================

        if (
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        == null
        ) {

            try {

                // =================================================
                // 6. LOAD USER
                // =================================================

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        userEmail
                                );


                // =================================================
                // 7. VALIDATE ACCESS TOKEN
                // =================================================

                boolean valid =
                        jwtService.isTokenValid(
                                jwt,
                                userDetails
                        );


                if (valid) {

                    // =============================================
                    // 8. CREATE AUTHENTICATION
                    // =============================================

                    UsernamePasswordAuthenticationToken
                            authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );


                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );


                    // =============================================
                    // 9. SET SECURITY CONTEXT
                    // =============================================

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authToken
                            );


                    System.out.println(
                            "USER AUTHENTICATED: "
                                    + userEmail
                    );

                } else {

                    System.out.println(
                            "JWT INVALID OR EXPIRED: "
                                    + request.getRequestURI()
                    );
                }


            } catch (Exception e) {

                System.out.println(
                        "AUTHENTICATION FAILED: "
                                + e.getMessage()
                );
            }
        }


        // =====================================================
        // 10. SHOW FINAL AUTHENTICATION
        // =====================================================

        System.out.println(
                "FINAL AUTHENTICATION: "
                        + SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        // =====================================================
        // 11. CONTINUE REQUEST
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}