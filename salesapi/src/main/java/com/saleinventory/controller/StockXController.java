package com.saleinventory.controller;

import com.saleinventory.service.StockXApiService;
import com.saleinventory.service.StockXAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stockx")
public class StockXController {

    @Autowired
    private StockXApiService stockXApiService;
    @Autowired
    private StockXAuthService stockXAuthService;

    @GetMapping("/api/stockx/products/sync")
    public ResponseEntity<?> sync() {
        try {
            String token = stockXAuthService.getAccessToken();
            return ResponseEntity.ok(stockXApiService.getProducts(token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd: " + e.getMessage());
        }
    }

    /*@GetMapping("/products")
    public ResponseEntity<String> getProducts() {
        return stockXApiService.getProducts();
    }*/
}
