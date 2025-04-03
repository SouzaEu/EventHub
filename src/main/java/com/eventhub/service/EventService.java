package com.eventhub.service;

import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com id: " + id));
    }

    public Event createEvent(Event event, Long organizerId) {
        // Buscar o organizador
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizador não encontrado com id: " + organizerId));
        
        // Verificar se o organizador tem permissão para criar eventos
        if (!"admin".equals(organizer.getRole()) && !"organizador".equals(organizer.getRole())) {
            throw new RuntimeException("Usuário não tem permissão para criar eventos");
        }
        
        event.setOrganizer(organizer);
        return eventRepository.save(event);
    }

    public Event updateEvent(Event event) {
        // Verificar se o evento existe
        Event existingEvent = getEventById(event.getId());
        
        // Manter o organizador original
        event.setOrganizer(existingEvent.getOrganizer());
        
        // Manter os participantes originais
        event.setParticipants(existingEvent.getParticipants());
        
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        // Verificar se o evento existe
        getEventById(id);
        
        eventRepository.deleteById(id);
    }

    public void registerUserForEvent(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + userId));
        
        // Verificar se o evento já está lotado
        if (event.getParticipants().size() >= event.getCapacity()) {
            throw new RuntimeException("Evento já está com capacidade máxima");
        }
        
        // Verificar se o usuário já está registrado
        if (event.getParticipants().contains(user)) {
            throw new RuntimeException("Usuário já está registrado neste evento");
        }
        
        event.addParticipant(user);
        eventRepository.save(event);
    }

    public void unregisterUserFromEvent(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + userId));
        
        // Verificar se o usuário está registrado
        if (!event.getParticipants().contains(user)) {
            throw new RuntimeException("Usuário não está registrado neste evento");
        }
        
        event.removeParticipant(user);
        eventRepository.save(event);
    }
}

