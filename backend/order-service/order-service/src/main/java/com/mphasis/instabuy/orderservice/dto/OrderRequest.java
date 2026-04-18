package com.mphasis.instabuy.orderservice.dto;

public class OrderRequest {

    private Long userId;
    private String shippingAddress;
    private long phone;
    private String paymentMethod; // NEW FIELD

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public long getPhone() { return phone; }
    public void setPhone(long phone) { this.phone = phone; }

    // NEW getter & setter
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}