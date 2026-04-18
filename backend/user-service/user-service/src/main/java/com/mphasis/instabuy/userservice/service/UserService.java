package com.mphasis.instabuy.userservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mphasis.instabuy.userservice.dto.LoginResponse;
import com.mphasis.instabuy.userservice.entity.Role;
import com.mphasis.instabuy.userservice.entity.User;
import com.mphasis.instabuy.userservice.exception.CustomException;
import com.mphasis.instabuy.userservice.repository.UserRepository;
import com.mphasis.instabuy.userservice.security.JwtService;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new CustomException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setWallet(10000.0);

        return userRepository.save(user);
    }

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new CustomException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse res = new LoginResponse();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setWalletBalance(user.getWallet());
        res.setToken(token); 

        return res;
    }
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id);

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));

        return userRepository.save(user);
    }

    public void deductWallet(Long id, Double amount) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found"));

        if (amount <= 0) {
            throw new CustomException("Invalid amount");
        }

        if (user.getWallet() < amount) {
            throw new CustomException("Insufficient balance");
        }

        user.setWallet(user.getWallet() - amount);
        userRepository.save(user);
    }

    public void addWallet(Long id, Double amount) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found"));

        if (amount <= 0) {
            throw new CustomException("Invalid amount");
        }

        user.setWallet(user.getWallet() + amount);
        userRepository.save(user);
    }
    
    public User getAdminUser() {
        return userRepository.findByRole(Role.ADMIN);
    }
}