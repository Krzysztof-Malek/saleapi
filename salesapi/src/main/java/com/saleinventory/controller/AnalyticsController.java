package com.saleinventory.controller;

import com.saleinventory.service.StockXAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private StockXAnalyticsService analyticsService;

    @GetMapping("/monthly-sales")
    public ResponseEntity<?> getMonthlySales(@RequestParam(required = false) String month) {
        try {
            if (month != null && !month.isBlank()) {
                return ResponseEntity.ok(analyticsService.getSalesForMonth(month));
            } else {
                return ResponseEntity.ok(analyticsService.getSalesForMonth("2025-01"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd: " + e.getMessage());
        }
    }
}

