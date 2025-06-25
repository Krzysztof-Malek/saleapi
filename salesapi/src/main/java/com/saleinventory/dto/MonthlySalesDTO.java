package com.saleinventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MonthlySalesDTO(String month, int totalOrders, BigDecimal revenue) {}


