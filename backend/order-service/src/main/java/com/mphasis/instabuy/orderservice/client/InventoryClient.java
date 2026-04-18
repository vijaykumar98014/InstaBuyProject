package com.mphasis.instabuy.orderservice.client;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class InventoryClient {

    @Autowired
    private RestTemplate restTemplate;

    public boolean checkStock(Long productId, int quantity) {

        String url = "http://localhost:8083/api/inventory/check?productId=" 
                     + productId + "&quantity=" + quantity;

        Boolean response = restTemplate.getForObject(url, Boolean.class);

        return response != null && response;
    } 
    public void reduceStock(Long productId, int quantity) {

        String url = "http://localhost:8083/api/inventory/reduce";

        String request = "?productId=" + productId + "&quantity=" + quantity;

        restTemplate.postForObject(url + request, null, String.class);
    }
    public void updateStock(Long productId, int quantity) {

        String url = "http://localhost:8083/api/inventory/increase";

        String request = "?productId=" + productId + "&quantity=" + quantity;

        restTemplate.postForObject(url + request, null, String.class);
    }
    public void increaseStock(Long productId, int quantity) {

        String url = "http://localhost:8083/api/inventory/admin/increase";

        String request = "?productId=" + productId + "&quantity=" + quantity;

        restTemplate.postForObject(url + request, null, String.class);
    }
   
}