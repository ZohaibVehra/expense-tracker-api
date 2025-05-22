package com.zohaib.expensetracker.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zohaib.expensetracker.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRATION_TIME = 86400000;

    public String generateToken(User user) {
        return JWT.create()
            .withSubject(user.getId().toString())
            .withClaim("username", user.getUsername())
            .withIssuedAt(new Date())
            .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .sign(Algorithm.HMAC256(secret));
    }

    public DecodedJWT validateToken(String token) {
        return JWT.require(Algorithm.HMAC256(secret))
            .build()
            .verify(token);
    }

    public String extractUsername(String token) {
        return validateToken(token).getClaim("username").asString();
    }

    public Long extractUserId(String token) {
        return Long.parseLong(validateToken(token).getSubject());
    }
}