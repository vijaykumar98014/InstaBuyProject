package com.mphasis.instabuy.orderservice.cart;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.mphasis.instabuy.orderservice.dto.CartItemDTO;

@Component
public class CartManager {

    private Map<Long, List<CartItemDTO>> cartData = new HashMap<>();

    public void addToCart(Long userId, CartItemDTO item) {

        List<CartItemDTO> cart = cartData.computeIfAbsent(userId, k -> new ArrayList<>());

        for (CartItemDTO existingItem : cart) {
            if (existingItem.getProductId().equals(item.getProductId())) {
                // product already exists → increase quantity
                existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                return;
            }
        }

        cart.add(item);
    }

//    public List<CartItemDTO> getCart(Long userId) {
//    	List<CartItemDTO>listofitem=new ArrayList<>();
//      return cartData.getOrDefault(userId, new ArrayList<>());
//    	listofitem=cartData.get(userId);
//    	return listofitem;
//    }
    
    public List<CartItemDTO> getCart(Long userId) {
        return cartData.getOrDefault(userId, new ArrayList<>());
    }
    public void removeFromCart(Long userId, Long productId) {
        List<CartItemDTO> cart = cartData.get(userId);

        if (cart != null) {
            cart.removeIf(item -> item.getProductId().equals(productId));
        }
    }
    public void clearCart(Long userId) {
        cartData.remove(userId);
    }
}