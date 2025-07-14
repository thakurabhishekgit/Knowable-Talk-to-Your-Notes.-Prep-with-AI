package com.Knowable.Backend.service;

import java.util.List;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.dto.DocumentDTO;

public interface DocumentService {
    Document createDocument(Long workspaceId, DocumentDTO documentDTO);

    Document getDocumentByWorkspace(Long workspaceId, Long documentId);

    void deleteDocument(Long documentId);

    List<Document> getDocumentsByWorkspace(Long workspaceId);
}
