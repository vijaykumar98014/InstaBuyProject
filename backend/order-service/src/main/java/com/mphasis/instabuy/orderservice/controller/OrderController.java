package com.mphasis.instabuy.orderservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mphasis.instabuy.orderservice.cart.CartManager;
import com.mphasis.instabuy.orderservice.client.InventoryClient;
import com.mphasis.instabuy.orderservice.dto.CartItemDTO;
import com.mphasis.instabuy.orderservice.dto.OrderRequest;
import com.mphasis.instabuy.orderservice.dto.OrderResponse;
import com.mphasis.instabuy.orderservice.service.OrderService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private CartManager cartManager;

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private InventoryClient inventoryClient;

   
    
    @PostMapping("/cart/add/{userId}")
    public ResponseEntity<String> addToCart(@PathVariable Long userId,
                                           @RequestBody CartItemDTO item) {

        boolean stock = inventoryClient.checkStock(item.getProductId(), item.getQuantity());

        if (!stock) {
            return ResponseEntity.badRequest().body("Out of stock");
        }

        cartManager.addToCart(userId, item);
        return ResponseEntity.ok("Item added");
    }

    @GetMapping("/cart/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartManager.getCart(userId));
    }
//    @DeleteMapping("/cart/remove/{userId}/{productId}")
//    public ResponseEntity<String> removeFromCart(@PathVariable Long userId,
//                                                 @PathVariable Long productId) {
//
//        cartManager.removeFromCart(userId, productId);
//        return ResponseEntity.ok("Item removed from cart");
//    }
    
    @GetMapping("/cart/remove/{userId}/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long userId,
                                                 @PathVariable Long productId) {

        cartManager.removeFromCart(userId, productId);
        return ResponseEntity.ok("Item removed");
    }
    @PostMapping("/place/{userId}")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request,@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.placeOrder(request,userId));
    }
    
    @PostMapping("/refund/{orderId}")
    public String refundOrder(@PathVariable Long orderId) {
        return orderService.refundOrder(orderId);
    }
}