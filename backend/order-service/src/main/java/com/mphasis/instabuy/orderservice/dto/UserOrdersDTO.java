package com.mphasis.instabuy.orderservice.dto;


import java.util.List;
import com.mphasis.instabuy.orderservice.entity.Order;

public class UserOrdersDTO {

    private Long userId;
    private List<Order> orders;

    public UserOrdersDTO(Long userId, List<Order> orders) {
        this.userId = userId;
        this.orders = orders;
    }

    public Long getUserId() { return userId; }
    public List<Order> getOrders() { return orders; }
}