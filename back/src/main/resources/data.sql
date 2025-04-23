-- Inserir usuários
INSERT INTO users (name, email, password, role, created_at) VALUES
('Admin', 'admin@eventhub.com', '$2a$10$X7UrH5UxX5UxX5UxX5UxX.5UxX5UxX5UxX5UxX5UxX5UxX5UxX5UxX', 'ADMIN', CURRENT_DATE),
('Organizador', 'organizador@eventhub.com', '$2a$10$X7UrH5UxX5UxX5UxX5UxX.5UxX5UxX5UxX5UxX5UxX5UxX5UxX5UxX', 'ORGANIZER', CURRENT_DATE),
('Participante', 'participante@eventhub.com', '$2a$10$X7UrH5UxX5UxX5UxX5UxX.5UxX5UxX5UxX5UxX5UxX5UxX5UxX5UxX', 'USER', CURRENT_DATE);

-- Inserir eventos
INSERT INTO events (name, description, date, location, category, capacity, organizer_id) VALUES
('Show de Rock', 'Show de rock com bandas locais', '2024-04-25 19:00:00', 'Casa de Shows', 'Música', 100, 2),
('Workshop de Programação', 'Workshop sobre desenvolvimento web', '2024-04-26 14:00:00', 'Centro de Convenções', 'Tecnologia', 50, 2),
('Festival de Comida', 'Festival com as melhores comidas da região', '2024-04-27 12:00:00', 'Parque da Cidade', 'Gastronomia', 200, 2),
('Palestra sobre IA', 'Palestra sobre Inteligência Artificial', '2024-04-28 10:00:00', 'Auditório Principal', 'Tecnologia', 80, 2),
('Show de Jazz', 'Show de jazz com músicos renomados', '2024-04-29 20:00:00', 'Teatro Municipal', 'Música', 150, 2); 