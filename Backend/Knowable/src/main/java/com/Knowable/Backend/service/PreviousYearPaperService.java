package com.Knowable.Backend.service;

import com.Knowable.Backend.Model.PreviousYearPaper;
import com.Knowable.Backend.dto.PreviousYearPaperDTO;

import java.util.List;

public interface PreviousYearPaperService {
    PreviousYearPaper uploadPreviousYearPaper(Long documentId, PreviousYearPaperDTO dto);

    List<PreviousYearPaper> getAllPapersForDocument(Long documentId);
}
