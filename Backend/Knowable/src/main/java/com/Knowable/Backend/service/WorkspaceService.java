package com.Knowable.Backend.service;

import com.Knowable.Backend.dto.WorkspaceDTO;
import com.Knowable.Backend.Model.Workspace;

import java.util.List;

public interface WorkspaceService {
    Workspace createWorkspace(Long userId, WorkspaceDTO workspaceDTO);

    void deleteWorkspace(Long userId, Long workspaceId);

    List<Workspace> getWorkspacesByUser(Long userId);
}