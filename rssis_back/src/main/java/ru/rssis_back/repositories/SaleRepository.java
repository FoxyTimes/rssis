package ru.rssis_back.repositories;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import ru.rssis_back.dto.ProductForReceiptData;
import ru.rssis_back.dto.SaleData;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class SaleRepository {

    public final JdbcTemplate jdbcTemplate;

    public SaleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SaleData> saleRowMapper = new RowMapper<SaleData>() {
        @Override
        public SaleData mapRow(ResultSet rs, int rowNum) throws SQLException {
            SaleData saleData = new SaleData();
            saleData.setId(rs.getInt("id"));
            saleData.setDate(rs.getString("date"));
            saleData.setPayment_method(rs.getString("payment_method"));
            saleData.setStatus(rs.getString("status"));
            saleData.setStaff_id(rs.getInt("staff_id"));
            saleData.setStaff_name(rs.getString("staff_name"));
            saleData.setCost(rs.getInt("cost"));


            return saleData;
        }
    };


    public void addSale(List<ProductForReceiptData> products, String login, String status) {

        Integer staffId = jdbcTemplate.queryForObject(
                "SELECT id FROM staff WHERE login = ?", Integer.class, login
        );

        Integer statusId = jdbcTemplate.queryForObject(
                "SELECT statuses.id FROM statuses WHERE statuses.status = ?", Integer.class, status
        );

        Integer saleId = jdbcTemplate.queryForObject(
                "INSERT INTO sales (staff_id, status_id) VALUES (?, ?) RETURNING id",
                Integer.class, staffId, statusId
        );

        String sql = "INSERT INTO sales_products (product_id, sale_id, count, cost) VALUES (?, ?, ?, ?)";

        for (ProductForReceiptData product : products) {
            jdbcTemplate.update(sql, product.getId(), saleId, product.getCount(), product.getCost());
        }
    }




    public int getTotalSalesWithStatusWithSearch(String status, String search) {
        Integer value = null;
        try {
            value = Integer.parseInt(search);
            Integer result = jdbcTemplate.queryForObject(
                    "SELECT COUNT(DISTINCT sales.id) " +
                            "FROM sales " +
                            "JOIN staff ON sales.staff_id = staff.id " +
                            "JOIN statuses st ON sales.status_id = st.id " +
                            "JOIN payment_methods pm ON sales.payment_method = pm.id " +
                            "JOIN sales_products sp ON sales.id = sp.sale_id " +
                            "JOIN products p ON sp.product_id = p.id " +
                            "WHERE (LOWER(staff.full_name) LIKE LOWER(?) " +
                            "OR LOWER(pm.payment_method) LIKE LOWER(?) " +
                            "OR LOWER(st.status) LIKE LOWER(?) " +
                            "OR LOWER(p.name) LIKE LOWER(?)) " +
                            "OR sales.id = ? " +
                            "AND st.status = ? ",
                    Integer.class, "%" + search + "%", "%" + search + "%", "%" + search + "%", "%" + search + "%", value, status
            );
            return result == null ? 0 : result;
        }
        catch (NumberFormatException e) {
            Integer result = jdbcTemplate.queryForObject(
                    "SELECT COUNT(DISTINCT sales.id) " +
                            "FROM sales " +
                            "JOIN staff ON sales.staff_id = staff.id " +
                            "JOIN statuses st ON sales.status_id = st.id " +
                            "JOIN payment_methods pm ON sales.payment_method = pm.id " +
                            "JOIN sales_products sp ON sales.id = sp.sale_id " +
                            "JOIN products p ON sp.product_id = p.id " +
                            "WHERE (LOWER(staff.full_name) LIKE LOWER(?) " +
                            "OR LOWER(pm.payment_method) LIKE LOWER(?) " +
                            "OR LOWER(st.status) LIKE LOWER(?) " +
                            "OR LOWER(p.name) LIKE LOWER(?)) " +
                            "AND st.status = ?",
                    Integer.class, "%" + search + "%", "%" + search + "%", "%" + search + "%", "%" + search + "%", status
            );
            return result == null ? 0 : result;
        }
    }

    public List<SaleData> getSalesWithOffsetAndLimitAndSearch(int offset, int limit, String search) {
        Integer value = null;
        try {
            value = Integer.parseInt(search);
            return jdbcTemplate.query(
                    "SELECT DISTINCT sales.id as id, sales.date as date, pm.payment_method as payment_method, st.status as status, " +
                            "sales.staff_id as staff_id, staff.full_name as staff_name, sp.cost as cost " +
                            "FROM sales " +
                            "JOIN staff ON sales.staff_id = staff.id " +
                            "JOIN statuses st ON sales.status_id = st.id " +
                            "JOIN payment_methods pm ON sales.payment_method = pm.id " +
                            "JOIN (SELECT sale_id, SUM(count*cost) as cost FROM sales_products GROUP BY sale_id) sp ON sp.sale_id = sales.id " +
                            "JOIN sales_products ON sales.id = sales_products.sale_id " +
                            "JOIN products ON sales_products.product_id = products.id " +
                            "WHERE LOWER(staff.full_name) LIKE LOWER(?) " +
                            "OR LOWER(pm.payment_method) LIKE LOWER(?) " +
                            "OR LOWER(st.status) LIKE LOWER(?) " +
                            "OR LOWER(products.name) LIKE LOWER(?) " +
                            "OR sales.id = ? " +
                            "ORDER BY sales.id " +
                            "LIMIT ? OFFSET ?",
                    saleRowMapper, "%" + search + "%", "%" + search + "%", "%" + search + "%", "%" + search + "%", value, limit, offset
            );
        } catch (NumberFormatException e) {
            return jdbcTemplate.query(
                    "SELECT DISTINCT sales.id as id, sales.date as date, pm.payment_method as payment_method, st.status as status, " +
                            "sales.staff_id as staff_id, staff.full_name as staff_name, sp.cost as cost " +
                            "FROM sales " +
                            "JOIN staff ON sales.staff_id = staff.id " +
                            "JOIN statuses st ON sales.status_id = st.id " +
                            "JOIN payment_methods pm ON sales.payment_method = pm.id " +
                            "JOIN (SELECT sale_id, SUM(count*cost) as cost FROM sales_products GROUP BY sale_id) sp ON sp.sale_id = sales.id " +
                            "JOIN sales_products ON sales.id = sales_products.sale_id " +
                            "JOIN products ON sales_products.product_id = products.id " +
                            "WHERE LOWER(staff.full_name) LIKE LOWER(?) " +
                            "OR LOWER(pm.payment_method) LIKE LOWER(?) " +
                            "OR LOWER(st.status) LIKE LOWER(?) " +
                            "OR LOWER(products.name) LIKE LOWER(?) " +
                            "ORDER BY sales.id " +
                            "LIMIT ? OFFSET ?",
                    saleRowMapper, "%" + search + "%", "%" + search + "%", "%" + search + "%", "%" + search + "%", limit, offset
            );
        }
    }

    public int getTotalSalesWithSearch(String search) {
        Integer value = null;
        try {
            value = Integer.parseInt(search);
            Integer result = jdbcTemplate.queryForObject(
                    "SELECT COUNT(DISTINCT sales.id) " +
                            "FROM sales " +
                            "JOIN staff ON sales.staff_id = staff.id " +
                            "JOIN statuses st ON sales.status_id = st.id " +
                            "JOIN payment_methods pm ON sales.payment_method = pm.id " +
                            "JOIN sales_products sp ON sales.id = sp.sale_id " +
                            "JOIN products p ON sp.product_id = p.id " +
                            "WHERE LOWER(staff.full_name) LIKE LOWER(?) " +
                            "OR LOWER(pm.payment_method) LIKE LOWER(?) " +
                            "OR LOWER(st.status) LIKE LOWER(?) " +
                            "OR LOWER(p.name) LIKE LOWER(?) " +
                            "OR sales.id = ? ",
                    Integer.class, "%" + search + "%", "%" + search + "%", "%" + search + "%", "%" + search + "%", value
            );
            return result == null ? 0 : result;
        }
        catch (NumberFormatException e) {
            Integer result = jdbcTemplate.queryForObject(
                    "SELECT COUNT(DISTINCT sales.id) " +
                            "FROM sales " +
                            "JOIN staff ON sales.staff_id = staff.id " +
                            "JOIN statuses st ON sales.status_id = st.id " +
                            "JOIN payment_methods pm ON sales.payment_method = pm.id " +
                            "JOIN sales_products sp ON sales.id = sp.sale_id " +
                            "JOIN products p ON sp.product_id = p.id " +
                            "WHERE LOWER(staff.full_name) LIKE LOWER(?) " +
                            "OR LOWER(pm.payment_method) LIKE LOWER(?) " +
                            "OR LOWER(st.status) LIKE LOWER(?) " +
                            "OR LOWER(p.name) LIKE LOWER(?)",
                    Integer.class, "%" + search + "%", "%" + search + "%", "%" + search + "%", "%" + search + "%"
            );
            return result == null ? 0 : result;
        }
    }

    private final RowMapper<ProductForReceiptData> productForReceiptRowMapper = new RowMapper<ProductForReceiptData>() {
        @Override
        public ProductForReceiptData mapRow(ResultSet rs, int rowNum) throws SQLException {
            ProductForReceiptData productForReceiptData = new ProductForReceiptData();
            productForReceiptData.setId(rs.getInt("id"));
            productForReceiptData.setName(rs.getString("name"));
            productForReceiptData.setCost(rs.getInt("cost"));
            productForReceiptData.setCount(rs.getInt("count"));
            productForReceiptData.setUnit(rs.getString("unit"));
            return productForReceiptData;
        }
    };

    public List<ProductForReceiptData> getProductsForReceiptById(int id) {
        return jdbcTemplate.query(
                "SELECT sp.product_id as id, p.name as name, sp.cost as cost, sp.count as count, u.unit as unit " +
                        "FROM sales_products sp " +
                        "JOIN sales s ON sp.sale_id = s.id " +
                        "JOIN products p ON sp.product_id = p.id " +
                        "JOIN units u ON p.unit_id = u.id " +
                        "WHERE s.id = ?",
                productForReceiptRowMapper, id
        );
    }
}
