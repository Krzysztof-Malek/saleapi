package com.saleinventory.service;

import com.saleinventory.model.Sale;
import com.saleinventory.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {
    @Autowired
    private SaleRepository repo;

    public Sale save(Sale sale) {
        return repo.save(sale);
    }

    public List<Sale> getAll() {
        return repo.findAll();
    }
}
