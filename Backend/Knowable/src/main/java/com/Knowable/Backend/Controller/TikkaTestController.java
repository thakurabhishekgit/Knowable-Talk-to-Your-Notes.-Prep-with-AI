package com.Knowable.Backend.Controller;

import java.io.IOException;
import java.lang.String;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Knowable.Backend.service.PdfExtractionService;

@RestController
@RequestMapping("/api/documents")
public class TikkaTestController {
    @Autowired
    private PdfExtractionService extractionService;

    @GetMapping("/extract")
    public ResponseEntity<String> extractText(@RequestParam("url") String url) throws TikaException, IOException {
        String content = extractionService.extractTextFromCloudinary(url);
        return ResponseEntity.ok(content);
    }

}
