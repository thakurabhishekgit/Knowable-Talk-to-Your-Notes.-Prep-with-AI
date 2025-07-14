package com.Knowable.Backend.service.impl;

import com.Knowable.Backend.Model.User;
import com.Knowable.Backend.Model.Workspace;
import com.Knowable.Backend.dto.WorkspaceDTO;
import com.Knowable.Backend.repository.UserRepository;
import com.Knowable.Backend.repository.WorkspaceRepository;
import com.Knowable.Backend.service.WorkspaceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository, UserRepository userRepository) {
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Workspace createWorkspace(Long userId, WorkspaceDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Workspace workspace = Workspace.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return workspaceRepository.save(workspace);
    }

    @Override
    public void deleteWorkspace(Long userId, Long workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        if (!workspace.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this workspace");
        }

        workspaceRepository.delete(workspace);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Workspace> getWorkspacesByUser(Long userId) {
        return workspaceRepository.findAllByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Workspace getWorkspaceById(Long workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
    }
}
