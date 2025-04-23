import '@testing-library/jest-dom'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock do window.location
delete window.location
window.location = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}

// Mock do fetch
global.fetch = jest.fn()

// Mock do console.error para evitar poluição nos testes
console.error = jest.fn() 