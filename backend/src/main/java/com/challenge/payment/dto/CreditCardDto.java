package com.challenge.payment.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class CreditCardDto {

    public static class EnrollRequest {
        @NotBlank(message = "Card number is required")
        @Pattern(regexp = "\\d{13,19}", message = "Card number must be 13-19 digits")
        private String cardNumber;

        @NotBlank(message = "Cardholder name is required")
        @Size(min = 2, max = 50)
        private String cardholderName;

        @NotBlank(message = "Expiry date is required")
        @Pattern(regexp = "^(0[1-9]|1[0-2])\\/\\d{4}$", message = "Expiry date format must be MM/YYYY")
        private String expiryDate;

        @NotBlank(message = "CVV is required")
        @Pattern(regexp = "\\d{3,4}", message = "CVV must be 3 or 4 digits")
        private String cvv;

        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

        public String getCardholderName() { return cardholderName; }
        public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }

        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }
    }

    public static class CardResponse {
        private Long id;
        private String lastFourDigits;
        private String cardholderName;
        private String expiryDate;
        private String cardBrand;
        private Boolean active;
        private LocalDateTime enrolledAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getLastFourDigits() { return lastFourDigits; }
        public void setLastFourDigits(String lastFourDigits) { this.lastFourDigits = lastFourDigits; }

        public String getCardholderName() { return cardholderName; }
        public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }

        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

        public String getCardBrand() { return cardBrand; }
        public void setCardBrand(String cardBrand) { this.cardBrand = cardBrand; }

        public Boolean getActive() { return active; }
        public void setActive(Boolean active) { this.active = active; }

        public LocalDateTime getEnrolledAt() { return enrolledAt; }
        public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
    }
}
