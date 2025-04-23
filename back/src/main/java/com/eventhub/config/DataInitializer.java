package com.eventhub.config;

import com.eventhub.model.User;
import com.eventhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Verificar se já existem usuários no sistema
        if (userRepository.count() == 0) {
            // Criar usuário administrador inicial
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@eventhub.com");
            admin.setPassword("admin123");
            admin.setRole("admin");
            admin.setCreatedAt(LocalDate.now());
            
            userRepository.save(admin);
            
            System.out.println("Usuário administrador inicial criado:");
            System.out.println("Email: admin@eventhub.com");
            System.out.println("Senha: admin123");
            
            // Criar um usuário organizador de exemplo
            User organizer = new User();
            organizer.setName("Organizador");
            organizer.setEmail("organizador@eventhub.com");
            organizer.setPassword("org123");
            organizer.setRole("organizador");
            organizer.setCreatedAt(LocalDate.now());
            
            userRepository.save(organizer);
            
            // Criar um usuário participante de exemplo
            User participant = new User();
            participant.setName("Participante");
            participant.setEmail("participante@eventhub.com");
            participant.setPassword("part123");
            participant.setRole("participante");
            participant.setCreatedAt(LocalDate.now());
            
            userRepository.save(participant);
        }
    }
}

