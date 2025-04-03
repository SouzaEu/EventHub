package com.eventhub.repository;

import com.eventhub.model.Event;
import com.eventhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByCategory(String category);
}

