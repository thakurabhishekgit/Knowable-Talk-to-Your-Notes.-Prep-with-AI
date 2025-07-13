package com.Knowable.Backend.repository;

import com.Knowable.Backend.Model.QuestionSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionSessionRepository extends JpaRepository<QuestionSession, Long> {
    List<QuestionSession> findByDocumentId(Long documentId);
}
