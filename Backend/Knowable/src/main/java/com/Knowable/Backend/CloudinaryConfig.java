package com.Knowable.Backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.Knowable.Backend.config.cloudinary.CloudinaryProperties;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

    private final CloudinaryProperties properties;

    public CloudinaryConfig(CloudinaryProperties properties) {
        this.properties = properties;
    }

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", properties.getCloudName(),
                "api_key", properties.getApiKey(),
                "api_secret", properties.getApiSecret()));
    }
}
