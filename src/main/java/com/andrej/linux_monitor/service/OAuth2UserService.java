package com.andrej.linux_monitor.service;

import com.andrej.linux_monitor.model.Role;
import com.andrej.linux_monitor.model.User;
import com.andrej.linux_monitor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // clean username from email
        String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");

        userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword("OAUTH2_USER");
            newUser.setRole(Role.CLIENT);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setActive(true);
            userRepository.save(newUser);
            log.info("New OAuth2 user registered: {}", email);
            return newUser;
        });

        return oAuth2User;
    }
}