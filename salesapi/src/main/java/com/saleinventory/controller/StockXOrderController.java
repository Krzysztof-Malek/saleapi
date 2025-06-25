package com.saleinventory.controller;

import com.saleinventory.service.StockXAuthService;
import com.saleinventory.service.StockXOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stockx")
public class StockXOrderController {

    @Autowired
    private StockXOrderService stockXOrderService;
    @Autowired
    private StockXAuthService stockXAuthService;

    @GetMapping("/history")
    public ResponseEntity<?> getOrders(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String orderStatus,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "50") int pageSize,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        try {
            long start = System.currentTimeMillis();
            String token = stockXAuthService.getAccessToken();
            Object orders = stockXOrderService.getHistoricalOrders(token, fromDate, toDate, orderStatus, pageNumber, pageSize, sortBy, sortDir);
            long duration = System.currentTimeMillis() - start;
            System.out.println("Pobranie histori z API trwało: " + duration + " ms");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd podczas pobierania historii: " + e.getMessage());
        }
    }
}
