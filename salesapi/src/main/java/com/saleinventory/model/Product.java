package com.saleinventory.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String externalId;

    private String sku;
    private String size;
    private String name;
    private Double purchasePrice;
    private String status;
    private String purchaseDate;
    private String saleDate;
    private int quantity;
}
