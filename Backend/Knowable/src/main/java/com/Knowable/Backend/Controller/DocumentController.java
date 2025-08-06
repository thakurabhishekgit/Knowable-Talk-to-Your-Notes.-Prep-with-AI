package com.Knowable.Backend.Controller;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.dto.DocumentDTO;
import com.Knowable.Backend.dto.DocumentResponseDTO;
import com.Knowable.Backend.service.DocumentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/workspace/{workspaceId}")
    public ResponseEntity<Document> uploadDocument(
            @PathVariable Long workspaceId,
            @RequestPart("file") MultipartFile file,
            @RequestPart("title") String title) {

        DocumentDTO dto = new DocumentDTO();
        dto.setTitle(title);
        dto.setFile(file);

        Document savedDoc = documentService.createDocument(workspaceId, dto);
        return ResponseEntity.ok(savedDoc);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok("Document deleted successfully");
    }

    @GetMapping("/workspace/{workspaceId}/document/{documentId}")
    public ResponseEntity<Document> getDocument(
            @PathVariable Long workspaceId,
            @PathVariable Long documentId) {

        Document document = documentService.getDocumentByWorkspace(workspaceId, documentId);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/workspace/{workspaceId}/documents")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByWorkspace(@PathVariable Long workspaceId) {
        List<DocumentResponseDTO> documents = documentService.getDocumentsByWorkspace(workspaceId);
        return ResponseEntity.ok(documents);
    }

}
