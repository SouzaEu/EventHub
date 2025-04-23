"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

const categories = ["Tecnologia", "Música", "Marketing", "Gastronomia", "Esportes", "Educação", "Outro"]

export default function EventForm({ event, onSave, onCancel }) {
  const [date, setDate] = useState(event ? new Date(event.date) : new Date())
  const [time, setTime] = useState(event ? format(new Date(event.date), "HH:mm") : "09:00")
  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    location: event?.location || "",
    category: event?.category || "Tecnologia",
    capacity: event?.capacity || 50,
    organizer: event?.organizer || "Minha Organização",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Corrigir o erro de casting de Integer para Long
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Combine date and time
    const eventDateTime = new Date(date)
    const [hours, minutes] = time.split(":")
    eventDateTime.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10))

    const eventData = {
      ...formData,
      id: event?.id ? Number(event.id) : undefined, // Garantir que id seja um número ou undefined
      date: eventDateTime.toISOString(),
      organizerId: 1, // Temporariamente fixo para o primeiro usuário (em produção, seria o usuário logado)
    }

    try {
      // No ambiente de preview, apenas simular o salvamento
      toast({
        title: event?.id ? "Evento atualizado" : "Evento criado",
        description: `${formData.name} foi ${event?.id ? "atualizado" : "criado"} com sucesso.`,
      })

      // Simular um evento salvo
      const savedEvent = {
        ...eventData,
        id: event?.id || Math.floor(Math.random() * 1000) + 10,
        registered: 0,
        organizer: "Usuário Atual",
      }

      onSave(savedEvent)
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
      toast({
        title: "Erro",
        description: "Falha ao salvar evento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{event ? "Editar Evento" : "Criar Novo Evento"}</CardTitle>
          <CardDescription>
            {event ? "Atualize as informações do evento existente." : "Preencha os detalhes para criar um novo evento."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Evento</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite o nome do evento"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o evento"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Horário</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Endereço do evento"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="organizer">Organizador</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder="Nome do organizador"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{event ? "Atualizar Evento" : "Criar Evento"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

