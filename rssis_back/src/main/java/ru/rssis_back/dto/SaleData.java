package ru.rssis_back.dto;

import lombok.Data;

@Data
public class SaleData {
    private int id;
    private String date;
    private String payment_method;
    private String status;
    private int staff_id;
    private String staff_name;
    private float cost;
}