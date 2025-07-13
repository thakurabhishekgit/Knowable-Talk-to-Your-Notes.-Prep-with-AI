package com.Knowable.Backend.utils;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.pdf.PDFParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import java.io.InputStream;
import java.net.URL;

@Component
public class TikaExtractor {

    public String extractTextFromUrl(String fileUrl) {
        try (InputStream input = new URL(fileUrl).openStream()) {
            BodyContentHandler handler = new BodyContentHandler(-1); // No character limit
            Metadata metadata = new Metadata();
            ParseContext context = new ParseContext();
            PDFParser parser = new PDFParser();

            parser.parse(input, handler, metadata, context);
            return handler.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error extracting text from PDF: " + e.getMessage(), e);
        }
    }
}