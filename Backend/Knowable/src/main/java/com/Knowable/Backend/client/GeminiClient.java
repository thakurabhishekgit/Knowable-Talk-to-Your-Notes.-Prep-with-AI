package com.Knowable.Backend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class GeminiClient {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent")
                .build();
    }

    public String summarize(String text) {
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", text)
                        })
                });

        return webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    var candidates = (java.util.List<?>) response.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        var content = (Map<?, ?>) ((Map<?, ?>) candidates.get(0)).get("content");
                        var parts = (java.util.List<?>) content.get("parts");
                        return (String) ((Map<?, ?>) parts.get(0)).get("text");
                    }
                    return "No summary generated.";
                })
                .onErrorReturn("Error summarizing with Gemini")
                .block();
    }
}
