package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.model.Event;
import com.example.eventmanagementsystem.model.User;
import com.example.eventmanagementsystem.repository.EventRepository;
import com.example.eventmanagementsystem.repository.UserRepository;
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
        return eventRepository.findById(id).orElse(null);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setCategory(eventDetails.getCategory());
            event.setDate(eventDetails.getDate());
            event.setCapacity(eventDetails.getCapacity());
            return eventRepository.save(event);
        }
        return null;
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Event joinEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        if (event != null && user != null) {
            event.getParticipants().add(user);
            return eventRepository.save(event);
        }
        return null;
    }
}

