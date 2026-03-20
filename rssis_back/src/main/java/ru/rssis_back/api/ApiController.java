package ru.rssis_back.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.rssis_back.dto.*;
import ru.rssis_back.services.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api", produces = "application/json;charset=UTF-8")
public class ApiController {

    @Autowired
    private ProductService productService;
    @Autowired
    private AuthService authService;
    @Autowired
    private SaleService saleService;
    @Autowired
    private ReportService reportService;
    @Autowired
    private ReturnService returnService;

    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getProductsRequest(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "") String search) {

        Map<String, Object> response = new HashMap<>();

        List<ProductData> productData = productService.getAllProductsWithSearch(page, limit, search);
        long total = productService.getTotalProductsWithSearch(search);

        System.out.println(productData);

        response.put("data", productData);

        Map<String, Object> meta = new HashMap<>();
        meta.put("total", total);

        response.put("meta", meta);


        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginRequest(@RequestBody LoginData loginData) {

        String token = authService.tryLogin(loginData.getUsername(), loginData.getPincode());

        Map<String, Object> response = new HashMap<>();

        System.out.println("token: " + token);

        if (token != null) {
            response.put("token", token);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/add_sale")
    public ResponseEntity<Map<String, Object>> addSaleRequest(@RequestBody List<ProductForReceiptData> products,
                                                              Authentication authentication,
                                                              @RequestParam String status) {
        Map<String, Object> response = new HashMap<>();

        String login = (String) authentication.getPrincipal();

        saleService.addSale(products, login, status);


        return ResponseEntity.ok(response);
    }

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesRequest(@RequestParam(defaultValue = "1") int page,
                                                               @RequestParam(defaultValue = "20") int limit,
                                                               @RequestParam(defaultValue = "") String search) {
        Map<String, Object> response = new HashMap<>();

        List<SaleData> saleData = reportService.getAllSalesWithSearch(page, limit, search);
        long total = reportService.getTotalSalesWithSearch(search);
        long totalSalesComplete = reportService.getTotalSalesWithStatusWithSearch("completed", search);
        long totalSalesCanceled = reportService.getTotalSalesWithStatusWithSearch("canceled", search);

        response.put("data", saleData);

        Map<String, Object> meta = new HashMap<>();
        meta.put("total", total);
        meta.put("totalSalesComplete", totalSalesComplete);
        meta.put("totalSalesCanceled", totalSalesCanceled);

        response.put("meta", meta);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get_receipt")
    public ResponseEntity<Map<String, Object>> getReceiptRequest(@RequestParam int receipt_id) {
        Map<String, Object> response = new HashMap<>();

        System.out.println("receipt_id: " + receipt_id);


        List<ProductForReceiptData> productsForReceipt = reportService.getProductsForReceiptById(receipt_id);

        response.put("data", productsForReceipt);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/add_return")
    public ResponseEntity<Map<String, Object>> addReturnRequest(@RequestBody List<ProductForReceiptToReturnData> products, Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        String login = (String) authentication.getPrincipal();

        returnService.addReturn(products, login);


        return ResponseEntity.ok(response);
    }

    @GetMapping("/reasons")
    public ResponseEntity<Map<String, Object>> getReasonsRequest() {
        Map<String, Object> response = new HashMap<>();

        List<ReturnReasonData> returnReasonsData = returnService.getReasons();

        response.put("data", returnReasonsData);

        return ResponseEntity.ok(response);
    }

}
