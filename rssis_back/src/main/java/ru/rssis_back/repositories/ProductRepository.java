package ru.rssis_back.repositories;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import ru.rssis_back.dto.ProductData;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Repository
public class ProductRepository {


    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    private final RowMapper<ProductData> productRowMapper = (rs, rowNum) -> {
        ProductData productData = new ProductData();
        productData.setId(rs.getInt("id"));
        productData.setCost(rs.getFloat("cost"));
        productData.setBarcode(rs.getString("barcode"));
        productData.setName(rs.getString("name"));
        productData.setUnit(rs.getString("unit"));
        productData.setMinimum(rs.getInt("minimum"));
        productData.setRemains(rs.getInt("remains"));

        return productData;
    };


    public List<ProductData> getProductsWithOffsetAndLimitAndSearch(int offset, int limit, String search) {
        return jdbcTemplate.query("SELECT p.*, u.unit " +
                        "FROM products p " +
                        "JOIN units u ON p.unit_id = u.id " +
                        "WHERE LOWER(p.name) LIKE LOWER(?) " +
                        "ORDER BY p.name " +
                        "LIMIT ? OFFSET ?"
                , productRowMapper, "%" + search + "%", limit, offset);
    }

    public int countAllProductsWithSearch(String search) {
        Integer result = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products " +
                        "WHERE LOWER(name) LIKE LOWER(?)"
                , Integer.class, "%" + search + "%");
        return result == null ? 0 : result;
    }
}