package com.mphasis.instabuy.paymentservice.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mphasis.instabuy.paymentservice.dto.PaymentRequest;
import com.mphasis.instabuy.paymentservice.dto.PaymentResponse;
import com.mphasis.instabuy.paymentservice.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public PaymentResponse pay(@RequestBody PaymentRequest request) {
        return paymentService.processPayment(
                request.getUserId(),
                request.getOrderId(),
                request.getAmount(),
                request.getPaymentMethod()
        );
    }

    @PostMapping("/refund")
    public PaymentResponse refund(@RequestBody PaymentRequest request) {
        return paymentService.refund(
                request.getUserId(),
                request.getOrderId(),
                request.getAmount()
        );
    }
    @PostMapping("/update-status")
    public String updateStatus(@RequestBody Map<String, Object> req) {
        Long orderId = Long.valueOf(req.get("orderId").toString());
        String status = req.get("status").toString();

        return paymentService.updatePaymentStatus(orderId, status);
    }
}
