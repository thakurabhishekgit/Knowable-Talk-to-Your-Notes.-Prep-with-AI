package com.Knowable.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.Workspace;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    // Additional query methods can be defined here if needed

}
