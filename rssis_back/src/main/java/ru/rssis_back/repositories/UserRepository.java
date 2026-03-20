package ru.rssis_back.repositories;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import ru.rssis_back.dto.UserData;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    private final RowMapper<UserData> userRowMapper = new RowMapper<UserData>() {
        @Override
        public UserData mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserData userData = new UserData();

            userData.setId(rs.getInt("id"));
            userData.setFull_name(rs.getString("full_name"));
            userData.setLogin(rs.getString("login"));
            userData.setRole(rs.getString("role"));
            userData.setPassword_hash(rs.getString("password_hash"));

            return userData;
        }
    };


    public UserData findByLogin(String login) {
        List<UserData> results = jdbcTemplate.query(
                "SELECT staff.*, roles.role FROM staff JOIN roles ON staff.role_id = roles.id WHERE staff.login=?",
                userRowMapper,
                login
        );

        return results.isEmpty() ? null : results.get(0);
    }

}
