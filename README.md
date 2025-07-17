# Knowable.AI - AI-Powered Academic Assistant

**Live Application URL:** [https://knowable-f-git-1b459a-thakurabhisheksinght97-gmailcoms-projects.vercel.app/](https://knowable-f-git-1b459a-thakurabhisheksinght97-gmailcoms-projects.vercel.app/)

## 1. Problem Statement

Modern education often leaves students inundated with vast amounts of study material—lecture notes, dense textbooks, lengthy PDFs, and past exam papers. Sifting through this information to identify key concepts, prepare for exams efficiently, and find answers to specific questions is a time-consuming and often overwhelming task. Traditional study methods can be passive and fail to engage students, leading to burnout and inefficient learning.

## 2. Proposed Solution

**Knowable.AI** is an intelligent SaaS platform designed to transform this passive learning experience into an active and personalized one. By leveraging the power of Generative AI, Knowable.AI acts as a personal academic assistant, empowering students to interact with their study materials in a completely new way.

Users can upload their documents (PDFs, DOCX, PPTX) into organized workspaces and use a suite of AI-powered tools to:

*   **Chat with Documents:** Get instant summaries, ask specific questions, and clarify complex points in a conversational manner.
*   **Generate Study Aids:** Automatically create flashcards for key terms and multiple-choice quizzes to reinforce learning and test understanding.
*   **Analyze Past Papers:** Identify recurring themes and frequently tested topics by comparing past exam papers against course materials.
*   **Create Study Guides:** Instantly generate a comprehensive study guide from any document, complete with main topics, key term definitions, and potential exam questions.

## 3. How It's Useful

Knowable.AI helps students study smarter, not harder. It provides a significant advantage by:
*   **Saving Time:** Automates the tedious process of summarizing content and creating study materials.
*   **Focusing Revision:** AI-driven analysis helps pinpoint the most crucial topics, ensuring study time is spent effectively.
*   **Deepening Understanding:** Interactive chat and quizzes promote active recall and a more profound grasp of the subject matter.
*   **Reducing Stress:** Provides students with the tools and confidence they need to feel prepared and in control of their academic success.

## 4. Tech Stack

This project is a full-stack application composed of a modern frontend, a robust Java backend, a relational database, and cutting-edge AI services.

### Frontend (Hosted on Vercel)
*   **Framework:** Next.js 15 (with App Router)
*   **Language:** React (with JSX)
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN UI
*   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
*   **AI Integration:** Genkit for Next.js

### Backend (Hosted on Render via Docker)
*   **Framework:** Spring Boot 3
*   **Language:** Java 17
*   **API:** RESTful APIs with Spring Web
*   **Database ORM:** Spring Data JPA (Hibernate)
*   **Security:** Spring Security (JWT for stateless authentication)

### Database (Hosted on Render)
*   **Database:** PostgreSQL
*   **Type:** Relational Database Management System (RDBMS)

### AI & Generative Services
*   **Provider:** Google AI Platform
*   **Model:** Gemini 2.0 Flash
*   **Toolkit:** Google Genkit (for defining AI flows and prompts)

## 5. Project Structure

The frontend monorepo is organized as follows:
```
/src
├── app/                  # Next.js App Router: pages and routes
├── ai/                   # Genkit AI flows and configuration
│   ├── flows/
│   └── genkit.js
├── components/           # Reusable React components (UI, layout, etc.)
│   ├── ui/               # ShadCN UI components
│   └── ...
├── hooks/                # Custom React hooks (e.g., useToast)
├── lib/                  # Utility functions and API helper
└── ...
```

## 6. Local Setup and Deployment

### Environment Variables
To run this project, you will need to set up the following environment variables. Create a `.env.local` file in the root of the frontend project.

```env
# URL for the deployed Spring Boot backend
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Your Google AI API Key for Genkit
GOOGLE_API_KEY=your_google_ai_api_key
```

### Running the Frontend Locally
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

### Deployment
*   The **Frontend** is configured for seamless deployment to **Vercel**. Connect your GitHub repository and Vercel will handle the build process. Ensure you set the `NEXT_PUBLIC_API_URL` and `GOOGLE_API_KEY` environment variables in your Vercel project settings.
*   The **Backend and Database** are containerized with Docker and deployed on **Render**, ensuring a scalable and isolated environment.
