# EventHub

# RM556089 VINICIUS SOUZA CARVALHO
# RM THOMAS RODRIGUES 
# RM JOÃO VITOR CANDIDO 

Sistema de Gestão de Eventos com arquitetura moderna e recursos avançados.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Frontend (`/front`)
- Next.js
- React
- Tailwind CSS
- TypeScript

### Backend (`/back`)
- Spring Boot
- JPA/Hibernate
- H2 Database
- Swagger/OpenAPI
- Cache
- Database Seeder

## Recursos Implementados

1. **Documentação da API com Swagger**
   - Acesse a documentação em: `http://localhost:8080/swagger-ui.html`

2. **Cache**
   - Implementado para melhorar a performance em endpoints críticos
   - Cache configurado para eventos e usuários

3. **Database Seeder**
   - Dados iniciais gerados automaticamente
   - Utiliza a biblioteca JavaFaker para dados realistas em português

## Como Executar

### Backend
1. Entre na pasta `back`
2. Execute: `mvn spring-boot:run`
3. O servidor estará disponível em `http://localhost:8080`

### Frontend
1. Entre na pasta `front`
2. Instale as dependências: `npm install`
3. Execute: `npm run dev`
4. Acesse `http://localhost:3000`

## Descrição
O **EventHub** é uma plataforma para gerenciamento de eventos, permitindo a criação, edição e visualização de eventos em uma interface intuitiva e responsiva. O projeto é Full Stack, utilizando **Spring Boot** no back-end e **Next.js** no front-end.

## Tecnologias Utilizadas
- **Back-end:** Java com Spring Boot
- **Front-end:** Next.js
- **ORM:** Hibernate

## Funcionalidades
- CRUD completo de eventos
- Autenticação e autorização de usuários
- Interface responsiva para gerenciar eventos
- Integração entre Next.js e Spring Boot

## Contribuição
Sinta-se à vontade para sugerir melhorias e reportar issues.
