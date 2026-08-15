package com.ecommerce.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;


    // =====================================================
    // ACCESS TOKEN
    // =====================================================

    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        claims.put(
                "role",
                userDetails.getAuthorities()
                        .stream()
                        .findFirst()
                        .map(Object::toString)
                        .orElse("ROLE_USER")
        );

        claims.put("tokenType", "ACCESS");

        return buildToken(
                claims,
                userDetails.getUsername(),
                jwtExpiration
        );
    }


    // =====================================================
    // REFRESH TOKEN
    // =====================================================

    public String generateRefreshToken(
            UserDetails userDetails
    ) {

        Map<String, Object> claims = new HashMap<>();

        claims.put(
                "tokenType",
                "REFRESH"
        );

        return buildToken(
                claims,
                userDetails.getUsername(),
                refreshExpiration
        );
    }


    // =====================================================
    // BUILD TOKEN
    // =====================================================

    private String buildToken(
            Map<String, Object> claims,
            String username,
            long expiration
    ) {

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(
                        new Date(System.currentTimeMillis())
                )
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )
                .signWith(
                        getSignInKey(),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }


    // =====================================================
    // EXTRACT USERNAME
    // =====================================================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }


    // =====================================================
    // EXTRACT CLAIM
    // =====================================================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }


    // =====================================================
    // VALIDATE ACCESS TOKEN
    // =====================================================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        try {

            String username =
                    extractUsername(token);

            String tokenType =
                    extractClaim(
                            token,
                            claims ->
                                    claims.get(
                                            "tokenType",
                                            String.class
                                    )
                    );

            return username.equals(
                    userDetails.getUsername()
            )
                    && "ACCESS".equals(tokenType)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }


    // =====================================================
    // VALIDATE REFRESH TOKEN
    // =====================================================

    public boolean isRefreshTokenValid(
            String token,
            UserDetails userDetails
    ) {

        try {

            String username =
                    extractUsername(token);

            String tokenType =
                    extractClaim(
                            token,
                            claims ->
                                    claims.get(
                                            "tokenType",
                                            String.class
                                    )
                    );

            return username.equals(
                    userDetails.getUsername()
            )
                    && "REFRESH".equals(tokenType)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }


    // =====================================================
    // CHECK EXPIRATION
    // =====================================================

    private boolean isTokenExpired(
            String token
    ) {

        return extractExpiration(token)
                .before(new Date());
    }


    // =====================================================
    // EXTRACT EXPIRATION
    // =====================================================

    private Date extractExpiration(
            String token
    ) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }


    // =====================================================
    // PARSE TOKEN
    // =====================================================

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    // =====================================================
    // SIGNING KEY
    // =====================================================

    private Key getSignInKey() {

        byte[] keyBytes =
                secretKey.getBytes(
                        StandardCharsets.UTF_8
                );

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }
}