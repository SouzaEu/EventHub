import React, { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function EventList({ events, onEventClick }: EventListProps) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(event => 
        event.category === categoryFilter
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events, searchTerm, categoryFilter, locationFilter]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const categories = [...new Set(events.map(event => event.category))];
  const locations = [...new Set(events.map(event => event.location))];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          placeholder="Categoria"
        >
          <option value="">Todas as categorias</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <Select
          value={locationFilter}
          onValueChange={setLocationFilter}
          placeholder="Localização"
        >
          <option value="">Todas as localizações</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentEvents.map(event => (
          <div
            key={event.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onEventClick(event)}
          >
            <h3 className="font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <div className="mt-2 text-sm">
              <p>Data: {new Date(event.date).toLocaleDateString()}</p>
              <p>Local: {event.location}</p>
              <p>Categoria: {event.category}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 