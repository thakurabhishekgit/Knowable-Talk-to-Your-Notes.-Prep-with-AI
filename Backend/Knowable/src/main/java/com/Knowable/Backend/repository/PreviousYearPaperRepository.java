package com.Knowable.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.PreviousYearPaper;

public interface PreviousYearPaperRepository extends JpaRepository<PreviousYearPaper, Long> {
    // Additional query methods can be defined here if needed
    List<PreviousYearPaper> findByDocumentId(Long documentId);
}
