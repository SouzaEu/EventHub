package com.eventhub.controller;

import com.eventhub.model.Event;
import com.eventhub.model.EventDTO;
import com.eventhub.model.EventFilterParams;
import com.eventhub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<Page<EventDTO>> getAllEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<EventDTO> events = eventService.getAllEvents(name, category, location, pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            EventDTO event = eventService.getEventById(id).toDTO();
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Evento não encontrado"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody Map<String, Object> eventData, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        try {
            Event event = convertMapToEvent(eventData);
            EventDTO createdEvent = eventService.createEvent(event, (Long) eventData.get("organizerId")).toDTO();
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Map<String, Object> eventData) {
        try {
            Event event = convertMapToEvent(eventData);
            event.setId(id);
            EventDTO updatedEvent = eventService.updateEvent(event).toDTO();
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("message", "Evento excluído com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{eventId}/register/{userId}")
    public ResponseEntity<?> registerUserForEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            eventService.registerUserForEvent(eventId, userId);
            return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso no evento"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{eventId}/unregister/{userId}")
    public ResponseEntity<?> unregisterUserFromEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            eventService.unregisterUserFromEvent(eventId, userId);
            return ResponseEntity.ok(Map.of("message", "Usuário removido com sucesso do evento"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Event convertMapToEvent(Map<String, Object> eventData) {
        Event event = new Event();
        
        if (eventData.containsKey("id")) {
            event.setId(Long.valueOf(eventData.get("id").toString()));
        }
        
        event.setName((String) eventData.get("name"));
        event.setDescription((String) eventData.get("description"));
        event.setLocation((String) eventData.get("location"));
        event.setCategory((String) eventData.get("category"));
        
        if (eventData.containsKey("capacity")) {
            event.setCapacity(Integer.parseInt(eventData.get("capacity").toString()));
        }
        
        // Converter string de data para LocalDateTime
        try {
            String dateStr = (String) eventData.get("date");
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime date = LocalDateTime.parse(dateStr, formatter);
            event.setDate(date);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de data inválido. Use o formato ISO (yyyy-MM-ddTHH:mm:ss)");
        }
        
        return event;
    }
}

