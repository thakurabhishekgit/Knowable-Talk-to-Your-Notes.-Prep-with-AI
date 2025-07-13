package com.Knowable.Backend.service.impl;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.Model.QuestionSession;
import com.Knowable.Backend.dto.QuestionSessionDTO;
import com.Knowable.Backend.repository.DocumentRepository;
import com.Knowable.Backend.repository.QuestionSessionRepository;
import com.Knowable.Backend.service.QuestionSessionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuestionSessionServiceImpl implements QuestionSessionService {

    private final QuestionSessionRepository questionSessionRepository;
    private final DocumentRepository documentRepository;

    public QuestionSessionServiceImpl(QuestionSessionRepository questionSessionRepository,
            DocumentRepository documentRepository) {
        this.questionSessionRepository = questionSessionRepository;
        this.documentRepository = documentRepository;
    }

    @Override
    public QuestionSession askQuestion(Long documentId, QuestionSessionDTO dto) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        QuestionSession session = QuestionSession.builder()
                .question(dto.getQuestion())
                .answer(dto.getAnswer()) // or generate using logic/AI
                .createdAt(LocalDateTime.now())
                .document(document)
                .build();

        return questionSessionRepository.save(session);
    }

    @Override
    public List<QuestionSession> getQuestionsForDocument(Long documentId) {
        return questionSessionRepository.findByDocumentId(documentId);
    }
}
