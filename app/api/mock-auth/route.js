// Modificar para armazenar usuários criados durante a sessão
import { NextResponse } from "next/server"

// Usuários de teste para ambiente de preview
const mockUsers = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@eventhub.com",
    password: "admin123",
    role: "admin",
    createdAt: "2023-01-01",
    eventsCreated: 5,
    eventsParticipating: 2,
  },
  {
    id: 2,
    name: "Organizador",
    email: "organizador@eventhub.com",
    password: "org123",
    role: "organizador",
    createdAt: "2023-01-02",
    eventsCreated: 3,
    eventsParticipating: 1,
  },
  {
    id: 3,
    name: "Participante",
    email: "participante@eventhub.com",
    password: "part123",
    role: "participante",
    createdAt: "2023-01-03",
    eventsCreated: 0,
    eventsParticipating: 4,
  },
]

// API de autenticação simulada para ambiente de preview
export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Verificar credenciais nos usuários simulados
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      // Remover a senha antes de retornar
      const { password, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      })
    }

    return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Erro de autenticação:", error)
    return NextResponse.json({ success: false, message: "Erro no servidor" }, { status: 500 })
  }
}

// Adicionar usuários criados durante a sessão
export async function PUT(request) {
  try {
    const userData = await request.json()

    // Verificar se o email já existe
    if (mockUsers.some((u) => u.email === userData.email)) {
      return NextResponse.json({ success: false, message: "Email já está em uso" }, { status: 400 })
    }

    // Criar novo usuário
    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "participante",
      createdAt: new Date().toISOString().split("T")[0],
      eventsCreated: 0,
      eventsParticipating: 0,
    }

    mockUsers.push(newUser)

    // Remover a senha antes de retornar
    const { password, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ success: false, message: "Erro no servidor" }, { status: 500 })
  }
}

// Obter todos os usuários (para debug)
export async function GET() {
  // Remover senhas antes de retornar
  const usersWithoutPasswords = mockUsers.map((user) => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })

  return NextResponse.json(usersWithoutPasswords)
}

