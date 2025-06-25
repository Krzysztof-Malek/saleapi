package com.saleinventory.service;

import com.saleinventory.dto.MonthlySalesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class StockXAnalyticsService {

    @Autowired
    private StockXAuthService authService;

    @Autowired
    private StockXOrderService orderService;

    public List<MonthlySalesDTO> getSalesForMonth(String yearMonth) throws Exception {
        // wyznacz pierwszy i ostatni dzień miesiąca
        LocalDate startDate = LocalDate.parse(yearMonth + "-01");
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return getMonthlyData(startDate, endDate, true);
    }

    private List<MonthlySalesDTO> getMonthlyData(LocalDate fromDate, LocalDate toDate, boolean forceSingleMonth) throws Exception {
        String token = authService.getAccessToken();

        String from = fromDate != null ? fromDate.toString() : null;
        String to = toDate != null ? toDate.toString() : null;

        Map<String, Object> response = (Map<String, Object>) orderService.getHistoricalOrders(
                token, from, to, null, 1, 100, "createdAt", "desc");

        List<Map<String, Object>> orders = (List<Map<String, Object>>) response.get("orders");

        Map<String, List<BigDecimal>> revenueMap = new HashMap<>();
        Map<String, Integer> orderCountMap = new HashMap<>();

        for (Map<String, Object> order : orders) {
            String createdAt = (String) order.get("createdAt");
            if (createdAt == null) continue;

            Instant instant = Instant.parse(createdAt);
            LocalDate date = instant.atZone(ZoneId.systemDefault()).toLocalDate();
            String month = date.format(DateTimeFormatter.ofPattern("yyyy-MM"));

            if (forceSingleMonth && !month.equals(fromDate.format(DateTimeFormatter.ofPattern("yyyy-MM")))) continue;

            Map<String, Object> payout = (Map<String, Object>) order.get("payout");
            if (payout == null || payout.get("totalPayout") == null) continue;

            BigDecimal payoutValue = new BigDecimal(payout.get("totalPayout").toString());

            revenueMap.computeIfAbsent(month, k -> new ArrayList<>()).add(payoutValue);
            orderCountMap.put(month, orderCountMap.getOrDefault(month, 0) + 1);
        }

        return revenueMap.keySet().stream()
                .map(month -> new MonthlySalesDTO(
                        month,
                        orderCountMap.getOrDefault(month, 0),
                        revenueMap.get(month).stream().reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .sorted(Comparator.comparing(MonthlySalesDTO::month))
                .toList();
    }
}

