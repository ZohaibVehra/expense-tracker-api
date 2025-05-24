package com.zohaib.expensetracker.controller;

import com.zohaib.expensetracker.model.Trip;
import com.zohaib.expensetracker.model.User;
import com.zohaib.expensetracker.service.TripService;
import com.zohaib.expensetracker.config.JwtUtil;
import com.zohaib.expensetracker.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public TripController(TripService tripService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.tripService = tripService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // Get all trips for user (from Jwt)
    @GetMapping("/user/trips")
    public List<Trip> getTripsByUser(@RequestHeader("Authorization") String authHeader) {
        System.out.println("get all trips req made");
        String token = authHeader.replace("Bearer ", "");
        Long id = jwtUtil.extractUserId(token);
        return tripService.getTripsByUserId(id);
    }

    // Get a specific trip by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {

        //confirm token matches trip user
        String token = authHeader.replace("Bearer ", "");
        long userId = jwtUtil.extractUserId(token);
        Trip trip = tripService.getTripById(id);
        long tripUserId = trip.getUser().getId();

        if(userId == tripUserId){
            return ResponseEntity.ok(trip);
        }
        else {
            return ResponseEntity.status(403).body("Access denied: You do not own this trip.");
        }
    }

    // Create a new trip
    @PostMapping
    public ResponseEntity<Trip> createTrip(
            @RequestBody Trip trip,
            @RequestHeader("Authorization") String authHeader) {

         System.out.println("post trip req made");
        // Extract JWT token
        String token = authHeader.replace("Bearer ", "");

        // Extract id from JWT
        Long userId = jwtUtil.extractUserId(token);

        // Find the user from DB
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Set the user to the trip
        trip.setUser(user);

        Trip savedTrip = tripService.createTrip(trip);
        return ResponseEntity.ok(savedTrip);
    }

    // Delete a trip by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        Trip trip = tripService.getTripById(id);
        if (trip.getUser().getId().equals(userId)) {
            tripService.deleteTrip(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.status(403).body("Access denied: You do not own this trip.");
        }
    }
}
