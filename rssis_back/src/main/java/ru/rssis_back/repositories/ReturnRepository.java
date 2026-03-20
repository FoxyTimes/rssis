package ru.rssis_back.repositories;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import ru.rssis_back.dto.ProductForReceiptToReturnData;
import ru.rssis_back.dto.ReturnReasonData;

import java.util.List;

@Repository
public class ReturnRepository {

    private final JdbcTemplate jdbcTemplate;


    public ReturnRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void addReturn(List<ProductForReceiptToReturnData> products, String login) {
        Integer staffId = jdbcTemplate.queryForObject(
                "SELECT id FROM staff WHERE login = ?", Integer.class, login
        );

        Integer returnId = jdbcTemplate.queryForObject(
                "INSERT INTO returns (reason_id, staff_id) VALUES (?, ?) RETURNING id",
                Integer.class, staffId
        );
    }

    private final RowMapper<ReturnReasonData> returnReasonDataRowMapper = (rs, rowNum) -> {
        ReturnReasonData returnReasonData = new ReturnReasonData();

        returnReasonData.setId(rs.getInt("id"));
        returnReasonData.setReason(rs.getString("reason"));

        return returnReasonData;
    };

    public List<ReturnReasonData> getReasons() {
        return jdbcTemplate.query("SELECT returns_reasons.id as id, returns_reasons.reason as reason FROM returns_reasons", returnReasonDataRowMapper);
    }
}
