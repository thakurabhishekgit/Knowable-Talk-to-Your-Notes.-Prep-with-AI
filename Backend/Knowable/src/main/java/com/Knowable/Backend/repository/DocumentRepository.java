package com.Knowable.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.Document;
import com.Knowable.Backend.Model.Workspace;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    Iterable<Document> findByWorkspace(Workspace workspace);

}
