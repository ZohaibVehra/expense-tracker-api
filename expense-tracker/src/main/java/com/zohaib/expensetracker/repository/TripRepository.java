package com.zohaib.expensetracker.repository;

import com.zohaib.expensetracker.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserId(Long userId); // This will return trips for a given user
}


