package ru.rssis_back.dto;


import lombok.Data;

@Data
public class ProductForReceiptData {
    private int id;
    private String name;
    private float cost;
    private float count;
    private String unit;
}
