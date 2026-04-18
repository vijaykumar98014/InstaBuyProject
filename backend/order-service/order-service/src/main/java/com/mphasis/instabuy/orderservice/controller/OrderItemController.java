package com.mphasis.instabuy.orderservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mphasis.instabuy.orderservice.dto.UserOrdersDTO;
import com.mphasis.instabuy.orderservice.entity.Order;
import com.mphasis.instabuy.orderservice.entity.OrderItem;
import com.mphasis.instabuy.orderservice.service.OrderService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderService orderService;

    //  ADMIN: get all orders
    @GetMapping("/admin/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
    //  USER: get all orders
    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    //  USER: update address & phone
    @PutMapping("/update/{orderId}")
    public Order updateDetails(@PathVariable Long orderId,
                               @RequestParam String address,
                               @RequestParam long phone) {
        return orderService.updateDetails(orderId, address, phone);
    }

    //  USER: cancel order
    @PostMapping("/cancel/{orderId}")
    public String cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }

    //  ADMIN: update status
    @PutMapping("/status/{orderId}")
    public Order updateStatus(@PathVariable Long orderId,
                             @RequestParam String status) {
        return orderService.updateStatus(orderId, status);
    }
    
    @PostMapping("/refund/{orderId}")
    public String refundOrder(@PathVariable Long orderId) {
        return orderService.refundOrder(orderId);
    }
    
    @GetMapping("/{orderId}")
    public List<OrderItem> getItemsByOrderId(@PathVariable Long orderId) {
        return orderService.getItemsByOrderId(orderId);
    }

    @GetMapping("/admin/grouped")
    public List<UserOrdersDTO> getGroupedOrders() {
        return orderService.getOrdersGroupedByUser();
    }
}