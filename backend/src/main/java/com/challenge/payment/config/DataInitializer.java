package com.challenge.payment.config;

import com.challenge.payment.model.Product;
import com.challenge.payment.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            Product product = new Product();
            product.setName("Premium Developer Bootcamp");
            product.setDescription("Complete Java + Spring Boot + Microservices training. " +
                                   "12 weeks of hands-on content, live mentorship, and career support. " +
                                   "Build production-ready applications from day one.");
            product.setPrice(new BigDecimal("299.99"));
            product.setCurrency("USD");
            product.setImageUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80");
            product.setAvailable(true);

            productRepository.save(product);
            log.info("Initial product seeded: {}", product.getName());
        }
    }
}
