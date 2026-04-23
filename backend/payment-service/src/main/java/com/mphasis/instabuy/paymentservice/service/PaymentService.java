package com.mphasis.instabuy.paymentservice.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mphasis.instabuy.paymentservice.dto.PaymentResponse;
import com.mphasis.instabuy.paymentservice.dto.UserDTO;
import com.mphasis.instabuy.paymentservice.entity.Payment;
import com.mphasis.instabuy.paymentservice.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.user-service.base-url}")
    private String userServiceBaseUrl;


    public PaymentResponse processPayment(Long userId, Long orderId, Double amount, String paymentMethod) {

        String userUrl = userServiceBaseUrl + "/api/users/" + userId;

        UserDTO user = restTemplate.getForObject(userUrl, UserDTO.class);

        PaymentResponse res = new PaymentResponse();
        
        if ("COD".equalsIgnoreCase(paymentMethod)) {

            Payment payment = new Payment();
            payment.setUserId(userId);
            payment.setOrderId(orderId);
            payment.setAmount(amount);
            payment.setStatus("CASH_ON_DELIVERY");
            payment.setPaymentMethod("COD");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setTransactionId(UUID.randomUUID().toString());

            paymentRepository.save(payment);

            res.setStatus("CASH_ON_DELIVERY");
            res.setTransactionId(payment.getTransactionId());

            return res;
        }

        // WALLET CHECK
        if (user == null || user.getWallet() == null || user.getWallet() < amount) {
            res.setStatus("FAILED");
            res.setTransactionId(null);
            return res;
        }

        // DEDUCT FROM USER
        String deductUserUrl = userServiceBaseUrl + "/api/users/" + userId + "/wallet/deduct?amount=" + amount;
        restTemplate.put(deductUserUrl, null);

        // ADD TO ADMIN
        Long adminId = getAdminId();
        String addAdminUrl = userServiceBaseUrl + "/api/users/" + adminId + "/wallet/add?amount=" + amount;
        restTemplate.put(addAdminUrl, null);

        // SAVE PAYMENT
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setStatus("SUCCESS");
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(UUID.randomUUID().toString());

        paymentRepository.save(payment);

        res.setStatus("SUCCESS");
        res.setTransactionId(payment.getTransactionId());

        return res;
    }

    public PaymentResponse refund(Long userId, Long orderId, Double amount) {

        // ADD BACK TO USER
        String addUserUrl = userServiceBaseUrl + "/api/users/" + userId + "/wallet/add?amount=" + amount;
        restTemplate.put(addUserUrl, null);

        // DEDUCT FROM ADMIN
        Long adminId = getAdminId();
        String deductAdminUrl = userServiceBaseUrl + "/api/users/" + adminId + "/wallet/deduct?amount=" + amount;
        restTemplate.put(deductAdminUrl, null);

        // SAVE PAYMENT
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setStatus("REFUND");
        payment.setPaymentMethod("WALLET");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(UUID.randomUUID().toString());

        paymentRepository.save(payment);

        PaymentResponse res = new PaymentResponse();
        res.setStatus("REFUNDED");
        res.setTransactionId(payment.getTransactionId());

        return res;
    }
    public String updatePaymentStatus(Long orderId, String status) {

        Payment payment = paymentRepository.findByOrderId(orderId);

        payment.setStatus(status);

        paymentRepository.save(payment);

        return "Updated";
    }
    
    private Long getAdminId() {
        String url = userServiceBaseUrl + "/api/users/admin";
        UserDTO admin = restTemplate.getForObject(url, UserDTO.class);
        return admin.getId();
    }
}