package com.Knowable.Backend.service;

import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.*;
import java.net.URL;

@Service
public class PdfExtractionService {

    private final Tika tika = new Tika();

    @SuppressWarnings("deprecation")
    public String extractTextFromCloudinary(String fileUrl) {
        File tempFile = null;

        try {
            // ✅ Step 1: Download the file locally
            tempFile = File.createTempFile("cloudinary-doc", ".tmp");
            FileUtils.copyURLToFile(new URL(fileUrl), tempFile);
            System.out.println("Downloaded file from: " + fileUrl);

            // ✅ Step 2: Detect MIME type
            String mimeType = tika.detect(tempFile);
            System.out.println("Detected MIME type: " + mimeType);

            if (!mimeType.equals("application/pdf") &&
                    !mimeType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                    !mimeType.equals("application/vnd.ms-powerpoint") &&
                    !mimeType.startsWith("text")) {
                throw new RuntimeException("Unsupported file type for extraction: " + mimeType);
            }

            // ✅ Step 3: Parse using Tika AutoDetectParser
            try (InputStream inputStream = new FileInputStream(tempFile)) {
                AutoDetectParser parser = new AutoDetectParser();
                BodyContentHandler handler = new BodyContentHandler(-1); // Unlimited size
                Metadata metadata = new Metadata();
                parser.parse(inputStream, handler, metadata);

                String extractedText = handler.toString();
                System.out.println("Extracted Text Preview:\n"
                        + extractedText.substring(0, Math.min(500, extractedText.length())));
                return extractedText;
            }

        } catch (IOException | TikaException | SAXException e) {
            System.err.println("Error during text extraction: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to extract text from file: " + fileUrl, e);

        } finally {
            // ✅ Clean up temp file
            if (tempFile != null && tempFile.exists()) {
                boolean deleted = tempFile.delete();
                if (!deleted) {
                    System.err.println("Warning: Temp file was not deleted: " + tempFile.getAbsolutePath());
                }
            }
        }
    }
}
