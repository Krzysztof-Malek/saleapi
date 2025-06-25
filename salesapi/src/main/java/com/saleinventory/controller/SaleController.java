package com.saleinventory.controller;

import com.saleinventory.model.Sale;
import com.saleinventory.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {
    @Autowired
    private SaleService service;

    @PostMapping
    public Sale addSale(@RequestBody Sale sale) {
        return service.save(sale);
    }

    @GetMapping
    public List<Sale> getSales() {
        return service.getAll();
    }
}
