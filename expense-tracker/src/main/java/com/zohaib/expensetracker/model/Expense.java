package com.zohaib.expensetracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private BigDecimal amount;
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "trip_id", foreignKey = @ForeignKey(name = "fk_expense_trip"))
    @JsonIgnoreProperties("expenses") // Ignore the "expenses" field in Trip when serializing
    private Trip trip;


    public Expense() {}

    public Expense(BigDecimal amount, Category category, Trip trip, LocalDate date, String name) {
        this.amount = amount;
        this.category = category;
        this.trip = trip;
        this.date = date;
        this.name = name;
    }

    public Long getId() { return id; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public enum Category {
        FOOD, TRANSPORT, ACTIVITY, EVENT, OTHER
    }
}
