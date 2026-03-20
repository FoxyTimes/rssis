package ru.rssis_back.services;

import org.springframework.stereotype.Service;
import ru.rssis_back.dto.ProductForReceiptData;
import ru.rssis_back.dto.SaleData;
import ru.rssis_back.repositories.SaleRepository;

import java.util.List;

@Service
public class    ReportService {

    private final SaleRepository saleRepository;


    public ReportService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }


    public List<SaleData> getAllSalesWithSearch(int page, int limit, String search) {
        int offset = (page - 1) * limit;
        return saleRepository.getSalesWithOffsetAndLimitAndSearch(offset, limit, search);
    }

    public int getTotalSalesWithSearch(String search) {
        return saleRepository.getTotalSalesWithSearch(search);
    }

    public List<ProductForReceiptData> getProductsForReceiptById(int id) {
        return saleRepository.getProductsForReceiptById(id);
    }

    public int getTotalSalesWithStatusWithSearch(String status, String search) {
        return saleRepository.getTotalSalesWithStatusWithSearch(status, search);
    }

}
