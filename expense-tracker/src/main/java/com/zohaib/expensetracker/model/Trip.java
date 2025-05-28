package com.zohaib.expensetracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate startDate;
    private LocalDate endDate;
    private boolean favorite = false;
    private int coverImage; 

    @ManyToOne
    @JoinColumn(
        name = "user_id",
        foreignKey = @ForeignKey(name = "fk_trip_user")
    )
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Expense> expenses;

    public Trip() {}

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Expense> getExpenses() { return expenses; }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }

    public boolean isFavorite() { return favorite; }
    public void setFavorite(boolean favorite) { this.favorite = favorite; }

    public int getCoverImage() { return coverImage; }
    public void setCover(int coverImage) { this.coverImage = coverImage; }

}
