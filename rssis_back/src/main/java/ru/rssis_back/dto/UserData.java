package ru.rssis_back.dto;

import lombok.Data;

@Data
public class UserData {
    private int id;
    private String full_name;
    private String login;
    private String role;
    private String password_hash;
}
