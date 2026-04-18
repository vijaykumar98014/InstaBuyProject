package com.mphasis.instabuy.inventory.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.mphasis.instabuy.inventory.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}