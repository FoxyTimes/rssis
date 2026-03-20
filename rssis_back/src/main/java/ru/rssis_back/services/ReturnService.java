package ru.rssis_back.services;

import org.springframework.stereotype.Service;
import ru.rssis_back.dto.ProductForReceiptToReturnData;
import ru.rssis_back.dto.ReturnReasonData;
import ru.rssis_back.repositories.ReturnRepository;

import java.util.List;

@Service
public class ReturnService {

    private final ReturnRepository returnRepository;

    public ReturnService(ReturnRepository returnRepository) {
        this.returnRepository = returnRepository;
    }

    public void addReturn(List<ProductForReceiptToReturnData> products, String login) {
        returnRepository.addReturn(products, login);
    }

    public List<ReturnReasonData> getReasons() {
        return returnRepository.getReasons();
    }
}
