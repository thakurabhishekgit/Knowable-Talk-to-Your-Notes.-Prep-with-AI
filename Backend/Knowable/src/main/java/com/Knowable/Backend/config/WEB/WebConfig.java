package com.Knowable.Backend.config.WEB;

import jakarta.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins = {
            "https://6000-firebase-studio-1752484716459.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev",
            "http://localhost:9002",
            "https://knowable-ai.vercel.app"

    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @PostConstruct
    public void printAllowedOrigins() {
        System.out.println("Allowed CORS origins configured:");
        for (String origin : allowedOrigins) {
            System.out.println(" - " + origin);
        }
    }

}
