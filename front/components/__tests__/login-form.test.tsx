import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../login-form'
import { authService } from '@/lib/api'

// Mock do authService
jest.mock('@/lib/api', () => ({
  authService: {
    login: jest.fn(),
  },
}))

describe('LoginForm', () => {
  const mockOnLogin = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o formulário corretamente', () => {
    render(<LoginForm onLogin={mockOnLogin} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('deve validar campos obrigatórios', async () => {
    render(<LoginForm onLogin={mockOnLogin} onCancel={mockOnCancel} />)

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    expect(await screen.findByText(/email é obrigatório/i)).toBeInTheDocument()
    expect(await screen.findByText(/senha é obrigatória/i)).toBeInTheDocument()
  })

  it('deve validar formato de email', async () => {
    render(<LoginForm onLogin={mockOnLogin} onCancel={mockOnCancel} />)

    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.type(emailInput, 'email-invalido')

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    expect(await screen.findByText(/email inválido/i)).toBeInTheDocument()
  })

  it('deve chamar onLogin com sucesso', async () => {
    const mockUser = { name: 'Test User', token: 'test-token' }
    ;(authService.login as jest.Mock).mockResolvedValueOnce(mockUser)

    render(<LoginForm onLogin={mockOnLogin} onCancel={mockOnCancel} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser)
    })
  })

  it('deve mostrar erro quando login falha', async () => {
    const errorMessage = 'Credenciais inválidas'
    ;(authService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<LoginForm onLogin={mockOnLogin} onCancel={mockOnCancel} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrong-password')

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('deve chamar onCancel quando o botão cancelar é clicado', () => {
    render(<LoginForm onLogin={mockOnLogin} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })
}) 