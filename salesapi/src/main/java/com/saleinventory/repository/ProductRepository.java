package com.saleinventory.repository;

import com.saleinventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByExternalId(String externalId);

    Optional<Product> findByName(String name);
}
