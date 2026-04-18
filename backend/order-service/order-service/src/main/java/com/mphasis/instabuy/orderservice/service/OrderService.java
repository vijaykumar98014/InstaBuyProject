package com.mphasis.instabuy.orderservice.service;

import java.util.List;
import com.mphasis.instabuy.orderservice.dto.OrderRequest;
import com.mphasis.instabuy.orderservice.dto.OrderResponse;
import com.mphasis.instabuy.orderservice.dto.UserOrdersDTO;
import com.mphasis.instabuy.orderservice.entity.Order;
import com.mphasis.instabuy.orderservice.entity.OrderItem;

public interface OrderService {

    OrderResponse placeOrder(OrderRequest request,Long userId);  

    Order updateDetails(Long orderId, String address, long phone);

    String cancelOrder(Long orderId);

    Order updateStatus(Long orderId, String status);

    List<Order> getOrdersByUser(Long userId);

	List<Order> getAllOrders();

	String refundOrder(Long orderId);

	List<OrderItem> getItemsByOrderId(Long orderId);
	List<UserOrdersDTO> getOrdersGroupedByUser();
}