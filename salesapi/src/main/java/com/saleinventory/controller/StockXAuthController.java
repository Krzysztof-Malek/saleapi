package com.saleinventory.controller;

import com.saleinventory.service.StockXAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Logger;

@RestController
public class StockXAuthController {

    private static final Logger LOGGER = Logger.getLogger(StockXAuthController.class.getName());

    @Autowired
    private StockXAuthService stockXAuthService;

    @GetMapping("/api/stockx/oauth/callback")
    public void handleOAuthCallback(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        try {
            String accessToken = stockXAuthService.exchangeCodeForAccessToken(code);
            LOGGER.info("Autoryzacja zakończona sukcesem. Access token został zapisany.");
            response.sendRedirect("/");
        } catch (Exception e) {
            LOGGER.severe("Błąd podczas autoryzacji: " + e.getMessage());
            response.sendRedirect("/error");
        }
    }

    @GetMapping("/api/stockx/oauth/url")
    public String getAuthorizationUrl() {
        return stockXAuthService.getAuthorizationUrl();
    }
}
