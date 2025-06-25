package com.saleinventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SaleInventoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaleInventoryApplication.class, args);
	}

}
