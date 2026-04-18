package com.mphasis.instabuy.inventory.service.impl;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mphasis.instabuy.inventory.dto.ProductDTO;
import com.mphasis.instabuy.inventory.entity.Product;
import com.mphasis.instabuy.inventory.exception.ResourceNotFoundException;
import com.mphasis.instabuy.inventory.repository.ProductRepository;
import com.mphasis.instabuy.inventory.service.InventoryService;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final ProductRepository repository;

    public InventoryServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return repository.findAll()
                .stream()
                .map(p -> new ProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getQuantity(),
                        p.getImageUrl()   // ✅ image added
                ))
                .collect(Collectors.toList());
    }

    @Override
    public boolean checkStock(Long productId, int quantity) {
        Product p = repository.findById(productId).orElse(null);
        return p != null && quantity > 0 && p.getQuantity() >= quantity;
    }

    @Override
    public void reduceStock(Long productId, int quantity) {
        Product p = repository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (quantity > p.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }

        p.setQuantity(p.getQuantity() - quantity);
        repository.save(p);
    }

    @Override
    public void increaseStock(Long productId, int quantity) {
        Product p = repository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        p.setQuantity(p.getQuantity() + quantity);
        repository.save(p);
    }

    @Override
    public Product getProduct(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    // ✅ NEW METHOD (IMAGE SUPPORT)
    @Override
    public void addProduct(String name, float price, int quantity, MultipartFile file) {

        if (price <= 0 || quantity < 0) {
            throw new RuntimeException("Invalid price or quantity");
        }

        String original = file.getOriginalFilename().replaceAll("\\s+", "_");
        String fileName = System.currentTimeMillis() + "_" + original;

        try {
            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());   // ✅ folder auto create
            Files.write(path, file.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }

        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setQuantity(quantity);

        // ✅ IMPORTANT
        p.setImageUrl("http://localhost:8083/uploads/" + fileName);

        repository.save(p);
    }

    @Override
    public void deleteProduct(Long productId) {
        repository.deleteById(productId);
    }

    @Override
    public void updateProduct(Long id, ProductDTO dto) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (dto.getPrice() <= 0 || dto.getQuantity() < 0) {
            throw new RuntimeException("Invalid price or quantity");
        }

        p.setName(dto.getName());
        p.setPrice(dto.getPrice());
        p.setQuantity(dto.getQuantity());

        // ❗ image update optional (abhi skip)
        repository.save(p);
    }
}