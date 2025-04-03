package com.eventhub.service;

import com.eventhub.model.User;
import com.eventhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
    }

    public User createUser(User user) {
        // Verificar se o email já existe
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }
        
        // Definir papel padrão se não for especificado
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("participante");
        }
        
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        // Verificar se o usuário existe
        User existingUser = getUserById(user.getId());
        
        // Verificar se o email já está em uso por outro usuário
        userRepository.findByEmail(user.getEmail())
                .ifPresent(u -> {
                    if (!u.getId().equals(user.getId())) {
                        throw new RuntimeException("Email já está em uso por outro usuário");
                    }
                });
        
        // Manter a senha existente se não for fornecida uma nova
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(existingUser.getPassword());
        }
        
        // Manter a data de criação original
        user.setCreatedAt(existingUser.getCreatedAt());
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        // Verificar se o usuário existe
        getUserById(id);
        
        userRepository.deleteById(id);
    }
}

