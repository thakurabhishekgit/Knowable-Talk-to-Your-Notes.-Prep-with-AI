package com.Knowable.Backend.Controller;

import java.io.IOException;
import java.util.Map;

import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.Knowable.Backend.client.GeminiClient;
import com.Knowable.Backend.service.PdfExtractionService;

@RestController
@RequestMapping("/api/documents")
public class TikkaTestController {
    @Autowired
    private PdfExtractionService extractionService;

    @Autowired
    private GeminiClient geminiClient;

    @GetMapping("/extract")
    public ResponseEntity<String> extractText(@RequestParam String url) throws TikaException, IOException {
        String content = extractionService.extractTextFromCloudinary(url);
        return ResponseEntity.ok(content);
    }

    @PostMapping("/generate-summary")
    public ResponseEntity<Map<String, String>> generateSummary(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String summary = geminiClient.summarize(text);
        return ResponseEntity.ok(Map.of("summary", summary));
    }

}
