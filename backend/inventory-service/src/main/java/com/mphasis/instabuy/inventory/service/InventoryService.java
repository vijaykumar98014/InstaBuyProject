package com.mphasis.instabuy.inventory.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.mphasis.instabuy.inventory.dto.ProductDTO;
import com.mphasis.instabuy.inventory.entity.Product;

public interface InventoryService {

    List<ProductDTO> getAllProducts();

    boolean checkStock(Long productId, int quantity);

    void reduceStock(Long productId, int quantity);

    void increaseStock(Long productId, int quantity);

	Product getProduct(Long id);

	void deleteProduct(Long productId);
	void updateProduct(Long id, ProductDTO dto);
	void addProduct(String name, float price, int quantity, MultipartFile file);

}
