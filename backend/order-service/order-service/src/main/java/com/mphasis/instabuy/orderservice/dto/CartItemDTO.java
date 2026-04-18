package com.mphasis.instabuy.orderservice.dto;

public class CartItemDTO {

    private Long productId;
    private int quantity;
    private double price;

    private String imageUrl;    
    private String productName; 

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

   
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}