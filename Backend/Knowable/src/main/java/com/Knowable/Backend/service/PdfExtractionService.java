package com.Knowable.Backend.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;

@Service
public class PdfExtractionService {

    private final Tika tika = new Tika();

    @SuppressWarnings("deprecation")
    public String extractTextFromCloudinary(String fileUrl) throws TikaException, IOException {
        try (InputStream inputStream = new URL(fileUrl).openStream()) {
            return tika.parseToString(inputStream);
        } catch (IOException e) {
            throw new RuntimeException("Failed to extract PDF content", e);
        }
    }
}