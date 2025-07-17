
'use server';
/**
 * @fileOverview A flow for generating study tools like flashcards and quizzes from a document.
 * 
 * - generateStudyTool - A function that creates study materials based on the document text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FlashcardSchema = z.object({
  term: z.string().describe('The key term, concept, or name.'),
  definition: z.string().describe('A concise and clear definition of the term.'),
  elaboration: z.string().optional().describe('An optional example or further context to help understand the term.'),
});

const QuizQuestionSchema = z.object({
  question: z.string().describe('The multiple-choice question.'),
  options: z.array(z.string()).describe('An array of 4-5 possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const StudyToolOutputSchema = z.object({
    flashcards: z.array(FlashcardSchema).optional().describe('An array of generated flashcards.'),
    quiz: z.array(QuizQuestionSchema).optional().describe('An array of generated quiz questions.'),
});

const StudyToolInputSchema = z.object({
    documentText: z.string().describe('The full text content of the document.'),
    toolType: z.enum(['flashcards', 'quiz']).describe('The type of study tool to generate.'),
});

const generateStudyToolFlow = ai.defineFlow(
  {
    name: 'generateStudyToolFlow',
    inputSchema: StudyToolInputSchema,
    outputSchema: StudyToolOutputSchema,
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant specializing in creating study materials. Based on the provided document text, generate the requested study tool.

        Document Text:
        ---
        ${input.documentText}
        ---

        Please generate ${input.toolType} based on the key information in the document.
        - For flashcards, identify 10-15 key terms. For each, provide a concise definition and an optional, brief elaboration or example to provide more context.
        - For a quiz, create 5-7 multiple-choice questions that test understanding of the main ideas. Each question should have 4 options and a clearly identified correct answer.
        `,
        model: 'googleai/gemini-2.0-flash',
        output: {
          schema: StudyToolOutputSchema,
        }
      });
      return llmResponse.output || {};
    } catch (error) {
      console.error("AI Flow Error in generateStudyToolFlow:", error);
      let errorMessage = "An unexpected error occurred while trying to generate the study tool.";
      if (error.message) {
        if (error.message.includes('API key not valid')) {
            errorMessage = "The Google AI API key is missing or invalid on the server.";
        } else if (error.message.includes('503')) {
            errorMessage = "I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.";
        } else {
            // Forward a sanitized version of the original error
            errorMessage = `AI service error: ${error.message}`;
        }
      }
      // Throw a new error that will be caught by the client-side code
      throw new Error(errorMessage);
    }
  }
);


export async function generateStudyTool(input) {
  return await generateStudyToolFlow(input);
}
