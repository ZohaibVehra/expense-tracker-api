package com.zohaib.expensetracker.controller;

import com.zohaib.expensetracker.model.Expense;
import com.zohaib.expensetracker.model.Trip;
import com.zohaib.expensetracker.service.ExpenseService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.zohaib.expensetracker.config.JwtUtil;
import com.zohaib.expensetracker.service.TripService;



@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final TripService tripService;
    private final JwtUtil jwtUtil;
    
    public ExpenseController(ExpenseService expenseService, TripService tripService, JwtUtil jwtUtil) {
        this.expenseService = expenseService;
        this.tripService = tripService;
        this.jwtUtil = jwtUtil;
    }

    // Get all expenses for a specific trip
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getExpensesByTripId(@PathVariable Long tripId, @RequestHeader("Authorization") String authHeader) {

        //confirm trip is owned by correct user
        Long tripUserId = tripService.getTripById(tripId).getUser().getId();
        String token = authHeader.replace("Bearer ", "");
        long userId = jwtUtil.extractUserId(token);
        if (userId == tripUserId){
             return  ResponseEntity.ok(expenseService.getExpensesByTripId(tripId));
        }

       return ResponseEntity.status(403).body("Access denied: You do not own this trip.");
    }

    // Get a specific expense by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        long userId = jwtUtil.extractUserId(token);

        Expense expense = expenseService.getExpenseById(id);
        Long tripId = expense.getTrip().getId();
        Trip trip = tripService.getTripById(tripId);

        if (userId == trip.getUser().getId()){
            return ResponseEntity.ok(expense);
        }
        return ResponseEntity.status(403).body("Access denied: You do not own this expense.");
    }

    // Create a new expense after confirming user owns the trip they are linking it to
    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody Expense expense, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        long userId = jwtUtil.extractUserId(token);

        Long tripId = expense.getTrip() != null ? expense.getTrip().getId() : null;
        System.out.println("[DEBUG] Trip ID from payload: " + tripId);
        System.out.println("[DEBUG] Requesting user ID from token: " + userId);

        if (tripId == null) {
            return ResponseEntity.badRequest().body("Trip ID is missing in request.");
        }

        Trip trip = tripService.getTripById(tripId);
        if (trip == null) {
            return ResponseEntity.status(404).body("Trip not found.");
        }

        System.out.println("[DEBUG] Trip owner ID from DB: " + trip.getUser().getId());

        if (!trip.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body("Access denied: You do not own this trip.");
        }

        expense.setTrip(trip);

        Expense savedExpense = expenseService.createExpense(expense);
        return ResponseEntity.ok(savedExpense);
    }


    // Delete an expense by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        long userId = jwtUtil.extractUserId(token);

        Expense expense = expenseService.getExpenseById(id);
        Long tripId = expense.getTrip().getId();
        Trip trip = tripService.getTripById(tripId);

        if (!trip.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body("Access denied: You do not own this expense.");
        }

        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build(); // HTTP 204
    }
}
