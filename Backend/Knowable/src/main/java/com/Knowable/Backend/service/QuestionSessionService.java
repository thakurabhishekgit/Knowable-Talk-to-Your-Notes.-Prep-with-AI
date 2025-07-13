package com.Knowable.Backend.service;

import com.Knowable.Backend.Model.QuestionSession;
import com.Knowable.Backend.dto.QuestionSessionDTO;

import java.util.List;

public interface QuestionSessionService {
    QuestionSession askQuestion(Long documentId, QuestionSessionDTO dto);

    List<QuestionSession> getQuestionsForDocument(Long documentId);
}
