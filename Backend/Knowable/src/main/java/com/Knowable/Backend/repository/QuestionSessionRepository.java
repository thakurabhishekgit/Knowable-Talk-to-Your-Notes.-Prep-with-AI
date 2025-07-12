package com.Knowable.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.QuestionSession;

public interface QuestionSessionRepository extends JpaRepository<QuestionSession, Long> {
    // Additional query methods can be defined here if needed

}
