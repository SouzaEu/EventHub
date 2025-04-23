package com.eventhub.repository;

import com.eventhub.model.Event;
import com.eventhub.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByCategory(String category);

    @Query("SELECT e FROM Event e WHERE " +
           "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR LOWER(e.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Event> findByNameContainingAndCategoryContainingAndLocationContaining(
        @Param("name") String name,
        @Param("category") String category,
        @Param("location") String location,
        Pageable pageable
    );
}

