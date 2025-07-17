
'use server';
/**
 * @fileOverview A flow for answering a list of questions based on a document.
 * 
 * - generateAnswers - Generates an answer for each question provided.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerSchema = z.object({
  question: z.string().describe('The original question that was asked.'),
  answer: z.string().describe('The generated answer based on the document text.'),
});

const QuestionAnswerOutputSchema = z.object({
  results: z.array(AnswerSchema).describe('An array of questions and their corresponding answers.'),
});

const QuestionAnswerInputSchema = z.object({
    documentText: z.string().describe('The full text content of the primary study document.'),
    questions: z.array(z.string()).describe('A list of questions to answer based on the document text.'),
});

const generateAnswersFlow = ai.defineFlow(
  {
    name: 'generateAnswersFlow',
    inputSchema: QuestionAnswerInputSchema,
    outputSchema: QuestionAnswerOutputSchema,
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant. Your task is to answer a list of questions based *only* on the provided 'Document Text'. For each question in the list, find the most relevant information in the document and formulate a clear and concise answer.

        If the answer to a specific question cannot be found in the 'Document Text', you MUST state: "The answer to this question was not found in the provided document." Do not use any external knowledge.

        Document Text:
        ---
        ${input.documentText}
        ---

        Questions to Answer:
        ---
        ${input.questions.map(q => `- ${q}`).join('\n')}
        ---
        `,
        model: 'googleai/gemini-2.0-flash',
        output: {
          schema: QuestionAnswerOutputSchema,
        }
      });
      return llmResponse.output || { results: [] };
    } catch (error) {
      console.error("AI Error in generateAnswersFlow:", error);
      if (error.message && error.message.includes('503')) {
          throw new Error("I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.");
      }
      throw new Error("An unexpected error occurred while trying to generate answers. Please try again later.");
    }
  }
);


export async function generateAnswers(input) {
  return await generateAnswersFlow(input);
}
