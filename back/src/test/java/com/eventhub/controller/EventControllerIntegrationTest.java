package com.eventhub.controller;

import com.eventhub.model.Event;
import com.eventhub.repository.EventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EventControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRepository eventRepository;

    @BeforeEach
    void setUp() {
        eventRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateEvent() throws Exception {
        Event event = new Event();
        event.setName("Test Event");
        event.setDescription("Test Description");
        event.setDate(LocalDateTime.now().plusDays(1));
        event.setLocation("Test Location");
        event.setCapacity(100);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(event.getName()))
                .andExpect(jsonPath("$.description").value(event.getDescription()));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldGetAllEvents() throws Exception {
        Event event = new Event();
        event.setName("Test Event");
        event.setDescription("Test Description");
        event.setDate(LocalDateTime.now().plusDays(1));
        event.setLocation("Test Location");
        event.setCapacity(100);
        eventRepository.save(event);

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(event.getName()))
                .andExpect(jsonPath("$[0].description").value(event.getDescription()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldUpdateEvent() throws Exception {
        Event event = new Event();
        event.setName("Test Event");
        event.setDescription("Test Description");
        event.setDate(LocalDateTime.now().plusDays(1));
        event.setLocation("Test Location");
        event.setCapacity(100);
        event = eventRepository.save(event);

        event.setName("Updated Event");
        event.setDescription("Updated Description");

        mockMvc.perform(put("/api/events/" + event.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Event"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldDeleteEvent() throws Exception {
        Event event = new Event();
        event.setName("Test Event");
        event.setDescription("Test Description");
        event.setDate(LocalDateTime.now().plusDays(1));
        event.setLocation("Test Location");
        event.setCapacity(100);
        event = eventRepository.save(event);

        mockMvc.perform(delete("/api/events/" + event.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/events/" + event.getId()))
                .andExpect(status().isNotFound());
    }
} 