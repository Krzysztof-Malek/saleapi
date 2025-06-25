
package com.saleinventory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Service
public class StockXListingService {

    @Value("${stockx.api.url}")
    private String baseUrl;

    @Value("${stockx.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Object getListings(String accessToken,
                              int pageNumber,
                              int pageSize,
                              String productIds,
                              String variantIds,
                              String batchIds,
                              String fromDate,
                              String toDate,
                              String listingStatuses,
                              String inventoryTypes,
                              String initiatedShipmentDisplayIds) throws Exception {

        URI uri = UriComponentsBuilder.fromUri(URI.create(baseUrl + "/selling/listings"))
                .queryParam("pageNumber", pageNumber)
                .queryParam("pageSize", pageSize)
                .queryParamIfPresent("productIds", Optional.ofNullable(productIds).filter(s -> !s.isBlank()))
                .queryParamIfPresent("variantIds", Optional.ofNullable(variantIds).filter(s -> !s.isBlank()))
                .queryParamIfPresent("batchIds", Optional.ofNullable(batchIds).filter(s -> !s.isBlank()))
                .queryParamIfPresent("fromDate", Optional.ofNullable(fromDate).filter(s -> !s.isBlank()))
                .queryParamIfPresent("toDate", Optional.ofNullable(toDate).filter(s -> !s.isBlank()))
                .queryParamIfPresent("listingStatuses", Optional.ofNullable(listingStatuses).filter(s -> !s.isBlank()))
                .queryParamIfPresent("inventoryTypes", Optional.ofNullable(inventoryTypes).filter(s -> !s.isBlank()))
                .queryParamIfPresent("initiatedShipmentDisplayIds", Optional.ofNullable(initiatedShipmentDisplayIds).filter(s -> !s.isBlank()))
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("x-api-key", apiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

        return objectMapper.readValue(response.getBody(), Object.class);
    }
}
