package com.saleinventory.service;

import com.saleinventory.model.Product;
import com.saleinventory.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class StockXSyncService {

    @Autowired
    private StockXApiService stockXApiService;

    @Autowired
    private ProductRepository productRepository;

   /*@Scheduled(fixedRate = 3600000) // co godzinę
    @Transactional
    public void syncProducts() throws IOException {
        ResponseEntity<String> response = stockXApiService.getProducts();
        String body = response.getBody();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(body);
        JsonNode products = root.get("products"); // dopasuj do rzeczywistego klucza

        if (products != null && products.isArray()) {
            for (JsonNode item : products) {
                String externalId = item.get("productId").asText();

                if (!productRepository.existsByExternalId(externalId)) {
                    Product p = new Product();
                    //p.setExternalId(externalId);

                    productRepository.save(p);
                }
            }
        }
    }*/
}