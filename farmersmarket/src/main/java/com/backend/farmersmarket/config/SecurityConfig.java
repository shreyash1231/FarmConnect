package com.backend.farmersmarket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfig = new CorsConfiguration();
                corsConfig.setAllowedOrigins(List.of("http://localhost:5501","http://localhost:8000","http://127.0.0.1:8000","http://localhost:3000","http://127.0.0.1:3000","http://127.0.0.1:5501","http://127.0.0.1:5500")); // Allow frontend requests
                corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow HTTP methods
                corsConfig.setAllowedHeaders(List.of("*")); // Allow all headers
                corsConfig.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)
                return corsConfig;
            }))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for now
            .headers(headers -> headers.frameOptions().disable()) // Allow H2 Console in iframe
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll() // Allow unrestricted H2 Console access
                .requestMatchers("/api/**").permitAll() // Allow all API requests
                .anyRequest().authenticated() // Require authentication for everything else
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
