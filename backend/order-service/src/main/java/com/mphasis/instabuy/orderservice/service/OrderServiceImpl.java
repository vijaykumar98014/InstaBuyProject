package com.mphasis.instabuy.orderservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mphasis.instabuy.orderservice.cart.CartManager;
import com.mphasis.instabuy.orderservice.client.InventoryClient;
import com.mphasis.instabuy.orderservice.client.PaymentClient;
import com.mphasis.instabuy.orderservice.client.UserClient;
import com.mphasis.instabuy.orderservice.dto.CartItemDTO;
import com.mphasis.instabuy.orderservice.dto.OrderRequest;
import com.mphasis.instabuy.orderservice.dto.OrderResponse;
import com.mphasis.instabuy.orderservice.dto.PaymentResponse;
import com.mphasis.instabuy.orderservice.dto.UserOrdersDTO;
import com.mphasis.instabuy.orderservice.entity.Order;
import com.mphasis.instabuy.orderservice.entity.OrderItem;
import com.mphasis.instabuy.orderservice.exception.CustomException;
import com.mphasis.instabuy.orderservice.repository.OrderItemRepository;
import com.mphasis.instabuy.orderservice.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartManager cartManager;

    @Autowired
    private InventoryClient inventoryClient;

    @Autowired
    private PaymentClient paymentClient;

    @Autowired
    private UserClient userClient;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public OrderResponse placeOrder(OrderRequest request, Long userId) {

        List<CartItemDTO> cartItems = cartManager.getCart(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("CREATED");
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());

        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItemDTO c : cartItems) {
            boolean stock = inventoryClient.checkStock(c.getProductId(), c.getQuantity());

            if (!stock) {
                throw new RuntimeException("Out of stock for product: " + c.getProductId());
            }
        }

        for (CartItemDTO c : cartItems) {
            OrderItem item = new OrderItem();
            item.setProductId(c.getProductId());
            item.setQuantity(c.getQuantity());
            item.setPrice(c.getPrice());
            item.setImageUrl(c.getImageUrl());
            item.setProductName(c.getProductName());
            item.setTotalPrice(c.getPrice() * c.getQuantity());
            item.setOrder(order);

            total += item.getTotalPrice();
            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        // SAVE ORDER FIRST
        Order saved = orderRepository.save(order);

     // PAYMENT LOGIC
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {

            // CALL payment service with COD
            paymentClient.processPayment(
                userId,
                saved.getOrderId(),
                total,
                request.getPaymentMethod()
            );

            saved.setPaymentStatus("CASH_ON_DELIVERY");
            saved.setOrderStatus("CONFIRMED");

        } else  {

            // ONLINE → call payment service
            PaymentResponse payment = paymentClient.processPayment(
                    userId,
                    saved.getOrderId(),
                    total,
                    request.getPaymentMethod()
            );

            if (!"SUCCESS".equalsIgnoreCase(payment.getStatus())) {
                OrderResponse res = new OrderResponse();
                res.setStatus("FAILED");
                return res;
            }

            saved.setPaymentStatus("PAID");
            saved.setOrderStatus("CONFIRMED");
        }

        // REDUCE STOCK AFTER PAYMENT
        for (CartItemDTO c : cartItems) {
            inventoryClient.reduceStock(c.getProductId(), c.getQuantity());
        }

        saved.setOrderStatus("CONFIRMED");

        orderRepository.save(saved);

        OrderResponse res = new OrderResponse();
        res.setAmount(total);
        res.setCartList(cartItems);
        res.setStatus(saved.getOrderStatus());
        res.setOrderId(saved.getOrderId());

        cartManager.clearCart(userId);

        return res;
    }

    @Override
    public Order updateDetails(Long orderId, String address, long phone) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));

        order.setShippingAddress(address);
        order.setPhone(phone);

        return orderRepository.save(order);
    }

    @Override
    public String cancelOrder(Long orderId) {
    		
    	System.out.println("Cancel called for orderId: " + orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));

        // already cancelled
        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            return "Already cancelled";
        }

        // 🔥 only confirmed orders can cancel
        if (!"CONFIRMED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Only confirmed orders can be cancelled");
        }

        // 🔥 restore stock
        for (OrderItem item : order.getItems()) {
            inventoryClient.increaseStock(
                    item.getProductId(),
                    item.getQuantity()
            );
        }

        // 🔥 ONLY CANCEL (NO REFUND HERE)
        order.setOrderStatus("CANCELLED");
        if ("CASH_ON_DELIVERY".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("CANCELLED");
        } else {
            order.setPaymentStatus("PENDING");
        }

        orderRepository.save(order);

        return "Order cancelled successfully. Waiting for admin refund.";
    }
    @Override
    public Order updateStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));

        order.setOrderStatus(status);

        // 🔥 ADD THIS LOGIC
        if ("DELIVERED".equalsIgnoreCase(status) &&
            "CASH_ON_DELIVERY".equalsIgnoreCase(order.getPaymentStatus())) {

            // 1. Order table update
            order.setPaymentStatus("SUCCESS");

            // 2. Payment table update
            paymentClient.updatePaymentStatus(
                    order.getOrderId(),
                    "SUCCESS"
            );
        }

        return orderRepository.save(order);
    }
    @Override
    public String refundOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));

        if (!"CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Refund allowed only for cancelled orders");
        }

        if ("REFUND_DONE".equalsIgnoreCase(order.getPaymentStatus())) {
            return "Already refunded";
        }

        // 🔥 CALL PAYMENT SERVICE
        paymentClient.refund(
                order.getUserId(),
                order.getOrderId(),
                order.getTotalAmount()
        );

        // 🔥 UPDATE STATUS
        order.setPaymentStatus("REFUNDED");

        orderRepository.save(order);

        return "Refund successful";
    }
    @Override
    public List<Order> getOrdersByUser(Long userId) {

        List<Order> orders = orderRepository.findByUserId(userId);

        for (Order o : orders) {
            o.setItems(orderItemRepository.findByOrderOrderId(o.getOrderId()));
        }

        return orders;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Override
    public List<OrderItem> getItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderOrderId(orderId);
    }
    
    @Override
    public List<UserOrdersDTO> getOrdersGroupedByUser() {

        List<Order> allOrders = orderRepository.findAll();

        Map<Long, List<Order>> map = new HashMap<>();

        for (Order order : allOrders) {
            Long userId = order.getUserId();

            if (!map.containsKey(userId)) {
                map.put(userId, new ArrayList<>());
            }

            map.get(userId).add(order);
        }

        List<UserOrdersDTO> result = new ArrayList<>();

        for (Long userId : map.keySet()) {
            result.add(new UserOrdersDTO(userId, map.get(userId)));
        }

        return result;
    }
}