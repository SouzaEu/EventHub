package com.eventhub.config;

import com.github.javafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.ZoneId;
import java.util.Locale;

@Configuration
public class DatabaseSeeder {
    
    @Bean
    public Faker faker() {
        return new Faker(new Locale("pt-BR"));
    }
    
    @Bean
    public CommandLineRunner initDatabase(Faker faker) {
        return args -> {
            // Aqui você pode adicionar a lógica para criar dados iniciais
            // Exemplo:
            // eventRepository.save(new Event(
            //     faker.company().name(),
            //     faker.address().fullAddress(),
            //     faker.date().future(30, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
            // ));
        };
    }
} 