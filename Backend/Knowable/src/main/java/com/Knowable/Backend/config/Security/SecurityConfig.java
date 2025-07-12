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
                                .csrf().disable() // ❗ Disable CSRF (only for development or stateless APIs)
                                .authorizeHttpRequests(auth -> auth
                                                .anyRequest().permitAll() // ✅ Allow all requests without auth
                                )
                                .httpBasic(); // Optional: use for basic auth if needed

                return http.build();
        }
}
