package com.challenge.payment.controller;

import com.challenge.payment.dto.CreditCardDto;
import com.challenge.payment.service.CreditCardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credit-cards")
public class CreditCardController {

    private final CreditCardService creditCardService;

    public CreditCardController(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    @PostMapping("/enroll")
    public ResponseEntity<CreditCardDto.CardResponse> enrollCard(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreditCardDto.EnrollRequest request) {
        CreditCardDto.CardResponse response =
                creditCardService.enrollCard(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CreditCardDto.CardResponse>> getUserCards(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                creditCardService.getUserCards(userDetails.getUsername()));
    }
}
