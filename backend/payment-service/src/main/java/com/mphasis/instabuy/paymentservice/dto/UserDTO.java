package com.mphasis.instabuy.paymentservice.dto;

public class UserDTO {

    private Long id;
    private String name;
    private Double wallet;
    private String role;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getWallet() { return wallet; }
    public void setWallet(Double wallet) { this.wallet = wallet; }
}