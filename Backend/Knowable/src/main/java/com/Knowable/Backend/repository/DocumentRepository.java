package com.Knowable.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.Model.Workspace;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAllByWorkspace(Workspace workspace);

    List<Document> findAllByWorkspaceId(Long workspaceId);

}
