package com.mphasis.instabuy.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.mphasis.instabuy.inventory.dto.ProductDTO;
import com.mphasis.instabuy.inventory.entity.Product;
import com.mphasis.instabuy.inventory.service.InventoryService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }
    


    @PostMapping("/admin/add")
    public String addProduct(
            @RequestParam String name,
            @RequestParam float price,
            @RequestParam int quantity,
            @RequestParam("image") MultipartFile file) {
    	System.out.println("FILE NAME: " + file.getOriginalFilename());
        System.out.println("FILE SIZE: " + file.getSize());


        service.addProduct(name, price, quantity, file);
        return "Product added successfully";
    }
    
    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/check")
    public boolean checkStock(@RequestParam Long productId,
                              @RequestParam int quantity) {
        return service.checkStock(productId, quantity);
    }

    @PostMapping("/reduce")
    public String reduceStock(@RequestParam Long productId,
                             @RequestParam int quantity) {
        service.reduceStock(productId, quantity);
        return "Stock reduced successfully";
    }

    @PostMapping("/admin/increase")
    public String increaseStock(@RequestParam Long productId,
                               @RequestParam int quantity) {
        service.increaseStock(productId, quantity);
        return "Stock increased successfully";
    }
    @DeleteMapping("/admin/delete")
    public String deleteProduct(@RequestParam Long productId) {
        service.deleteProduct(productId);
        return "Deleted";
    }
    @PostMapping("/admin/update")
    public String updateProduct(@RequestParam Long id, @RequestBody ProductDTO dto) {
        service.updateProduct(id, dto);
        return "Updated";
    }
}