package com.saleinventory.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class StockXApiService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://gateway.stockx.com/api/v2";
    private final String token = "YOUR_BEARER_TOKEN";

    public Object getProducts(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setAccept(MediaType.parseMediaTypes("application/json"));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(baseUrl + "/products", HttpMethod.GET, entity, String.class);
    }
}
