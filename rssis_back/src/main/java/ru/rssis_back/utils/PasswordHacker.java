package ru.rssis_back.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class PasswordHacker {

    public static void main(String[] args) {
        String password = "1";
        System.out.println(getPassword(password));
    }
    public static String getPassword(String rawPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(rawPassword);
    }
}
