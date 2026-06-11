package com.challenge.payment.service;

import com.challenge.payment.dto.CreditCardDto;
import com.challenge.payment.exception.BadRequestException;
import com.challenge.payment.model.CreditCard;
import com.challenge.payment.model.User;
import com.challenge.payment.repository.CreditCardRepository;
import com.challenge.payment.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreditCardService {

    private final CreditCardRepository creditCardRepository;
    private final UserRepository userRepository;

    public CreditCardService(CreditCardRepository creditCardRepository,
                             UserRepository userRepository) {
        this.creditCardRepository = creditCardRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CreditCardDto.CardResponse enrollCard(String userEmail, CreditCardDto.EnrollRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        validateCardExpiry(request.getExpiryDate());

        String lastFour = request.getCardNumber()
                .substring(request.getCardNumber().length() - 4);
        String brand = detectCardBrand(request.getCardNumber());

        CreditCard card = new CreditCard();
        card.setUser(user);
        card.setLastFourDigits(lastFour);
        card.setCardholderName(request.getCardholderName().toUpperCase());
        card.setExpiryDate(request.getExpiryDate());
        card.setCardBrand(brand);
        card.setActive(true);

        CreditCard saved = creditCardRepository.save(card);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CreditCardDto.CardResponse> getUserCards(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return creditCardRepository.findByUserIdAndActiveTrue(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateCardExpiry(String expiryDate) {
        try {
            LocalDate expiry = LocalDate.parse("01/" + expiryDate,
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            if (expiry.isBefore(LocalDate.now().withDayOfMonth(1))) {
                throw new BadRequestException("Card is expired");
            }
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Invalid expiry date format");
        }
    }

    private String detectCardBrand(String cardNumber) {
        String clean = cardNumber.replaceAll("\\s", "");
        if (clean.startsWith("4")) return "VISA";
        if (clean.startsWith("5") || clean.startsWith("2")) return "MASTERCARD";
        if (clean.startsWith("3")) return "AMEX";
        return "UNKNOWN";
    }

    private CreditCardDto.CardResponse mapToResponse(CreditCard card) {
        CreditCardDto.CardResponse response = new CreditCardDto.CardResponse();
        response.setId(card.getId());
        response.setLastFourDigits(card.getLastFourDigits());
        response.setCardholderName(card.getCardholderName());
        response.setExpiryDate(card.getExpiryDate());
        response.setCardBrand(card.getCardBrand());
        response.setActive(card.getActive());
        response.setEnrolledAt(card.getEnrolledAt());
        return response;
    }
}
