"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "participante",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    // Only validate password for new users
    if (!user) {
      if (!formData.password) {
        newErrors.password = "Senha é obrigatória"
      } else if (formData.password.length < 6) {
        newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "As senhas não coincidem"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Atualizar a função handleSubmit para integrar com o backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const userData = {
      ...formData,
      id: user?.id,
    }

    try {
      const url = user?.id ? `http://localhost:8080/api/users/${user.id}` : "http://localhost:8080/api/users"

      const method = user?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.errors) {
          // Atualizar os erros de validação
          setErrors(errorData.errors)
          return
        }

        throw new Error(errorData.error || "Falha ao salvar usuário")
      }

      const savedUser = await response.json()
      onSave(savedUser)
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      toast({
        title: "Erro",
        description: error.message || "Falha ao salvar usuário.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{user ? "Editar Usuário" : "Criar Novo Usuário"}</CardTitle>
          <CardDescription>
            {user
              ? "Atualize as informações do usuário existente."
              : "Preencha os detalhes para criar um novo usuário."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite o nome completo"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="exemplo@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="organizador">Organizador</SelectItem>
                <SelectItem value="participante">Participante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!user && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite a senha"
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme a senha"
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{user ? "Atualizar Usuário" : "Criar Usuário"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

