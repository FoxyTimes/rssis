package ru.rssis_back.services;

import org.springframework.stereotype.Service;
import ru.rssis_back.dto.ProductData;
import ru.rssis_back.repositories.ProductRepository;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;


    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public int getTotalProductsWithSearch(String search) {
        return productRepository.countAllProductsWithSearch(search);
    }

    public List<ProductData> getAllProductsWithSearch(int page, int limit, String search) {
        int offset = (page - 1) * limit;
        return productRepository.getProductsWithOffsetAndLimitAndSearch(offset, limit, search);
    }
}
