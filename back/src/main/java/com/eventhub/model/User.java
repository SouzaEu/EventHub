package com.eventhub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String password;

    private String role;
    private LocalDate createdAt;
    
    @OneToMany(mappedBy = "organizer")
    private List<Event> eventsCreated = new ArrayList<>();
    
    @ManyToMany(mappedBy = "participants")
    private List<Event> eventsParticipating = new ArrayList<>();

    // Construtor padrão
    public User() {
        this.createdAt = LocalDate.now();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public List<Event> getEventsCreated() {
        return eventsCreated;
    }

    public List<Event> getEventsParticipating() {
        return eventsParticipating;
    }
    
    // DTO para transferência de dados sem expor a senha
    public UserDTO toDTO() {
        UserDTO dto = new UserDTO();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setEmail(this.email);
        dto.setRole(this.role);
        dto.setCreatedAt(this.createdAt.toString());
        dto.setEventsCreated(this.eventsCreated.size());
        dto.setEventsParticipating(this.eventsParticipating.size());
        return dto;
    }
}

