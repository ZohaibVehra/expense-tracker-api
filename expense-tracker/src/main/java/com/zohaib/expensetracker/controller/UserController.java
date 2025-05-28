package com.zohaib.expensetracker.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.zohaib.expensetracker.model.User;
import com.zohaib.expensetracker.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.zohaib.expensetracker.config.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

     @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        DecodedJWT decodedJWT = jwtUtil.validateToken(token);

        Long userId = Long.valueOf(decodedJWT.getSubject()); // stored as string
        String username = decodedJWT.getClaim("username").asString();

        return Map.of(
            "id", userId,
            "username", username
        );
    }

}
