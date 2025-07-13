package com.Knowable.Backend.service.impl;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.Model.PreviousYearPaper;
import com.Knowable.Backend.dto.PreviousYearPaperDTO;
import com.Knowable.Backend.repository.DocumentRepository;
import com.Knowable.Backend.repository.PreviousYearPaperRepository;
import com.Knowable.Backend.service.CloudinaryService;
import com.Knowable.Backend.service.PdfExtractionService;
import com.Knowable.Backend.service.PreviousYearPaperService;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PreviousYearPaperServiceImpl implements PreviousYearPaperService {

    private final PreviousYearPaperRepository previousYearPaperRepository;
    private final DocumentRepository documentRepository;
    private final CloudinaryService cloudinaryService;
    private final PdfExtractionService pdfExtractionService;
    private final Tika tika = new Tika();

    public PreviousYearPaperServiceImpl(
            PreviousYearPaperRepository previousYearPaperRepository,
            DocumentRepository documentRepository,
            CloudinaryService cloudinaryService,
            PdfExtractionService pdfExtractionService) {
        this.previousYearPaperRepository = previousYearPaperRepository;
        this.documentRepository = documentRepository;
        this.cloudinaryService = cloudinaryService;
        this.pdfExtractionService = pdfExtractionService;
    }

    @Override
    public PreviousYearPaper uploadPreviousYearPaper(Long documentId, PreviousYearPaperDTO dto) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        String fileUrl;
        String extractedText = "";

        try {
            fileUrl = cloudinaryService.uploadFile(dto.getFile());
            extractedText = pdfExtractionService.extractTextFromCloudinary(fileUrl);
        } catch (IOException e) {
            throw new RuntimeException("Error while uploading or extracting text", e);
        }

        PreviousYearPaper paper = PreviousYearPaper.builder()
                .subjectName(dto.getSubjectName())
                .fileUrl(fileUrl)
                .textExtracted(extractedText)
                .uploadedAt(LocalDateTime.now())
                .document(document)
                .build();

        return previousYearPaperRepository.save(paper);
    }

    @Override
    public List<PreviousYearPaper> getAllPapersForDocument(Long documentId) {
        return previousYearPaperRepository.findByDocumentId(documentId);
    }
}
