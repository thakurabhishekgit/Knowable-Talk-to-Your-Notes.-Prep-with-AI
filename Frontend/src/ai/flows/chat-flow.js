

'use server';
/**
 * @fileOverview A Q&A flow for answering questions about a document.
 * 
 * - answerQuestion - A function that answers a question based on document text.
 * - generateSummary - A function that summarizes the document text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerQuestionInputSchema = z.object({
    documentText: z.string().describe('The full text content of the document.'),
    question: z.string().describe('The user\'s question about the document.'),
});

const GenerateSummaryInputSchema = z.object({
    documentText: z.string().describe('The full text content of the document.'),
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant designed to help students learn. Your primary task is to answer the user's question based on the provided document text.

        First, search for the answer within the 'Document Text'.
        
        If the answer is found in the document, provide it directly.
        
        If the answer is NOT found in the document, you MUST explicitly state that the information wasn't in the provided text. Then, you should use your general knowledge to answer the question to the best of your ability.
        
        Your goal is to be as helpful as possible to a student trying to learn.

        Document Text:
        ---
        ${input.documentText}
        ---

        Question: ${input.question}`,
        model: 'googleai/gemini-2.0-flash',
        output: {
          format: 'text'
        }
      });
      return llmResponse.text;
    } catch (error) {
        console.error("AI Error in answerQuestionFlow:", error);
        if (error.message && error.message.includes('503')) {
            return "I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.";
        }
        return "An unexpected error occurred while trying to answer the question. Please try again later.";
    }
  }
);

const generateSummaryFlow = ai.defineFlow(
    {
      name: 'generateSummaryFlow',
      inputSchema: GenerateSummaryInputSchema,
      outputSchema: z.string(),
    },
    async (input) => {
      try {
        const llmResponse = await ai.generate({
          prompt: `You are an expert academic assistant. Your task is to provide a concise, easy-to-understand summary of the following document text. 
          Focus on the key points and main arguments. The summary should be suitable for a student who needs a quick overview of the material.
    
          Document Text:
          ---
          ${input.documentText}
          ---`,
          model: 'googleai/gemini-2.0-flash',
          output: {
            format: 'text'
          }
        });
        return llmResponse.text;
      } catch (error) {
        console.error("AI Error in generateSummaryFlow:", error);
        if (error.message && error.message.includes('503')) {
            return "I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.";
        }
        return "An unexpected error occurred while trying to generate the summary. Please try again later.";
      }
    }
  );

export async function answerQuestion(input) {
  return await answerQuestionFlow(input);
}

export async function generateSummary(input) {
    return await generateSummaryFlow(input);
}
