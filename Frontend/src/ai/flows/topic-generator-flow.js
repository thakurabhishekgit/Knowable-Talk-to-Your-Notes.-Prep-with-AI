
'use server';
/**
 * @fileOverview A flow for generating key topics, terms, and questions from a document.
 * 
 * - generateTopics - Analyzes a document and extracts important study points.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const KeyTermSchema = z.object({
  term: z.string().describe('The key term or concept.'),
  definition: z.string().describe('A concise definition of the term based on the document.'),
});

const MainTopicSchema = z.object({
  topic: z.string().describe('The name of the main topic.'),
  summary: z.string().describe('A brief summary of what the document says about this topic.'),
});

const TopicAnalysisOutputSchema = z.object({
  mainTopics: z.array(MainTopicSchema).describe('A list of the main topics covered in the document.'),
  keyTerms: z.array(KeyTermSchema).describe('A glossary of key terms and their definitions.'),
  potentialQuestions: z.array(z.string()).describe('A list of potential exam questions based on the content.'),
});

const TopicAnalysisInputSchema = z.object({
    documentText: z.string().describe('The full text content of the primary study document.'),
});

const generateTopicsFlow = ai.defineFlow(
  {
    name: 'generateTopicsFlow',
    inputSchema: TopicAnalysisInputSchema,
    outputSchema: TopicAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant. Your task is to analyze the provided document and generate a study guide for a student.

        Based on the document text, you must identify and extract the following:
        1.  **Main Topics:** Identify the 3-5 most important high-level topics discussed. For each topic, provide a brief summary.
        2.  **Key Terms:** Create a glossary of 5-10 important terms or concepts. For each term, provide a concise definition as it relates to the document.
        3.  **Potential Questions:** Generate a list of 3-5 potential short-answer or essay questions that could be on an exam, based on the material.

        Document Text:
        ---
        ${input.documentText}
        ---
        `,
        model: 'googleai/gemini-2.0-flash',
        output: {
          schema: TopicAnalysisOutputSchema,
        }
      });
      return llmResponse.output || { mainTopics: [], keyTerms: [], potentialQuestions: [] };
    } catch (error) {
      console.error("AI Error in generateTopicsFlow:", error);
      if (error.message && error.message.includes('503')) {
          throw new Error("I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.");
      }
      throw new Error("An unexpected error occurred while trying to generate the topics. Please try again later.");
    }
  }
);


export async function generateTopics(input) {
  return await generateTopicsFlow(input);
}
