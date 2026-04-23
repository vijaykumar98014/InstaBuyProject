package com.mphasis.instabuy.orderservice.dto;

import java.util.ArrayList;
import java.util.List;

public class OrderResponse {

    private Long orderId;
    private String status;
    private Double amount;
    private List<CartItemDTO>cartList=new ArrayList<>();

    public List<CartItemDTO> getCartList() {
		return cartList;
	}
	public void setCartList(List<CartItemDTO> cartList) {
		this.cartList = cartList;
	}
	public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}