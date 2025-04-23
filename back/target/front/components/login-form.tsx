"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function LoginForm({ onLogin, onCancel }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpar erro quando o usuário digita
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      console.log("Tentando login com:", formData.email)

      // Usar a API mock para ambiente de preview
      const response = await fetch("/api/mock-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Resposta de erro:", data)
        throw new Error(data.message || data.error || "Falha na autenticação")
      }

      if (data.success) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${data.user.name}!`,
        })

        // Armazenar informações do usuário
        localStorage.setItem("user", JSON.stringify(data.user))

        onLogin(data.user)
      } else {
        console.error("Falha no login:", data)
        setErrors({ auth: data.message || "Credenciais inválidas" })
      }
    } catch (error) {
      console.error("Erro de login:", error)
      setErrors({ auth: error.message || "Erro ao fazer login" })
      toast({
        title: "Erro",
        description: error.message || "Falha ao fazer login. Verifique suas credenciais.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para preencher automaticamente as credenciais de teste
  const fillTestCredentials = (role) => {
    switch (role) {
      case "admin":
        setFormData({
          email: "admin@eventhub.com",
          password: "admin123",
        })
        break
      case "organizador":
        setFormData({
          email: "organizador@eventhub.com",
          password: "org123",
        })
        break
      case "participante":
        setFormData({
          email: "participante@eventhub.com",
          password: "part123",
        })
        break
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Login (Modo Preview)</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.auth && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{errors.auth}</div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Sua senha"
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fillTestCredentials("admin")}>
              Admin
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => fillTestCredentials("organizador")}>
              Organizador
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => fillTestCredentials("participante")}>
              Participante
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Este é um modo de preview que usa dados simulados.</p>
            <p>Clique nos botões acima para preencher as credenciais.</p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

