package com.saleinventory.service;

import com.saleinventory.model.Product;
import com.saleinventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductImportService {

    @Autowired
    private ProductRepository productRepository;

    public void importCSV(MultipartFile file) throws Exception {
        List<Product> products = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean skip = true;
            while ((line = reader.readLine()) != null) {
                if (skip) { skip = false; continue; } // pomiń nagłówek

                String[] data = line.split(";");
                Product product = new Product();
                product.setSku(data[0]);
                product.setSize(data[1]);
                try {
                    product.setPurchasePrice(Double.parseDouble(data[2].replace(",", ".").trim()));
                } catch (Exception e) {
                    product.setPurchasePrice(0.0);
                }
                product.setStatus(data[3]);
                product.setPurchaseDate(data[4]);
                product.setSaleDate(data.length > 5 ? data[5] : "");
                products.add(product);
            }
            productRepository.saveAll(products);
        }
    }
}
