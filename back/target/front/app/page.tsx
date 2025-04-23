"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Users, Settings, LogOut } from "lucide-react"
import EventList from "@/components/event-list"
import EventForm from "@/components/event-form"
import UserList from "@/components/user-list"
import UserForm from "@/components/user-form"
import LoginForm from "@/components/login-form"
import LoginFormDirect from "@/components/login-form-direct"
import RegisterForm from "@/components/register-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [activeTab, setActiveTab] = useState("events")
  const [showEventForm, setShowEventForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [useDirectLogin, setUseDirectLogin] = useState(false)
  const { toast } = useToast()

  // Verificar se o usuário já está logado
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    })
  }

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setShowUserForm(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleEventFormClose = () => {
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const handleUserFormClose = () => {
    setShowUserForm(false)
    setEditingUser(null)
  }

  const handleEventSave = (eventData) => {
    toast({
      title: editingEvent ? "Evento atualizado" : "Evento criado",
      description: `${eventData.name} foi ${editingEvent ? "atualizado" : "criado"} com sucesso.`,
    })
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const handleUserSave = (userData) => {
    toast({
      title: editingUser ? "Usuário atualizado" : "Usuário criado",
      description: `${userData.name} foi ${editingUser ? "atualizado" : "criado"} com sucesso.`,
    })
    setShowUserForm(false)
    setEditingUser(null)
  }

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm)
  }

  const toggleLoginMethod = () => {
    setUseDirectLogin(!useDirectLogin)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Se o usuário não estiver logado, mostrar o formulário de login ou registro
  if (!user) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-center p-4">
        <div className="container mx-auto max-w-md">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">EventHub</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={toggleLoginMethod} className="text-xs">
                {useDirectLogin ? "Modo Preview" : "Modo Direto"}
              </Button>
            </div>
          </header>

          {showRegisterForm ? (
            <RegisterForm onRegister={() => setShowRegisterForm(false)} onCancel={() => setShowRegisterForm(false)} />
          ) : useDirectLogin ? (
            <LoginFormDirect onLogin={handleLogin} onCancel={() => {}} />
          ) : (
            <LoginForm onLogin={handleLogin} onCancel={() => {}} />
          )}

          <div className="text-center mt-4">
            {showRegisterForm ? (
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={toggleRegisterForm}>
                  Faça login
                </Button>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={toggleRegisterForm}>
                  Registre-se
                </Button>
              </p>
            )}
          </div>
        </div>
        <Toaster />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6 py-4 border-b">
          <h1 className="text-3xl font-bold text-primary">EventHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Olá, {user.name} ({user.role})
            </span>
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline-block">Sair</span>
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eventos
              </TabsTrigger>
              {(user.role === "admin" || user.role === "organizador") && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuários
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {activeTab === "events" && (user.role === "admin" || user.role === "organizador") && (
              <Button onClick={handleCreateEvent} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Evento
              </Button>
            )}
            {activeTab === "users" && user.role === "admin" && (
              <Button onClick={handleCreateUser} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Usuário
              </Button>
            )}
          </div>

          <TabsContent value="events" className="space-y-4">
            {showEventForm ? (
              <EventForm event={editingEvent} onSave={handleEventSave} onCancel={handleEventFormClose} />
            ) : (
              <EventList onEdit={handleEditEvent} />
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {showUserForm ? (
              <UserForm user={editingUser} onSave={handleUserSave} onCancel={handleUserFormClose} />
            ) : (
              <UserList onEdit={handleEditUser} />
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Configurações do Sistema</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Informações do Usuário</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p>
                      <strong>Nome:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Função:</strong>{" "}
                      {user.role === "admin"
                        ? "Administrador"
                        : user.role === "organizador"
                          ? "Organizador"
                          : "Participante"}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">API Backend</h3>
                  <p className="text-muted-foreground">
                    Endpoint da API Java: <code className="bg-muted p-1 rounded">http://localhost:8080/api</code>
                  </p>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Versão</h3>
                  <p className="text-muted-foreground">EventHub v1.0.0</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </main>
  )
}

