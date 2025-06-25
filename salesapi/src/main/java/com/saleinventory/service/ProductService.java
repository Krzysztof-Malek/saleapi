package com.saleinventory.service;

import com.saleinventory.model.Product;
import com.saleinventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product add(Product product) {
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateQuantity(Long id, int newQty) {
        Product product = productRepository.findById(id).orElseThrow();
        return productRepository.save(product);
    }
}
