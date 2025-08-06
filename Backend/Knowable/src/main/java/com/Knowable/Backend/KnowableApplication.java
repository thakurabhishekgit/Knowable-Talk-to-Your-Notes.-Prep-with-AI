package com.Knowable.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.annotation.Cacheable;

@SpringBootApplication
@EnableCaching
public class KnowableApplication {

	public static void main(String[] args) {
		SpringApplication.run(KnowableApplication.class, args);
	}

	@Cacheable(value = "testCache", key = "#id")
	public String testCache(Long id) {
		System.out.println("Fetching from method");
		return "Value-" + id;
	}

}
