package com.Knowable.Backend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class GeminiClient {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiClient() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent")
                .build();
    }

    public String summarizeText(String inputText) {
        String requestBody = """
                {
                    "contents": [{
                        "parts": [{
                            "text": "%s"
                        }]
                    }]
                }
                """.formatted(inputText.replace("\"", "\\\""));

        return webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                .header("Content-Type", "application/json")
                .body(Mono.just(requestBody), String.class)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    // Extract the summary from JSON (simple parsing)
                    int index = response.indexOf("text");
                    if (index != -1) {
                        int start = response.indexOf(":", index) + 2;
                        int end = response.indexOf("\"", start);
                        return response.substring(start, end);
                    }
                    return "Failed to parse summary";
                })
                .onErrorReturn("Failed to summarize text")
                .block();
    }
}