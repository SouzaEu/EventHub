import { NextResponse } from "next/server"

// Simulação de autenticação simples
export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Verificar credenciais diretamente no backend
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { success: false, message: errorData.error || "Credenciais inválidas" },
        { status: response.status },
      )
    }

    const userData = await response.json()
    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("Erro de autenticação:", error)
    return NextResponse.json({ success: false, message: "Erro no servidor" }, { status: 500 })
  }
}

