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
public class StockXOrderService {

    @Value("${stockx.api.url}")
    private String baseUrl;

    @Value("${stockx.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Object getHistoricalOrders(String accessToken,
                                      String fromDate,
                                      String toDate,
                                      String orderStatus,
                                      int pageNumber,
                                      int pageSize,
                                      String sortBy,
                                      String sortDir) throws Exception {

        URI uri = UriComponentsBuilder.fromUri(URI.create(baseUrl + "/selling/orders/history"))
                .queryParamIfPresent("fromDate", Optional.ofNullable(fromDate).filter(s -> !s.isBlank()))
                .queryParamIfPresent("toDate", Optional.ofNullable(toDate).filter(s -> !s.isBlank()))
                .queryParamIfPresent("orderStatus", Optional.ofNullable(orderStatus).filter(s -> !s.isBlank()))
                .queryParam("pageNumber", pageNumber)
                .queryParam("pageSize", pageSize)
                .queryParamIfPresent("sortBy", Optional.ofNullable(sortBy).filter(s -> !s.isBlank()))
                .queryParamIfPresent("sortDir", Optional.ofNullable(sortDir).filter(s -> !s.isBlank()))
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
