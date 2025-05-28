package com.zohaib.expensetracker.service;

import com.zohaib.expensetracker.model.Trip;
import com.zohaib.expensetracker.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TripService {
    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id).orElse(null);
    }

    public Trip createTrip(Trip trip) {
        if (trip.getId() == null) {
            // This is a new trip
            int randomCover = (int) (Math.random() * 12) + 1;
            trip.setCover(randomCover);
        }
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

    public List<Trip> getTripsByUserId(Long userId) {
        return tripRepository.findByUserId(userId);
    }
    
    public List<Trip> searchTripsByUserIdAndName(Long userId, String name) {
        return tripRepository.findByUserIdAndNameContainingIgnoreCase(userId, name);
    }

    public List<Trip> getFavoriteTripsByUserId(Long userId) {
        return tripRepository.findByUserIdAndFavoriteTrue(userId);
    }
    
    public List<Trip> getFutureTripsByUserId(Long userId) {
        return tripRepository.findByUserIdAndStartDateAfter(userId, LocalDate.now());
    }
}
