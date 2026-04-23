package com.mphasis.instabuy.orderservice.client;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {

    @Autowired
    private RestTemplate restTemplate;


    public boolean validateUser(Long userId) {

//        String url = "http://localhost:8085/api/users/" + userId;
//
//        Object response = restTemplate.getForObject(url, Object.class);
//
//        return response != null;
    	return true;
    }
    
}