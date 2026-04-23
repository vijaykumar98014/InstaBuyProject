package com.mphasis.instabuy.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mphasis.instabuy.paymentservice.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	Payment findByOrderId(Long orderId);
}