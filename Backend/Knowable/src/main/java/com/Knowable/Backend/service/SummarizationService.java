package com.Knowable.Backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Knowable.Backend.client.GeminiClient;
import com.Knowable.Backend.utils.TextSplitter;
import com.Knowable.Backend.utils.TikaExtractor;

@Service
public class SummarizationService {

    @Autowired
    private TikaExtractor tikaExtractor;

    @Autowired
    private GeminiClient geminiClient;

    public String summarizeFromCloudinaryUrl(String url) {
        String fullText = tikaExtractor.extractTextFromUrl(url);
        List<String> chunks = TextSplitter.splitText(fullText, 2000);

        StringBuilder finalSummary = new StringBuilder();
        for (String chunk : chunks) {
            String summary = geminiClient.summarizeText(chunk);
            finalSummary.append(summary).append("\n\n");
        }

        // Optionally summarize the whole summary again
        return geminiClient.summarizeText(finalSummary.toString());
    }
}
