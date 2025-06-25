
package com.saleinventory.controller;

import com.saleinventory.service.StockXAuthService;
import com.saleinventory.service.StockXListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stockx/listings")
public class StockXListingController {

    @Autowired
    private StockXListingService listingService;
    @Autowired
    private StockXAuthService stockXAuthService;

    @GetMapping
    public ResponseEntity<?> getListings(
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "25") int pageSize,
            @RequestParam(required = false) String productIds,
            @RequestParam(required = false) String variantIds,
            @RequestParam(required = false) String batchIds,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String listingStatuses,
            @RequestParam(required = false) String inventoryTypes,
            @RequestParam(required = false) String initiatedShipmentDisplayIds
    ) {
        try {
            String token = stockXAuthService.getAccessToken();
            long start = System.currentTimeMillis();
            Object result = listingService.getListings(
                token, pageNumber, pageSize, productIds, variantIds, batchIds,
                fromDate, toDate, listingStatuses, inventoryTypes, initiatedShipmentDisplayIds
            );
            long duration = System.currentTimeMillis() - start;
            System.out.println("Pobranie aktywnych listingów z API trwało: " + duration + " ms");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd podczas pobierania listingów: " + e.getMessage());
        }
    }
}
