"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Versão alternativa do formulário de login que se conecta diretamente ao backend
export default function LoginFormDirect({ onLogin, onCancel }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState("checking") // "checking", "online", "offline"
  const { toast } = useToast()

  // Verificar se o backend está acessível
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Tentar fazer uma requisição simples para verificar se o backend está acessível
        const response = await fetch("http://localhost:8080/api/users", {
          method: "HEAD",
          // Adicionar um timeout para não bloquear por muito tempo
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          setBackendStatus("online")
        } else {
          setBackendStatus("offline")
        }
      } catch (error) {
        console.error("Erro ao verificar status do backend:", error)
        setBackendStatus("offline")
      }
    }

    checkBackendStatus()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

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

    // Se o backend estiver offline, mostrar mensagem e não tentar login
    if (backendStatus === "offline") {
      setErrors({
        auth: "O backend não está acessível. Verifique se o servidor Java está rodando em http://localhost:8080",
      })
      return
    }

    setIsLoading(true)

    try {
      // Chamar diretamente o backend Java
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha na autenticação")
      }

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${data.name}!`,
      })

      // Armazenar informações do usuário
      localStorage.setItem("user", JSON.stringify(data))

      onLogin(data)
    } catch (error) {
      console.error("Erro de login:", error)

      // Mensagem de erro mais específica para o problema de conexão
      if (error.message === "Failed to fetch") {
        setErrors({
          auth: "Não foi possível conectar ao backend. Verifique se o servidor Java está rodando e acessível.",
        })
      } else {
        setErrors({ auth: error.message || "Erro ao fazer login" })
      }

      toast({
        title: "Erro",
        description: "Falha ao fazer login. Verifique suas credenciais e se o backend está rodando.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar mensagem de status do backend
  const renderBackendStatus = () => {
    if (backendStatus === "checking") {
      return (
        <div className="flex items-center justify-center p-3 bg-muted rounded-md mb-4">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
          <span>Verificando conexão com o backend...</span>
        </div>
      )
    } else if (backendStatus === "offline") {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend não acessível</AlertTitle>
          <AlertDescription>
            Não foi possível conectar ao backend Java. Verifique se:
            <ul className="list-disc pl-5 mt-2">
              <li>O servidor Java está rodando em http://localhost:8080</li>
              <li>Você está executando o frontend e o backend no mesmo ambiente</li>
              <li>Não há bloqueios de firewall ou CORS impedindo a conexão</li>
            </ul>
            <p className="mt-2">
              <strong>Nota:</strong> Em ambientes de preview online, a conexão direta com localhost não funcionará.
            </p>
          </AlertDescription>
        </Alert>
      )
    } else {
      return (
        <div className="flex items-center p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md mb-4">
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
          <span>Backend conectado e pronto</span>
        </div>
      )
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
          <CardTitle>Login (Conexão Direta)</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBackendStatus()}

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
          <Button type="submit" className="w-full" disabled={isLoading || backendStatus !== "online"}>
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
            <p>Contas de teste disponíveis:</p>
            <p>admin@eventhub.com / admin123</p>
            <p>organizador@eventhub.com / org123</p>
            <p>participante@eventhub.com / part123</p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

