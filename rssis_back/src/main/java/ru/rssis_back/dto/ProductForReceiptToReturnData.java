package ru.rssis_back.dto;


import lombok.Data;

@Data
public class ProductForReceiptToReturnData {
    private int id;
    private String name;
    private float cost;
    private float count;
    private String unit;
    private float countToReturn;
    private int reason_id;
}
