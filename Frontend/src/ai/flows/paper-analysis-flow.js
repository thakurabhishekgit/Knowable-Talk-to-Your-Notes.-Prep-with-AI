
'use server';
/**
 * @fileOverview A flow for analyzing a previous question paper against a document.
 * 
 * - analyzePaper - Generates important topics, questions, and revision notes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RevisionNoteSchema = z.object({
  point: z.string().describe('A key point for revision.'),
  details: z.string().describe('A brief explanation of the revision point.'),
});

const ImportantTopicSchema = z.object({
  topic: z.string().describe('The name of the important topic.'),
  reason: z.string().describe('A brief explanation of why this topic is important based on the paper.'),
  expectedQuestions: z.array(z.string()).describe('A list of 2-3 expected questions for this topic.'),
  revisionNotes: z.array(RevisionNoteSchema).describe('A list of detailed, last-minute revision notes for the topic.'),
});

const PaperAnalysisOutputSchema = z.object({
  analysis: z.array(ImportantTopicSchema).describe('An array of important topics and their analysis.'),
});

const PaperAnalysisInputSchema = z.object({
    documentText: z.string().describe('The full text content of the primary study document (e.g., textbook).'),
    paperText: z.string().describe('The full text content of the previous year question paper.'),
});

const analyzePaperFlow = ai.defineFlow(
  {
    name: 'analyzePaperFlow',
    inputSchema: PaperAnalysisInputSchema,
    outputSchema: PaperAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic analyst. Your task is to compare the provided Study Material against a Previous Year's Question Paper and generate a detailed analysis for a student.

        First, carefully read the Study Material to understand the concepts available.
        Then, analyze the Previous Year's Question Paper to identify which topics are frequently tested or emphasized.

        Based on your comparison, generate a list of the most important topics. For each topic, you must provide:
        1.  A brief reason why it's important (e.g., "Appeared twice in the paper").
        2.  A list of 2-3 likely or expected questions that could be asked from this topic.
        3.  A detailed set of "last-minute revision notes" with key points and brief explanations for the topic.

        Focus only on topics that are present in BOTH the Study Material and the Question Paper.

        Study Material Text:
        ---
        ${input.documentText}
        ---

        Previous Year's Question Paper Text:
        ---
        ${input.paperText}
        ---
        `,
        model: 'googleai/gemini-2.0-flash',
        output: {
          schema: PaperAnalysisOutputSchema,
        }
      });
      return llmResponse.output || {};
    } catch (error) {
      console.error("AI Error in analyzePaperFlow:", error);
      if (error.message && error.message.includes('503')) {
          throw new Error("I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.");
      }
      throw new Error("An unexpected error occurred while trying to analyze the paper. Please try again later.");
    }
  }
);


export async function analyzePaper(input) {
  return await analyzePaperFlow(input);
}
