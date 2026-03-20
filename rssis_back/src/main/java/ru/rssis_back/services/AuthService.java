package ru.rssis_back.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.rssis_back.dto.UserData;
import ru.rssis_back.repositories.UserRepository;
import ru.rssis_back.security.JwtTokenProvider;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }


    public String tryLogin(String username, String password) {
        UserData userData = userRepository.findByLogin(username);
        if (checkPassword(password, userData.getPassword_hash())) {
            return jwtTokenProvider.generateToken(username);
        }
        return null;
    }

    public boolean checkPassword(String rawPassword, String storedHash) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(rawPassword, storedHash);
    }


}
