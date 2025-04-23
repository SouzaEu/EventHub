"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Mail } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const roles = ["Todos", "admin", "organizador", "participante"]

export default function UserList({ onEdit }) {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("Todos")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  // Buscar usuários do backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        // No ambiente de preview, buscar usuários da API mock
        const response = await fetch("/api/mock-auth")

        if (!response.ok) {
          throw new Error("Falha ao carregar usuários")
        }

        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)

        // Fallback para dados simulados se a API falhar
        const mockUsers = [
          {
            id: 1,
            name: "Administrador",
            email: "admin@eventhub.com",
            role: "admin",
            eventsCreated: 5,
            eventsParticipating: 2,
          },
          {
            id: 2,
            name: "Organizador",
            email: "organizador@eventhub.com",
            role: "organizador",
            eventsCreated: 3,
            eventsParticipating: 1,
          },
          {
            id: 3,
            name: "Participante",
            email: "participante@eventhub.com",
            role: "participante",
            eventsCreated: 0,
            eventsParticipating: 4,
          },
        ]

        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  // Filtrar e ordenar usuários
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "Todos") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "email":
          comparison = a.email.localeCompare(b.email)
          break
        case "role":
          comparison = a.role.localeCompare(b.role)
          break
        default:
          comparison = 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, users, sortField, sortDirection])

  // Calcular usuários paginados
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDelete = async (id) => {
    try {
      // No ambiente de preview, apenas simular a exclusão
      setUsers(users.filter((user) => user.id !== id))

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      toast({
        title: "Erro",
        description: "Falha ao excluir o usuário.",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "default"
      case "organizador":
        return "outline"
      case "participante":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role === "admin"
                  ? "Administrador"
                  : role === "organizador"
                    ? "Organizador"
                    : role === "participante"
                      ? "Participante"
                      : role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortField} onValueChange={handleSort}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="role">Função</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="hidden md:table-cell">Eventos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground md:hidden">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role === "admin"
                            ? "Administrador"
                            : user.role === "organizador"
                              ? "Organizador"
                              : "Participante"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col">
                          <span>Criados: {user.eventsCreated}</span>
                          <span>Participando: {user.eventsParticipating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
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
                                <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(user.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

