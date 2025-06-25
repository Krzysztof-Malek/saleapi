package com.saleinventory.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class StockXOrder {
    private LocalDateTime orderDate;
    private BigDecimal amount;
    private String productId;

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }
}