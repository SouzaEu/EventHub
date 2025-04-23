package com.eventhub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Data é obrigatória")
    private LocalDateTime date;

    @NotBlank(message = "Local é obrigatório")
    private String location;

    private String category;

    @Min(value = 1, message = "Capacidade deve ser pelo menos 1")
    private int capacity;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @ManyToMany
    @JoinTable(
        name = "event_participants",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> participants = new HashSet<>();

    // Construtor padrão
    public Event() {
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public Set<User> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<User> participants) {
        this.participants = participants;
    }

    // Método para adicionar participante
    public void addParticipant(User user) {
        participants.add(user);
    }

    // Método para remover participante
    public void removeParticipant(User user) {
        participants.remove(user);
    }
    
    // DTO para transferência de dados
    public EventDTO toDTO() {
        EventDTO dto = new EventDTO();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setDescription(this.description);
        dto.setDate(this.date.toString());
        dto.setLocation(this.location);
        dto.setCategory(this.category);
        dto.setCapacity(this.capacity);
        dto.setRegistered(this.participants.size());
        dto.setOrganizer(this.organizer != null ? this.organizer.getName() : "");
        return dto;
    }
}

