package com.challenge.payment.service;

import com.challenge.payment.dto.ProductDto;
import com.challenge.payment.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAvailableProducts() {
        return productRepository.findByAvailableTrue()
                .stream()
                .map(p -> {
                    ProductDto dto = new ProductDto();
                    dto.setId(p.getId());
                    dto.setName(p.getName());
                    dto.setDescription(p.getDescription());
                    dto.setPrice(p.getPrice());
                    dto.setCurrency(p.getCurrency());
                    dto.setImageUrl(p.getImageUrl());
                    dto.setAvailable(p.getAvailable());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
