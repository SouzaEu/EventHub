package com.eventhub.model;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String createdAt;
    private int eventsCreated;
    private int eventsParticipating;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public int getEventsCreated() {
        return eventsCreated;
    }

    public void setEventsCreated(int eventsCreated) {
        this.eventsCreated = eventsCreated;
    }

    public int getEventsParticipating() {
        return eventsParticipating;
    }

    public void setEventsParticipating(int eventsParticipating) {
        this.eventsParticipating = eventsParticipating;
    }
}

