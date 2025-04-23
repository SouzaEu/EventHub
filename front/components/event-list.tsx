"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Users, Calendar, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const categories = ["Todos", "Tecnologia", "Música", "Marketing", "Gastronomia", "Esportes", "Educação"]

export default function EventList({ onEdit }) {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  // Buscar eventos do backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)

        // No ambiente de preview, usar dados simulados
        const mockEvents = [
          {
            id: 1,
            name: "Conferência de Tecnologia",
            description: "Uma conferência sobre as últimas tendências em tecnologia",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Centro de Convenções",
            category: "Tecnologia",
            capacity: 200,
            registered: 150,
            organizer: "Organizador",
          },
          {
            id: 2,
            name: "Festival de Música",
            description: "Um festival com os melhores artistas locais",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Parque Municipal",
            category: "Música",
            capacity: 500,
            registered: 320,
            organizer: "Organizador",
          },
          {
            id: 3,
            name: "Workshop de Marketing Digital",
            description: "Aprenda as melhores estratégias de marketing digital",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Hotel Central",
            category: "Marketing",
            capacity: 50,
            registered: 42,
            organizer: "Admin",
          },
        ]

        setEvents(mockEvents)
        setFilteredEvents(mockEvents)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar eventos:", error)
        setError("Não foi possível carregar os eventos. Tente novamente mais tarde.")
        setLoading(false)
        toast({
          title: "Erro",
          description: "Falha ao carregar eventos do servidor.",
          variant: "destructive",
        })
      }
    }

    fetchEvents()
  }, [toast])

  // Filtrar eventos com base no termo de busca e categoria
  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "Todos") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    setFilteredEvents(filtered)
  }, [searchTerm, categoryFilter, events])

  const handleDelete = async (id) => {
    try {
      // No ambiente de preview, apenas simular a exclusão
      setEvents(events.filter((event) => event.id !== id))

      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir evento:", error)
      toast({
        title: "Erro",
        description: "Falha ao excluir o evento.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    {event.category}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir evento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o evento "{event.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.registered} / {event.capacity} participantes
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="default" className="w-full">
                  Inscrever-se
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

