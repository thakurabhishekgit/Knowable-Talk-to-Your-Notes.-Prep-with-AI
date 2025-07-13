package com.Knowable.Backend.utils;

import java.util.ArrayList;
import java.util.List;

public class TextSplitter {

    public static List<String> splitText(String text, int maxChunkLength) {
        List<String> chunks = new ArrayList<>();
        String[] sentences = text.split("(?<=[.?!])\\s+"); // split by sentence endings

        StringBuilder chunk = new StringBuilder();
        for (String sentence : sentences) {
            if (chunk.length() + sentence.length() > maxChunkLength) {
                chunks.add(chunk.toString());
                chunk.setLength(0); // reset
            }
            chunk.append(sentence).append(" ");
        }

        if (chunk.length() > 0) {
            chunks.add(chunk.toString());
        }

        return chunks;
    }
}
