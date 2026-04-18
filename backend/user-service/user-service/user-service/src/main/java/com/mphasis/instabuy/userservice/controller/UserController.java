package com.mphasis.instabuy.userservice.controller;
import com.mphasis.instabuy.userservice.entity.Role;

import com.mphasis.instabuy.userservice.dto.LoginRequest;
import com.mphasis.instabuy.userservice.dto.LoginResponse;
import com.mphasis.instabuy.userservice.entity.Role;
import com.mphasis.instabuy.userservice.entity.User;
import com.mphasis.instabuy.userservice.repository.UserRepository;
import com.mphasis.instabuy.userservice.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request.getEmail(), request.getPassword());
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @PutMapping("/{id}/wallet/deduct")
    public String deductWallet(@PathVariable Long id, @RequestParam Double amount) {
        userService.deductWallet(id, amount);
        return "Wallet deducted successfully";
    }

    @PutMapping("/{id}/wallet/add")
    public String addWallet(@PathVariable Long id, @RequestParam Double amount) {
        userService.addWallet(id, amount);
        return "Wallet added successfully";
    }
    @GetMapping("/admin")
    public User getAdmin() {
        return userRepository.findByRole(Role.ADMIN);
    }
}