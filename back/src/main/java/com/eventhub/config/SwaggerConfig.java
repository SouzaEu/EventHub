package com.eventhub.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("EventHub API")
                        .version("1.0")
                        .description("API para gerenciamento de eventos")
                        .contact(new Contact()
                                .name("EventHub Team")
                                .email("contato@eventhub.com")));
    }
} 