package com.zohaib.expensetracker.repository;

import com.zohaib.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTripId(Long tripId); // Get expenses for a trip
}
