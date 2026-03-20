package ru.rssis_back.dto;

import lombok.Data;

@Data
public class ProductData {
    private Integer id;
    private Float cost;
    private String barcode;
    private String name;
    private String unit;
    private Integer minimum;
    private Integer remains;
}
