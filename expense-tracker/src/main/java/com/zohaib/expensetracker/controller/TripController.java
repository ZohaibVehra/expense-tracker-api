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

    // Search trips by name
    @GetMapping("/user/search")
    public ResponseEntity<List<Trip>> searchTripsByName(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("query") String query) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        List<Trip> trips = tripService.searchTripsByUserIdAndName(userId, query);
        return ResponseEntity.ok(trips);
    }
    
    // Get fav trips
    @GetMapping("/user/favorites")
    public ResponseEntity<List<Trip>> getFavoriteTrips(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);
        List<Trip> favoriteTrips = tripService.getFavoriteTripsByUserId(userId);
        return ResponseEntity.ok(favoriteTrips);
    }

    // get future trips
    @GetMapping("/user/future")
    public List<Trip> getFutureTrips(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);
        return tripService.getFutureTripsByUserId(userId);
    }

    // update name, dates
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTripDetails(
            @PathVariable Long id,
            @RequestBody Trip updatedTrip,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        Trip existingTrip = tripService.getTripById(id);
        if (!existingTrip.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body("Access denied: You do not own this trip.");
        }

        // Update only if non-null and non-blank
        if (updatedTrip.getName() != null && !updatedTrip.getName().trim().isEmpty()) {
            existingTrip.setName(updatedTrip.getName());
        }

        if (updatedTrip.getStartDate() != null) {
            existingTrip.setStartDate(updatedTrip.getStartDate());
        }

        if (updatedTrip.getEndDate() != null) {
            existingTrip.setEndDate(updatedTrip.getEndDate());
        }

        Trip savedTrip = tripService.createTrip(existingTrip); // reuse createTrip() for saving
        return ResponseEntity.ok(savedTrip);
    }

    @PutMapping("/{id}/cover")
    public ResponseEntity<?> updateTripCover(
            @PathVariable Long id,
            @RequestBody int coverImage,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        Trip trip = tripService.getTripById(id);
        if (!trip.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body("Access denied: You do not own this trip.");
        }

        // Validate cover image range
        if (coverImage < 1 || coverImage > 12) {
            return ResponseEntity.badRequest().body("Invalid cover image ID.");
        }

        trip.setCover(coverImage);
        Trip updatedTrip = tripService.createTrip(trip); // saves it

        return ResponseEntity.ok(updatedTrip);
    }

}
