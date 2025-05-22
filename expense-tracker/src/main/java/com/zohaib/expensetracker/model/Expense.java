package com.zohaib.expensetracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Category category;

    @ManyToOne
    @JoinColumn(
        name = "trip_id",
        foreignKey = @ForeignKey(name = "fk_expense_trip")
    )
    @JsonIgnore
    private Trip trip;

    public Expense() {}

    public Expense(BigDecimal amount, Category category, Trip trip) {
        this.amount = amount;
        this.category = category;
        this.trip = trip;
    }

    public Long getId() { return id; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public enum Category {
        TRAVEL, FOOD_DRINK, EVENT, OTHER
    }
}
