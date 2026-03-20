package ru.rssis_back.utils;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class ByteViewer {
    public static void main(String[] args) {
        String text = "— © ‘ е а ‘¬Ґв ­"; // ваш текст

        // UTF-8
        byte[] utf8Bytes = text.getBytes(StandardCharsets.UTF_8);
        System.out.println("UTF-8 bytes: " + Arrays.toString(utf8Bytes));

        // Windows-1251
        try {
            byte[] cp1251Bytes = text.getBytes("windows-1251");
            System.out.println("CP1251 bytes: " + Arrays.toString(cp1251Bytes));
        } catch (Exception e) {
            e.printStackTrace();
        }

        // UTF-16
        byte[] utf16Bytes = text.getBytes(StandardCharsets.UTF_16);
        System.out.println("UTF-16 bytes: " + Arrays.toString(utf16Bytes));
    }
}