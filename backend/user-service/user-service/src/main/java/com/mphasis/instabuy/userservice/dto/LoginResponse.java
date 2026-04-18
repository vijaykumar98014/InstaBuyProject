package com.mphasis.instabuy.userservice.dto;

public class LoginResponse {
 private String name;
 private long id;
 private double walletBalance;
 private String token;

 public double getWalletBalance() {
	return walletBalance;
}

 public void setWalletBalance(double walletBalance) {
	this.walletBalance = walletBalance;
 }

 public void setId(long id) {
	this.id = id;
}

 public long getId() {
	return id;
}
 public String getName() {
	return name;
 }

 public void setName(String name) {
	this.name = name;
 }
 public String getToken() { return token; }
 public void setToken(String token) { this.token = token; }

}


