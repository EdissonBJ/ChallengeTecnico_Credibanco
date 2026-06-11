package com.challenge.payment.service;

import com.challenge.payment.dto.PaymentDto;
import com.challenge.payment.exception.BadRequestException;
import com.challenge.payment.exception.ResourceNotFoundException;
import com.challenge.payment.model.CreditCard;
import com.challenge.payment.model.Product;
import com.challenge.payment.model.Transaction;
import com.challenge.payment.model.User;
import com.challenge.payment.repository.CreditCardRepository;
import com.challenge.payment.repository.ProductRepository;
import com.challenge.payment.repository.TransactionRepository;
import com.challenge.payment.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CreditCardRepository creditCardRepository;

    public PaymentService(TransactionRepository transactionRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository,
                          CreditCardRepository creditCardRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.creditCardRepository = creditCardRepository;
    }

    @Transactional
    public PaymentDto.PaymentResponse processPayment(String userEmail, PaymentDto.PaymentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (!product.getAvailable()) {
            throw new BadRequestException("Product is not available for purchase");
        }

        CreditCard card = creditCardRepository
                .findByIdAndUserId(request.getCreditCardId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Credit card not found or does not belong to this user"));

        if (!card.getActive()) {
            throw new BadRequestException("Selected credit card is inactive");
        }

        Transaction transaction = new Transaction();
        transaction.setTransactionRef(UUID.randomUUID().toString());
        transaction.setUser(user);
        transaction.setProduct(product);
        transaction.setCreditCard(card);
        transaction.setAmount(product.getPrice());
        transaction.setCurrency(product.getCurrency());
        transaction.setStatus(Transaction.Status.PENDING);

        // Payment simulation logic
        Transaction.Status resultStatus;
        String statusMessage;

        String lastFour = card.getLastFourDigits();
        // Cards ending in 0000 simulate decline; 9999 simulate processor failure
        if (lastFour.equals("0000")) {
            resultStatus = Transaction.Status.DECLINED;
            statusMessage = "Transaction declined by issuer";
        } else if (lastFour.equals("9999")) {
            resultStatus = Transaction.Status.FAILED;
            statusMessage = "Payment processor temporarily unavailable";
        } else {
            resultStatus = Transaction.Status.APPROVED;
            statusMessage = "Payment approved successfully";
        }

        transaction.setStatus(resultStatus);
        transaction.setStatusMessage(statusMessage);
        Transaction saved = transactionRepository.save(transaction);

        log.info("Payment processed: ref={} status={} user={} amount={}",
                saved.getTransactionRef(), resultStatus, userEmail, product.getPrice());

        PaymentDto.PaymentResponse response = new PaymentDto.PaymentResponse();
        response.setTransactionRef(saved.getTransactionRef());
        response.setStatus(resultStatus.name());
        response.setStatusMessage(statusMessage);
        response.setAmount(saved.getAmount());
        response.setCurrency(saved.getCurrency());
        response.setProductName(product.getName());
        response.setCardLastFour(card.getLastFourDigits());
        response.setProcessedAt(saved.getCreatedAt());
        return response;
    }
}
