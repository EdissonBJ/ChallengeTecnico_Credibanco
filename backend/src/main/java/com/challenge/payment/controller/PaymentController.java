package com.challenge.payment.controller;

import com.challenge.payment.dto.PaymentDto;
import com.challenge.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentDto.PaymentResponse> processPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentDto.PaymentRequest request) {
        PaymentDto.PaymentResponse response =
                paymentService.processPayment(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}
