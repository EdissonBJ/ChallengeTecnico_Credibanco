package com.challenge.payment.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    public static class PaymentRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Credit card ID is required")
        private Long creditCardId;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Long getCreditCardId() { return creditCardId; }
        public void setCreditCardId(Long creditCardId) { this.creditCardId = creditCardId; }
    }

    public static class PaymentResponse {
        private String transactionRef;
        private String status;
        private String statusMessage;
        private BigDecimal amount;
        private String currency;
        private String productName;
        private String cardLastFour;
        private LocalDateTime processedAt;

        public String getTransactionRef() { return transactionRef; }
        public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getStatusMessage() { return statusMessage; }
        public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getCardLastFour() { return cardLastFour; }
        public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }

        public LocalDateTime getProcessedAt() { return processedAt; }
        public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    }
}
