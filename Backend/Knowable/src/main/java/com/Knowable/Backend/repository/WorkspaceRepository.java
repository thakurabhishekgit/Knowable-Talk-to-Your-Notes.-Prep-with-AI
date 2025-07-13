package com.Knowable.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.Workspace;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    List<Workspace> findAllByUserId(Long userId);
    // Additional query methods can be defined here if needed

}
