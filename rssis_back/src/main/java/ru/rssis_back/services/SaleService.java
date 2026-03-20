package ru.rssis_back.services;


import org.springframework.stereotype.Service;
import ru.rssis_back.dto.ProductForReceiptData;
import ru.rssis_back.repositories.SaleRepository;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public void addSale(List<ProductForReceiptData> products, String login, String status) {
        saleRepository.addSale(products, login, status);
    }
}
