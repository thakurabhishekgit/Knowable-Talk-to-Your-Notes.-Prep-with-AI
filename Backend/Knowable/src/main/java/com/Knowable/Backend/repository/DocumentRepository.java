package com.Knowable.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    // Additional query methods can be defined here if needed

}
