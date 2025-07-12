package com.Knowable.Backend.config.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // Disable CSRF for simplicity (use with caution in production)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/upload/**",
                                "/api/documents/**")
                        .permitAll() // ✅ Allow upload endpoint
                        .anyRequest().authenticated() // Require auth for other routes
                )
                .httpBasic(); // Or use .formLogin() or JWT setup based on your use case

        return http.build();
    }
}
