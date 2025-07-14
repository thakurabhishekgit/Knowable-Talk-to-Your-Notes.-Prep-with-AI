package com.Knowable.Backend.service.impl;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.Model.Workspace;
import com.Knowable.Backend.dto.DocumentDTO;
import com.Knowable.Backend.repository.DocumentRepository;
import com.Knowable.Backend.repository.WorkspaceRepository;
import com.Knowable.Backend.service.CloudinaryService;
import com.Knowable.Backend.service.DocumentService;
import com.Knowable.Backend.service.PdfExtractionService;
import org.apache.tika.Tika;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final WorkspaceRepository workspaceRepository;
    private final CloudinaryService cloudinaryService;
    private final PdfExtractionService pdfExtractionService;
    private final Tika tika = new Tika();

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            WorkspaceRepository workspaceRepository,
            CloudinaryService cloudinaryService,
            PdfExtractionService pdfExtractionService) {
        this.documentRepository = documentRepository;
        this.workspaceRepository = workspaceRepository;
        this.cloudinaryService = cloudinaryService;
        this.pdfExtractionService = pdfExtractionService;
    }

    @Override
    public Document createDocument(Long workspaceId, DocumentDTO dto) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        String fileUrl;
        String fileType;
        String extractedText = "";

        try {
            // Upload file
            fileUrl = cloudinaryService.uploadFile(dto.getFile());
            fileType = tika.detect(dto.getFile().getInputStream());

            // Extract text from uploaded URL
            System.out.println(fileUrl);
            extractedText = pdfExtractionService.extractTextFromCloudinary(fileUrl);

        } catch (IOException e) {
            throw new RuntimeException("Error while processing document", e);
        }

        Document document = Document.builder()
                .title(dto.getTitle())
                .fileUrl(fileUrl)
                .fileType(fileType)
                .textExtracted(extractedText)
                .uploadedAt(LocalDateTime.now())
                .workspace(workspace)
                .build();

        return documentRepository.save(document);
    }

    @Override
    public void deleteDocument(Long documentId) {
        if (!documentRepository.existsById(documentId)) {
            throw new RuntimeException("Document not found");
        }
        documentRepository.deleteById(documentId);
    }

    @Override
    public Document getDocumentByWorkspace(Long workspaceId, Long documentId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getWorkspace().getId().equals(workspace.getId())) {
            throw new RuntimeException("Document does not belong to this workspace");
        }

        return document;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> getDocumentsByWorkspace(Long workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        return documentRepository.findAllByWorkspace(workspace);
    }

}
