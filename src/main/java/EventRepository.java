package com.example.eventmanagementsystem.repository;

import com.example.eventmanagementsystem.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}

