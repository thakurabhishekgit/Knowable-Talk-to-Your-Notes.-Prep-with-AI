package com.Knowable.Backend.service;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.dto.DocumentDTO;

public interface DocumentService {
    Document createDocument(Long workspaceId, DocumentDTO documentDTO);

    void deleteDocument(Long documentId);
}
