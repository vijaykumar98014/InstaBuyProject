package com.mphasis.instabuy.userservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mphasis.instabuy.userservice.entity.Role;
import com.mphasis.instabuy.userservice.entity.User;

public interface UserRepository extends JpaRepository<User,Long>{
	
	User findByRole(Role role);
    Optional<User> findByEmail(String email);
}
